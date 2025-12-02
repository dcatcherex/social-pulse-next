'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PLAN_LIMITS, PLANS, getNextTier, isUnlimited } from '../config/pricing';
import type { 
  PlanTier, 
  UserSubscription, 
  LimitCheckResult, 
  UsageType,
  PlanFeatures 
} from '../types';

// Default subscription for free users
const DEFAULT_SUBSCRIPTION: UserSubscription = {
  id: '',
  userId: '',
  plan: 'free',
  status: 'active',
  billingCycle: 'monthly',
  currentPeriodStart: new Date().toISOString(),
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  cancelAtPeriodEnd: false,
  usage: {
    postsThisMonth: 0,
    postsLastReset: new Date().toISOString(),
    aiGenerationsToday: 0,
    aiGenerationsLastReset: new Date().toISOString(),
    profilesCount: 0,
    accountsCount: 0,
    contentLibraryCount: 0,
    teamMembersCount: 0,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Fetch user subscription from API
const fetchSubscription = async (userId: string): Promise<UserSubscription> => {
  const response = await fetch(`/api/subscription?userId=${userId}`);
  if (!response.ok) {
    // Return default free subscription if not found
    return { ...DEFAULT_SUBSCRIPTION, userId };
  }
  return response.json();
};

// Update usage on the server
const updateUsage = async (data: { 
  userId: string; 
  type: UsageType; 
  increment?: number 
}): Promise<UserSubscription> => {
  const response = await fetch('/api/subscription/usage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update usage');
  }
  return response.json();
};

export function useSubscription() {
  const { user, isLoaded } = useUser();
  const queryClient = useQueryClient();
  
  // Fetch subscription data
  const { 
    data: subscription, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: () => fetchSubscription(user!.id),
    enabled: isLoaded && !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: user?.id 
      ? { ...DEFAULT_SUBSCRIPTION, userId: user.id } 
      : DEFAULT_SUBSCRIPTION,
  });
  
  // Mutation to update usage
  const usageMutation = useMutation({
    mutationFn: updateUsage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', user?.id] });
    },
  });
  
  // Get current plan and limits
  const plan = subscription?.plan || 'free';
  const limits = PLAN_LIMITS[plan];
  const planInfo = PLANS[plan];
  const usage = subscription?.usage || DEFAULT_SUBSCRIPTION.usage;
  
  // Check if user can create profile
  const checkProfileLimit = (currentCount?: number): LimitCheckResult => {
    const current = currentCount ?? usage.profilesCount;
    const limit = limits.maxProfiles;
    const unlimited = isUnlimited(limit);
    
    return {
      allowed: unlimited || current < limit,
      current,
      limit,
      isUnlimited: unlimited,
      percentUsed: unlimited ? 0 : Math.round((current / limit) * 100),
      upgradeRequired: !unlimited && current >= limit ? getNextTier(plan) || undefined : undefined,
    };
  };
  
  // Check if user can connect account
  const checkAccountLimit = (currentCount?: number): LimitCheckResult => {
    const current = currentCount ?? usage.accountsCount;
    const limit = limits.maxTotalAccounts;
    const unlimited = isUnlimited(limit);
    
    return {
      allowed: unlimited || current < limit,
      current,
      limit,
      isUnlimited: unlimited,
      percentUsed: unlimited ? 0 : Math.round((current / limit) * 100),
      upgradeRequired: !unlimited && current >= limit ? getNextTier(plan) || undefined : undefined,
    };
  };
  
  // Check if user can create post
  const checkPostLimit = (currentCount?: number): LimitCheckResult => {
    const current = currentCount ?? usage.postsThisMonth;
    const limit = limits.maxPostsPerMonth;
    const unlimited = isUnlimited(limit);
    
    return {
      allowed: unlimited || current < limit,
      current,
      limit,
      isUnlimited: unlimited,
      percentUsed: unlimited ? 0 : Math.round((current / limit) * 100),
      upgradeRequired: !unlimited && current >= limit ? getNextTier(plan) || undefined : undefined,
    };
  };
  
  // Check if user can generate AI content
  const checkAILimit = (currentCount?: number): LimitCheckResult => {
    const current = currentCount ?? usage.aiGenerationsToday;
    const limit = limits.maxAIGenerationsPerDay;
    const unlimited = isUnlimited(limit);
    
    return {
      allowed: unlimited || current < limit,
      current,
      limit,
      isUnlimited: unlimited,
      percentUsed: unlimited ? 0 : Math.round((current / limit) * 100),
      upgradeRequired: !unlimited && current >= limit ? getNextTier(plan) || undefined : undefined,
    };
  };
  
  // Check if user can save to content library
  const checkContentLibraryLimit = (currentCount?: number): LimitCheckResult => {
    const current = currentCount ?? usage.contentLibraryCount;
    const limit = limits.maxContentLibraryItems;
    const unlimited = isUnlimited(limit);
    
    return {
      allowed: unlimited || current < limit,
      current,
      limit,
      isUnlimited: unlimited,
      percentUsed: unlimited ? 0 : Math.round((current / limit) * 100),
      upgradeRequired: !unlimited && current >= limit ? getNextTier(plan) || undefined : undefined,
    };
  };
  
  // Check if user has access to a feature
  const hasFeature = (feature: keyof PlanFeatures): boolean => {
    return limits.features[feature];
  };
  
  // Increment usage (call after successful action)
  const incrementUsage = async (type: UsageType, amount: number = 1) => {
    if (!user?.id) return;
    
    try {
      await usageMutation.mutateAsync({
        userId: user.id,
        type,
        increment: amount,
      });
    } catch (error) {
      console.error('Failed to increment usage:', error);
    }
  };
  
  // Get all usage stats for dashboard
  const getUsageStats = () => {
    return {
      posts: checkPostLimit(),
      aiGenerations: checkAILimit(),
      profiles: checkProfileLimit(),
      accounts: checkAccountLimit(),
      contentLibrary: checkContentLibraryLimit(),
    };
  };
  
  // Check schedule days limit
  const canScheduleForDate = (date: Date): boolean => {
    const daysAhead = Math.ceil((date.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    if (isUnlimited(limits.maxScheduleDaysAhead)) return true;
    return daysAhead <= limits.maxScheduleDaysAhead;
  };
  
  return {
    // State
    subscription,
    plan,
    planInfo,
    limits,
    usage,
    isLoading: !isLoaded || isLoading,
    error,
    
    // Limit checks
    checkProfileLimit,
    checkAccountLimit,
    checkPostLimit,
    checkAILimit,
    checkContentLibraryLimit,
    
    // Feature checks
    hasFeature,
    canScheduleForDate,
    
    // Usage
    incrementUsage,
    getUsageStats,
    
    // Helpers
    isFreePlan: plan === 'free',
    isPaidPlan: plan !== 'free',
    nextTier: getNextTier(plan),
  };
}

// Simplified hook for just checking a single feature
export function useFeatureAccess(feature: keyof PlanFeatures) {
  const { hasFeature, plan, nextTier } = useSubscription();
  const allowed = hasFeature(feature);
  
  return {
    allowed,
    plan,
    upgradeRequired: !allowed ? nextTier : undefined,
  };
}

// Simplified hook for checking a single limit
export function useLimitCheck(type: UsageType) {
  const { 
    checkProfileLimit, 
    checkAccountLimit, 
    checkPostLimit, 
    checkAILimit,
    checkContentLibraryLimit 
  } = useSubscription();
  
  switch (type) {
    case 'profiles':
      return checkProfileLimit();
    case 'accounts':
      return checkAccountLimit();
    case 'posts':
      return checkPostLimit();
    case 'ai_generations':
      return checkAILimit();
    case 'content_library':
      return checkContentLibraryLimit();
    default:
      return { allowed: true, current: 0, limit: -1, isUnlimited: true, percentUsed: 0 };
  }
}
