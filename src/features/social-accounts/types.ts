// Late API Types for Social Media Posting

// Supported platforms by Late
export type LatePlatform = 
  | 'instagram'
  | 'facebook'
  | 'twitter'
  | 'tiktok'
  | 'linkedin'
  | 'youtube'
  | 'pinterest'
  | 'reddit'
  | 'threads'
  | 'bluesky';

// Platform display configuration
export const LATE_PLATFORMS: Record<LatePlatform, {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}> = {
  instagram: {
    label: 'Instagram',
    color: 'text-pink-600',
    bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
    icon: 'instagram',
  },
  facebook: {
    label: 'Facebook',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600',
    icon: 'facebook',
  },
  twitter: {
    label: 'X (Twitter)',
    color: 'text-slate-800',
    bgColor: 'bg-slate-800',
    icon: 'twitter',
  },
  tiktok: {
    label: 'TikTok',
    color: 'text-slate-900',
    bgColor: 'bg-slate-900',
    icon: 'music',
  },
  linkedin: {
    label: 'LinkedIn',
    color: 'text-blue-700',
    bgColor: 'bg-blue-700',
    icon: 'linkedin',
  },
  youtube: {
    label: 'YouTube',
    color: 'text-red-600',
    bgColor: 'bg-red-600',
    icon: 'youtube',
  },
  pinterest: {
    label: 'Pinterest',
    color: 'text-red-700',
    bgColor: 'bg-red-700',
    icon: 'pin',
  },
  reddit: {
    label: 'Reddit',
    color: 'text-orange-600',
    bgColor: 'bg-orange-600',
    icon: 'message-circle',
  },
  threads: {
    label: 'Threads',
    color: 'text-slate-900',
    bgColor: 'bg-slate-900',
    icon: 'at-sign',
  },
  bluesky: {
    label: 'Bluesky',
    color: 'text-sky-500',
    bgColor: 'bg-sky-500',
    icon: 'cloud',
  },
};

// Profile from Late API
export interface LateProfile {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  isDefault?: boolean;
  createdAt: string;
}

// Connected social account from Late API
export interface LateAccount {
  _id: string;
  profileId: string;
  platform: LatePlatform;
  username: string;
  displayName: string;
  profilePicture?: string;
  isActive: boolean;
  tokenExpiresAt?: string;
  permissions?: string[];
}

// Platform-specific data for posting
export interface PlatformSpecificData {
  // Pinterest
  title?: string;
  boardId?: string;
  link?: string;
  coverImageUrl?: string;
  
  // Reddit
  subreddit?: string;
  url?: string;
  
  // LinkedIn
  organizationId?: string;
  
  // Instagram/TikTok
  firstComment?: string;
}

// Media item for posts
export interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

// Platform configuration for a post
export interface PostPlatform {
  platform: LatePlatform;
  accountId: string;
  platformSpecificData?: PlatformSpecificData;
}

// Create post request
export interface CreatePostRequest {
  content: string;
  scheduledFor?: string; // ISO 8601
  timezone?: string; // IANA timezone
  platforms: PostPlatform[];
  mediaItems?: MediaItem[];
  queuedFromProfile?: string;
  publishNow?: boolean; // Post immediately instead of scheduling
}

// Post response
export interface LatePost {
  id: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledFor?: string;
  publishedAt?: string;
  platforms: PostPlatform[];
  mediaItems?: MediaItem[];
  createdAt: string;
  queuedFromProfile?: string;
}

// Queue slot
export interface QueueSlot {
  dayOfWeek: number; // 0-6
  time: string; // HH:mm format
}

// Queue schedule
export interface QueueSchedule {
  profileId: string;
  timezone: string;
  slots: QueueSlot[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Queue response
export interface QueueResponse {
  exists: boolean;
  schedule?: QueueSchedule;
  nextSlots?: string[]; // ISO 8601 dates
}

// API Response types
export interface LateApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ProfilesResponse {
  profiles: LateProfile[];
}

export interface AccountsResponse {
  accounts: LateAccount[];
}

export interface PostsResponse {
  posts: LatePost[];
  total?: number;
  page?: number;
  limit?: number;
}

// Connection state
export interface ConnectionState {
  isConnecting: boolean;
  platform?: LatePlatform;
  profileId?: string;
  error?: string;
}

// Context value
export interface SocialAccountsContextValue {
  // State
  profiles: LateProfile[];
  accounts: LateAccount[];
  isLoading: boolean;
  error: string | null;
  connectionState: ConnectionState;
  
  // Profile operations
  fetchProfiles: () => Promise<void>;
  createProfile: (name: string, description?: string, color?: string) => Promise<LateProfile | null>;
  deleteProfile: (profileId: string) => Promise<boolean>;
  
  // Account operations
  fetchAccounts: (profileId?: string) => Promise<void>;
  connectAccount: (platform: LatePlatform, profileId: string, redirectUrl?: string) => void;
  disconnectAccount: (accountId: string) => Promise<boolean>;
  
  // Posting operations
  createPost: (request: CreatePostRequest) => Promise<LatePost | null>;
  schedulePost: (request: CreatePostRequest) => Promise<LatePost | null>;
  
  // Helpers
  getAccountsByProfile: (profileId: string) => LateAccount[];
  getAccountsByPlatform: (platform: LatePlatform) => LateAccount[];
  hasConnectedAccounts: boolean;
}

// Storage keys
export const LATE_STORAGE_KEYS = {
  SELECTED_PROFILE: 'late_selected_profile',
  ACCOUNTS_CACHE: 'late_accounts_cache',
} as const;
