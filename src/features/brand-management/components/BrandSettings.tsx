'use client';

import React, { useState, useEffect } from 'react';
import { Save, Building2, Tag, Globe, Palette, MessageSquare, Target, Sparkles, Heart, Plus, X } from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { BrandProfile, BRAND_TONES, PERSONALITY_TRAITS, AGE_RANGES } from '../types';

export const BrandSettings: React.FC = () => {
  const { activeProfile, updateProfile } = useBrand();
  const [formData, setFormData] = useState<BrandProfile>(activeProfile);
  const [isSaved, setIsSaved] = useState(false);
  const [valueInput, setValueInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [painPointInput, setPainPointInput] = useState('');

  useEffect(() => {
    setFormData(activeProfile);
    setIsSaved(false);
  }, [activeProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'keywords' | 'competitors') => {
    const values = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const handleBrandVoiceChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      brandVoice: { ...prev.brandVoice, [field]: value }
    }));
  };

  const handleTargetAudienceChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: { ...prev.targetAudience, [field]: value }
    }));
  };

  const togglePersonality = (trait: string) => {
    const current = formData.brandVoice.personality || [];
    const updated = current.includes(trait)
      ? current.filter(t => t !== trait)
      : current.length < 5 ? [...current, trait] : current;
    handleBrandVoiceChange('personality', updated);
  };

  const addValue = () => {
    if (valueInput.trim() && !(formData.values || []).includes(valueInput.trim())) {
      setFormData(prev => ({ ...prev, values: [...(prev.values || []), valueInput.trim()] }));
      setValueInput('');
    }
  };

  const removeValue = (value: string) => {
    setFormData(prev => ({ ...prev, values: (prev.values || []).filter(v => v !== value) }));
  };

  const addInterest = () => {
    if (interestInput.trim()) {
      const current = formData.targetAudience.interests || [];
      if (!current.includes(interestInput.trim())) {
        handleTargetAudienceChange('interests', [...current, interestInput.trim()]);
      }
      setInterestInput('');
    }
  };

  const removeInterest = (interest: string) => {
    handleTargetAudienceChange('interests', (formData.targetAudience.interests || []).filter(i => i !== interest));
  };

  const addPainPoint = () => {
    if (painPointInput.trim()) {
      const current = formData.targetAudience.painPoints || [];
      if (!current.includes(painPointInput.trim())) {
        handleTargetAudienceChange('painPoints', [...current, painPointInput.trim()]);
      }
      setPainPointInput('');
    }
  };

  const removePainPoint = (painPoint: string) => {
    handleTargetAudienceChange('painPoints', (formData.targetAudience.painPoints || []).filter(p => p !== painPoint));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const commonTimezones = [
    { value: 'UTC', label: 'UTC (Universal Time)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Bangkok', label: 'Bangkok (ICT)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
    { value: 'America/New_York', label: 'New York (EST)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
  ];

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Brand Profile</h1>
        <p className="text-slate-500">
          Currently editing: <span className="font-bold text-indigo-600">{activeProfile.name}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Business Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building2 className="w-5 h-5 text-indigo-500" />
            Business Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. Joe's Pizza"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. Restaurant"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Tagline / Slogan</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. Fresh pizza, fast delivery"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Unique Selling Point (USP)</label>
              <p className="text-xs text-slate-500 mb-2">What makes you different from competitors?</p>
              <textarea
                name="uniqueSellingPoint"
                value={formData.uniqueSellingPoint || ''}
                onChange={handleChange}
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                placeholder="e.g. Only pizzeria using 100% organic, locally-sourced ingredients"
              />
            </div>
          </div>
        </div>

        {/* Brand Voice */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <MessageSquare className="w-5 h-5 text-purple-500" />
            Brand Voice
            <span className="text-xs font-normal text-slate-400 ml-2">How your brand speaks</span>
          </h2>
          
          {/* Tone Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tone of Voice</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {BRAND_TONES.map((tone) => (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => handleBrandVoiceChange('tone', tone.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    formData.brandVoice.tone === tone.id
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <span className="text-lg">{tone.icon}</span>
                  <div className="font-medium text-sm mt-1">{tone.label}</div>
                  <div className="text-xs text-slate-500">{tone.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Personality Traits */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Personality Traits <span className="text-slate-400 font-normal">(pick up to 5)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PERSONALITY_TRAITS.map((trait) => (
                <button
                  key={trait}
                  type="button"
                  onClick={() => togglePersonality(trait)}
                  disabled={(formData.brandVoice.personality?.length || 0) >= 5 && !formData.brandVoice.personality?.includes(trait)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    formData.brandVoice.personality?.includes(trait)
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40'
                  }`}
                >
                  {trait}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Target className="w-5 h-5 text-emerald-500" />
            Target Audience
            <span className="text-xs font-normal text-slate-400 ml-2">Who you&apos;re speaking to</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age Range</label>
              <select
                value={formData.targetAudience.ageRange}
                onChange={(e) => handleTargetAudienceChange('ageRange', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              >
                {AGE_RANGES.map((range) => (
                  <option key={range.id} value={range.id}>{range.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Demographics</label>
              <input
                type="text"
                value={formData.targetAudience.demographics || ''}
                onChange={(e) => handleTargetAudienceChange('demographics', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="e.g. Urban professionals, Parents"
              />
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Their Interests</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Add an interest..."
              />
              <button type="button" onClick={addInterest} className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.targetAudience.interests || []).map((interest) => (
                <span key={interest} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
                  {interest}
                  <button type="button" onClick={() => removeInterest(interest)} className="hover:text-emerald-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Pain Points */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Their Pain Points</label>
            <p className="text-xs text-slate-500 mb-2">What problems do they face that you solve?</p>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={painPointInput}
                onChange={(e) => setPainPointInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPainPoint())}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Add a pain point..."
              />
              <button type="button" onClick={addPainPoint} className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.targetAudience.painPoints || []).map((painPoint) => (
                <span key={painPoint} className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                  {painPoint}
                  <button type="button" onClick={() => removePainPoint(painPoint)} className="hover:text-red-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Colors & Values */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Palette className="w-5 h-5 text-pink-500" />
            Visual Identity & Values
          </h2>
          
          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Brand Colors</label>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.brandColors?.primary || '#4F46E5'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    brandColors: { ...prev.brandColors, primary: e.target.value }
                  }))}
                  className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200"
                />
                <span className="text-sm text-slate-600">Primary</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.brandColors?.secondary || '#10B981'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    brandColors: { ...prev.brandColors, primary: prev.brandColors?.primary || '#4F46E5', secondary: e.target.value }
                  }))}
                  className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200"
                />
                <span className="text-sm text-slate-600">Secondary</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.brandColors?.accent || '#F59E0B'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    brandColors: { ...prev.brandColors, primary: prev.brandColors?.primary || '#4F46E5', accent: e.target.value }
                  }))}
                  className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200"
                />
                <span className="text-sm text-slate-600">Accent</span>
              </div>
            </div>
          </div>

          {/* Values */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" /> Brand Values
            </label>
            <p className="text-xs text-slate-500 mb-2">What does your brand stand for?</p>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addValue())}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                placeholder="e.g. Quality, Sustainability, Innovation"
              />
              <button type="button" onClick={addValue} className="px-3 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.values || []).map((value) => (
                <span key={value} className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm">
                  {value}
                  <button type="button" onClick={() => removeValue(value)} className="hover:text-pink-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Monitoring & Competitors */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Tag className="w-5 h-5 text-indigo-500" />
            Monitoring & Competition
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Keywords to Track</label>
              <p className="text-xs text-slate-500 mb-2">Comma-separated</p>
              <input
                type="text"
                value={formData.keywords.join(', ')}
                onChange={(e) => handleArrayChange(e, 'keywords')}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. pizza, delivery, lunch"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Competitors</label>
              <p className="text-xs text-slate-500 mb-2">Comma-separated</p>
              <input
                type="text"
                value={formData.competitors.join(', ')}
                onChange={(e) => handleArrayChange(e, 'competitors')}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. Domino's, Pizza Hut"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" /> Audience Time Zone
              </label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                {commonTimezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            <Sparkles className="w-4 h-4 inline mr-1 text-amber-500" />
            Brand identity will be used in AI content generation
          </div>
          <button
            type="submit"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white transition-all ${
              isSaved ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSaved ? 'Saved Successfully!' : 'Save Changes'}
            {!isSaved && <Save className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
};
