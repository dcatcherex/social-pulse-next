import type { ImageProviderType } from './types';

/**
 * AI Provider Configuration
 * 
 * Configure the primary and fallback image generation providers via environment variables:
 * 
 * IMAGE_PROVIDER - Primary provider: 'gemini' | 'kie-ai' | 'openai'
 * IMAGE_PROVIDER_FALLBACK - Optional fallback provider
 * 
 * Provider-specific keys:
 * GEMINI_API_KEY - Google Gemini API key
 * KIE_AI_API_KEY - Kie.ai API key
 * OPENAI_API_KEY - OpenAI API key (for future DALL-E support)
 * 
 * Model defaults (optional):
 * GEMINI_DEFAULT_MODEL - Default Gemini model
 * KIE_AI_DEFAULT_MODEL - Default Kie.ai model (e.g., 'google/nano-banana')
 */

export interface ProviderEnvironmentConfig {
  primary: ImageProviderType;
  fallback?: ImageProviderType;
  gemini: {
    apiKey: string;
    defaultModel?: string;
  };
  kieAi: {
    apiKey: string;
    defaultModel?: string;
    pollingInterval?: number;
    maxWaitTime?: number;
  };
  openai: {
    apiKey: string;
    defaultModel?: string;
  };
}

/**
 * Load provider configuration from environment variables
 */
export function loadProviderConfig(): ProviderEnvironmentConfig {
  const primary = (process.env.IMAGE_PROVIDER || 'gemini') as ImageProviderType;
  const fallback = process.env.IMAGE_PROVIDER_FALLBACK as ImageProviderType | undefined;
  
  return {
    primary,
    fallback,
    gemini: {
      apiKey: process.env.GEMINI_API_KEY || '',
      defaultModel: process.env.GEMINI_DEFAULT_MODEL,
    },
    kieAi: {
      apiKey: process.env.KIE_AI_API_KEY || '',
      defaultModel: process.env.KIE_AI_DEFAULT_MODEL || 'google/nano-banana',
      pollingInterval: process.env.KIE_AI_POLLING_INTERVAL 
        ? parseInt(process.env.KIE_AI_POLLING_INTERVAL, 10) 
        : 5000,
      maxWaitTime: process.env.KIE_AI_MAX_WAIT_TIME 
        ? parseInt(process.env.KIE_AI_MAX_WAIT_TIME, 10) 
        : 300000,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      defaultModel: process.env.OPENAI_DEFAULT_MODEL || 'dall-e-3',
    },
  };
}

/**
 * Get the list of configured providers
 */
export function getConfiguredProviders(): ImageProviderType[] {
  const config = loadProviderConfig();
  const configured: ImageProviderType[] = [];
  
  if (config.gemini.apiKey) configured.push('gemini');
  if (config.kieAi.apiKey) configured.push('kie-ai');
  if (config.openai.apiKey) configured.push('openai');
  
  return configured;
}

/**
 * Check if a specific provider is configured
 */
export function isProviderConfigured(provider: ImageProviderType): boolean {
  const config = loadProviderConfig();
  
  switch (provider) {
    case 'gemini':
      return !!config.gemini.apiKey;
    case 'kie-ai':
      return !!config.kieAi.apiKey;
    case 'openai':
      return !!config.openai.apiKey;
    default:
      return false;
  }
}
