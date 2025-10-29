
import { GoogleGenAI, Type } from "@google/genai";
import { SlideElement } from '../types';
import { v4 as uuidv4 } from 'uuid';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // Here we assume it's set in the environment.
  console.warn("Gemini API key not found. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateSlideContent = async (topic: string): Promise<SlideElement[]> => {
  if (!API_KEY) {
    throw new Error("API key is not configured.");
  }
  
  const prompt = `Generate content for a presentation slide about "${topic}". Provide a title and three key bullet points. The slide width is 1000px and height is 562.5px. Place the title near the top and bullet points below it. Format the response as a JSON object with a single key "elements" which is an array of objects. Each object should have type ('text'), x, y, width, height, content, and a style object with fontSize, fontWeight, and textAlign.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            elements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  width: { type: Type.NUMBER },
                  height: { type: Type.NUMBER },
                  content: { type: Type.STRING },
                  style: {
                    type: Type.OBJECT,
                    properties: {
                      fontSize: { type: Type.STRING },
                      fontWeight: { type: Type.STRING },
                      textAlign: { type: Type.STRING },
                    }
                  }
                }
              }
            }
          }
        },
      },
    });

    const jsonString = response.text;
    const data = JSON.parse(jsonString);

    if (data.elements && Array.isArray(data.elements)) {
      return data.elements.map((el: any) => ({
        ...el,
        id: uuidv4(),
        rotation: 0,
        style: {
            ...el.style,
            color: '#000000',
        }
      }));
    }
    return [];

  } catch (error) {
    console.error("Error generating slide content with Gemini:", error);
    throw new Error("Failed to generate content. Please check your prompt or API key.");
  }
};
