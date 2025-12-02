'use client';

import React, { createContext, useContext, useState, useCallback, useSyncExternalStore } from 'react';
import type { User, AuthState, LoginCredentials, SignupData, OnboardingData } from '../types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = 'socialpulse_auth';

// Helper to get initial auth state from localStorage
const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as User;
    }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  return null;
};

// Subscribe to storage changes
const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

const getSnapshot = () => localStorage.getItem(AUTH_STORAGE_KEY);
const getServerSnapshot = () => null;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use useSyncExternalStore to sync with localStorage and trigger re-renders on storage changes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _storedData = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  const [state, setState] = useState<AuthState>(() => {
    const user = getStoredUser();
    return {
      user,
      isAuthenticated: !!user,
      isLoading: false,
    };
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    // Simulate API call - replace with real auth in production
    await new Promise(resolve => setTimeout(resolve, 800));

    // For MVP, accept any email/password and create a mock user
    const user: User = {
      id: crypto.randomUUID(),
      email: credentials.email,
      name: credentials.email.split('@')[0],
      createdAt: new Date(),
      onboardingCompleted: false, // New users need onboarding
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const user: User = {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      createdAt: new Date(),
      onboardingCompleted: false,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const completeOnboarding = useCallback(async (data: OnboardingData) => {
    if (!state.user) return;

    // Simulate API call to save onboarding data
    await new Promise(resolve => setTimeout(resolve, 500));

    // Store onboarding data separately
    localStorage.setItem('socialpulse_onboarding', JSON.stringify(data));

    const updatedUser: User = {
      ...state.user,
      onboardingCompleted: true,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    setState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
