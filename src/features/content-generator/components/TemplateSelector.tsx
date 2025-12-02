'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  TEMPLATE_CATEGORIES,
  getTemplatesByCategory,
  type TemplateCategory,
  type ContentTemplate,
} from '../templates';

interface TemplateSelectorProps {
  onSelectTemplate: (template: ContentTemplate) => void;
  selectedTemplateId?: string;
}

export function TemplateSelector({ onSelectTemplate, selectedTemplateId }: TemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('product');

  const templates = getTemplatesByCategory(activeCategory);
  const activeCategoryInfo = TEMPLATE_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5">
        <div className="flex flex-wrap gap-1">
          {TEMPLATE_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Description */}
      {activeCategoryInfo && (
        <p className="text-sm text-slate-500 px-1">
          {activeCategoryInfo.description}
        </p>
      )}

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {templates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplateId === template.id;
          
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={cn(
                'relative flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all group',
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              )}
            >
              {/* Icon & Title Row */}
              <div className="flex items-center gap-3 w-full">
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-lg transition-colors',
                    isSelected
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      'font-semibold text-sm truncate',
                      isSelected ? 'text-indigo-900' : 'text-slate-800'
                    )}
                  >
                    {template.name}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p
                className={cn(
                  'text-xs leading-relaxed',
                  isSelected ? 'text-indigo-700' : 'text-slate-500'
                )}
              >
                {template.description}
              </p>

              {/* Platform Badges */}
              <div className="flex flex-wrap gap-1 mt-1">
                {template.suggestedPlatforms.slice(0, 3).map((platform) => (
                  <span
                    key={platform}
                    className={cn(
                      'text-[10px] font-medium px-1.5 py-0.5 rounded capitalize',
                      isSelected
                        ? 'bg-indigo-200 text-indigo-800'
                        : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {platform}
                  </span>
                ))}
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
