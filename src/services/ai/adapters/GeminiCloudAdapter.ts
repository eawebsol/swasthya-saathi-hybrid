import { IModelAdapter, ModelCompletionRequest, MultimodalCompletionRequest, ModelCompletionResponse } from '../types';

export class GeminiCloudAdapter implements IModelAdapter {
  public readonly providerId = 'google_vertex_ai';
  public readonly modelName = 'Gemini 2.0 Flash (Cloud)';
  public readonly isLocal = false;
  private apiKey: string = '';

  constructor(apiKey?: string) {
    this.apiKey = apiKey 
      || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY)
      || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('swasthya_gemini_api_key'))
      || (typeof localStorage !== 'undefined' && localStorage.getItem('swasthya_gemini_api_key'))
      || '';
  }

  public setApiKey(key: string) {
    this.apiKey = key;
    // Prefer ephemeral sessionStorage to prevent indefinite on-disk key persistence
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('swasthya_gemini_api_key', key);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('swasthya_gemini_api_key');
    }
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public async isAvailable(): Promise<boolean> {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    return isOnline && Boolean(this.apiKey);
  }

  public async complete(request: ModelCompletionRequest): Promise<ModelCompletionResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API Key is not configured. Set VITE_GEMINI_API_KEY or configure in settings.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;

    const promptText = request.systemPrompt
      ? `${request.systemPrompt}\n\n${request.prompt}`
      : request.prompt;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: request.temperature ?? 0.2,
          maxOutputTokens: request.maxTokens ?? 1024
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini Cloud API error: HTTP ${res.status}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const tokenCountEstimated = Math.ceil(text.length / 4);

    return {
      text,
      tokenCountEstimated,
      finishReason: data.candidates?.[0]?.finishReason,
      rawResponse: data
    };
  }

  public async completeMultimodal(request: MultimodalCompletionRequest): Promise<ModelCompletionResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API Key is not configured for Multimodal Vision.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
    const cleanBase64 = request.imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              inline_data: {
                mime_type: request.mimeType,
                data: cleanBase64
              }
            },
            { text: request.prompt }
          ]
        }],
        generationConfig: {
          temperature: request.temperature ?? 0.1,
          maxOutputTokens: request.maxTokens ?? 1024
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini Multimodal API error: HTTP ${res.status}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      text,
      tokenCountEstimated: Math.ceil(text.length / 4),
      finishReason: data.candidates?.[0]?.finishReason,
      rawResponse: data
    };
  }
}
