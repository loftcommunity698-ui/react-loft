# LoftCommunity Frontend Spec

> Reference blueprint for the LoftCommunity React frontend application.
> Source: `react-loft/src/` — extracted 2026-07-23.

---

## 1. Overview

LoftCommunity is a job marketplace SPA for employers and job seekers, with role-based dashboards, a hiring workflow pipeline, messaging, notifications, and a billing/subscription system. The frontend communicates with a Next.js backend at `loft-backend-cl1n.onrender.com` via a unified `/api` prefix, with a JSON-fallback mode for local development without the backend.

---

## 2. Tech Stack

| Library | Version | Purpose |
|---|---|---|
| react | ^18.3.1 | UI library |
| react-dom | ^18.3.1 | DOM renderer |
| react-router-dom | ^7.17.0 | Client-side routing |
| axios | ^1.7.9 | HTTP client (withCredentials) |
| react-hook-form | ^7.54.0 | Form state & validation |
| @hookform/resolvers | ^3.9.0 | Zod resolver for RHF |
| zod | ^3.24.0 | Schema validation |
| framer-motion | ^11.15.0 | Animations & page transitions |
| sonner | ^1.7.1 | Toast notifications |
| lucide-react | ^0.468.0 | Icon library |
| class-variance-authority | ^0.7.1 | Component variant utilities |
| clsx | ^2.1.1 | Conditional classnames |
| tailwind-merge | ^2.6.0 | Tailwind class deduplication |
| cmdk | ^0.2.0 | Command palette |
| react-resizable-panels | ^2.1.9 | Resizable split panels |
| vaul | ^1.1.2 | Drawer component |
| @uploadthing/react | ^7.3.3 | File upload (resume) |
| @radix-ui/react-accordion | ^1.2.2 | Accordion primitive |
| @radix-ui/react-dialog | ^1.1.3 | Dialog primitive |
| @radix-ui/react-dropdown-menu | ^2.1.18 | Dropdown menu primitive |
| @radix-ui/react-label | ^2.1.1 | Label primitive |
| @radix-ui/react-popover | ^1.1.17 | Popover primitive |
| @radix-ui/react-progress | ^1.1.1 | Progress bar primitive |
| @radix-ui/react-select | ^2.3.1 | Select primitive |
| @radix-ui/react-separator | ^1.1.1 | Separator primitive |
| @radix-ui/react-slot | ^1.1.1 | Slot composition primitive |
| @radix-ui/react-switch | ^1.3.0 | Switch primitive |
| @radix-ui/react-tabs | ^1.1.2 | Tabs primitive |
| @radix-ui/react-tooltip | ^1.2.10 | Tooltip primitive |
| tailwindcss | ^3.4.16 | Utility-first CSS |
| tailwindcss-animate | ^1.0.7 | Tailwind animation utilities |
| postcss | ^8.4.49 | CSS processing |
| autoprefixer | ^10.4.20 | CSS vendor prefixes |
| typescript | ^5.6.3 | Type checking |
| vite | ^6.0.0 | Build tool & dev server |
| @vitejs/plugin-react | ^4.3.4 | React Fast Refresh |
| @playwright/test | ^1.61.1 | E2E testing |
| concurrently | ^9.1.0 | Parallel dev servers |

---

## 3. Code Structure

