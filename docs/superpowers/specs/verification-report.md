# Architecture Spec Verification Report

> Cross-referencing verification — 2026-07-23.

## Summary

**FAIL** — 8 issues found across the 4 spec documents.

---

## Issues Found

### 1. Data Model Spec: Model Count Overstated

- **Document**: `loftcommunity-data-model.md`
- **Section**: §1 Overview
- **Issue**: States "25 models" but the schema contains **28 models**.
- **Expected**: `grep -c "^model " schema.prisma` → **28**. The 28 models are: Account, Session, VerificationToken, User, UserProfile, Education, WorkExperience, LanguageSkill, Resume, EmployerProfile, Company, CompanyMember, Job, JobCategory, JobApplication, Interview, SavedJob, EnglishTestQuestion, EnglishTestResult, Notification, Skill, UserSkill, JobRequiredSkill, Message, Report, NotificationPreference, RateLimit, CacheEntry.
- **Fix**: Change "25 models" to "28 models" in the overview.

### 2. Data Model Spec: Enum Count Overstated

- **Document**: `loftcommunity-data-model.md`
- **Section**: §1 Overview
- **Issue**: States "16 enums" but the schema contains **21 enums**.
- **Expected**: `grep -c "^enum " schema.prisma` → **21**. The 21 enums are: CompanyRole, EnglishLevel, LanguageProficiency, QuestionType, QuestionDifficulty, TestCategory, TestType, NotificationType, JobType, ExperienceLevel, WorkMode, JobStatus, ApplicationStatus, InterviewType, InterviewStatus, CompanySize, HiringMode, AvailabilityType, SalaryPeriod, SkillLevel, ReportStatus.
- **Fix**: Change "16 enums" to "21 enums" in the overview.

### 3. Backend Spec: Model Count Overstated

- **Document**: `loftcommunity-backend-spec.md`
- **Section**: §3 Code Structure (schema.prisma comment) and §13 Schema Overview
- **Issue**: Both locations state "30 models" but the schema contains **28 models**.
- **Expected**: Actual count is 28 (same list as above).
- **Fix**: Change "30 models" to "28 models" in both locations.

### 4. Backend Spec: Enum Count Understated

- **Document**: `loftcommunity-backend-spec.md`
- **Section**: §13 Schema Overview
- **Issue**: Lists only **10 enums** in the Key Enums table, but the schema contains **21 enums**. Missing: CompanyRole, EnglishLevel, LanguageProficiency, QuestionType, QuestionDifficulty, TestCategory, TestType, NotificationType, HiringMode, AvailabilityType, SalaryPeriod, SkillLevel, ReportStatus (13 enums omitted).
- **Expected**: Full table of 21 enums as documented in the data model spec §5.
- **Fix**: Add the 13 missing enums to the Key Enums table, or change the section title to clarify it shows only "selected" enums.

### 5. Frontend Spec: Toaster Dark Theme Not Documented

- **Document**: `loftcommunity-frontend-spec.md`
- **Section**: §4 Entry Points (Toaster description) and §10 Component System (Sonner section)
- **Issue**: The Toaster in `App.tsx` is configured with explicit dark theme styling (`background: '#1a1a1a'`, `color: '#fff'`, `border: '1px solid rgba(255,255,255,0.1)'`). The spec mentions `position: top-center, dark theme` in the entry points tree but does not document the actual inline `toastOptions.style` values.
- **Expected**: Document the specific `toastOptions.style` configuration from `App.tsx:98-106`.
- **Fix**: Add the `toastOptions` style object to the Toaster description or to §10 Sonner component section.

### 6. Frontend Spec: File Name Mismatch in Code Structure

- **Document**: `loftcommunity-frontend-spec.md`
- **Section**: §3 Code Structure (directory tree)
- **Issue**: Lists `tailwind.config.js` in the tree but the actual file is **`tailwind.config.ts`**.
- **Expected**: `tailwind.config.ts` (TypeScript file, as confirmed by file system).
- **Fix**: Change `tailwind.config.js` to `tailwind.config.ts` in the directory tree.

### 7. Cross-Document: Backend Spec Auth Endpoint Table Missing `/session`

- **Document**: `loftcommunity-backend-spec.md`
- **Section**: §7 API Endpoints — Auth (`/api/auth`) table
- **Issue**: The auth endpoint table lists 9 endpoints but is **missing `GET /session`**. The `/session` endpoint exists in `routes/auth.ts:412-422` and is called by the frontend (`GET /auth/session`). It is mentioned in the code structure comment but absent from the endpoint reference table.
- **Expected**: Add `GET /session | Optional | Session check for frontend (returns user email or null) | No` to the Auth endpoint table.
- **Fix**: Add the missing row to the auth endpoints table.

### 8. Frontend Spec: UI Component Count Nuance

- **Document**: `loftcommunity-frontend-spec.md`
- **Section**: §3 Code Structure (comment "26 files") and §10 Component System ("26 files in src/components/ui/")
- **Issue**: The count of **26 files** is numerically correct (verified via `ls`). However, `ProtectedRoute.tsx` is listed as a shadcn/ui primitive in §10's component table but is actually a **route guard** component, not a UI primitive. The spec itself notes this in §10 ("route guard (not a UI primitive)"), creating a minor inconsistency with the "26 files" label implying all are UI primitives.
- **Expected**: Either note that 25 are UI primitives +1 route guard, or clarify the "26 files" count includes the non-primitive.
- **Fix**: Minor — add a parenthetical like "(25 UI primitives + 1 route guard)" to the count.

