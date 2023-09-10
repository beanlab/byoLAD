export interface CompletionModel {
  complete: (
    request: CompletionModelRequest,
  ) => Promise<CompletionModelResponse>;
}

export interface CompletionModelRequest {
  instruction: string;
  code: string;
}

export interface CompletionModelResponse {
  success: boolean;
  errorMessage?: string;
  completion?: string;
}
