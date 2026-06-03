# IFA Bacs Commission — Application Digest

## 1. Application

| Field         | Value                                                                                                                                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name          | IFA Bacs Commission                                                                                                                                                                  |
| Version       | 0.0.0                                                                                                                                                                               |
| Type          | Static web app (no backend) — recreation of a legacy Windows desktop tool                                                                                                          |
| Description   | LVE Financial Services internal back-office tool for running a BACS commission calculation. The user selects a Start, End and Pay date, runs the calculation, and the BACS file is sent to the Finance team. Built with Angular, deployable as a static site. |
| Framework     | Angular 17 (standalone components, signals) + TypeScript                                                                                                                            |
| Styling       | Tailwind CSS (configured via `tailwind.config.ts`, applied through component-scoped SCSS in each `*.component.scss`; global tokens/resets in `src/styles.scss`)                     |
| Icons         | `@ng-icons/material-icons` (Material Design) — registered per-component via `provideIcons({ matUndo, matPlayArrow, matOutlineCalendarToday, ... })` and rendered with `<ng-icon name="matUndo">` |
| Routing       | `RouterModule` with three routes (`/`, `/components`, `**` wildcard) — `provideRouter(routes)`                                                                                       |
| Forms         | Angular `FormsModule` two-way binding (`[(ngModel)]`) / signal-bound date controls; no `ReactiveFormsModule` required                                                                |
| Build         | Angular CLI (`ng build`) → static `dist/ifa-bacs-commission/browser/` output (esbuild via `@angular-devkit/build-angular:application`)                                               |
| Change det.   | `ChangeDetectionStrategy.OnPush` on every standalone component; reactive updates driven by `signal()` / `computed()` / `effect()`                                                    |
| DI            | Standalone APIs only — `bootstrapApplication(AppComponent, { providers: [provideRouter(routes), provideAnimations(), ...] })` in `src/main.ts`                                       |

### Fonts

- **Heading:** Livvic
- **Body:** Mulish

### Brand colors

| Token         | Hex          | Usage                                          |
| ------------- | ------------ | ---------------------------------------------- |
| accent_blue   | `#006cf4`    | Primary buttons, calendar icons, selected day  |
| primary_blue  | `#04589b`    | Secondary button border / text                 |
| deep_blue     | `#003578`    | Hover fill for buttons / nav-arrow hover       |
| navy          | `#00263e`    | Header bar                                     |
| title_blue    | `#002f5c`    | Card titles, table header text                 |
| link_blue     | `#005a9c`    | Grid first-column links, calendar caption      |
| focus_green   | `#178830`    | Input/picker focus + open border               |
| toast_green   | `#006837`    | Toast accent border + title                    |
| gray_border   | `#BBBBBB`    | Card / control borders                         |
| disabled_bg   | `#CCCCCC`    | Disabled control background                    |
| muted         | `#979797`    | Disabled button background / glyphs            |
| text          | `#3d3d3d`    | Body text                                      |
| destructive   | `#d72714`    | Error states, destructive button, 404 glyph    |
| page_bg       | `#f0f0f0`    | App background                                 |
| row_zebra     | `#e7ebec34`  | Alternate table rows (read-only grid)          |
| radius        | `30px`       | Global `--radius` (pill buttons)               |

> **Display note:** the document body renders at `zoom: 0.8`; page wrappers use
> `min-h-[125vh]` so the footer stays pinned to the bottom of the viewport.

---

## 2. Global Components

### 2.1 Header (`HeaderComponent`, selector `app-header`, `src/app/components/header/header.component.ts`)

```yaml
selector: app-header
sticky: false
background: "#00263e"
padding: "20px 142px"   # py-5 px-[142px]
left:
  - logo: "LV= (light variant, links to '/')"
  - divider: "vertical hairline"
  - title: "route-driven page title (Livvic, white)"
right:
  - logout_button: { variant: ghost-on-dark, label: "Logout", output: "(logout)=onLogout()" }
title_map:
  "/":           "IFA Bacs Commission"
  "/components":  "Component Library"
inputs: []
outputs: [logout (EventEmitter<void>)]
```

### 2.2 Footer (`FooterComponent`, selector `app-footer`)

- Background: white, top border hairline.
- Left: `LV=` logo (dark variant).
- Right (two lines, small grey, right-aligned):
  *LVE Financial Services Ltd* / *123 Corporate Square, London, UK*.

### 2.3 Logo (`LogoComponent`, selector `app-logo`)

```yaml
selector: app-logo
inputs:
  - "variant: 'light' | 'dark'"   # light on navy header, dark on white footer
render: "<img> of the LVE 'LV=' brand mark"
```

### 2.4 Routing Shell (`AppComponent`)

