import { NextRequest, NextResponse } from 'next/server';
import type { ImageGenerationRequest, BrandContext } from '@/features/content-generator/types';
import { generateImage, getAvailableProviders } from '@/lib/ai-providers';

/**
 * Build brand-aware prompt enhancement from brand context
 */
function buildBrandImageContext(brandContext: BrandContext | undefined): string {
  if (!brandContext) return '';

  const parts: string[] = [];

  // Brand identity
  parts.push(`Brand: "${brandContext.name}" (${brandContext.industry} industry).`);

  // Brand voice affects visual style
  if (brandContext.brandVoice) {
    const tone = brandContext.brandVoice.tone;
    const personality = brandContext.brandVoice.personality?.slice(0, 3).join(', ');
    if (tone) {
      parts.push(`Visual style should feel ${tone}.`);
    }
    if (personality) {
      parts.push(`Brand personality: ${personality}.`);
    }
  }

  // Target audience influences imagery
  if (brandContext.targetAudience) {
    const { ageRange, demographics } = brandContext.targetAudience;
    if (ageRange && ageRange !== 'all') {
      parts.push(`Target audience: ${ageRange} age group.`);
    }
    if (demographics) {
      parts.push(`Demographics: ${demographics}.`);
    }
  }

  // Brand colors for visual consistency
  if (brandContext.colors) {
    const colorHints: string[] = [];
    if (brandContext.colors.primary) {
      colorHints.push(`primary color ${brandContext.colors.primary}`);
    }
    if (brandContext.colors.secondary) {
      colorHints.push(`secondary ${brandContext.colors.secondary}`);
    }
    if (brandContext.colors.accent) {
      colorHints.push(`accent ${brandContext.colors.accent}`);
    }
    if (colorHints.length > 0) {
      parts.push(`Brand colors: ${colorHints.join(', ')}. Incorporate these colors subtly.`);
    }
  }

  // Brand values
  if (brandContext.values && brandContext.values.length > 0) {
    parts.push(`Brand values: ${brandContext.values.slice(0, 3).join(', ')}.`);
  }

  return parts.length > 0 ? `\n\n[Brand Context]\n${parts.join('\n')}` : '';
}

export async function POST(request: NextRequest) {
  try {
    const body: ImageGenerationRequest = await request.json();
    const { prompt, brandContext } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Enhance prompt with brand context
    const brandEnhancement = buildBrandImageContext(brandContext);
    const enhancedPrompt = prompt + brandEnhancement;

    console.log('[Image API] Generating image with prompt:', prompt);
    console.log('[Image API] Brand context:', brandContext ? 'Yes' : 'No');
    console.log('[Image API] Options:', {
      model: body.model,
      aspectRatio: body.aspectRatio,
      imageStyle: body.imageStyle,
      hasProductImage: !!body.productImage,
      hasPresenterImage: !!body.presenterImage,
    });

    // Use the provider system to generate the image
    const result = await generateImage({
      prompt: enhancedPrompt,
      aspectRatio: body.aspectRatio,
      cameraAngle: body.cameraAngle,
      imageStyle: body.imageStyle,
      imageCount: body.imageCount,
      model: body.model,
      productImage: body.productImage,
      presenterImage: body.presenterImage,
    });

    if (!result.success) {
      console.error('[Image API] Generation failed:', result.error);
      
      // Check if any providers are configured
      const providers = getAvailableProviders();
      const configured = providers.filter(p => p.configured);
      
      if (configured.length === 0) {
        return NextResponse.json(
          { 
            error: 'No image generation providers configured. Please set up GEMINI_API_KEY or KIE_AI_API_KEY.',
            demo: true,
          },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: result.error || 'Failed to generate image' },
        { status: 500 }
      );
    }

    // Return the generated image
    return NextResponse.json({
      image: result.image || result.imageUrl,
      imageUrl: result.imageUrl,
      provider: result.providerMetadata,
    });

  } catch (error) {
    console.error('[Image API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to generate image: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve available providers and their status
 */
export async function GET() {
  const providers = getAvailableProviders();
  return NextResponse.json({ providers });
}
