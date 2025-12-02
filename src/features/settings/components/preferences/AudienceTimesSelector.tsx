'use client';

import { Clock } from 'lucide-react';
import { AUDIENCE_TIMES } from '@/features/onboarding';

interface AudienceTimesSelectorProps {
  value: string[] | undefined;
  editValue: string[] | undefined;
  isEditing: boolean;
  onToggle: (id: string) => void;
}

export function AudienceTimesSelector({
  value,
  editValue,
  isEditing,
  onToggle,
}: AudienceTimesSelectorProps) {
  return (
    <div className="border-t border-slate-100 pt-6">
      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
        <Clock className="w-4 h-4 text-blue-500" />
        Audience Active Times
        <span className="text-xs font-normal text-slate-400">(optional)</span>
      </label>
      {isEditing ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {AUDIENCE_TIMES.map((time) => {
            const isSelected = (editValue || []).includes(time.id);
            return (
              <button
                key={time.id}
                type="button"
                onClick={() => onToggle(time.id)}
                className={`p-3 rounded-lg border text-sm text-left transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <span className="block text-lg mb-1">{time.icon}</span>
                <span>{time.label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {(value || []).length > 0 ? (
            (value || []).map((id) => {
              const time = AUDIENCE_TIMES.find((t) => t.id === id);
              return time ? (
                <span
                  key={id}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-1"
                >
                  <span>{time.icon}</span> {time.label}
                </span>
              ) : null;
            })
          ) : (
            <span className="text-slate-400">No times selected</span>
          )}
        </div>
      )}
      <p className="text-xs text-slate-400 mt-2">
        We&apos;ll use this to suggest optimal posting times for your content.
      </p>
    </div>
  );
}
