# Task CRM — Product Brief

## 1. Executive Summary
**Task CRM** is a client-side Customer Relationship Management web application engineered for college-level frontend assessment and real-world portfolio demonstration. Designed with a strict **Swiss International / Editorial** aesthetic, it balances dense information displays with rigorous typography, asymmetric balance, structural line systems, and functional micro-interactions.

The system runs entirely in the browser using modern vanilla web technologies (HTML5, Vanilla CSS, ECMAScript 6+), leveraging `localStorage` for offline persistence and zero-backend portability.

---

## 2. Core Value Proposition
- **Lightweight & Zero-Build**: Instantly runnable on any static web server (GitHub Pages, Vercel, local HTTP server) without node build pipelines or bundlers.
- **Data-Driven & Dynamic**: All metrics, search indexes, filters, and activity logs are derived live from client-side stored datasets.
- **Editorial Precision**: Deviates from standard rounded-card SaaS templates in favor of a disciplined grid, visible rules (`1px solid var(--border)`), high-contrast sans-serif typography, and restrained vermilion/brick red accents.
- **Usable CRM Workflows**: Supports the end-to-end customer journey from prospective leads to qualified active accounts and operational tasks.

---

## 3. User Personas & Use Cases

### Primary Persona: Sales Operations Specialist
- Needs quick at-a-glance visibility into company sales numbers, active leads, pipeline conversion status, and pending operational tasks.
- Values fast tabular scanning, keyboard-accessible filters, and instantaneous search over heavy visual noise.

### Secondary Persona: Account Executive / Relationship Manager
- Tracks customer details (phone, email, corporate account, operational status).
- Manages lead outreach cadence with clear visual flags for overdue follow-up dates.
- Sorts and executes tasks by urgency and operational priority.

---

## 4. Key Functional Requirements

| Module | Purpose | Key Capabilities |
|---|---|---|
| **Authentication** | Session gatekeeper | Validates credentials against store, manages session token, handles inline validation errors and redirection. |
| **Executive Dashboard** | Core KPI summary | Dynamic customer/lead/sales/task metrics, prominent accent metric, tabular numbers, editorial activity stream, and monthly sales breakdown. |
| **Customer Directory** | Account directory | Debounced full-text search (Name, Email, Company), multi-status filtering (Active, Inactive, Prospect), modal account creation, and empty states. |
| **Leads Pipeline** | Prospecting tracker | Status filtering (New, Contacted, Converted), overdue follow-up indicators (excluding converted leads), and contact metadata. |
| **Task Management** | Operational workflow | Priority filter (Low, Medium, High), Status filter (Pending, In Progress, Done), overdue pending detection, and chronological date sorting. |

---

## 5. Non-Functional Goals
- **Strict Accessibility (WCAG 2.1 AA)**: High contrast, explicit visible focus indicators, semantic landmarks, ARIA labels, and text-supplemented status indicators.
- **Responsive Fluidity**: Seamlessly transitions across 375px mobile, 768px tablet, and 1440px desktop viewports without JavaScript screen-size sniffing.
- **Predictable State Flow**: Single source of truth in `store.js`, stateless rendering through `view.js`, decoupled utilities in `helpers.js`.
