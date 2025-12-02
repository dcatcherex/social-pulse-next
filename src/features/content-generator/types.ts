import { LucideIcon } from 'lucide-react';

export type Platform = 'twitter' | 'instagram' | 'linkedin' | 'facebook' | 'tiktok' | 'youtube';

export interface ContentIdea {
  title: string;
  description: string;
  platform: Platform | string;
  estimatedReach: string;
  suggestedTags: string[];
  rationale: string;
}

export interface GenerationOptions {
  topic: string;
  language: string;
  tone: string;
  audience: string;
}

export interface QuickTemplate {
  label: string;
  icon: LucideIcon;
  prompt: string;
  tone: string;
  audience: string;
}

// Shared brand context type
export interface BrandContext {
  name: string;
  industry: string;
  tagline?: string;
  uniqueSellingPoint?: string;
  brandVoice?: {
    tone: string;
    personality?: string[];
    avoidWords?: string[];
  };
  targetAudience?: {
    ageRange: string;
    demographics?: string;
    interests?: string[];
    painPoints?: string[];
  };
  values?: string[];
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

// API Request/Response types
export interface ContentGenerationRequest {
  topic: string;
  language?: string;
  tone?: string;
  targetAudience?: string;
  brandContext?: BrandContext;
}

export interface ImageGenerationRequest {
  prompt: string;
  aspectRatio?: string;
  cameraAngle?: string;
  imageStyle?: string;
  imageCount?: number;
  model?: string;
  productImage?: string; // Base64 encoded image
  presenterImage?: string; // Base64 encoded image
  brandContext?: BrandContext; // Brand context for image styling
}

export interface GeneratedImage {
  url: string;
  index: number;
}
