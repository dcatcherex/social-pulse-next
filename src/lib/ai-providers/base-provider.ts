import type { ImageGenerationInput, ImageGenerationResult, ImageProvider, ImageProviderType, ProviderConfig } from './types';

/**
 * Abstract base class for image generation providers
 * Provides common functionality like prompt enhancement
 */
export abstract class BaseImageProvider implements ImageProvider {
  abstract readonly name: ImageProviderType;
  abstract readonly displayName: string;
  abstract readonly availableModels: string[];
  
  protected config: ProviderConfig;
  
  constructor(config: ProviderConfig) {
    this.config = config;
  }
  
  abstract isConfigured(): boolean;
  abstract generateImage(input: ImageGenerationInput): Promise<ImageGenerationResult>;
  
  /**
   * Build an enhanced prompt with style modifiers
   * Shared implementation that can be overridden by specific providers
   */
  buildEnhancedPrompt(input: ImageGenerationInput): string {
    const { prompt, cameraAngle, imageStyle, aspectRatio, productImage, presenterImage } = input;
    
    const parts: string[] = [];
    
    // Add context for product/presenter images
    if (productImage && presenterImage) {
      parts.push('Create a professional product advertisement featuring the provided product with the presenter/model');
    } else if (productImage) {
      parts.push('Create a professional product advertisement featuring the provided product');
    } else if (presenterImage) {
      parts.push('Create content featuring the provided presenter/model');
    }
    
    // Add style
    if (imageStyle && imageStyle !== 'photorealistic') {
      const styleMap: Record<string, string> = {
        'digital-art': 'digital art style',
        'anime': 'anime/manga art style',
        'watercolor': 'watercolor painting style',
        'oil-painting': 'oil painting style',
        '3d-render': '3D rendered style',
        'minimalist': 'minimalist clean design',
        'vintage': 'vintage retro style',
        'neon': 'neon cyberpunk style with glowing lights',
      };
      parts.push(styleMap[imageStyle] || imageStyle);
    }
    
    // Add camera angle
    if (cameraAngle && cameraAngle !== 'eye-level') {
      const angleMap: Record<string, string> = {
        'high-angle': 'shot from high angle looking down',
        'low-angle': 'shot from low angle looking up, dramatic',
        'birds-eye': "bird's eye view, top-down perspective",
        'dutch-angle': 'dutch angle, tilted camera',
        'close-up': 'extreme close-up shot',
        'wide-shot': 'wide establishing shot',
      };
      parts.push(angleMap[cameraAngle] || cameraAngle);
    }
    
    // Add aspect ratio hint
    if (aspectRatio) {
      const ratioMap: Record<string, string> = {
        '1:1': 'square composition',
        '4:5': 'vertical portrait composition',
        '9:16': 'tall vertical composition for mobile',
        '16:9': 'wide cinematic composition',
        '3:4': 'portrait composition',
        '4:3': 'landscape composition',
      };
      if (ratioMap[aspectRatio]) {
        parts.push(ratioMap[aspectRatio]);
      }
    }
    
    // Combine
    if (parts.length > 0) {
      return `${prompt}, ${parts.join(', ')}`;
    }
    return prompt;
  }
  
  /**
   * Convert aspect ratio string to dimensions
   */
  protected getAspectRatioDimensions(aspectRatio: string): { width: number; height: number } {
    const ratioMap: Record<string, { width: number; height: number }> = {
      '1:1': { width: 1024, height: 1024 },
      '4:5': { width: 1024, height: 1280 },
      '9:16': { width: 768, height: 1344 },
      '16:9': { width: 1344, height: 768 },
      '3:4': { width: 896, height: 1152 },
      '4:3': { width: 1152, height: 896 },
    };
    return ratioMap[aspectRatio] || { width: 1024, height: 1024 };
  }
}
