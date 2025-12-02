import { GoogleGenAI } from '@google/genai';
import { BaseImageProvider } from '../base-provider';
import type { GeminiProviderConfig, ImageGenerationInput, ImageGenerationResult, ImageProviderType } from '../types';

/**
 * Google Gemini Image Generation Provider
 * Uses Gemini's native image generation capabilities
 */
export class GeminiProvider extends BaseImageProvider {
  readonly name: ImageProviderType = 'gemini';
  readonly displayName = 'Google Gemini';
  readonly availableModels = ['gemini-2.0-flash-preview-image-generation'];
  
  private client: GoogleGenAI | null = null;
  
  constructor(config?: Partial<GeminiProviderConfig>) {
    super({
      apiKey: config?.apiKey || process.env.GEMINI_API_KEY || '',
      defaultModel: config?.defaultModel || 'gemini-2.0-flash-preview-image-generation',
      ...config,
    });
    
    if (this.config.apiKey) {
      this.client = new GoogleGenAI({ apiKey: this.config.apiKey });
    }
  }
  
  isConfigured(): boolean {
    return !!this.config.apiKey && !!this.client;
  }
  
  async generateImage(input: ImageGenerationInput): Promise<ImageGenerationResult> {
    if (!this.isConfigured() || !this.client) {
      return {
        success: false,
        error: 'Gemini provider is not configured. Please set GEMINI_API_KEY.',
      };
    }
    
    try {
      const enhancedPrompt = this.buildEnhancedPrompt(input);
      const model = input.model || this.config.defaultModel || 'gemini-2.0-flash-preview-image-generation';
      
      console.log(`[Gemini] Generating image with model: ${model}`);
      console.log(`[Gemini] Enhanced prompt: ${enhancedPrompt}`);
      
      // Build parts array with text and optional images
      const parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [
        { text: enhancedPrompt }
      ];
      
      // Add product image if provided
      if (input.productImage) {
        parts.push(this.base64ToInlineData(input.productImage));
      }
      
      // Add presenter image if provided
      if (input.presenterImage) {
        parts.push(this.base64ToInlineData(input.presenterImage));
      }
      
      const response = await this.client.models.generateContent({
        model,
        contents: { parts },
        config: {
          responseModalities: ['Text', 'Image'],
        },
      });
      
      // Extract image from response
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          return {
            success: true,
            image: imageData,
            providerMetadata: {
              provider: this.name,
              model,
            },
          };
        }
      }
      
      return {
        success: false,
        error: 'No image generated from Gemini',
      };
    } catch (error) {
      console.error('[Gemini] Generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Gemini generation failed: ${errorMessage}`,
      };
    }
  }
  
  /**
   * Convert base64 to inline data format for Gemini
   */
  private base64ToInlineData(base64String: string): { inlineData: { data: string; mimeType: string } } {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const mimeType = base64String.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/png';
    return {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    };
  }
}
