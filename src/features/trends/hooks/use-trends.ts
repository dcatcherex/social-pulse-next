'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { discoverTrends, refreshTrends, getCachedTrends } from '../services/trend-service';
import type { Trend, TrendCategory } from '../types';
import { useBrandInfo } from '@/features/onboarding';

interface UseTrendsOptions {
  category?: TrendCategory;
  enabled?: boolean;
}

interface UseTrendsReturn {
  trends: Trend[];
  isLoading: boolean;
  isFetching: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refresh: () => void;
  refetch: () => void;
  industry: string;
  keywords: string[];
  brandName: string;
}

// Default values for demo/development (used if onboarding not completed)
const DEFAULT_INDUSTRY = 'Technology';
const DEFAULT_KEYWORDS = ['AI', 'startup', 'innovation'];

export function useTrends(options: UseTrendsOptions = {}): UseTrendsReturn {
  const { category, enabled = true } = options;
  
  // Get brand info from onboarding context
  const brandInfo = useBrandInfo();
  const industry = brandInfo.industry || DEFAULT_INDUSTRY;
  const keywords = brandInfo.keywords.length > 0 ? brandInfo.keywords : DEFAULT_KEYWORDS;
  const brandName = brandInfo.brandName;

  const queryClient = useQueryClient();

  // Main query for fetching trends
  const {
    data: trends = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['trends', industry, keywords],
    queryFn: async () => {
      console.log('[useTrends] Fetching trends...');
      
      // Check cache first
      const cached = getCachedTrends(industry, keywords);
      if (cached) {
        console.log('[useTrends] Using cached trends');
        return cached;
      }

      const result = await discoverTrends(industry, keywords, brandName);
      console.log('[useTrends] Got', result.length, 'trends');
      return result;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });

  // Mutation for refreshing trends
  const refreshMutation = useMutation({
    mutationFn: async () => {
      console.log('[useTrends] Refreshing trends...');
      return refreshTrends(industry, keywords, brandName);
    },
    onSuccess: (newTrends) => {
      queryClient.setQueryData(['trends', industry, keywords], newTrends);
    },
    onError: (error) => {
      console.error('[useTrends] Refresh error:', error);
    },
  });

  // Filter by category if specified
  const filteredTrends = category
    ? trends.filter((trend) => trend.category === category)
    : trends;

  return {
    trends: filteredTrends,
    isLoading,
    isFetching,
    isRefreshing: refreshMutation.isPending,
    error: error as Error | null,
    refresh: () => refreshMutation.mutate(),
    refetch: () => refetch(),
    industry,
    keywords,
    brandName,
  };
}

/**
 * Get a single trend by ID
 */
export function useTrendById(id: string): Trend | undefined {
  const { trends } = useTrends();
  return trends.find((t) => t.id === id);
}
