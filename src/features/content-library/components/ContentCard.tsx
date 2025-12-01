'use client';

import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  CalendarPlus, 
  Pencil, 
  Trash2, 
  MoreVertical,
  Archive,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from './StatusBadge';
import type { SavedContent } from '../types';
import { ContentStatus } from '../types';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  content: SavedContent;
  onEdit: (content: SavedContent) => void;
  onDelete: (id: string) => void;
  onSchedule: (content: SavedContent) => void;
  onStatusChange: (id: string, status: ContentStatus) => void;
  onArchive: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  onEdit,
  onDelete,
  onSchedule,
  onStatusChange,
  onArchive,
  isSelected = false,
  onSelect,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullText = `${content.title}\n\n${content.body}\n\n${content.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className={cn(
        'bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col hover:shadow-md transition-all',
        isSelected ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-100'
      )}
    >
      {/* Header with gradient */}
      <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
      
      <div className="p-5 flex-1 flex flex-col">
        {/* Top row: Platform, Status, Menu */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase">
              {content.platform}
            </span>
            <StatusBadge status={content.status} />
          </div>
          
          <div className="flex items-center gap-1">
            {onSelect && (
              <button
                onClick={() => onSelect(content.id)}
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                  isSelected 
                    ? 'bg-indigo-600 border-indigo-600' 
                    : 'border-slate-300 hover:border-indigo-400'
                )}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(content)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {content.status === ContentStatus.DRAFT && (
                  <DropdownMenuItem onClick={() => onStatusChange(content.id, ContentStatus.READY)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Ready
                  </DropdownMenuItem>
                )}
                {content.status === ContentStatus.READY && (
                  <DropdownMenuItem onClick={() => onSchedule(content)}>
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    Schedule
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onArchive(content.id)}>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(content.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-slate-900 mb-2 line-clamp-2">
          {content.title}
        </h3>

        {/* Body */}
        <p className="text-sm text-slate-600 mb-3 flex-1 line-clamp-3 leading-relaxed">
          {content.body}
        </p>

        {/* Hashtags */}
        {content.hashtags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {content.hashtags.slice(0, 4).map(tag => (
                <span key={tag} className="text-xs text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
              {content.hashtags.length > 4 && (
                <span className="text-xs text-slate-400">
                  +{content.hashtags.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            {formatDate(content.updatedAt)}
          </div>
          
          {content.estimatedReach && (
            <span className="text-xs text-emerald-600 font-medium">
              Est. {content.estimatedReach}
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="pt-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex-1"
          >
            {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          
          {(content.status === ContentStatus.DRAFT || content.status === ContentStatus.READY) && (
            <Button
              size="sm"
              onClick={() => onSchedule(content)}
              className="flex-1"
            >
              <CalendarPlus className="w-4 h-4 mr-1" />
              Schedule
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
