import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import type { ImageGenerationRequest } from '@/features/content-generator/types';

// Build enhanced prompt with style modifiers
function buildEnhancedPrompt(request: ImageGenerationRequest): string {
  const { prompt, cameraAngle, imageStyle, aspectRatio, productImage, presenterImage } = request;
  
  const parts: string[] = [];
  
  // Add context for product/presenter images
  if (productImage && presenterImage) {
    parts.push('Create a professional product advertisement featuring the provided product with the presenter/model');
  } else if (productImage) {
    parts.push('Create a professional product advertisement featuring the provided product');
  } else if (presenterImage) {
    parts.push('Create content featuring the provided presenter/model');
  }
  
  // Add style
  if (imageStyle && imageStyle !== 'photorealistic') {
    const styleMap: Record<string, string> = {
      'digital-art': 'digital art style',
      'anime': 'anime/manga art style',
      'watercolor': 'watercolor painting style',
      'oil-painting': 'oil painting style',
      '3d-render': '3D rendered style',
      'minimalist': 'minimalist clean design',
      'vintage': 'vintage retro style',
      'neon': 'neon cyberpunk style with glowing lights',
    };
    parts.push(styleMap[imageStyle] || imageStyle);
  }
  
  // Add camera angle
  if (cameraAngle && cameraAngle !== 'eye-level') {
    const angleMap: Record<string, string> = {
      'high-angle': 'shot from high angle looking down',
      'low-angle': 'shot from low angle looking up, dramatic',
      'birds-eye': "bird's eye view, top-down perspective",
      'dutch-angle': 'dutch angle, tilted camera',
      'close-up': 'extreme close-up shot',
      'wide-shot': 'wide establishing shot',
    };
    parts.push(angleMap[cameraAngle] || cameraAngle);
  }
  
  // Add aspect ratio hint
  if (aspectRatio) {
    const ratioMap: Record<string, string> = {
      '1:1': 'square composition',
      '4:5': 'vertical portrait composition',
      '9:16': 'tall vertical composition for mobile',
      '16:9': 'wide cinematic composition',
      '3:4': 'portrait composition',
      '4:3': 'landscape composition',
    };
    if (ratioMap[aspectRatio]) {
      parts.push(ratioMap[aspectRatio]);
    }
  }
  
  // Combine
  if (parts.length > 0) {
    return `${prompt}, ${parts.join(', ')}`;
  }
  return prompt;
}

// Convert base64 to inline data for Gemini
function base64ToInlineData(base64String: string) {
  // Remove data URL prefix if present
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  const mimeType = base64String.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/png';
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ImageGenerationRequest = await request.json();
    const { prompt, model = 'gemini-2.0-flash-preview-image-generation' } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Image generation requires API key', demo: true },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const enhancedPrompt = buildEnhancedPrompt(body);
    
    console.log('Generating image with prompt:', enhancedPrompt);

    // Build parts array with text and optional images
    const parts: Array<{ text: string } | ReturnType<typeof base64ToInlineData>> = [
      { text: enhancedPrompt }
    ];
    
    // Add product image if provided
    if (body.productImage) {
      parts.push(base64ToInlineData(body.productImage));
    }
    
    // Add presenter image if provided
    if (body.presenterImage) {
      parts.push(base64ToInlineData(body.presenterImage));
    }

    const response = await genAI.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseModalities: ['Text', 'Image'],
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        return NextResponse.json({ image: imageData });
      }
    }

    return NextResponse.json(
      { error: 'No image generated' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Image generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to generate image: ${errorMessage}` },
      { status: 500 }
    );
  }
}
