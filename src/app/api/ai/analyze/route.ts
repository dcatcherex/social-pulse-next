import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

/**
 * POST /api/ai/analyze
 * Analyzes trends with Gemini AI to generate content suggestions
 */
export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'Gemini API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { items, industry, brandName, type } = body;

    if (!items || !industry || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: items, industry, type' },
        { status: 400 }
      );
    }

    const client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    let prompt = '';
    
    if (type === 'trends') {
      // Analyze Google Trends
      const trendsContext = items.slice(0, 5).map((t: { query: string; formattedTraffic: string }, i: number) => 
        `${i + 1}. "${t.query}" (${t.formattedTraffic} searches)`
      ).join('\n');

      prompt = `
        You are a social media strategist for a "${industry}" brand${brandName ? ` called "${brandName}"` : ''}.
        
        Here are today's Google trending searches:
        ${trendsContext}
        
        For each trend, analyze:
        1. Rate relevance to the industry (1-100) - be strict
        2. Suggest 2 content ideas related to this trend
        3. Recommend 3-4 hashtags
        4. Identify best platforms (TikTok, Instagram, Twitter, LinkedIn, YouTube)
        5. Assess viral potential (low, medium, high, viral)
        
        Return JSON array with one object per trend.
      `;
    } else if (type === 'youtube') {
      // Analyze YouTube videos
      const videosContext = items.slice(0, 5).map((v: { title: string; channelTitle: string; viewCount: string }, i: number) => 
        `${i + 1}. "${v.title}" by ${v.channelTitle} (${formatViewCount(v.viewCount)} views)`
      ).join('\n');

      prompt = `
        You are a social media strategist for a "${industry}" brand${brandName ? ` called "${brandName}"` : ''}.
        
        Here are today's YouTube trending videos:
        ${videosContext}
        
        For each video, analyze:
        1. Rate relevance to the industry (1-100) - be strict
        2. Suggest 2 content ideas inspired by this trend
        3. Recommend 3-4 hashtags
        4. Identify best platforms to post similar content
        5. Assess viral potential (low, medium, high, viral)
        
        Return JSON array with one object per video.
      `;
    } else if (type === 'news') {
      // Analyze news articles
      const newsContext = items.slice(0, 5).map((a: { title: string; source: string }, i: number) => 
        `${i + 1}. "${a.title}" (${a.source})`
      ).join('\n');

      prompt = `
        You are a social media strategist for a "${industry}" brand${brandName ? ` called "${brandName}"` : ''}.
        
        Here are today's news headlines:
        ${newsContext}
        
        For each headline, analyze:
        1. Rate relevance to the industry (1-100) - be strict
        2. Suggest 2 content angles for social media
        3. Recommend 3-4 hashtags
        4. Identify best platforms
        5. Assess viral potential (low, medium, high, viral)
        
        Return JSON array with one object per headline.
      `;
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              relevanceScore: { type: Type.NUMBER },
              contentAngles: { type: Type.ARRAY, items: { type: Type.STRING } },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
              volume: { type: Type.STRING },
            },
          },
        },
      },
    });

    const analyses = JSON.parse(response.text || '[]');
    
    return NextResponse.json({ analyses });
  } catch (error) {
    console.error('[API/ai/analyze] Error:', error);
    return NextResponse.json(
      { error: 'AI analysis failed' },
      { status: 500 }
    );
  }
}

function formatViewCount(count: string): string {
  const num = parseInt(count, 10);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return count;
}
