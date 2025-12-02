'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useOnboarding } from '@/features/onboarding';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const { isOnboarded } = useOnboarding();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      // Not logged in - go to landing page
      router.replace('/landing');
      return;
    }

    // Logged in - check onboarding status
    if (!isOnboarded) {
      router.replace('/onboarding');
    } else {
      router.replace('/dashboard');
    }
  }, [isSignedIn, isLoaded, isOnboarded, router]);

  // Show loading while determining where to redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
