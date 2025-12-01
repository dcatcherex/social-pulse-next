'use client';

import { Flag } from 'lucide-react';
import { GOALS } from '@/features/onboarding';

interface GoalsSelectorProps {
  value: string[] | undefined;
  editValue: string[] | undefined;
  isEditing: boolean;
  onToggle: (id: string) => void;
}

const MAX_GOALS = 3;

export function GoalsSelector({ value, editValue, isEditing, onToggle }: GoalsSelectorProps) {
  const currentCount = (editValue || []).length;

  return (
    <div className="border-t border-slate-100 pt-6">
      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
        <Flag className="w-4 h-4 text-emerald-500" />
        Your Goals
        <span className="text-xs font-normal text-slate-400">(optional, max {MAX_GOALS})</span>
      </label>
      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {GOALS.map((goal) => {
            const isSelected = (editValue || []).includes(goal.id);
            const isDisabled = currentCount >= MAX_GOALS && !isSelected;
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => onToggle(goal.id)}
                disabled={isDisabled}
                className={`p-3 rounded-lg border text-sm text-left transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 hover:border-emerald-300 disabled:opacity-50'
                }`}
              >
                <span>{goal.icon}</span>
                <span>{goal.label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {(value || []).length > 0 ? (
            (value || []).map((id) => {
              const goal = GOALS.find((g) => g.id === id);
              return goal ? (
                <span
                  key={id}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm flex items-center gap-1"
                >
                  <span>{goal.icon}</span> {goal.label}
                </span>
              ) : null;
            })
          ) : (
            <span className="text-slate-400">No goals set</span>
          )}
        </div>
      )}
    </div>
  );
}
