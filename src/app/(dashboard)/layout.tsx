'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Radio, 
  Megaphone, 
  PenTool, 
  Calendar, 
  ChartColumn, 
  Settings,
  TrendingUp,
  Sparkles,
  Building2,
  FolderOpen,
  Link2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandSwitcher } from '@/features/brand-management';
import { UserButton, useUser } from '@clerk/nextjs';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/trends', label: 'Trends', icon: TrendingUp },
  { path: '/monitor', label: 'Listening Feed', icon: Radio },
  { path: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { path: '/content', label: 'Content AI', icon: PenTool },
  { path: '/library', label: 'Content Library', icon: FolderOpen },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/social-accounts', label: 'Social Accounts', icon: Link2 },
  { path: '/competitors', label: 'Competitors', icon: ChartColumn },
  { path: '/brand', label: 'Brand Profile', icon: Building2 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  // Show loading state while Clerk loads
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-50 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900">Social Pulse</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Brand Switcher */}
        <div className="p-4 border-t border-slate-100 bg-indigo-950">
          <BrandSwitcher />
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="text-sm text-slate-500">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! 👋
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {user?.emailAddresses?.[0]?.emailAddress || 'Account'}
            </span>
            <UserButton 
              afterSignOutUrl="/landing"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
