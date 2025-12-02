'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  RefreshCw, 
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useSocialAccounts } from '../context/SocialAccountsContext';
import { AccountCard } from './AccountCard';
import { PlatformGrid } from './PlatformConnectButton';
import type { LatePlatform } from '../types';

export const SocialAccountsPage: React.FC = () => {
  const {
    profiles,
    accounts,
    selectedProfileId,
    isLoading,
    error,
    connectionState,
    setSelectedProfileId,
    createProfile,
    connectAccount,
    disconnectAccount,
    refetch,
  } = useSocialAccounts();

  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [showAddProfile, setShowAddProfile] = useState(false);

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) return;
    
    setIsCreatingProfile(true);
    const result = await createProfile(newProfileName.trim());
    if (result) {
      setNewProfileName('');
      setSelectedProfileId(result._id);
      setShowAddProfile(false);
    }
    setIsCreatingProfile(false);
  };

  const handleConnect = (platform: LatePlatform) => {
    const callbackUrl = `${window.location.origin}/social-accounts?connected=${platform}`;
    connectAccount(platform, callbackUrl);
  };

  const handleDisconnect = async (accountId: string) => {
    setDisconnectingId(accountId);
    await disconnectAccount(accountId);
    setDisconnectingId(null);
  };

  if (isLoading && profiles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Create profile if none exist */}
      {profiles.length === 0 && (
        <Card className="max-w-xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Your First Profile</CardTitle>
            <CardDescription>
              Profiles help you organize your social media accounts by brand, client, or purpose
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <input
                type="text"
                value={newProfileName}
                onChange={e => setNewProfileName(e.target.value)}
                placeholder="e.g., My Business, Personal Brand..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyDown={e => e.key === 'Enter' && handleCreateProfile()}
              />
              <Button 
                onClick={handleCreateProfile}
                disabled={isCreatingProfile || !newProfileName.trim()}
                className="rounded-xl"
              >
                {isCreatingProfile ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile selector - compact bar */}
      {profiles.length > 0 && (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500 mr-1">Profile:</span>
            {profiles.map(profile => (
              <button
                key={profile._id}
                onClick={() => setSelectedProfileId(profile._id)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${selectedProfileId === profile._id 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  <span 
                    className="h-2.5 w-2.5 rounded-full" 
                    style={{ backgroundColor: selectedProfileId === profile._id ? '#fff' : (profile.color || '#6366f1') }}
                  />
                  {profile.name}
                </span>
              </button>
            ))}
            {/* Add new profile button */}
            {!showAddProfile ? (
              <button
                onClick={() => setShowAddProfile(true)}
                className="px-2 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all"
                title="Add new profile"
              >
                <Plus className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <input
                  type="text"
                  value={newProfileName}
                  onChange={e => setNewProfileName(e.target.value)}
                  placeholder="Profile name..."
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-40"
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleCreateProfile();
                    if (e.key === 'Escape') {
                      setShowAddProfile(false);
                      setNewProfileName('');
                    }
                  }}
                  autoFocus
                />
                <button
                  onClick={handleCreateProfile}
                  disabled={isCreatingProfile || !newProfileName.trim()}
                  className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isCreatingProfile ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowAddProfile(false);
                    setNewProfileName('');
                  }}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-all"
                >
                  <span className="sr-only">Cancel</span>
                  ✕
                </button>
              </div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      )}

      {/* Add your social accounts - Main section */}
      {selectedProfileId && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Add your social accounts
            </h1>
            <p className="text-gray-500">
              Connect your Facebook, Instagram, Twitter, LinkedIn, and so on
            </p>
          </div>

          {/* Platform Grid */}
          <PlatformGrid
            connectedAccounts={accounts}
            onConnect={handleConnect}
            isConnecting={connectionState.isConnecting}
            connectingPlatform={connectionState.platform}
          />
        </div>
      )}

      {/* Connected accounts */}
      {accounts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Connected Accounts
            </h2>
            <Badge variant="outline" className="gap-1.5 px-3 py-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              {accounts.length} connected
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map(account => (
              <AccountCard
                key={account._id}
                account={account}
                onDisconnect={handleDisconnect}
                isDisconnecting={disconnectingId === account._id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
