/**
 * AI Image Provider Types
 * Common interfaces for all image generation providers
 */

export type ImageProviderType = 'gemini' | 'kie-ai' | 'openai';

export interface ImageGenerationInput {
  prompt: string;
  aspectRatio?: string;
  cameraAngle?: string;
  imageStyle?: string;
  imageCount?: number;
  model?: string;
  /** Base64 encoded product image for editing/reference */
  productImage?: string;
  /** Base64 encoded presenter image for editing/reference */
  presenterImage?: string;
}

export interface ImageGenerationResult {
  success: boolean;
  /** Base64 data URL of the generated image */
  image?: string;
  /** URL of the generated image (for providers that return URLs) */
  imageUrl?: string;
  /** Error message if generation failed */
  error?: string;
  /** Provider-specific metadata */
  providerMetadata?: Record<string, unknown>;
}

export interface ProviderConfig {
  apiKey: string;
  /** Default model to use if not specified in request */
  defaultModel?: string;
  /** Base URL override for the API */
  baseUrl?: string;
  /** Additional provider-specific options */
  options?: Record<string, unknown>;
}

export interface ImageProvider {
  /** Unique identifier for this provider */
  readonly name: ImageProviderType;
  
  /** Human-readable display name */
  readonly displayName: string;
  
  /** List of available models for this provider */
  readonly availableModels: string[];
  
  /** Check if the provider is properly configured */
  isConfigured(): boolean;
  
  /** Generate an image from the given input */
  generateImage(input: ImageGenerationInput): Promise<ImageGenerationResult>;
  
  /** Build an enhanced prompt with style modifiers */
  buildEnhancedPrompt(input: ImageGenerationInput): string;
}

// Provider-specific configurations
export interface GeminiProviderConfig extends ProviderConfig {
  defaultModel?: 'gemini-2.0-flash-preview-image-generation';
}

export interface KieAiProviderConfig extends ProviderConfig {
  defaultModel?: 'google/nano-banana' | 'flux-kontext-pro' | 'flux-kontext-max' | 'gpt4o-image';
  /** Polling interval in ms for async tasks */
  pollingInterval?: number;
  /** Max wait time in ms for async tasks */
  maxWaitTime?: number;
}

export interface OpenAiProviderConfig extends ProviderConfig {
  defaultModel?: 'dall-e-3' | 'dall-e-2';
}

// Union type for all provider configs
export type AnyProviderConfig = GeminiProviderConfig | KieAiProviderConfig | OpenAiProviderConfig;
