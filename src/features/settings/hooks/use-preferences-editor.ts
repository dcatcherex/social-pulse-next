'use client';

import { useState, useCallback } from 'react';
import { useOnboarding, type OnboardingData } from '@/features/onboarding';
import type { UsePreferencesEditorReturn } from '../types';

export function usePreferencesEditor(): UsePreferencesEditorReturn {
  const { data, updateData } = useOnboarding();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<OnboardingData | null>(data);
  const [keywordInput, setKeywordInput] = useState('');
  const [competitorInput, setCompetitorInput] = useState('');
  const [saved, setSaved] = useState(false);

  const startEditing = useCallback(() => {
    setEditData(data);
    setIsEditing(true);
  }, [data]);

  const cancelEditing = useCallback(() => {
    setEditData(data);
    setIsEditing(false);
  }, [data]);

  const saveChanges = useCallback(() => {
    if (editData) {
      updateData(editData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setIsEditing(false);
    }
  }, [editData, updateData]);

  // Industry
  const setIndustry = useCallback((industry: string) => {
    setEditData((prev) => (prev ? { ...prev, industry } : null));
  }, []);

  // Challenges
  const toggleChallenge = useCallback((id: string) => {
    setEditData((prev) => {
      if (!prev) return null;
      const current = prev.challenges || [];
      const updated = current.includes(id)
        ? current.filter((c) => c !== id)
        : [...current, id];
      return { ...prev, challenges: updated };
    });
  }, []);

  // Keywords
  const addKeyword = useCallback(() => {
    if (!keywordInput.trim()) return;
    setEditData((prev) => {
      if (!prev) return null;
      if (prev.keywords.includes(keywordInput.trim())) return prev;
      return { ...prev, keywords: [...prev.keywords, keywordInput.trim()] };
    });
    setKeywordInput('');
  }, [keywordInput]);

  const removeKeyword = useCallback((keyword: string) => {
    setEditData((prev) => {
      if (!prev) return null;
      return { ...prev, keywords: prev.keywords.filter((k) => k !== keyword) };
    });
  }, []);

  // Platforms
  const togglePlatform = useCallback((id: string) => {
    setEditData((prev) => {
      if (!prev) return null;
      const current = prev.platforms || [];
      const updated = current.includes(id)
        ? current.filter((p) => p !== id)
        : [...current, id];
      return { ...prev, platforms: updated };
    });
  }, []);

  // Competitors
  const addCompetitor = useCallback(() => {
    if (!competitorInput.trim()) return;
    setEditData((prev) => {
      if (!prev) return null;
      const current = prev.competitors || [];
      if (current.includes(competitorInput.trim()) || current.length >= 5) return prev;
      return { ...prev, competitors: [...current, competitorInput.trim()] };
    });
    setCompetitorInput('');
  }, [competitorInput]);

  const removeCompetitor = useCallback((competitor: string) => {
    setEditData((prev) => {
      if (!prev) return null;
      return { ...prev, competitors: (prev.competitors || []).filter((c) => c !== competitor) };
    });
  }, []);

  // Goals
  const toggleGoal = useCallback((id: string) => {
    setEditData((prev) => {
      if (!prev) return null;
      const current = prev.goals || [];
      const updated = current.includes(id)
        ? current.filter((g) => g !== id)
        : current.length < 3
          ? [...current, id]
          : current;
      return { ...prev, goals: updated };
    });
  }, []);

  // Audience Times
  const toggleAudienceTime = useCallback((id: string) => {
    setEditData((prev) => {
      if (!prev) return null;
      const current = prev.audienceTimes || [];
      const updated = current.includes(id)
        ? current.filter((t) => t !== id)
        : [...current, id];
      return { ...prev, audienceTimes: updated };
    });
  }, []);

  return {
    // State
    data,
    isEditing,
    editData,
    keywordInput,
    competitorInput,
    saved,
    // Actions
    startEditing,
    cancelEditing,
    saveChanges,
    setIndustry,
    toggleChallenge,
    setKeywordInput,
    addKeyword,
    removeKeyword,
    togglePlatform,
    setCompetitorInput,
    addCompetitor,
    removeCompetitor,
    toggleGoal,
    toggleAudienceTime,
  };
}
