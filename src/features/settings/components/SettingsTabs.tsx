'use client';

import { Building2, Sparkles, Target } from 'lucide-react';
import type { SettingsSection, SettingsSectionItem } from '../types';

interface SettingsTabsProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const SECTIONS: SettingsSectionItem[] = [
  { id: 'brand', label: 'Brand Profiles', icon: Building2 },
  { id: 'preferences', label: 'My Preferences', icon: Sparkles },
  { id: 'account', label: 'Account', icon: Target },
];

export function SettingsTabs({ activeSection, onSectionChange }: SettingsTabsProps) {
  return (
    <div className="flex space-x-2 border-b border-slate-200">
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
            activeSection === section.id
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <section.icon className="w-4 h-4" />
          {section.label}
        </button>
      ))}
    </div>
  );
}
