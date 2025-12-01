# Reusable Feature-Based Architecture

> Designed for extracting features into other applications or shared packages

---

## Recommended Structure

```
social-pulse/
├── src/
│   ├── features/                    # 🎯 Self-contained feature modules
│   │   ├── auth/                    # Can copy entire folder to new app
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   └── OAuthButton.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useSession.ts
│   │   │   ├── services/
│   │   │   │   └── authService.ts
│   │   │   ├── context/
│   │   │   │   └── AuthContext.tsx
│   │   │   ├── types.ts             # Feature-specific types
│   │   │   └── index.ts             # Public API exports
│   │   │
│   │   ├── content-generator/       # AI Content Generation feature
│   │   │   ├── components/
│   │   │   │   ├── ContentForm.tsx
│   │   │   │   ├── IdeaCard.tsx
│   │   │   │   ├── QuickTemplates.tsx
│   │   │   │   └── ImageGenerator.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useContentGeneration.ts
│   │   │   │   └── useImageGeneration.ts
│   │   │   ├── services/
│   │   │   │   └── geminiContentService.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── social-monitoring/       # Social Listening feature
│   │   │   ├── components/
│   │   │   │   ├── MentionCard.tsx
│   │   │   │   ├── MentionFeed.tsx
│   │   │   │   ├── SentimentBadge.tsx
│   │   │   │   └── FilterBar.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useMentions.ts
│   │   │   │   └── useSentimentAnalysis.ts
│   │   │   ├── services/
│   │   │   │   ├── mentionService.ts
│   │   │   │   └── platforms/
│   │   │   │       ├── metaApi.ts
│   │   │   │       ├── tiktokApi.ts
│   │   │   │       └── youtubeApi.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── scheduling/              # Content Scheduling feature
│   │   │   ├── components/
│   │   │   │   ├── Calendar.tsx
│   │   │   │   ├── PostCard.tsx
│   │   │   │   ├── TimezonePicker.tsx
│   │   │   │   └── QueueList.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useScheduler.ts
│   │   │   │   └── useTimezone.ts
│   │   │   ├── services/
│   │   │   │   └── schedulerService.ts
│   │   │   ├── utils/
│   │   │   │   └── dateUtils.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── analytics/               # Analytics & Reporting feature
│   │   │   ├── components/
│   │   │   │   ├── charts/
│   │   │   │   │   ├── EngagementChart.tsx
│   │   │   │   │   ├── GrowthChart.tsx
│   │   │   │   │   └── SentimentTrend.tsx
│   │   │   │   ├── StatCard.tsx
│   │   │   │   └── ReportExporter.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAnalytics.ts
│   │   │   ├── services/
│   │   │   │   └── analyticsService.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── competitors/             # Competitor Intelligence feature
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── campaigns/               # Campaign Management feature
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   └── brand-management/        # Multi-brand feature
│   │       ├── components/
│   │       │   ├── BrandSwitcher.tsx
│   │       │   └── BrandSettings.tsx
│   │       ├── hooks/
│   │       │   └── useBrand.ts
│   │       ├── context/
│   │       │   └── BrandContext.tsx
│   │       ├── types.ts
│   │       └── index.ts
│   │
│   ├── shared/                      # 🔧 Generic reusable components
│   │   ├── components/
│   │   │   ├── ui/                  # Design system primitives
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Tooltip.tsx
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   └── index.ts
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── PageContainer.tsx
│   │   │   │   └── index.ts
│   │   │   └── feedback/
│   │   │       ├── LoadingSpinner.tsx
│   │   │       ├── EmptyState.tsx
│   │   │       ├── ErrorBoundary.tsx
│   │   │       └── Toast.tsx
│   │   ├── hooks/
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── useClickOutside.ts
│   │   │   ├── useMediaQuery.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   ├── cn.ts                # classnames helper
│   │   │   └── index.ts
│   │   └── types/
│   │       └── common.ts
│   │
│   ├── app/                         # 🏠 App-specific (non-reusable)
│   │   ├── routes/                  # Route definitions
│   │   │   ├── index.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/                   # Page components (compose features)
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── MonitoringPage.tsx
│   │   │   ├── ContentPage.tsx
│   │   │   ├── SchedulePage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── layouts/
│   │   │   ├── AppLayout.tsx
│   │   │   └── AuthLayout.tsx
│   │   └── config/
│   │       ├── navigation.ts
│   │       └── constants.ts
│   │
│   ├── lib/                         # 🔌 External service configs
│   │   ├── gemini.ts                # AI client setup
│   │   ├── queryClient.ts           # React Query config
│   │   └── api.ts                   # Base API client
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
└── vite.config.ts
```

---

## Key Principles

### 1. Feature Module Independence

Each feature folder is **self-contained** with everything it needs:

```typescript
// features/content-generator/index.ts
// Public API - only export what other features need

export { ContentForm } from './components/ContentForm';
export { IdeaCard } from './components/IdeaCard';
export { useContentGeneration } from './hooks/useContentGeneration';
export type { ContentIdea, GenerationOptions } from './types';
```

