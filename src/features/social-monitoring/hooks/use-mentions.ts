'use client';

import { useState, useCallback, useMemo } from 'react';
import type { Mention, FilterType } from '../types';
import { fetchMentions, analyzeInsights } from '../services/mention-service';
import type { BrandProfile } from '@/features/brand-management';

export function useMentions(brandProfile: BrandProfile) {
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const refresh = useCallback(async (count: number = 8) => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const newMentions = await fetchMentions(brandProfile, count);
      setMentions(prev => [...newMentions, ...prev]);
    } finally {
      setIsLoading(false);
    }
  }, [brandProfile]);

  const analyze = useCallback(async () => {
    if (mentions.length === 0) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeInsights(mentions.slice(0, 15));
      setAnalysis(result);
    } finally {
      setIsAnalyzing(false);
    }
  }, [mentions]);

  const filteredMentions = useMemo(() => {
    return mentions.filter(m => {
      if (filter === 'negative') return m.sentiment === 'negative';
      if (filter === 'competitor') return m.isCompetitor;
      return true;
    });
  }, [mentions, filter]);

  return {
    mentions: filteredMentions,
    allMentions: mentions,
    isLoading,
    filter,
    setFilter,
    analysis,
    isAnalyzing,
    refresh,
    analyze,
  };
}
