'use client';

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Clock, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Music, 
} from 'lucide-react';
import { useSocialAccounts } from '../context/SocialAccountsContext';
import { getUserTimezone, formatScheduleDate } from '../services/late-service';
import type { LateAccount, LatePlatform, CreatePostRequest, PostPlatform } from '../types';
import { LATE_PLATFORMS } from '../types';

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  title?: string;
  onSuccess?: () => void;
}

const getPlatformIcon = (platform: LatePlatform) => {
  const iconProps = { className: 'h-4 w-4' };
  
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
    default:
      return null;
  }
};

export const PublishDialog: React.FC<PublishDialogProps> = ({
  open,
  onOpenChange,
  content,
  title,
  onSuccess,
}) => {
  const { accounts, publishPost, error } = useSocialAccounts();
  
  const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string>>(new Set());
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<'success' | 'error' | null>(null);
  const [scheduleMode, setScheduleMode] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  // Group accounts by platform
  const accountsByPlatform = useMemo(() => {
    const grouped: Record<LatePlatform, LateAccount[]> = {} as Record<LatePlatform, LateAccount[]>;
    accounts.forEach(account => {
      if (!grouped[account.platform]) {
        grouped[account.platform] = [];
      }
      grouped[account.platform].push(account);
    });
    return grouped;
  }, [accounts]);

  const toggleAccount = (accountId: string) => {
    const newSelected = new Set(selectedAccountIds);
    if (newSelected.has(accountId)) {
      newSelected.delete(accountId);
    } else {
      newSelected.add(accountId);
    }
    setSelectedAccountIds(newSelected);
  };

  const handlePublish = async () => {
    if (selectedAccountIds.size === 0) return;

    setIsPublishing(true);
    setPublishResult(null);

    // Build platforms array
    const platforms: PostPlatform[] = Array.from(selectedAccountIds).map(accountId => {
      const account = accounts.find(a => a._id === accountId);
      return {
        platform: account!.platform,
        accountId,
      };
    });

    // Build request
    const request: CreatePostRequest = {
      content,
      platforms,
      timezone: getUserTimezone(),
    };

    // Add schedule or publish now
    if (scheduleMode === 'scheduled' && scheduledDate && scheduledTime) {
      const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      request.scheduledFor = formatScheduleDate(dateTime);
    } else {
      // For immediate posting, Late API accepts publishNow: true
      request.publishNow = true;
    }

    const result = await publishPost(request);
    
    if (result) {
      setPublishResult('success');
      setTimeout(() => {
        onOpenChange(false);
        onSuccess?.();
        // Reset state
        setSelectedAccountIds(new Set());
        setPublishResult(null);
        setScheduleMode('now');
      }, 1500);
    } else {
      setPublishResult('error');
    }
    
    setIsPublishing(false);
  };

  const handleClose = () => {
    if (!isPublishing) {
      onOpenChange(false);
      setPublishResult(null);
    }
  };

  // Get minimum date (today)
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Publish Content</DialogTitle>
          <DialogDescription>
            Select accounts to publish your content to
          </DialogDescription>
        </DialogHeader>

        {/* Content preview */}
        <div className="bg-slate-50 rounded-lg p-4 max-h-32 overflow-y-auto">
          {title && (
            <p className="font-medium text-slate-900 mb-1 text-sm">{title}</p>
          )}
          <p className="text-sm text-slate-600 whitespace-pre-wrap line-clamp-4">
            {content}
          </p>
        </div>

        {/* Account selection */}
        {accounts.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Select accounts:</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(accountsByPlatform).map(([platform, platformAccounts]) => (
                <div key={platform} className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    {getPlatformIcon(platform as LatePlatform)}
                    {LATE_PLATFORMS[platform as LatePlatform]?.label || platform}
                  </p>
                  {platformAccounts.map(account => (
                    <label
                      key={account._id}
                      className={`
                        flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors
                        ${selectedAccountIds.has(account._id) 
                          ? 'bg-indigo-50 border border-indigo-200' 
                          : 'bg-white border border-slate-200 hover:bg-slate-50'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAccountIds.has(account._id)}
                        onChange={() => toggleAccount(account._id)}
                        className="h-4 w-4 text-indigo-600 rounded border-slate-300"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {account.displayName || account.username}
                        </p>
                        <p className="text-xs text-slate-500">@{account.username}</p>
                      </div>
                      {account.isActive && (
                        <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-300">
                          Active
                        </Badge>
                      )}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-50 rounded-lg">
            <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600">No accounts connected</p>
            <p className="text-xs text-slate-500 mt-1">
              Connect your social accounts first to publish
            </p>
          </div>
        )}

        {/* Schedule options */}
        {accounts.length > 0 && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={scheduleMode === 'now' ? 'default' : 'outline'}
                onClick={() => setScheduleMode('now')}
                className="flex-1"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Publish Now
              </Button>
              <Button
                type="button"
                size="sm"
                variant={scheduleMode === 'scheduled' ? 'default' : 'outline'}
                onClick={() => setScheduleMode('scheduled')}
                className="flex-1"
              >
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                Schedule
              </Button>
            </div>

            {scheduleMode === 'scheduled' && (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  min={minDate}
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  className="w-28 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>
        )}

        {/* Error/Success messages */}
        {error && publishResult === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {publishResult === 'success' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <p className="text-sm text-emerald-600">
              {scheduleMode === 'scheduled' ? 'Post scheduled successfully!' : 'Published successfully!'}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPublishing}>
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={
              isPublishing || 
              selectedAccountIds.size === 0 || 
              (scheduleMode === 'scheduled' && (!scheduledDate || !scheduledTime))
            }
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {scheduleMode === 'scheduled' ? 'Scheduling...' : 'Publishing...'}
              </>
            ) : (
              <>
                {scheduleMode === 'scheduled' ? (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule for {selectedAccountIds.size} account{selectedAccountIds.size !== 1 ? 's' : ''}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Publish to {selectedAccountIds.size} account{selectedAccountIds.size !== 1 ? 's' : ''}
                  </>
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
