# IFA Bacs Commission — Screen Flow (ASCII)

This document captures every screen, popover, and notification in the IFA
Bacs Commission web app, plus the navigation paths between them. The app is a
modern recreation of a legacy Windows desktop BACS commission calculator and
is intended to be rebuilt with **Angular** (standalone components + signals).

Legend: `[ Button ]`, `[ field ]`, `[v]` = dropdown / picker, `(•)` radio,
`[x]` checkbox, `📅` = calendar trigger.

---

## 1. Application Shell (always visible)

```
+------------------------------------------------------------------------------------------------+
| [LV=] | IFA Bacs Commission                                                        [ Logout ]  |
+------------------------------------------------------------------------------------------------+
|                                                                                                |
|                              <<< ACTIVE ROUTE CONTENT >>>                                       |
|                                                                                                |
+------------------------------------------------------------------------------------------------+
| [LV=]                                              LVE Financial Services Ltd                   |
|                                                    123 Corporate Square, London, UK            |
+------------------------------------------------------------------------------------------------+
```

* **Header** — navy (`#00263e`) bar. Left: `LV=` logo (links to `/`) │ vertical
  divider │ page title (Livvic, white). Right: **Logout** ghost button
  (white text, hover white/10 tint).
* **Page title is route-driven:**
  * `/`            → "IFA Bacs Commission"
  * `/components`  → "Component Library"
* **Footer** — white bar, top border. Left: `LV=` logo (dark variant).
  Right: *LVE Financial Services Ltd / 123 Corporate Square, London, UK*.
* The whole document renders at `zoom: 0.8`; page wrappers use `min-h-[125vh]`
  so the footer always sits at the bottom of the viewport.

---

## 2. Routes / Screens

The app is a small single-page application with three routes (wouter today;
Angular `RouterModule` on rebuild).

| Path           | Screen              | Notes                          |
| -------------- | ------------------- | ------------------------------ |
| `/`            | Commission Run      | Primary calculator screen      |
| `/components`  | Component Library   | LVE design-system styleguide   |
| `*` (fallback) | 404 — Page Not Found | Any unmatched route            |

---

### 2A. Commission Run (`/`) — Home

```
+------------------------------------------------------------------------------------------------+
| Calculate Commission Run                                                                       |
|                                                                                                |
|  Start Date            End Date              Pay Date                                          |
|  [ 03, Jun, 2026 📅 ]  [ 09, Jun, 2026 📅 ]  [ Select pay date 📅 ]      [↺ Undo] [▶ GO!!]     |
|                                                                                                |
+------------------------------------------------------------------------------------------------+
```

* A single white card (`Calculate Commission Run`, Livvic 24px, navy `#002f5c`).
* Three **Date Picker** fields laid out in a row, each 280px wide, with a
  stacked label above the control.
* Two right-aligned actions:
  * **Undo** — secondary button, `MdUndo` icon.
  * **GO!!** — primary button, `MdPlayArrow` icon (shows "Calculating..." while busy).
* Both buttons are **disabled** until *all three* dates are filled
  (`allFieldsFilled`) and while a calculation is running.
* **Date auto-suggestion:**
  * Selecting **Start** auto-fills **End** = Start + 6 days and **Pay** = End + 3 days.
  * Selecting **End** auto-fills **Pay** = End + 3 days.
* **Date constraints (disabled days in popover):**
  * **End Date** disables any day *before* Start Date.
  * **Pay Date** disables End Date *and all earlier days* (must be strictly after End).
* There is **no results grid** — the calculation is simulated as a background
  send to the Finance team and surfaces a toast (see §4).

---

### 2B. Component Library (`/components`) — Styleguide

A long, scrollable showcase of the LVE design system. Sections, top to bottom:

