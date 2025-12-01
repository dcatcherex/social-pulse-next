'use client';

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { generateImage } from '../services/content-service';

// Presets
export const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1 Square', description: 'Instagram Post' },
  { value: '4:5', label: '4:5 IG Post', description: 'Instagram Feed' },
  { value: '9:16', label: '9:16 Story', description: 'Stories/Reels' },
  { value: '16:9', label: '16:9 Youtube', description: 'YouTube/Web' },
  { value: '3:4', label: '3:4 Portrait', description: 'Pinterest' },
  { value: '4:3', label: '4:3 Landscape', description: 'Standard' },
] as const;

export const CAMERA_ANGLES = [
  { value: 'eye-level', label: 'Eye Level', description: 'Natural perspective' },
  { value: 'high-angle', label: 'High Angle', description: 'Looking down' },
  { value: 'low-angle', label: 'Low Angle', description: 'Looking up, dramatic' },
  { value: 'birds-eye', label: "Bird's Eye", description: 'Top-down view' },
  { value: 'dutch-angle', label: 'Dutch Angle', description: 'Tilted, dynamic' },
  { value: 'close-up', label: 'Close-up', description: 'Detail focus' },
  { value: 'wide-shot', label: 'Wide Shot', description: 'Full scene' },
] as const;

export const IMAGE_STYLES = [
  { value: 'photorealistic', label: 'Photorealistic', description: 'Like a real photo' },
  { value: 'digital-art', label: 'Digital Art', description: 'Modern digital illustration' },
  { value: 'anime', label: 'Anime', description: 'Japanese animation style' },
  { value: 'watercolor', label: 'Watercolor', description: 'Soft, artistic painting' },
  { value: 'oil-painting', label: 'Oil Painting', description: 'Classic fine art' },
  { value: '3d-render', label: '3D Render', description: 'Computer-generated 3D' },
  { value: 'minimalist', label: 'Minimalist', description: 'Clean, simple design' },
  { value: 'vintage', label: 'Vintage', description: 'Retro, nostalgic look' },
  { value: 'neon', label: 'Neon/Cyberpunk', description: 'Futuristic glow' },
] as const;

export const AI_MODELS = [
  { value: 'gemini-2.0-flash-preview-image-generation', label: 'Gemini 2.0 Flash', description: 'Fast, good quality' },
  { value: 'imagen-3.0-generate-002', label: 'Imagen 3', description: 'High quality images' },
] as const;

export function useImageGeneration() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [cameraAngle, setCameraAngle] = useState('eye-level');
  const [imageStyle, setImageStyle] = useState('photorealistic');
  const [imageCount, setImageCount] = useState(1);
  const [aiModel, setAiModel] = useState('gemini-2.0-flash-preview-image-generation');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [presenterImage, setPresenterImage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => generateImage({ 
      prompt, 
      aspectRatio, 
      cameraAngle, 
      imageStyle, 
      imageCount, 
      model: aiModel,
      productImage: productImage || undefined,
      presenterImage: presenterImage || undefined,
    }),
  });

  // Handle file upload and convert to base64
  const handleImageUpload = useCallback((file: File, type: 'product' | 'presenter') => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (type === 'product') {
        setProductImage(base64);
      } else {
        setPresenterImage(base64);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const clearProductImage = useCallback(() => setProductImage(null), []);
  const clearPresenterImage = useCallback(() => setPresenterImage(null), []);

  const generate = useCallback(async () => {
    if (!prompt.trim()) return;
    mutation.mutate();
  }, [prompt, mutation]);

  const downloadImage = useCallback(() => {
    const result = mutation.data;
    if (result && 'image' in result) {
      const link = document.createElement('a');
      link.href = result.image;
      link.download = `social-pulse-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [mutation.data]);

  const generatedImage = mutation.data && 'image' in mutation.data ? mutation.data.image : null;
  const isDemo = mutation.data && 'demo' in mutation.data ? mutation.data.demo : false;
  const apiError = mutation.data && 'error' in mutation.data ? mutation.data.error : null;

  return {
    // Prompt
    prompt,
    setPrompt,
    // Aspect Ratio
    aspectRatio,
    setAspectRatio,
    // Camera Angle
    cameraAngle,
    setCameraAngle,
    // Image Style
    imageStyle,
    setImageStyle,
    // Image Count
    imageCount,
    setImageCount,
    // AI Model
    aiModel,
    setAiModel,
    // Product & Presenter Images
    productImage,
    presenterImage,
    handleImageUpload,
    clearProductImage,
    clearPresenterImage,
    // Generation state
    generatedImage,
    isLoading: mutation.isPending,
    error: mutation.error?.message || apiError,
    isDemo,
    // Actions
    generate,
    downloadImage,
    reset: mutation.reset,
  };
}
