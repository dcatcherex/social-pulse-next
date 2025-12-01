'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ContentIdea } from '@/features/content-generator';
import type { 
  SavedContent, 
  ContentLibraryContextValue, 
  GenerationContext 
} from '../types';
import { ContentStatus } from '../types';

const STORAGE_KEY = 'socialpulse_content_library';

// Generate unique ID
function generateId(): string {
  return `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Serialize/deserialize for localStorage
function serialize(contents: SavedContent[]): string {
  return JSON.stringify(contents);
}

function deserialize(json: string): SavedContent[] {
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

function getStoredContents(): SavedContent[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? deserialize(stored) : [];
}

function saveToStorage(contents: SavedContent[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, serialize(contents));
}

const ContentLibraryContext = createContext<ContentLibraryContextValue | undefined>(undefined);

interface ContentLibraryProviderProps {
  children: React.ReactNode;
}

export const ContentLibraryProvider: React.FC<ContentLibraryProviderProps> = ({ children }) => {
  // Use lazy initialization to load from localStorage
  const [contents, setContents] = useState<SavedContent[]>(() => getStoredContents());
  const [isHydrated, setIsHydrated] = useState(false);

  // Mark as hydrated after mount (standard SSR pattern for Next.js)
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isLoading = !isHydrated;

  // Persist to localStorage on changes
  useEffect(() => {
    if (isHydrated) {
      saveToStorage(contents);
    }
  }, [contents, isHydrated]);

  // Save new content from ContentIdea
  const saveContent = useCallback((
    idea: ContentIdea, 
    context?: GenerationContext
  ): SavedContent => {
    const now = new Date().toISOString();
    const newContent: SavedContent = {
      id: generateId(),
      title: idea.title,
      body: idea.description,
      platform: idea.platform,
      hashtags: idea.suggestedTags || [],
      status: ContentStatus.DRAFT,
      createdAt: now,
      updatedAt: now,
      estimatedReach: idea.estimatedReach,
      rationale: idea.rationale,
      generationContext: context,
    };

    setContents(prev => [newContent, ...prev]);
    return newContent;
  }, []);

  // Update existing content
  const updateContent = useCallback((id: string, updates: Partial<SavedContent>) => {
    setContents(prev => prev.map(content => {
      if (content.id === id) {
        return {
          ...content,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return content;
    }));
  }, []);

  // Delete content permanently
  const deleteContent = useCallback((id: string) => {
    setContents(prev => prev.filter(content => content.id !== id));
  }, []);

  // Archive content (soft delete)
  const archiveContent = useCallback((id: string) => {
    updateContent(id, { status: ContentStatus.ARCHIVED });
  }, [updateContent]);

  // Bulk update status
  const bulkUpdateStatus = useCallback((ids: string[], status: ContentStatus) => {
    setContents(prev => prev.map(content => {
      if (ids.includes(content.id)) {
        return {
          ...content,
          status,
          updatedAt: new Date().toISOString(),
        };
      }
      return content;
    }));
  }, []);

  // Bulk delete
  const bulkDelete = useCallback((ids: string[]) => {
    setContents(prev => prev.filter(content => !ids.includes(content.id)));
  }, []);

  // Get content by ID
  const getContentById = useCallback((id: string): SavedContent | undefined => {
    return contents.find(content => content.id === id);
  }, [contents]);

  // Get contents by status
  const getContentsByStatus = useCallback((status: ContentStatus): SavedContent[] => {
    return contents.filter(content => content.status === status);
  }, [contents]);

  // Get contents by campaign
  const getContentsByCampaign = useCallback((campaignId: string): SavedContent[] => {
    return contents.filter(content => content.campaignId === campaignId);
  }, [contents]);

  const value: ContentLibraryContextValue = {
    contents,
    isLoading,
    saveContent,
    updateContent,
    deleteContent,
    archiveContent,
    bulkUpdateStatus,
    bulkDelete,
    getContentById,
    getContentsByStatus,
    getContentsByCampaign,
  };

  return (
    <ContentLibraryContext.Provider value={value}>
      {children}
    </ContentLibraryContext.Provider>
  );
};

export function useContentLibrary(): ContentLibraryContextValue {
  const context = useContext(ContentLibraryContext);
  if (!context) {
    throw new Error('useContentLibrary must be used within a ContentLibraryProvider');
  }
  return context;
}
