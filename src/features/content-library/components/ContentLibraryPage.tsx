'use client';

import React, { useState } from 'react';
import { 
  FolderOpen, 
  Search,
  Plus,
  Trash2,
  CheckSquare,
  X,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentLibrary } from '../context/ContentLibraryContext';
import { useContentFilters } from '../hooks/use-content-filters';
import { ContentCard } from './ContentCard';
import { ContentEditor } from './ContentEditor';
import type { SavedContent } from '../types';
import { ContentStatus } from '../types';
import { cn } from '@/lib/utils';
import { useScheduler } from '@/features/scheduling';
import type { ContentIdea } from '@/features/content-generator';

const statusTabs = [
  { key: 'all', label: 'All' },
  { key: ContentStatus.DRAFT, label: 'Drafts' },
  { key: ContentStatus.READY, label: 'Ready' },
  { key: ContentStatus.SCHEDULED, label: 'Scheduled' },
  { key: ContentStatus.PUBLISHED, label: 'Published' },
  { key: ContentStatus.ARCHIVED, label: 'Archived' },
];

export const ContentLibraryPage: React.FC = () => {
  const { 
    contents, 
    isLoading, 
    updateContent, 
    deleteContent, 
    archiveContent,
  } = useContentLibrary();
  
  const { schedulePost } = useScheduler();
  
  const {
    filteredContents,
    filters,
    setStatusFilter,
    setSearchFilter,
    counts,
    hasActiveFilters,
    clearFilters,
  } = useContentFilters({ contents });

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);

  // Editor state
  const [editingContent, setEditingContent] = useState<SavedContent | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Handlers
  const handleEdit = (content: SavedContent) => {
    setEditingContent(content);
    setIsEditorOpen(true);
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setEditingContent(null);
  };

  const handleSave = (id: string, updates: Partial<SavedContent>) => {
    updateContent(id, updates);
  };

  const handleStatusChange = (id: string, status: ContentStatus) => {
    updateContent(id, { status });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      deleteContent(id);
      selectedIds.delete(id);
      setSelectedIds(new Set(selectedIds));
    }
  };

  const handleSchedule = (content: SavedContent) => {
    // Convert SavedContent to ContentIdea for scheduler
    const idea: ContentIdea = {
      title: content.title,
      description: content.body,
      platform: content.platform,
      estimatedReach: content.estimatedReach || 'Unknown',
      suggestedTags: content.hashtags,
      rationale: content.rationale || '',
    };
    schedulePost(idea);
    updateContent(content.id, { status: ContentStatus.SCHEDULED });
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredContents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContents.map(c => c.id)));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.size} items?`)) {
      selectedIds.forEach(id => deleteContent(id));
      setSelectedIds(new Set());
      setIsSelecting(false);
    }
  };

  const getTabCount = (key: string): number => {
    if (key === 'all') return counts.all;
    return counts[key as keyof typeof counts] || 0;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-start justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-indigo-600" />
            Content Library
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your saved content ideas and drafts
          </p>
        </div>

        {isSelecting ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">
              {selectedIds.size} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              <CheckSquare className="w-4 h-4 mr-1" />
              {selectedIds.size === filteredContents.length ? 'Deselect All' : 'Select All'}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={selectedIds.size === 0}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsSelecting(false);
                setSelectedIds(new Set());
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSelecting(true)}
          >
            <CheckSquare className="w-4 h-4 mr-1" />
            Select
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Status Tabs */}
        <div className="flex gap-1 flex-wrap">
          {statusTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key === 'all' ? undefined : tab.key as ContentStatus)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                (filters.status === tab.key || (tab.key === 'all' && !filters.status))
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              {tab.label}
              <span className="ml-1 text-xs opacity-60">
                ({getTabCount(tab.key)})
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search content..."
            value={filters.search || ''}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Content Grid */}
      {filteredContents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContents.map(content => (
            <ContentCard
              key={content.id}
              content={content}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSchedule={handleSchedule}
              onStatusChange={handleStatusChange}
              onArchive={archiveContent}
              isSelected={selectedIds.has(content.id)}
              onSelect={isSelecting ? handleSelect : undefined}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                {hasActiveFilters ? 'No content matches your filters' : 'No content saved yet'}
              </h3>
              <p className="text-slate-500 mb-4">
                {hasActiveFilters 
                  ? 'Try adjusting your filters or search terms'
                  : 'Generate content with AI and save it here for later use'
                }
              </p>
              {hasActiveFilters ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={() => window.location.href = '/content'}>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Content
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Editor Modal */}
      <ContentEditor
        content={editingContent}
        isOpen={isEditorOpen}
        onClose={handleEditorClose}
        onSave={handleSave}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};
