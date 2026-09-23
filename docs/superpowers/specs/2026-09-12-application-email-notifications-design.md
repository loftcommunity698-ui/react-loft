# Application Email-First Notifications + Contact Email Design

Date: 2026-09-12
Status: Approved (scope in `changes.md`)

## Summary

Make email the primary communication channel for job applications, keep the
in-app notification bell fast and real-time via SSE, add an optional
"How can we contact you?" contact email to the apply form, remove the
messaging feature (UI and backend), and strip the social icon links from the
footer and team section.

## Decisions

- Full-stack: persist `contactEmail` on `JobApplication`, send confirmation
  email to it (falling back to the registration email).
- Messages removed from UI and backend routes/templates; notifications and the
  `newMessages` preference toggle and `MESSAGE` notification type kept.
- SSE experience: the bell refetches live AND a `toast.success` shows the
  `new_notification` payload when an SSE event arrives.
- Social icon links removed from `Footer` and `TeamSection` (they were all
  placeholder `#` hrefs).

## Part A - Application flow

- Frontend `ApplyJobModal`: "How can we contact you?" radio group defaulting to
  the registration email, with an alternate-email input. Payload gains
  `contactEmail`.
- Backend apply route reads/validates/persists `contactEmail`; confirmation
  email and applicant notification/SSE use it when provided.
- Copy: "submitted and will be reviewed; we will reach you via email."
- SSE `new_notification` now drives a live toast in addition to the bell.

## Part B - Messages removal

- Frontend: delete `pages/Messages.tsx` + route; remove Messages from
  sidebar/navbar/dropdown/constants; remove message stat card and quick action
  from `Dashboard`; remove message buttons from `JobCandidates` and
  `AdminApplicationDetail`; remove `useConversations`, `sendMessage`,
  `Message`/`Conversation` types, and the `/messages` read in `useDashboardData`;
  de-message `Guide`/`Privacy` copy; delete `e2e/04-messaging.spec.ts`.
- Backend: delete `routes/messages.ts`, unmount `/api/messages`, remove the
  `newMessage` email template. `Message` DB table kept (no destructive migration).

## Part C - Social icons

- `Footer.tsx`: remove `socialLinks` array, render block, icon imports.
- `TeamSection.tsx`: remove the LinkedIn/Twitter link block and imports.

## Files

Frontend (react-loft):
- `src/components/modals/ApplyJobModal.tsx`
- `src/pages/JobDetail.tsx`
- `src/lib/api-hooks.ts`
- `src/lib/api.ts`
- `src/lib/types.ts`
- `src/components/layout/Footer.tsx`
- `src/components/sections/about/TeamSection.tsx`
- `src/pages/Messages.tsx` (delete)
- `src/App.tsx`
- `src/lib/sidebar-constants.ts`, `src/lib/constant.ts`
- `src/components/layout/Navbar.tsx`, `NavbarDropdown.tsx`
- `src/pages/Dashboard.tsx`, `JobCandidates.tsx`, `AdminApplicationDetail.tsx`, `Guide.tsx`, `Privacy.tsx`
- `e2e/04-messaging.spec.ts` (delete)

Backend (loft-backend):
- `prisma/schema.prisma` (+ migration)
- `src/routes/jobs.ts`
- `src/routes/messages.ts` (delete)
- `src/app.ts`
- `src/lib/email.ts`

## Verification

- Backend: `npm test`, `npm run build`, `prisma migrate dev`.
- Frontend: `npm test`, `npm run build`; e2e job-application spec keeps the
  "Application submitted" toast; messaging e2e spec removed.