export type GenerateTextParams = {
  prompt: string;
  systemPrompt?: string;
  // Base64
  media?: { base64: string; mimeType: string }[];
  model: string;
  config?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
};

export interface IAIProvider {
  generateText(params: GenerateTextParams): Promise<string>;
}
