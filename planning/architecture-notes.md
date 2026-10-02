# Task CRM — Technical Architecture Notes

## 1. Architectural Philosophy
Task CRM strictly adheres to standard Multi-Page Application (MPA) principles built with vanilla web technologies. It avoids build-step bloat and framework abstraction layers while implementing a clean, modular Model-View-Controller (MVC) separation of concerns tailored for a second-year Computer Science & Engineering standard.

```
┌────────────────────────────────────────────────────────┐
│                      Browser / DOM                     │
└────────────────────────────────────────────────────────┘
          ▲                                    │
          │ View rendering (DOM updates)       │ User events (clicks, inputs)
          │                                    ▼
┌───────────────────┐               ┌────────────────────┐
│      view.js      │               │   Page Controllers │
│ (Stateless UI     │               │ (login, dashboard, │
│  HTML Generators) │               │  customers, etc.)  │
└───────────────────┘               └────────────────────┘
          ▲                                    │
          │ Filtered / Derived Data            │ CRUD / Query Calls
          │                                    ▼
┌───────────────────┐               ┌────────────────────┐
│     helpers.js    │               │      store.js      │
│ (Debounce, Dates, │◄──────────────┤ (Single Gatekeeper │
│  Currency, IDs)   │               │   to localStorage) │
└───────────────────┘               └────────────────────┘
                                               │
                                               ▼
                                    ┌────────────────────┐
                                    │ Browser            │
                                    │ localStorage API   │
                                    └────────────────────┘
```

---

## 2. Separation of Concerns & Modules

### 2.1 `scripts/store.js` (The Model & Storage Gatekeeper)
- **Sole Custodian of `localStorage`**: No other file is permitted to call `localStorage.getItem` or `localStorage.setItem`.
- **Seed State Management**: Automatically detects if records exist in browser storage. If empty, seeds realistic, curated datasets:
  - 18 realistic Customers (diverse names, real companies, verified phone formats, active/inactive/prospect status).
  - 18 realistic Leads (assigned pipeline status, follow-up dates covering past overdue, today, and future).
  - 18 realistic Tasks (priority Low/Medium/High, status Pending/In Progress/Done, varied due dates).
  - 12 realistic Historical Sales transactions with amounts, customer references, and timestamps.
  - 15 realistic CRM Activity stream records.
  - Active Session Auth Flag (`task_crm_auth_session`).
- **Data Access API**:
  - `getCustomers()`, `addCustomer(data)`, `updateCustomer(id, data)`, `deleteCustomer(id)`
  - `getLeads()`, `addLead(data)`, `updateLead(id, data)`
  - `getTasks()`, `addTask(data)`, `updateTask(id, data)`, `toggleTaskStatus(id)`
  - `getActivities(limit)`
  - `getSales()`
  - `getDashboardStats()`: computes dynamic aggregates directly from living store datasets.
  - `login(username, password)`, `logout()`, `isAuthenticated()`, `getCurrentUser()`

### 2.2 `scripts/view.js` (Stateless UI Renderer)
- Pure rendering methods that return sanitized HTML strings or DOM elements.
- **Data-Agnostic**: Does not know where data came from or what triggered it.
- Key modules:
  - `renderStatCard(label, value, options)`: Creates structural stat metrics with tabular numbers and optional accent highlighting.
  - `renderBadge(text, type)`: Emits accessible rectangular badges containing accessible semantic text markers.
  - `renderEmptyState(title, description, actionText, actionId)`: Displays disciplined empty state graphics when queries match 0 records.
  - `renderTable(headers, rowsHtml, options)`: Wraps table structure inside accessible, responsive scrolling containers.
  - `renderInlineAlert(message, type)`: Accessible live status alerts (e.g. login failure, save confirmations).
  - `renderActivityItem(activity)`: Formats editorial timestamped activity log items.

### 2.3 `scripts/helpers.js` (Shared Utilities)
- `debounce(fn, delay)`: High-precision ~200ms debouncing for customer search input.
- `formatDate(isoString)`: Human-friendly date formatting (e.g., "Oct 14, 2026").
- `isOverdue(dateString, status)`: Determines whether a date is in the past, accurately excluding Converted leads or Done tasks.
- `formatCurrency(amount)`: Formats numeric currency with thousands separators and dollar currency symbols (`$142,850`).
- `generateId(prefix)`: Generates clean, collision-free unique identifier keys (`cust_1727448000_abc1`).
- `escapeHtml(str)`: Defensive sanitation helper against Cross-Site Scripting (XSS).

### 2.4 Page Controllers (`scripts/pages/*.js`)
Each HTML page corresponds to a dedicated controller script loaded via standard script tag:
- **`login.js`**: Enforces authentication gatekeeping. Redirects authenticated users straight to `dashboard.html`. Handles form submission, credential verification, and inline error presentation.
- **`dashboard.js`**: Queries `store.getDashboardStats()` and `store.getActivities()`, builds the structural KPI grid and the editorial activity timeline.
- **`customers.js`**: Manages UI search query, status dropdown state, combines filter logic, calls `view.renderCustomersTable()`, and coordinates the "New Customer" creation dialog.
- **`leads.js`**: Filters leads by status, calculates overdue warning flags, renders lead table, and allows modal lead creation.
- **`tasks.js`**: Handles combined status and priority filtering, chronological sorting by deadline, overdue pending calculations, and task completion toggles.

---

## 3. Authentication & Page Protection Workflow

```
Page Loaded (e.g. customers.html)
    │
    ▼
Is Page Protected?
    ├── YES ──► Check store.isAuthenticated()
    │               ├── FALSE ──► Redirect to login.html
    │               └── TRUE  ──► Initialize Page Controller
    │
    └── NO (login.html)
            ──► Check store.isAuthenticated()
                    ├── TRUE  ──► Redirect to dashboard.html
                    └── FALSE ──► Render Login Form
```

---

## 4. Performance & Portability Guarantees
- **Static Hosting**: 100% compatible with GitHub Pages, Vercel, Netlify, Cloudflare Pages, and local `file://` or `python -m http.server`.
- **Zero Third-Party Dependencies**: No external runtime libraries required for core operation.
- **Google Fonts**: Inter loaded asynchronously with `font-display: swap` and system sans-serif fallback stack for zero Cumulative Layout Shift (CLS).
