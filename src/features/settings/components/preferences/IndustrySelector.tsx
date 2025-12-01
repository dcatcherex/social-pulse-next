'use client';

import { Building2 } from 'lucide-react';
import { INDUSTRIES } from '@/features/onboarding';

interface IndustrySelectorProps {
  value: string | undefined;
  editValue: string | undefined;
  isEditing: boolean;
  onChange: (industry: string) => void;
}

export function IndustrySelector({ value, editValue, isEditing, onChange }: IndustrySelectorProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-slate-400" />
        Industry
      </label>
      {isEditing ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {INDUSTRIES.map((industry) => (
            <button
              key={industry}
              type="button"
              onClick={() => onChange(industry)}
              className={`p-3 rounded-lg border text-sm text-left transition-all ${
                editValue === industry
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-slate-800 bg-slate-50 px-4 py-3 rounded-lg">
          {value || 'Not set'}
        </p>
      )}
    </div>
  );
}
