# Migration Document: React (Vite) → Next.js

## Overview

| Source Project | Target Project |
|----------------|----------------|
| `social-pulse` (Vite + React) | `social-pulse-next` (Next.js 16) |
| Path: `d:\vscode2\react\social-pulse\social-pulse-react` | Path: `d:\vscode2\react\social-pulse\social-pulse-next` |

---

## Migration Status

### ✅ MIGRATED (Adapted from React project)

| Feature | Original File (React) | New File (Next.js) | Status |
|---------|----------------------|-------------------|--------|
| **Trend Types** | `src/features/trends/types.ts` | `src/features/trends/types/index.ts` | ✅ Migrated |
| **TrendCard Component** | `src/features/trends/components/TrendCard.tsx` | `src/features/trends/components/trend-card.tsx` | ✅ Migrated (adapted) |
| **TrendsSkeleton** | `src/features/trends/components/TrendsSkeleton.tsx` | `src/features/trends/components/trends-skeleton.tsx` | ✅ Migrated |
| **EmptyTrends** | `src/features/trends/components/EmptyTrends.tsx` | `src/features/trends/components/empty-trends.tsx` | ✅ Migrated |
| **useTrends Hook** | `src/features/trends/hooks/useTrends.ts` | `src/features/trends/hooks/use-trends.ts` | ✅ Migrated (adapted) |
| **Trend Service Logic** | `src/features/trends/services/trendService.ts` | `src/features/trends/services/trend-service.ts` | ✅ Migrated (refactored for API routes) |
| **TrendsPage** | `src/app/pages/TrendsPage.tsx` | `src/app/(dashboard)/trends/page.tsx` | ✅ Migrated (adapted) |
| **YouTube Settings Types** | `src/features/trends/types/youtubeSettings.ts` | `src/features/trends/types/index.ts` | ✅ Merged into types |
| **Onboarding Types** | `src/features/onboarding/types.ts` | `src/features/onboarding/types.ts` | ✅ Migrated |
| **OnboardingContext** | `src/features/onboarding/context/OnboardingContext.tsx` | `src/features/onboarding/context/OnboardingContext.tsx` | ✅ Migrated (adapted for Next.js) |
| **Onboarding Page** | N/A (was inline) | `src/app/onboarding/page.tsx` | ✅ New wizard UI |
| **Brand Types** | `src/features/brand-management/types.ts` | `src/features/brand-management/types.ts` | ✅ Migrated |
| **BrandContext** | `src/features/brand-management/context/BrandContext.tsx` | `src/features/brand-management/context/BrandContext.tsx` | ✅ Migrated (adapted) |
| **BrandSwitcher** | `src/features/brand-management/components/BrandSwitcher.tsx` | `src/features/brand-management/components/BrandSwitcher.tsx` | ✅ Migrated |
| **BrandSettings** | `src/features/brand-management/components/BrandSettings.tsx` | `src/features/brand-management/components/BrandSettings.tsx` | ✅ Migrated |
| **Brand Page** | N/A | `src/app/(dashboard)/brand/page.tsx` | ✅ New page |
| **Content Generator Types** | `src/features/content-generator/types.ts` | `src/features/content-generator/types.ts` | ✅ Migrated |
| **Content Service** | `src/features/content-generator/services/contentService.ts` | `src/features/content-generator/services/content-service.ts` | ✅ Migrated (API route) |
| **useContentGeneration** | `src/features/content-generator/hooks/useContentGeneration.ts` | `src/features/content-generator/hooks/use-content-generation.ts` | ✅ Migrated (React Query) |
| **useImageGeneration** | `src/features/content-generator/hooks/useImageGeneration.ts` | `src/features/content-generator/hooks/use-image-generation.ts` | ✅ Migrated (React Query) |
| **IdeaCard** | `src/features/content-generator/components/IdeaCard.tsx` | `src/features/content-generator/components/IdeaCard.tsx` | ✅ Migrated |
| **Content API (Generate)** | N/A (client-side) | `src/app/api/content/generate/route.ts` | ✅ New (server-side AI) |
| **Content API (Image)** | N/A (client-side) | `src/app/api/content/image/route.ts` | ✅ New (server-side AI) |
| **ContentPage (Full)** | `src/app/pages/ContentPage.tsx` | `src/app/(dashboard)/content/page.tsx` | ✅ Migrated (Tab Switcher, One-Tap Ideas, Image Studio) |
| **Scheduling Types** | `src/features/scheduling/types.ts` | `src/features/scheduling/types.ts` | ✅ Migrated |
| **SchedulerContext** | `src/features/scheduling/hooks/useScheduler.ts` | `src/features/scheduling/context/SchedulerContext.tsx` | ✅ Migrated (Context + localStorage) |
| **SchedulePage** | `src/app/pages/SchedulePage.tsx` | `src/app/(dashboard)/schedule/page.tsx` | ✅ Migrated (React design) |
| **QuestionTooltip** | `components/QuestionTooltip.tsx` | `src/shared/components/QuestionTooltip.tsx` | ✅ Migrated |
| **Common Types (Platform)** | `src/shared/types/common.ts` | `src/shared/types/common.ts` | ✅ Migrated |
| **SettingsPage** | `src/app/pages/SettingsPage.tsx` | `src/app/(dashboard)/settings/page.tsx` | ✅ Migrated (React design with tabs) |
| **Social Monitoring Types** | `src/features/social-monitoring/types.ts` | `src/features/social-monitoring/types.ts` | ✅ Migrated |
| **MentionCard** | `src/features/social-monitoring/components/MentionCard.tsx` | `src/features/social-monitoring/components/MentionCard.tsx` | ✅ Migrated |
| **MentionFeed** | `src/features/social-monitoring/components/MentionFeed.tsx` | `src/features/social-monitoring/components/MentionFeed.tsx` | ✅ Migrated |
| **useMentions** | `src/features/social-monitoring/hooks/useMentions.ts` | `src/features/social-monitoring/hooks/use-mentions.ts` | ✅ Migrated |
| **mentionService** | `src/features/social-monitoring/services/mentionService.ts` | API routes | ✅ Migrated to server-side |
| **Mentions API (Generate)** | N/A (client-side) | `src/app/api/mentions/generate/route.ts` | ✅ New (server-side AI) |
| **Mentions API (Analyze)** | N/A (client-side) | `src/app/api/mentions/analyze/route.ts` | ✅ New (server-side AI) |
| **MonitorPage** | `src/app/pages/MonitoringPage.tsx` | `src/app/(dashboard)/monitor/page.tsx` | ✅ Migrated (React design) |
| **Auth Types** | `src/features/auth/types.ts` | `src/features/auth/types.ts` | ✅ Migrated |
| **AuthContext** | `src/features/auth/context/AuthContext.tsx` | `src/features/auth/context/AuthContext.tsx` | ✅ Migrated (adapted for Next.js) |
| **ProtectedRoute** | `src/features/auth/components/ProtectedRoute.tsx` | `src/features/auth/components/ProtectedRoute.tsx` | ✅ Migrated (Next.js navigation) |
| **LandingPage** | `src/features/auth/components/LandingPage.tsx` | `src/features/auth/components/LandingPage.tsx` | ✅ Migrated |
| **LoginPage** | `src/features/auth/components/LoginPage.tsx` | `src/features/auth/components/LoginPage.tsx` | ✅ Migrated |
| **SignupPage** | `src/features/auth/components/SignupPage.tsx` | `src/features/auth/components/SignupPage.tsx` | ✅ Migrated |
| **Login Route** | N/A (React Router) | `src/app/login/page.tsx` | ✅ New (Next.js route) |
| **Signup Route** | N/A (React Router) | `src/app/signup/page.tsx` | ✅ New (Next.js route) |
| **Landing Route** | N/A (React Router) | `src/app/landing/page.tsx` | ✅ New (Next.js route) |
| **Clerk Integration** | N/A | `@clerk/nextjs` | ✅ Production auth with Clerk |
| **Clerk Middleware** | N/A | `middleware.ts` | ✅ Route protection |
| **Clerk Sign-In** | N/A | `src/app/sign-in/[[...sign-in]]/page.tsx` | ✅ Clerk UI |
| **Clerk Sign-Up** | N/A | `src/app/sign-up/[[...sign-up]]/page.tsx` | ✅ Clerk UI |

