import type { LucideIcon } from 'lucide-react';
import type { Platform } from '../types';

/**
 * Template Categories for organizing content templates
 */
export type TemplateCategory = 
  | 'product'        // Product/Service Posts
  | 'engagement'     // Customer Engagement
  | 'business'       // Business Updates
  | 'educational'    // Educational/Value Content
  | 'seasonal'       // Holiday & Seasonal
  | 'brand';         // Brand Building & Behind the Scenes

/**
 * Variable field types for template forms
 */
export type TemplateFieldType = 'text' | 'textarea' | 'number' | 'select' | 'date';

/**
 * Template variable definition for dynamic form fields
 */
export interface TemplateVariable {
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
  type: TemplateFieldType;
  options?: string[];        // For select type
  defaultValue?: string;
  helperText?: string;       // Small hint text below field
  maxLength?: number;        // For text/textarea
}

/**
 * Suggested image style for template
 */
export interface TemplateImageStyle {
  style: string;             // Image style preset
  aspectRatio: string;       // Recommended aspect ratio
  cameraAngle?: string;      // Suggested camera angle
  colorHint?: string;        // Color palette suggestion
}

/**
 * Image upload type for templates
 */
export type ImageUploadType = 'product' | 'person' | 'scene' | 'any';

/**
 * Image upload configuration for templates
 */
export interface TemplateImageUpload {
  enabled: boolean;          // Whether this template supports image upload
  label: string;             // "Upload your product photo"
  hint: string;              // "Best results with white background"
  required?: boolean;        // Is upload required for image generation?
  type: ImageUploadType;     // What kind of image is expected
}

/**
 * Content Template Definition
 */
export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  icon: LucideIcon;
  
  // Form configuration
  variables: TemplateVariable[];
  
  // AI generation prompts (use {{variable_id}} for placeholders)
  textPromptTemplate: string;
  imagePromptTemplate: string;
  
  // Defaults and suggestions
  suggestedPlatforms: Platform[];
  suggestedTone: string;
  suggestedImageStyle: TemplateImageStyle;
  
  // Image upload configuration
  imageUpload?: TemplateImageUpload;
  
  // Optional metadata
  exampleOutput?: string;    // Example of what this template produces
  tips?: string[];           // Tips for best results
}

/**
 * Category metadata for UI
 */
export interface TemplateCategoryInfo {
  id: TemplateCategory;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;            // Tailwind color class
}

/**
 * Form values collected from user input
 */
export type TemplateFormValues = Record<string, string>;

/**
 * Result of processing template with form values
 */
export interface ProcessedTemplate {
  textPrompt: string;
  imagePrompt: string;
  tone: string;
  platforms: Platform[];
  imageStyle: TemplateImageStyle;
}
