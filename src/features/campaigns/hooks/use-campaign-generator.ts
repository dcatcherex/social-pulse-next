'use client';

import { useState, useCallback } from 'react';
import { Platform } from '@/shared/types';
import type { BrandProfile } from '@/features/brand-management';
import type { Campaign, CampaignDraft } from '../types';
import { CampaignStatus, DEFAULT_CAMPAIGN_STATS } from '../types';
import { generateCampaignStrategy } from '../services/campaign-service';

interface UseCampaignGeneratorReturn {
  isGenerating: boolean;
  generatedDraft: CampaignDraft | null;
  error: string | null;
  generateCampaign: (goal: string) => Promise<void>;
  createCampaignFromDraft: () => Campaign | null;
  clearDraft: () => void;
}

/**
 * Hook for AI-powered campaign generation
 */
export function useCampaignGenerator(
  brandProfile: BrandProfile
): UseCampaignGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<CampaignDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentGoal, setCurrentGoal] = useState<string>('');

  const generateCampaign = useCallback(async (goal: string) => {
    if (!goal.trim()) {
      setError('Please enter a campaign goal');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentGoal(goal);

    try {
      const draft = await generateCampaignStrategy({
        brandName: brandProfile.name,
        industry: brandProfile.industry,
        goal,
        brandVoice: brandProfile.brandVoice?.tone,
        targetAudience: brandProfile.targetAudience?.demographics,
      });

      setGeneratedDraft(draft);
    } catch (err) {
      setError('Failed to generate campaign. Please try again.');
      console.error('Campaign generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [brandProfile]);

  const createCampaignFromDraft = useCallback((): Campaign | null => {
    if (!generatedDraft) return null;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (generatedDraft.suggestedDuration || 30));

    // Map platform strings to Platform enum
    const platformMap: Record<string, Platform> = {
      'Instagram': Platform.INSTAGRAM,
      'Facebook': Platform.FACEBOOK,
      'TikTok': Platform.TIKTOK,
      'LinkedIn': Platform.LINKEDIN,
      'X (Twitter)': Platform.TWITTER,
      'Twitter': Platform.TWITTER,
    };

    const platforms = generatedDraft.platforms
      .map(p => platformMap[p])
      .filter((p): p is Platform => p !== undefined);

    const campaign: Campaign = {
      id: Math.random().toString(36).substr(2, 9),
      name: generatedDraft.name,
      description: generatedDraft.description,
      goal: currentGoal,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: CampaignStatus.DRAFT,
      platforms: platforms.length > 0 ? platforms : [Platform.INSTAGRAM],
      stats: { ...DEFAULT_CAMPAIGN_STATS },
      createdAt: new Date().toISOString(),
    };

    return campaign;
  }, [generatedDraft, currentGoal]);

  const clearDraft = useCallback(() => {
    setGeneratedDraft(null);
    setError(null);
    setCurrentGoal('');
  }, []);

  return {
    isGenerating,
    generatedDraft,
    error,
    generateCampaign,
    createCampaignFromDraft,
    clearDraft,
  };
}