### ✅ MIGRATED TO API ROUTES (Server-side now)

| Original Service (React) | New API Route (Next.js) | Changes |
|--------------------------|------------------------|---------|
| `src/features/trends/services/serpApiService.ts` | `src/app/api/trends/route.ts` | No more CORS proxy needed |
| `src/features/trends/services/youtubeService.ts` | `src/app/api/youtube/route.ts` | Server-side, secure API key |
| `src/features/trends/services/newsService.ts` | `src/app/api/news/route.ts` | Server-side, secure API key |
| Gemini AI calls in trendService | `src/app/api/ai/analyze/route.ts` | Centralized AI endpoint |

---

### 🆕 NEWLY CREATED (Not in React project)

| Page/Component | File | Notes |
|----------------|------|-------|
| **Dashboard Page** | `src/app/(dashboard)/dashboard/page.tsx` | New - Stats, quick actions |
| **Content AI Page** | `src/app/(dashboard)/content/page.tsx` | New - Content generator UI |
| **Schedule Page** | `src/app/(dashboard)/schedule/page.tsx` | New - Calendar & scheduling |
| **Monitor Page** | `src/app/(dashboard)/monitor/page.tsx` | New - Social listening |
| **Campaigns Page** | `src/app/(dashboard)/campaigns/page.tsx` | New - Campaign management |
| **Competitors Page** | `src/app/(dashboard)/competitors/page.tsx` | New - Competitor analysis |
| **Settings Page** | `src/app/(dashboard)/settings/page.tsx` | New - Account settings |
| **Dashboard Layout** | `src/app/(dashboard)/layout.tsx` | New - Sidebar navigation |
| **Query Provider** | `src/providers/query-provider.tsx` | New - React Query setup |