```
+------------------------------------------------------------------------------------------------+
| Buttons                                                                                        |
|  [ Default Primary ] [ Secondary ] [ Destructive ] [ Outline ]  ▏[ Ghost on Dark ]▕            |
|  [ Link Style ]  [ Disabled ]                                                                   |
+------------------------------------------------------------------------------------------------+
| Inputs & Controls                                                                              |
|  Standard Input         [ Enter text...            ]   Date Picker  [ Select date        📅 ]  |
|  With Suffix Icon        [ Search...              🔍 ]   Combobox     [ Select an option... v ] |
|  Error State (red)      [ Invalid input          ⓘ ]   Counter Input [ £ ____           ▲▼ ]  |
|  Disabled State         [ Not allowed            🔍 ]                                          |
+------------------------------------------------------------------------------------------------+
| Tabs                                                                                           |
|  [ Details | Transactions | History ]                                                          |
|  +-------------------------------------------------------------------------------------------+ |
|  |  <<< active tab content >>>                                                                | |
|  +-------------------------------------------------------------------------------------------+ |
+------------------------------------------------------------------------------------------------+
| Data Grids                                                                                     |
|  Read-only Data Grid                                                                           |
|  | Name ⇅        | Amount ⇅   | Status   |                                                      |
|  |---------------+-----------+----------|                                                      |
|  | John Smith    | £1,200    | Active   |                                                      |
|  | Sarah Jones   | £3,450    | Pending  |                                                      |
|                                                                                                |
|  Editable Data Grid                                                                            |
|  | Name      | Select (•) | Include [x] | Allocation [__]% | [ Action ] |                       |
|  |-----------+-----------+-------------+------------------+-----------|                         |
|  | Option A  |    (•)    |     [ ]     |      15 %         | [ Action ]|                         |
|  | Option B  |    ( )    |     [x]     |      20 %         | [ Action ]|                         |
+------------------------------------------------------------------------------------------------+
```

* **Buttons:** Default Primary, Secondary, Destructive, Outline,
  Ghost on Dark (shown on a navy chip), Link Style, Disabled.
* **Inputs & Controls:** Standard Input, Input with suffix icon (`MdSearch`),
  Error-state input (`MdInfoOutline`, red), Disabled input; Date Picker,
  Combobox (Alpha Financial / Beta Wealth / Gamma Advisors), Counter Input
  (currency `£`, stepper, default 100).
* **Tabs:** Details / Transactions / History (Radix tabs; rebuild as `app-tabs`).
* **Data Grids:** a read-only sortable grid and an editable grid with radio,
  checkbox, percentage, and a render-slot action column.

---

### 2C. 404 — Page Not Found (fallback route)

```
+------------------------------------------------------------------------------------------------+
|                              +------------------------------+                                   |
|                              |            ⊘ (red)           |                                   |
|                              |   404 — Page Not Found        |                                   |
|                              |   The page you are looking    |                                   |
|                              |   for does not exist or has   |                                   |
|                              |   been moved.                 |                                   |
|                              +------------------------------+                                   |
+------------------------------------------------------------------------------------------------+
```

* Centered white card with a red `MdErrorOutline` glyph (64px), a Livvic
  title and a Mulish body line. Wrapped in the same Header/Footer shell.

---

## 3. Date Picker Popover (3-view Calendar)

Triggered by clicking any date field. The field border turns green
(`#178830`, 2px) while open, or red (`#d72714`) in an error state. The popover
hosts a custom 300px calendar with three views.

```
Days view                       Months view                    Years view
+--------------------+          +--------------------+         +--------------------+
| <    June 2026   > |          | <     2026      >  |         | <  2025 - 2049  >  |
+--------------------+          +--------------------+         +--------------------+
| Su Mo Tu We Th Fr Sa         | 01   02   03       |         | 2025 2026 2027 2028 2029 |
| 31  1  2  3  4  5  6         | Jan  Feb  Mar      |         | 2030 2031 2032 2033 2034 |
|  7  8  9 10 11 12 13         | 04   05   06       |         |    ...                   |
| 14 15 16 17 18 19 20         | Apr  May  Jun      |         |                          |
| ...                          | ... 12 = Dec       |         | (25-year grid)           |
+--------------------+          +--------------------+         +--------------------+
```

* **Header** — `<` prev │ caption(s) │ `>` next.
  * Days view caption: **Month name** button + **Year** button.
  * Tap **Month name** → Months view. Tap **Year** → Years view.
  * In Years view the caption shows the 25-year range and toggles back to Days.
* **Navigation arrows** step by context: Days = ±1 month, Months = ±1 year,
  Years = ±25 years.
* **Days view:** weekday header on a soft-blue strip; 6-week (42-cell) grid;
  out-of-month days are hatched + dimmed; **today** is blue text; the
  **selected** day is a filled blue circle; **disabled** days are struck
  through and not clickable; optional `highlightMondays` styling.
* **Months view:** 3-column grid, each cell shows the 2-digit ordinal + the
  3-letter month. Selecting a month → Days view.
* **Years view:** 5-column grid of 25 years (hatched background on
  non-selected). Selecting a year → Months view.
