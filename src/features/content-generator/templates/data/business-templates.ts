import { Clock, CalendarOff, Briefcase } from 'lucide-react';
import type { ContentTemplate } from '../types';

/**
 * Business Updates Templates (3)
 * - Store Hours Update, Holiday Closure, Job Opening
 */
export const BUSINESS_TEMPLATES: ContentTemplate[] = [
  {
    id: 'store-hours',
    name: 'Store Hours Update',
    description: 'Announce schedule changes or operating hours',
    category: 'business',
    icon: Clock,
    variables: [
      {
        id: 'changeType',
        label: 'Type of Update',
        placeholder: 'Select type',
        required: true,
        type: 'select',
        options: ['Extended Hours', 'Reduced Hours', 'New Schedule', 'Temporary Change'],
      },
      {
        id: 'newHours',
        label: 'New Hours/Schedule',
        placeholder: 'e.g., Mon-Fri: 9AM-8PM, Sat: 10AM-6PM',
        required: true,
        type: 'textarea',
      },
      {
        id: 'effectiveDate',
        label: 'Effective From',
        placeholder: 'e.g., Starting Monday, December 1st',
        required: true,
        type: 'text',
      },
      {
        id: 'reason',
        label: 'Reason (Optional)',
        placeholder: 'e.g., To serve you better during the holidays',
        required: false,
        type: 'text',
      },
    ],
    textPromptTemplate: `Create a clear, informative post about our schedule update.
Change type: {{changeType}}
New hours: {{newHours}}
Effective: {{effectiveDate}}
{{#reason}}Reason: {{reason}}{{/reason}}
Make it easy to read and remember. Include a friendly note.`,
    imagePromptTemplate: `Business hours information graphic, clock icon, 
schedule display showing "{{newHours}}", clean professional design, 
easy to read typography, storefront aesthetic, informational style`,
    suggestedPlatforms: ['instagram', 'facebook'],
    suggestedTone: 'Professional',
    suggestedImageStyle: {
      style: 'graphic',
      aspectRatio: '1:1',
    },
  },
  {
    id: 'holiday-closure',
    name: 'Holiday Closure',
    description: 'Announce that you\'re closed for a holiday',
    category: 'business',
    icon: CalendarOff,
    variables: [
      {
        id: 'holiday',
        label: 'Holiday/Occasion',
        placeholder: 'e.g., Christmas, Thanksgiving, Staff Training',
        required: true,
        type: 'text',
      },
      {
        id: 'closedDates',
        label: 'Closed Dates',
        placeholder: 'e.g., December 24-26, All day Monday',
        required: true,
        type: 'text',
      },
      {
        id: 'reopenDate',
        label: 'When You\'ll Reopen',
        placeholder: 'e.g., Back December 27th at 9AM',
        required: true,
        type: 'text',
      },
      {
        id: 'holidayWish',
        label: 'Holiday Message (Optional)',
        placeholder: 'e.g., Wishing everyone a wonderful holiday!',
        required: false,
        type: 'text',
      },
    ],
    textPromptTemplate: `Create a friendly holiday closure announcement.
Occasion: {{holiday}}
Closed: {{closedDates}}
Reopening: {{reopenDate}}
{{#holidayWish}}Holiday message: {{holidayWish}}{{/holidayWish}}
Be warm and apologetic for any inconvenience while wishing customers well.`,
    imagePromptTemplate: `Holiday closure announcement graphic for {{holiday}}, 
festive but professional design, calendar or clock visual, 
"We'll be closed {{closedDates}}" text, warm holiday colors, 
friendly business announcement style`,
    suggestedPlatforms: ['instagram', 'facebook'],
    suggestedTone: 'Friendly',
    suggestedImageStyle: {
      style: 'graphic',
      aspectRatio: '1:1',
    },
  },
  {
    id: 'job-opening',
    name: 'Job Opening',
    description: 'Announce hiring opportunities',
    category: 'business',
    icon: Briefcase,
    variables: [
      {
        id: 'position',
        label: 'Position Title',
        placeholder: 'e.g., Marketing Manager, Barista, Sales Associate',
        required: true,
        type: 'text',
      },
      {
        id: 'keyRequirements',
        label: 'Key Requirements',
        placeholder: 'e.g., 2+ years experience, passion for coffee',
        required: true,
        type: 'textarea',
      },
      {
        id: 'perks',
        label: 'What You Offer',
        placeholder: 'e.g., Competitive pay, flexible hours, growth opportunities',
        required: true,
        type: 'textarea',
      },
      {
        id: 'howToApply',
        label: 'How to Apply',
        placeholder: 'e.g., DM us, Email careers@company.com',
        required: true,
        type: 'text',
      },
    ],
    textPromptTemplate: `Create an exciting job posting.
Position: {{position}}
Requirements: {{keyRequirements}}
What we offer: {{perks}}
How to apply: {{howToApply}}
Make the opportunity sound exciting. Show company culture. Encourage sharing.`,
    imagePromptTemplate: `Job hiring announcement graphic, "We're Hiring!" bold text, 
{{position}} position highlighted, professional and welcoming design, 
team/workplace aesthetic, modern recruitment style, 
energetic and opportunity-focused`,
    suggestedPlatforms: ['linkedin', 'instagram', 'facebook'],
    suggestedTone: 'Professional',
    suggestedImageStyle: {
      style: 'graphic',
      aspectRatio: '1:1',
    },
  },
];