```yaml
routes:
  - { path: "",            component: HomeComponent }          # Commission Run
  - { path: "components",  component: ComponentLibraryComponent }
  - { path: "**",          component: NotFoundComponent }      # 404 fallback
global: "<app-toaster>" mounted once at the app root for notifications
```

---

## 3. Screens (Routes)

### 3.1 Commission Run (`HomeComponent`, route `/`)

The primary screen — a single "Calculate Commission Run" card.

- **Card title:** "Calculate Commission Run" (Livvic 24px, `#002f5c`).
- **Controls (row, each 280px, stacked label):**
  - `Start Date` — `<app-date-picker [(date)]="startDate">`
  - `End Date`   — `<app-date-picker [(date)]="endDate" [isDateDisabled]="beforeStart">`
  - `Pay Date`   — `<app-date-picker [(date)]="payDate" [isDateDisabled]="endOrEarlier" placeholder="Select pay date">`
- **Actions (right-aligned):**
  - **Undo** — secondary, `matUndo` icon. Resets all three dates and fires the *Cleared* toast.
  - **GO!!** — primary, `matPlayArrow` icon. Runs the (simulated) calculation, resets the dates, and fires the *Report sent to Finance team* toast. Shows "Calculating..." while busy.
- **Enablement:** both buttons are disabled until `allFieldsFilled`
  (`startDate && endDate && payDate`) and while `isCalculating`.
- **Date auto-suggestion:**
  - Selecting **Start** → `End = Start + 6d`, `Pay = End + 3d`.
  - Selecting **End** → `Pay = End + 3d`.
- **Date constraints (disabled days in popover):**
  - **End Date** disables days before Start Date.
  - **Pay Date** disables End Date and all earlier days (must be strictly after End).
- **No results grid.** The calculation is modelled as a background send; the
  only output is the toast. `RECORD_COUNT` (currently `5`) is interpolated into
  the toast body.

### 3.2 Component Library (`ComponentLibraryComponent`, route `/components`)

LVE design-system styleguide. Scrollable sections:

- **Buttons:** Default Primary · Secondary · Destructive · Outline · Ghost on Dark · Link Style · Disabled.
- **Inputs & Controls:**
  - Standard Input
  - Input with suffix icon (`matSearch`)
  - Error-state input (`matInfoOutline`, red)
  - Disabled input
  - Date Picker
  - Combobox (Alpha Financial · Beta Wealth · Gamma Advisors)
  - Counter Input (currency `£`, default 100)
- **Tabs:** Details · Transactions · History.
- **Data Grids:**
  - Read-only Data Grid — columns Name (sortable) · Amount (sortable) · Status.
  - Editable Data Grid — columns Name · Select (radio) · Include (checkbox) · Allocation (percentage) · Action (button).

### 3.3 Not Found (`NotFoundComponent`, route `**`)

- Centered white card inside the standard shell.
- `matErrorOutline` glyph (64px, red `#d72714`).
- Title "404 — Page Not Found" (Livvic 24px, `#002f5c`).
- Body "The page you are looking for does not exist or has been moved." (Mulish 16px).

---

## 4. Popovers, Controls & Notifications

> The app has **no blocking modals/dialogs** (no Save As, Print, Confirm, or
> Warning dialogs). User feedback is delivered via toasts; date entry is via a
> popover calendar.

### 4.1 DatePicker (`DatePickerComponent`, selector `app-date-picker`, `src/app/components/date-picker/date-picker.component.ts`)

```yaml
selector: app-date-picker
trigger:
  height: 44px
  radius: 8px
  display_format: "dd, MMM, yyyy"
  placeholder: "Select date"   # overridable (e.g. "Select pay date")
  icon: matOutlineCalendarToday  # accent blue #006cf4, divider hairline to its left
  states:
    open:     "border #178830 (2px green)"
    error:    "border + text #d72714 (red)"
    disabled: "bg #CCCCCC, 2px #ACACAC border, not-allowed"
    hover:    "border #178830"
inputs:
  - "date?: Date                              // two-way bindable via [(date)]"
  - "placeholder?: string"
  - "error?: boolean"
  - "disabled?: boolean"
  - "highlightMondays?: boolean"
  - "isDateDisabled?: (date: Date) => boolean // disables individual days in the popover"
outputs:
  - "dateChange: EventEmitter<Date | undefined>  // enables [(date)] banana-in-a-box"
popover:
  content: "<app-calendar>"
  border: "2px #178830 (red on error), 12px radius"
behavior: "selecting a day emits the value and closes the popover"
```

### 4.2 Calendar (`CalendarComponent`, selector `app-calendar`, `src/app/components/calendar/calendar.component.ts`)

A self-contained 300px, three-view calendar (no `react-day-picker`/external
date-grid lib equivalent — pure `date-fns` logic). Hosted inside the
DatePicker popover.

