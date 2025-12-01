import { Platform } from '@/shared/types';

// Campaign Status
export enum CampaignStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  SCHEDULED = 'scheduled',
}

// Campaign Statistics
export interface CampaignStats {
  postsCount: number;
  totalEngagement: number;
  clicks: number;
  impressions: number;
  budget?: number;
  spent?: number;
}

// Core Campaign Interface
export interface Campaign {
  id: string;
  name: string;
  description: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  platforms: Platform[];
  stats: CampaignStats;
  createdAt?: string;
  updatedAt?: string;
}

// AI Generation Types
export interface CampaignDraft {
  name: string;
  description: string;
  platforms: string[];
  suggestedDuration?: number; // days
  contentSuggestions?: string[];
}

export interface GenerateCampaignRequest {
  brandName: string;
  industry: string;
  goal: string;
  brandVoice?: string;
  targetAudience?: string;
}

// Context Types
export interface CampaignContextValue {
  campaigns: Campaign[];
  isLoading: boolean;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (campaign: Campaign) => void;
  deleteCampaign: (id: string) => void;
  getCampaignById: (id: string) => Campaign | undefined;
}

// Status Configuration for UI
export const CAMPAIGN_STATUS_CONFIG: Record<CampaignStatus, { 
  label: string; 
  color: string;
  bgColor: string;
}> = {
  [CampaignStatus.ACTIVE]: { 
    label: 'Active', 
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  [CampaignStatus.DRAFT]: { 
    label: 'Draft', 
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
  },
  [CampaignStatus.COMPLETED]: { 
    label: 'Completed', 
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  [CampaignStatus.PAUSED]: { 
    label: 'Paused', 
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
  },
  [CampaignStatus.SCHEDULED]: { 
    label: 'Scheduled', 
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
  },
};

// Default stats for new campaigns
export const DEFAULT_CAMPAIGN_STATS: CampaignStats = {
  postsCount: 0,
  totalEngagement: 0,
  clicks: 0,
  impressions: 0,
  budget: 0,
  spent: 0,
};
