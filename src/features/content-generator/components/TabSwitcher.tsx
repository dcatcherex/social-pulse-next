'use client';

import { Type, Image as ImageIcon, LayoutTemplate } from 'lucide-react';

export type ContentTab = 'templates' | 'text' | 'image';

interface TabSwitcherProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
}

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
        <button
          onClick={() => onTabChange('templates')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'templates' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
          }`}
        >
          <LayoutTemplate className="w-4 h-4" />
          <span className="hidden sm:inline">Templates</span>
        </button>
        <button
          onClick={() => onTabChange('text')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'text' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
          }`}
        >
          <Type className="w-4 h-4" />
          <span className="hidden sm:inline">Custom Text</span>
        </button>
        <button
          onClick={() => onTabChange('image')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'image' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Image Studio</span>
        </button>
      </div>
    </div>
  );
}
