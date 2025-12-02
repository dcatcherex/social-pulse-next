/**
 * AI Image Provider System
 * 
 * A flexible provider pattern for image generation supporting multiple AI services.
 * 
 * Usage:
 * ```typescript
 * import { getImageProvider, createImageProvider } from '@/lib/ai-providers';
 * 
 * // Get the default configured provider
 * const provider = getImageProvider();
 * 
 * // Or create a specific provider
 * const gemini = createImageProvider('gemini');
 * const kieAi = createImageProvider('kie-ai');
 * 
 * // Generate an image
 * const result = await provider.generateImage({
 *   prompt: 'A beautiful sunset over mountains',
 *   aspectRatio: '16:9',
 * });
 * ```
 */

export * from './types';
export * from './config';

import { GeminiProvider } from './providers/gemini';
import { KieAiProvider } from './providers/kie-ai';
import { loadProviderConfig, isProviderConfigured } from './config';
import type { ImageProvider, ImageProviderType, ImageGenerationInput, ImageGenerationResult } from './types';

// Provider registry
const providerRegistry = new Map<ImageProviderType, () => ImageProvider>([
  ['gemini', () => new GeminiProvider()],
  ['kie-ai', () => new KieAiProvider()],
  // ['openai', () => new OpenAiProvider()], // Future
]);

// Cached provider instances
const providerCache: Map<ImageProviderType, ImageProvider> = new Map();

/**
 * Create a new instance of a specific provider
 */
export function createImageProvider(type: ImageProviderType): ImageProvider {
  const factory = providerRegistry.get(type);
  if (!factory) {
    throw new Error(`Unknown image provider: ${type}`);
  }
  return factory();
}

/**
 * Get a cached instance of a specific provider
 */
export function getImageProviderInstance(type: ImageProviderType): ImageProvider {
  let provider = providerCache.get(type);
  if (!provider) {
    provider = createImageProvider(type);
    providerCache.set(type, provider);
  }
  return provider;
}

/**
 * Get the primary configured image provider
 */
export function getImageProvider(): ImageProvider {
  const config = loadProviderConfig();
  return getImageProviderInstance(config.primary);
}

/**
 * Get the fallback image provider (if configured)
 */
export function getFallbackProvider(): ImageProvider | null {
  const config = loadProviderConfig();
  if (!config.fallback || !isProviderConfigured(config.fallback)) {
    return null;
  }
  return getImageProviderInstance(config.fallback);
}

/**
 * Generate an image using the configured provider with optional fallback
 */
export async function generateImage(input: ImageGenerationInput): Promise<ImageGenerationResult> {
  const primaryProvider = getImageProvider();
  
  // Check if primary provider is configured
  if (!primaryProvider.isConfigured()) {
    const fallback = getFallbackProvider();
    if (fallback?.isConfigured()) {
      console.log(`[ImageProvider] Primary provider ${primaryProvider.name} not configured, using fallback ${fallback.name}`);
      return fallback.generateImage(input);
    }
    return {
      success: false,
      error: `No configured image provider. Please set up ${primaryProvider.name} or a fallback provider.`,
    };
  }
  
  // Try primary provider
  const result = await primaryProvider.generateImage(input);
  
  // If failed, try fallback
  if (!result.success) {
    const fallback = getFallbackProvider();
    if (fallback?.isConfigured()) {
      console.log(`[ImageProvider] Primary provider ${primaryProvider.name} failed, trying fallback ${fallback.name}`);
      return fallback.generateImage(input);
    }
  }
  
  return result;
}

/**
 * Get information about all available providers
 */
export function getAvailableProviders(): Array<{
  type: ImageProviderType;
  name: string;
  configured: boolean;
  models: string[];
}> {
  const result: Array<{
    type: ImageProviderType;
    name: string;
    configured: boolean;
    models: string[];
  }> = [];
  
  for (const [type] of providerRegistry) {
    const provider = getImageProviderInstance(type);
    result.push({
      type,
      name: provider.displayName,
      configured: provider.isConfigured(),
      models: provider.availableModels,
    });
  }
  
  return result;
}

// Re-export provider classes for direct usage
export { GeminiProvider } from './providers/gemini';
export { KieAiProvider } from './providers/kie-ai';
