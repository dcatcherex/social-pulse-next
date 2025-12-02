import { Lightbulb, BookOpen } from 'lucide-react';
import type { ContentTemplate } from '../types';

/**
 * Educational / Tips Templates (2)
 * - Quick Tip, How-To Guide
 */
export const EDUCATIONAL_TEMPLATES: ContentTemplate[] = [
  {
    id: 'quick-tip',
    name: 'Quick Tip',
    description: 'Share helpful advice related to your industry',
    category: 'educational',
    icon: Lightbulb,
    variables: [
      {
        id: 'tipTitle',
        label: 'Tip Title',
        placeholder: 'e.g., Save 30% on your energy bill',
        required: true,
        type: 'text',
      },
      {
        id: 'tipContent',
        label: 'The Tip',
        placeholder: 'e.g., Unplug devices when not in use. Even in standby mode...',
        required: true,
        type: 'textarea',
      },
      {
        id: 'whyItWorks',
        label: 'Why It Works (Optional)',
        placeholder: 'e.g., Standby power accounts for 10% of home energy use',
        required: false,
        type: 'textarea',
      },
    ],
    textPromptTemplate: `Create a helpful, shareable tip post.
Tip: {{tipTitle}}
Details: {{tipContent}}
{{#whyItWorks}}Why it works: {{whyItWorks}}{{/whyItWorks}}
Make it actionable and easy to remember. Position yourself as a helpful expert.`,
    imagePromptTemplate: `Educational tip graphic with lightbulb icon, 
"{{tipTitle}}" as headline, clean infographic style, 
professional yet approachable design, easy to read, 
save-worthy and shareable aesthetic`,
    suggestedPlatforms: ['instagram', 'linkedin', 'twitter'],
    suggestedTone: 'Educational',
    suggestedImageStyle: {
      style: 'graphic',
      aspectRatio: '1:1',
    },
  },
  {
    id: 'how-to',
    name: 'How-To Guide',
    description: 'Step-by-step tutorial or guide',
    category: 'educational',
    icon: BookOpen,
    variables: [
      {
        id: 'title',
        label: 'How To...',
        placeholder: 'e.g., Style a small living room',
        required: true,
        type: 'text',
      },
      {
        id: 'steps',
        label: 'Steps (one per line)',
        placeholder: 'Step 1: Choose light colors\nStep 2: Use mirrors\nStep 3: Multi-functional furniture',
        required: true,
        type: 'textarea',
        helperText: 'Enter each step on a new line',
      },
      {
        id: 'proTip',
        label: 'Pro Tip (Optional)',
        placeholder: 'e.g., Vertical stripes make ceilings look higher',
        required: false,
        type: 'text',
      },
    ],
    textPromptTemplate: `Create an educational how-to post.
Topic: How to {{title}}
Steps: {{steps}}
{{#proTip}}Pro tip: {{proTip}}{{/proTip}}
Make it clear and actionable. Number the steps clearly. Encourage saving/sharing.`,
    imagePromptTemplate: `How-to tutorial graphic, "How To {{title}}" headline, 
numbered steps visual layout, educational infographic style, 
clean modern design, instructional aesthetic, 
carousel-ready format`,
    suggestedPlatforms: ['instagram', 'linkedin', 'tiktok'],
    suggestedTone: 'Educational',
    suggestedImageStyle: {
      style: 'graphic',
      aspectRatio: '4:5',
    },
  },
];
