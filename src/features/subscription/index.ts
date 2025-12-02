// Subscription Feature - Centralized Exports

// Types
export * from './types';

// Config
export { 
  PLAN_LIMITS,
  PLANS,
  PLAN_ORDER,
  getNextTier,
  isUnlimited,
  formatPrice,
  formatPricePerMonth,
  FEATURE_NAMES,
  LIMIT_NAMES,
  formatLimitValue,
} from './config/pricing';

// Hooks
export { 
  useSubscription,
  useFeatureAccess,
  useLimitCheck,
} from './hooks/use-subscription';

// Components
export { UpgradePrompt, UpgradeChip } from './components/UpgradePrompt';
export { UsageBar, UsageDashboard, UsageIndicator } from './components/UsageBar';
export { 
  FeatureGate, 
  LimitGate, 
  RequirePlan,
  useCanAccess,
  useIsUnderLimit,
} from './components/FeatureGate';
