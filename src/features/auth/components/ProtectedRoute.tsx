'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Redirect to onboarding if not completed
    if (user && !user.onboardingCompleted && pathname !== '/onboarding') {
      router.replace('/onboarding');
    }
  }, [isAuthenticated, isLoading, user, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
