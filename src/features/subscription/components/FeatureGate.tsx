'use client';

import React from 'react';
import { useSubscription, useFeatureAccess, useLimitCheck } from '../hooks/use-subscription';
import { UpgradePrompt } from './UpgradePrompt';
import type { PlanFeatures, UsageType } from '../types';

interface FeatureGateProps {
  /** Feature key to check access for */
  feature: keyof PlanFeatures;
  /** Content to render if user has access */
  children: React.ReactNode;
  /** Custom fallback (defaults to UpgradePrompt) */
  fallback?: React.ReactNode;
  /** Show nothing instead of upgrade prompt */
  hideIfLocked?: boolean;
}

/**
 * Gate component that shows content only if user has feature access.
 * Shows upgrade prompt if feature is locked.
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback,
  hideIfLocked = false,
}) => {
  const { allowed, upgradeRequired } = useFeatureAccess(feature);

  if (allowed) {
    return <>{children}</>;
  }

  if (hideIfLocked) {
    return null;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <UpgradePrompt
      feature={feature}
      suggestedPlan={upgradeRequired || 'pro'}
      variant="card"
    />
  );
};

interface LimitGateProps {
  /** Type of limit to check */
  type: UsageType;
  /** Current count (if not using context value) */
  currentCount?: number;
  /** Content to render if under limit */
  children: React.ReactNode;
  /** Custom fallback (defaults to UpgradePrompt) */
  fallback?: React.ReactNode;
  /** Show nothing instead of upgrade prompt */
  hideIfLocked?: boolean;
  /** Callback when limit is reached */
  onLimitReached?: () => void;
}

/**
 * Gate component that shows content only if user is under limit.
 * Shows upgrade prompt if limit is reached.
 */
export const LimitGate: React.FC<LimitGateProps> = ({
  type,
  currentCount,
  children,
  fallback,
  hideIfLocked = false,
  onLimitReached,
}) => {
  const limitCheck = useLimitCheck(type);
  
  // Calculate values based on whether custom currentCount is provided
  const current = currentCount !== undefined ? currentCount : limitCheck.current;
  const limit = limitCheck.limit;
  const allowed = limitCheck.isUnlimited || current < limit;
  const upgradeRequired = limitCheck.upgradeRequired;

  React.useEffect(() => {
    if (!allowed && onLimitReached) {
      onLimitReached();
    }
  }, [allowed, onLimitReached]);

  if (allowed) {
    return <>{children}</>;
  }

  if (hideIfLocked) {
    return null;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const typeLabels: Record<UsageType, string> = {
    posts: 'Posts',
    ai_generations: 'AI Generations',
    profiles: 'Profiles',
    accounts: 'Social Accounts',
    content_library: 'Content Library',
    team_members: 'Team Members',
  };

  return (
    <UpgradePrompt
      feature={typeLabels[type]}
      currentUsage={current}
      limit={limit}
      suggestedPlan={upgradeRequired || 'pro'}
      variant="card"
    />
  );
};

interface RequirePlanProps {
  /** Minimum plan required */
  minPlan: 'starter' | 'pro' | 'agency';
  /** Content to render if user has required plan */
  children: React.ReactNode;
  /** Custom fallback */
  fallback?: React.ReactNode;
}

const PLAN_LEVELS = { free: 0, starter: 1, pro: 2, agency: 3 };

/**
 * Gate that requires a minimum plan level.
 */
export const RequirePlan: React.FC<RequirePlanProps> = ({
  minPlan,
  children,
  fallback,
}) => {
  const { plan } = useSubscription();
  const userLevel = PLAN_LEVELS[plan];
  const requiredLevel = PLAN_LEVELS[minPlan];

  if (userLevel >= requiredLevel) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <UpgradePrompt
      suggestedPlan={minPlan}
      variant="card"
    />
  );
};

/**
 * Hook-based check that can be used for conditional rendering or logic
 */
export function useCanAccess(feature: keyof PlanFeatures): boolean {
  const { hasFeature } = useSubscription();
  return hasFeature(feature);
}

/**
 * Hook-based limit check for conditional logic
 */
export function useIsUnderLimit(type: UsageType, currentCount?: number): boolean {
  const limitCheck = useLimitCheck(type);
  if (currentCount !== undefined) {
    return limitCheck.isUnlimited || currentCount < limitCheck.limit;
  }
  return limitCheck.allowed;
}
