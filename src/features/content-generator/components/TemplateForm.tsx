'use client';

import { useCallback, useState, useRef, ChangeEvent } from 'react';
import { ArrowLeft, Sparkles, Image as ImageIcon, RefreshCw, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type ContentTemplate,
  type TemplateFormValues,
  getDefaultFormValues,
  isFormComplete,
} from '../templates';

interface TemplateFormProps {
  template: ContentTemplate;
  onBack: () => void;
  onGenerateText: (prompt: string, tone: string) => void;
  onGenerateImage: (prompt: string, imageStyle: ContentTemplate['suggestedImageStyle'], uploadedImage?: string) => void;
  isGeneratingText?: boolean;
  isGeneratingImage?: boolean;
}

export function TemplateForm({
  template,
  onBack,
  onGenerateText,
  onGenerateImage,
  isGeneratingText = false,
  isGeneratingImage = false,
}: TemplateFormProps) {
  // Form state - parent should use key={template.id} to reset form on template change
  const [formValues, setFormValues] = useState<TemplateFormValues>(() => 
    getDefaultFormValues(template)
  );
  
  // Image upload state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = useCallback((fieldId: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  const processPrompt = useCallback((promptTemplate: string): string => {
    let result = promptTemplate;

    // Handle conditional blocks {{#key}}...{{/key}}
    const conditionalRegex = /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;
    result = result.replace(conditionalRegex, (_, key, content) => {
      const value = formValues[key];
      if (value && value.trim()) {
        return content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
      }
      return '';
    });

    // Handle simple replacements {{key}}
    const simpleRegex = /\{\{(\w+)\}\}/g;
    result = result.replace(simpleRegex, (_, key) => {
      return formValues[key] || '';
    });

    // Clean up
    return result
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join('\n');
  }, [formValues]);

  const handleGenerateText = useCallback(() => {
    const prompt = processPrompt(template.textPromptTemplate);
    onGenerateText(prompt, template.suggestedTone);
  }, [processPrompt, template, onGenerateText]);

  const handleGenerateImage = useCallback(() => {
    const prompt = processPrompt(template.imagePromptTemplate);
    onGenerateImage(prompt, template.suggestedImageStyle, uploadedImage || undefined);
  }, [processPrompt, template, onGenerateImage, uploadedImage]);

  // Handle image upload
  const handleImageUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const clearUploadedImage = useCallback(() => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const formComplete = isFormComplete(template, formValues);
  const Icon = template.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{template.name}</h2>
              <p className="text-sm text-slate-500">{template.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
        <h3 className="font-semibold text-slate-800">Fill in the details</h3>

        <div className="space-y-4">
          {template.variables.map((variable) => (
            <div key={variable.id}>
              <Label className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1">
                {variable.label}
                {variable.required && <span className="text-red-500">*</span>}
              </Label>

              {variable.type === 'text' && (
                <input
                  type="text"
                  value={formValues[variable.id] || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateField(variable.id, e.target.value)}
                  placeholder={variable.placeholder}
                  maxLength={variable.maxLength}
                  className={cn(
                    'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm',
                    'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                />
              )}

              {variable.type === 'textarea' && (
                <Textarea
                  value={formValues[variable.id] || ''}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateField(variable.id, e.target.value)}
                  placeholder={variable.placeholder}
                  maxLength={variable.maxLength}
                  rows={3}
                  className="border-slate-200 resize-none"
                />
              )}

              {variable.type === 'number' && (
                <input
                  type="number"
                  value={formValues[variable.id] || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateField(variable.id, e.target.value)}
                  placeholder={variable.placeholder}
                  className={cn(
                    'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm',
                    'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                />
              )}

              {variable.type === 'select' && variable.options && (
                <Select
                  value={formValues[variable.id] || ''}
                  onValueChange={(value) => updateField(variable.id, value)}
                >
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder={variable.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {variable.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {variable.helperText && (
                <p className="text-xs text-slate-400 mt-1">{variable.helperText}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Image Upload Section */}
      {template.imageUpload?.enabled && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">{template.imageUpload.label}</h3>
              <p className="text-sm text-slate-500">{template.imageUpload.hint}</p>
            </div>
            {template.imageUpload.required && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                Required
              </span>
            )}
          </div>

          {uploadedImage ? (
            <div className="relative">
              <img
                src={uploadedImage}
                alt="Uploaded preview"
                className="w-full h-48 object-cover rounded-lg border border-slate-200"
              />
              <button
                onClick={clearUploadedImage}
                className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm border border-slate-200 transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                ✓ Image uploaded - will be used as reference for AI generation
              </p>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-slate-50 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm text-slate-500">Click to upload image</span>
              <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}

      {/* Tips Section */}
      {template.tips && template.tips.length > 0 && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <h4 className="text-sm font-semibold text-amber-800 mb-2">💡 Tips for best results</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            {template.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Generate Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleGenerateText}
          disabled={!formComplete || isGeneratingText}
          className="flex-1 h-12"
          size="lg"
        >
          {isGeneratingText ? (
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Sparkles className="w-5 h-5 mr-2" />
          )}
          Generate Text Content
        </Button>

        <Button
          onClick={handleGenerateImage}
          disabled={!formComplete || isGeneratingImage}
          variant="outline"
          className="flex-1 h-12 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          size="lg"
        >
          {isGeneratingImage ? (
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <ImageIcon className="w-5 h-5 mr-2" />
          )}
          Generate Image
        </Button>
      </div>

      {/* Form Incomplete Warning */}
      {!formComplete && (
        <p className="text-sm text-slate-500 text-center">
          Fill in all required fields (*) to enable generation
        </p>
      )}
    </div>
  );
}
