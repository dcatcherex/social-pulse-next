import { Platform, SentimentType } from '@/shared/types';

export interface Mention {
  id: string;
  author: string;
  content: string;
  platform: Platform;
  timestamp: string;
  sentiment: SentimentType;
  engagement: number;
  isCompetitor?: boolean;
}

export interface MentionFilter {
  sentiment?: SentimentType;
  platform?: Platform;
  isCompetitor?: boolean;
}

export type FilterType = 'all' | 'negative' | 'competitor';
