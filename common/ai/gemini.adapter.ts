import { GeminiFailedGeneratingText } from "./gemini-errors";
import { GenerateTextParams, IAIProvider } from "./IAIProvider";
import { GoogleGenAI } from "@google/genai";

export class GeminiAdapter implements IAIProvider {
  private geminiAi: GoogleGenAI;

  constructor() {
    this.geminiAi = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async generateText({
    prompt,
    systemPrompt,
    media,
    model,
    config,
  }: GenerateTextParams) {
    const response = await this.geminiAi.models.generateContent({
      model,
      contents: [
        {
          text: prompt,
        },
        ...(media && media.length > 0
          ? media.map(({ base64, mimeType }) => ({
              inlineData: {
                mimeType,
                data: base64,
              },
            }))
          : []),
      ],
      config: {
        ...config,
        systemInstruction: systemPrompt,
      },
    });

    if (!response.text) {
      throw new GeminiFailedGeneratingText();
    }

    return response.text;
  }
}
