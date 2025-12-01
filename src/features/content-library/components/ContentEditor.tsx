'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { SavedContent } from '../types';
import { ContentStatus, CONTENT_STATUS_CONFIG } from '../types';

interface ContentEditorProps {
  content: SavedContent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<SavedContent>) => void;
  onStatusChange: (id: string, status: ContentStatus) => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  content,
  isOpen,
  onClose,
  onSave,
  onStatusChange,
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [status, setStatus] = useState<ContentStatus>(ContentStatus.DRAFT);

  // Reset form when content changes
  useEffect(() => {
    if (content) {
      setTitle(content.title);
      setBody(content.body);
      setHashtags(content.hashtags || []);
      setStatus(content.status);
    }
  }, [content]);

  const handleAddHashtag = () => {
    if (hashtagInput.trim()) {
      const tag = hashtagInput.startsWith('#') ? hashtagInput : `#${hashtagInput}`;
      if (!hashtags.includes(tag)) {
        setHashtags([...hashtags, tag]);
      }
      setHashtagInput('');
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddHashtag();
    }
  };

  const handleSave = () => {
    if (!content) return;
    
    onSave(content.id, {
      title,
      body,
      hashtags,
    });

    if (status !== content.status) {
      onStatusChange(content.id, status);
    }

    onClose();
  };

  if (!content) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Edit Content
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase">
              {content.platform}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Status Selector */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(CONTENT_STATUS_CONFIG)
                .filter(([key]) => key !== ContentStatus.ARCHIVED && key !== ContentStatus.PUBLISHED)
                .map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setStatus(key as ContentStatus)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      status === key
                        ? `${config.bgColor} ${config.color} border-current`
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {config.label}
                  </button>
                ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Content title..."
            />
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label htmlFor="body">Content</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[150px] resize-y"
              placeholder="Your content..."
            />
            <p className="text-xs text-slate-400 text-right">
              {body.length} characters
            </p>
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label>Hashtags</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Add hashtag..."
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddHashtag}
              >
                Add
              </Button>
            </div>
            
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map(tag => (
                  <span 
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-lg"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveHashtag(tag)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Metadata Info */}
          <div className="pt-4 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-500">
              <div>
                <span className="font-medium">Created:</span>{' '}
                {new Date(content.createdAt).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Updated:</span>{' '}
                {new Date(content.updatedAt).toLocaleDateString()}
              </div>
              {content.estimatedReach && (
                <div>
                  <span className="font-medium">Est. Reach:</span>{' '}
                  {content.estimatedReach}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
