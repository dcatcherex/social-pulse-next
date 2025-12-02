'use client';

import React from 'react';
import { ContentStatus, CONTENT_STATUS_CONFIG } from '../types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ContentStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = CONTENT_STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        config.bgColor,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
};
