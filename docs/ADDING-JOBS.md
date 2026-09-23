# Adding a Job to LoftCommunity

The site can serve jobs from two sources, selected by `VITE_USE_JSON_DATA` in `.env`:

- `VITE_USE_JSON_DATA=true` → **JSON mode** (PRIMARY/default): static data from `src/data/jobs.json` (used for the deployed Netlify demo).
- `VITE_USE_JSON_DATA=false` → **Backend mode** (secondary): live jobs from the Loft API (loft-backend + PostgreSQL/Prisma).

Both modes build on the same `Job` type.

JSON mode is the default: src/data/jobs.json is bundled into the frontend, so jobs show without a backend.

## 1. The `Job` type (`src/lib/types.ts`, lines 17–37)

| Field            | Type       | Required | JSON mode                                   | Backend (Prisma `Job`) |
|------------------|------------|----------|---------------------------------------------|------------------------|
| `id`             | `string`   | yes      | `"job-001"`… sequential                      | cuid (auto)            |
| `title`          | `string`   | yes      |                                             | yes                    |
| `company`        | `string`   | yes      |                                             | yes                    |
| `companyLogo`    | `string`   | no       | path to a locally-hosted file, e.g. `/logos/my-company.png` | `String?`              |
| `location`       | `string`   | yes      |                                             | yes                    |
| `remote`         | `boolean`  | no       | default `false`                             | `Boolean @default(false)` |
| `salaryMin`      | `number`   | no       |                                             | `Int?`                 |
| `salaryMax`      | `number`   | no       |                                             | `Int?`                 |
| `currency`       | `string`   | no       | default `"USD"`                             | `String @default("USD")` |
| `tags`           | `string[]` | no       | search keywords (matched on home/browse)    | `String[]`             |
| `category`       | `string`   | yes      | any value; dropdown options are derived from the data in JSON mode | yes |
| `seniority`      | `string`   | yes      | one of: `junior`, `mid`, `senior`, `lead`, `executive`, `expert` | yes |
| `description`    | `string`   | yes      | plain text or `\n`-separated paragraphs      | yes                    |
| `requirements`   | `string[]` | no       |                                             | `String[]`             |
| `responsibilities`| `string[]`| no       |                                             | `String[]`             |
| `postedDate`     | `string`   | no       | ISO date `"YYYY-MM-DD"`                     | `DateTime @default(now())` |
| `expiresAt`      | `string`   | no       | optional                                    | `DateTime?` (auto +14 days on POST) |
| `featured`       | `boolean`  | no       | pinned to home page featured list           | `Boolean @default(false)` |
| `source`         | `string`   | no       | `'json'` (no Prisma equivalent)             | —                     |

`id`, `postedDate`, and `expiresAt` are added by the backend in API mode — do not send them.

## 2. JSON mode (quickest way to publish a job)

Edit `src/data/jobs.json`. Top level is `{ "jobs": [ ... ] }` — 30 entries (`job-001`…`job-030`). Add a new object with the next id and your fields:

```json
{
  "id": "job-031",
  "title": "Frontend Engineer",
  "company": "Acme Inc.",
  "companyLogo": "/logos/acme-inc.png",
  "location": "Remote",
  "remote": true,
  "salaryMin": 110000,
  "salaryMax": 150000,
  "currency": "USD",
  "tags": ["React", "TypeScript", "Tailwind"],
  "category": "Engineering",
  "seniority": "mid",
  "description": "Ship features for the Acme web app...",
  "requirements": ["2+ years with React", "TypeScript fluency"],
  "responsibilities": ["Build UI features", "Review PRs"],
  "postedDate": "2026-09-23",
  "featured": false
}
```

Validation to match the app's filters (see `json-service.ts` → `matchJob`):

- `category` — in JSON mode the dropdown options are **derived from the dataset**, so any value you use will appear in the filter automatically. Use a sensible label (Engineering, Design, Product, Data, DevOps, …).
- `seniority` — same: options are derived from the data in JSON mode (`junior | mid | senior | …`).
- The home/browse search matches against `title`, `company`, `tags`, `category`, `seniority`, and `location` (case-insensitive).
- `remote: true` is required for it to show under the "Remote only" toggle.
- `featured: true` appears on the home page featured grid; `featured: false` keeps it in the general listings.

## 3. Backend mode (live API)

`POST /api/jobs` (requires an authenticated employer session — `Authorization: Bearer <token>`).

Required: `title`, `company`, `location`, `category`, `seniority`, `description`.

Optional: `companyLogo`, `remote`, `salaryMin`, `salaryMax`, `currency`, `tags`, `requirements`, `responsibilities`, `featured`.

Auto-set: `employerId` (from the session), `expiresAt` (+14 days), `postedDate`/`createdAt` (now), `currency` ("USD"), `remote`/`featured` (false), empty arrays for tags/requirements.

Edits use `PATCH /api/jobs/:id` with only the fields to change (see `loft-backend/src/routes/jobs.ts`).

## 4. Where the job appears

- `/jobs` browse page — listing, search, location, category, seniority filters, sort.
- Home page hero search — matches the same fields as browse.

## 4b. Company logos

Logos are hosted locally in `public/logos/` and referenced as relative paths (`/logos/<slug>.<ext>`). To fetch a logo for a new company, run the pipeline used for the current set:

1. `curl -sL "https://logos.hunter.io/<domain>"` — keyless hunter.io logo CDN (real companies). If it 404s, fall back to `https://www.google.com/s2/favicons?domain=<domain>&sz=128`.
2. Save the image to `public/logos/<slug>.<ext>` (`<slug>` = company name normalized to lowercase, spaces → `-`).
3. Set `companyLogo` to `/logos/<slug>.<ext>` in `jobs.json`.
- `featured: true` → home page featured section.
- Company/employer pages via the API in backend mode.

## 5. Verify

JSON mode: add the entry, run `npm run build` (or `bun run build`), open the `/jobs` page and your new job's detail view, test search/filters.

Backend mode: `POST /api/jobs` from an employer account, then confirm it appears in `GET /api/jobs` and on the site.