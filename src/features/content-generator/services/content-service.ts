import type { ContentIdea, ContentGenerationRequest, ImageGenerationRequest } from '../types';

/**
 * Generate content ideas via API
 */
export async function generateContentIdeas(
  request: ContentGenerationRequest
): Promise<ContentIdea[]> {
  const response = await fetch('/api/content/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to generate content (${response.status})`);
  }

  const data = await response.json();
  
  // Handle case where API returns error object instead of array
  if (data.error) {
    throw new Error(data.error);
  }
  
  return data;
}

/**
 * Generate image via API
 */
export async function generateImage(
  request: ImageGenerationRequest
): Promise<{ image: string } | { error: string; demo?: boolean }> {
  const response = await fetch('/api/content/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const data = await response.json();
  
  if (!response.ok || data.error) {
    return { error: data.error || `Failed to generate image (${response.status})`, demo: data.demo };
  }
  
  return data;
}
