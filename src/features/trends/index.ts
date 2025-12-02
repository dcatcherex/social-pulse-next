// Components
export { TrendCard } from './components/trend-card';
export { TrendsSkeleton, TrendCardSkeleton } from './components/trends-skeleton';
export { EmptyTrends } from './components/empty-trends';

// Hooks
export { useTrends, useTrendById } from './hooks/use-trends';

// Services
export { discoverTrends, refreshTrends, getCachedTrends, clearTrendCache } from './services/trend-service';

// Types
export type { 
  Trend, 
  TrendCategory, 
  TrendVolume, 
  TrendSentiment, 
  TrendFilters,
  YouTubeSettings,
} from './types';

export { 
  TREND_CATEGORIES, 
  VOLUME_COLORS, 
  SENTIMENT_COLORS,
  TREND_CACHE_TTL,
  TREND_CACHE_KEY,
  DEFAULT_YOUTUBE_SETTINGS,
  YOUTUBE_CATEGORIES,
  RELEVANCE_THRESHOLDS,
  YOUTUBE_SETTINGS_KEY,
} from './types';
