'use client';

import { Megaphone } from 'lucide-react';
import { CampaignCard } from './CampaignCard';
import type { Campaign } from '../types';

interface CampaignListProps {
  campaigns: Campaign[];
  onManageCampaign?: (campaign: Campaign) => void;
  onCreateFirst?: () => void;
}

export function CampaignList({ campaigns, onManageCampaign, onCreateFirst }: CampaignListProps) {
  if (campaigns.length === 0) {
    return (
      <div className="col-span-full py-20 text-center bg-white rounded-xl border border-dashed border-slate-300">
        <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900">No campaigns yet</h3>
        <p className="text-slate-500 mb-4">Start your first campaign to organize your marketing efforts.</p>
        {onCreateFirst && (
          <button 
            onClick={onCreateFirst}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Create your first campaign
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard 
          key={campaign.id} 
          campaign={campaign} 
          onManage={onManageCampaign}
        />
      ))}
    </div>
  );
}
