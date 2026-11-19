import { IModelAdapter, ModelCompletionRequest, ModelCompletionResponse } from '../types';

export class LocalProtocolAdapter implements IModelAdapter {
  public readonly providerId = 'local_icmr_protocol_rag';
  public readonly modelName = 'Local ICMR/WHO Protocol Enclave';
  public readonly isLocal = true;

  public async isAvailable(): Promise<boolean> {
    return true; // Always available on-device
  }

  public async complete(request: ModelCompletionRequest): Promise<ModelCompletionResponse> {
    // Deterministic protocol response based on provided context
    const text = request.prompt;
    return {
      text,
      tokenCountEstimated: Math.ceil(text.length / 4)
    };
  }
}
