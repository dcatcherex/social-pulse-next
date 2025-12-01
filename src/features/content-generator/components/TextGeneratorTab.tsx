'use client';

import { useMemo, useState, useCallback } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Languages, 
  Mic2, 
  UsersRound,
  Lightbulb,
  Heart,
  Star,
  TrendingUp,
  Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IdeaCard } from './IdeaCard';
import { useContentGeneration } from '../hooks/use-content-generation';
import { useOnboarding, INDUSTRY_PROMPTS } from '@/features/onboarding';
import { useScheduler } from '@/features/scheduling';
import { useContentLibrary } from '@/features/content-library';
import type { ContentIdea } from '../types';
import type { LucideIcon } from 'lucide-react';

// Constants
const TEMPLATE_ICONS: LucideIcon[] = [Lightbulb, Heart, Star, TrendingUp, Gift];
const TONES = ['Professional', 'Casual', 'Friendly', 'Witty', 'Inspiring', 'Educational'];
const LANGUAGES = ['English', 'Thai', 'Spanish', 'French', 'German', 'Japanese', 'Chinese'];
const AUDIENCES = ['General Audience', 'Business Owners', 'Students / Youth', 'Parents', 'Professionals', 'Local Community'];

const DEFAULT_TEMPLATES = [
  { label: "Promote a Sale", icon: Gift, prompt: "Create a promotional post for a weekend sale", tone: "Professional", audience: "General Audience" },
  { label: "Monday Motivation", icon: Lightbulb, prompt: "Motivational post for Monday morning related to our industry", tone: "Inspiring", audience: "General Audience" },
  { label: "Trust Building", icon: Heart, prompt: "Share a post about safety, quality or experience to build trust", tone: "Professional", audience: "General Audience" },
  { label: "Viral Trend", icon: TrendingUp, prompt: "Create a fun, meme-style post about a current trend", tone: "Witty", audience: "General Audience" },
];

export function TextGeneratorTab() {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [scheduledId, setScheduledId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);

  const { schedulePost } = useScheduler();
  const { saveContent } = useContentLibrary();
  const { data: onboardingData } = useOnboarding();

  const {
    ideas,
    isLoading,
    topic,
    setTopic,
    language,
    setLanguage,
    tone,
    setTone,
    audience,
    setAudience,
    generate,
  } = useContentGeneration();

  // Generate industry-specific quick templates
  const quickTemplates = useMemo(() => {
    if (!onboardingData?.industry) return DEFAULT_TEMPLATES;
    
    const industryData = INDUSTRY_PROMPTS[onboardingData.industry] || INDUSTRY_PROMPTS['Other'];
    
    return industryData.templates.slice(0, 4).map((prompt, idx) => ({
      label: prompt.split(' ').slice(0, 3).join(' '),
      icon: TEMPLATE_ICONS[idx % TEMPLATE_ICONS.length],
      prompt: prompt,
      tone: idx % 2 === 0 ? 'Professional' : 'Witty',
      audience: 'General Audience',
    }));
  }, [onboardingData?.industry]);

  const handleGenerate = useCallback((overrideTopic?: string, overrideTone?: string, overrideAudience?: string) => {
    if (overrideTopic) setTopic(overrideTopic);
    if (overrideTone) setTone(overrideTone);
    if (overrideAudience) setAudience(overrideAudience);
    setScheduledId(null);
    
    setTimeout(() => {
      generate(overrideTopic, overrideTone, overrideAudience);
    }, 0);
  }, [generate, setTopic, setTone, setAudience]);

  const handleCopy = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleSchedule = useCallback((idea: ContentIdea, index: number) => {
    schedulePost(idea);
    setScheduledId(index);
    setTimeout(() => setScheduledId(null), 2000);
  }, [schedulePost]);

  const handleSave = useCallback((idea: ContentIdea, index: number) => {
    saveContent(idea, { topic, tone, audience, language });
    setSavedId(index);
    setTimeout(() => setSavedId(null), 2000);
  }, [saveContent, topic, tone, audience, language]);

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-bottom-2 fade-in duration-300">
        {/* One-Tap Ideas */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-3">One-Tap Ideas</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickTemplates.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleGenerate(t.prompt, t.tone, t.audience)}
                disabled={isLoading}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-xl transition-all group disabled:opacity-50"
              >
                <t.icon className="w-6 h-6 text-indigo-400 group-hover:text-indigo-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-700 text-center line-clamp-1">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center gap-4 my-6">
          <div className="h-px bg-slate-100 flex-1"></div>
          <span className="text-xs text-slate-400 font-medium uppercase">OR CUSTOMIZE YOUR POST</span>
          <div className="h-px bg-slate-100 flex-1"></div>
        </div>

        {/* Custom Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleGenerate(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                <Languages className="w-3 h-3" /> LANGUAGE
              </label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                <Mic2 className="w-3 h-3" /> TONE OF VOICE
              </label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                <UsersRound className="w-3 h-3" /> TARGET AUDIENCE
              </label>
              <select 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">What do you want to post about?</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., We are closing early today..."
                className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
              <Button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className="px-6"
              >
                {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                <span className="hidden md:inline ml-2">Generate Drafts</span>
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {ideas.length > 0 && <h2 className="text-xl font-bold text-slate-800">Your Drafts</h2>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea, idx) => (
            <IdeaCard
              key={idx}
              idea={idea}
              index={idx}
              copiedId={copiedId}
              scheduledId={scheduledId}
              savedId={savedId}
              onCopy={handleCopy}
              onSchedule={handleSchedule}
              onSave={handleSave}
            />
          ))}
        </div>

        {!isLoading && ideas.length === 0 && (
          <div className="text-center py-12 opacity-50">
            <Sparkles className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p>Click a One-Tap Idea or enter a topic to generate post ideas.</p>
          </div>
        )}
      </div>
    </>
  );
}
