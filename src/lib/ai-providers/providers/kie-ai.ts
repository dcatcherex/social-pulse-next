import { BaseImageProvider } from '../base-provider';
import type { ImageGenerationInput, ImageGenerationResult, ImageProviderType, KieAiProviderConfig } from '../types';

interface KieAiTaskResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
  };
}

interface KieAiRecordResponse {
  code: number;
  msg: string;
  data: {
    successFlag: number; // 0: in progress, 1: completed, 2: failed
    progress?: string;
    errorMessage?: string;
    response?: {
      result_urls?: string[];
    };
  };
}

type KieAiModel = 'google/nano-banana' | 'flux-kontext-pro' | 'flux-kontext-max' | 'gpt4o-image';

/**
 * Kie.ai Image Generation Provider
 * Supports multiple models including nano-banana (Gemini), Flux, and GPT-4o
 */
export class KieAiProvider extends BaseImageProvider {
  readonly name: ImageProviderType = 'kie-ai';
  readonly displayName = 'Kie.ai';
  readonly availableModels: KieAiModel[] = [
    'google/nano-banana',
    'flux-kontext-pro',
    'flux-kontext-max',
    'gpt4o-image',
  ];
  
  private baseUrl = 'https://api.kie.ai/api/v1';
  private pollingInterval: number;
  private maxWaitTime: number;
  
  constructor(config?: Partial<KieAiProviderConfig>) {
    super({
      apiKey: config?.apiKey || process.env.KIE_AI_API_KEY || '',
      defaultModel: config?.defaultModel || 'google/nano-banana',
      ...config,
    });
    
    this.pollingInterval = config?.pollingInterval || 5000; // 5 seconds
    this.maxWaitTime = config?.maxWaitTime || 300000; // 5 minutes
  }
  
  isConfigured(): boolean {
    return !!this.config.apiKey;
  }
  
