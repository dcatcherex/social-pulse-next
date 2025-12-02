'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as lateService from '../services/late-service';
import type { 
  LateAccount, 
  CreatePostRequest,
  LatePlatform 
} from '../types';

// Query keys
export const socialAccountsKeys = {
  all: ['social-accounts'] as const,
  profiles: () => [...socialAccountsKeys.all, 'profiles'] as const,
  accounts: (profileId?: string) => [...socialAccountsKeys.all, 'accounts', profileId] as const,
  posts: (filters?: Record<string, unknown>) => [...socialAccountsKeys.all, 'posts', filters] as const,
};

/**
 * Hook to fetch profiles
 */
export const useProfiles = () => {
  return useQuery({
    queryKey: socialAccountsKeys.profiles(),
    queryFn: lateService.fetchProfiles,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create a profile
 */
export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ name, description, color }: { 
      name: string; 
      description?: string; 
      color?: string 
    }) => lateService.createProfile(name, description, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: socialAccountsKeys.profiles() });
    },
  });
};

/**
 * Hook to delete a profile
 */
export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (profileId: string) => lateService.deleteProfile(profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: socialAccountsKeys.profiles() });
      queryClient.invalidateQueries({ queryKey: socialAccountsKeys.accounts() });
    },
  });
};

/**
 * Hook to fetch accounts
 */
export const useAccounts = (profileId?: string) => {
  return useQuery({
    queryKey: socialAccountsKeys.accounts(profileId),
    queryFn: () => lateService.fetchAccounts(profileId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to connect an account (returns OAuth URL)
 */
export const useConnectAccount = () => {
  return useMutation({
    mutationFn: async ({ 
      platform, 
      profileId, 
      redirectUrl 
    }: { 
      platform: LatePlatform; 
      profileId: string; 
      redirectUrl?: string 
    }) => {
      const oauthUrl = await lateService.getConnectUrl(platform, profileId, redirectUrl);
      return oauthUrl;
    },
  });
};

/**
 * Hook to disconnect an account
 */
export const useDisconnectAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (accountId: string) => lateService.disconnectAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: socialAccountsKeys.accounts() });
    },
  });
};

/**
 * Hook to create/schedule a post
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: CreatePostRequest) => lateService.createPost(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: socialAccountsKeys.posts() });
    },
  });
};

/**
 * Hook to fetch posts
 */
export const usePosts = (filters?: {
  page?: number;
  limit?: number;
  status?: string;
  platform?: string;
  profileId?: string;
}) => {
  return useQuery({
    queryKey: socialAccountsKeys.posts(filters),
    queryFn: () => lateService.fetchPosts(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Hook to update a post
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, updates }: { 
      postId: string; 
      updates: Partial<CreatePostRequest> 
    }) => lateService.updatePost(postId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: socialAccountsKeys.posts() });
    },
  });
};

/**
 * Hook to delete a post
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId: string) => lateService.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: socialAccountsKeys.posts() });
    },
  });
};

/**
 * Combined hook for common social accounts operations
 */
export const useSocialAccountsData = (selectedProfileId?: string) => {
  const profilesQuery = useProfiles();
  const accountsQuery = useAccounts(selectedProfileId);
  
  const profiles = profilesQuery.data || [];
  const accounts = accountsQuery.data || [];
  
  const getAccountsByPlatform = (platform: LatePlatform): LateAccount[] => {
    return accounts.filter(acc => acc.platform === platform);
  };
  
  const getAccountsByProfile = (profileId: string): LateAccount[] => {
    return accounts.filter(acc => acc.profileId === profileId);
  };
  
  const hasConnectedAccounts = accounts.length > 0;
  
  return {
    profiles,
    accounts,
    isLoading: profilesQuery.isLoading || accountsQuery.isLoading,
    isError: profilesQuery.isError || accountsQuery.isError,
    error: profilesQuery.error || accountsQuery.error,
    getAccountsByPlatform,
    getAccountsByProfile,
    hasConnectedAccounts,
    refetch: () => {
      profilesQuery.refetch();
      accountsQuery.refetch();
    },
  };
};
