import { IModelAdapter, ModelCompletionRequest, ModelCompletionResponse } from '../types';

export class ChromeNanoAdapter implements IModelAdapter {
  public readonly providerId = 'chrome_built_in_ai';
  public readonly modelName = 'Gemini Nano (On-Device)';
  public readonly isLocal = true;

  public async isAvailable(): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.ai?.languageModel) {
        const caps = await window.ai.languageModel.capabilities();
        return caps.available === 'readily';
      }
    } catch {
      return false;
    }
    return false;
  }

  public async complete(request: ModelCompletionRequest): Promise<ModelCompletionResponse> {
    if (typeof window === 'undefined' || !window.ai?.languageModel) {
      throw new Error('Chrome Built-in AI (Gemini Nano) is not supported in this runtime.');
    }

    const session = await window.ai.languageModel.create({
      temperature: request.temperature ?? 0.2
    });

    try {
      const fullPrompt = request.systemPrompt
        ? `${request.systemPrompt}\n\n${request.prompt}`
        : request.prompt;

      const text = await session.prompt(fullPrompt);
      return {
        text,
        tokenCountEstimated: Math.ceil(text.length / 4)
      };
    } finally {
      if (session.destroy) {
        session.destroy();
      }
    }
  }
}
