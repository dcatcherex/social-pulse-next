'use client';

import { useState, useCallback } from 'react';
import { Sparkles, Download, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemplateSelector } from './TemplateSelector';
import { TemplateForm } from './TemplateForm';
import { IdeaCard } from './IdeaCard';
import { useContentGeneration } from '../hooks/use-content-generation';
import { useImageGeneration, ASPECT_RATIOS, IMAGE_STYLES, CAMERA_ANGLES } from '../hooks/use-image-generation';
import { useScheduler } from '@/features/scheduling';
import { useContentLibrary } from '@/features/content-library';
import type { ContentTemplate, TemplateImageStyle } from '../templates';
import type { ContentIdea } from '../types';

type ViewState = 'selector' | 'form' | 'results';

export function TemplatesTab() {
  const [viewState, setViewState] = useState<ViewState>('selector');
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [scheduledId, setScheduledId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);

  const { schedulePost } = useScheduler();
  const { saveContent } = useContentLibrary();

  // Text generation
  const {
    ideas,
    isLoading: isGeneratingText,
    setTone,
    generate: generateText,
  } = useContentGeneration();

  // Image generation
  const {
    setPrompt: setImagePrompt,
    setAspectRatio,
    setImageStyle,
    setCameraAngle,
    generatedImage,
    isLoading: isGeneratingImage,
    generate: generateImage,
    downloadImage,
  } = useImageGeneration();

  // Handle template selection
  const handleSelectTemplate = useCallback((template: ContentTemplate) => {
    setSelectedTemplate(template);
    setViewState('form');
  }, []);

  // Handle going back to selector
  const handleBack = useCallback(() => {
    if (viewState === 'results') {
      setViewState('form');
    } else {
      setViewState('selector');
      setSelectedTemplate(null);
    }
  }, [viewState]);

  // Handle text generation from template
  const handleGenerateText = useCallback((prompt: string, tone: string) => {
    setTone(tone);
    generateText(prompt, tone, 'General Audience');
    setViewState('results');
  }, [setTone, generateText]);

  // Handle image generation from template
  const handleGenerateImage = useCallback((prompt: string, imageStyle: TemplateImageStyle) => {
    setImagePrompt(prompt);
    
    // Find matching aspect ratio
    const aspectRatioOption = ASPECT_RATIOS.find(r => r.value === imageStyle.aspectRatio);
    if (aspectRatioOption) {
      setAspectRatio(aspectRatioOption.value);
    }
    
    // Find matching style
    const styleOption = IMAGE_STYLES.find(s => s.value === imageStyle.style);
    if (styleOption) {
      setImageStyle(styleOption.value);
    }
    
    // Find matching camera angle
    if (imageStyle.cameraAngle) {
      const angleOption = CAMERA_ANGLES.find(a => a.value === imageStyle.cameraAngle);
      if (angleOption) {
        setCameraAngle(angleOption.value);
      }
    }
    
    generateImage();
    setViewState('results');
  }, [setImagePrompt, setAspectRatio, setImageStyle, setCameraAngle, generateImage]);

  // Result actions
  const handleCopy = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleSchedule = useCallback((idea: ContentIdea, index: number) => {
    schedulePost(idea);
    setScheduledId(index);
    setTimeout(() => setScheduledId(null), 2000);
  }, [schedulePost]);

  const handleSave = useCallback((idea: ContentIdea, index: number) => {
    saveContent(idea, { 
      topic: selectedTemplate?.name || '', 
      tone: selectedTemplate?.suggestedTone || 'Professional', 
      audience: 'General Audience', 
      language: 'English' 
    });
    setSavedId(index);
    setTimeout(() => setSavedId(null), 2000);
  }, [saveContent, selectedTemplate]);

  // Generate more with same template
  const handleGenerateMore = useCallback(() => {
    setViewState('form');
  }, []);

  return (
    <div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
      {/* Step 1: Template Selector */}
      {viewState === 'selector' && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Choose a Template</h2>
            <p className="text-slate-500 mt-1">Select a template to get started quickly</p>
          </div>
          <TemplateSelector
            onSelectTemplate={handleSelectTemplate}
            selectedTemplateId={selectedTemplate?.id}
          />
        </div>
      )}

      {/* Step 2: Template Form */}
      {viewState === 'form' && selectedTemplate && (
        <TemplateForm
          key={selectedTemplate.id}
          template={selectedTemplate}
          onBack={handleBack}
          onGenerateText={handleGenerateText}
          onGenerateImage={handleGenerateImage}
          isGeneratingText={isGeneratingText}
          isGeneratingImage={isGeneratingImage}
        />
      )}

      {/* Step 3: Results */}
      {viewState === 'results' && selectedTemplate && (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Generated Content</h2>
              <p className="text-sm text-slate-500">Template: {selectedTemplate.name}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBack}>
                Edit Details
              </Button>
              <Button variant="outline" onClick={handleGenerateMore}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate More
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {(isGeneratingText || isGeneratingImage) && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <RefreshCw className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-700">
                {isGeneratingText ? 'Generating text content...' : 'Creating your image...'}
              </p>
              <p className="text-sm text-slate-500 mt-1">This usually takes a few seconds</p>
            </div>
          )}

          {/* Text Results */}
          {!isGeneratingText && ideas.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Text Variations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ideas.map((idea, idx) => (
                  <IdeaCard
                    key={idx}
                    idea={idea}
                    index={idx}
                    copiedId={copiedId}
                    scheduledId={scheduledId}
                    savedId={savedId}
                    onCopy={handleCopy}
                    onSchedule={handleSchedule}
                    onSave={handleSave}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Image Results */}
          {!isGeneratingImage && generatedImage && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-500" />
                Generated Image
              </h3>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="relative rounded-lg overflow-hidden bg-slate-50 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={generatedImage} 
                    alt="Generated" 
                    className="w-full max-h-[400px] object-contain"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      onClick={downloadImage}
                      className="bg-white text-slate-900 hover:bg-slate-100"
                    >
                      <Download className="w-4 h-4 mr-2" /> Download Image
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isGeneratingText && !isGeneratingImage && ideas.length === 0 && !generatedImage && (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center">
              <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No content generated yet. Go back and click Generate.</p>
            </div>
          )}

          {/* Back to Templates Button */}
          <div className="pt-4 border-t border-slate-200">
            <Button
              variant="ghost"
              onClick={() => {
                setViewState('selector');
                setSelectedTemplate(null);
              }}
              className="text-slate-500"
            >
              ← Choose a different template
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