  async generateImage(input: ImageGenerationInput): Promise<ImageGenerationResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Kie.ai provider is not configured. Please set KIE_AI_API_KEY.',
      };
    }
    
    const model = (input.model || this.config.defaultModel || 'google/nano-banana') as KieAiModel;
    
    try {
      // Route to appropriate endpoint based on model
      if (model === 'google/nano-banana') {
        return await this.generateWithNanoBanana(input);
      } else if (model.startsWith('flux-kontext')) {
        return await this.generateWithFluxKontext(input, model);
      } else if (model === 'gpt4o-image') {
        return await this.generateWithGpt4o(input);
      }
      
      return {
        success: false,
        error: `Unsupported model: ${model}`,
      };
    } catch (error) {
      console.error('[Kie.ai] Generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Kie.ai generation failed: ${errorMessage}`,
      };
    }
  }
  
  /**
   * Generate image using Google Nano-Banana (Gemini) via Kie.ai
   */
  private async generateWithNanoBanana(input: ImageGenerationInput): Promise<ImageGenerationResult> {
    const enhancedPrompt = this.buildEnhancedPrompt(input);
    
    console.log(`[Kie.ai/Nano-Banana] Generating image`);
    console.log(`[Kie.ai/Nano-Banana] Enhanced prompt: ${enhancedPrompt}`);
    
    // Map aspect ratio to Kie.ai format
    const aspectRatio = this.mapAspectRatio(input.aspectRatio);
    
    // Build request body
    const body: Record<string, unknown> = {
      prompt: enhancedPrompt,
      aspectRatio,
      outputFormat: 'png',
    };
    
    // Add input images if provided (for editing)
    const inputImages: string[] = [];
    if (input.productImage) {
      const imageUrl = await this.uploadBase64Image(input.productImage);
      if (imageUrl) inputImages.push(imageUrl);
    }
    if (input.presenterImage) {
      const imageUrl = await this.uploadBase64Image(input.presenterImage);
      if (imageUrl) inputImages.push(imageUrl);
    }
    if (inputImages.length > 0) {
      body.inputImages = inputImages;
    }
    
    // Submit task
    const taskResponse = await this.submitTask('/nano-banana/generate', body);
    if (!taskResponse.success) {
      return taskResponse;
    }
    
    // Poll for completion
    return await this.pollForCompletion(taskResponse.taskId!, '/nano-banana/record-info');
  }
  
  /**
   * Generate image using Flux Kontext via Kie.ai
   */
  private async generateWithFluxKontext(input: ImageGenerationInput, model: KieAiModel): Promise<ImageGenerationResult> {
    const enhancedPrompt = this.buildEnhancedPrompt(input);
    
    console.log(`[Kie.ai/Flux] Generating image with model: ${model}`);
    console.log(`[Kie.ai/Flux] Enhanced prompt: ${enhancedPrompt}`);
    
    const body: Record<string, unknown> = {
      prompt: enhancedPrompt,
      model,
      aspectRatio: this.mapAspectRatio(input.aspectRatio),
      outputFormat: 'jpeg',
      promptUpsampling: true,
    };
    
    // Add input images if provided
    if (input.productImage || input.presenterImage) {
      const inputImages: string[] = [];
      if (input.productImage) {
        const imageUrl = await this.uploadBase64Image(input.productImage);
        if (imageUrl) inputImages.push(imageUrl);
      }
      if (input.presenterImage) {
        const imageUrl = await this.uploadBase64Image(input.presenterImage);
        if (imageUrl) inputImages.push(imageUrl);
      }
      if (inputImages.length > 0) {
        body.inputImages = inputImages;
      }
    }
    
    const taskResponse = await this.submitTask('/flux/kontext/generate', body);
    if (!taskResponse.success) {
      return taskResponse;
    }
    
    return await this.pollForCompletion(taskResponse.taskId!, '/flux/kontext/record-info');
  }
  
  /**
   * Generate image using GPT-4o via Kie.ai
   */
  private async generateWithGpt4o(input: ImageGenerationInput): Promise<ImageGenerationResult> {
    const enhancedPrompt = this.buildEnhancedPrompt(input);
    
    console.log(`[Kie.ai/GPT4o] Generating image`);
    console.log(`[Kie.ai/GPT4o] Enhanced prompt: ${enhancedPrompt}`);
    
    const body: Record<string, unknown> = {
      prompt: enhancedPrompt,
      size: this.mapAspectRatioToSize(input.aspectRatio),
      nVariants: input.imageCount || 1,
      isEnhance: true,
    };
    
    // Add input images if provided (for editing)
    if (input.productImage || input.presenterImage) {
      const filesUrl: string[] = [];
      if (input.productImage) {
        const imageUrl = await this.uploadBase64Image(input.productImage);
        if (imageUrl) filesUrl.push(imageUrl);
      }
      if (input.presenterImage) {
        const imageUrl = await this.uploadBase64Image(input.presenterImage);
        if (imageUrl) filesUrl.push(imageUrl);
      }
      if (filesUrl.length > 0) {
        body.filesUrl = filesUrl;
      }
    }
    
    const taskResponse = await this.submitTask('/gpt4o-image/generate', body);
    if (!taskResponse.success) {
      return taskResponse;
    }
    
    return await this.pollForCompletion(taskResponse.taskId!, '/gpt4o-image/record-info');
  }
  
  /**
   * Submit a task to Kie.ai API
   */
  private async submitTask(endpoint: string, body: Record<string, unknown>): Promise<{ success: boolean; taskId?: string; error?: string }> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data: KieAiTaskResponse = await response.json();
    
    if (!response.ok || data.code !== 200) {
      return {
        success: false,
        error: data.msg || `Request failed with status ${response.status}`,
      };
    }
    
    return {
      success: true,
      taskId: data.data.taskId,
    };
  }
  
  /**
   * Poll for task completion
   */
  private async pollForCompletion(taskId: string, recordEndpoint: string): Promise<ImageGenerationResult> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < this.maxWaitTime) {
      const response = await fetch(`${this.baseUrl}${recordEndpoint}?taskId=${taskId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });
      
      const data: KieAiRecordResponse = await response.json();
      
      if (!response.ok || data.code !== 200) {
        return {
          success: false,
          error: data.msg || 'Failed to check task status',
        };
      }
      
      const { successFlag, errorMessage } = data.data;
      
      if (successFlag === 1) {
        // Task completed successfully
        const resultUrls = data.data.response?.result_urls;
        if (resultUrls && resultUrls.length > 0) {
          // Fetch the image and convert to base64
          const imageResult = await this.fetchImageAsBase64(resultUrls[0]);
          if (imageResult) {
            return {
              success: true,
              image: imageResult,
              imageUrl: resultUrls[0],
              providerMetadata: {
                provider: this.name,
                taskId,
                allUrls: resultUrls,
              },
            };
          }
          // If base64 conversion fails, return URL
          return {
            success: true,
            imageUrl: resultUrls[0],
            providerMetadata: {
              provider: this.name,
              taskId,
              allUrls: resultUrls,
            },
          };
        }
        return {
          success: false,
          error: 'No image URLs in response',
        };
      }
      
      if (successFlag === 2) {
        // Task failed
        return {
          success: false,
          error: errorMessage || 'Image generation failed',
        };
      }
      
      // Still in progress, wait and retry
      console.log(`[Kie.ai] Task ${taskId} in progress, waiting...`);
      await this.sleep(this.pollingInterval);
    }
    
    return {
      success: false,
      error: 'Generation timeout',
    };
  }
  
  /**
   * Upload a base64 image to Kie.ai and get a URL
   */
  private async uploadBase64Image(base64String: string): Promise<string | null> {
    try {
      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
      
      const response = await fetch(`${this.baseUrl}/file/upload-base64`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base64Content: base64Data,
          uploadPath: `social-pulse/${Date.now()}`,
        }),
      });
      
      const data = await response.json();
      if (data.code === 200 && data.data?.downloadUrl) {
        return data.data.downloadUrl;
      }
      
      console.error('[Kie.ai] Failed to upload image:', data.msg);
      return null;
    } catch (error) {
      console.error('[Kie.ai] Error uploading image:', error);
      return null;
    }
  }
  
  /**
   * Fetch an image URL and convert to base64 data URL
   */
  private async fetchImageAsBase64(imageUrl: string): Promise<string | null> {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) return null;
      
      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const contentType = response.headers.get('content-type') || 'image/png';
      
      return `data:${contentType};base64,${base64}`;
    } catch (error) {
      console.error('[Kie.ai] Error fetching image:', error);
      return null;
    }
  }
  
  /**
   * Map aspect ratio to Kie.ai format
   */
  private mapAspectRatio(aspectRatio?: string): string {
    const ratioMap: Record<string, string> = {
      '1:1': '1:1',
      '4:5': '4:5',
      '9:16': '9:16',
      '16:9': '16:9',
      '3:4': '3:4',
      '4:3': '4:3',
    };
    return ratioMap[aspectRatio || '1:1'] || '1:1';
  }
  
  /**
   * Map aspect ratio to GPT-4o size format
   */
  private mapAspectRatioToSize(aspectRatio?: string): string {
    // GPT-4o uses aspect ratio as size
    return this.mapAspectRatio(aspectRatio);
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
