import { GoogleGenAI } from "@google/genai";

// Initialize the client strictly using the provided environment variable
// Note: In a real scenario, ensure process.env.API_KEY is defined in your bundler config
const apiKey = process.env.API_KEY || 'mock-key-for-ui-dev';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generate story ideas based on a simple prompt.
 * Uses the Flash model for speed.
 */
export const generateStoryIdea = async (prompt: string): Promise<string> => {
  if (apiKey === 'mock-key-for-ui-dev') {
    return new Promise(resolve => setTimeout(() => resolve(`(Mock AI) A story about ${prompt} featuring a brave protagonist...`), 1000));
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, creative story concept based on: ${prompt}`,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Enhance a text block description.
 */
export const enhanceText = async (currentText: string): Promise<string> => {
   if (apiKey === 'mock-key-for-ui-dev') {
    return new Promise(resolve => setTimeout(() => resolve(`${currentText} (Enhanced by AI)`), 800));
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Rewrite the following text to be more engaging for a storybook: "${currentText}"`,
    });
    return response.text || currentText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return currentText;
  }
}