'use client';

import { useState } from 'react';
import { Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useBrand } from '@/features/brand-management';
import { useCampaignGenerator } from '../hooks/use-campaign-generator';
import type { Campaign } from '../types';

interface CampaignWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCampaignCreated: (campaign: Campaign) => void;
}

export function CampaignWizard({ open, onOpenChange, onCampaignCreated }: CampaignWizardProps) {
  const { activeProfile } = useBrand();
  const [goal, setGoal] = useState('');
  
  const {
    isGenerating,
    generatedDraft,
    error,
    generateCampaign,
    createCampaignFromDraft,
    clearDraft,
  } = useCampaignGenerator(activeProfile);

  const handleGenerate = async () => {
    await generateCampaign(goal);
  };

  const handleSave = () => {
    const campaign = createCampaignFromDraft();
    if (campaign) {
      onCampaignCreated(campaign);
      handleClose();
    }
  };

  const handleClose = () => {
    setGoal('');
    clearDraft();
    onOpenChange(false);
  };

  const handleBack = () => {
    clearDraft();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg" showCloseButton={false}>
        <DialogHeader className="bg-indigo-950 text-white -m-6 mb-0 p-6 rounded-t-lg">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            AI Campaign Wizard
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {!generatedDraft ? (
            // Step 1: Enter Goal
            <>
              <div className="space-y-2">
                <Label htmlFor="goal" className="text-sm font-bold text-slate-700">
                  What is your campaign goal?
                </Label>
                <Textarea
                  id="goal"
                  value={goal}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGoal(e.target.value)}
                  placeholder="e.g., Increase sales for our new summer coffee menu by 25%"
                  className="min-h-[120px] resize-none"
                />
                <p className="text-xs text-slate-400">
                  Be specific about what you want to achieve. The AI will create a tailored strategy.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !goal.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Strategy...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Strategy
                  </>
                )}
              </Button>
            </>
          ) : (
            // Step 2: Review Generated Strategy
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                <h3 className="font-bold text-emerald-800 text-lg mb-1">
                  {generatedDraft.name}
                </h3>
                <p className="text-emerald-700 text-sm">
                  {generatedDraft.description}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Recommended Platforms
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {generatedDraft.platforms?.map((platform) => (
                    <span 
                      key={platform} 
                      className="px-3 py-1 bg-slate-100 rounded-lg text-sm font-medium text-slate-700"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              {generatedDraft.suggestedDuration && (
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    Suggested Duration
                  </span>
                  <p className="text-sm text-slate-700 mt-1">
                    {generatedDraft.suggestedDuration} days
                  </p>
                </div>
              )}

              {generatedDraft.contentSuggestions && generatedDraft.contentSuggestions.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    Content Ideas
                  </span>
                  <ul className="mt-2 space-y-1">
                    {generatedDraft.contentSuggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-indigo-500">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <Button 
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={handleSave}
                  className="flex-1"
                >
                  Create Campaign
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
