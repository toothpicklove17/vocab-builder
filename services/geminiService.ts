import { GoogleGenAI, Type } from "@google/genai";
import type { VocabularyEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const vocabularySchema = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING },
    pronunciation: { type: Type.STRING, description: "Pronunciation in IPA format, e.g., /həˈloʊ/" },
    definition: { type: Type.STRING, description: "A clear and concise definition in English." },
    usage: { type: Type.STRING, description: "An example sentence using the word." },
  },
  required: ["word", "definition", "usage"],
};

function fileToGenerativePart(file: File) {
    return new Promise<{ inlineData: { data: string; mimeType: string; } }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = (reader.result as string).split(',')[1];
            resolve({
                inlineData: {
                    data: result,
                    mimeType: file.type
                }
            });
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

export const geminiService = {
  extractTextFromImage: async (imageFile: File): Promise<string> => {
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const textPart = { text: "Extract all text from this image. Return only the raw text content, with no additional commentary or formatting." };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;

    } catch (error) {
        console.error("Error extracting text from image:", error);
        throw new Error("Failed to read text from image. The file might be corrupted or in an unsupported format.");
    }
  },

  fetchWordDefinition: async (word: string): Promise<VocabularyEntry> => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Please provide a detailed definition for the word: "${word}"`,
        config: {
          systemInstruction: "You are an expert linguist and vocabulary assistant. For the given word, provide a concise definition in English, its pronunciation in IPA format, and a clear example sentence demonstrating its usage. Return the result as a single JSON object, adhering to the provided schema.",
          responseMimeType: "application/json",
          responseSchema: vocabularySchema,
        },
      });

      const jsonStr = response.text.trim();
      const result: VocabularyEntry = JSON.parse(jsonStr);
      return result;

    } catch (error) {
      console.error(`Error fetching definition for "${word}":`, error);
      // Pass the original error message if it's a quota issue
      if (error instanceof Error && error.message.includes('quota')) {
          throw error;
      }
      if (error.toString().includes('RESOURCE_EXHAUSTED')) {
         throw new Error('You exceeded your current quota, please check your plan and billing details.');
      }
      throw new Error(`Failed to get definition for "${word}".`);
    }
  },
};