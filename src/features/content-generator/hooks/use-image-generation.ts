'use client';

import { useState, useCallback, useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { generateImage, getImageProviders } from '../services/content-service';

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

// Model definitions with provider grouping
export interface AIModel {
  value: string;
  label: string;
  description: string;
  provider: string;
  providerLabel: string;
  configured: boolean;
}

// Static model definitions (will be filtered by configured providers)
const ALL_MODELS: AIModel[] = [
  // Gemini Models
  { 
    value: 'gemini-2.0-flash-preview-image-generation', 
    label: 'Gemini 2.0 Flash', 
    description: 'Fast, good quality',
    provider: 'gemini',
    providerLabel: 'Google Gemini',
    configured: false,
  },
  // Kie.ai Models
  { 
    value: 'google/nano-banana', 
    label: 'Nano Banana (Gemini 3)', 
    description: 'Latest Gemini via Kie.ai',
    provider: 'kie-ai',
    providerLabel: 'Kie.ai',
    configured: false,
  },
  { 
    value: 'flux-kontext-pro', 
    label: 'Flux Kontext Pro', 
    description: 'Balanced quality',
    provider: 'kie-ai',
    providerLabel: 'Kie.ai',
    configured: false,
  },
  { 
    value: 'flux-kontext-max', 
    label: 'Flux Kontext Max', 
    description: 'Highest quality',
    provider: 'kie-ai',
    providerLabel: 'Kie.ai',
    configured: false,
  },
  { 
    value: 'gpt4o-image', 
    label: 'GPT-4o Image', 
    description: 'OpenAI via Kie.ai',
    provider: 'kie-ai',
    providerLabel: 'Kie.ai',
    configured: false,
  },
];

// Legacy export for backward compatibility
export const AI_MODELS = ALL_MODELS;

export function useImageGeneration() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [cameraAngle, setCameraAngle] = useState('eye-level');
  const [imageStyle, setImageStyle] = useState('photorealistic');
  const [imageCount, setImageCount] = useState(1);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [presenterImage, setPresenterImage] = useState<string | null>(null);

  // Fetch available providers from the API
  const { data: providersData } = useQuery({
    queryKey: ['image-providers'],
    queryFn: getImageProviders,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Compute available models based on configured providers
  const availableModels = useMemo(() => {
    return ALL_MODELS.map(model => ({
      ...model,
      configured: providersData?.providers?.some(
        (p) => p.type === model.provider && p.configured
      ) ?? false,
    })).filter(model => model.configured);
  }, [providersData]);

  // Get current model - user selection or default
  const aiModel = useMemo(() => {
    // If user has selected a model, use it
    if (selectedModel && availableModels.some(m => m.value === selectedModel)) {
      return selectedModel;
    }
    // Default: Prefer Kie.ai nano-banana, fallback to first available
    if (availableModels.length === 0) return '';
    const preferred = availableModels.find(m => m.value === 'google/nano-banana');
    return preferred?.value || availableModels[0].value;
  }, [selectedModel, availableModels]);

  // Handle model change
  const setAiModel = useCallback((value: string) => {
    setSelectedModel(value);
  }, []);

  const mutation = useMutation({
    mutationFn: () => generateImage({ 
      prompt, 
      aspectRatio, 
      cameraAngle, 
      imageStyle, 
      imageCount, 
      model: aiModel || undefined,
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
    availableModels,
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
