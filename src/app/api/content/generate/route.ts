import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import type { ContentGenerationRequest, ContentIdea } from '@/features/content-generator/types';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

/**
 * Build brand context from request for AI prompts
 */
function buildBrandContext(brandContext: ContentGenerationRequest['brandContext']): string {
  if (!brandContext) return 'No specific brand context provided.';
  
  const parts: string[] = [];
  
  // Brand basics
  parts.push(`Brand: "${brandContext.name}" in the "${brandContext.industry}" sector.`);
  
  // Tagline & USP
  if (brandContext.tagline) {
    parts.push(`Tagline: "${brandContext.tagline}"`);
  }
  if (brandContext.uniqueSellingPoint) {
    parts.push(`Unique Selling Point: ${brandContext.uniqueSellingPoint}`);
  }
  
  // Brand Voice
  if (brandContext.brandVoice) {
    parts.push(`Tone of Voice: ${brandContext.brandVoice.tone}`);
    if (brandContext.brandVoice.personality?.length) {
      parts.push(`Brand Personality: ${brandContext.brandVoice.personality.join(', ')}`);
    }
    if (brandContext.brandVoice.avoidWords?.length) {
      parts.push(`NEVER use these words: ${brandContext.brandVoice.avoidWords.join(', ')}`);
    }
  }
  
  // Target Audience
  if (brandContext.targetAudience) {
    const audience = brandContext.targetAudience;
    parts.push(`Target Audience: ${audience.demographics || 'General audience'}, Age: ${audience.ageRange}`);
    if (audience.interests?.length) {
      parts.push(`Their interests: ${audience.interests.join(', ')}`);
    }
    if (audience.painPoints?.length) {
      parts.push(`Their pain points: ${audience.painPoints.join(', ')}`);
    }
  }
  
  // Brand Values
  if (brandContext.values?.length) {
    parts.push(`Brand Values: ${brandContext.values.join(', ')}`);
  }
  
  return parts.join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const body: ContentGenerationRequest = await request.json();
    const { topic, language = 'English', tone = 'Professional', targetAudience = 'General Audience', brandContext } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Return demo data if no API key
      return NextResponse.json(getDemoIdeas(topic));
    }

    const brandContextStr = buildBrandContext(brandContext);
    const effectiveTone = tone || brandContext?.brandVoice?.tone || 'Professional';
    const effectiveAudience = targetAudience || brandContext?.targetAudience?.demographics || 'General Audience';

    const prompt = `
      Act as a social media manager with deep understanding of this brand:
      
      === BRAND IDENTITY ===
      ${brandContextStr}
      
      === TASK ===
      The current trending topic/keyword is "${topic}".
      
      CRITICAL INSTRUCTIONS:
      1. Target Audience Language: ${language}. (All titles and descriptions MUST be in ${language}).
      2. Tone of Voice: ${effectiveTone}. Stay consistent with the brand personality.
      3. Target Audience: ${effectiveAudience}. Address their interests and pain points.
      4. Make content feel authentic to the brand's voice and values.
      5. Never use words the brand wants to avoid.
      
      Generate 3 distinct content ideas that capitalize on this trend while staying true to brand identity.
      Return strictly JSON.
    `;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              platform: { type: Type.STRING },
              estimatedReach: { type: Type.STRING },
              suggestedTags: { type: Type.ARRAY, items: { type: Type.STRING } },
              rationale: { type: Type.STRING }
            }
          }
        }
      }
    });

    const ideas: ContentIdea[] = JSON.parse(response.text || '[]');
    return NextResponse.json(ideas);

  } catch (error) {
    console.error('Content generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to generate content: ${errorMessage}` },
      { status: 500 }
    );
  }
}

function getDemoIdeas(topic: string): ContentIdea[] {
  return [
    {
      title: `🚀 How ${topic} is Changing the Game`,
      description: `Discover why ${topic} is the next big thing everyone's talking about. Here's what you need to know to stay ahead of the curve...`,
      platform: 'linkedin',
      estimatedReach: '5K-10K',
      suggestedTags: [`#${topic.replace(/\s+/g, '')}`, '#TrendingNow', '#Innovation', '#Industry'],
      rationale: 'Educational content performs well on LinkedIn, establishing thought leadership.'
    },
    {
      title: `The Ultimate ${topic} Guide 📚`,
      description: `Everything you need to know about ${topic} in one thread. Save this for later! 🔖\n\n1. What it is\n2. Why it matters\n3. How to get started\n4. Pro tips`,
      platform: 'twitter',
      estimatedReach: '2K-5K',
      suggestedTags: [`#${topic.replace(/\s+/g, '')}`, '#Thread', '#Guide', '#MustRead'],
      rationale: 'Thread format drives engagement and saves on Twitter.'
    },
    {
      title: `POV: You just discovered ${topic} ✨`,
      description: `That moment when you realize ${topic} changes everything... 🤯\n\nDrop a 🔥 if you're already on this trend!`,
      platform: 'instagram',
      estimatedReach: '10K-20K',
      suggestedTags: [`#${topic.replace(/\s+/g, '')}`, '#Trending', '#ViralContent', '#ReelsContent'],
      rationale: 'POV format and emojis drive engagement on Instagram Reels.'
    }
  ];
}
