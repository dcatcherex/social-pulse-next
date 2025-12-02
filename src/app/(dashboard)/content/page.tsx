'use client';

import { useState } from 'react';
import { 
  ContentStudioHeader,
  TabSwitcher,
  ErrorAlert,
  TextGeneratorTab,
  ImageStudioTab,
  TemplatesTab,
  useContentGeneration,
} from '@/features/content-generator';
import type { ContentTab } from '@/features/content-generator';
import { useBrand } from '@/features/brand-management';

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<ContentTab>('templates');
  const { activeProfile } = useBrand();
  const { error: contentError, reset: resetContentError } = useContentGeneration();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <ContentStudioHeader activeProfile={activeProfile} />

      {/* Mode Switcher */}
      <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Error Alert */}
      {contentError && (
        <ErrorAlert
          message={contentError.message || 'An unexpected error occurred. Please try again.'}
          onDismiss={resetContentError}
        />
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && <TemplatesTab />}

      {/* Text Generator Tab */}
      {activeTab === 'text' && <TextGeneratorTab />}

      {/* Image Studio Tab */}
      {activeTab === 'image' && <ImageStudioTab />}
    </div>
  );
}
