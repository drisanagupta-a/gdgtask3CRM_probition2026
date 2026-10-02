# Task CRM — Swiss-Inspired Editorial Frontend CRM

A clean, high-performance, frontend-only Customer Relationship Management (CRM) web application built using the principles of the **Swiss International Typographic Style**. Designed specifically as a college frontend assignment showcase, it operates without external dependencies, build tools, or backend servers, persisting all data through a disciplined `localStorage` architecture.

![Task CRM System Overview](https://raw.githubusercontent.com/placeholder/task-crm-preview.png)

---

## 1. Project Overview

Task CRM reimagines enterprise SaaS software through an editorial lens:

- **Grid Discipline & Structural Lines**: Flat planar surfaces and crisp `1px` dividing rules replace fuzzy drop shadows and floating card clutter.
- **Typographic Hierarchy**: Distinct weight contrasts (Inter 400 to 800) and tabular numerals guide the eye naturally across information-dense tables and financial summaries.
- **Selective Vermilion Accent**: An intentional brick red (`#E43D30`) serves exclusively as a communicative marker for active navigation, key metrics, and primary CTAs.
- **Zero-Build Portability**: Standard semantic HTML5, pure Vanilla CSS, and modern ECMAScript 6+. Instantly viewable in any modern browser.

---

## 2. Key Features

### 🔐 Authentication Gatekeeper (`login.html`)

- Pre-filled one-click demo credentials (`admin@taskcrm.io` / `admin`).
- Defensive client-side validation with non-blocking inline error banners.
- Automatic routing: authenticated users visiting `login.html` are redirected immediately to the dashboard; unauthenticated access to protected pages routes to login.

### 📊 Dashboard (`dashboard.html`)

- **Living KPI Metrics**: Total Customers, Total Leads, Total Sales, and Pending Tasks dynamically computed from stored records.
- **Tabular Figures**: Enhanced readability using `font-variant-numeric: tabular-nums`.
- **Primary Metric Accent**: Total Sales revenue highlighted in the signature brick red accent.
- **Recent Activity Feed**: Chronological list of recent sales, customer additions, and task updates.
- **Sales Overview**: Visual breakdown of recent sales.

### 👥 Customer Directory (`customers.html`)

- **200ms Debounced Full-Text Search**: Live querying across Name, Email, and Company.
- **Status Filter**: Instant segmentation by Active, Inactive, and Prospect.
- **Combined Filtering**: Simultaneous search query and status filter evaluation.
- **Account Registration Modal**: Native accessible `<dialog>` for creating new customer accounts.
- **Zero-Match Empty State**: Disciplined empty message when queries yield no results.

### 🎯 Leads Pipeline (`leads.html`)

- **Outreach Tracker**: Tracks New, Contacted, and Converted prospect stages.
- **Overdue Date Detection**: Automatically highlights follow-up dates in the past.
- **Business Logic Protection**: Converted leads are explicitly exempt from overdue warnings.
- **Text Badges**: Multi-attribute badges (color + text label + symbol) ensure accessibility for color-blind users.

### 📋 Operational Tasks (`tasks.html`)

- **Workflow Queue**: Organized by Priority (Low, Medium, High) and Status (Pending, In Progress, Done).
- **Default Chronological Sorting**: Tasks automatically sort in ascending order of due date.
- **Overdue Pending Flagging**: Visually flags uncompleted tasks past their due date.
- **Interactive Quick Action**: One-click status toggling (Pending → In Progress → Done → Reopen).
- **Task Creation Modal**: Native accessible `<dialog>` for registering operational assignments.

---

## 3. Technology Stack

- **Markup**: Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<table>`, `<dialog>`)
- **Styling**: Vanilla CSS (Custom Properties, Flexbox, CSS Grid, Media Queries)
- **Logic**: Vanilla ECMAScript 6+ (No React, Vue, Angular, jQuery, or TypeScript)
- **Persistence**: Browser `localStorage` API
- **Fonts**: Inter via Google Fonts with system sans-serif fallback

> **Zero Forbidden Dependencies**: No Bootstrap, No Tailwind CSS, No bundlers (Vite/Webpack), No backend servers, No third-party state managers.

---

## 4. File & Folder Structure

```
gdgtask3CRM/
├── planning/
│   ├── product-brief.md         # Product goals, personas, scope
│   ├── visual-system.md         # Swiss design tokens, typography scale
│   ├── architecture-notes.md    # MVC separation and data flow
│   ├── build-log.md             # Development milestone log
│   └── stack-constraints.md     # Architectural guardrails
├── guidelines/
│   └── coding-standards.md      # Code style, HTML/CSS/JS standards
├── styles/
│   ├── reset.css                # CSS box-sizing & element normalization
│   ├── tokens.css               # Central palette, typography, spacing tokens
│   ├── base.css                 # Base typography, focus states, tabular numbers
│   ├── layout.css               # Top identity bar, horizontal nav rail, gutters
│   └── patterns.css             # Tables, badges, stat cards, dialogs, buttons
├── scripts/
│   ├── store.js                 # SOLE module accessing localStorage + seeds
│   ├── view.js                  # Stateless UI rendering methods
│   ├── helpers.js               # Debounce, date formatting, currency, IDs
│   └── pages/
│       ├── login.js             # Auth flow & inline validation
│       ├── dashboard.js         # Dynamic KPI computation & activity stream
│       ├── customers.js         # Debounced search & customer creation
│       ├── leads.js             # Pipeline filtering & overdue calculations
│       └── tasks.js             # Combined filters, sorting & status toggles
├── index.html                   # Root smart redirector
├── login.html                   # Operator authentication page
├── dashboard.html               # Operational dashboard
├── customers.html               # Customer directory & ledger
├── leads.html                   # Prospect pipeline
├── tasks.html                   # Operational task management
└── README.md                    # Project documentation
```

---

## 5. Setup & Local Run Instructions

Because Task CRM is a pure static web application, no installation or compilation steps are needed.

### Method A: Direct File Opening

Double-click `index.html` or `login.html` to open directly in any modern browser (Chrome, Edge, Firefox, Safari).

### Method B: Local Development Server (Recommended)

Using Python:

```bash
# In the project root directory:
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

Using Node (`npx serve`):

```bash
npx -y serve .
```

Using VS Code Live Server:
Right-click `login.html` and select **"Open with Live Server"**.

---

## 6. Demo Credentials

| Role                   | Email / Identifier | Password | Access Level              |
| ---------------------- | ------------------ | -------- | ------------------------- |
| **Lead Administrator** | `admin@taskcrm.io` | `admin`  | Full Read / Write / Reset |
| **Demo Operator**      | `demo@taskcrm.io`  | `demo`   | Standard Read / Write     |

> Click the **"Auto-fill"** button on `login.html` to instantly populate the credentials.

---

## 7. LocalStorage Architecture

In adherence to strict separation of concerns, **`scripts/store.js` is the ONLY file that interacts directly with `localStorage`**.

### Storage Keys:

- `task_crm_customers`: Array of customer account records.
- `task_crm_leads`: Array of sales prospect leads.
- `task_crm_tasks`: Array of operational assignments.
- `task_crm_sales`: Array of completed enterprise revenue transactions.
- `task_crm_activities`: Array of audit trail events.
- `task_crm_session`: Active authentication session token and user profile.

### Seed Data Initialization:

On initial launch, `store.js` detects whether storage is empty. If uninitialized, it populates realistic, enterprise-grade records (18 customers, 16 leads, 15 tasks, 10 sales, 8 activities). To re-seed the initial dataset at any time, click **"Reset Sample Data"** on the Dashboard.

---

## 8. Deployment Instructions

### Deploy to GitHub Pages

1. Push the repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Task CRM"
   git branch -M main
   git remote add origin https://github.com/your-username/task-crm.git
   git push -u origin main
   ```
2. Navigate to your repository on GitHub.
3. Go to **Settings** → **Pages**.
4. Under **Source**, choose `Deploy from a branch` and select `main` / `/ (root)`.
5. Click **Save**. Your site will be live at `https://your-username.github.io/task-crm/`.

### Deploy to Vercel

1. Install Vercel CLI (`npm i -g vercel`) or visit [vercel.com](https://vercel.com).
2. Import the Git repository or run:
   ```bash
   vercel
   ```
3. Accept the default settings (Framework preset: `Other`). Vercel will immediately deploy the static files.

---

## 9. Architectural Limitations & Trade-offs

- **Client-Side Storage Boundary**: Data is scoped to the individual browser instance (`localStorage`). Data modified in Chrome will not sync to Firefox or another machine.
- **Session Simulation**: Authentication is simulated on the client side for academic demonstration; production enterprise applications require server-side cryptographic JWT/session tokens over HTTPS.
- **Storage Quota**: Browsers typically limit `localStorage` to approximately 5MB to 10MB per origin, which is more than adequate for thousands of CRM records but unsuitable for high-resolution file attachments.
- **Single User Concurrency**: Without a WebSocket server or database backend, real-time multi-user concurrent editing is not supported.
