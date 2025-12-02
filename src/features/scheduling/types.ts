import type { ContentIdea } from '@/features/content-generator';

export interface ScheduledPost extends ContentIdea {
  id: string;
  date: Date;
  status: 'scheduled' | 'published' | 'draft';
  campaignId?: string;
}

export interface SchedulerContextValue {
  scheduledPosts: ScheduledPost[];
  schedulePost: (idea: ContentIdea) => ScheduledPost;
  updatePostDate: (postId: string, newDate: Date) => void;
  removePost: (postId: string) => void;
}
