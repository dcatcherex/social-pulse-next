'use client';

import { Target, Check } from 'lucide-react';
import { CHALLENGES } from '@/features/onboarding';

interface ChallengesSelectorProps {
  value: string[] | undefined;
  editValue: string[] | undefined;
  isEditing: boolean;
  onToggle: (id: string) => void;
}

export function ChallengesSelector({ value, editValue, isEditing, onToggle }: ChallengesSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
        <Target className="w-4 h-4 text-slate-400" />
        Your Challenges
      </label>
      {isEditing ? (
        <div className="space-y-2">
          {CHALLENGES.map((challenge) => {
            const isSelected = editValue?.includes(challenge.id);
            return (
              <button
                key={challenge.id}
                type="button"
                onClick={() => onToggle(challenge.id)}
                className={`w-full p-3 rounded-lg border text-left transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600'
                      : 'border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={isSelected ? 'text-indigo-700' : 'text-slate-700'}>
                  {challenge.label}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {(value?.length ?? 0) > 0 ? (
            value?.map((id) => {
              const challenge = CHALLENGES.find((c) => c.id === id);
              return challenge ? (
                <span
                  key={id}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                >
                  {challenge.label}
                </span>
              ) : null;
            })
          ) : (
            <span className="text-slate-400">No challenges selected</span>
          )}
        </div>
      )}
    </div>
  );
}
