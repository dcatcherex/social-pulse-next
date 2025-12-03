import { Users, Trophy } from 'lucide-react';
import type { ContentTemplate } from '../types';

/**
 * Brand Building Templates (2)
 * - Meet the Team, Milestone Celebration
 */
export const BRAND_TEMPLATES: ContentTemplate[] = [
  {
    id: 'meet-the-team',
    name: 'Meet the Team',
    description: 'Introduce a team member to your audience',
    category: 'brand',
    icon: Users,
    variables: [
      {
        id: 'name',
        label: 'Team Member Name',
        placeholder: 'e.g., Sarah, Chef Marco',
        required: true,
        type: 'text',
      },
      {
        id: 'role',
        label: 'Their Role',
        placeholder: 'e.g., Lead Designer, Head Chef',
        required: true,
        type: 'text',
      },
      {
        id: 'funFact',
        label: 'Fun Fact About Them',
        placeholder: 'e.g., Makes the best latte art in town',
        required: true,
        type: 'textarea',
      },
      {
        id: 'theyLove',
        label: 'What They Love About the Job',
        placeholder: 'e.g., Meeting regular customers every morning',
        required: false,
        type: 'textarea',
      },
    ],
    textPromptTemplate: `Create a warm team introduction post.
Name: {{name}}
Role: {{role}}
Fun fact: {{funFact}}
{{#theyLove}}What they love: {{theyLove}}{{/theyLove}}
Make it personal and humanizing. Help customers connect with the face behind the brand.`,
    imagePromptTemplate: `Professional team member portrait, {{role}} at work, 
warm and approachable expression, workplace background, 
natural lighting, authentic behind-the-scenes feel, 
meet the team style photography`,
    suggestedPlatforms: ['instagram', 'linkedin', 'facebook'],
    suggestedTone: 'Friendly',
    suggestedImageStyle: {
      style: 'realistic',
      aspectRatio: '4:5',
      cameraAngle: 'eye-level',
    },
    imageUpload: {
      enabled: true,
      label: 'Upload Team Member Photo',
      hint: 'Upload their photo. AI will create a professional portrait style.',
      required: false,
      type: 'person',
    },
  },
  {
    id: 'milestone',
    name: 'Milestone Celebration',
    description: 'Celebrate a business achievement',
    category: 'brand',
    icon: Trophy,
    variables: [
      {
        id: 'milestone',
        label: 'The Milestone',
        placeholder: 'e.g., 5 years in business, 10,000 customers served',
        required: true,
        type: 'text',
      },
      {
        id: 'reflection',
        label: 'What It Means to You',
        placeholder: 'e.g., From a small dream to serving our community daily',
        required: true,
        type: 'textarea',
      },
      {
        id: 'thanks',
        label: 'Who to Thank',
        placeholder: 'e.g., Our amazing customers and dedicated team',
        required: true,
        type: 'text',
      },
      {
        id: 'celebration',
        label: 'How You\'re Celebrating (Optional)',
        placeholder: 'e.g., Special discount all week, Giveaway',
        required: false,
        type: 'text',
      },
    ],
    textPromptTemplate: `Create a celebratory milestone post.
Milestone: {{milestone}}
Reflection: {{reflection}}
Thanks to: {{thanks}}
{{#celebration}}Celebration: {{celebration}}{{/celebration}}
Be proud but humble. Show gratitude. Invite community to celebrate with you.`,
    imagePromptTemplate: `Celebratory milestone graphic, "{{milestone}}" achievement display, 
trophy or confetti elements, celebratory colors, 
professional celebration aesthetic, thank you sentiment, 
anniversary or achievement style design`,
    suggestedPlatforms: ['instagram', 'facebook', 'linkedin'],
    suggestedTone: 'Inspiring',
    suggestedImageStyle: {
      style: 'graphic',
      aspectRatio: '1:1',
    },
    imageUpload: {
      enabled: true,
      label: 'Upload Celebration Photo',
      hint: 'Optional: Upload team or store photo for personalized celebration.',
      required: false,
      type: 'scene',
    },
  },
];
