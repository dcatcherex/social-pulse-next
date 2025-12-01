'use client';

import React, { useMemo } from 'react';
import { RefreshCcw, Search, Sparkles, Tag, Radio } from 'lucide-react';
import { useBrand } from '@/features/brand-management';
import { useOnboarding } from '@/features/onboarding';
import { useMentions } from '../hooks/use-mentions';
import { MentionCard } from './MentionCard';

export const MentionFeed: React.FC = () => {
  const { activeProfile } = useBrand();
  const { data: onboardingData } = useOnboarding();
  
  // Combine keywords from brand profile and onboarding
  const allKeywords = useMemo(() => {
    const brandKeywords = activeProfile?.keywords || [];
    const onboardingKeywords = onboardingData?.keywords || [];
    const combined = [...new Set([...brandKeywords, ...onboardingKeywords])];
    return combined;
  }, [activeProfile?.keywords, onboardingData?.keywords]);

  const {
    mentions,
    isLoading,
    filter,
    setFilter,
    analysis,
    isAnalyzing,
    refresh,
    analyze,
  } = useMentions(activeProfile);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Radio className="w-6 h-6 text-indigo-600" />
            Listening Feed
          </h1>
          <p className="text-slate-500">
            Monitoring keywords: {allKeywords.length > 0 ? allKeywords.join(', ') : 'None set'}
          </p>
          {allKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {allKeywords.map((kw) => (
                <span key={kw} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs">
                  <Tag className="w-3 h-3" />
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={analyze}
            disabled={isAnalyzing || mentions.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? (
              <RefreshCcw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>AI Insight</span>
          </button>
          <button 
            onClick={() => refresh()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Fetch Latest</span>
          </button>
        </div>
      </div>

      {/* AI Analysis Box */}
      {analysis && (
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-indigo-100 p-6 rounded-xl animate-in fade-in duration-500">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-indigo-900 mb-2">Strategic Analysis</h3>
              <p className="text-indigo-800 text-sm whitespace-pre-line leading-relaxed">
                {analysis}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            filter === 'all' 
              ? 'bg-slate-800 text-white' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Mentions
        </button>
        <button 
          onClick={() => setFilter('negative')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            filter === 'negative' 
              ? 'bg-red-600 text-white' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Negative (Priority)
        </button>
        <button 
          onClick={() => setFilter('competitor')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            filter === 'competitor' 
              ? 'bg-amber-600 text-white' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Competitors
        </button>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 min-h-[400px]">
        {mentions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No mentions found</h3>
            <p className="text-slate-500 mt-1">
              Try clicking &quot;Fetch Latest&quot; to simulate live data.
            </p>
          </div>
        ) : (
          mentions.map((mention) => (
            <MentionCard key={mention.id} mention={mention} />
          ))
        )}
      </div>
    </div>
  );
};
