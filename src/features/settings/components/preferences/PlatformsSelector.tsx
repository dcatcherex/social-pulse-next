'use client';

import { Share2 } from 'lucide-react';
import { PLATFORMS } from '@/features/onboarding';

interface PlatformsSelectorProps {
  value: string[] | undefined;
  editValue: string[] | undefined;
  isEditing: boolean;
  onToggle: (id: string) => void;
}

export function PlatformsSelector({ value, editValue, isEditing, onToggle }: PlatformsSelectorProps) {
  return (
    <div className="border-t border-slate-100 pt-6">
      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
        <Share2 className="w-4 h-4 text-purple-500" />
        Social Platforms
        <span className="text-xs font-normal text-slate-400">(optional)</span>
      </label>
      {isEditing ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {PLATFORMS.map((platform) => {
            const isSelected = (editValue || []).includes(platform.id);
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => onToggle(platform.id)}
                className={`p-3 rounded-lg border text-sm text-left transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <span>{platform.icon}</span>
                <span>{platform.label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {(value || []).length > 0 ? (
            (value || []).map((id) => {
              const platform = PLATFORMS.find((p) => p.id === id);
              return platform ? (
                <span
                  key={id}
                  className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm flex items-center gap-1"
                >
                  <span>{platform.icon}</span> {platform.label}
                </span>
              ) : null;
            })
          ) : (
            <span className="text-slate-400">No platforms selected</span>
          )}
        </div>
      )}
    </div>
  );
}