---

## NOT YET MIGRATED (Exists in React, not in Next.js)

| Feature | React File | Priority | Notes |
|---------|-----------|----------|-------|
| **OnboardingWizard (Auth)** | `src/features/auth/components/OnboardingWizard.tsx` | Low | Already have onboarding in Next.js |
| **Analytics Feature** | `src/features/analytics/` | Medium | Analytics dashboard |
| **YouTubeSettingsPanel** | `src/features/trends/components/YouTubeSettings.tsx` | Medium | YouTube filter UI |
| **AppLayout (Original)** | `src/app/layouts/AppLayout.tsx` | Low | Different design |
| **Navigation Config** | `src/app/config/navigation.ts` | Low | Nav items config |
| **UI Components (shared)** | `src/shared/components/ui/` | Medium | Custom UI components |
| **Gemini Client** | `src/lib/gemini.ts` | Low | Now in API route |

---

## File Structure Comparison

### React (Vite) Structure
```
social-pulse/
├── src/
│   ├── app/
│   │   ├── config/
│   │   ├── layouts/AppLayout.tsx
│   │   └── pages/
│   │       ├── DashboardPage.tsx      ← Different design
│   │       ├── TrendsPage.tsx         ← MIGRATED
│   │       ├── ContentPage.tsx        ← Not migrated
│   │       ├── MonitoringPage.tsx     ← Not migrated
│   │       └── ...
│   ├── features/
│   │   ├── analytics/
│   │   ├── auth/
│   │   ├── brand-management/
│   │   ├── content-generator/
│   │   ├── onboarding/               ← NOT MIGRATED (important!)
│   │   └── trends/                   ← MIGRATED
│   ├── shared/
│   │   ├── components/ui/
│   │   ├── hooks/
│   │   └── types/
│   └── lib/gemini.ts
├── views/                             ← Old views (not used?)
└── vite.config.ts
```

