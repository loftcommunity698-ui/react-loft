# LoftCommunity Frontend

React single-page application for the LoftCommunity job board platform. Lets job seekers browse and apply to jobs, and employers post jobs and manage candidates — with role-based access for both.

## Tech Stack

- **React 18** + TypeScript
- **Vite 6** (build tool)
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **Framer Motion** (animations)
- **React Router 7** (client routing)
- **React Hook Form** + **Zod** (forms and validation)
- **UploadThing** (file uploads)
- **Vitest** (unit tests) + **Playwright** (E2E tests)

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Bun](https://bun.sh) (package manager)

## Setup

```bash
# 1. Clone and install dependencies
git clone <repo-url> react-loft
cd react-loft
bun install

# 2. Copy the environment template
cp .env.example .env
```

Environment variables:

| Variable             | Default              | Description                                   |
| -------------------- | -------------------- | --------------------------------------------- |
| `VITE_USE_JSON_DATA` | `false`              | `true` = use bundled JSON mock data (no backend needed) |
| `VITE_BACKEND_URL`   | `http://localhost:4000` | Backend API base URL                      |

```bash
# 3. Start the dev server (default: http://localhost:5173)
bun run dev
```

To run with mock data only (no backend), set `VITE_USE_JSON_DATA=true` in `.env`.

## Scripts

| Script              | Description                                    |
| ------------------- | ---------------------------------------------- |
| `bun run dev`       | Start the Vite dev server on port 5173        |
| `bun run dev:all`   | Run backend and frontend concurrently         |
| `bun run build`     | Type-check and build for production (`dist/`) |
| `bun run preview`   | Preview the production build                  |
| `bun run lint`      | ESLint over TS/TSX files                      |
| `bun run test`      | Run unit tests (Vitest)                       |
| `bun run test:watch`| Run unit tests in watch mode                  |
| `bun run test:e2e`  | Run Playwright E2E tests                      |

## Architecture

- **Hybrid JSON/API mode** — `VITE_USE_JSON_DATA` toggles between bundled JSON mock data (offline-friendly) and the live backend via `VITE_BACKEND_URL`. The Vite dev server also proxies `/api` to the backend.
- **Feature-based folder structure** — `src/features/` holds feature modules (`billing`, `dashboard`, `job-management`, `hiring-workflow`) alongside cross-cutting `src/lib`, `src/pages`, `src/components`, and `src/data`.
- **Role-based access** — separate dashboards and flows for **Job Seekers** (apply, track applications, saved jobs, profile) and **Employers** (post/manage jobs, review candidates, hiring workflow), plus an admin console.

## Key Pages

- **Auth:** Login, Register, Forgot/Reset Password, Verify Email, Onboarding
- **Browse:** Home, Browse Jobs, Job Detail, Saved Jobs
- **Seeker:** Dashboard, Applications, Application Detail, Profile, Settings, Notifications, Messages
- **Employer:** Employer Dashboard, Create/Edit Job, Job Candidates, Hiring Workflow, Company Profile
- **Billing & Admin:** Billing, Admin (employers, applications, settings)
- **Static:** About, FAQ, Guide, Contact, Privacy, Terms

## Deployment

Deployed as a static SPA on [Vercel](https://vercel.com) (`vercel.json` provided). Key points:

- `npm run build` produces the `dist/` output directory
- `/api/*` requests are rewritten to the Render-hosted backend (`https://loft-backend-cl1n.onrender.com/api/$1`)
- SPA rewrites route all other paths to `index.html`
- Security headers (CSP, HSTS, X-Frame-Options) are set via `vercel.json`

## Testing

- **Vitest** for unit and component tests (`bun run test`)
- **Playwright** for end-to-end browser tests (`bun run test:e2e`)