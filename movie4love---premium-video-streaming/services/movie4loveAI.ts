
import { GoogleGenAI, Type } from "@google/genai";
import { AISuggestion } from "../types";

export class Movie4LoveAIService {
  private static instance: Movie4LoveAIService;
  private ai: GoogleGenAI;

  private constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  public static getInstance(): Movie4LoveAIService {
    if (!Movie4LoveAIService.instance) {
      Movie4LoveAIService.instance = new Movie4LoveAIService();
    }
    return Movie4LoveAIService.instance;
  }

  public async suggestMetadata(prompt: string): Promise<AISuggestion> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are Movie4Love AI, a specialized assistant for a premium video streaming platform. Based on the following video description or keywords, suggest a compelling title, a detailed description, relevant tags (max 5), and a category.
      
      User input: ${prompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            category: { type: Type.STRING }
          },
          required: ["title", "description", "tags", "category"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  }
}

export const m4lAI = Movie4LoveAIService.getInstance();