```yaml
selector: app-calendar
width: 300px
inputs:
  - "selected?: Date"
  - "error?: boolean"
  - "highlightMondays?: boolean"
  - "isDateDisabled?: (date: Date) => boolean"
outputs:
  - "select: EventEmitter<Date | undefined>"
view_state: "signal<'days' | 'months' | 'years'>('days')"
header:
  - prev_arrow: "Days: -1 month · Months: -1 year · Years: -25 years"
  - caption_month: "(Days view only) button -> Months view"
  - caption_year:  "button -> Years view; in Years view shows '<start> - <start+24>' and toggles back to Days"
  - next_arrow: "Days: +1 month · Months: +1 year · Years: +25 years"
```

| View   | Layout                                                                                   |
| ------ | --------------------------------------------------------------------------------------- |
| Days   | Su–Sa header strip (`#eef4f8`); 6-week (42-cell) grid. Out-of-month days hatched + dimmed; today = blue text; selected = filled blue circle; disabled = struck-through, non-clickable; optional Monday highlight. |
| Months | 3-column grid; each cell shows 2-digit ordinal + 3-letter month. Pick → Days view.       |
| Years  | 5-column grid of 25 years (hatched bg on non-selected). Pick → Months view.              |

### 4.3 Toaster (`ToasterComponent` + `ToastService`, `src/app/components/toaster/`)

Bottom-right, auto-dismissing notification stack. No backdrop, non-blocking.

```yaml
selector: app-toaster
service: ToastService.show({ title, description, variant? })
variant:
  default:     "8px top accent #006837 (green); bold green 20px title"
  destructive: "8px top accent #d72714 (red)"
card:
  background: white
  radius: rounded-lg
  shadow: shadow-lg
title:       "20px bold #006837"
description: "16px / 24px line-height #3d3d3d"
close:       "circular outlined navy (#002f5c) button, matClose glyph + sr-only 'Close'"
messages:
  - { trigger: Undo, title: "Cleared", body: "Date fields have been reset." }
  - { trigger: GO!!, title: "Report sent to Finance team",
      body: "{N} records for pay date {dd MMM yyyy} were calculated and the BACS file was sent automatically." }
```

---

## 5. Design-system Controls (Component Library)

### 5.1 Button (`ButtonComponent` / `[appButton]`)

```yaml
shape: pill (radius 30px), height 44px (default size)
variants:
  default:     "bg #006cf4, white text, hover #003578"
  secondary:   "white bg, #04589b border + bold text, hover fill #003578 white text"
  destructive: "bg #d72714, white text"
  outline:     "#BBBBBB border, white bg, hover bg #eaf5f8"
  ghost:       "transparent, hover white/10 (used on navy header)"
  link:        "#005a9c underline-on-hover"
disabled: "bg #979797, white text (all variants)"
sizes: [default (h-44 px-8), sm (h-8), lg (h-10), icon (36x36)]
```

### 5.2 Input (`InputComponent`, selector `app-input`)

```yaml
height: 44px, radius 8px, border #BBBBBB
focus: "border #178830 (3px)"
inputs: [error?: boolean, suffixIcon?: TemplateRef]
suffix: "icon w/ left divider hairline; accent #006cf4 (red on error, grey on disabled)"
error:    "border + text + placeholder #d72714"
disabled: "bg #CCCCCC, 2px #ACACAC border"
```

### 5.3 Combobox (`ComboboxComponent`, selector `app-combobox`)

```yaml
trigger: "44px button, chevron matKeyboardArrowDown (rotates 180° when open)"
open: "green 3px border, popover seamlessly joins the trigger (no top border)"
popover: "searchable command list; selected row #05579B white; check glyph on the active option"
inputs:  [options: {label,value}[], value?, placeholder?, searchPlaceholder?, emptyText?, error?, disabled?]
outputs: [change (EventEmitter<string>)]
```

### 5.4 Counter Input (`CounterInputComponent`, selector `app-counter-input`)

```yaml
prefix: "£"
stepper: "up/down chevrons (accent #006cf4), increment/decrement, floor at 0"
inputs:  [value?: number, error?: boolean, disabled?]
outputs: [change (EventEmitter<number>)]
```

### 5.5 Tabs (`TabsComponent`, selectors `app-tabs` / `app-tab`)

```yaml
list:    "row of triggers, 8px top radius"
trigger: "inactive bg #eaf5f8 text #0d2c41; active bg white text #4a4a49 + soft top shadow"
content: "panel rendered below the list"
```

### 5.6 Data Grid (`DataGridComponent`, selector `app-data-grid`)

```yaml
header: "Livvic 18px #002f5c; 3px top+bottom #04589b rule; optional sort glyph (sortable columns)"
rows:   "zebra (#e7ebec34 on odd); full-row hover #05579B white text"
first_column: "link styled (#005a9c underline)"
inputs: [columns: { key, header, sortable?, render? }[], data: T[]]
```

