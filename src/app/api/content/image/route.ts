import { NextRequest, NextResponse } from 'next/server';
import type { ImageGenerationRequest } from '@/features/content-generator/types';
import { generateImage, getAvailableProviders } from '@/lib/ai-providers';

export async function POST(request: NextRequest) {
  try {
    const body: ImageGenerationRequest = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log('[Image API] Generating image with prompt:', prompt);
    console.log('[Image API] Options:', {
      model: body.model,
      aspectRatio: body.aspectRatio,
      imageStyle: body.imageStyle,
      hasProductImage: !!body.productImage,
      hasPresenterImage: !!body.presenterImage,
    });

    // Use the provider system to generate the image
    const result = await generateImage({
      prompt: body.prompt,
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
