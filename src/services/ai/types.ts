import { SupportedLanguage, Vitals, SymptomAssessment, TriageResult, LabReportResult } from '../../types/medical';

export interface ModelCompletionRequest {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface MultimodalCompletionRequest {
  prompt: string;
  imageBase64: string;
  mimeType: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ModelCompletionResponse {
  text: string;
  tokenCountEstimated?: number;
  finishReason?: string;
  rawResponse?: any;
}

export interface InferenceTelemetry {
  traceId: string;
  timestamp: string;
  provider: string;
  modelName: string;
  isLocal: boolean;
  latencyMs: number;
  dataEgressBytes: number;
  inputTokensEstimated: number;
  outputTokensEstimated: number;
  validationPassed: boolean;
  fallbackTriggered: boolean;
  errorMessage?: string;
}

export interface IModelAdapter {
  readonly providerId: string;
  readonly modelName: string;
  readonly isLocal: boolean;

  /**
   * Check if this model provider is currently available and ready
   */
  isAvailable(): Promise<boolean>;

  /**
   * Generate text completion
   */
  complete(request: ModelCompletionRequest): Promise<ModelCompletionResponse>;

  /**
   * Optional multimodal image/vision completion
   */
  completeMultimodal?(request: MultimodalCompletionRequest): Promise<ModelCompletionResponse>;
}
