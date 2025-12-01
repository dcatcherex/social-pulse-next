'use client';

import { Play, Target, TrendingUp, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Campaign } from '../types';
import { CampaignStatus } from '../types';

interface CampaignStatsProps {
  campaigns: Campaign[];
}

export function CampaignStats({ campaigns }: CampaignStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const activeCampaigns = campaigns.filter(c => c.status === CampaignStatus.ACTIVE);
  const totalBudget = campaigns.reduce((acc, c) => acc + (c.stats.budget || 0), 0);
  const totalSpent = campaigns.reduce((acc, c) => acc + (c.stats.spent || 0), 0);
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.stats.impressions, 0);

  const stats = [
    {
      label: 'Active Campaigns',
      value: activeCampaigns.length,
      icon: Play,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Total Budget',
      value: `$${formatNumber(totalBudget)}`,
      icon: Target,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      label: 'Total Spent',
      value: `$${formatNumber(totalSpent)}`,
      icon: TrendingUp,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Total Impressions',
      value: formatNumber(totalImpressions),
      icon: Eye,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