### 2. Feature-to-Feature Communication

Features should communicate via **props or shared context**, not direct imports:

```typescript
// ❌ Bad: Direct import from another feature's internals
import { analyzeContent } from '../social-monitoring/services/mentionService';

// ✅ Good: Import from feature's public API
import { useSentimentAnalysis } from '@/features/social-monitoring';

// ✅ Good: Pass data via props from parent page
<ContentForm initialTrends={trends} />
```

### 3. Shared vs Feature-Specific

| Location | Purpose | Example |
|----------|---------|---------|
| `shared/components/ui` | Generic, no business logic | Button, Modal, Input |
| `shared/hooks` | Utility hooks, reusable anywhere | useDebounce, useLocalStorage |
| `features/*/components` | Feature-specific UI | MentionCard, IdeaCard |
| `features/*/hooks` | Feature-specific data/logic | useMentions, useScheduler |

### 4. Path Aliases

Configure clean imports in `vite.config.ts`:

```typescript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@app': path.resolve(__dirname, './src/app'),
    },
  },
});
```

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@features/*": ["./src/features/*"],
      "@shared/*": ["./src/shared/*"],
      "@app/*": ["./src/app/*"]
    }
  }
}
```

Usage:
```typescript
import { Button, Card } from '@shared/components/ui';
import { useContentGeneration, IdeaCard } from '@features/content-generator';
import { useBrand } from '@features/brand-management';
```

---

## Extracting Features to Another App

### Option 1: Copy Entire Folder

```bash
# Copy content-generator feature to another project
cp -r src/features/content-generator ../other-app/src/features/

# Update imports in new app
# Only need to install same dependencies (gemini, etc.)
```

### Option 2: Create Shared Package (Monorepo)

```
my-apps/
├── packages/
│   ├── ui-kit/                      # Shared design system
│   │   ├── src/
│   │   │   ├── Button.tsx
│   │   │   └── ...
│   │   └── package.json
│   │
│   ├── content-generator/           # Feature as package
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── social-monitoring/           # Another feature package
│       └── ...
│
├── apps/
│   ├── social-pulse/                # This app
│   │   └── package.json
│   │
│   └── marketing-hub/               # Another app using same features
│       └── package.json
│
├── package.json
└── pnpm-workspace.yaml
```

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

```json
// apps/social-pulse/package.json
{
  "dependencies": {
    "@my-org/ui-kit": "workspace:*",
    "@my-org/content-generator": "workspace:*",
    "@my-org/social-monitoring": "workspace:*"
  }
}
```

---

## Feature Template

When creating a new feature, use this template:

```
features/[feature-name]/
├── components/
│   └── .gitkeep
├── hooks/
│   └── .gitkeep
├── services/
│   └── .gitkeep
├── context/                         # Optional
│   └── .gitkeep
├── utils/                           # Optional
│   └── .gitkeep
├── types.ts
└── index.ts                         # Always export public API
```

```typescript
// features/[feature-name]/types.ts
export interface FeatureEntity {
  id: string;
  // ...
}

export interface FeatureOptions {
  // ...
}
```

```typescript
// features/[feature-name]/index.ts
// Components
export { MainComponent } from './components/MainComponent';

// Hooks
export { useFeature } from './hooks/useFeature';

// Types
export type { FeatureEntity, FeatureOptions } from './types';

// Context (if needed)
export { FeatureProvider, useFeatureContext } from './context/FeatureContext';
```

---

## Comparison: Type-Based vs Feature-Based

| Aspect | Type-Based | Feature-Based |
|--------|------------|---------------|
| Organization | By file type (components/, hooks/) | By domain (auth/, scheduling/) |
| Reusability | Copy individual files | Copy entire folder |
| Scalability | Gets messy at 50+ components | Clear boundaries |
| Team Work | Merge conflicts on same folders | Teams own features |
| Finding Code | Search by filename | Navigate to feature |
| Dependencies | Hard to track | Explicit via index.ts |

---

## Migration Path (Current → Feature-Based)

### Step 1: Create structure
```bash
mkdir -p src/features/{auth,content-generator,social-monitoring,scheduling,analytics,competitors,campaigns,brand-management}
mkdir -p src/shared/{components/ui,hooks,utils}
mkdir -p src/app/{pages,routes,layouts}
```

### Step 2: Move shared components first
```
components/QuestionTooltip.tsx → shared/components/ui/Tooltip.tsx
components/Layout.tsx → app/layouts/AppLayout.tsx
```

### Step 3: Move views into features
```
views/ContentGen.tsx → features/content-generator/components/ContentStudio.tsx
views/Monitoring.tsx → features/social-monitoring/components/MonitoringFeed.tsx
views/Scheduling.tsx → features/scheduling/components/ScheduleCalendar.tsx
```

### Step 4: Extract hooks from components
```
// From large component, extract:
features/content-generator/hooks/useContentGeneration.ts
features/content-generator/hooks/useImageGeneration.ts
```

### Step 5: Create index.ts exports
```typescript
// Each feature gets a clean public API
```

---

*This architecture allows you to build once, use everywhere.*
