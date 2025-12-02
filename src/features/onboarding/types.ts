export interface OnboardingData {
  brandName: string;
  industry: string;
  challenges: string[];
  keywords: string[];
  // Optional fields (skippable steps)
  platforms?: string[];
  competitors?: string[];
  goals?: string[];
  audienceTimes?: string[];
  completedAt?: string;
}

// Social platforms for "Connect Socials" step
export const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'facebook', label: 'Facebook', icon: '📘' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'twitter', label: 'X (Twitter)', icon: '𝕏' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
] as const;

// Goals for "Set Goals" step
export const GOALS = [
  { id: 'awareness', label: 'Increase brand awareness', icon: '📢' },
  { id: 'engagement', label: 'Boost engagement & followers', icon: '❤️' },
  { id: 'sales', label: 'Drive sales & conversions', icon: '💰' },
  { id: 'traffic', label: 'Get more website traffic', icon: '🔗' },
  { id: 'community', label: 'Build a loyal community', icon: '👥' },
  { id: 'authority', label: 'Establish thought leadership', icon: '🎓' },
] as const;

// Audience active times for "Best Time" step
export const AUDIENCE_TIMES = [
  { id: 'morning', label: 'Morning (6AM - 12PM)', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon (12PM - 5PM)', icon: '☀️' },
  { id: 'evening', label: 'Evening (5PM - 9PM)', icon: '🌆' },
  { id: 'night', label: 'Night (9PM - 12AM)', icon: '🌙' },
  { id: 'weekdays', label: 'Mostly weekdays', icon: '📅' },
  { id: 'weekends', label: 'Mostly weekends', icon: '🎉' },
] as const;

export interface OnboardingContextType {
  data: OnboardingData | null;
  isOnboarded: boolean;
  updateData: (updates: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
}

export const INDUSTRIES = [
  'E-commerce / Retail',
  'Food & Beverage',
  'Health & Wellness',
  'Technology',
  'Fashion & Beauty',
  'Travel & Hospitality',
  'Education',
  'Finance',
  'Entertainment',
  'Other',
] as const;

export const CHALLENGES = [
  { id: 'content', label: 'Creating engaging content consistently' },
  { id: 'growth', label: 'Growing followers and engagement' },
  { id: 'time', label: 'Not enough time for social media' },
  { id: 'analytics', label: 'Understanding what works' },
  { id: 'competitors', label: 'Keeping up with competitors' },
  { id: 'trends', label: 'Staying on top of trends' },
  { id: 'roi', label: 'Proving ROI from social media' },
  { id: 'crisis', label: 'Managing brand reputation' },
] as const;

// Industry-specific content prompt templates
export const INDUSTRY_PROMPTS: Record<string, { templates: string[]; hashtags: string[] }> = {
  'E-commerce / Retail': {
    templates: [
      'New arrival announcement for our latest product',
      'Flash sale promotion ending today',
      'Customer unboxing experience highlight',
      'Behind the scenes of our warehouse',
      'Product styling tips and ideas',
    ],
    hashtags: ['#ShopNow', '#NewArrivals', '#Sale', '#Retail', '#Shopping'],
  },
  'Food & Beverage': {
    templates: [
      "Today's special menu highlight",
      'Behind the scenes in our kitchen',
      'Customer review and testimonial',
      'Recipe tip or cooking hack',
      'Seasonal ingredient spotlight',
    ],
    hashtags: ['#Foodie', '#FoodLovers', '#Delicious', '#FreshFood', '#Yummy'],
  },
  'Health & Wellness': {
    templates: [
      'Wellness tip of the day',
      'Client transformation story',
      'Quick workout routine demo',
      'Healthy recipe or meal prep idea',
      'Mindfulness and self-care reminder',
    ],
    hashtags: ['#Wellness', '#HealthyLiving', '#Fitness', '#SelfCare', '#Health'],
  },
  'Technology': {
    templates: [
      'Product feature spotlight and tutorial',
      'Tech tip to boost productivity',
      'Industry trend analysis and insights',
      'Team culture and behind the scenes',
      'Customer success story showcase',
    ],
    hashtags: ['#Tech', '#Innovation', '#Startup', '#Digital', '#Technology'],
  },
  'Fashion & Beauty': {
    templates: [
      'Outfit of the day styling inspiration',
      'Beauty tip or makeup tutorial',
      'New collection sneak peek',
      'Trend report and what to wear',
      'Customer style feature',
    ],
    hashtags: ['#Fashion', '#Style', '#Beauty', '#OOTD', '#Trending'],
  },
  'Travel & Hospitality': {
    templates: [
      'Hidden gem destination reveal',
      'Guest experience spotlight',
      'Travel tip for first-time visitors',
      'Local culture and food exploration',
      'Stunning property or view showcase',
    ],
    hashtags: ['#Travel', '#Wanderlust', '#Vacation', '#Tourism', '#Explore'],
  },
  'Education': {
    templates: [
      'Quick learning tip or study hack',
      'Student success story highlight',
      'Course or program announcement',
      'Expert insight on industry topic',
      'Fun fact or did you know',
    ],
    hashtags: ['#Education', '#Learning', '#Students', '#Knowledge', '#Study'],
  },
  'Finance': {
    templates: [
      'Money-saving tip for everyday life',
      'Market update simplified',
      'Financial planning advice',
      'Client testimonial and results',
      'Common money mistake to avoid',
    ],
    hashtags: ['#Finance', '#MoneyTips', '#Investing', '#FinancialFreedom', '#Savings'],
  },
  'Entertainment': {
    templates: [
      'Behind the scenes exclusive look',
      'Upcoming event announcement',
      'Fan spotlight and appreciation',
      'Throwback to memorable moment',
      'Sneak peek of new content',
    ],
    hashtags: ['#Entertainment', '#Fun', '#Events', '#ShowBiz', '#Trending'],
  },
  'Other': {
    templates: [
      'Share your latest news or update',
      'Thank your customers and community',
      'Behind the scenes of your business',
      'Team member spotlight',
      'Answer a frequently asked question',
    ],
    hashtags: ['#Business', '#SmallBusiness', '#Community', '#Support', '#Local'],
  },
};
