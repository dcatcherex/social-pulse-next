import { PartyPopper, Zap } from "lucide-react";
import type { ContentTemplate } from "../types";

/**
 * Seasonal & Promos Templates (2)
 * - Holiday Greeting, Flash Sale
 */
export const SEASONAL_TEMPLATES: ContentTemplate[] = [
  {
    id: "holiday-greeting",
    name: "Holiday Greeting",
    description: "Send seasonal wishes to your audience",
    category: "seasonal",
    icon: PartyPopper,
    variables: [
      {
        id: "holiday",
        label: "Holiday/Occasion",
        placeholder: "e.g., Christmas, New Year, Diwali",
        required: true,
        type: "text",
      },
      {
        id: "message",
        label: "Your Wishes",
        placeholder: "e.g., Warmth, joy, and wonderful moments with loved ones",
        required: true,
        type: "textarea",
      },
      {
        id: "fromWho",
        label: "From",
        placeholder: "e.g., The [Brand] Family, Our Team",
        required: false,
        type: "text",
      },
    ],
    textPromptTemplate: `Create a warm holiday greeting post.
Holiday: {{holiday}}
Wishes: {{message}}
{{#fromWho}}From: {{fromWho}}{{/fromWho}}
Be genuine and warm. Connect with your audience on a personal level.`,
    imagePromptTemplate: `Festive {{holiday}} greeting card design, 
warm celebratory aesthetic, "Happy {{holiday}}" elegant typography, 
seasonal decorations and colors, professional yet heartfelt, 
social media greeting card style`,
    suggestedPlatforms: ["instagram", "facebook", "twitter"],
    suggestedTone: "Friendly",
    suggestedImageStyle: {
      style: "graphic",
      aspectRatio: "1:1",
    },
  },
  {
    id: "flash-sale",
    name: "Flash Sale",
    description: "Limited-time urgent offer",
    category: "seasonal",
    icon: Zap,
    variables: [
      {
        id: "discount",
        label: "Discount/Offer",
        placeholder: "e.g., 50% OFF, Free shipping",
        required: true,
        type: "text",
      },
      {
        id: "duration",
        label: "How Long",
        placeholder: "e.g., 24 hours only, Until midnight",
        required: true,
        type: "text",
      },
      {
        id: "whatIsIncluded",
        label: "What's Included",
        placeholder: "e.g., Everything in store, Selected items",
        required: true,
        type: "text",
      },
      {
        id: "promoCode",
        label: "Promo Code (Optional)",
        placeholder: "e.g., FLASH50",
        required: false,
        type: "text",
      },
    ],
    textPromptTemplate: `Create an URGENT flash sale post.
Offer: {{discount}} on {{whatIsIncluded}}
Duration: {{duration}}
{{#promoCode}}Use code: {{promoCode}}{{/promoCode}}
Maximum urgency! Make people feel they need to act NOW. Use action words.`,
    imagePromptTemplate: `Urgent flash sale graphic, "FLASH SALE" bold text, 
lightning bolt icons, countdown timer aesthetic, 
"{{discount}}" prominently displayed, high contrast urgent colors, 
limited time offer design, attention-grabbing`,
    suggestedPlatforms: ["instagram", "facebook", "twitter"],
    suggestedTone: "Witty",
    suggestedImageStyle: {
      style: "graphic",
      aspectRatio: "1:1",
    },
  },
];
