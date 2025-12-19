import { GoogleGenAI } from "@google/genai";
import { VideoFile } from "../types";

const MAX_FILE_SIZE_BYTES = 19 * 1024 * 1024; // Limit client-side base64 to ~19MB to be safe

export const checkFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE_BYTES;
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // remove data:video/mp4;base64, part
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.readAsDataURL(file);
  });
  
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

export const analyzeVideo = async (
  videos: VideoFile[],
  prompt: string,
  systemInstruction: string,
  modelName: string
) => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set it in your environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepare contents
  const videoParts = await Promise.all(videos.map(v => fileToGenerativePart(v.file)));
  
  // Construct the prompt content array
  const contents = [
    ...videoParts,
    { text: prompt }
  ];

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: contents
      },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4, // Lower temperature for more analytical/factual output
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};