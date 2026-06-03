# IFA Bacs Commission — Screen Flow (ASCII)

This document captures every screen, route, popover, and dialog in the
**IFA Bacs Commission** web app, plus the navigation paths between them.
It is framed in **Angular** terms (selectors, routes, dialogs) to mirror the
reference `BACS_Payments_SCREEN_FLOW(Angular).md`, even though the live
recreation is built in React + Vite.

---

## 0. Scope note — "Plan Type Master" does not exist in this app

> **Validation finding.** The request asked to "start by explaining
> Plan Type Master, then other plan types." After auditing the entire
> application, **this app has no Plan Type concept** — no Plan Type Master
> screen, no plan-type list, no plan-type CRUD, and no plan-type routes.
> The "BACS Payments" reference app is tab-driven (Tax Free, First Payments,
> Maturities, MCP, …), but **IFA Bacs Commission is a single-purpose
> Commission Calculator**.
>
> To avoid inventing screens that do not exist, this document treats the
> **Commission Calculator** as the primary ("master") screen and then
> documents every other real surface (Component Library, 404), every
> popover (Date Picker → Calendar), and every dialog/notification (Toast).
> If a Plan Type Master *should* be added, say the word and I will design
> and document it — but it is not part of the current build.

What actually exists, in full:

| # | Surface | Angular route | Component (selector) | Type |
|---|---------|---------------|----------------------|------|
| 1 | Commission Calculator (primary) | `/` | `<app-home>` | Page |
| 2 | Component Library (styleguide) | `/components` | `<app-components>` | Page |
| 3 | Not Found | `**` (wildcard) | `<app-not-found>` | Page |
| 4 | Date Picker → Calendar | — | `<app-date-picker>` / `<app-calendar>` | Popover |
| 5 | Toast notification | — | `<app-toast>` (via `ToastService`) | Transient overlay |

Legend: `[ Button ]`, `[ field ]`, `[v]` = dropdown / picker, `( )` radio,
`[x]` checkbox, `📅` = calendar icon.

---

## 1. Application Shell (always visible)

Every routed page renders inside the same shell: a navy header
(`<app-header>`) and a white footer (`<app-footer>`).

```
+------------------------------------------------------------------------------------------------+
| [LVE=]  |  IFA Bacs Commission                                                     [ Logout ]  |
+------------------------------------------------------------------------------------------------+
|                                                                                                |
|                              <<< ROUTED PAGE CONTENT (router-outlet) >>>                       |
|                                                                                                |
+------------------------------------------------------------------------------------------------+
| [LVE=]                                              LVE Financial Services Ltd                 |
|                                                     123 Corporate Square, London, UK           |
+------------------------------------------------------------------------------------------------+
```

* **Header** (`<app-header>`, navy `#00263e`): hand-drawn LVE SVG wordmark
  (links to `/`) · vertical divider · page title · `[ Logout ]` ghost button.
  * Title is route-aware: `/components` → **"Component Library"**, everything
    else → **"IFA Bacs Commission"**.
  * `[ Logout ]` is a visual control only (no auth wired up).
* **Footer** (`<app-footer>`, white): dark LVE wordmark on the left,
  company name + address on the right.
* Whole app is rendered at **80% zoom** (`body { zoom: 0.8 }`); page wrappers
  use `min-h-[125vh]` so the footer still sits at the bottom of the viewport.

---

## 2. Page Layouts

### 2A. Commission Calculator — primary screen (`/`, `<app-home>`)

The single most important screen. One card, three date pickers, two actions.

```
+------------------------------------------------------------------------------------------------+
| Calculate Commission Run                                                                        |
+------------------------------------------------------------------------------------------------+
|                                                                                                |
|  Start Date              End Date               Pay Date                                        |
|  [ Select date    📅 ]   [ Select date    📅 ]  [ Select pay date 📅 ]   [ ↩ Undo ] [ ▶ GO!! ] |
|                                                                                                |
+------------------------------------------------------------------------------------------------+
```

Fields & behaviour:

* **Start Date** (`<app-date-picker>`): free selection.
  * On select → auto-suggests **End = Start + 6 days** and
    **Pay = End + 3 days** (i.e. Start + 9). Clearing Start clears all three.
* **End Date** (`<app-date-picker>`): days **before Start** are disabled
  (struck-through) in the calendar.
  * On select → auto-suggests **Pay = End + 3 days**.
* **Pay Date** (`<app-date-picker>`, placeholder *"Select pay date"*): only
  days **strictly after End** are selectable.
* **`[ ↩ Undo ]`** (`MdUndo`, secondary button): clears all three fields and
  fires a Toast *"Cleared — Date fields have been reset."*
* **`[ ▶ GO!! ]`** (`MdPlayArrow`, primary button): runs the calculation.

Disabled rules:

* Both buttons are **disabled until all three dates are filled**
  (`allFieldsFilled`).
* While calculating, both buttons are disabled and `GO!!` reads
  **"Calculating…"**.

> Note: there is **no results grid** on this screen. `GO!!` performs the run
> in the background and reports completion via a Toast — it does not render a
> table of rows.

