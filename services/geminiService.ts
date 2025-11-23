import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Extracts text from a base64 encoded image using Gemini 2.5 Flash.
 * 
 * @param base64Data The raw base64 string of the image (without the data URL prefix if possible, but the API handles it).
 * @param mimeType The mime type of the image (e.g., 'image/jpeg').
 * @returns The extracted text.
 */
export const extractTextFromImage = async (base64Data: string, mimeType: string): Promise<string> => {
  try {
    // Clean the base64 string if it contains the data URL prefix
    const cleanBase64 = base64Data.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: "Please perform Optical Character Recognition (OCR) on this image. Extract all visible text exactly as it appears. Preserve line breaks where possible. If there is no text, reply with 'No text detected'."
          }
        ]
      },
      config: {
        temperature: 0.1, // Low temperature for more deterministic/accurate results
      }
    });

    return response.text || "No text returned from model.";
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    throw new Error("Failed to process image. Please check your internet connection and API Key.");
  }
};