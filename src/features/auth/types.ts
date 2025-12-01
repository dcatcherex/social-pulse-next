export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  onboardingCompleted: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface OnboardingData {
  brandName: string;
  industry: string;
  challenges: string[];
  keywords: string[];
}
