# educator

A Next.js (App Router) + Sanity prototype for an educator's personal website.
Early scaffold — basic pages (home, despre mine, calendar, FAQ) wired to a
Sanity Studio; we'll iterate.

## Stack

- Next.js 16 / React 19 (App Router, TypeScript)
- Sanity v5 (project `hn56l1ht`, dataset `production`), Studio mounted at `/studio`
- SCSS (`sass`) — co-located component styles, partials under `app/styles`

## Getting started

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Sanity Studio: http://localhost:3000/studio

Fill in the **Setări website** singleton (title, subtitle, contact, social) in
the Studio, add a few **Evenimente**, then reload the site.

## Structure

- `app/(site)/` — public website (route group with shared layout + global SCSS)
  - `page.tsx` — home (Acasă)
  - `about/` — Despre mine
  - `calendar/` — Calendar
  - `faq/` — Întrebări frecvente
- `app/(studio)/` — Sanity Studio route group (no website styles leak in)
- `app/components/` — shared UI components
- `sanity/` — client + GROQ queries + Studio desk structure
- `schemaTypes/` — Sanity schema (`general-info` singleton, `event`)
- `types/` — shared TypeScript types

## Env

`.env.local` holds `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
The dataset is public, so reads need no token.
