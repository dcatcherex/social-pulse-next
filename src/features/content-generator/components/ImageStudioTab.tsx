'use client';

import { 
  RefreshCw, 
  Image as ImageIcon,
  Download,
  Upload,
  Package,
  User,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ErrorAlert } from './ErrorAlert';
import { 
  useImageGeneration,
  ASPECT_RATIOS,
  CAMERA_ANGLES,
  IMAGE_STYLES,
} from '../hooks/use-image-generation';

export function ImageStudioTab() {
  const {
    prompt: imagePrompt,
    setPrompt: setImagePrompt,
    aspectRatio,
    setAspectRatio,
    cameraAngle,
    setCameraAngle,
    imageStyle,
    setImageStyle,
    imageCount,
    setImageCount,
    aiModel,
    setAiModel,
    availableModels,
    productImage,
    presenterImage,
    handleImageUpload,
    clearProductImage,
    clearPresenterImage,
    generatedImage,
    isLoading: isImageLoading,
    error: imageError,
    generate: generateImageFn,
    downloadImage,
    reset: resetImageError,
  } = useImageGeneration();

  // Get current model info for display
  const currentModelInfo = availableModels.find(m => m.value === aiModel);

  return (
    <div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Studio Controls */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-5">
            <h2 className="text-lg font-bold text-slate-800">Studio Controls</h2>

            {/* AI Model */}
            <div>
              <Label className="text-xs font-bold text-slate-500 uppercase mb-2">AI Model</Label>
              <Select value={aiModel} onValueChange={setAiModel} disabled={availableModels.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder={availableModels.length === 0 ? 'No providers configured' : 'Select model'}>
                    {currentModelInfo && (
                      <span>{currentModelInfo.label} <span className="text-slate-400">({currentModelInfo.description})</span></span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {/* Group by provider */}
                  {Array.from(new Set(availableModels.map(m => m.providerLabel))).map(providerLabel => (
                    <div key={providerLabel}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 bg-slate-50">
                        {providerLabel}
                      </div>
                      {availableModels
                        .filter(m => m.providerLabel === providerLabel)
                        .map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label} <span className="text-slate-400">({model.description})</span>
                          </SelectItem>
                        ))}
                    </div>
                  ))}
                  {availableModels.length === 0 && (
                    <div className="px-2 py-4 text-center text-sm text-slate-500">
                      No providers configured.<br />
                      <span className="text-xs">Set GEMINI_API_KEY or KIE_AI_API_KEY</span>
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Count & Quality Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold text-slate-500 uppercase mb-2">Count</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setImageCount(count)}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg border transition-all ${
                        imageCount === count
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-500 uppercase mb-2">Quality</Label>
                <Select defaultValue="1K">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1K">1K</SelectItem>
                    <SelectItem value="2K">2K</SelectItem>
                    <SelectItem value="4K">4K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <Label className="text-xs font-bold text-slate-500 uppercase mb-2">Aspect Ratio</Label>
              <div className="grid grid-cols-3 gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.value}
                    type="button"
                    onClick={() => setAspectRatio(ratio.value)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${
                      aspectRatio === ratio.value
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style & Camera Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold text-slate-500 uppercase mb-2">Style</Label>
                <Select value={imageStyle} onValueChange={setImageStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_STYLES.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-500 uppercase mb-2">Camera</Label>
                <Select value={cameraAngle} onValueChange={setCameraAngle}>
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMERA_ANGLES.map((angle) => (
                      <SelectItem key={angle.value} value={angle.value}>
                        {angle.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Image Upload */}
            <div>
              <Label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                <Package className="w-3 h-3" /> Product Image
                <span className="text-slate-400 font-normal normal-case">(Optional)</span>
              </Label>
              {productImage ? (
                <div className="relative border-2 border-dashed border-indigo-200 rounded-lg p-2 bg-indigo-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={productImage} 
                    alt="Product" 
                    className="w-full h-24 object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={clearProductImage}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50"
                  >
                    <X className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-4 cursor-pointer hover:border-indigo-300 hover:bg-slate-50 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs text-slate-500">Click to upload product</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'product');
                    }}
                  />
                </label>
              )}
            </div>

            {/* Presenter Image Upload */}
            <div>
              <Label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                <User className="w-3 h-3" /> Presenter Image
                <span className="text-slate-400 font-normal normal-case">(Optional)</span>
              </Label>
              {presenterImage ? (
                <div className="relative border-2 border-dashed border-indigo-200 rounded-lg p-2 bg-indigo-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={presenterImage} 
                    alt="Presenter" 
                    className="w-full h-24 object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={clearPresenterImage}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50"
                  >
                    <X className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-4 cursor-pointer hover:border-indigo-300 hover:bg-slate-50 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs text-slate-500">Click to upload presenter</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'presenter');
                    }}
                  />
                </label>
              )}
            </div>

            {/* Generate Button */}
            <Button
              onClick={() => generateImageFn()}
              disabled={isImageLoading || !imagePrompt.trim()}
              className="w-full h-12 text-base font-bold uppercase tracking-wide"
              size="lg"
            >
              {isImageLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                'Generate Assets'
              )}
            </Button>

            {/* Image Error */}
            {imageError && (
              <ErrorAlert
                message={imageError}
                onDismiss={resetImageError}
                variant="compact"
              />
            )}
          </div>
        </div>

        {/* Right: Prompt + Preview */}
        <div className="lg:col-span-2 space-y-4">
          {/* Prompt Description */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <Label className="text-sm font-bold text-slate-700 mb-2">Prompt Description</Label>
            <Textarea
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              className="min-h-[80px] resize-none border-slate-200"
            />
          </div>

          {/* Preview Panel */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 h-[480px] flex items-center justify-center relative overflow-hidden group">
            {generatedImage ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={downloadImage}
                    className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <Download className="w-5 h-5" /> Download Image
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-400 p-8">
                {isImageLoading ? (
                  <div className="flex flex-col items-center">
                    <RefreshCw className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
                    <p className="font-medium text-slate-600 text-lg">Creating your masterpiece...</p>
                    <p className="text-sm mt-1">This usually takes about 10-15 seconds.</p>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium text-slate-400">No images generated yet</p>
                    <p className="text-sm mt-1 text-slate-400">Configure settings and click Generate</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