### Next.js Structure
```
social-pulse-next/
├── src/
│   ├── app/
│   │   ├── api/                       ← NEW: Server-side API
│   │   │   ├── trends/route.ts
│   │   │   ├── youtube/route.ts
│   │   │   ├── news/route.ts
│   │   │   └── ai/analyze/route.ts
│   │   ├── (dashboard)/               ← Route group
│   │   │   ├── layout.tsx             ← NEW: Dashboard layout
│   │   │   ├── dashboard/page.tsx     ← NEW
│   │   │   ├── trends/page.tsx        ← MIGRATED
│   │   │   ├── content/page.tsx       ← NEW
│   │   │   ├── schedule/page.tsx      ← NEW
│   │   │   ├── monitor/page.tsx       ← NEW
│   │   │   ├── campaigns/page.tsx     ← NEW
│   │   │   ├── competitors/page.tsx   ← NEW
│   │   │   └── settings/page.tsx      ← NEW
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/ui/                 ← shadcn/ui (fresh install)
│   ├── features/
│   │   └── trends/                    ← MIGRATED
│   ├── providers/
│   │   └── query-provider.tsx         ← NEW
│   └── lib/utils.ts
└── .env.local
```

---

## Key Differences

| Aspect | React (Vite) | Next.js |
|--------|-------------|---------|
| **API Calls** | Client-side with CORS proxy | Server-side API routes |
| **API Key Security** | Exposed in browser (via proxy) | Secure on server |
| **Routing** | React Router | Next.js App Router |
| **Caching** | localStorage manual | Built-in + localStorage |
| **Rendering** | Client-side only | SSR + CSR |
| **UI Components** | Custom + shadcn | Fresh shadcn install |

---

## Decision Points for Discussion

### 1. Onboarding Flow ✅ DONE
- **React**: Has complete onboarding wizard (`src/features/onboarding/`)
- **Next.js**: ✅ Migrated with new step-by-step wizard UI
- **Status**: Complete - brand, industry, challenges, keywords flow working

### 2. Dashboard Design
- **React**: `DashboardPage.tsx` - may have different design
- **Next.js**: Newly created with stats cards, quick actions
- **Decision**: Which design is better? Merge features?

### 3. Content Generator
- **React**: `contentService.ts` - existing AI content generation
- **Next.js**: New simpler UI with demo fallback
- **Decision**: Migrate the React service logic?

### 4. Authentication
- **React**: Has auth feature folder
- **Next.js**: Not implemented
- **Decision**: Use NextAuth or migrate existing?

### 5. UI Components
- **React**: Custom shared components in `src/shared/components/ui/`
- **Next.js**: Fresh shadcn/ui installation
- **Decision**: Use shadcn or migrate custom components?

---

## Next Steps

1. [ ] Review React pages to decide what to migrate vs keep new
2. [x] ~~Migrate onboarding flow (high priority)~~ ✅ DONE
3. [x] ~~Migrate brand management~~ ✅ DONE
4. [x] ~~Migrate content generator service~~ ✅ DONE
5. [x] ~~Migrate scheduling feature~~ ✅ DONE
6. [x] ~~Migrate settings/preferences page~~ ✅ DONE
7. [x] ~~Migrate social monitoring/listening feed~~ ✅ DONE
8. [x] ~~Migrate auth feature~~ ✅ DONE (localStorage-based MVP auth)
9. [x] ~~Upgrade to Clerk for production auth~~ ✅ DONE
10. [ ] Migrate YouTubeSettingsPanel
11. [ ] Deploy to Vercel

---

## Commands

```powershell
# Run React project (original)
cd d:\vscode2\react\social-pulse
pnpm dev

# Run Next.js project (new)
cd d:\vscode2\react\social-pulse-next
pnpm dev
```
