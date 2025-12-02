'use client';

import { useState } from 'react';
import { Target, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  useCampaigns, 
  CampaignStats, 
  CampaignList, 
  CampaignWizard,
  type Campaign,
} from '@/features/campaigns';

export default function CampaignsPage() {
  const { campaigns, addCampaign } = useCampaigns();
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleCampaignCreated = (campaign: Campaign) => {
    addCampaign(campaign);
  };

  const handleManageCampaign = (campaign: Campaign) => {
    // TODO: Navigate to campaign detail page or open edit modal
    console.log('Manage campaign:', campaign.id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-600" />
            Campaigns
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and track your marketing campaigns
          </p>
        </div>
        <Button onClick={() => setWizardOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Stats */}
      <CampaignStats campaigns={campaigns} />

      {/* Campaigns List */}
      <CampaignList 
        campaigns={campaigns} 
        onManageCampaign={handleManageCampaign}
        onCreateFirst={() => setWizardOpen(true)}
      />

      {/* AI Campaign Wizard */}
      <CampaignWizard 
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onCampaignCreated={handleCampaignCreated}
      />
    </div>
  );
}
