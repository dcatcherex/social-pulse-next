// Brand Voice Options
export const BRAND_TONES = [
  { id: 'professional', label: 'Professional', description: 'Authoritative and polished', icon: '👔' },
  { id: 'casual', label: 'Casual', description: 'Relaxed and approachable', icon: '😊' },
  { id: 'friendly', label: 'Friendly', description: 'Warm and welcoming', icon: '🤗' },
  { id: 'witty', label: 'Witty', description: 'Clever and humorous', icon: '😄' },
  { id: 'inspiring', label: 'Inspiring', description: 'Motivational and uplifting', icon: '✨' },
  { id: 'bold', label: 'Bold', description: 'Confident and daring', icon: '🔥' },
  { id: 'educational', label: 'Educational', description: 'Informative and helpful', icon: '📚' },
  { id: 'luxury', label: 'Luxury', description: 'Elegant and sophisticated', icon: '💎' },
] as const;

export type BrandTone = typeof BRAND_TONES[number]['id'];

// Personality Traits
export const PERSONALITY_TRAITS = [
  'Authentic', 'Innovative', 'Trustworthy', 'Energetic', 'Empathetic',
  'Bold', 'Creative', 'Reliable', 'Fun', 'Sophisticated', 'Down-to-earth',
  'Expert', 'Adventurous', 'Caring', 'Quirky', 'Minimalist'
] as const;

// Age Ranges
export const AGE_RANGES = [
  { id: '18-24', label: 'Gen Z (18-24)' },
  { id: '25-34', label: 'Millennials (25-34)' },
  { id: '35-44', label: 'Gen X (35-44)' },
  { id: '45-54', label: 'Boomers (45-54)' },
  { id: '55+', label: 'Seniors (55+)' },
  { id: 'all', label: 'All ages' },
] as const;

export interface BrandVoice {
  tone: BrandTone;
  personality: string[];      // Selected personality traits
  samplePhrases?: string[];   // Example phrases that sound like the brand
  avoidWords?: string[];      // Words/phrases to never use
}

export interface TargetAudience {
  ageRange: string;
  demographics?: string;      // "Urban professionals", "Parents", etc.
  interests?: string[];       // Their interests/hobbies
  painPoints?: string[];      // Problems they face
  desires?: string[];         // What they want to achieve
}

export interface BrandColors {
  primary: string;            // Hex color
  secondary?: string;
  accent?: string;
}

export interface BrandProfile {
  id: string;
  name: string;
  industry: string;
  
  // Brand Identity
  tagline?: string;
  brandVoice: BrandVoice;
  targetAudience: TargetAudience;
  brandColors?: BrandColors;
  values?: string[];
  uniqueSellingPoint?: string;
  
  // Monitoring
  keywords: string[];
  competitors: string[];
  timezone: string;
}

export interface BrandContextValue {
  brandProfiles: BrandProfile[];
  activeProfile: BrandProfile;
  activeProfileId: string;
  setActiveProfileId: (id: string) => void;
  updateProfile: (profile: BrandProfile) => void;
  addProfile: (profile: BrandProfile) => void;
  createNewProfile: () => void;
}
