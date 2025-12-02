'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Infinity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UsageBarProps {
  label: string;
  used: number;
  limit: number;
  showNumbers?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UsageBar: React.FC<UsageBarProps> = ({
  label,
  used,
  limit,
  showNumbers = true,
  size = 'md',
  className,
}) => {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isNearLimit = !isUnlimited && percentage >= 80;
  const isAtLimit = !isUnlimited && percentage >= 100;

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  const getBarColor = () => {
    if (isUnlimited) return 'bg-emerald-500';
    if (isAtLimit) return 'bg-red-500';
    if (isNearLimit) return 'bg-amber-500';
    return 'bg-indigo-500';
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        {showNumbers && (
          <span className={cn(
            'text-gray-500',
            isAtLimit && 'text-red-600 font-medium',
            isNearLimit && !isAtLimit && 'text-amber-600'
          )}>
            {isUnlimited ? (
              <span className="flex items-center gap-1">
                {used.toLocaleString()}
                <Infinity className="h-4 w-4" />
              </span>
            ) : (
              `${used.toLocaleString()} / ${limit.toLocaleString()}`
            )}
          </span>
        )}
      </div>
      
      <div className={cn('w-full bg-gray-100 rounded-full overflow-hidden', heightClass)}>
        <div
          className={cn('h-full rounded-full transition-all duration-300', getBarColor())}
          style={{ width: isUnlimited ? '100%' : `${percentage}%` }}
        />
      </div>
      
      {isAtLimit && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Limit reached. Upgrade to continue.
        </p>
      )}
    </div>
  );
};

// Usage dashboard with multiple bars
interface UsageDashboardProps {
  stats: {
    posts: { current: number; limit: number };
    profiles: { current: number; limit: number };
    accounts: { current: number; limit: number };
    aiGenerations: { current: number; limit: number };
    contentLibrary: { current: number; limit: number };
  };
  className?: string;
}

export const UsageDashboard: React.FC<UsageDashboardProps> = ({ stats, className }) => {
  return (
    <div className={cn('space-y-4', className)}>
      <UsageBar label="Posts this month" used={stats.posts.current} limit={stats.posts.limit} />
      <UsageBar label="Profiles" used={stats.profiles.current} limit={stats.profiles.limit} />
      <UsageBar label="Social Accounts" used={stats.accounts.current} limit={stats.accounts.limit} />
      <UsageBar label="AI Generations today" used={stats.aiGenerations.current} limit={stats.aiGenerations.limit} />
      <UsageBar label="Content Library" used={stats.contentLibrary.current} limit={stats.contentLibrary.limit} />
    </div>
  );
};

// Compact usage indicator
interface UsageIndicatorProps {
  used: number;
  limit: number;
  label?: string;
}

export const UsageIndicator: React.FC<UsageIndicatorProps> = ({ used, limit, label }) => {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isNearLimit = !isUnlimited && percentage >= 80;
  const isAtLimit = !isUnlimited && percentage >= 100;

  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full',
      isAtLimit && 'bg-red-100 text-red-700',
      isNearLimit && !isAtLimit && 'bg-amber-100 text-amber-700',
      !isNearLimit && !isAtLimit && 'bg-gray-100 text-gray-600'
    )}>
      {isAtLimit ? (
        <AlertTriangle className="h-3 w-3" />
      ) : isUnlimited ? (
        <CheckCircle className="h-3 w-3 text-emerald-500" />
      ) : null}
      {label && <span>{label}:</span>}
      <span className="font-medium">
        {isUnlimited ? (
          <Infinity className="h-3 w-3 inline" />
        ) : (
          `${used}/${limit}`
        )}
      </span>
    </div>
  );
};
