// Common types used across features

export enum Platform {
  INSTAGRAM = 'Instagram',
  TWITTER = 'X (Twitter)',
  TIKTOK = 'TikTok',
  LINKEDIN = 'LinkedIn',
  FACEBOOK = 'Facebook'
}

export enum SentimentType {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
}

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}
