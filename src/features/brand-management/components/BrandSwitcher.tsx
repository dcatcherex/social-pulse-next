'use client';

import React, { useState, useRef } from 'react';
import { ChevronDown, PlusCircle, Check, Building2 } from 'lucide-react';
import { useClickOutside } from '@/shared/hooks';
import { useBrand } from '../context/BrandContext';

export const BrandSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { 
    brandProfiles, 
    activeProfile, 
    setActiveProfileId, 
    createNewProfile 
  } = useBrand();

  useClickOutside(menuRef, () => setIsOpen(false));

  const handleSwitch = (id: string) => {
    setActiveProfileId(id);
    setIsOpen(false);
  };

  const handleAddNew = () => {
    createNewProfile();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-indigo-900 transition-colors group"
      >
        <div className="flex items-center space-x-3 text-left">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center border-2 border-indigo-400">
            <span className="font-bold text-sm text-white">
              {activeProfile?.name.charAt(0) || 'B'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-white">
              {activeProfile?.name || 'My Business'}
            </p>
            <p className="text-xs text-indigo-300 truncate">
              {activeProfile?.industry || 'Industry'}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-indigo-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in slide-in-from-bottom-5 fade-in duration-200 z-50">
          <div className="p-3 border-b border-slate-100 bg-slate-50">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Switch Business
            </p>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {brandProfiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleSwitch(profile.id)}
                className="w-full text-left px-4 py-3 hover:bg-indigo-50 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Building2 className={`w-4 h-4 ${profile.id === activeProfile?.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className={`text-sm ${profile.id === activeProfile?.id ? 'font-bold text-indigo-900' : 'font-medium text-slate-600'}`}>
                    {profile.name}
                  </span>
                </div>
                {profile.id === activeProfile?.id && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-slate-100">
            <button 
              onClick={handleAddNew}
              className="w-full flex items-center justify-center gap-2 p-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Add New Business
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
