'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { 
  useProfiles, 
  useAccounts, 
  useCreateProfile, 
  useDeleteProfile,
  useConnectAccount,
  useDisconnectAccount,
  useCreatePost,
} from '../hooks/use-social-accounts';
import type { 
  LateProfile, 
  LateAccount, 
  LatePlatform, 
  CreatePostRequest,
  LatePost,
  ConnectionState,
} from '../types';
import { LATE_STORAGE_KEYS } from '../types';

// Helper to get initial profile ID from localStorage
const getInitialProfileId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LATE_STORAGE_KEYS.SELECTED_PROFILE);
};

interface SocialAccountsContextValue {
  // State
  profiles: LateProfile[];
  accounts: LateAccount[];
  selectedProfileId: string | null;
  isLoading: boolean;
  error: string | null;
  connectionState: ConnectionState;
  
  // Profile operations
  setSelectedProfileId: (profileId: string | null) => void;
  createProfile: (name: string, description?: string, color?: string) => Promise<LateProfile | null>;
  deleteProfile: (profileId: string) => Promise<boolean>;
  
  // Account operations
  connectAccount: (platform: LatePlatform, redirectUrl?: string) => Promise<void>;
  disconnectAccount: (accountId: string) => Promise<boolean>;
  
  // Posting operations
  publishPost: (request: CreatePostRequest) => Promise<LatePost | null>;
  
  // Helpers
  getAccountsByProfile: (profileId: string) => LateAccount[];
  getAccountsByPlatform: (platform: LatePlatform) => LateAccount[];
  hasConnectedAccounts: boolean;
  refetch: () => void;
}

const SocialAccountsContext = createContext<SocialAccountsContextValue | null>(null);

export const useSocialAccounts = () => {
  const context = useContext(SocialAccountsContext);
  if (!context) {
    throw new Error('useSocialAccounts must be used within SocialAccountsProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const SocialAccountsProvider: React.FC<Props> = ({ children }) => {
  // Use lazy initializer for localStorage
  const [selectedProfileId, setSelectedProfileIdState] = useState<string | null>(getInitialProfileId);
  const [connectionState, setConnectionState] = useState<ConnectionState>({ isConnecting: false });
  const [error, setError] = useState<string | null>(null);

  // Queries
  const profilesQuery = useProfiles();
  const accountsQuery = useAccounts(selectedProfileId || undefined);
  
  // Mutations
  const createProfileMutation = useCreateProfile();
  const deleteProfileMutation = useDeleteProfile();
  const connectAccountMutation = useConnectAccount();
  const disconnectAccountMutation = useDisconnectAccount();
  const createPostMutation = useCreatePost();

  // Memoize data arrays
  const profiles = useMemo(() => profilesQuery.data || [], [profilesQuery.data]);
  const accounts = useMemo(() => accountsQuery.data || [], [accountsQuery.data]);
  const isLoading = profilesQuery.isLoading || accountsQuery.isLoading;

  // Compute effective profile ID (auto-select first if none selected)
  const effectiveProfileId = useMemo(() => {
    if (selectedProfileId) return selectedProfileId;
    if (profiles.length > 0) {
      const defaultProfile = profiles.find(p => p.isDefault) || profiles[0];
      return defaultProfile._id;
    }
    return null;
  }, [selectedProfileId, profiles]);

  // Save selected profile to localStorage
  const setSelectedProfileId = useCallback((profileId: string | null) => {
    setSelectedProfileIdState(profileId);
    if (typeof window !== 'undefined') {
      if (profileId) {
        localStorage.setItem(LATE_STORAGE_KEYS.SELECTED_PROFILE, profileId);
      } else {
        localStorage.removeItem(LATE_STORAGE_KEYS.SELECTED_PROFILE);
      }
    }
  }, []);

  // Create profile
  const createProfile = useCallback(async (
    name: string, 
    description?: string, 
    color?: string
  ): Promise<LateProfile | null> => {
    try {
      setError(null);
      const result = await createProfileMutation.mutateAsync({ name, description, color });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create profile';
      setError(message);
      return null;
    }
  }, [createProfileMutation]);

  // Delete profile
  const deleteProfile = useCallback(async (profileId: string): Promise<boolean> => {
    try {
      setError(null);
      await deleteProfileMutation.mutateAsync(profileId);
      if (selectedProfileId === profileId) {
        setSelectedProfileId(null);
      }
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete profile';
      setError(message);
      return false;
    }
  }, [deleteProfileMutation, selectedProfileId, setSelectedProfileId]);

  // Connect account
  const connectAccount = useCallback(async (
    platform: LatePlatform, 
    redirectUrl?: string
  ): Promise<void> => {
    if (!effectiveProfileId) {
      setError('Please select a profile first');
      return;
    }
    
    try {
      setError(null);
      setConnectionState({ isConnecting: true, platform, profileId: effectiveProfileId });
      
      // Build redirect URL to come back to our app
      const callbackUrl = redirectUrl || `${window.location.origin}/social-accounts/callback`;
      
      const oauthUrl = await connectAccountMutation.mutateAsync({
        platform,
        profileId: effectiveProfileId,
        redirectUrl: callbackUrl,
      });
      
      // Open OAuth window
      window.location.href = oauthUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect account';
      setError(message);
      setConnectionState({ isConnecting: false, error: message });
    }
  }, [effectiveProfileId, connectAccountMutation]);

  // Disconnect account
  const disconnectAccount = useCallback(async (accountId: string): Promise<boolean> => {
    try {
      setError(null);
      await disconnectAccountMutation.mutateAsync(accountId);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to disconnect account';
      setError(message);
      return false;
    }
  }, [disconnectAccountMutation]);

  // Publish post
  const publishPost = useCallback(async (
    request: CreatePostRequest
  ): Promise<LatePost | null> => {
    try {
      setError(null);
      const result = await createPostMutation.mutateAsync(request);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to publish post';
      setError(message);
      return null;
    }
  }, [createPostMutation]);

  // Helper functions
  const getAccountsByProfile = useCallback((profileId: string): LateAccount[] => {
    return accounts.filter(acc => acc.profileId === profileId);
  }, [accounts]);

  const getAccountsByPlatform = useCallback((platform: LatePlatform): LateAccount[] => {
    return accounts.filter(acc => acc.platform === platform);
  }, [accounts]);

  const hasConnectedAccounts = accounts.length > 0;

  const refetch = useCallback(() => {
    profilesQuery.refetch();
    accountsQuery.refetch();
  }, [profilesQuery, accountsQuery]);

  const value: SocialAccountsContextValue = {
    profiles,
    accounts,
    selectedProfileId: effectiveProfileId,
    isLoading,
    error,
    connectionState,
    setSelectedProfileId,
    createProfile,
    deleteProfile,
    connectAccount,
    disconnectAccount,
    publishPost,
    getAccountsByProfile,
    getAccountsByPlatform,
    hasConnectedAccounts,
    refetch,
  };

  return (
    <SocialAccountsContext.Provider value={value}>
      {children}
    </SocialAccountsContext.Provider>
  );
};
