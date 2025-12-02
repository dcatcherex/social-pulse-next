'use client';

import { Building2 } from 'lucide-react';
import type { BrandProfile } from '@/features/brand-management/types';

interface ContentStudioHeaderProps {
  activeProfile: BrandProfile | null;
}

export function ContentStudioHeader({ activeProfile }: ContentStudioHeaderProps) {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold text-slate-900">Content Studio</h1>
      <p className="text-slate-500">Generate engaging captions and high-quality visuals with AI.</p>
      {activeProfile && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-700">{activeProfile.name}</span>
        </div>
      )}
    </div>
  );
}
