import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  if (!text || targetLanguage === 'en') return text;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following text to ${targetLanguage}. Return ONLY the translated text, nothing else.\n\nText: ${text}`,
    });

    return response.text || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};
