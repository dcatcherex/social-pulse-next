'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ContentIdea } from '@/features/content-generator';
import type { ScheduledPost, SchedulerContextValue } from '../types';

const STORAGE_KEY = 'socialpulse_scheduled_posts';

const SchedulerContext = createContext<SchedulerContextValue | undefined>(undefined);

// Helper to serialize/deserialize dates in posts
function serializePosts(posts: ScheduledPost[]): string {
  return JSON.stringify(posts.map(post => ({
    ...post,
    date: post.date.toISOString()
  })));
}

function deserializePosts(json: string): ScheduledPost[] {
  try {
    const parsed = JSON.parse(json);
    return parsed.map((post: ScheduledPost & { date: string }) => ({
      ...post,
      date: new Date(post.date)
    }));
  } catch {
    return [];
  }
}

function getStoredPosts(): ScheduledPost[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? deserializePosts(stored) : [];
}

function savePosts(posts: ScheduledPost[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, serializePosts(posts));
}

interface SchedulerProviderProps {
  children: React.ReactNode;
}

export const SchedulerProvider: React.FC<SchedulerProviderProps> = ({ children }) => {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => getStoredPosts());
  const [isHydrated, setIsHydrated] = useState(false);

  // Mark hydrated after mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    if (isHydrated) {
      savePosts(scheduledPosts);
    }
  }, [scheduledPosts, isHydrated]);

  const schedulePost = useCallback((idea: ContentIdea): ScheduledPost => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const newPost: ScheduledPost = {
      ...idea,
      id: Math.random().toString(36).substr(2, 9),
      date: tomorrow,
      status: 'scheduled'
    };

    setScheduledPosts(prev => [...prev, newPost]);
    return newPost;
  }, []);

  const updatePostDate = useCallback((postId: string, newDate: Date) => {
    setScheduledPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const updatedDate = new Date(newDate);
        updatedDate.setHours(post.date.getHours());
        updatedDate.setMinutes(post.date.getMinutes());
        return { ...post, date: updatedDate };
      }
      return post;
    }));
  }, []);

  const removePost = useCallback((postId: string) => {
    setScheduledPosts(prev => prev.filter(post => post.id !== postId));
  }, []);

  const value: SchedulerContextValue = {
    scheduledPosts,
    schedulePost,
    updatePostDate,
    removePost,
  };

  return (
    <SchedulerContext.Provider value={value}>
      {children}
    </SchedulerContext.Provider>
  );
};

export function useScheduler(): SchedulerContextValue {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error('useScheduler must be used within a SchedulerProvider');
  }
  return context;
}