* Selecting a **day** commits the value (format `dd, MMM, yyyy`) and closes
  the popover.

```
  [ dd, MMM, yyyy 📅 ]
        │ click
        ▼
   Days view ◀────────┐
        │  (tap month)│ (tap year in Months → Years; pick year → Months)
        ▼             │
   Months view ───────┤
        │ (tap year)  │
        ▼             │
   Years view ────────┘
        │ pick day in Days view
        ▼
   value committed → popover closes
```

---

## 4. Notifications (Toast)

The app has **no blocking modals or dialogs** — all feedback is delivered via
a styled toast in the bottom-right viewport. Toasts auto-dismiss and can be
closed manually.

```
+------------------------------------------------------+   <- 8px green (#006837) top accent
|  Report sent to Finance team                    (✕)  |   <- bold green title 20px / navy close
|                                                      |
|  5 records for pay date 09 Jun 2026 were calculated  |   <- body 16px, #3d3d3d
|  and the BACS file was sent automatically.           |
+------------------------------------------------------+
```

* **Cleared** (info) — fired by **Undo**: *"Date fields have been reset."*
* **Report sent to Finance team** (info) — fired by **GO!!** after a short
  simulated send: *"{N} records for pay date {dd MMM yyyy} were calculated and
  the BACS file was sent automatically."* (N = `RECORD_COUNT`, currently 5).
* A **destructive** variant exists in the design system (red `#d72714` top
  accent) for error messaging, though the current screens only use the
  default green variant.

---

## 5. Navigation / Flow Diagrams

### 5.1 Commission Run — Undo / GO!!

```
   [ ↺ Undo ]                                  [ ▶ GO!! ]
       │ (enabled only when all 3 dates set)       │ (enabled only when all 3 dates set)
       ▼                                            ▼
  reset Start/End/Pay                        set "Calculating..." (≈600ms)
       │                                            │
       ▼                                            ▼
  Toast: "Cleared"                            reset Start/End/Pay
                                                    │
                                                    ▼
                                             Toast: "Report sent to Finance team"
```

### 5.2 Date selection cascade

```
  pick Start Date ─▶ End = Start + 6d ─▶ Pay = End + 3d
  pick End Date   ─────────────────────▶ Pay = End + 3d
  pick Pay Date   ─────────────────────▶ (stored as-is; must be after End)

  Constraints enforced in each popover:
    End  popover: days before Start are disabled
    Pay  popover: End and all earlier days are disabled
```

### 5.3 Routing

```
  [LV= logo] / nav ─▶ "/"            ─▶ Commission Run
                      "/components"  ─▶ Component Library
                      any other URL  ─▶ 404 Page Not Found
```

### 5.4 Date Picker (view machine)

```
  [ field 📅 ] ─▶ Days view ⇄ Months view ⇄ Years view
                     └──────── pick day ────────▶ value set, popover closes
```

---

## 6. Cross-cutting Components

| Component (proposed Angular selector)        | Triggered By                                  | Result                                                         |
| -------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------- |
| Header (`<app-header>`)                      | Always rendered                               | Logo nav, route-driven title, Logout button                   |
| Footer (`<app-footer>`)                      | Always rendered                               | Logo + LVE Financial Services address                         |
| Date Picker (`<app-date-picker>`)            | Click any date field                          | Opens 3-view Calendar popover; emits selected `Date`          |
| Calendar (`<app-calendar>`)                  | Hosted inside Date Picker popover             | Days / Months / Years navigation; disabled-day support        |
| Button (`<button app-button>`)               | All screens                                   | 6 variants (default, secondary, destructive, outline, ghost, link) |
| Input (`<app-input>`)                        | Component Library (and future forms)          | Suffix icon, error and disabled states                        |
| Combobox (`<app-combobox>`)                  | Component Library                             | Searchable single-select popover                              |
| Counter Input (`<app-counter-input>`)        | Component Library                             | Currency stepper (£), increment/decrement                     |
| Tabs (`<app-tabs>`)                          | Component Library                             | Switch between tab panels                                     |
| Data Grid (`<app-data-grid>`)                | Component Library                             | Read-only, sortable, zebra rows, row hover                    |
| Editable Data Grid (`<app-editable-data-grid>`) | Component Library                          | Radio / checkbox / percentage / render-slot cells            |
| Toaster (`<app-toaster>` + `ToastService`)   | Undo, GO!!, and any error path                | Bottom-right notification with title + body + close          |
