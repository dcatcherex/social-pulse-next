'use client';

import React from 'react';
import { Heart, MessageSquare, Share2, OctagonAlert } from 'lucide-react';
import { Platform } from '@/shared/types';
import type { Mention } from '../types';

interface MentionCardProps {
  mention: Mention;
  onReply?: (mention: Mention) => void;
  onEscalate?: (mention: Mention) => void;
}

const getPlatformStyle = (platform: string): string => {
  switch (platform) {
    case Platform.INSTAGRAM:
      return 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500';
    case Platform.TWITTER:
      return 'bg-black';
    case Platform.TIKTOK:
      return 'bg-black border border-slate-700';
    case Platform.LINKEDIN:
      return 'bg-blue-700';
    case Platform.FACEBOOK:
      return 'bg-blue-600';
    default:
      return 'bg-slate-600';
  }
};

const getSentimentStyle = (sentiment: string): string => {
  switch (sentiment) {
    case 'positive':
      return 'bg-emerald-100 text-emerald-700';
    case 'negative':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-600';
  }
};

export const MentionCard: React.FC<MentionCardProps> = ({ 
  mention, 
  onReply,
  onEscalate 
}) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getPlatformStyle(mention.platform)}`}>
            {mention.platform.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{mention.author}</span>
              {mention.isCompetitor && (
                <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Competitor
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400">
              {new Date(mention.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getSentimentStyle(mention.sentiment)}`}>
          {mention.sentiment}
        </div>
      </div>
      
      <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-4">
        {mention.content}
      </p>

      <div className="flex items-center gap-6 text-slate-400 text-sm border-t border-slate-50 pt-3 mt-2">
        <div className="flex items-center gap-1.5 hover:text-pink-500 cursor-pointer transition-colors">
          <Heart className="w-4 h-4" />
          <span>{mention.engagement}</span>
        </div>
        <button 
          onClick={() => onReply?.(mention)}
          className="flex items-center gap-1.5 hover:text-blue-500 cursor-pointer transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Reply</span>
        </button>
        <div className="flex items-center gap-1.5 hover:text-indigo-500 cursor-pointer transition-colors">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </div>
        {mention.sentiment === 'negative' && (
          <button 
            onClick={() => onEscalate?.(mention)}
            className="ml-auto flex items-center gap-1.5 text-red-500 hover:text-red-600 cursor-pointer"
          >
            <OctagonAlert className="w-4 h-4" />
            <span className="font-medium">Escalate</span>
          </button>
        )}
      </div>
    </div>
  );
};
