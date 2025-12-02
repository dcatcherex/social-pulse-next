'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Lock } from 'lucide-react';
import { PLANS, formatPrice } from '../config/pricing';
import type { PlanTier } from '../types';

interface UpgradePromptProps {
  feature?: string;
  currentUsage?: number;
  limit?: number;
  suggestedPlan?: PlanTier;
  variant?: 'inline' | 'card' | 'modal' | 'banner';
  onUpgrade?: () => void;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  feature,
  currentUsage,
  limit,
  suggestedPlan = 'starter',
  variant = 'card',
  onUpgrade,
}) => {
  const plan = PLANS[suggestedPlan];
  
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Navigate to pricing page
      window.location.href = '/pricing';
    }
  };

  if (variant === 'inline') {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
        <Lock className="h-3.5 w-3.5" />
        <span>
          {feature ? `${feature} requires` : 'Requires'} {plan.name} plan
        </span>
        <button 
          onClick={handleUpgrade}
          className="font-medium text-amber-700 hover:text-amber-800 underline"
        >
          Upgrade
        </button>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5" />
          <div>
            <p className="font-medium">
              {feature 
                ? `Unlock ${feature} with ${plan.name}` 
                : `Upgrade to ${plan.name}`}
            </p>
            {currentUsage !== undefined && limit !== undefined && (
              <p className="text-sm text-white/80">
                You have used {currentUsage} of {limit} available
              </p>
            )}
          </div>
        </div>
        <Button 
          onClick={handleUpgrade}
          variant="secondary"
          className="bg-white text-indigo-600 hover:bg-white/90"
        >
          Upgrade
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    );
  }

  // Default: card variant
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 text-center">
      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Sparkles className="h-6 w-6 text-indigo-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {feature 
          ? `Unlock ${feature}` 
          : 'Upgrade Your Plan'}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4">
        {currentUsage !== undefined && limit !== undefined ? (
          <>You have reached your limit ({currentUsage}/{limit}). </>
        ) : null}
        Upgrade to {plan.name} to get more.
      </p>
      
      <div className="text-2xl font-bold text-gray-900 mb-4">
        {formatPrice(plan.monthlyPrice)}
        <span className="text-sm font-normal text-gray-500">/month</span>
      </div>
      
      <Button onClick={handleUpgrade} className="w-full">
        Upgrade to {plan.name}
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

// Compact version for list items
export const UpgradeChip: React.FC<{ plan?: PlanTier; onClick?: () => void }> = ({ 
  plan = 'pro', 
  onClick 
}) => {
  return (
    <button
      onClick={onClick || (() => window.location.href = '/pricing')}
      className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full hover:bg-amber-200 transition-colors"
    >
      <Sparkles className="h-3 w-3" />
      {PLANS[plan].name}
    </button>
  );
};
