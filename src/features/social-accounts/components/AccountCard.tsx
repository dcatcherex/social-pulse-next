'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Music, 
  Pin, 
  MessageCircle, 
  AtSign, 
  Cloud,
  Trash2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import type { LateAccount, LatePlatform } from '../types';
import { LATE_PLATFORMS } from '../types';

interface AccountCardProps {
  account: LateAccount;
  onDisconnect: (accountId: string) => void;
  isDisconnecting?: boolean;
}

const getPlatformIcon = (platform: LatePlatform) => {
  const iconProps = { className: 'h-5 w-5' };
  
  switch (platform) {
    case 'instagram':
      return <Instagram {...iconProps} />;
    case 'facebook':
      return <Facebook {...iconProps} />;
    case 'twitter':
      return <Twitter {...iconProps} />;
    case 'linkedin':
      return <Linkedin {...iconProps} />;
    case 'youtube':
      return <Youtube {...iconProps} />;
    case 'tiktok':
      return <Music {...iconProps} />;
    case 'pinterest':
      return <Pin {...iconProps} />;
    case 'reddit':
      return <MessageCircle {...iconProps} />;
    case 'threads':
      return <AtSign {...iconProps} />;
    case 'bluesky':
      return <Cloud {...iconProps} />;
    default:
      return <ExternalLink {...iconProps} />;
  }
};

const isTokenExpiringSoon = (expiresAt?: string): boolean => {
  if (!expiresAt) return false;
  const expiry = new Date(expiresAt);
  const now = new Date();
  const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
};

const isTokenExpired = (expiresAt?: string): boolean => {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
};

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onDisconnect,
  isDisconnecting = false,
}) => {
  const platformConfig = LATE_PLATFORMS[account.platform];
  const expired = isTokenExpired(account.tokenExpiresAt);
  const expiringSoon = isTokenExpiringSoon(account.tokenExpiresAt);

  return (
    <Card className={`relative overflow-hidden ${expired ? 'border-red-300 bg-red-50' : ''}`}>
      {/* Platform color accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${platformConfig?.bgColor || 'bg-slate-500'}`} />
      
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Profile picture or platform icon */}
            <div className="relative">
              {account.profilePicture ? (
                <img 
                  src={account.profilePicture} 
                  alt={account.displayName}
                  className="h-12 w-12 rounded-full object-cover border-2 border-white shadow"
                />
              ) : (
                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white ${platformConfig?.bgColor || 'bg-slate-500'}`}>
                  {getPlatformIcon(account.platform)}
                </div>
              )}
              {/* Platform badge */}
              <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center text-white text-xs ${platformConfig?.bgColor || 'bg-slate-500'} border-2 border-white`}>
                {getPlatformIcon(account.platform)}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">
                  {account.displayName || account.username}
                </span>
                {!account.isActive && (
                  <Badge variant="secondary" className="text-xs">
                    Inactive
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-500">@{account.username}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {platformConfig?.label || account.platform}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {/* Status badges */}
            {expired && (
              <Badge variant="destructive" className="text-xs">
                Token Expired
              </Badge>
            )}
            {expiringSoon && !expired && (
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                Expires Soon
              </Badge>
            )}
            {account.isActive && !expired && !expiringSoon && (
              <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-300">
                Connected
              </Badge>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
          {expired && (
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1 text-amber-600 border-amber-300 hover:bg-amber-50"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Reconnect
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDisconnect(account._id)}
            disabled={isDisconnecting}
            className="text-slate-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
