'use client';

import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onDismiss: () => void;
  variant?: 'default' | 'compact';
}

export function ErrorAlert({ 
  title = 'Generation Failed', 
  message, 
  onDismiss, 
  variant = 'default' 
}: ErrorAlertProps) {
  if (variant === 'compact') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-red-600">{message}</p>
        </div>
        <button 
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top fade-in duration-300">
      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-semibold text-red-800">{title}</h3>
        <p className="text-sm text-red-600 mt-1">{message}</p>
      </div>
      <button 
        onClick={onDismiss}
        className="text-red-400 hover:text-red-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
