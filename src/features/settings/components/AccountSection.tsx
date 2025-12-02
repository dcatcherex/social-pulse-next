'use client';

import { LogOut } from 'lucide-react';

export function AccountSection() {
  const handleLogout = () => {
    // TODO: Implement with auth provider
    console.log('Logout');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Account Settings</h2>
        <p className="text-sm text-slate-500">Manage your account and session.</p>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <h3 className="font-medium text-slate-700 mb-4">Danger Zone</h3>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}
