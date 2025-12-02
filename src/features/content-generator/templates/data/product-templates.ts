import { Sparkles, Tag, ArrowLeftRight, Gift } from 'lucide-react';
import type { ContentTemplate } from '../types';

/**
 * Product & Sales Templates (5)
 * - New Arrival, Product Feature, Sale/Discount, Before & After, Product Bundle
 */
export const PRODUCT_TEMPLATES: ContentTemplate[] = [
  {
    id: 'new-arrival',
    name: 'New Arrival',
    description: 'Announce a new product or service to your audience',
    category: 'product',
    icon: Sparkles,
    variables: [
      {
        id: 'productName',
        label: 'Product/Service Name',
        placeholder: 'e.g., Summer Breeze Candle Collection',
        required: true,
        type: 'text',
        maxLength: 100,
      },
      {
        id: 'keyFeature',
        label: 'Key Feature or Benefit',
        placeholder: 'e.g., Hand-poured with 100% soy wax',
        required: true,
        type: 'text',
        helperText: 'What makes it special?',
      },
      {
        id: 'price',
        label: 'Price (Optional)',
        placeholder: 'e.g., $29.99 or Starting from $50',
        required: false,
        type: 'text',
      },
      {
        id: 'availability',
        label: 'Availability',
        placeholder: 'e.g., Available now, Coming Friday',
        required: false,
        type: 'text',
        defaultValue: 'Available now',
      },
    ],
    textPromptTemplate: `Create an exciting social media post announcing our new {{productName}}. 
Highlight this key feature: {{keyFeature}}.
{{#price}}Price: {{price}}{{/price}}
{{#availability}}Availability: {{availability}}{{/availability}}
Make it feel fresh and exciting. Include a call-to-action.`,
    imagePromptTemplate: `Product photography of {{productName}}, {{keyFeature}}, 
clean modern background, professional lighting, hero shot composition, 
high-end commercial style, vibrant and inviting`,
    suggestedPlatforms: ['instagram', 'facebook'],
    suggestedTone: 'Professional',
    suggestedImageStyle: {
      style: 'commercial',
      aspectRatio: '1:1',
      cameraAngle: 'eye-level',
    },
    tips: ['Use high-quality product photos', 'Create urgency with limited availability'],
  },
  {
    id: 'product-feature',
    name: 'Product Feature',
    description: 'Highlight specific details or benefits of a product',
    category: 'product',
    icon: Tag,
    variables: [
      {
        id: 'productName',
        label: 'Product Name',
        placeholder: 'e.g., Wireless Earbuds Pro',
        required: true,
        type: 'text',
      },
      {
        id: 'feature',
        label: 'Feature to Highlight',
        placeholder: 'e.g., 40-hour battery life',
        required: true,
        type: 'text',
      },
      {
        id: 'benefit',
        label: 'Why It Matters',
        placeholder: 'e.g., Never worry about charging during your commute',
        required: true,
        type: 'textarea',
        helperText: 'Explain the benefit to the customer',
      },
    ],
    textPromptTemplate: `Create an educational social media post about {{productName}}.
Focus on this feature: {{feature}}.
Explain why it matters: {{benefit}}.
Make it informative yet engaging. Help customers understand the value.`,
    imagePromptTemplate: `Close-up detail shot of {{productName}} showcasing {{feature}}, 
dramatic lighting, macro photography style, professional product photography, 
clean background with subtle gradient`,
    suggestedPlatforms: ['instagram', 'linkedin'],
    suggestedTone: 'Educational',
    suggestedImageStyle: {
      style: 'commercial',
      aspectRatio: '4:5',
      cameraAngle: 'close-up',
    },
  },
  {
    id: 'sale-discount',
    name: 'Sale / Discount',
    description: 'Announce a price reduction or special offer',
    category: 'product',
    icon: Tag,
    variables: [
      {
        id: 'discountAmount',
        label: 'Discount Amount',
        placeholder: 'e.g., 20%, $10 off, Buy 1 Get 1',
        required: true,
        type: 'text',
      },
      {
        id: 'whatIsOnSale',
        label: 'What\'s On Sale',
        placeholder: 'e.g., All summer items, Selected furniture',
        required: true,
        type: 'text',
      },
      {
        id: 'validUntil',
        label: 'Valid Until',
        placeholder: 'e.g., This Sunday, December 31st',
        required: true,
        type: 'text',
        helperText: 'Creates urgency',
      },
      {
        id: 'promoCode',
        label: 'Promo Code (Optional)',
        placeholder: 'e.g., SAVE20',
        required: false,
        type: 'text',
      },
    ],
    textPromptTemplate: `Create an urgent, exciting sale announcement post.
Discount: {{discountAmount}} off {{whatIsOnSale}}.
Valid until: {{validUntil}}.
{{#promoCode}}Use code: {{promoCode}}{{/promoCode}}
Create urgency and excitement. Clear call-to-action to shop now.`,
    imagePromptTemplate: `Bold sale announcement graphic, "{{discountAmount}} OFF" text overlay style, 
vibrant colors, retail promotional design, eye-catching composition, 
modern typography aesthetic, shopping bags or products in background`,
    suggestedPlatforms: ['instagram', 'facebook', 'twitter'],
    suggestedTone: 'Friendly',
    suggestedImageStyle: {
      style: 'graphic',
      aspectRatio: '1:1',
    },
  },
  {
    id: 'before-after',
    name: 'Before & After',
    description: 'Show transformation or results',
    category: 'product',
    icon: ArrowLeftRight,
    variables: [
      {
        id: 'serviceOrProduct',
        label: 'Service or Product',
        placeholder: 'e.g., Our deep cleaning service, Hair treatment',
        required: true,
        type: 'text',
      },
      {
        id: 'beforeState',
        label: 'Before State',
        placeholder: 'e.g., Stained carpet, Damaged hair',
        required: true,
        type: 'text',
      },
      {
        id: 'afterState',
        label: 'After State',
        placeholder: 'e.g., Like-new condition, Silky smooth',
        required: true,
        type: 'text',
      },
      {
        id: 'timeframe',
        label: 'Timeframe',
        placeholder: 'e.g., In just 2 hours, After 3 sessions',
        required: false,
        type: 'text',
      },
    ],
    textPromptTemplate: `Create a compelling before/after transformation post for {{serviceOrProduct}}.
Before: {{beforeState}}
After: {{afterState}}
{{#timeframe}}Achieved {{timeframe}}{{/timeframe}}
Highlight the dramatic change. Encourage viewers to imagine their own transformation.`,
    imagePromptTemplate: `Split-screen before and after comparison, 
left side showing {{beforeState}}, right side showing {{afterState}}, 
professional photography, clear visual contrast, 
clean divider line, realistic transformation result`,
    suggestedPlatforms: ['instagram', 'facebook', 'tiktok'],
    suggestedTone: 'Professional',
    suggestedImageStyle: {
      style: 'realistic',
      aspectRatio: '1:1',
      cameraAngle: 'eye-level',
    },
  },
  {
    id: 'product-bundle',
    name: 'Product Bundle',
    description: 'Promote a package deal or combo offer',
    category: 'product',
    icon: Gift,
    variables: [
      {
        id: 'bundleName',
        label: 'Bundle Name',
        placeholder: 'e.g., Starter Kit, Complete Care Package',
        required: true,
        type: 'text',
      },
      {
        id: 'includedItems',
        label: 'What\'s Included',
        placeholder: 'e.g., Shampoo, Conditioner, and Hair Mask',
        required: true,
        type: 'textarea',
        helperText: 'List the items in the bundle',
      },
      {
        id: 'savings',
        label: 'Savings or Value',
        placeholder: 'e.g., Save $25, $100 value for $69',
        required: true,
        type: 'text',
      },
    ],
    textPromptTemplate: `Create an enticing post for our {{bundleName}}.
This bundle includes: {{includedItems}}.
Value proposition: {{savings}}.
Make it feel like a must-have deal. Emphasize the convenience and savings.`,
    imagePromptTemplate: `Flat lay product photography of bundle items including {{includedItems}}, 
arranged artfully on clean background, gift box or packaging nearby, 
cohesive color scheme, professional commercial style, overhead shot`,
    suggestedPlatforms: ['instagram', 'facebook'],
    suggestedTone: 'Friendly',
    suggestedImageStyle: {
      style: 'commercial',
      aspectRatio: '1:1',
      cameraAngle: 'overhead',
    },
  },
];
