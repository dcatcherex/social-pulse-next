'use client';

import { Settings } from 'lucide-react';

export function SettingsHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        <Settings className="w-6 h-6 text-indigo-600" />
        Settings
      </h1>
      <p className="text-slate-500">Manage your brands, preferences, and account.</p>
    </div>
  );
}
