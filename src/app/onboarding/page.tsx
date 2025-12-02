'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Building2, 
  Tags, 
  Target,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useOnboarding, INDUSTRIES, CHALLENGES } from '@/features/onboarding';

type Step = 'brand' | 'industry' | 'challenges' | 'keywords' | 'complete';

const steps: { id: Step; title: string; icon: React.ReactNode }[] = [
  { id: 'brand', title: 'Brand Name', icon: <Building2 className="w-5 h-5" /> },
  { id: 'industry', title: 'Industry', icon: <Target className="w-5 h-5" /> },
  { id: 'challenges', title: 'Challenges', icon: <Tags className="w-5 h-5" /> },
  { id: 'keywords', title: 'Keywords', icon: <Tags className="w-5 h-5" /> },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  const [currentStep, setCurrentStep] = useState<Step>('brand');
  
  const [brandName, setBrandName] = useState(data?.brandName || '');
  const [industry, setIndustry] = useState(data?.industry || '');
  const [challenges, setChallenges] = useState<string[]>(data?.challenges || []);
  const [keywordsInput, setKeywordsInput] = useState(data?.keywords?.join(', ') || '');

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    if (currentStep === 'brand' && brandName.trim()) {
      updateData({ brandName: brandName.trim() });
      setCurrentStep('industry');
    } else if (currentStep === 'industry' && industry) {
      updateData({ industry });
      setCurrentStep('challenges');
    } else if (currentStep === 'challenges') {
      updateData({ challenges });
      setCurrentStep('keywords');
    } else if (currentStep === 'keywords') {
      const keywords = keywordsInput
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      updateData({ 
        keywords,
        completedAt: new Date().toISOString(),
      });
      setCurrentStep('complete');
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ['brand', 'industry', 'challenges', 'keywords'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const toggleChallenge = (id: string) => {
    setChallenges(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const handleComplete = () => {
    router.push('/dashboard');
  };

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">You&apos;re All Set!</h1>
            <p className="text-slate-500 mb-6">
              Your brand profile is ready. Start discovering trends tailored to{' '}
              <span className="font-medium text-slate-700">{industry}</span>.
            </p>
            <Button onClick={handleComplete} size="lg" className="w-full">
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">Social Pulse</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm
                ${index <= currentStepIndex 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-100 text-slate-400'
                }
              `}>
                {index < currentStepIndex ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-16 md:w-24 h-1 mx-2
                  ${index < currentStepIndex ? 'bg-indigo-600' : 'bg-slate-200'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">
            {currentStep === 'brand' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">What&apos;s your brand name?</h2>
                  <p className="text-slate-500 mt-1">This helps personalize your content suggestions</p>
                </div>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g., Acme Inc, My Startup"
                  className="w-full px-4 py-3 text-lg border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                  autoFocus
                />
              </div>
            )}

            {currentStep === 'industry' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">What industry are you in?</h2>
                  <p className="text-slate-500 mt-1">We&apos;ll find trends relevant to your business</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setIndustry(ind)}
                      className={`
                        p-4 rounded-lg border-2 text-left transition-all
                        ${industry === ind 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                          : 'border-slate-200 hover:border-slate-300'
                        }
                      `}
                    >
                      <span className="font-medium">{ind}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 'challenges' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">What are your biggest challenges?</h2>
                  <p className="text-slate-500 mt-1">Select all that apply (optional)</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {CHALLENGES.map((challenge) => (
                    <button
                      key={challenge.id}
                      onClick={() => toggleChallenge(challenge.id)}
                      className={`
                        p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3
                        ${challenges.includes(challenge.id)
                          ? 'border-indigo-600 bg-indigo-50' 
                          : 'border-slate-200 hover:border-slate-300'
                        }
                      `}
                    >
                      <div className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center
                        ${challenges.includes(challenge.id)
                          ? 'bg-indigo-600 border-indigo-600' 
                          : 'border-slate-300'
                        }
                      `}>
                        {challenges.includes(challenge.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className={challenges.includes(challenge.id) ? 'text-indigo-700' : 'text-slate-700'}>
                        {challenge.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 'keywords' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Tags className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">What keywords describe your brand?</h2>
                  <p className="text-slate-500 mt-1">Separate with commas (e.g., AI, startup, innovation)</p>
                </div>
                <textarea
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="e.g., AI, machine learning, automation, productivity"
                  className="w-full h-32 px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  autoFocus
                />
                <div className="flex flex-wrap gap-2">
                  {keywordsInput.split(',').filter(k => k.trim()).map((keyword, i) => (
                    <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 'brand'}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 'brand' && !brandName.trim()) ||
                  (currentStep === 'industry' && !industry)
                }
              >
                {currentStep === 'keywords' ? 'Complete' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
