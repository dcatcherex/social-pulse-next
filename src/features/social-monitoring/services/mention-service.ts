import type { BrandProfile } from '@/features/brand-management';
import type { Mention } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

interface FetchMentionsRequest {
  brandName: string;
  industry: string;
  competitors: string[];
  count?: number;
}

interface AnalyzeInsightsRequest {
  mentions: Array<{
    platform: string;
    content: string;
    sentiment: string;
  }>;
}

/**
 * Fetch mentions from API route (AI-powered)
 */
export const fetchMentions = async (
  profile: BrandProfile,
  count: number = 6
): Promise<Mention[]> => {
  try {
    const response = await fetch('/api/mentions/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brandName: profile.name,
        industry: profile.industry,
        competitors: profile.competitors || [],
        count,
      } as FetchMentionsRequest),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch mentions');
    }

    const data = await response.json();
    
    return data.mentions.map((item: Record<string, unknown>) => ({
      id: generateId(),
      author: item.author as string,
      content: item.content as string,
      platform: item.platform as string,
      sentiment: item.sentiment as string,
      engagement: item.engagement as number,
      isCompetitor: (item.isCompetitor as boolean) || false,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching mentions:', error);
    return [];
  }
};

/**
 * Analyze mentions for strategic insights
 */
export const analyzeInsights = async (mentions: Mention[]): Promise<string> => {
  if (mentions.length === 0) return 'No data to analyze.';

  try {
    const response = await fetch('/api/mentions/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mentions: mentions.map((m) => ({
          platform: m.platform,
          content: m.content,
          sentiment: m.sentiment,
        })),
      } as AnalyzeInsightsRequest),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze mentions');
    }

    const data = await response.json();
    return data.analysis || 'Analysis failed.';
  } catch (error) {
    console.error('Error analyzing mentions:', error);
    return 'Could not perform analysis.';
  }
};