```
react-loft/
├── e2e/                                    # Playwright E2E tests
│   ├── global-setup.ts                     # Seeds DB, creates test users
│   ├── global-teardown.ts                  # Cleans up test data
│   ├── auth.ts                             # Shared auth helpers for tests
│   ├── constants.ts                        # Test constants (URLs, credentials)
│   ├── 01-profile-image.spec.ts            # Profile image upload flow
│   ├── 02-job-application.spec.ts          # Applicant applies to job
│   ├── 03-employer-sees-application.spec.ts# Employer reviews application
│   └── 04-messaging.spec.ts               # Inter-user messaging
├── public/                                 # Static assets
├── src/
│   ├── main.tsx                            # ReactDOM entry, BrowserRouter
│   ├── App.tsx                             # Route tree, providers, Toaster
│   ├── data/
│   │   ├── jobs.json                       # Mock job dataset for JSON mode
│   │   └── remote-jobs-cache.json          # Cached remote job listings
│   ├── hooks/
│   │   ├── useAmbient.ts                   # Ambient background orbs config
│   │   ├── useReducedMotion.ts             # prefers-reduced-motion listener
│   │   └── useReveal.ts                    # Scroll-reveal + stagger animations
│   ├── lib/
│   │   ├── api.ts                          # Axios instance + all API functions
│   │   ├── api-hooks.ts                    # Custom data-fetching hooks (useState+useEffect)
│   │   ├── config.ts                       # Feature flags (USE_JSON_DATA)
│   │   ├── constant.ts                     # Nav menu constants (applicant/employer)
│   │   ├── json-service.ts                 # JSON mock data service with caching
│   │   ├── logger.ts                       # Structured JSON logger factory
│   │   ├── mappers.ts                      # Job normalization + enum mappers
│   │   ├── sidebar-constants.ts            # Sidebar link definitions
│   │   ├── sse.ts                          # Server-Sent Events client
│   │   ├── types.ts                        # Shared TypeScript interfaces
│   │   ├── uploadcare.ts                   # Profile image upload (data URL)
│   │   ├── uploadthing.ts                  # Resume upload type defs
│   │   └── utils.ts                        # cn() utility (clsx + tailwind-merge)
│   ├── providers/
│   │   ├── AuthProvider.tsx                 # Auth context, login/register/logout
│   │   └── modal-provider.tsx              # Global modal context
│   ├── styles/
│   │   └── globals.css                     # Tailwind base + custom CSS
│   ├── components/
│   │   ├── ui/                             # shadcn/ui primitives (26 files: 25 UI primitives + 1 route guard)
│   │   │   ├── accordion.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── command.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── logo.tsx
│   │   │   ├── multiple-selector.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── ProtectedRoute.tsx          # Auth + role guard
│   │   │   ├── resizable.tsx
│   │   │   ├── scroll-split-card.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── tooltip.tsx
│   │   ├── layout/
│   │   │   ├── DashboardShell.tsx          # Dashboard layout: Sidebar + Infobar + Outlet
│   │   │   ├── Footer.tsx
│   │   │   ├── Infobar.tsx                 # Top header bar (notifications, profile)
│   │   │   ├── Navbar.tsx                  # Public site navigation
│   │   │   ├── NavbarDropdown.tsx
│   │   │   ├── PageShell.tsx
│   │   │   └── Sidebar.tsx                 # Dashboard sidebar (applicant/employer)
│   │   ├── sections/
│   │   │   ├── about/
│   │   │   │   ├── CTABanner.tsx
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── MissionSection.tsx
│   │   │   │   ├── TeamSection.tsx
│   │   │   │   └── ValuesSection.tsx
│   │   │   ├── contact/
│   │   │   │   ├── ContactForm.tsx
│   │   │   │   ├── InfoPanel.tsx
│   │   │   │   └── MapSection.tsx
│   │   │   ├── home/
│   │   │   │   ├── CTABanner.tsx
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── HowItWorks.tsx
│   │   │   │   ├── JobCategories.tsx
│   │   │   │   └── Testimonials.tsx
│   │   │   └── jobs/
│   │   │       └── SaveJobButton.tsx
│   │   ├── home/
│   │   │   └── featured-jobs.tsx            # Featured jobs grid (home page)
│   │   ├── forms/
│   │   │   ├── JobDetailsModal.tsx
│   │   │   ├── profile-form.tsx
│   │   │   └── ScheduleInterviewModal.tsx
│   │   ├── modals/
│   │   │   ├── ApplyJobModal.tsx
│   │   │   ├── ContactSupportModal.tsx
│   │   │   └── ScheduleInterviewModal.tsx
│   │   ├── global/
│   │   │   ├── 3d-card.tsx
│   │   │   ├── connect-parallax.tsx
│   │   │   ├── container-scroll-animation.tsx
│   │   │   ├── custom-modal.tsx
│   │   │   ├── email-verification-banner.tsx
│   │   │   ├── infinite-moving-cards.tsx
│   │   │   ├── lamp.tsx
│   │   │   ├── mode-toggle.tsx
│   │   │   ├── page-loader.tsx
│   │   │   ├── preloader.tsx
│   │   │   └── sparkles.tsx
│   │   ├── skeletons/
│   │   │   ├── ApplicationListSkeleton.tsx
│   │   │   ├── DashboardSkeleton.tsx
│   │   │   ├── JobListSkeleton.tsx
│   │   │   └── ProfileSkeleton.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── ScrollToTop.tsx
│   │   └── VisitorCounter.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── index.ts
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── LogoutButton.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── ResetPasswordForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts              # useAuthActions (with redirect)
│   │   │   └── types/
│   │   │       └── index.ts
│   │   ├── billing/
│   │   │   ├── components/
│   │   │   │   ├── BillingDashboard.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   └── useBilling.ts
│   │   │   ├── services/
│   │   │   │   └── billingService.ts       # PLANS constant + API calls
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── dashboard/
│   │   │   ├── hooks/
│   │   │   │   └── useDashboardData.ts     # Typed dashboard data hook
│   │   │   └── index.ts
│   │   ├── hiring-workflow/
│   │   │   ├── components/
│   │   │   │   ├── ApplicationCard.tsx
│   │   │   │   ├── ApplicationList.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── StageCard.tsx
│   │   │   │   └── WorkflowTimeline.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useHiringWorkflow.ts
│   │   │   ├── services/
│   │   │   │   └── hiringService.ts        # Stage config + timeline generation
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── job-management/
│   │       ├── components/
│   │       │   ├── index.ts
│   │       │   ├── JobCard.tsx
│   │       │   ├── JobForm.tsx
│   │       │   └── JobList.tsx
│   │       ├── hooks/
│   │       │   └── useJobManagement.ts
│   │       ├── services/
│   │       │   └── jobService.ts
│   │       ├── types/
│   │       │   └── index.ts
│   │       └── index.ts
│   └── pages/                              # 36 page components
│       ├── About.tsx
│       ├── Admin.tsx
│       ├── AdminApplicationDetail.tsx
│       ├── AdminApplications.tsx
│       ├── AdminEmployers.tsx
│       ├── AdminSettings.tsx
│       ├── ApplicationDetail.tsx
│       ├── Applications.tsx
│       ├── Blocked.tsx
│       ├── BrowseJobs.tsx
│       ├── CompanyProfile.tsx
│       ├── Contact.tsx
│       ├── CreateJob.tsx
│       ├── Dashboard.tsx
│       ├── EditJob.tsx
│       ├── EmployerDashboard.tsx
│       ├── ErrorPage.tsx
│       ├── FAQ.tsx
│       ├── ForgotPassword.tsx
│       ├── Guide.tsx
│       ├── HiringWorkflow.tsx
│       ├── Home.tsx
│       ├── JobCandidates.tsx
│       ├── JobDetail.tsx
│       ├── Login.tsx
│       ├── Messages.tsx
│       ├── NotFound.tsx
│       ├── Notifications.tsx
│       ├── Onboarding.tsx
│       ├── Privacy.tsx
│       ├── Profile.tsx
│       ├── Register.tsx
│       ├── SavedJobs.tsx
│       ├── Settings.tsx
│       ├── Terms.tsx
│       └── VerifyEmail.tsx
├── vercel.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json
├── tailwind.config.ts
├── postcss.config.js
└── index.html
```

