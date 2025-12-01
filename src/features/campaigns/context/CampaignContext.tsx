'use client';

import React, { createContext, useContext, useState, useCallback, useSyncExternalStore } from 'react';
import { Platform } from '@/shared/types';
import type { Campaign, CampaignContextValue } from '../types';
import { CampaignStatus, DEFAULT_CAMPAIGN_STATS } from '../types';

const CampaignContext = createContext<CampaignContextValue | undefined>(undefined);

const STORAGE_KEY = 'socialpulse_campaigns';

// For SSR hydration safety
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

// Helper to get stored campaigns from localStorage
const getStoredCampaigns = (): Campaign[] | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  return null;
};

// Helper to save campaigns to localStorage
const saveCampaigns = (campaigns: Campaign[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  }
};

// Initial demo campaigns
const initialCampaigns: Campaign[] = [
  {
    id: 'c1',
    name: 'Summer Product Launch',
    description: 'Launching our new summer collection across all social platforms with influencer partnerships.',
    goal: 'Increase sales by 25%',
    startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 60 * 86400000).toISOString(),
    status: CampaignStatus.ACTIVE,
    platforms: [Platform.INSTAGRAM, Platform.TIKTOK, Platform.FACEBOOK],
    stats: {
      postsCount: 12,
      totalEngagement: 8500,
      clicks: 3200,
      impressions: 125000,
      budget: 5000,
      spent: 2340,
    },
  },
  {
    id: 'c2',
    name: 'Brand Awareness Q4',
    description: 'Increasing brand visibility through strategic content and community engagement.',
    goal: 'Reach 100K new followers',
    startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: CampaignStatus.ACTIVE,
    platforms: [Platform.LINKEDIN, Platform.INSTAGRAM],
    stats: {
      postsCount: 24,
      totalEngagement: 15000,
      clicks: 6800,
      impressions: 250000,
      budget: 10000,
      spent: 4500,
    },
  },
  {
    id: 'c3',
    name: 'Holiday Special Campaign',
    description: 'Holiday season promotional campaign with special offers and festive content.',
    goal: 'Drive holiday sales',
    startDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 75 * 86400000).toISOString(),
    status: CampaignStatus.SCHEDULED,
    platforms: [Platform.INSTAGRAM, Platform.FACEBOOK, Platform.TIKTOK],
    stats: {
      ...DEFAULT_CAMPAIGN_STATS,
      budget: 8000,
    },
  },
  {
    id: 'c4',
    name: 'Spring Clearance',
    description: 'Clearance sale promotion for spring inventory with flash deals.',
    goal: 'Clear 80% of spring inventory',
    startDate: new Date(Date.now() - 90 * 86400000).toISOString(),
    endDate: new Date(Date.now() - 45 * 86400000).toISOString(),
    status: CampaignStatus.COMPLETED,
    platforms: [Platform.FACEBOOK, Platform.INSTAGRAM],
    stats: {
      postsCount: 18,
      totalEngagement: 5200,
      clicks: 2100,
      impressions: 89000,
      budget: 3000,
      spent: 2890,
    },
  },
];

interface CampaignProviderProps {
  children: React.ReactNode;
}

export const CampaignProvider: React.FC<CampaignProviderProps> = ({ children }) => {
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    return getStoredCampaigns() || initialCampaigns;
  });

  const [isLoading] = useState(false);

  const addCampaign = useCallback((campaign: Campaign) => {
    setCampaigns(prev => {
      const updated = [...prev, { ...campaign, createdAt: new Date().toISOString() }];
      saveCampaigns(updated);
      return updated;
    });
  }, []);

  const updateCampaign = useCallback((updatedCampaign: Campaign) => {
    setCampaigns(prev => {
      const updated = prev.map(c => 
        c.id === updatedCampaign.id 
          ? { ...updatedCampaign, updatedAt: new Date().toISOString() } 
          : c
      );
      saveCampaigns(updated);
      return updated;
    });
  }, []);

  const deleteCampaign = useCallback((id: string) => {
    setCampaigns(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveCampaigns(updated);
      return updated;
    });
  }, []);

  const getCampaignById = useCallback((id: string) => {
    return campaigns.find(c => c.id === id);
  }, [campaigns]);

  const value: CampaignContextValue = {
    campaigns,
    isLoading,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaignById,
  };

  // Prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaigns = (): CampaignContextValue => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignProvider');
  }
  return context;
};
