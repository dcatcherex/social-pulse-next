'use client';

import { Type, Image as ImageIcon } from 'lucide-react';

export type ContentTab = 'text' | 'image';

interface TabSwitcherProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
}

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
        <button
          onClick={() => onTabChange('text')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'text' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
          }`}
        >
          <Type className="w-4 h-4" />
          Text Generator
        </button>
        <button
          onClick={() => onTabChange('image')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'image' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Image Studio
        </button>
      </div>
    </div>
  );
}
