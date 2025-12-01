'use client';

import { Sparkles, Save, Check } from 'lucide-react';
import { usePreferencesEditor } from '../hooks/use-preferences-editor';
import {
  IndustrySelector,
  ChallengesSelector,
  KeywordsEditor,
  PlatformsSelector,
  CompetitorsEditor,
  GoalsSelector,
  AudienceTimesSelector,
} from './preferences';

export function PreferencesSection() {
  const {
    data,
    isEditing,
    editData,
    keywordInput,
    competitorInput,
    saved,
    startEditing,
    cancelEditing,
    saveChanges,
    setIndustry,
    toggleChallenge,
    setKeywordInput,
    addKeyword,
    removeKeyword,
    togglePlatform,
    setCompetitorInput,
    addCompetitor,
    removeCompetitor,
    toggleGoal,
    toggleAudienceTime,
  } = usePreferencesEditor();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Your Preferences</h2>
          <p className="text-sm text-slate-500">
            These settings personalize your content suggestions and monitoring.
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={startEditing}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
          >
            Edit Preferences
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={cancelEditing}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveChanges}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Success Message */}
      {saved && (
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
          <Check className="w-4 h-4" />
          Preferences saved successfully!
        </div>
      )}

      {/* Empty State */}
      {!data ? (
        <div className="text-center py-12 text-slate-400">
          <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No preferences set yet.</p>
          <p className="text-sm">Complete onboarding to set up your preferences.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <IndustrySelector
            value={data.industry}
            editValue={editData?.industry}
            isEditing={isEditing}
            onChange={setIndustry}
          />

          <ChallengesSelector
            value={data.challenges}
            editValue={editData?.challenges}
            isEditing={isEditing}
            onToggle={toggleChallenge}
          />

          <KeywordsEditor
            value={data.keywords}
            editValue={editData?.keywords}
            isEditing={isEditing}
            inputValue={keywordInput}
            onInputChange={setKeywordInput}
            onAdd={addKeyword}
            onRemove={removeKeyword}
          />

          <PlatformsSelector
            value={data.platforms}
            editValue={editData?.platforms}
            isEditing={isEditing}
            onToggle={togglePlatform}
          />

          <CompetitorsEditor
            value={data.competitors}
            editValue={editData?.competitors}
            isEditing={isEditing}
            inputValue={competitorInput}
            onInputChange={setCompetitorInput}
            onAdd={addCompetitor}
            onRemove={removeCompetitor}
          />

          <GoalsSelector
            value={data.goals}
            editValue={editData?.goals}
            isEditing={isEditing}
            onToggle={toggleGoal}
          />

          <AudienceTimesSelector
            value={data.audienceTimes}
            editValue={editData?.audienceTimes}
            isEditing={isEditing}
            onToggle={toggleAudienceTime}
          />
        </div>
      )}
    </div>
  );
}
