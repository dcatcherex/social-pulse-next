import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(request: NextRequest) {
  try {
    const { brandName, industry, competitors, count = 6 } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      // Return demo data if no API key
      return NextResponse.json({
        mentions: generateDemoMentions(brandName, competitors, count),
      });
    }

    const prompt = `
      Generate ${count} realistic social media posts or comments mentioning the brand "${brandName}" 
      which operates in the "${industry}" industry.
      Include a mix of positive, neutral, and negative sentiments.
      Some should be questions, some complaints, some praise.
      ${competitors?.length > 0 ? `Also include 1-2 mentions of competitors: ${competitors.join(', ')}.` : ''}
      Platforms should vary between Instagram, TikTok, X (Twitter), and LinkedIn.
      Return strictly JSON.
    `;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              author: { type: Type.STRING },
              content: { type: Type.STRING },
              platform: { type: Type.STRING },
              sentiment: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] },
              engagement: { type: Type.INTEGER },
              isCompetitor: { type: Type.BOOLEAN },
            },
          },
        },
      },
    });

    const mentions = JSON.parse(response.text || '[]');

    return NextResponse.json({ mentions });
  } catch (error) {
    console.error('Error generating mentions:', error);
    return NextResponse.json(
      { error: 'Failed to generate mentions', mentions: [] },
      { status: 500 }
    );
  }
}

function generateDemoMentions(brandName: string, competitors: string[], count: number) {
  const platforms = ['Instagram', 'X (Twitter)', 'TikTok', 'LinkedIn'];
  const templates = [
    { sentiment: 'positive', content: `Love using ${brandName}! Best decision for my business 🚀` },
    { sentiment: 'positive', content: `Just discovered ${brandName} and wow, the features are amazing!` },
    { sentiment: 'negative', content: `Having some issues with ${brandName} today. Anyone else?` },
    { sentiment: 'neutral', content: `Comparing ${brandName} with other tools. What do you think?` },
    { sentiment: 'positive', content: `${brandName} helped me grow my following by 200%! Highly recommend.` },
    { sentiment: 'negative', content: `${brandName} support needs improvement. Been waiting for 3 days.` },
  ];

  const mentions = [];
  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    const isCompetitor = competitors?.length > 0 && i === count - 1;
    
    mentions.push({
      author: `@user${Math.floor(Math.random() * 1000)}`,
      content: isCompetitor 
        ? `Just switched from ${brandName} to ${competitors[0]}. Thoughts?`
        : template.content,
      platform: platforms[i % platforms.length],
      sentiment: isCompetitor ? 'neutral' : template.sentiment,
      engagement: Math.floor(Math.random() * 500) + 10,
      isCompetitor,
    });
  }

  return mentions;
}
