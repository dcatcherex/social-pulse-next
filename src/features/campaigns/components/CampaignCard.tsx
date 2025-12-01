'use client';

import { useMemo } from 'react';
import { Calendar, Target, MoreHorizontal, Play, Pause, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Campaign } from '../types';
import { CampaignStatus, CAMPAIGN_STATUS_CONFIG } from '../types';

interface CampaignCardProps {
  campaign: Campaign;
  onManage?: (campaign: Campaign) => void;
}

const StatusIcon = ({ status }: { status: CampaignStatus }) => {
  switch (status) {
    case CampaignStatus.ACTIVE:
      return <Play className="w-3 h-3" />;
    case CampaignStatus.PAUSED:
      return <Pause className="w-3 h-3" />;
    case CampaignStatus.COMPLETED:
      return <CheckCircle2 className="w-3 h-3" />;
    case CampaignStatus.SCHEDULED:
      return <Clock className="w-3 h-3" />;
    default:
      return null;
  }
};

export function CampaignCard({ campaign, onManage }: CampaignCardProps) {
  const statusConfig = CAMPAIGN_STATUS_CONFIG[campaign.status];
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const timelineProgress = useMemo(() => {
    const start = new Date(campaign.startDate).getTime();
    const end = new Date(campaign.endDate).getTime();
    const now = new Date().getTime();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }, [campaign.startDate, campaign.endDate]);

  const budgetProgress = campaign.stats.budget 
    ? (campaign.stats.spent || 0) / campaign.stats.budget * 100 
    : 0;

  return (
    <Card className="hover:shadow-md transition-shadow group">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-slate-900">{campaign.name}</h3>
              <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border-0`}>
                <StatusIcon status={campaign.status} />
                <span className="ml-1">{statusConfig.label}</span>
              </Badge>
            </div>
            <p className="text-sm text-slate-500 line-clamp-2">{campaign.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
              <Target className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
            </div>
            <button className="text-slate-400 hover:text-slate-600 p-1">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Goal */}
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <span className="text-xs font-medium text-slate-400 uppercase">Goal</span>
          <p className="text-sm text-slate-700 mt-1">{campaign.goal}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-xs text-slate-400 uppercase font-medium">Posts</p>
            <p className="text-lg font-bold text-slate-800">{campaign.stats.postsCount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-medium">Engage</p>
            <p className="text-lg font-bold text-slate-800">{formatNumber(campaign.stats.totalEngagement)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-medium">Clicks</p>
            <p className="text-lg font-bold text-slate-800">{formatNumber(campaign.stats.clicks)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-medium">Impress.</p>
            <p className="text-lg font-bold text-slate-800">{formatNumber(campaign.stats.impressions)}</p>
          </div>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
        </div>

        {/* Timeline Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-500">Timeline</span>
            <span className="text-indigo-600">{Math.round(timelineProgress)}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${timelineProgress}%` }}
            />
          </div>
        </div>

        {/* Budget Progress (if available) */}
        {campaign.stats.budget && campaign.stats.budget > 0 && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500">Budget</span>
              <span className="text-slate-700">
                ${formatNumber(campaign.stats.spent || 0)} / ${formatNumber(campaign.stats.budget)}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetProgress > 90 ? 'bg-red-500' : 
                  budgetProgress > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(budgetProgress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex -space-x-2">
            {campaign.platforms.map((platform, idx) => (
              <div 
                key={idx} 
                className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm text-xs font-bold text-slate-600"
                title={platform}
              >
                {platform.charAt(0)}
              </div>
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onManage?.(campaign)}
            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
          >
            Manage
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
