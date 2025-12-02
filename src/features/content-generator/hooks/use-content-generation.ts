'use client';

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useBrand } from '@/features/brand-management';
import { generateContentIdeas } from '../services/content-service';
import type { ContentIdea, ContentGenerationRequest } from '../types';

export function useContentGeneration() {
  const { activeProfile } = useBrand();
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('English');
  const [tone, setTone] = useState('Professional');
  const [audience, setAudience] = useState('General Audience');

  const mutation = useMutation({
    mutationFn: (request: ContentGenerationRequest) => generateContentIdeas(request),
  });

  const generate = useCallback(async (
    overrideTopic?: string,
    overrideTone?: string,
    overrideAudience?: string
  ) => {
    const searchTopic = overrideTopic || topic;
    const searchTone = overrideTone || tone;
    const searchAudience = overrideAudience || audience;
    
    if (overrideTopic) setTopic(overrideTopic);
    if (overrideTone) setTone(overrideTone);
    if (overrideAudience) setAudience(overrideAudience);

    if (!searchTopic.trim()) return;

    const request: ContentGenerationRequest = {
      topic: searchTopic,
      language,
      tone: searchTone,
      targetAudience: searchAudience,
      brandContext: activeProfile ? {
        name: activeProfile.name,
        industry: activeProfile.industry,
        tagline: activeProfile.tagline,
        uniqueSellingPoint: activeProfile.uniqueSellingPoint,
        brandVoice: activeProfile.brandVoice,
        targetAudience: activeProfile.targetAudience,
        values: activeProfile.values,
      } : undefined,
    };

    mutation.mutate(request);
  }, [activeProfile, topic, language, tone, audience, mutation]);

  return {
    ideas: mutation.data || [] as ContentIdea[],
    isLoading: mutation.isPending,
    error: mutation.error,
    topic,
    setTopic,
    language,
    setLanguage,
    tone,
    setTone,
    audience,
    setAudience,
    generate,
    reset: mutation.reset,
  };
}