---

## 4. Entry Points

```
index.html
  └─ main.tsx
       ├─ React.StrictMode
       ├─ BrowserRouter
       └─ App
            ├─ AuthProvider              ← wraps entire app
            │    └─ AuthContext           ← user, status, login, register, logout, hasRole
            ├─ VisitorCounter
            ├─ ScrollToTop
            ├─ AnimatePresence (page transitions)
            │    └─ Routes
            │         ├─ Public routes (/, /login, /register, etc.)
            │         ├─ DashboardShell (layout wrapper)
            │         │    └─ Protected routes (/dashboard, /applications, /admin/*, etc.)
            │         └─ * → NotFound
            └─ Toaster (sonner, position: top-center, dark theme)
                                            toastOptions: { style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }
```

**Provider hierarchy (inside-out):**
1. `BrowserRouter` (react-router-dom)
2. `AuthProvider` (React Context — `AuthProvider.tsx:48`)
3. `Toaster` (sonner — always visible)

`ModalProvider` is defined (`providers/modal-provider.tsx:18`) but **not mounted** in `App.tsx` currently.

---

## 5. Routing

| Path | Page Component | Required Role | Layout |
|---|---|---|---|
| `/` | `Home` | — | Public (none) |
| `/login` | `Login` | — | Public |
| `/register` | `Register` | — | Public |
| `/forgot-password` | `ForgotPassword` | — | Public |
| `/verify-email` | `VerifyEmail` | — | Public |
| `/about` | `About` | — | Public |
| `/contact` | `Contact` | — | Public |
| `/jobs` | `BrowseJobs` | — | Public |
| `/jobs/:slug` | `JobDetail` | — | Public |
| `/faq` | `FAQ` | — | Public |
| `/privacy` | `Privacy` | — | Public |
| `/terms` | `Terms` | — | Public |
| `/blocked` | `Blocked` | — | Public |
| `/dashboard` | `Dashboard` | `applicant` | `DashboardShell` |
| `/jobs/create` | `CreateJob` | `employer` | `DashboardShell` |
| `/applications` | `Applications` | `applicant` | `DashboardShell` |
| `/applications/:id` | `ApplicationDetail` | `applicant` | `DashboardShell` |
| `/profile` | `Profile` | — (any auth) | `DashboardShell` |
| `/messages` | `Messages` | — (any auth) | `DashboardShell` |
| `/settings` | `Settings` | — (any auth) | `DashboardShell` |
| `/saved-jobs` | `SavedJobs` | `applicant` | `DashboardShell` |
| `/notifications` | `Notifications` | — (any auth) | `DashboardShell` |
| `/onboarding` | `Onboarding` | — (any auth) | `DashboardShell` |
| `/hiring-workflow` | `HiringWorkflow` | `employer` | `DashboardShell` |
| `/employer/dashboard` | `EmployerDashboard` | `employer` | `DashboardShell` |
| `/employer/company` | `CompanyProfile` | `employer` | `DashboardShell` |
| `/employer/jobs/:id/candidates` | `JobCandidates` | `employer` | `DashboardShell` |
| `/employer/jobs/:id/edit` | `EditJob` | `employer` | `DashboardShell` |
| `/guide` | `Guide` | — (any auth) | `DashboardShell` |
| `/admin` | `Admin` | — (any auth) | `DashboardShell` |
| `/admin/settings` | `AdminSettings` | — (any auth) | `DashboardShell` |
| `/admin/employers` | `AdminEmployers` | — (any auth) | `DashboardShell` |
| `/admin/applications` | `AdminApplications` | — (any auth) | `DashboardShell` |
| `/admin/applications/:id` | `AdminApplicationDetail` | — (any auth) | `DashboardShell` |
| `/error` | `ErrorPage` | — | `DashboardShell` |
| `*` | `NotFound` | — | Public |

