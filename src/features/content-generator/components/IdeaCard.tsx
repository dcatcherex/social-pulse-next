'use client';

import React from 'react';
import { Copy, Check, CalendarPlus, FolderPlus } from 'lucide-react';
import type { ContentIdea } from '../types';

interface IdeaCardProps {
  idea: ContentIdea;
  index: number;
  copiedId: number | null;
  scheduledId: number | null;
  savedId?: number | null;
  onCopy: (text: string, index: number) => void;
  onSchedule: (idea: ContentIdea, index: number) => void;
  onSave?: (idea: ContentIdea, index: number) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  index,
  copiedId,
  scheduledId,
  savedId,
  onCopy,
  onSchedule,
  onSave,
}) => {
  const fullText = `${idea.title}\n\n${idea.description}\n\n${idea.suggestedTags.join(' ')}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase">
            {idea.platform}
          </span>
          <span className="text-xs text-emerald-600 font-medium">
            Est. Reach: {idea.estimatedReach}
          </span>
        </div>
        
        <h3 className="font-bold text-lg text-slate-900 mb-2">{idea.title}</h3>
        <p className="text-sm text-slate-600 mb-4 flex-1 whitespace-pre-wrap leading-relaxed">
          {idea.description}
        </p>
        
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-400 mb-1">Recommended Hashtags</p>
          <div className="flex flex-wrap gap-1">
            {idea.suggestedTags.map(tag => (
              <span key={tag} className="text-xs text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50 mt-auto flex gap-2">
          <button
            onClick={() => onCopy(fullText, index)}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {copiedId === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedId === index ? 'Copied' : 'Copy'}
          </button>
          
          {onSave && (
            <button
              onClick={() => onSave(idea, index)}
              disabled={savedId === index}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${
                savedId === index 
                  ? 'bg-purple-50 text-purple-600' 
                  : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50 border border-slate-200'
              }`}
            >
              {savedId === index ? <Check className="w-4 h-4" /> : <FolderPlus className="w-4 h-4" />}
              {savedId === index ? 'Saved' : 'Save'}
            </button>
          )}
          
          <button
            onClick={() => onSchedule(idea, index)}
            disabled={scheduledId === index}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${
              scheduledId === index 
                ? 'bg-emerald-50 text-emerald-600' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {scheduledId === index ? <Check className="w-4 h-4" /> : <CalendarPlus className="w-4 h-4" />}
            {scheduledId === index ? 'Added' : 'Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};
