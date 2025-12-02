'use client';

import React from 'react';
import { Loader2, Check } from 'lucide-react';
import type { LatePlatform, LateAccount } from '../types';
import { LATE_PLATFORMS } from '../types';

interface PlatformConnectButtonProps {
  platform: LatePlatform;
  connectedAccounts: LateAccount[];
  onConnect: (platform: LatePlatform) => void;
  isConnecting?: boolean;
  connectingPlatform?: LatePlatform;
}

// SVG icons for each platform (branded colors)
const PlatformIcon: React.FC<{ platform: LatePlatform; className?: string }> = ({ platform, className = '' }) => {
  const size = 40;
  
  switch (platform) {
    case 'facebook':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#1877F2"/>
          <path d="M16.5 12.5h-3v8h-3v-8h-2v-3h2V7.5c0-2.5 1.5-4 4-4h2v3h-1.5c-1 0-1.5.5-1.5 1.5v1.5h3l-.5 3z" fill="white"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFDC80"/>
              <stop offset="25%" stopColor="#F77737"/>
              <stop offset="50%" stopColor="#E1306C"/>
              <stop offset="75%" stopColor="#C13584"/>
              <stop offset="100%" stopColor="#833AB4"/>
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-gradient)"/>
          <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" fill="none"/>
          <circle cx="17" cy="7" r="1.5" fill="white"/>
        </svg>
      );
    case 'tiktok':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#000000"/>
          <path d="M16.5 8.5c-1 0-2-.5-2.5-1.5v7c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5 2-4.5 4.5-4.5v2c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5V5h2c0 2 1.5 3.5 3.5 3.5v2" fill="#25F4EE"/>
          <path d="M17 8c-1 0-2-.5-2.5-1.5v7c0 2.5-2 4.5-4.5 4.5" stroke="#FE2C55" strokeWidth="1"/>
        </svg>
      );
    case 'twitter':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#000000"/>
          <path d="M13.5 10.5L18 5h-1.5l-3.5 4.5L10 5H5l5 7-5 7h1.5l4-5 3.5 5H19l-5.5-8.5z" fill="white"/>
        </svg>
      );
    case 'threads':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#000000"/>
          <path d="M12 6c-3 0-5 2-5 5v2c0 3 2 5 5 5s5-2 5-5v-1c0-1-.5-2-1.5-2.5-.5-.25-1-.25-1.5 0-.5.25-1 .75-1 1.5v2c0 .5.5 1 1 1s1-.5 1-1v-1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#0A66C2"/>
          <path d="M8 10v7M8 7v.01M11 17v-4c0-1.5 1-2 2-2s2 .5 2 2v4M11 10v7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'pinterest':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#E60023"/>
          <path d="M12 6c-3.3 0-6 2.7-6 6 0 2.3 1.3 4.3 3.2 5.3-.1-.8-.1-2 0-2.9l1-4s-.3-.5-.3-1.3c0-1.2.7-2.1 1.6-2.1.8 0 1.1.6 1.1 1.3 0 .8-.5 2-.8 3.1-.2.9.5 1.7 1.4 1.7 1.7 0 3-1.8 3-4.4 0-2.3-1.6-3.9-4-3.9-2.7 0-4.3 2-4.3 4.1 0 .8.3 1.7.7 2.2.1.1.1.2.1.3l-.3 1c0 .2-.2.2-.3.1-1.1-.5-1.7-2.1-1.7-3.4 0-2.8 2-5.3 5.8-5.3 3 0 5.4 2.2 5.4 5.1 0 3-1.9 5.5-4.6 5.5-.9 0-1.7-.5-2-1l-.5 2c-.2.8-.8 1.8-1.2 2.4.9.3 1.8.4 2.8.4 3.3 0 6-2.7 6-6s-2.7-6-6-6z" fill="white"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#FF0000"/>
          <path d="M10 15l5-3-5-3v6z" fill="white"/>
        </svg>
      );
    case 'reddit':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#FF4500"/>
          <circle cx="12" cy="13" r="5" fill="white"/>
          <circle cx="9.5" cy="12" r="1" fill="#FF4500"/>
          <circle cx="14.5" cy="12" r="1" fill="#FF4500"/>
          <path d="M9 15c1 1 2.5 1.5 3 1.5s2-.5 3-1.5" stroke="#FF4500" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
          <circle cx="17" cy="7" r="1.5" fill="white"/>
          <path d="M14 5l2 2" stroke="white" strokeWidth="1"/>
        </svg>
      );
    case 'bluesky':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#0085FF"/>
          <path d="M12 6c2 3 5 6 5 8.5 0 2-1.5 3-3 2.5.5 1.5 0 2.5-1.5 2.5H12h-.5c-1.5 0-2-.9-1.5-2.5-1.5.5-3-.5-3-2.5 0-2.5 3-5.5 5-8.5z" fill="white"/>
        </svg>
      );
    default:
      return null;
  }
};

export const PlatformConnectButton: React.FC<PlatformConnectButtonProps> = ({
  platform,
  connectedAccounts,
  onConnect,
  isConnecting = false,
  connectingPlatform,
}) => {
  const platformConfig = LATE_PLATFORMS[platform];
  const accountsForPlatform = connectedAccounts.filter(a => a.platform === platform);
  const isConnected = accountsForPlatform.length > 0;
  const isCurrentlyConnecting = isConnecting && connectingPlatform === platform;

  return (
    <button
      onClick={() => onConnect(platform)}
      disabled={isConnecting}
      className={`
        group flex flex-col items-center justify-center
        p-4 sm:p-6
        bg-white
        border border-gray-200
        rounded-xl
        shadow-sm
        hover:shadow-md hover:border-gray-300
        transition-all duration-200
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        relative
        min-h-[100px] sm:min-h-[120px]
      `}
    >
      {/* Connected indicator */}
      {isConnected && (
        <div className="absolute top-2 right-2">
          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        </div>
      )}
      
      {/* Icon */}
      <div className="mb-2 sm:mb-3">
        {isCurrentlyConnecting ? (
          <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        ) : (
          <PlatformIcon platform={platform} />
        )}
      </div>
      
      {/* Label */}
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 text-center">
        {platformConfig?.label || platform}
      </span>
      
      {/* Connected count */}
      {isConnected && accountsForPlatform.length > 1 && (
        <span className="text-xs text-emerald-600 mt-1">
          {accountsForPlatform.length} accounts
        </span>
      )}
    </button>
  );
};

// Grid of all platforms
interface PlatformGridProps {
  connectedAccounts: LateAccount[];
  onConnect: (platform: LatePlatform) => void;
  isConnecting?: boolean;
  connectingPlatform?: LatePlatform;
}

export const PlatformGrid: React.FC<PlatformGridProps> = ({
  connectedAccounts,
  onConnect,
  isConnecting,
  connectingPlatform,
}) => {
  const platforms: LatePlatform[] = [
    'facebook',
    'instagram',
    'tiktok',
    'twitter',
    'threads',
    'linkedin',
    'pinterest',
    'youtube',
    'reddit',
    'bluesky',
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {platforms.map(platform => (
        <PlatformConnectButton
          key={platform}
          platform={platform}
          connectedAccounts={connectedAccounts}
          onConnect={onConnect}
          isConnecting={isConnecting}
          connectingPlatform={connectingPlatform}
        />
      ))}
    </div>
  );
};