**Role guard behavior** (`ProtectedRoute.tsx:10-33`):
- `status === 'loading'` → spinner (emerald `Loader2` icon)
- `status === 'unauthenticated'` → `<Navigate to="/login" replace />`
- `requiredRole="employer"` + `!user.isEmployer` → `<Navigate to="/dashboard" replace />`
- `requiredRole="applicant"` + `user.isEmployer` → `<Navigate to="/employer/dashboard" replace />`

---

## 6. State Management

### AuthProvider (`src/providers/AuthProvider.tsx`)

React Context providing:

```typescript
interface AuthContextType {
  user: User | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
  isAuthenticated: boolean
  error: string | null
  login: (input: LoginInput) => Promise<{ success: boolean; error?: string }>
  register: (input: RegisterInput) => Promise<{ success; error? }>
  logout: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ success; error?; message? }>
  clearError: () => void
  hasRole: (role: 'employer' | 'job_seeker') => boolean
}
```

**Key flow:**
1. On mount → `checkSession()` calls `GET /auth/session`
2. If session has email → `fetchProfile(email)` calls `GET /users/profile?email=...`
3. Profile is normalized via `toUser()` which handles both `id` and `clerkId` naming
4. Errors auto-clear after 5 seconds (`AuthProvider.tsx:58-61`)

### ModalProvider (`src/providers/modal-provider.tsx`)

Generic modal context (defined but **not mounted in App.tsx**):

```typescript
setOpen(modal: ReactNode, fetchData?: () => Promise<any>) => void
setClose: () => void
```

### Custom Hooks Pattern

All data-fetching hooks follow the same pattern:
```typescript
function useSomething(params?) {
  const [data, setData] = useState<T>(initialValue)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // fetch data → setData → setLoading(false)
  }, [deps])

  return { data, loading, error }
}
```

**No global state library** (no Redux, Zustand, Jotai). All state is local to hooks or Context.

---

## 7. API Integration

### Axios Instance (`src/lib/api.ts:21-27`)

```typescript
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})
```

All API functions are exported as named functions from `api.ts`. The instance is also exported as default.

### API Function Organization (`src/lib/api.ts`)

