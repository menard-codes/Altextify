export class GeminiFailedGeneratingText extends Error {
  constructor(message = "Failed generating text content.") {
    super(message);
    this.name = "GeminiFailedGeneratingText";
  }
}
