import { GenerateTextParams, IAIProvider } from "./IAIProvider";

export class AIService {
  constructor(private aiProvider: IAIProvider) {
    this.aiProvider = aiProvider;
  }

  async generateText(params: GenerateTextParams) {
    return await this.aiProvider.generateText(params);
  }
}