| Section | Functions |
|---|---|
| **Auth** | `login`, `register`, `logout`, `getSession`, `resetPassword`, `updatePassword`, `verifyEmail` |
| **User/Profile** | `getProfile`, `updateProfile`, `setUserRole` |
| **Company** | `getCompanyProfile`, `updateCompanyProfile`, `getCompanyJobs` |
| **Jobs** | `applyToJob`, `getJobCandidates`, `getJobMetrics`, `reportJob`, `getRemoteJobs` |
| **Applications** | `updateApplicationStatus`, `toggleShortlist` |
| **Interviews** | `scheduleInterview`, `updateInterview` |
| **Saved Jobs** | `fetchSavedJobs`, `saveJob`, `unsaveJob` |
| **Notifications** | `getNotifications`, `markNotificationsRead`, `markAllNotificationsRead` |
| **Notification Prefs** | `getNotificationPrefs`, `updateNotificationPrefs` |
| **Messages** | `sendMessage` |
| **Contact** | `submitContactForm` |
| **Skills** | `searchSkills` |
| **Admin** | `getAdminApplications`, `getAdminApplication` |
| **Generic** | `fetchApi<T>` (native fetch wrapper) |

### Proxy Config (`vite.config.ts:16-23`)

```typescript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: process.env.VITE_BACKEND_URL || 'http://localhost:4000',
      changeOrigin: true,
      secure: false,
    },
  },
},
```

In development, `/api/*` requests are proxied to `localhost:4000` (the backend). In production (Vercel), rewrites handle this.

---

## 8. Data Fetching Pattern

### Hybrid JSON/API Strategy

Controlled by `USE_JSON_DATA` flag (`src/lib/config.ts:1`):

```typescript
export const USE_JSON_DATA = import.meta.env.VITE_USE_JSON_DATA !== 'false'
```

**Defaults to `true`** — the app uses local JSON mock data unless explicitly disabled.

### How It Works

In hooks like `useJobs` (`src/lib/api-hooks.ts:32-67`):

```typescript
if (USE_JSON_DATA) {
  getJobsFromJson(params)    // reads from src/data/jobs.json
    .then(data => setJobs(data.jobs))
} else {
  api.get('/jobs', { params })  // hits real backend
    .then(res => setJobs(res.data.jobs.map(normalizeJob)))
}
```

### JSON Service (`src/lib/json-service.ts`)

- Reads from `@/data/jobs.json`
- Simulates network latency: 400ms base + random 300ms jitter (`json-service.ts:5-7`)
- In-memory cache with 60s TTL (`CACHE_TTL = 60000`)
- Supports filtering (search, jobType, experienceLevel, workMode, featured, status, location)
- Supports pagination (page, limit)

### Data Normalization (`src/lib/mappers.ts`)

`normalizeJob()` normalizes API/JSON responses to a consistent shape:
- `isFeatured` ← `isFeatured ?? featured ?? false`
- `source` ← `source || 'local'`
- `company` ← `company || employer || null`
- `skills` ← `skills || requiredSkills || []`
- `benefits` — joins arrays to newline-separated strings

### Dashboard Data Fetching (`src/lib/api-hooks.ts:198-281`)

`useDashboardData` is the heaviest hook — fires **6 parallel API calls**:
1. `GET /applications?email=...`
2. `GET /users/profile?email=...`
3. `GET /jobs?limit=6`
4. `GET /users/saved-jobs?email=...`
5. `GET /messages?email=...`
6. `GET /companies/jobs?email=...`

Includes stale-while-revalidate: re-fetches on window focus if data is >30s old (`STALE_TIME = 30000`).

### Feature Module Hooks

The feature modules provide **duplicate** hook layers:
- `features/dashboard/hooks/useDashboardData.ts` — uses `fetch()` directly, typed interfaces
- `src/lib/api-hooks.ts` — uses axios `api`, also has `useDashboardData`

These are **two separate implementations** of similar functionality. The feature module version is more strongly typed.

---

## 9. Feature Modules

### 9.1 Auth (`src/features/auth/`)

```
auth/
├── components/
│   ├── index.ts            # Re-exports LoginForm, RegisterForm, ResetPasswordForm, LogoutButton
│   ├── LoginForm.tsx
│   ├── LogoutButton.tsx
│   ├── RegisterForm.tsx
│   └── ResetPasswordForm.tsx
├── hooks/
│   └── useAuth.ts          # useAuthActions — wraps useAuth() + useNavigate() for redirect
└── types/
    └── index.ts            # UserRole, AuthStatus, LoginInput, RegisterInput, AuthUser, AuthState, etc.
```

