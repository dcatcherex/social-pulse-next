// Subscription Types for SocialPulse

export type PlanTier = 'free' | 'starter' | 'pro' | 'agency';

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';

export interface PlanFeatures {
  bulkScheduling: boolean;
  advancedAnalytics: boolean;
  customReports: boolean;
  whiteLabel: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
  teamCollaboration: boolean;
  contentCalendar: boolean;
  competitorTracking: boolean;
}

export interface PlanLimits {
  // Profile & Accounts
  maxProfiles: number;              // -1 = unlimited
  maxAccountsPerProfile: number;
  maxTotalAccounts: number;
  
  // Posting
  maxPostsPerMonth: number;
  maxScheduleDaysAhead: number;
  
  // Content
  maxAIGenerationsPerDay: number;
  maxContentLibraryItems: number;
  
  // Team
  maxTeamMembers: number;
  
  // Analytics
  analyticsRetentionDays: number;
  
  // Features
  features: PlanFeatures;
}

export interface PlanInfo {
  id: PlanTier;
  name: string;
  description: string;
  monthlyPrice: number;       // in cents
  yearlyPrice: number;        // in cents (total per year)
  limits: PlanLimits;
  popular?: boolean;          // highlight as "Most Popular"
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
}

export interface UserUsage {
  postsThisMonth: number;
  postsLastReset: string;     // ISO date
  aiGenerationsToday: number;
  aiGenerationsLastReset: string;
  profilesCount: number;
  accountsCount: number;
  contentLibraryCount: number;
  teamMembersCount: number;
}

export interface UserSubscription {
  id: string;
  userId: string;
  plan: PlanTier;
  status: SubscriptionStatus;
  
  // Stripe/Payment
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  
  // Billing
  billingCycle: 'monthly' | 'yearly';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  
  // Trial
  trialStart?: string;
  trialEnd?: string;
  
  // Usage
  usage: UserUsage;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Limit check result
export interface LimitCheckResult {
  allowed: boolean;
  current: number;
  limit: number;
  isUnlimited: boolean;
  percentUsed: number;
  upgradeRequired?: PlanTier;
}

// Usage type for tracking
export type UsageType = 
  | 'posts'
  | 'ai_generations'
  | 'profiles'
  | 'accounts'
  | 'content_library'
  | 'team_members';
