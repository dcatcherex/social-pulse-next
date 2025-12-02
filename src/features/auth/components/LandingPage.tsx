'use client';

import React from 'react';
import Link from 'next/link';
import { Radio, Sparkles, TrendingUp, Calendar, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const features = [
  {
    icon: Radio,
    title: 'Social Listening',
    description: 'Monitor mentions and conversations about your brand in real-time',
  },
  {
    icon: Sparkles,
    title: 'AI Content Studio',
    description: 'Generate engaging posts with AI-powered caption writing',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Plan and schedule content at optimal times for maximum reach',
  },
  {
    icon: TrendingUp,
    title: 'Competitor Analysis',
    description: 'Track competitor strategies and stay ahead of the market',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive insights to measure your social media success',
  },
];

const benefits = [
  'Multi-brand management',
  'Real-time sentiment analysis',
  'AI-powered content suggestions',
  'Cross-platform scheduling',
  'Competitor benchmarking',
];

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">SocialPulse</span>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-indigo-200 hover:text-white font-medium transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="text-indigo-200 hover:text-white font-medium transition-colors"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/landing" />
            </SignedIn>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-800/50 text-indigo-200 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Social Media Management</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your Brand&apos;s Pulse on
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {' '}Social Media
            </span>
          </h1>
          
          <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
            Monitor, create, and schedule content across all platforms. 
            Get AI-powered insights to grow your brand&apos;s online presence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="w-full sm:w-auto bg-white hover:bg-gray-100 text-indigo-900 px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center space-x-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="w-full sm:w-auto border-2 border-indigo-400 hover:border-white text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto bg-white hover:bg-gray-100 text-indigo-900 px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </SignedIn>
          </div>

          {/* Benefits List */}
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center space-x-2 text-indigo-200">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Everything you need to manage your social presence
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-indigo-200 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-white/10">
        <div className="text-center text-indigo-300 text-sm">
          © 2024 SocialPulse. Built with AI for modern marketers.
        </div>
      </footer>
    </div>
  );
};
