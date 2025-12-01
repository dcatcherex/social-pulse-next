'use client';

import { useState } from 'react';
import { BrandSettings } from '@/features/brand-management';
import {
  SettingsHeader,
  SettingsTabs,
  PreferencesSection,
  AccountSection,
  type SettingsSection,
} from '@/features/settings';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('brand');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SettingsHeader />
      <SettingsTabs activeSection={activeSection} onSectionChange={setActiveSection} />

      {activeSection === 'brand' && <BrandSettings />}
      {activeSection === 'preferences' && <PreferencesSection />}
      {activeSection === 'account' && <AccountSection />}
    </div>
  );
}
