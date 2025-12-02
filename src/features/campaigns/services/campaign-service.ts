'use server';

import type { CampaignDraft, GenerateCampaignRequest } from '../types';

/**
 * Generate a campaign strategy using AI
 * This is a server action that calls the Gemini API
 */
export async function generateCampaignStrategy(
  request: GenerateCampaignRequest
): Promise<CampaignDraft> {
  const { brandName, industry, goal, brandVoice, targetAudience } = request;

  // Check for API key
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn('No Gemini API key found, returning mock data');
    return generateMockCampaign(brandName, goal);
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are a marketing strategist. Create a campaign strategy for "${brandName}" (${industry}).
      
      Campaign Goal: "${goal}"
      ${brandVoice ? `Brand Voice: ${brandVoice}` : ''}
      ${targetAudience ? `Target Audience: ${targetAudience}` : ''}
      
      Provide:
      1. A catchy campaign name (max 50 characters)
      2. A compelling 2-sentence description
      3. The best 2-3 social platforms for this campaign (choose from: Instagram, Facebook, TikTok, LinkedIn, X (Twitter))
      4. Suggested campaign duration in days
      5. 3 content ideas for this campaign
      
      Return ONLY valid JSON in this exact format:
      {
        "name": "Campaign Name",
        "description": "Two sentence description here.",
        "platforms": ["Instagram", "TikTok"],
        "suggestedDuration": 30,
        "contentSuggestions": ["Idea 1", "Idea 2", "Idea 3"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as CampaignDraft;
    }
    
    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Error generating campaign:', error);
    return generateMockCampaign(brandName, goal);
  }
}

/**
 * Generate mock campaign data when API is unavailable
 */
function generateMockCampaign(brandName: string, goal: string): CampaignDraft {
  const templates = [
    {
      name: `${brandName} Growth Sprint`,
      description: `Strategic campaign to accelerate ${brandName}'s market presence. Focused on ${goal.toLowerCase()}.`,
      platforms: ['Instagram', 'TikTok', 'Facebook'],
      suggestedDuration: 30,
      contentSuggestions: [
        'Behind-the-scenes content showing brand authenticity',
        'User-generated content campaign with branded hashtag',
        'Educational carousel posts about industry insights',
      ],
    },
    {
      name: `${brandName} Awareness Blitz`,
      description: `High-impact awareness campaign designed to maximize reach. Targeting ${goal.toLowerCase()}.`,
      platforms: ['Instagram', 'LinkedIn', 'Facebook'],
      suggestedDuration: 21,
      contentSuggestions: [
        'Testimonial videos from satisfied customers',
        'Interactive polls and Q&A sessions',
        'Value-driven infographics',
      ],
    },
    {
      name: `${brandName} Engagement Drive`,
      description: `Community-focused initiative to boost engagement. Goal: ${goal.toLowerCase()}.`,
      platforms: ['TikTok', 'Instagram'],
      suggestedDuration: 14,
      contentSuggestions: [
        'Challenge or trend participation',
        'Live sessions with team members',
        'Story takeovers and day-in-the-life content',
      ],
    },
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}
