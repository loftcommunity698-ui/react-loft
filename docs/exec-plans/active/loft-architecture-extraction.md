# ExecPlan: Loft Community — Bug Fixes + Architecture Extraction

## Purpose / Big Picture

Fix known bugs in the react-loft frontend and loft-backend codebases, then produce comprehensive architecture documentation for both projects. After this work, both codebases compile cleanly and have complete reference specs in `docs/superpowers/specs/` that capture every architectural decision, pattern, and convention — enabling anyone to understand, onboard, or rebuild similar projects.

## Progress

- [ ] ( ) Task 1: Fix react-loft bugs (next-env.d.ts, package-lock.json)
- [ ] ( ) Task 2: Fix loft-backend bugs (env.ts, payment.ts)
- [ ] ( ) Task 3: Verify both projects compile clean
- [ ] ( ) Task 4: Extract react-loft frontend spec
- [ ] ( ) Task 5: Extract react-loft design system spec
- [ ] ( ) Task 6: Extract loft-backend backend spec
- [ ] ( ) Task 7: Extract loft-backend data model spec
- [ ] ( ) Task 8: Cross-reference and verify all docs

## Surprises & Discoveries

(none yet)

## Decision Log

- Billing route gap: documented in backend spec, not implemented (per user request)
- Package manager: standardize on Bun (remove package-lock.json)
- Billing API routes (`/billing/subscription`, `/billing/usage`, `/billing/upgrade`) have no backend implementation — frontend will 404 on these endpoints

## Context and Orientation

### Projects

| Project | Path | Tech Stack |
|---------|------|------------|
| react-loft | `/home/jacobp/Desktop/Projecs/react-loft` | React 18, Vite 6, TypeScript 5, Tailwind 3, shadcn/ui, React Router 7, Framer Motion |
| loft-backend | `/home/jacobp/Desktop/Projecs/loft-backend` | Express 4, TypeScript 5, Prisma 5 (PostgreSQL), JWT auth, Stripe, Resend email |

### Known Bugs to Fix

1. **`next-env.d.ts`** in react-loft root — leftover from prior Next.js setup, references `next/image-types/global`
2. **`package-lock.json`** in react-loft — dual lockfile situation, standardize on bun.lock
3. **`NEXTAUTH_URL` fallback** in `loft-backend/src/config/env.ts:7` — no longer uses NextAuth
4. **Stripe API version** in `loft-backend/src/routes/payment.ts:10` — uses `2023-10-16`, should be `2024-12-18.acacia`

### Architecture Docs to Produce

| File | Location | Covers |
|------|----------|--------|
| `loftcommunity-frontend-spec.md` | `react-loft/docs/superpowers/specs/` | React/Vite architecture, routing, state, auth, data fetching, feature modules |
| `loftcommunity-design-system.md` | `react-loft/docs/superpowers/specs/` | Tailwind/shadcn theme, CSS variables, component library, animations, dark mode |
| `loftcommunity-backend-spec.md` | `loft-backend/docs/superpowers/specs/` | Express API, routes, middleware, auth, rate limiting, SSE, error handling |
| `loftcommunity-data-model.md` | `loft-backend/docs/superpowers/specs/` | Prisma schema, 30+ models, relationships, enums, indexes |

## Plan of Work

### Task 1: Fix react-loft bugs

**Goal:** Remove dead files that confuse the codebase.

**Work:**
- Delete `/home/jacobp/Desktop/Projecs/react-loft/next-env.d.ts` (leftover Next.js type reference)
- Delete `/home/jacobp/Desktop/Projecs/react-loft/package-lock.json` (keep only bun.lock)

**Proof:** `ls react-loft/next-env.d.ts` fails; `ls react-loft/package-lock.json` fails; `ls react-loft/bun.lock` succeeds.

### Task 2: Fix loft-backend bugs

**Goal:** Clean up stale config references and update outdated dependencies.

**Work:**
- Edit `loft-backend/src/config/env.ts:7`: change `process.env.NEXTAUTH_URL` fallback to just use `process.env.FRONTEND_URL`
- Edit `loft-backend/src/routes/payment.ts:10`: update Stripe API version from `2023-10-16` to `2024-12-18.acacia`

