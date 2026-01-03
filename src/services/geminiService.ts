// Gemini AI Service - Placeholder for future integration
// This will connect to Google Gemini 2.5/3 for story generation

export interface GeminiConfig {
  apiKey?: string;
  model: 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gemini-3-flash';
}

export interface GenerationRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GenerationResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

// Mock implementation for development
export const geminiService = {
  config: {
    model: 'gemini-2.5-flash' as const,
  },

  async generate(request: GenerationRequest): Promise<GenerationResponse> {
    console.log('[GeminiService] Mock generation request:', request.prompt.slice(0, 50) + '...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      text: `[Mock Response] This is a placeholder response for: "${request.prompt.slice(0, 30)}..."`,
      usage: {
        promptTokens: request.prompt.split(' ').length,
        completionTokens: 20,
      }
    };
  },

  async generateImage(prompt: string): Promise<string> {
    console.log('[GeminiService] Mock image generation:', prompt);
    // Return a placeholder image
    return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/400/300`;
  },

  isConfigured(): boolean {
    return false; // Will return true when API key is set
  }
};

export default geminiService;
