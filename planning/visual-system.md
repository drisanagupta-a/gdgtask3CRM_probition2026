# Task CRM — Visual Design System

## 1. Philosophy: Swiss International Typographic Style for CRM

The visual identity of Task CRM synthesizes the principles of Josef Müller-Brockmann, Armin Hofmann, and the Zurich School of Design into a modern, data-dense digital product. 

Traditional SaaS design has devolved into generic templates: floating rounded cards with fuzzy drop shadows, neon gradient buttons, and purple-tinted backgrounds. Task CRM departs decisively from this paradigm:

- **Mathematical Grid Discipline**: Rigid geometric alignment across all screens with standardized gutters, columns, and baseline rhythm.
- **Structural Lines Over Shadows**: Surfaces and hierarchy are defined by crisp, 1px structural dividing rules rather than elevation shadows.
- **Typography as Architecture**: Information hierarchy is articulated through dramatic weight contrast (Regular 400 vs. Bold 700 / ExtraBold 800) and letter spacing rather than decorative shapes.
- **Asymmetrical Tension**: Strategic use of asymmetrical proportions (e.g. 70/30 or 65/35 editorial split on dashboard) to guide the eye purposefully through primary versus supporting workflows.
- **Functional Restraint**: Every visual mark serves clarity. Color is communicative, not ornamental.

---

## 2. Color Palette & Semantic Roles

Colors are defined globally in `tokens.css` as custom properties and never hardcoded in component CSS or JavaScript.

| Color Name | Hex Token | CSS Variable | Semantic Application |
|---|---|---|---|
| **Primary / Ink** | `#111111` | `--color-ink` | Primary headers, body text, strong borders, dark accents |
| **Background** | `#F8F8F6` | `--color-bg` | Editorial warm off-white canvas |
| **Surface** | `#FFFFFF` | `--color-surface` | Table canvases, active stat areas, inputs, modals |
| **Accent / Brick Red** | `#E43D30` | `--color-accent` | Primary CTA, active rail nav indicator, key KPI highlight, active focus |
| **Muted Text** | `#6B6B67` | `--color-muted` | Meta labels, table headers, timestamps, secondary instructions |
| **Border / Rule** | `#D8D8D3` | `--color-border` | Structural rules, grid separators, input outlines |
| **Success** | `#3F7650` | `--color-success` | Active customers, converted leads, done tasks |
| **Warning** | `#A66A18` | `--color-warning` | Contacted leads, in-progress tasks, medium priority |
| **Danger** | `#B52F28` | `--color-danger` | Overdue flags, inactive accounts, high priority |
| **Info** | `#41677A` | `--color-info` | Prospect status, new leads, neutral notifications |

### Rules of Engagement for Accent Red (`#E43D30`):
1. **Never blanket a view in red**: The accent red is an eye-magnet; overusing it dilutes its semantic punch.
2. **Primary Actions Only**: Only one primary action button per visual region receives `--color-accent`.
3. **Active State Marker**: Applied to the horizontal navigation indicator bar (2px solid bottom rule) and selected filter chips.
4. **Key Metric Elevation**: Highlights the Total Sales or Urgent metric on the dashboard.

---

## 3. Typography Scale & Hierarchy

- **Font Family**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif.
- **Tabular Numerics**: `font-variant-numeric: tabular-nums` enforced on financial values, statistical metrics, dates, and counters.

| Element | Size | Weight | Line Height | Tracking | Notes |
|---|---|---|---|---|---|
| **Hero Metric / Stat** | 3.25rem (52px) | 800 | 1.05 | -0.03em | Bold, commanding, tabular digits |
| **Page Title (H1)** | 2.00rem (32px) | 700 | 1.20 | -0.025em | Crisp editorial page title |
| **Section Header (H2)** | 1.25rem (20px) | 700 | 1.30 | -0.015em | Module and segment labels |
| **Subsection Header (H3)**| 1.00rem (16px) | 600 | 1.40 | 0.00em | Card headers, table subheads |
| **Body Standard** | 0.9375rem (15px)| 400 | 1.50 | 0.00em | Customer notes, descriptions, table cells |
| **Metadata / Micro** | 0.75rem (12px)  | 600 | 1.30 | +0.05em | Uppercase section slugs, status badges, table heads |

---

## 4. Layout Architecture

### Structural Layout:
1. **Top Identity Bar (`.identity-bar`)**:
   - Left: Brand mark `TASK / CRM` with minimal geometric dot icon and version tag.
   - Right: Active operator profile metadata (`admin@taskcrm.io`) and a discrete semantic Logout button.
2. **Section Navigation Rail (`.nav-rail`)**:
   - Horizontal rule-aligned tabs: `Dashboard`, `Customers`, `Leads`, `Tasks`.
   - Distinct 2px bottom accent rule on the current active view.
   - Smooth horizontal scroll container on mobile viewports.
3. **Main Workspace Container (`.main-container`)**:
   - Centered container (`max-width: 1280px`).
   - Generous, standardized padding: `var(--space-8)` (2rem) desktop, `var(--space-4)` (1rem) mobile.
   - Zero card floating effect: Clean planar blocks with crisp top/bottom boundaries.

---

## 5. Component Patterns

- **Buttons**:
  - Primary: Solid `#111111` or `#E43D30` background, `#FFFFFF` text, rectangular (2px subtle radius for anti-aliasing), bold uppercase tracking (`+0.04em`).
  - Secondary / Ghost: Clean 1px border `var(--color-border)`, transparent background, hover state transitions cleanly to `var(--color-surface)`.
- **Status Badges**:
  - Small rectangular format with `border: 1px solid var(--badge-border)`, matching muted background, and dark text.
  - Accompanied by a preceding unicode / geometric symbol or distinct text label to guarantee accessibility for color-blind users.
- **Data Tables**:
  - Full width, `border-collapse: collapse`.
  - Header row: Uppercase tracking (`+0.05em`), muted ink, crisp bottom divider.
  - Row cells: Generous vertical padding (`0.85rem`), hover highlight (`var(--color-surface)`), border bottom `1px solid var(--color-border)`.
- **Form Inputs**:
  - High-contrast border `1px solid var(--color-border)`, sharp focus outline `2px solid var(--color-ink)` with `2px` offset.
  - Clear semantic labels, error states presented inline below fields.
