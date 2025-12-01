import type { ContentIdea } from '@/features/content-generator';
import type { Platform } from '@/shared/types';

// Content Status Enum
export enum ContentStatus {
  DRAFT = 'draft',           // Just saved, not edited yet
  READY = 'ready',           // Edited and ready to schedule
  SCHEDULED = 'scheduled',   // Has a scheduled date
  PUBLISHED = 'published',   // Already posted
  ARCHIVED = 'archived',     // Hidden but kept
}

// Generation context for regeneration
export interface GenerationContext {
  topic: string;
  tone: string;
  audience: string;
  language: string;
}

// Core SavedContent interface
export interface SavedContent {
  id: string;
  
  // Content from AI generation
  title: string;
  body: string;                    // The actual caption/text
  platform: string;
  hashtags: string[];
  
  // Media (optional)
  mediaUrls?: string[];
  mediaType?: 'image' | 'video' | 'carousel';
  
  // Status & Metadata
  status: ContentStatus;
  createdAt: string;               // ISO string
  updatedAt: string;               // ISO string
  
  // Scheduling
  scheduledFor?: string;           // ISO string
  publishedAt?: string;            // ISO string
  
  // Organization
  campaignId?: string;
  tags?: string[];                 // For filtering/search
  
  // AI Context (for regeneration)
  generationContext?: GenerationContext;
  
  // Original source
  estimatedReach?: string;
  rationale?: string;
}

// Context types
export interface ContentLibraryContextValue {
  contents: SavedContent[];
  isLoading: boolean;
  
  // CRUD operations
  saveContent: (idea: ContentIdea, context?: GenerationContext) => SavedContent;
  updateContent: (id: string, updates: Partial<SavedContent>) => void;
  deleteContent: (id: string) => void;
  archiveContent: (id: string) => void;
  
  // Bulk operations
  bulkUpdateStatus: (ids: string[], status: ContentStatus) => void;
  bulkDelete: (ids: string[]) => void;
  
  // Getters
  getContentById: (id: string) => SavedContent | undefined;
  getContentsByStatus: (status: ContentStatus) => SavedContent[];
  getContentsByCampaign: (campaignId: string) => SavedContent[];
}

// Filter options
export interface ContentFilters {
  status?: ContentStatus;
  platform?: Platform | string;
  campaignId?: string;
  search?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

// Status configuration for UI
export const CONTENT_STATUS_CONFIG: Record<ContentStatus, {
  label: string;
  color: string;
  bgColor: string;
  description: string;
}> = {
  [ContentStatus.DRAFT]: {
    label: 'Draft',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    description: 'Saved but not ready',
  },
  [ContentStatus.READY]: {
    label: 'Ready',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    description: 'Ready to schedule',
  },
  [ContentStatus.SCHEDULED]: {
    label: 'Scheduled',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
    description: 'Scheduled for posting',
  },
  [ContentStatus.PUBLISHED]: {
    label: 'Published',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    description: 'Already posted',
  },
  [ContentStatus.ARCHIVED]: {
    label: 'Archived',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    description: 'Hidden from view',
  },
};