### 5.7 Editable Data Grid (`EditableDataGridComponent`, selector `app-editable-data-grid`)

```yaml
header: "Livvic 16px #002f5c; 2px bottom #002f5c rule"
rows:   "zebra (#f4f7f8 on odd)"
cell_types:
  radio:      "circle; selected ring + dot #006cf4"
  checkbox:   "box; checked fill #178830 with white tick"
  percentage: "100px text input + '%' suffix; focus green 3px border"
  render:     "custom template slot (e.g. an action Button)"
inputs:  [columns: { key, header, editableType?, render?, onEdit? }[], data: T[]]
outputs: "per-column onEdit(rowId, value) callbacks"
```

---

## 6. Flows

### 6.1 Run a commission calculation

```text
fill Start, End, Pay (all three required)
   │
   ├─ Undo  ─▶ reset all dates ─▶ Toast "Cleared"
   │
   └─ GO!!  ─▶ isCalculating = true ("Calculating...")
                │  (≈600ms simulated send)
                ▼
              reset all dates
                │
                ▼
              Toast "Report sent to Finance team"
                ("{N} records for pay date {dd MMM yyyy} ...")
```

### 6.2 Date selection cascade & constraints

```text
pick Start ─▶ End = Start + 6d ─▶ Pay = End + 3d
pick End   ──────────────────────▶ Pay = End + 3d
pick Pay   ──────────────────────▶ stored (must be after End)

End  popover: disable days < Start
Pay  popover: disable End and all earlier days
```

### 6.3 Date Picker view machine

```text
[ field 📅 ] ─▶ Days view ⇄ Months view ⇄ Years view
                   └──── pick day ────▶ emit value, close popover
```

### 6.4 Routing

```text
"/"           ─▶ HomeComponent (Commission Run)
"/components" ─▶ ComponentLibraryComponent
"**"          ─▶ NotFoundComponent (404)
```

---

## 7. State Model

All Commission Run state lives in `HomeComponent` using Angular **signals**
(no NgRx / global store). Toasts are mediated by a root `ToastService`.

```yaml
# HomeComponent
- startDate      = signal<Date | undefined>(undefined)
- endDate        = signal<Date | undefined>(undefined)
- payDate        = signal<Date | undefined>(undefined)
- isCalculating  = signal(false)
- allFieldsFilled = computed(() => !!(startDate() && endDate() && payDate()))
- RECORD_COUNT   = 5            # constant interpolated into the success toast

# helpers
- onStartSelect(d) -> set start; if d: end = d+6, pay = end+3; else clear end/pay
- onEndSelect(d)   -> set end; pay = d ? d+3 : undefined
- onUndo()         -> reset all; ToastService.show("Cleared", ...)
- onGo()           -> isCalculating = true; setTimeout(600): reset all + success toast

# ToastService (providedIn: 'root')
- toasts = signal<ToastModel[]>([])
- show({ title, description, variant }) -> push + auto-dismiss
```

---

## 8. Design Notes

- **Header** uses navy `#00263e` with a white `LV=` logo and a ghost Logout button (hover white/10).
- **Footer** is white with a hairline top border, dark `LV=` logo and the LVE address.
- **Primary buttons:** background `#006cf4`, hover `#003578`, pill shape (radius 30px).
- **Secondary buttons:** white background, `#04589b` border + bold text; hover fills `#003578` with white text.
- **Disabled buttons:** background `#979797`, white text (across all variants).
- **Inputs / pickers:** 44px tall, 8px radius, `#BBBBBB` border; focus/open border `#178830` (green); error border/text `#d72714`; disabled `#CCCCCC` bg with `#ACACAC` 2px border.
- **Read-only Data Grid:** zebra rows `#e7ebec34`; full-row hover `#05579B` with white text; navy header text `#002f5c` with `#04589b` rules.
- **Toasts:** white card, `rounded-lg`, `shadow-lg`, 8px top accent (`#006837` green / `#d72714` red), 20px bold green title, 16px `#3d3d3d` body, circular outlined navy close button (`matClose` + sr-only "Close").
- **404:** centered white card with red `matErrorOutline`, Livvic title, Mulish body.
- **Calendar:** 300px popover; soft-blue weekday strip; selected day filled `#006cf4`; today blue text; out-of-month and non-selected year cells use a 45° hatch pattern; disabled days struck through.
- **Icons:** Material Design only (`@ng-icons/material-icons`) — e.g. `matUndo`, `matPlayArrow`, `matOutlineCalendarToday`, `matKeyboardArrowLeft/Right/Up/Down`, `matSearch`, `matInfoOutline`, `matCheck`, `matClose`, `matErrorOutline`.
- **Typography:** Livvic for headings/labels, Mulish for body and control text.
- **Global radius** token `--radius: 30px` (pill buttons); cards use a 12px radius.
