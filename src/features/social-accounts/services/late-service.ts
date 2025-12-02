import type {
  LateProfile,
  LateAccount,
  LatePost,
  CreatePostRequest,
  LatePlatform,
  ProfilesResponse,
  AccountsResponse,
} from '../types';

const API_BASE = '/api/late';

/**
 * Fetch all profiles
 */
export const fetchProfiles = async (): Promise<LateProfile[]> => {
  const response = await fetch(`${API_BASE}/profiles`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch profiles');
  }
  
  const data: ProfilesResponse = await response.json();
  return data.profiles || [];
};

/**
 * Create a new profile
 */
export const createProfile = async (
  name: string,
  description?: string,
  color?: string
): Promise<LateProfile> => {
  const response = await fetch(`${API_BASE}/profiles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, color }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create profile');
  }
  
  return response.json();
};

/**
 * Delete a profile
 */
export const deleteProfile = async (profileId: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/profiles?profileId=${profileId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to delete profile');
  }
};

/**
 * Fetch connected accounts
 */
export const fetchAccounts = async (profileId?: string): Promise<LateAccount[]> => {
  const url = profileId 
    ? `${API_BASE}/accounts?profileId=${profileId}`
    : `${API_BASE}/accounts`;
    
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch accounts');
  }
  
  const data: AccountsResponse = await response.json();
  return data.accounts || [];
};

/**
 * Get OAuth URL for connecting a platform
 */
export const getConnectUrl = async (
  platform: LatePlatform,
  profileId: string,
  redirectUrl?: string
): Promise<string> => {
  const params = new URLSearchParams({
    platform,
    profileId,
  });
  
  if (redirectUrl) {
    params.set('redirect_url', redirectUrl);
  }
  
  const response = await fetch(`${API_BASE}/connect?${params}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to get connect URL');
  }
  
  const data = await response.json();
  return data.oauthUrl;
};

/**
 * Disconnect an account
 */
export const disconnectAccount = async (accountId: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/accounts?accountId=${accountId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to disconnect account');
  }
};

/**
 * Create/schedule a post
 */
export const createPost = async (request: CreatePostRequest): Promise<LatePost> => {
  const response = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create post');
  }
  
  return response.json();
};

/**
 * Get posts with filters
 */
export const fetchPosts = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  platform?: string;
  profileId?: string;
}): Promise<{ posts: LatePost[]; total?: number }> => {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    });
  }
  
  const url = `${API_BASE}/posts${searchParams.toString() ? `?${searchParams}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch posts');
  }
  
  return response.json();
};

/**
 * Update a post
 */
export const updatePost = async (
  postId: string,
  updates: Partial<CreatePostRequest>
): Promise<LatePost> => {
  const response = await fetch(`${API_BASE}/posts`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId, ...updates }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update post');
  }
  
  return response.json();
};

/**
 * Delete a post
 */
export const deletePost = async (postId: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/posts?postId=${postId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to delete post');
  }
};

/**
 * Get user's timezone
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Format date for Late API (ISO 8601)
 */
export const formatScheduleDate = (date: Date): string => {
  return date.toISOString();
};
