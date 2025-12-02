// Pricing Configuration for SocialPulse
import type { PlanTier, PlanInfo, PlanLimits } from '../types';

// Plan limits configuration
export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    maxProfiles: 1,
    maxAccountsPerProfile: 3,
    maxTotalAccounts: 3,
    maxPostsPerMonth: 30,
    maxScheduleDaysAhead: 7,
    maxAIGenerationsPerDay: 10,
    maxContentLibraryItems: 50,
    maxTeamMembers: 1,
    analyticsRetentionDays: 7,
    features: {
      bulkScheduling: false,
      advancedAnalytics: false,
      customReports: false,
      whiteLabel: false,
      apiAccess: false,
      prioritySupport: false,
      teamCollaboration: false,
      contentCalendar: true,
      competitorTracking: false,
    },
  },
  starter: {
    maxProfiles: 3,
    maxAccountsPerProfile: 5,
    maxTotalAccounts: 10,
    maxPostsPerMonth: 100,
    maxScheduleDaysAhead: 30,
    maxAIGenerationsPerDay: 50,
    maxContentLibraryItems: 200,
    maxTeamMembers: 3,
    analyticsRetentionDays: 30,
    features: {
      bulkScheduling: true,
      advancedAnalytics: false,
      customReports: false,
      whiteLabel: false,
      apiAccess: false,
      prioritySupport: false,
      teamCollaboration: true,
      contentCalendar: true,
      competitorTracking: true,
    },
  },
  pro: {
    maxProfiles: 10,
    maxAccountsPerProfile: 10,
    maxTotalAccounts: 25,
    maxPostsPerMonth: 500,
    maxScheduleDaysAhead: 90,
    maxAIGenerationsPerDay: -1, // unlimited
    maxContentLibraryItems: 1000,
    maxTeamMembers: 10,
    analyticsRetentionDays: 90,
    features: {
      bulkScheduling: true,
      advancedAnalytics: true,
      customReports: true,
      whiteLabel: false,
      apiAccess: true,
      prioritySupport: true,
      teamCollaboration: true,
      contentCalendar: true,
      competitorTracking: true,
    },
  },
  agency: {
    maxProfiles: -1, // unlimited
    maxAccountsPerProfile: -1,
    maxTotalAccounts: -1,
    maxPostsPerMonth: -1,
    maxScheduleDaysAhead: -1,
    maxAIGenerationsPerDay: -1,
    maxContentLibraryItems: -1,
    maxTeamMembers: -1,
    analyticsRetentionDays: 365,
    features: {
      bulkScheduling: true,
      advancedAnalytics: true,
      customReports: true,
      whiteLabel: true,
      apiAccess: true,
      prioritySupport: true,
      teamCollaboration: true,
      contentCalendar: true,
      competitorTracking: true,
    },
  },
};

// Full plan information including pricing
export const PLANS: Record<PlanTier, PlanInfo> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out SocialPulse',
    monthlyPrice: 0,
    yearlyPrice: 0,
    limits: PLAN_LIMITS.free,
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'For small businesses and creators',
    monthlyPrice: 1900, // $19
    yearlyPrice: 18200, // $182/year ($15.17/mo)
    limits: PLAN_LIMITS.starter,
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY,
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_STARTER_YEARLY,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For growing teams and agencies',
    monthlyPrice: 4900, // $49
    yearlyPrice: 47000, // $470/year ($39.17/mo)
    limits: PLAN_LIMITS.pro,
    popular: true,
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY,
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY,
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    description: 'For large teams and agencies',
    monthlyPrice: 14900, // $149
    yearlyPrice: 143000, // $1,430/year ($119.17/mo)
    limits: PLAN_LIMITS.agency,
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_AGENCY_MONTHLY,
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_AGENCY_YEARLY,
  },
};

// Plan order for display
export const PLAN_ORDER: PlanTier[] = ['free', 'starter', 'pro', 'agency'];

// Helper to get next tier upgrade
export const getNextTier = (currentTier: PlanTier): PlanTier | null => {
  const currentIndex = PLAN_ORDER.indexOf(currentTier);
  if (currentIndex === -1 || currentIndex === PLAN_ORDER.length - 1) {
    return null;
  }
  return PLAN_ORDER[currentIndex + 1];
};

// Helper to check if value is unlimited
export const isUnlimited = (value: number): boolean => value === -1;

// Helper to format price
export const formatPrice = (cents: number): string => {
  if (cents === 0) return 'Free';
  return `$${(cents / 100).toFixed(0)}`;
};

// Helper to format price per month
export const formatPricePerMonth = (cents: number, isYearly: boolean): string => {
  if (cents === 0) return 'Free';
  const monthly = isYearly ? cents / 12 : cents;
  return `$${(monthly / 100).toFixed(0)}`;
};

// Feature display names
export const FEATURE_NAMES: Record<keyof PlanLimits['features'], string> = {
  bulkScheduling: 'Bulk Scheduling',
  advancedAnalytics: 'Advanced Analytics',
  customReports: 'Custom Reports',
  whiteLabel: 'White Label',
  apiAccess: 'API Access',
  prioritySupport: 'Priority Support',
  teamCollaboration: 'Team Collaboration',
  contentCalendar: 'Content Calendar',
  competitorTracking: 'Competitor Tracking',
};

// Limit display names
export const LIMIT_NAMES: Record<string, string> = {
  maxProfiles: 'Profiles',
  maxTotalAccounts: 'Social Accounts',
  maxPostsPerMonth: 'Posts per month',
  maxScheduleDaysAhead: 'Schedule ahead',
  maxAIGenerationsPerDay: 'AI generations per day',
  maxContentLibraryItems: 'Content library items',
  maxTeamMembers: 'Team members',
  analyticsRetentionDays: 'Analytics history',
};

// Format limit value for display
export const formatLimitValue = (key: string, value: number): string => {
  if (value === -1) return 'Unlimited';
  
  if (key === 'maxScheduleDaysAhead' || key === 'analyticsRetentionDays') {
    return `${value} days`;
  }
  
  return value.toLocaleString();
};
