import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeNewsArticle = async (title: string, content: string): Promise<string> => {
  try {
    const prompt = `
      You are an advanced AI news analyst in a futuristic cyberpunk world.
      
      Task: Summarize the following news article.
      Style: Concise, technical, bullet-pointed, and engaging. Limit to 3 key takeaways.
      
      News Title: ${title}
      News Content: ${content}
      
      Format the output as plain text with bullet points (•).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Fast response
      }
    });

    return response.text || "No summary available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Analysis protocol failed. Unable to retrieve summary.";
  }
};
