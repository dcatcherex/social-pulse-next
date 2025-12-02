import { Star, MessageCircleQuestion, Heart, Quote } from 'lucide-react';
import type { ContentTemplate } from '../types';

/**
 * Customer Engagement Templates (4)
 * - Customer Testimonial, Ask a Question, Thank You Post, Inspirational Quote
 */
export const ENGAGEMENT_TEMPLATES: ContentTemplate[] = [
  {
    id: 'customer-testimonial',
    name: 'Customer Testimonial',
    description: 'Share customer feedback and reviews',
    category: 'engagement',
    icon: Star,
    variables: [
      {
        id: 'customerName',
        label: 'Customer Name',
        placeholder: 'e.g., Sarah M., @happycustomer',
        required: true,
        type: 'text',
      },
      {
        id: 'testimonial',
        label: 'Their Words',
        placeholder: 'e.g., This product changed my morning routine completely!',
        required: true,
        type: 'textarea',
        helperText: 'Quote or paraphrase their feedback',
      },
      {
        id: 'productOrService',
        label: 'Product/Service Mentioned',
        placeholder: 'e.g., our morning skincare set',
        required: false,
        type: 'text',
      },
    ],
    textPromptTemplate: `Create a heartfelt post sharing this customer testimonial.
Customer: {{customerName}}
Their words: "{{testimonial}}"
{{#productOrService}}About: {{productOrService}}{{/productOrService}}
Show gratitude and let the review speak for itself. Invite others to share their experience.`,
    imagePromptTemplate: `Testimonial quote graphic design, elegant typography with "{{testimonial}}" quote, 
5-star rating visual, warm inviting colors, professional social media graphic style, 
minimalist clean background, trustworthy aesthetic`,
    suggestedPlatforms: ['instagram', 'facebook', 'linkedin'],
    suggestedTone: 'Friendly',
    suggestedImageStyle: {
      style: 'graphic',
      aspectRatio: '1:1',
    },
  },
  {
    id: 'ask-question',
    name: 'Ask a Question',
    description: 'Poll or question to drive engagement',
    category: 'engagement',
    icon: MessageCircleQuestion,
    variables: [
      {
        id: 'question',
        label: 'Your Question',
        placeholder: 'e.g., What\'s your go-to morning drink?',
        required: true,
        type: 'text',
      },
      {
        id: 'options',
        label: 'Answer Options (Optional)',
        placeholder: 'e.g., Coffee ☕ / Tea 🍵 / Smoothie 🥤',
        required: false,
        type: 'text',
        helperText: 'For polls or multiple choice',
      },
      {
        id: 'context',
        label: 'Why You\'re Asking',
        placeholder: 'e.g., We\'re planning our new menu!',
        required: false,
        type: 'text',
      },
    ],
    textPromptTemplate: `Create an engaging question post to spark conversation.
Question: {{question}}
{{#options}}Options: {{options}}{{/options}}
{{#context}}Context: {{context}}{{/context}}
Make it fun and inviting. Encourage people to share their thoughts in comments.`,
    imagePromptTemplate: `Social media question graphic with "{{question}}" text, 
playful design with question mark elements, engaging colors, 
modern typography, interactive feel, poll-style visual`,
    suggestedPlatforms: ['instagram', 'facebook', 'twitter'],
    suggestedTone: 'Casual',
    suggestedImageStyle: {
      style: 'graphic',
      aspectRatio: '1:1',
    },
  },
  {
    id: 'thank-you',
    name: 'Thank You Post',
    description: 'Show appreciation to customers or community',
    category: 'engagement',
    icon: Heart,
    variables: [
      {
        id: 'occasion',
        label: 'What Are You Thankful For',
        placeholder: 'e.g., Reaching 10K followers, 5 years in business',
        required: true,
        type: 'text',
      },
      {
        id: 'message',
        label: 'Your Message',
        placeholder: 'e.g., None of this would be possible without you',
        required: true,
        type: 'textarea',
      },
      {
        id: 'futurePromise',
        label: 'What\'s Next (Optional)',
        placeholder: 'e.g., Exciting things coming soon!',
        required: false,
        type: 'text',
      },
    ],
    textPromptTemplate: `Create a heartfelt thank you post.
Occasion: {{occasion}}
Message: {{message}}
{{#futurePromise}}Looking ahead: {{futurePromise}}{{/futurePromise}}
Be genuine and warm. Make your community feel valued and appreciated.`,
    imagePromptTemplate: `Warm thank you graphic design, "Thank You" elegant typography, 
heart or gratitude symbols, soft warm colors, 
celebratory yet sincere aesthetic, professional social media style`,
    suggestedPlatforms: ['instagram', 'facebook', 'linkedin'],
    suggestedTone: 'Friendly',
    suggestedImageStyle: {
      style: 'graphic',
      aspectRatio: '1:1',
    },
  },
  {
    id: 'quote-post',
    name: 'Inspirational Quote',
    description: 'Share a motivating or relevant quote',
    category: 'engagement',
    icon: Quote,
    variables: [
      {
        id: 'quote',
        label: 'The Quote',
        placeholder: 'e.g., Success is not final, failure is not fatal',
        required: true,
        type: 'textarea',
      },
      {
        id: 'author',
        label: 'Author/Source',
        placeholder: 'e.g., Winston Churchill, Unknown',
        required: false,
        type: 'text',
        defaultValue: 'Unknown',
      },
      {
        id: 'yourThoughts',
        label: 'Your Take (Optional)',
        placeholder: 'e.g., This reminds us why we do what we do',
        required: false,
        type: 'textarea',
        helperText: 'Add your personal connection to this quote',
      },
    ],
    textPromptTemplate: `Create an inspiring quote post.
Quote: "{{quote}}"
{{#author}}- {{author}}{{/author}}
{{#yourThoughts}}My thoughts: {{yourThoughts}}{{/yourThoughts}}
Connect the quote to your brand or audience. Invite reflection.`,
    imagePromptTemplate: `Elegant quote graphic with "{{quote}}" text, 
beautiful typography design, inspirational aesthetic, 
subtle background texture or gradient, professional and shareable, 
minimalist composition`,
    suggestedPlatforms: ['instagram', 'linkedin', 'facebook'],
    suggestedTone: 'Inspiring',
    suggestedImageStyle: {
      style: 'graphic',
      aspectRatio: '1:1',
    },
  },
];
