'use client';

import React, { createContext, useContext, useState, useCallback, useSyncExternalStore } from 'react';
import type { OnboardingData, OnboardingContextType } from '../types';
import { INDUSTRY_PROMPTS } from '../types';

const OnboardingContext = createContext<OnboardingContextType | null>(null);

const STORAGE_KEY = 'socialpulse_onboarding';

// Helper to get initial data from localStorage
const getStoredData = (): OnboardingData | null => {
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

// For SSR hydration safety
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [data, setData] = useState<OnboardingData | null>(() => getStoredData());

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => {
      const newData = prev 
        ? { ...prev, ...updates }
        : { 
            brandName: '',
            industry: '',
            challenges: [],
            keywords: [],
            ...updates,
          };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(null);
  }, []);

  const isOnboarded = Boolean(data?.completedAt);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return null;
  }

  return (
    <OnboardingContext.Provider
      value={{
        data,
        isOnboarded,
        updateData,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

// Helper hook to get industry-specific prompts
export const useIndustryPrompts = () => {
  const { data } = useOnboarding();
  const industry = data?.industry || 'Other';
  
  return INDUSTRY_PROMPTS[industry] || INDUSTRY_PROMPTS['Other'];
};

// Helper hook to get tracked keywords
export const useTrackedKeywords = () => {
  const { data } = useOnboarding();
  return data?.keywords || [];
};

// Helper hook to get brand info
export const useBrandInfo = () => {
  const { data } = useOnboarding();
  return {
    brandName: data?.brandName || '',
    industry: data?.industry || 'Technology',
    keywords: data?.keywords || [],
  };
};
