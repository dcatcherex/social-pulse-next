import type { OnboardingData } from '@/features/onboarding';

export type SettingsSection = 'brand' | 'preferences' | 'account';

export interface SettingsSectionItem {
  id: SettingsSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface PreferencesEditorState {
  isEditing: boolean;
  editData: OnboardingData | null;
  keywordInput: string;
  competitorInput: string;
  saved: boolean;
}

export interface PreferencesEditorActions {
  startEditing: () => void;
  cancelEditing: () => void;
  saveChanges: () => void;
  // Industry
  setIndustry: (industry: string) => void;
  // Challenges
  toggleChallenge: (id: string) => void;
  // Keywords
  setKeywordInput: (value: string) => void;
  addKeyword: () => void;
  removeKeyword: (keyword: string) => void;
  // Platforms
  togglePlatform: (id: string) => void;
  // Competitors
  setCompetitorInput: (value: string) => void;
  addCompetitor: () => void;
  removeCompetitor: (competitor: string) => void;
  // Goals
  toggleGoal: (id: string) => void;
  // Audience Times
  toggleAudienceTime: (id: string) => void;
}

export interface UsePreferencesEditorReturn extends PreferencesEditorState, PreferencesEditorActions {
  data: OnboardingData | null;
}
