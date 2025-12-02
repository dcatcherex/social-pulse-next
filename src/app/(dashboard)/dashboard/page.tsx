'use client';

import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Calendar,
  PenTool,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-indigo-50 rounded-lg">
            {icon}
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {Math.abs(change)}%
          </div>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-sm text-slate-500 mt-1">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

function QuickAction({ title, description, icon, href, color }: QuickActionProps) {
  return (
    <Link href={href} className="block group">
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
            {icon}
          </div>
          <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const stats: StatCardProps[] = [
    {
      title: 'Total Followers',
      value: '24.5K',
      change: 12.5,
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      trend: 'up',
    },
    {
      title: 'Engagement Rate',
      value: '4.2%',
      change: 8.1,
      icon: <MessageSquare className="w-5 h-5 text-indigo-600" />,
      trend: 'up',
    },
    {
      title: 'Total Impressions',
      value: '128K',
      change: 15.3,
      icon: <Eye className="w-5 h-5 text-indigo-600" />,
      trend: 'up',
    },
    {
      title: 'Active Trends',
      value: '12',
      change: 3,
      icon: <TrendingUp className="w-5 h-5 text-indigo-600" />,
      trend: 'up',
    },
  ];

  const quickActions: QuickActionProps[] = [
    {
      title: 'Discover Trends',
      description: 'Find viral topics for your industry',
      icon: <TrendingUp className="w-5 h-5 text-white" />,
      href: '/trends',
      color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    },
    {
      title: 'Generate Content',
      description: 'Create AI-powered posts instantly',
      icon: <PenTool className="w-5 h-5 text-white" />,
      href: '/content',
      color: 'bg-gradient-to-br from-pink-500 to-rose-600',
    },
    {
      title: 'Schedule Posts',
      description: 'Plan your content calendar',
      icon: <Calendar className="w-5 h-5 text-white" />,
      href: '/schedule',
      color: 'bg-gradient-to-br from-amber-500 to-orange-600',
    },
    {
      title: 'Track Campaigns',
      description: 'Monitor campaign performance',
      icon: <Target className="w-5 h-5 text-white" />,
      href: '/campaigns',
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your social media.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <QuickAction key={action.title} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Activity & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New trend discovered', topic: 'AI in Education', time: '2 hours ago' },
                { action: 'Content generated', topic: 'Summer Travel Tips', time: '5 hours ago' },
                { action: 'Post scheduled', topic: 'Product Launch', time: '1 day ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.action}</p>
                    <p className="text-xs text-slate-500">{item.topic}</p>
                  </div>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" size="sm">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <p className="text-sm text-slate-700">
                  Check <Link href="/trends" className="text-indigo-600 font-medium hover:underline">Trends</Link> daily to stay ahead of viral topics
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <p className="text-sm text-slate-700">
                  Use AI content generator to create posts 10x faster
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <p className="text-sm text-slate-700">
                  Schedule posts for optimal engagement times
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <p className="text-sm text-slate-700">
                  Monitor competitors to find content gaps
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
