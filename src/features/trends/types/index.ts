export interface Trend {
  id: string;
  title: string;
  description: string;
  category: TrendCategory;
  relevanceScore: number; // 1-100
  volume: TrendVolume;
  sentiment: TrendSentiment;
  hashtags: string[];
  contentAngles: string[];
  platforms: string[];
  timeframe: string;
  source: 'ai' | 'news' | 'google' | 'youtube';
  newsSource?: string;
  newsUrl?: string;
}

export type TrendCategory = 
  | 'viral'
  | 'emerging'
  | 'seasonal'
  | 'industry'
  | 'news'
  | 'cultural';

export type TrendVolume = 'low' | 'medium' | 'high' | 'viral';
export type TrendSentiment = 'positive' | 'neutral' | 'negative' | 'mixed';

export interface TrendFilters {
  category?: TrendCategory;
  minRelevance?: number;
  source?: Trend['source'];
}

export interface TrendCache {
  trends: Trend[];
  timestamp: number;
  industry: string;
  keywords: string[];
}

export const TREND_CATEGORIES: { value: TrendCategory; label: string; icon: string }[] = [
  { value: 'viral', label: 'Viral Now', icon: '🔥' },
  { value: 'emerging', label: 'Emerging', icon: '📈' },
  { value: 'seasonal', label: 'Seasonal', icon: '🗓️' },
  { value: 'industry', label: 'Industry', icon: '🏢' },
  { value: 'news', label: 'News', icon: '📰' },
  { value: 'cultural', label: 'Cultural', icon: '🌍' },
];

export const VOLUME_COLORS: Record<TrendVolume, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  viral: 'bg-red-100 text-red-700',
};

export const SENTIMENT_COLORS: Record<TrendSentiment, string> = {
  positive: 'bg-green-100 text-green-700',
  neutral: 'bg-slate-100 text-slate-600',
  negative: 'bg-red-100 text-red-700',
  mixed: 'bg-purple-100 text-purple-700',
};

export const TREND_CACHE_TTL = 30 * 60 * 1000; // 30 minutes
export const TREND_CACHE_KEY = 'social-pulse-trends';

// YouTube Settings Types
export interface YouTubeSettings {
  searchMode: 'trending' | 'keyword';
  minRelevance: number;
  categoryId: string;
  includeGlobalTrends: boolean;
}

export const DEFAULT_YOUTUBE_SETTINGS: YouTubeSettings = {
  searchMode: 'keyword',
  minRelevance: 50,
  categoryId: '',
  includeGlobalTrends: false,
};

export const YOUTUBE_CATEGORIES = [
  { id: '', label: 'Auto (Based on Industry)' },
  { id: '27', label: 'Education' },
  { id: '19', label: 'Travel & Events' },
  { id: '28', label: 'Science & Technology' },
  { id: '22', label: 'People & Blogs' },
  { id: '26', label: 'Howto & Style' },
  { id: '24', label: 'Entertainment' },
  { id: '17', label: 'Sports' },
  { id: '10', label: 'Music' },
  { id: '20', label: 'Gaming' },
  { id: '25', label: 'News & Politics' },
] as const;

export const RELEVANCE_THRESHOLDS = [
  { value: 0, label: 'Show All' },
  { value: 30, label: '30%+ (Low filter)' },
  { value: 50, label: '50%+ (Recommended)' },
  { value: 70, label: '70%+ (High filter)' },
  { value: 85, label: '85%+ (Very strict)' },
] as const;

export const YOUTUBE_SETTINGS_KEY = 'social-pulse-youtube-settings';