**Proof:** `grep -n NEXTAUTH loft-backend/src/config/env.ts` returns no results; `grep -n 2023-10-16 loft-backend/src/routes/payment.ts` returns no results.

### Task 3: Verify both projects compile clean

**Goal:** Confirm no TypeScript errors remain after fixes.

**Work:**
- Run `npx tsc --noEmit` in react-loft
- Run `npx tsc --noEmit` in loft-backend
- Fix any errors found

**Proof:** Both commands exit with code 0 and no error output.

### Task 4: Extract react-loft frontend spec

**Goal:** Produce a comprehensive frontend architecture reference document.

**Work:** Read all source files in react-loft/src/ and produce `loftcommunity-frontend-spec.md` covering:
- Tech stack with versions
- Directory structure with annotations
- Entry points and provider hierarchy
- Routing setup (all 36+ routes with roles)
- State management (AuthProvider, ModalProvider, custom hooks)
- API integration pattern (axios instance, api-hooks, json-service hybrid)
- Feature module architecture (auth, billing, dashboard, hiring-workflow, job-management)
- Component system (shadcn/ui, layout, sections, skeletons)
- Testing setup (Playwright E2E)
- Deployment (Vercel config, proxy setup)
- Key conventions and anti-patterns

### Task 5: Extract react-loft design system spec

**Goal:** Document the visual design system and theming approach.

**Work:** Read tailwind.config.ts, globals.css, and UI components to produce `loftcommunity-design-system.md` covering:
- Color tokens (CSS variables in HSL)
- Typography system
- Spacing and layout conventions
- Component library (26 shadcn/ui components)
- Animation rules (Framer Motion, CSS keyframes)
- Dark mode strategy (class-based, dark-only)
- Custom utility classes (.glass, .text-gradient, etc.)
- Icon system (lucide-react)

### Task 6: Extract loft-backend backend spec

**Goal:** Produce a comprehensive backend API reference document.

**Work:** Read all source files in loft-backend/src/ and produce `loftcommunity-backend-spec.md` covering:
- Tech stack with versions
- Directory structure with annotations
- Express app setup and middleware chain
- Authentication flow (JWT, cookies, OAuth)
- All API endpoints (grouped by domain)
- Rate limiting strategy (database-backed)
- SSE real-time system
- Email system (Resend)
- Error handling pattern
- Key conventions and anti-patterns
- Known gaps (billing routes)

### Task 7: Extract loft-backend data model spec

**Goal:** Document the complete database schema.

**Work:** Read prisma/schema.prisma and produce `loftcommunity-data-model.md` covering:
- All 30+ models with fields and types
- Relationships and cascade rules
- Index strategy
- All enums (21+)
- Key design decisions (clerkId naming, single-tenant company, etc.)

### Task 8: Cross-reference and verify

**Goal:** Ensure all documentation is consistent and accurate.

**Work:**
- Verify frontend API calls match backend route definitions
- Verify shared types are consistent between frontend and backend docs
- Verify auth flow is documented consistently in both frontend and backend specs
- Run final `tsc --noEmit` on both projects

## Validation and Acceptance

1. `ls react-loft/next-env.d.ts` → file not found
2. `ls react-loft/package-lock.json` → file not found
3. `grep -n NEXTAUTH loft-backend/src/config/env.ts` → no results
4. `grep -n 2023-10-16 loft-backend/src/routes/payment.ts` → no results
5. `cd react-loft && npx tsc --noEmit` → exit 0
6. `cd loft-backend && npx tsc --noEmit` → exit 0
7. `ls react-loft/docs/superpowers/specs/loftcommunity-frontend-spec.md` → exists
8. `ls react-loft/docs/superpowers/specs/loftcommunity-design-system.md` → exists
9. `ls loft-backend/docs/superpowers/specs/loftcommunity-backend-spec.md` → exists
10. `ls loft-backend/docs/superpowers/specs/loftcommunity-data-model.md` → exists

## Idempotence and Recovery

- All file deletions are safe (git-tracked, can be恢复 with `git checkout`)
- All edits are small and reversible
- Architecture docs are new files, no existing content overwritten
- If any task fails, previous tasks' changes remain valid