**Key types:**
- `UserRole`: `'employer' | 'job_seeker'`
- `AuthUser`: includes `tier`, `credits`, `clerkId?` (legacy field)
- `PasswordRequirements`, `ValidationErrors` for client-side validation

### 9.2 Billing (`src/features/billing/`)

```
billing/
├── components/
│   ├── BillingDashboard.tsx
│   └── index.ts
├── hooks/
│   └── useBilling.ts       # Plans, subscription, usage, upgradePlan
├── services/
│   └── billingService.ts   # PLANS constant, API calls to /billing/*
├── types/
│   └── index.ts            # Plan, UserSubscription, BillingUsage, PlanId
└── index.ts                # Barrel export
```

**Plans (hardcoded in `billingService.ts:4-51`):**
| Plan | Price | Credits | Popular |
|---|---|---|---|
| free | $0 | 10 | — |
| pro | $29 | 100 | ✓ |
| premium | $99 | Unlimited | — |

**API endpoints (all unimplemented on backend):**
- `GET /billing/subscription`
- `GET /billing/usage`
- `POST /billing/upgrade`

### 9.3 Dashboard (`src/features/dashboard/`)

```
dashboard/
├── hooks/
│   └── useDashboardData.ts  # Typed version using fetch() directly
└── index.ts                 # Barrel export
```

Exports: `useDashboardData`, `calculateProfileProgress`, `isProfileComplete`

### 9.4 Hiring Workflow (`src/features/hiring-workflow/`)

```
hiring-workflow/
├── components/
│   ├── ApplicationCard.tsx
│   ├── ApplicationList.tsx
│   ├── index.ts
│   ├── StageCard.tsx
│   └── WorkflowTimeline.tsx
├── hooks/
│   └── useHiringWorkflow.ts   # useHiringWorkflow, useApplicationTimeline
├── services/
│   └── hiringService.ts       # Stage config, timeline generation, API calls
├── types/
│   └── index.ts               # HiringStage (13 stages), ApplicationStatus (8 states)
└── index.ts                   # Barrel export
```

**13-Stage Hiring Pipeline:**
```
JOB_IDENTIFIED → JOB_APPLICATION → APPLICATIONS_RECEIVED → RESUME_SCREENING
→ HR_INTERVIEW → SKILLS_TEST → TECHNICAL_INTERVIEW → BEHAVIORAL_INTERVIEW
→ FINAL_HIRING_MANAGER → BACKGROUND_CHECKS → OFFER_LETTER → HIRING → ONBOARDING
```

**8 Application Statuses:**
`PENDING → REVIEWING → SHORTLISTED → INTERVIEW → OFFERED → HIRED` (+ `REJECTED`, `WITHDRAWN`)

### 9.5 Job Management (`src/features/job-management/`)

```
job-management/
├── components/
│   ├── index.ts
│   ├── JobCard.tsx
│   ├── JobForm.tsx
│   └── JobList.tsx
├── hooks/
│   └── useJobManagement.ts    # useJobManagement, useJobMetrics
├── services/
│   └── jobService.ts          # CRUD + publish/close/delete/toggleFeatured
├── types/
│   └── index.ts               # JobWithRelations, JobSummary, CreateJobPayload, JobFilters
└── index.ts
```

**Job CRUD operations:**
- `getEmployerJobs(filters)` — `GET /companies/jobs`
- `getJob(jobId)` — `GET /jobs/:id`
- `createJob(payload)` — `POST /jobs`
- `updateJob(jobId, payload)` — `PATCH /jobs/:id`
- `publishJob`, `closeJob`, `deleteJob`, `toggleFeatured`

---

## 10. Component System

### shadcn/ui Primitives (26 files: 25 UI primitives + 1 route guard in `src/components/ui/`)

All built on Radix UI primitives + Tailwind + `cn()` utility:

| Component | Underlying Radix |
|---|---|
| `accordion` | `@radix-ui/react-accordion` |
| `badge` | — (pure CSS) |
| `button` | `@radix-ui/react-slot` + CVA |
| `card` | — (div-based) |
| `command` | `cmdk` |
| `dialog` | `@radix-ui/react-dialog` |
| `drawer` | `vaul` |
| `dropdown-menu` | `@radix-ui/react-dropdown-menu` |
| `form` | `react-hook-form` + `@radix-ui/react-label` |
| `input` | native `<input>` |
| `label` | `@radix-ui/react-label` |
| `logo` | custom SVG |
| `multiple-selector` | custom multi-select |
| `popover` | `@radix-ui/react-popover` |
| `progress` | `@radix-ui/react-progress` |
| `resizable` | `react-resizable-panels` |
| `scroll-split-card` | custom |
| `select` | `@radix-ui/react-select` |
| `separator` | `@radix-ui/react-separator` |
| `skeleton` | — (pure CSS pulse) |
| `sonner` | `sonner` |
| `switch` | `@radix-ui/react-switch` |
| `tabs` | `@radix-ui/react-tabs` |
| `textarea` | native `<textarea>` |
| `tooltip` | `@radix-ui/react-tooltip` |
| `ProtectedRoute` | route guard (not a UI primitive) |

### Layout Components (`src/components/layout/`)

| Component | Purpose |
|---|---|
| `DashboardShell` | `flex h-screen` with Sidebar + header(Infobar) + `<Outlet />` |
| `Sidebar` | Role-aware sidebar links (applicantLinks / employerLinks) |
| `Infobar` | Top header: mobile menu toggle + notifications + profile |
| `Navbar` | Public site nav |
| `NavbarDropdown` | User menu dropdown |
| `PageShell` | Page wrapper |
| `Footer` | Site footer |

### Section Components (`src/components/sections/`)

- `about/` — HeroSection, MissionSection, ValuesSection, TeamSection, CTABanner
- `contact/` — ContactForm, InfoPanel, MapSection
- `home/` — HeroSection, HowItWorks, JobCategories, Testimonials, CTABanner
- `jobs/` — SaveJobButton

### Skeleton Components (`src/components/skeletons/`)

Loading placeholders: `ApplicationListSkeleton`, `DashboardSkeleton`, `JobListSkeleton`, `ProfileSkeleton`

### Global/Decorative Components (`src/components/global/`)

Animation and visual effects: `3d-card`, `connect-parallax`, `container-scroll-animation`, `custom-modal`, `email-verification-banner`, `infinite-moving-cards`, `lamp`, `mode-toggle`, `page-loader`, `preloader`, `sparkles`

---

## 11. Authentication Flow

```
1. App mounts → AuthProvider.useEffect → checkSession()
2. GET /auth/session
   ├─ Has email → fetchProfile(email) → GET /users/profile?email=...
   │   ├─ Returns user → setUser(), setStatus('authenticated')
   │   └─ Fails → setStatus('unauthenticated')
   └─ No email/error → setStatus('unauthenticated')

3. Login (AuthProvider.login):
   POST /auth/login { email, password, rememberMe? }
   → AuthResponse { success, user { email } }
   → fetchProfile(email) → setUser(), setStatus('authenticated')
   → Fallback: re-fetch session if login response lacks email

4. Register (AuthProvider.register):
   POST /auth/register { email, password, confirmPassword, firstName, lastName, role, phone? }
   → AuthResponse → fetchProfile → setUser()

5. Logout (AuthProvider.logout):
   POST /auth/logout → setUser(null), setStatus('unauthenticated')

6. Password Reset:
   POST /auth/reset-password { email } → returns message

7. Email Verification:
   GET /auth/verify-email?token=...

8. ProtectedRoute check (on each route render):
   status: 'loading' → spinner
   status: 'unauthenticated' → redirect /login
   requiredRole='employer' + !isEmployer → redirect /dashboard
   requiredRole='applicant' + isEmployer → redirect /employer/dashboard
```

**Session model:** Cookie-based (`withCredentials: true`). No JWT stored in localStorage. The backend sets an HTTP-only cookie on login.

**User identification:** Email-based queries throughout (`?email=...`). The `clerkId` field is a legacy naming artifact — `toUser()` in `AuthProvider.tsx:20-36` normalizes both `id` and `clerkId`.

---

## 12. Testing

### Playwright E2E

**Config:** `playwright.config.ts`
- Test directory: `./e2e`
- Sequential execution (`fullyParallel: false`, `workers: 1`)
- 60s timeout per test
- Retries: 2 on CI, 0 locally
- Tracing: on first retry

**Web servers (run in parallel):**
1. Vite dev server: `VITE_USE_JSON_DATA=false npm run dev` on `localhost:5173`
2. Backend: `npm run dev` on `localhost:4000` (cwd: `../../loft-api`)