### 2B. Component Library / Styleguide (`/components`, `<app-components>`)

A scrolling styleguide page (header title becomes **"Component Library"**).
Four sections, each in a white card:

```
+------------------------------------------------------------------------------------------------+
| Buttons                                                                                         |
+------------------------------------------------------------------------------------------------+
| [ Default Primary ] [ Secondary ] [ Destructive ] [ Outline ]  ▮[ Ghost on Dark ]▮             |
| [ Link Style ]      [ Disabled ]                                                                |
+------------------------------------------------------------------------------------------------+
| Inputs & Controls                                                                               |
+------------------------------------------------------------------------------------------------+
|  Standard Input        [____________________]   |  Date Picker   [ Select date      📅 ]       |
|  With Suffix Icon      [____________ 🔍]        |  Combobox      [ Choose…          [v]]       |
|  Error State           [____________ ⓘ] (red)   |  Counter Input [ −   100   + ]               |
|  Disabled State        [____________ 🔍] (grey) |                                              |
+------------------------------------------------------------------------------------------------+
| Tabs                                                                                            |
+------------------------------------------------------------------------------------------------+
| [ Details | Transactions | History ]                                                           |
| +--------------------------------------------------------------------------------------------+ |
| |  <<< active tab content >>>                                                                 | |
| +--------------------------------------------------------------------------------------------+ |
+------------------------------------------------------------------------------------------------+
| Data Grids                                                                                      |
+------------------------------------------------------------------------------------------------+
|  Read-only Data Grid                            |  Editable Data Grid                          |
|  Name        | Amount  | Status                 |  Name     | Select( ) | Include[x] | Alloc% | |
|  ------------+---------+--------                 |  ---------+-----------+------------+--------  |
|  John Smith  | £1,200  | Active                  |  Option A |   (•)     |    [ ]     |  15 %  | |
|  Sarah Jones | £3,450  | Pending                 |  Option B |   ( )     |    [x]     |  20 %  | |
+------------------------------------------------------------------------------------------------+
```

Components demonstrated (Angular selectors):

| Control | Selector | Notes |
|---------|----------|-------|
| Button | `<app-button>` | variants: primary, secondary, destructive, outline, ghost, link, disabled |
| Input | `<app-input>` | plain, suffix-icon, error, disabled |
| Date Picker | `<app-date-picker>` | opens the Calendar popover (see §3) |
| Combobox | `<app-combobox>` | options: Alpha Financial / Beta Wealth / Gamma Advisors |
| Counter Input | `<app-counter-input>` | numeric stepper (−/+), default 100 |
| Tabs | `<app-tabs>` | Details / Transactions / History |
| Read-only grid | `<app-data-grid>` | sortable Name & Amount columns |
| Editable grid | `<app-editable-data-grid>` | radio / checkbox / percentage cell editors + action button |

> This route is a **developer styleguide**, not part of the end-user flow.
> It is reachable only by typing `/components` directly.

### 2C. Not Found (`**` wildcard, `<app-not-found>`)

Shown for any unrecognised route. Uses the same Header/Footer shell.

```
+------------------------------------------------------------------------------------------------+
|                                                                                                |
|                          +--------------------------------------------+                        |
|                          |                  ⚠ (red)                   |                        |
|                          |          404 — Page Not Found              |                        |
|                          |  The page you are looking for does not      |                        |
|                          |  exist or has been moved.                  |                        |
|                          +--------------------------------------------+                        |
|                                                                                                |
+------------------------------------------------------------------------------------------------+
```

* Icon: `MdErrorOutline` (red `#d72714`).
* No actions — informational only.

---

## 3. Date Picker Popover (`<app-date-picker>` → `<app-calendar>`)

Triggered by clicking any date field on the Commission Calculator (or the
Date Picker in the styleguide). Opens a popover containing a custom
**3-view calendar** (days / months / years). The trigger border turns green
(`#178830`) while open.

```
Days view                        Months view                     Years view
+----------------------+         +----------------------+        +----------------------+
| <    April 2026   >  |         | <      2026       >  |        | <  2025 - 2049    >  |
+----------------------+         +----------------------+        +----------------------+
| Su Mo Tu We Th Fr Sa |        | 01   02   03         |        | 2025 2026 2027 2028  |
| 30 31  1  2  3  4  5  |        | Jan  Feb  Mar        |        | 2029 2030 2031 2032  |
|  6  7  8  9 10 11 12  |        | 04   05   06         |        | 2033 2034 ...        |
| 13 14 15 16 17 18 19  |        | Apr  May  Jun        |        | ...        2049      |
| 20 21 22 23 24 25 26  |        | 07 … 12 (Jul … Dec)  |        |                      |
| 27 28 29 30  1  2  3  |        +----------------------+        +----------------------+
+----------------------+
```

Interaction model:

* **Month name** (caption) → switches to **Months view**.
* **Year number** (caption) → switches to **Years view**.
* `<` / `>` arrows step: days view ±1 month · months view ±1 year ·
  years view ±25 years.
* Picking a **year** → drops to Months view; picking a **month** → drops to
  Days view; picking a **day** → emits the date and **closes the popover**.
