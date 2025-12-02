'use client';

import React from 'react';
import { CircleHelp } from 'lucide-react';

interface QuestionTooltipProps {
  text: string;
}

export const QuestionTooltip: React.FC<QuestionTooltipProps> = ({ text }) => (
  <div className="group relative inline-flex items-center ml-1.5 cursor-help align-middle">
    <CircleHelp className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-500 transition-colors" />
    <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-50 text-center leading-normal font-normal pointer-events-none">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);
