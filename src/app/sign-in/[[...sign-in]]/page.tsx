import { SignIn } from '@clerk/nextjs';
import { Radio } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Link href="/landing" className="flex items-center space-x-2 mb-8">
        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
          <Radio className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">SocialPulse</span>
      </Link>

      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-2xl rounded-2xl",
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-gray-500",
            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
            footerActionLink: "text-indigo-600 hover:text-indigo-700",
          },
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
      />

      {/* Demo hint */}
      <p className="text-center text-indigo-200 text-sm mt-6">
        Sign in with email, Google, or GitHub
      </p>
    </div>
  );
}