**Test files:**
| File | Flow |
|---|---|
| `01-profile-image.spec.ts` | Profile image upload |
| `02-job-application.spec.ts` | Applicant applies to a job |
| `03-employer-sees-application.spec.ts` | Employer reviews applications |
| `04-messaging.spec.ts` | Inter-user messaging |

**Support files:**
- `global-setup.ts` — DB seeding, test user creation
- `global-teardown.ts` — Cleanup
- `auth.ts` — Shared authentication helpers
- `constants.ts` — Test URLs, credentials

**No unit tests exist.** No Vitest/Jest configuration. The only test infrastructure is Playwright E2E.

---

## 13. Deployment

### Vercel Config (`vercel.json`)

```json
{
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://loft-backend-cl1n.onrender.com/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**API proxy:** All `/api/*` requests are rewritten to `https://loft-backend-cl1n.onrender.com/api/$1` — the production backend on Render.

**SPA fallback:** All non-API routes serve `index.html` for client-side routing.

### Security Headers

| Header | Value |
|---|---|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-XSS-Protection` | `1; mode=block` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self'; connect-src 'self' https:; frame-src 'self'; media-src 'self'` |

---

## 14. Conventions

| Convention | Rule |
|---|---|
| **File naming** | PascalCase for components (`DashboardShell.tsx`), camelCase for hooks/libs (`apiHooks.ts`, `jsonService.ts`) |
| **Component export** | Named exports from feature `index.ts` barrel files; default exports for page components |
| **Type naming** | PascalCase interfaces/types (`User`, `JobSummary`, `CreateJobPayload`) |
| **Enum values** | UPPER_SNAKE_CASE for API-facing values (`FULL_TIME`, `PENDING`, `INTERVIEW`) |
| **Path alias** | `@/*` maps to `./src/*` (Vite alias + tsconfig paths) |
| **Styling** | Tailwind utility classes + `cn()` for conditional classes |
| **Animations** | Framer Motion with `useReducedMotion()` guard |
| **Forms** | React Hook Form + Zod schemas via `@hookform/resolvers` |
| **API pattern** | Named async functions in `lib/api.ts`, custom hooks in `lib/api-hooks.ts` |
| **Feature modules** | `features/{name}/` with `components/`, `hooks/`, `services/`, `types/`, `index.ts` barrel |
| **Data fetching** | `useState` + `useEffect` pattern (no SWR/React Query) |
| **Email-based queries** | Most API calls pass `?email=...` for user scoping |
| **Error handling** | try/catch with `setError(err.message)`, no error boundaries visible |
| **Logging** | `createLogger('context')` factory — structured JSON to console |
| **SSE** | `lib/sse.ts` — singleton EventSource to `/api/sse/subscribe` with listener map |

---

## 15. Known Gaps

| Gap | Details |
|---|---|
| **Billing API routes missing** | `GET /billing/subscription`, `GET /billing/usage`, `POST /billing/upgrade` are called by the frontend but **have no backend implementation**. The billing feature module is frontend-complete but non-functional. |
| **No unit tests** | Zero Vitest/Jest configuration. Only Playwright E2E tests exist (4 spec files). |
| **Duplicate dashboard hooks** | `src/lib/api-hooks.ts:useDashboardData` and `src/features/dashboard/hooks/useDashboardData.ts` are two separate implementations of similar logic. The lib version uses axios; the feature version uses native `fetch()`. |
| **clerkId naming legacy** | The `User` type has both `id` and `clerkId` fields (`types.ts:2-3`). The `toUser()` mapper (`AuthProvider.tsx:20-36`) normalizes them interchangeably. This suggests a migration from Clerk auth that wasn't fully completed. |
| **ModalProvider unused** | `ModalProvider` is defined in `providers/modal-provider.tsx` but **never mounted** in `App.tsx`. The `useModal` hook would throw if used. |
| **No error boundaries** | No React error boundary components. Failed renders will crash the entire app. |
| **Hardcoded backend URL** | `vercel.json` rewrites to `loft-backend-cl1n.onrender.com` — the Render free tier URL with cold start latency. |
| **Email-based auth queries** | Most endpoints identify users by `?email=...` query params rather than session tokens — potential security concern if email is guessable. |
| **No React Query / SWR** | Data fetching uses raw `useState` + `useEffect` with manual cache invalidation. No deduplication, background refetch, or optimistic updates. |
| **No form schema sharing** | Zod schemas in feature module types don't appear to be shared between frontend validation and the API layer. |
