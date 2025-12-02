import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(request: NextRequest) {
  try {
    const { mentions } = await request.json();

    if (!mentions || mentions.length === 0) {
      return NextResponse.json({ analysis: 'No data to analyze.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Return demo analysis if no API key
      return NextResponse.json({
        analysis: getDemoAnalysis(mentions),
      });
    }

    const mentionsText = mentions
      .map((m: { platform: string; content: string; sentiment: string }) => 
        `[${m.platform}] ${m.content} (Sentiment: ${m.sentiment})`
      )
      .join('\n');

    const prompt = `
      Analyze these social media mentions for a small business. 
      Identify:
      1. The main recurring pain point or praise.
      2. A specific actionable tip to improve reputation.
      3. Any potential PR crisis warnings.
      
      Keep it concise (under 100 words).
      
      Mentions:
      ${mentionsText}
    `;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    return NextResponse.json({
      analysis: response.text || 'Analysis failed.',
    });
  } catch (error) {
    console.error('Error analyzing mentions:', error);
    return NextResponse.json(
      { error: 'Failed to analyze mentions', analysis: 'Could not perform analysis.' },
      { status: 500 }
    );
  }
}

function getDemoAnalysis(mentions: Array<{ sentiment: string }>) {
  const positive = mentions.filter((m) => m.sentiment === 'positive').length;
  const negative = mentions.filter((m) => m.sentiment === 'negative').length;
  
  if (negative > positive) {
    return `⚠️ Warning: Negative sentiment is dominating your mentions (${negative} negative vs ${positive} positive). 
    
Key Issue: Response time seems to be a recurring concern.

Action: Consider setting up auto-replies and prioritizing support tickets. Address concerns publicly to show responsiveness.`;
  }
  
  return `✨ Great news! Positive sentiment leads your mentions (${positive} positive vs ${negative} negative).

Key Praise: Users love your features and ease of use.

Action: Leverage these positive mentions in testimonials. Consider a referral program to capitalize on happy customers.`;
}
