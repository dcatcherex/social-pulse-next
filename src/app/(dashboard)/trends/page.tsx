'use client';

import { useState } from 'react';
import { RefreshCw, Filter, Sparkles, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  useTrends, 
  TrendCard, 
  TrendsSkeleton, 
  EmptyTrends,
  TREND_CATEGORIES,
  type TrendCategory 
} from '@/features/trends';

export default function TrendsPage() {
  const [selectedCategory, setSelectedCategory] = useState<TrendCategory | undefined>();
  const { 
    trends, 
    isLoading, 
    isFetching,
    isRefreshing, 
    refresh,
    error,
    industry,
    keywords,
  } = useTrends({ category: selectedCategory });

  const handleRefresh = () => {
    console.log('[TrendsPage] Refresh clicked');
    refresh();
  };

  const clearFilter = () => {
    setSelectedCategory(undefined);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Trend Discovery</h1>
            <div className="group relative">
              <Info className="w-4 h-4 text-slate-400 cursor-help" />
              <div className="absolute left-0 top-6 w-64 p-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                AI-powered trending topics relevant to your industry. Create content from trends to boost engagement.
              </div>
            </div>
          </div>
          <p className="text-slate-500 mt-1">
            Discover what&apos;s trending in <span className="font-medium text-slate-700">{industry}</span>
            {keywords.length > 0 && (
              <> based on your tracked keywords</>
            )}
          </p>
        </div>
        
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing || isFetching}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${(isRefreshing || isFetching) ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Trends'}
        </Button>
      </div>

      {/* Category Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Filter by Category</span>
          {selectedCategory && (
            <button 
              onClick={clearFilter}
              className="text-xs text-indigo-600 hover:text-indigo-700 ml-2"
            >
              Clear filter
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {TREND_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value === selectedCategory ? undefined : cat.value)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all
                ${selectedCategory === cat.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }
              `}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">Failed to load trends</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <Sparkles className="w-4 h-4" />
            Total Trends
          </div>
          <div className="text-2xl font-bold text-slate-900">{trends.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            🔥 Viral
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {trends.filter(t => t.category === 'viral').length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            ✨ High Relevance
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {trends.filter(t => t.relevanceScore >= 70).length}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {(isLoading || isFetching) && trends.length === 0 && (
        <TrendsSkeleton />
      )}

      {/* Empty State */}
      {!isLoading && !isFetching && trends.length === 0 && (
        <EmptyTrends onRefresh={handleRefresh} isLoading={isRefreshing} />
      )}

      {/* Trends Grid */}
      {trends.length > 0 && (
        <>
          {selectedCategory && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">
                Showing {trends.length} trends in
              </span>
              <Badge variant="secondary">{selectedCategory}</Badge>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trends.map((trend) => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </div>
        </>
      )}

      {/* Pro Tip */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-1">Pro Tip</h3>
            <p className="text-sm text-slate-600">
              Click &quot;Create Content&quot; on any trend to instantly generate AI-powered captions and posts 
              tailored to your brand voice. Trends with higher relevance scores are more likely to resonate 
              with your audience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
