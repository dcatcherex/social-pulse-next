import {
  Package,
  Heart,
  Building2,
  Lightbulb,
  PartyPopper,
  Camera,
} from 'lucide-react';
import type { ContentTemplate, TemplateCategoryInfo, TemplateCategory } from './types';

// Import templates by category
import {
  PRODUCT_TEMPLATES,
  ENGAGEMENT_TEMPLATES,
  BUSINESS_TEMPLATES,
  EDUCATIONAL_TEMPLATES,
  SEASONAL_TEMPLATES,
  BRAND_TEMPLATES,
} from './data';

/**
 * Category metadata for tabs and UI
 */
export const TEMPLATE_CATEGORIES: TemplateCategoryInfo[] = [
  {
    id: 'product',
    label: 'Product & Sales',
    description: 'Showcase products, announce sales, and drive conversions',
    icon: Package,
    color: 'bg-blue-500',
  },
  {
    id: 'engagement',
    label: 'Customer Engagement',
    description: 'Build relationships and encourage interaction',
    icon: Heart,
    color: 'bg-pink-500',
  },
  {
    id: 'business',
    label: 'Business Updates',
    description: 'Share news, hours, and announcements',
    icon: Building2,
    color: 'bg-slate-500',
  },
  {
    id: 'educational',
    label: 'Tips & Education',
    description: 'Share knowledge and establish expertise',
    icon: Lightbulb,
    color: 'bg-amber-500',
  },
  {
    id: 'seasonal',
    label: 'Seasonal & Promos',
    description: 'Holiday content and time-sensitive offers',
    icon: PartyPopper,
    color: 'bg-green-500',
  },
  {
    id: 'brand',
    label: 'Brand Building',
    description: 'Behind the scenes and company culture',
    icon: Camera,
    color: 'bg-purple-500',
  },
];

/**
 * All Content Templates (18 total)
 * Imported from category-specific files for maintainability
 */
export const CONTENT_TEMPLATES: ContentTemplate[] = [
  ...PRODUCT_TEMPLATES,      // 5 templates
  ...ENGAGEMENT_TEMPLATES,   // 4 templates
  ...BUSINESS_TEMPLATES,     // 3 templates
  ...EDUCATIONAL_TEMPLATES,  // 2 templates
  ...SEASONAL_TEMPLATES,     // 2 templates
  ...BRAND_TEMPLATES,        // 2 templates
];

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: TemplateCategory): ContentTemplate[] {
  return CONTENT_TEMPLATES.filter(t => t.category === category);
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): ContentTemplate | undefined {
  return CONTENT_TEMPLATES.find(t => t.id === id);
}

/**
 * Get category info by ID
 */
export function getCategoryInfo(category: TemplateCategory): TemplateCategoryInfo | undefined {
  return TEMPLATE_CATEGORIES.find(c => c.id === category);
}
