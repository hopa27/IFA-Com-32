# IFA Bacs Commission

A modern web recreation of the legacy "IFA Bacs Commission" Windows desktop tool — a financial back-office BACS commission calculator. Users select a date range and pay date, run a commission calculation, and review the resulting commission report in a data grid.

## Run & Operate

- `pnpm --filter @workspace/ifa-bacs-commission run dev` — run the web app (Vite)
- `pnpm --filter @workspace/ifa-bacs-commission run typecheck` — typecheck the web app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS (frontend-only, no backend by design)
- Routing: wouter
- Dates: date-fns
- Icons: Material Design icons via `react-icons/md` (per design system spec)

## Where things live

- `artifacts/ifa-bacs-commission/` — the web app
  - `src/pages/Home.tsx` — main commission calculator (date inputs + Calc/GO!! + results grid)
  - `src/pages/Components.tsx` — LVE component library styleguide
  - `src/pages/not-found.tsx` — 404 page (uses Header/Footer layout)
  - `src/components/layout/` — Header, Footer, Logo (custom SVG wordmark)
  - `src/components/ui/` — design system components (button, date-picker, calendar, data-grid, etc.)
  - `src/index.css` — LVE design tokens (colors, fonts Livvic/Mulish, --radius 30px)

## Architecture decisions

- **Design system is verbatim/mandatory.** The client supplied an explicit "LVE Component Library & Design System" spec — exact colors, fonts (Livvic/Mulish), --radius 30px, Material Design icons. This overrides default styling judgment.
- **Logo is a hand-written SVG wordmark** (`src/components/layout/Logo.tsx`), not an AI-generated or raster image — AI text rendering was unreliable. Supports `variant="light"|"dark"`.
- **Custom 3-view Calendar** (`src/components/ui/calendar.tsx`) — days/months/years views with clickable month/year captions, built on date-fns (not react-day-picker) to match the spec's interaction model.
- **Frontend-only with local sample data.** No backend was requested; the calc flow derives results from `SAMPLE_DATA` and applies the selected pay date.

## Product

- Select Start Date, End Date, and Pay Date via custom date pickers.
- Click "Calc" or "GO!!" to generate a BACS commission report rendered in a sortable data grid (adviser, agency, BACS ref, pay date, gross, commission %, commission amount, status).
- A `/components` route showcases the full LVE component library.

## User preferences

- Follow the supplied LVE design system exactly — do not substitute colors, fonts, or icon sets.

## Gotchas

- Use `react-icons/md` (Material Design) for icons, not lucide — the spec mandates it. (Unused scaffold UI components may still reference lucide.)
- Parse stored ISO date strings with `parseISO` (not `new Date(str)`) to avoid timezone off-by-one display bugs.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
