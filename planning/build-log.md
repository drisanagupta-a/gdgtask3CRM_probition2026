# Task CRM — Development Build Log

## Build Timeline & Progress Tracker

| Milestone | Phase | Description | Status |
|---|---|---|---|
| **01** | Documentation & Architecture | Specification, visual system, constraints, and coding standards | Completed |
| **02** | Design Tokens & Reset | Normalize browser styling, establish typography, color variables, spacing scale | Completed |
| **03** | Core Layout & Patterns | Identity bar, navigation rail, tabular rules, buttons, form controls, badges | Completed |
| **04** | Data Store & Seeds | `store.js` with realistic seeds (18 customers, 18 leads, 18 tasks, sales, activities) | Completed |
| **05** | View & Helper Utilities | `view.js` and `helpers.js` for tables, metrics, badges, empty states, debounce, dates | Completed |
| **06** | Authentication Gate & Login | `login.html` & `login.js` with validation, dummy auth, session check | Completed |
| **07** | Executive Dashboard | `dashboard.html` & `dashboard.js` with dynamic metrics, accent stat, activity stream | Completed |
| **08** | Customer Directory | `customers.html` & `customers.js` with debounced search, status filter, modal creator | Completed |
| **09** | Leads Pipeline | `leads.html` & `leads.js` with status filter, overdue flags (converted safe) | Completed |
| **10** | Task Management | `tasks.html` & `tasks.js` with priority/status filters, overdue detection, date sorting | Completed |
| **11** | Responsive & Accessibility Pass | 375px/768px/1440px testing, keyboard navigation, visible focus rings, WCAG contrast | Completed |
| **12** | Polish & Final QA | Micro-interactions, reduced motion compliance, zero console errors verification | Completed |

---

## Technical Notes & Decisions Log
- **Typography Selection**: Loaded Inter with variable weights (400, 500, 600, 700, 800) alongside system sans-serif fallback stack for zero font layout shift.
- **Color Discipline**: Accent Brick Red (`#E43D30`) strictly reserved for primary CTA buttons, active navigation indicator bar, and the primary KPI metric.
- **Overdue Computation Logic**: Converted leads and Done tasks are explicitly exempted from overdue warning styling, matching real-world CRM logic.
- **Accessible Modals**: Native `<dialog>` elements styled with Swiss geometric borders and accessible close buttons, preventing body scroll while open.