---

## Verified As Correct

### Frontend Spec (`loftcommunity-frontend-spec.md`)

- **Route count**: 36 routes in the spec table matches 36 routes in `App.tsx` (13 public + 22 protected + 1 catch-all). **PASS**.
- **Page component count**: 36 pages listed matches `ls src/pages/ | wc -l` → 36. **PASS**.
- **Tech Stack versions**: All 40 dependency versions in `package.json` match the spec table. **PASS** (with note: spec table has 41 rows due to grouping `@types/react` + `@types/react-dom` into one row while listing `@types/node` separately — total is 40 in package.json).
- **API base path**: `/api` prefix matches both frontend axios config and backend route mounting. **PASS**.
- **Auth flow**: Session check flow (`GET /auth/session` → `GET /users/profile?email=`) matches both frontend `AuthProvider` and backend `routes/auth.ts`. **PASS**.
- **API functions**: All named API functions in §7 match the documented categories. **PASS**.
- **Feature modules**: All 5 feature modules (auth, billing, dashboard, hiring-workflow, job-management) match the directory structure. **PASS**.
- **UI component list**: All 26 files in `src/components/ui/` are correctly named. **PASS**.
- **Provider hierarchy**: AuthProvider → VisitorCounter → ScrollToTop → AnimatePresence → Routes matches `App.tsx`. **PASS**.
- **ModalProvider not mounted**: Confirmed — defined in `providers/modal-provider.tsx` but not imported in `App.tsx`. **PASS**.
- **Layout components**: All 7 layout components match the actual files. **PASS**.

### Design System Spec (`loftcommunity-design-system.md`)

- **CSS variables**: All 20 custom properties in `globals.css` match the spec table exactly (token names, HSL values, usage descriptions). **PASS**.
- **Tailwind color extensions**: All color mappings in `tailwind.config.ts` match the spec table. **PASS**.
- **Border radius tokens**: `--radius: 0.5rem`, `md: calc(var(--radius) - 2px)`, `sm: calc(var(--radius) - 4px)` match exactly. **PASS**.
- **Keyframes**: `scroll`, `spotlight`, `accordion-down`, `accordion-up` all match `tailwind.config.ts`. **PASS**.
- **Animations**: `scroll`, `accordion-down`, `accordion-up` all match. **PASS**.
- **Container config**: `center: true, padding: '1rem'` with screen breakpoints matches. **PASS**.
- **Dark mode config**: `darkMode: ['class']` matches. **PASS**.
- **Utility classes**: All 6 custom utility classes (`.glass`, `.glass-hover`, `.text-gradient`, `.section-padding`, `.section-title`, `.section-subtitle`) match `globals.css`. **PASS**.
- **Global base styles**: `border-border`, `bg-background text-foreground`, `font-family: system-ui` all match. **PASS**.
- **Focus visible ring**: `ring-emerald-400 ring-offset-2` matches. **PASS**.
- **Component count**: 26 UI files, 7 layout files, 11 global files, 4 skeleton files — all match. **PASS**.

### Backend Spec (`loftcommunity-backend-spec.md`)

- **Route file count**: 16 route files listed in code structure matches the actual files in `src/routes/`. **PASS**.
- **Route mounts**: 17 route groups mounted in `index.ts` (16 always + 1 dev-only) matches the spec table. **PASS**.
- **Middleware chain order**: cors → helmet → cookieParser → express.json → routes → errorHandler matches `index.ts`. **PASS**.
- **Endpoint counts per route group**: Auth (9), Health (1), Jobs (9), Applications (6), Users (11), Notifications (4), Companies (3), Admin (11), Messages (3), Skills (1), Interviews (1), Payment (2), Contact (1), UploadThing (1), SSE (1), Stats (2), Test (2) — all match the actual route definitions. **PASS**.
- **Auth endpoint paths**: `/register`, `/login`, `/logout`, `/me`, `/oauth`, `/verify-email` (GET+POST), `/reset-password`, `/update-password`, `/session` all exist in `routes/auth.ts`. **PASS** (except `/session` missing from endpoint table — see Issue #7).
- **Rate limit configurations**: 5 rate limits documented match the actual implementation. **PASS**.
- **SSE connection flow**: Correctly describes the SSE subscription process. **PASS**.
- **Error handling patterns**: Match the actual implementation. **PASS**.

### Data Model Spec (`loftcommunity-data-model.md`)

- **All 28 model field definitions**: Verified against `schema.prisma` — field names, types, attributes, and defaults all match. **PASS**.
- **All 21 enum value lists**: Every enum and its values match the schema exactly. **PASS**.
- **All relationships**: Foreign key references, cascade rules, and relation names match the schema. **PASS**.
- **Unique constraints**: All `@unique` and `@@unique` annotations match. **PASS**.
- **Index strategy**: All `@@index` annotations match. **PASS**.
- **Default values**: All documented defaults match the schema. **PASS**.
- **Design decisions**: All 10 key design decisions are accurate reflections of the schema. **PASS**.
