---
name: LVE design system
description: Constraints for the IFA Bacs Commission app's mandatory client design system.
---

The IFA Bacs Commission app must follow the supplied "LVE Component Library & Design System" exactly.

**Why:** The client provided an explicit spec (exact colors, fonts Livvic/Mulish, --radius 30px, Material Design icons). This is a contractual requirement, not a styling preference, so it overrides the usual "don't dictate colors/fonts" judgment.

**How to apply:**
- Icons: use `react-icons/md` (Material Design) only — never lucide. Unused scaffold UI components may still import lucide; only files actually rendered by the app pages matter.
- Logo is a hand-written SVG wordmark (`src/components/layout/Logo.tsx`), not a raster/AI image — AI text rendering was unreliable. `variant="light"|"dark"`.
- Calendar is a custom 3-view (days/months/years) component built on date-fns, not react-day-picker, to match the spec's clickable month/year caption interaction.
- App is frontend-only with local SAMPLE_DATA; no backend was requested.
- Parse stored ISO date strings with `parseISO`, not `new Date(str)`, to avoid timezone off-by-one display bugs.
