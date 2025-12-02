'use client';

import { 
  TrendingUp, 
  Clock, 
  Hash, 
  Sparkles, 
  ExternalLink,
  Flame,
  Calendar,
  Building2,
  Newspaper,
  Globe,
  ArrowUpRight,
  Bot,
  Search,
  Youtube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Trend, TrendCategory } from '../types';
import { VOLUME_COLORS, SENTIMENT_COLORS } from '../types';

interface TrendCardProps {
  trend: Trend;
  onCreateContent?: (trend: Trend) => void;
}

const CATEGORY_ICONS: Record<TrendCategory, React.ReactNode> = {
  viral: <Flame className="w-4 h-4" />,
  emerging: <TrendingUp className="w-4 h-4" />,
  seasonal: <Calendar className="w-4 h-4" />,
  industry: <Building2 className="w-4 h-4" />,
  news: <Newspaper className="w-4 h-4" />,
  cultural: <Globe className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<TrendCategory, string> = {
  viral: 'bg-red-50 text-red-600 border-red-100',
  emerging: 'bg-green-50 text-green-600 border-green-100',
  seasonal: 'bg-amber-50 text-amber-600 border-amber-100',
  industry: 'bg-blue-50 text-blue-600 border-blue-100',
  news: 'bg-purple-50 text-purple-600 border-purple-100',
  cultural: 'bg-teal-50 text-teal-600 border-teal-100',
};

export function TrendCard({ trend, onCreateContent }: TrendCardProps) {
  const handleCreateContent = () => {
    onCreateContent?.(trend);
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-slate-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200 overflow-hidden group">
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {/* Source Badge */}
            <div className={cn(
              'px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1',
              trend.source === 'youtube'
                ? 'bg-rose-100 text-rose-700'
                : trend.source === 'google' 
                  ? 'bg-red-100 text-red-700'
                  : trend.source === 'news' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-cyan-100 text-cyan-700'
            )}>
              {trend.source === 'youtube' ? (
                <>
                  <Youtube className="w-3 h-3" />
                  YOUTUBE
                </>
              ) : trend.source === 'google' ? (
                <>
                  <Search className="w-3 h-3" />
                  TRENDING
                </>
              ) : trend.source === 'news' ? (
                <>
                  <Newspaper className="w-3 h-3" />
                  NEWS
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3" />
                  AI
                </>
              )}
            </div>
            
            {/* Category Badge */}
            <div className={cn(
              'px-2 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 border',
              CATEGORY_COLORS[trend.category]
            )}>
              {CATEGORY_ICONS[trend.category]}
              <span className="capitalize">{trend.category}</span>
            </div>
          </div>
          
          {/* Relevance Score */}
          <div className={cn('flex items-center gap-1 text-sm font-bold', getRelevanceColor(trend.relevanceScore))}>
            <TrendingUp className="w-4 h-4" />
            {trend.relevanceScore}%
          </div>
        </div>
        
        {/* Title */}
        <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors">
          {trend.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">
          {trend.description}
        </p>
        
        {/* Volume & Sentiment */}
        <div className="flex items-center gap-2 mb-3">
          <span className={cn('px-2 py-0.5 rounded text-xs font-medium capitalize', VOLUME_COLORS[trend.volume])}>
            {trend.volume === 'viral' ? 'Viral' : trend.volume.charAt(0).toUpperCase() + trend.volume.slice(1)} Volume
          </span>
          <span className={cn('px-2 py-0.5 rounded text-xs font-medium capitalize', SENTIMENT_COLORS[trend.sentiment])}>
            {trend.sentiment}
          </span>
        </div>
        
        {/* Timeframe */}
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="w-3 h-3" />
          {trend.timeframe}
        </div>
      </div>
      
      {/* Hashtags */}
      {trend.hashtags.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-1 mb-2 text-xs text-slate-500">
            <Hash className="w-3 h-3" />
            Suggested Hashtags
          </div>
          <div className="flex flex-wrap gap-1">
            {trend.hashtags.slice(0, 4).map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-white rounded text-xs text-indigo-600 font-medium border border-indigo-100">
                #{tag.replace('#', '')}
              </span>
            ))}
            {trend.hashtags.length > 4 && (
              <span className="px-2 py-0.5 text-xs text-slate-400">
                +{trend.hashtags.length - 4}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Content Angles */}
      {trend.contentAngles.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100">
          <div className="flex items-center gap-1 mb-2 text-xs text-slate-500">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Content Ideas
          </div>
          <ul className="space-y-1">
            {trend.contentAngles.slice(0, 2).map((angle, idx) => (
              <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                <ArrowUpRight className="w-3 h-3 mt-0.5 text-indigo-400 shrink-0" />
                <span className="line-clamp-1">{angle}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Source Link */}
      {(trend.source === 'news' || trend.source === 'google' || trend.source === 'youtube') && trend.newsUrl && (
        <div className={cn(
          'px-5 py-2 border-t',
          trend.source === 'youtube'
            ? 'bg-rose-50 border-rose-100'
            : trend.source === 'google' 
              ? 'bg-red-50 border-red-100' 
              : 'bg-purple-50 border-purple-100'
        )}>
          <a 
            href={trend.newsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-2 text-xs transition-colors',
              trend.source === 'youtube'
                ? 'text-rose-700 hover:text-rose-900'
                : trend.source === 'google'
                  ? 'text-red-700 hover:text-red-900'
                  : 'text-purple-700 hover:text-purple-900'
            )}
          >
            {trend.source === 'youtube' ? (
              <Youtube className="w-3.5 h-3.5" />
            ) : trend.source === 'google' ? (
              <Search className="w-3.5 h-3.5" />
            ) : (
              <Newspaper className="w-3.5 h-3.5" />
            )}
            <span className="font-medium truncate">
              {trend.source === 'youtube' ? 'Watch on YouTube' : `Source: ${trend.newsSource}`}
            </span>
            <ExternalLink className="w-3 h-3 ml-auto shrink-0" />
          </a>
        </div>
      )}

      {/* Action */}
      <div className="px-5 py-3 border-t border-slate-100">
        <Button 
          onClick={handleCreateContent}
          size="sm"
          className="w-full"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Create Content
          <ExternalLink className="w-3 h-3 ml-2" />
        </Button>
      </div>
    </div>
  );
}
