'use client';

import { useState } from 'react';
import { 
  ChartColumn, 
  Plus,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Eye,
  BarChart3,
  ExternalLink,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Competitor {
  id: string;
  name: string;
  logo: string;
  followers: number;
  followersChange: number;
  engagement: number;
  engagementChange: number;
  postsPerWeek: number;
  topPlatform: 'instagram' | 'twitter' | 'linkedin';
  sentiment: 'positive' | 'neutral' | 'negative';
}

const platformIcons = {
  instagram: <Instagram className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
};

// Demo data
const demoCompetitors: Competitor[] = [
  {
    id: '1',
    name: 'Competitor A',
    logo: '🏢',
    followers: 125000,
    followersChange: 5.2,
    engagement: 4.8,
    engagementChange: 0.3,
    postsPerWeek: 12,
    topPlatform: 'instagram',
    sentiment: 'positive',
  },
  {
    id: '2',
    name: 'Competitor B',
    logo: '🏬',
    followers: 89000,
    followersChange: -2.1,
    engagement: 3.2,
    engagementChange: -0.5,
    postsPerWeek: 8,
    topPlatform: 'twitter',
    sentiment: 'neutral',
  },
  {
    id: '3',
    name: 'Competitor C',
    logo: '🏭',
    followers: 210000,
    followersChange: 8.7,
    engagement: 5.5,
    engagementChange: 1.2,
    postsPerWeek: 15,
    topPlatform: 'linkedin',
    sentiment: 'positive',
  },
];

const yourMetrics = {
  followers: 95000,
  followersChange: 3.5,
  engagement: 4.2,
  engagementChange: 0.8,
  postsPerWeek: 10,
};

export default function CompetitorsPage() {
  const [competitors] = useState<Competitor[]>(demoCompetitors);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const avgCompetitorFollowers = competitors.reduce((acc, c) => acc + c.followers, 0) / competitors.length;
  const avgCompetitorEngagement = competitors.reduce((acc, c) => acc + c.engagement, 0) / competitors.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ChartColumn className="w-6 h-6 text-indigo-600" />
            Competitor Analysis
          </h1>
          <p className="text-slate-500 mt-1">
            Track and compare your performance against competitors
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Competitor
        </Button>
      </div>

      {/* Your Position */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
        <CardHeader>
          <CardTitle className="text-lg">Your Position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">Your Followers</p>
              <p className="text-2xl font-bold text-slate-900">{formatNumber(yourMetrics.followers)}</p>
              <div className={`flex items-center gap-1 text-sm ${yourMetrics.followersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {yourMetrics.followersChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(yourMetrics.followersChange)}% vs last month
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Your Engagement</p>
              <p className="text-2xl font-bold text-slate-900">{yourMetrics.engagement}%</p>
              <div className={`flex items-center gap-1 text-sm ${yourMetrics.engagementChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {yourMetrics.engagementChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(yourMetrics.engagementChange)}% vs last month
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">vs Avg Competitor Followers</p>
              <p className="text-2xl font-bold text-slate-900">
                {yourMetrics.followers > avgCompetitorFollowers ? (
                  <span className="text-green-600">+{formatNumber(yourMetrics.followers - avgCompetitorFollowers)}</span>
                ) : (
                  <span className="text-red-600">-{formatNumber(avgCompetitorFollowers - yourMetrics.followers)}</span>
                )}
              </p>
              <p className="text-sm text-slate-500">difference</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">vs Avg Competitor Engagement</p>
              <p className="text-2xl font-bold text-slate-900">
                {yourMetrics.engagement > avgCompetitorEngagement ? (
                  <span className="text-green-600">+{(yourMetrics.engagement - avgCompetitorEngagement).toFixed(1)}%</span>
                ) : (
                  <span className="text-red-600">{(yourMetrics.engagement - avgCompetitorEngagement).toFixed(1)}%</span>
                )}
              </p>
              <p className="text-sm text-slate-500">difference</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitors.map((competitor) => (
          <Card key={competitor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">
                    {competitor.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{competitor.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      {platformIcons[competitor.topPlatform]}
                      <span className="capitalize">{competitor.topPlatform}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={competitor.sentiment === 'positive' ? 'default' : 'secondary'}>
                  {competitor.sentiment}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                    <Users className="w-4 h-4" />
                    Followers
                  </div>
                  <p className="text-lg font-bold text-slate-900">{formatNumber(competitor.followers)}</p>
                  <div className={`flex items-center gap-1 text-xs ${competitor.followersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {competitor.followersChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(competitor.followersChange)}%
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                    <MessageSquare className="w-4 h-4" />
                    Engagement
                  </div>
                  <p className="text-lg font-bold text-slate-900">{competitor.engagement}%</p>
                  <div className={`flex items-center gap-1 text-xs ${competitor.engagementChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {competitor.engagementChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(competitor.engagementChange)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <BarChart3 className="w-4 h-4" />
                  {competitor.postsPerWeek} posts/week
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <p className="text-sm text-green-800">
                <span className="font-medium">Strength:</span> Your engagement rate (4.2%) is above the competitor average (4.5%). Keep creating quality content!
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-sm text-amber-800">
                <span className="font-medium">Opportunity:</span> Competitor C posts 15 times per week. Consider increasing your posting frequency for better visibility.
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Trend:</span> All competitors are increasing their LinkedIn presence. Consider expanding your LinkedIn strategy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
