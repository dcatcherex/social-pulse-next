'use client';

import { useState, useMemo, useCallback } from 'react';
import type { SavedContent, ContentFilters } from '../types';
import { ContentStatus } from '../types';

interface UseContentFiltersOptions {
  contents: SavedContent[];
}

interface UseContentFiltersReturn {
  filteredContents: SavedContent[];
  filters: ContentFilters;
  setStatusFilter: (status: ContentStatus | undefined) => void;
  setPlatformFilter: (platform: string | undefined) => void;
  setCampaignFilter: (campaignId: string | undefined) => void;
  setSearchFilter: (search: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  counts: {
    all: number;
    draft: number;
    ready: number;
    scheduled: number;
    published: number;
    archived: number;
  };
}

export function useContentFilters({ contents }: UseContentFiltersOptions): UseContentFiltersReturn {
  const [filters, setFilters] = useState<ContentFilters>({});

  // Calculate counts for each status
  const counts = useMemo(() => {
    // Exclude archived from 'all' count
    const nonArchived = contents.filter(c => c.status !== ContentStatus.ARCHIVED);
    return {
      all: nonArchived.length,
      draft: contents.filter(c => c.status === ContentStatus.DRAFT).length,
      ready: contents.filter(c => c.status === ContentStatus.READY).length,
      scheduled: contents.filter(c => c.status === ContentStatus.SCHEDULED).length,
      published: contents.filter(c => c.status === ContentStatus.PUBLISHED).length,
      archived: contents.filter(c => c.status === ContentStatus.ARCHIVED).length,
    };
  }, [contents]);

  // Filter contents based on current filters
  const filteredContents = useMemo(() => {
    let result = [...contents];

    // Status filter
    if (filters.status) {
      result = result.filter(c => c.status === filters.status);
    } else {
      // By default, exclude archived items unless explicitly filtered
      result = result.filter(c => c.status !== ContentStatus.ARCHIVED);
    }

    // Platform filter
    if (filters.platform) {
      result = result.filter(c => 
        c.platform.toLowerCase() === filters.platform?.toLowerCase()
      );
    }

    // Campaign filter
    if (filters.campaignId) {
      result = result.filter(c => c.campaignId === filters.campaignId);
    }

    // Search filter
    if (filters.search && filters.search.trim()) {
      const search = filters.search.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(search) ||
        c.body.toLowerCase().includes(search) ||
        c.hashtags.some(tag => tag.toLowerCase().includes(search)) ||
        c.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Sort by updatedAt descending (newest first)
    result.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return result;
  }, [contents, filters]);

  const setStatusFilter = useCallback((status: ContentStatus | undefined) => {
    setFilters(prev => ({ ...prev, status }));
  }, []);

  const setPlatformFilter = useCallback((platform: string | undefined) => {
    setFilters(prev => ({ ...prev, platform }));
  }, []);

  const setCampaignFilter = useCallback((campaignId: string | undefined) => {
    setFilters(prev => ({ ...prev, campaignId }));
  }, []);

  const setSearchFilter = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = Boolean(
    filters.status || 
    filters.platform || 
    filters.campaignId || 
    filters.search?.trim()
  );

  return {
    filteredContents,
    filters,
    setStatusFilter,
    setPlatformFilter,
    setCampaignFilter,
    setSearchFilter,
    clearFilters,
    hasActiveFilters,
    counts,
  };
}
