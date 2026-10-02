# Task CRM — Stack & Technical Constraints

## 1. Architectural Guardrails

To meet academic and technical assessment requirements, this project operates under strict architectural constraints. Any deviation constitutes a non-compliance issue.

| Allowed Technology | Disallowed / Forbidden Technology | Rationale |
|---|---|---|
| **Semantic HTML5** | React, Vue, Angular, Svelte, Lit | Must operate as pure static documents without virtual DOM or hydration layers. |
| **Vanilla CSS (Tokens, Grid, Flex)** | Tailwind CSS, Bootstrap, Bulma, Sass, LESS | Custom architectural tokens ensure deep CSS mastery and adherence to the Swiss editorial grid. |
| **Vanilla Modern JavaScript (ES6+)** | TypeScript, Babel, Webpack, Vite, Rollup | Zero-compilation architecture: code written is directly executed by the browser engine. |
| **Browser `localStorage`** | Node.js, Express, MongoDB, Firebase, Supabase, REST APIs | Client-side self-contained persistence for 100% static hosting on GitHub Pages and Vercel. |
| **Native `<dialog>` / DOM Overlays** | External modal packages, jQuery UI | Preserves native browser accessibility (Esc dismiss, modal trap) without runtime weight. |

---

## 2. Hard Architectural Rules

### Rule 1: Centralized Storage Access (`store.js` Exclusivity)
- Direct invocation of `localStorage.getItem`, `localStorage.setItem`, `localStorage.removeItem`, or `localStorage.clear` outside of `scripts/store.js` is strictly prohibited.
- All view controllers interact with data through the defined `store` API methods.

### Rule 2: Zero Native Dialog Alerts
- The browser methods `window.alert()`, `window.confirm()`, and `window.prompt()` are strictly forbidden.
- All validation feedback, session alerts, and inline confirmation cues must be rendered through non-blocking, accessible DOM nodes via `view.js`.

### Rule 3: Zero Hardcoded Colors in JavaScript
- Script files must never inject hardcoded hex, RGB, or HSL color codes into inline DOM attributes (e.g. `element.style.color = '#E43D30'`).
- Styling modifications must strictly use semantic CSS class toggles (`.is-overdue`, `.is-active`, `.badge--danger`) or reference CSS custom properties (`var(--color-accent)`).

### Rule 4: Tabular Layout & Semantic Forms
- Data tables must use genuine `<table>`, `<thead>`, `<tbody>`, `<th>`, `<tr>`, `<td>` elements wrapped in a horizontal scroll container (`.table-container`) for mobile accessibility.
- Forms must use explicit `<label for="...">` associations, proper input types (`email`, `tel`, `date`, `password`), and aria descriptors.

### Rule 5: Static Deployment Ready
- All asset paths must use relative paths (`./styles/...`, `./scripts/...`) to guarantee flawless execution under sub-path hosting (e.g. `username.github.io/task-crm/`).
