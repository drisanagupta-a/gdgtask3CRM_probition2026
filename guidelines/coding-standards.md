# Task CRM — Engineering & Coding Standards

## 1. Principles
Every line of code written in Task CRM must be readable, maintainable, modular, and explainable by a second-year Computer Science undergraduate student. Clever or esoteric JavaScript hacks are rejected in favor of explicit, robust logic.

---

## 2. HTML Standards
1. **Strict Semantics**:
   - Use `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` landmarks.
   - Use `<table>` structure for tabular datasets (never faux-div tables).
   - Use `<button type="button">` or `<button type="submit">` for all click actions (never `<a href="#">` or `<div onclick="...">`).
2. **Accessible Forms**:
   - Every input field must have an explicitly paired `<label for="...">`.
   - Error messages must be attached via `aria-describedby` or live region (`role="alert"`).
   - Inputs must declare explicit `type`, `autocomplete`, and descriptive `placeholder` attributes.
3. **No Inline Styling**:
   - Zero `style="..."` attributes in HTML markup. All visual presentation belongs in CSS stylesheets.

---

## 3. CSS Standards
1. **Tokens Over Hardcoded Literals**:
   - Always reference colors, font sizes, radii, and spacing from CSS Custom Properties defined in `styles/tokens.css` (e.g. `var(--color-ink)`, `var(--space-4)`).
2. **File Organization**:
   - `reset.css`: Modern CSS box-sizing, margin resets, standard font inheritance.
   - `tokens.css`: Color palettes, typography variables, spacing scale, border widths.
   - `base.css`: Global HTML typography, selection styling, focus rings, base body layout.
   - `layout.css`: Identity bar, navigation rail, responsive grid wrappers, main containers.
   - `patterns.css`: Components (tables, badges, buttons, inputs, stat displays, modals, empty states).
3. **Responsive Architecture**:
   - Use standard CSS media queries (`min-width` / `max-width`).
   - Breakpoints:
     - Mobile: `<= 767px`
     - Tablet: `768px – 1024px`
     - Desktop: `>= 1025px`
   - Never query `window.innerWidth` in JavaScript to trigger layout shifts.
4. **Accessibility & Motion**:
   - Always define an explicit `:focus-visible` state (`outline: 2px solid var(--color-ink)`).
   - Wrap transitions in `@media (prefers-reduced-motion: no-preference)` to respect user vestibular preferences.

---

## 4. JavaScript Standards
1. **Module Cleanliness**:
   - `store.js` is the sole reader/writer of `localStorage`.
   - `view.js` generates HTML / DOM nodes without embedding business state.
   - `helpers.js` provides pure, testable utility functions.
   - Page scripts coordinate user input, call store methods, and invoke view updates.
2. **Zero Global Scope Pollution**:
   - Group page logic inside self-contained objects or immediately executed modules (`TaskCRM.Store`, `TaskCRM.View`, `TaskCRM.Helpers`, or page controller listeners).
3. **Immutability & Defensive Data Handling**:
   - Never mutate stored objects directly; always return fresh cloned arrays or objects from store methods.
   - Escape user-supplied strings before rendering into innerHTML using `helpers.escapeHtml()` to neutralize potential XSS vectors.
4. **Asynchronous Grace**:
   - Implement debouncing (~200ms) for high-frequency input events like customer search.
   - Avoid busy-waiting, `setTimeout` polling, or blocking loops.