* Days outside the current month are shown with a 45° hatch + dimmed.
* **Today** is highlighted blue; the **selected** day is a solid blue pill.
* **Disabled days** (from `isDateDisabled`) are struck-through and not
  clickable — this is how End < Start and Pay ≤ End are blocked (see §2A).
* Optional `highlightMondays` styling exists in the component but is not
  enabled on the Calculator screen.

---

## 4. Dialogs & Notifications

This app has **no modal dialogs** (no Save As, no Print, no Confirm/Warning
windows — those belong to the BACS Payments reference app). The only
transient surface is the **Toast**.

### 4A. Toast notification (`<app-toast>` via `ToastService`)

Bottom/stacked notification card, styled to the LVE spec.

```
+------------------------------------------------------------+
|████████████████████████████████████████████████████████████|  ← 8px green top accent (#006837)
| Report sent to Finance team                          ( ✕ ) |  ← bold green title + navy circle close
|                                                            |
| 5 records for pay date 12 Apr 2026 were calculated and     |  ← body 16px / #3d3d3d
| the BACS file was sent automatically.                      |
+------------------------------------------------------------+
```

Variants & usages:

| Variant | Top accent | Fired by | Title / body |
|---------|-----------|----------|--------------|
| Success (default) | green `#006837` | `GO!!` finishes | *"Report sent to Finance team" / "{N} records for pay date {date} … sent automatically."* |
| Success (default) | green `#006837` | `Undo` | *"Cleared" / "Date fields have been reset."* |
| Destructive | red | (available, not currently triggered) | error messaging |

* Close: navy `#002f5c` circular outlined button with `MdClose` + sr-only
  "Close". Toasts also auto-dismiss.

---

## 5. Navigation / Flow Diagrams

### 5.1 Commission Calculator — GO!! / Undo

```
  Start Date selected ──▶ auto-fill End (+6d) and Pay (+9d)
        │
        ▼
  End Date selected ────▶ auto-fill Pay (+3d)   (days before Start disabled)
        │
        ▼
  Pay Date selected ────▶ (only days after End selectable)
        │
   all 3 filled? ──No──▶ [ Undo ] & [ GO!! ] stay disabled
        │ Yes
        ├───────────────▶ [ ▶ GO!! ] ─▶ "Calculating…" (≈600ms)
        │                                   │
        │                                   ▼
        │                          Toast "Report sent to Finance team"
        │                                   │
        │                                   ▼
        │                          fields reset to empty
        │
        └───────────────▶ [ ↩ Undo ] ─▶ fields reset ─▶ Toast "Cleared"
```

### 5.2 Date Picker (every date field)

```
  [ Select date 📅 ]
        │ (click trigger — border turns green)
        ▼
   Days view ◀──────────────┐
        │  (tap month name) │  (pick month → Days)
        ▼                   │
   Months view              │
        │  (tap year number)│  (pick year → Months)
        ▼                   │
   Years view ──────────────┘
        │
   (pick a day) ─▶ emit date + close popover
```

### 5.3 Routing

```
   URL
    │
    ├── "/"            ──▶ <app-home>        (Commission Calculator)
    ├── "/components"  ──▶ <app-components>  (styleguide; header title flips)
    └── anything else  ──▶ <app-not-found>   (404)

   Header logo (always) ──▶ navigates to "/"
```

---

## 6. Cross-cutting Components

| Component (Angular selector)       | Triggered by                                   | Result                                                        |
|------------------------------------|------------------------------------------------|---------------------------------------------------------------|
| Header (`<app-header>`)            | Always (shell)                                 | LVE logo → `/`, route-aware title, Logout (visual)            |
| Footer (`<app-footer>`)            | Always (shell)                                 | LVE logo + company address                                    |
| Date Picker (`<app-date-picker>`)  | Click any date field                           | Opens Calendar popover (§3); emits selected date              |
| Calendar (`<app-calendar>`)        | Inside Date Picker popover                      | 3-view (days/months/years) selection with disabled-day rules  |
| Toast (`<app-toast>`)              | `GO!!`, `Undo` (success); errors (destructive) | Transient notification, manual ✕ or auto-dismiss              |
| Button (`<app-button>`)            | Throughout                                      | primary / secondary / destructive / outline / ghost / link    |
| Combobox / Counter / Inputs / Tabs / Data Grids | Styleguide (`/components`) only   | Demonstration of the LVE component library                    |

---

## 7. Coverage checklist (validation)

- [x] **Primary screen** — Commission Calculator (`/`) documented in full
      (fields, auto-suggest dates, disabled rules, GO!!/Undo, no results grid).
- [x] **Component Library** (`/components`) — all sections & controls listed.
- [x] **404 / Not Found** — wildcard route documented.
- [x] **Popovers** — Date Picker → 3-view Calendar (days/months/years).
- [x] **Notifications** — Toast (success + destructive variants).
- [x] **Application shell** — Header (route-aware title, Logout) + Footer.
- [x] **Navigation flows** — calculator actions, date picker, routing.
- [ ] **Plan Type Master / plan types** — **not present in this app.**
      See §0. Can be added on request.
