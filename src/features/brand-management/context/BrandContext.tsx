'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, useSyncExternalStore } from 'react';
import type { BrandProfile, BrandContextValue, BrandTone } from '../types';

const BrandContext = createContext<BrandContextValue | undefined>(undefined);

const STORAGE_KEY = 'socialpulse_brands';

// Default brand voice for new profiles
const defaultBrandVoice = {
  tone: 'friendly' as BrandTone,
  personality: ['Authentic', 'Helpful'],
  samplePhrases: [],
  avoidWords: [],
};

// Default target audience for new profiles
const defaultTargetAudience = {
  ageRange: 'all',
  demographics: '',
  interests: [],
  painPoints: [],
  desires: [],
};

const defaultProfiles: BrandProfile[] = [
  {
    id: 'b1',
    name: "My Brand",
    industry: "Technology",
    tagline: "Innovation made simple",
    brandVoice: {
      tone: 'friendly',
      personality: ['Innovative', 'Trustworthy', 'Helpful'],
      samplePhrases: ["Let's build something amazing!", "Innovation for everyone"],
      avoidWords: ["complicated", "difficult"],
    },
    targetAudience: {
      ageRange: '25-34',
      demographics: 'Tech professionals and enthusiasts',
      interests: ['Technology', 'Innovation', 'Productivity'],
      painPoints: ['Complex tools', 'Lack of integration'],
      desires: ['Simplicity', 'Efficiency', 'Growth'],
    },
    brandColors: { primary: '#4F46E5', secondary: '#10B981' },
    values: ['Innovation', 'Quality', 'Customer Success'],
    uniqueSellingPoint: 'AI-powered insights that actually work',
    keywords: ["AI", "startup", "innovation", "technology"],
    competitors: ["Competitor A", "Competitor B"],
    timezone: "America/New_York"
  },
];

// Helper to get stored profiles from localStorage
const getStoredProfiles = (): BrandProfile[] | null => {
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

// Helper to save profiles to localStorage
const saveProfiles = (profiles: BrandProfile[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }
};

// For SSR hydration safety
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

interface BrandProviderProps {
  children: React.ReactNode;
}

export const BrandProvider: React.FC<BrandProviderProps> = ({ children }) => {
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  const [brandProfiles, setBrandProfiles] = useState<BrandProfile[]>(() => {
    return getStoredProfiles() || defaultProfiles;
  });
  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    const profiles = getStoredProfiles() || defaultProfiles;
    return profiles[0]?.id || '';
  });

  const activeProfile = useMemo(() => 
    brandProfiles.find(p => p.id === activeProfileId) || brandProfiles[0], 
    [brandProfiles, activeProfileId]
  );

  const updateProfile = useCallback((updatedProfile: BrandProfile) => {
    setBrandProfiles(prev => {
      const updated = prev.map(p => p.id === updatedProfile.id ? updatedProfile : p);
      saveProfiles(updated);
      return updated;
    });
  }, []);

  const addProfile = useCallback((profile: BrandProfile) => {
    setBrandProfiles(prev => {
      const updated = [...prev, profile];
      saveProfiles(updated);
      return updated;
    });
  }, []);

  const createNewProfile = useCallback(() => {
    const newProfile: BrandProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: "New Business",
      industry: "Other",
      tagline: "",
      brandVoice: { ...defaultBrandVoice },
      targetAudience: { ...defaultTargetAudience },
      brandColors: { primary: '#4F46E5' },
      values: [],
      uniqueSellingPoint: "",
      keywords: [],
      competitors: [],
      timezone: "UTC"
    };
    addProfile(newProfile);
    setActiveProfileId(newProfile.id);
  }, [addProfile]);

  const value: BrandContextValue = {
    brandProfiles,
    activeProfile,
    activeProfileId,
    setActiveProfileId,
    updateProfile,
    addProfile,
    createNewProfile,
  };

  // Prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = (): BrandContextValue => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};
