/**
 * Task CRM — Stateless UI View Rendering Engine (view.js)
 * Data-agnostic DOM/HTML generators for tables, stats, badges, and empty states.
 */

const TaskCRMView = (function () {
  'use strict';

  const H = window.TaskCRMHelpers;

  /**
   * Render a Swiss structural stat metric block
   * @param {string} label - Uppercase metric label
   * @param {string|number} value - Numeric or currency display
   * @param {Object} [options] - Configuration flags
   * @param {boolean} [options.highlight] - Accent red visual elevation
   * @param {string} [options.hint] - Supplementary contextual note
   * @returns {string} HTML string
   */
  function renderStatCell(label, value, options = {}) {
    const isHighlight = options.highlight ? 'stat-cell--highlight' : '';
    const hintHtml = options.hint ? `<span class="stat-cell__hint">${H.escapeHtml(options.hint)}</span>` : '';

    return `
      <div class="stat-cell ${isHighlight}">
        <span class="stat-cell__label">${H.escapeHtml(label)}</span>
        <span class="stat-cell__value tabular-nums">${H.escapeHtml(String(value))}</span>
        ${hintHtml}
      </div>
    `;
  }

  /**
   * Render accessible rectangular badge
   * Never relies on color alone; includes text + visual dot indicator
   * @param {string} text - Badge label text
   * @param {string} type - 'success' | 'warning' | 'danger' | 'info' | 'muted'
   * @returns {string} HTML string
   */
  function renderBadge(text, type = 'muted') {
    const safeText = H.escapeHtml(text);
    return `
      <span class="badge badge--${type}">
        <span class="badge__dot" aria-hidden="true"></span>
        <span>${safeText}</span>
      </span>
    `;
  }

  /**
   * Helper to map status to badge type
   */
  function getStatusBadgeType(status) {
    if (!status) return 'muted';
    const s = status.trim().toLowerCase();
    switch (s) {
      case 'active':
      case 'converted':
      case 'done':
        return 'success';
      case 'in progress':
      case 'contacted':
      case 'medium':
        return 'warning';
      case 'inactive':
      case 'high':
        return 'danger';
      case 'prospect':
      case 'new':
      case 'pending':
        return 'info';
      case 'low':
      default:
        return 'muted';
    }
  }

  /**
   * Render disciplined empty state message
   * @param {string} title - Heading
   * @param {string} description - Explanation
   * @param {string} [actionText] - Optional button label
   * @param {string} [actionId] - Button element ID
   * @returns {string} HTML string
   */
  function renderEmptyState(title, description, actionText = null, actionId = null) {
    const actionHtml = actionText && actionId
      ? `<button type="button" class="btn btn--secondary btn--sm" id="${H.escapeHtml(actionId)}">${H.escapeHtml(actionText)}</button>`
      : '';

    return `
      <div class="empty-state">
        <div class="empty-state__icon" aria-hidden="true">∅</div>
        <h3 class="empty-state__title">${H.escapeHtml(title)}</h3>
        <p class="empty-state__description">${H.escapeHtml(description)}</p>
        ${actionHtml}
      </div>
    `;
  }

  /**
   * Render inline alert notification
   * @param {string} message - Content
   * @param {'danger'|'success'|'info'} type - Semantic variant
   * @returns {string} HTML string
   */
  function renderInlineAlert(message, type = 'danger') {
    return `
      <div class="inline-alert inline-alert--${type}" role="alert">
        <span aria-hidden="true">${type === 'danger' ? '▲' : '●'}</span>
        <span>${H.escapeHtml(message)}</span>
      </div>
    `;
  }

  /**
   * Render editorial activity item
   * @param {Object} act - Activity record
   * @returns {string} HTML string
   */
  function renderActivityItem(act) {
    const isAccent = act.amount ? 'activity-dot--accent' : '';
    return `
      <div class="activity-item">
        <div class="activity-main">
          <span class="activity-dot ${isAccent}" aria-hidden="true"></span>
          <p class="activity-message">${H.escapeHtml(act.message)}</p>
        </div>
        <time class="activity-time">${H.escapeHtml(act.timestamp)}</time>
      </div>
    `;
  }

  /**
   * Render Customers Table Rows
   * Columns: Name, Email, Phone, Company, Status
   */
  function renderCustomersRows(customers) {
    if (!customers || customers.length === 0) {
      return `<tr><td colspan="5">${renderEmptyState('No customers found', 'No customer records match your current search query or status filter.')}</td></tr>`;
    }

    return customers
      .map(c => {
        const badgeType = getStatusBadgeType(c.status);
        return `
          <tr data-customer-id="${H.escapeHtml(c.id)}">
            <td><strong>${H.escapeHtml(c.name)}</strong></td>
            <td><a href="mailto:${H.escapeHtml(c.email)}" class="text-muted">${H.escapeHtml(c.email)}</a></td>
            <td class="tabular-nums">${H.escapeHtml(c.phone)}</td>
            <td>${H.escapeHtml(c.company)}</td>
            <td>${renderBadge(c.status, badgeType)}</td>
          </tr>
        `;
      })
      .join('');
  }

  /**
   * Render Leads Table Rows
   * Columns: Lead Name, Company, Contact, Status, Follow-up Date
   * Note: Converted leads should NEVER appear overdue!
   */
  function renderLeadsRows(leads) {
    if (!leads || leads.length === 0) {
      return `<tr><td colspan="5">${renderEmptyState('No leads found', 'No leads match the selected criteria.')}</td></tr>`;
    }

    return leads
      .map(lead => {
        const badgeType = getStatusBadgeType(lead.status);
        const overdue = H.isOverdue(lead.followUpDate, lead.status);
        const rowClass = overdue ? 'is-overdue-row' : '';
        const formattedDate = H.formatDate(lead.followUpDate);

        const dateDisplay = overdue
          ? `<span class="text-overdue" title="Action Overdue"><span aria-hidden="true">!</span> ${H.escapeHtml(formattedDate)} (Overdue)</span>`
          : `<span class="tabular-nums">${H.escapeHtml(formattedDate)}</span>`;

        return `
          <tr class="${rowClass}" data-lead-id="${H.escapeHtml(lead.id)}">
            <td><strong>${H.escapeHtml(lead.name)}</strong></td>
            <td>${H.escapeHtml(lead.company)}</td>
            <td><a href="mailto:${H.escapeHtml(lead.contact)}" class="text-muted">${H.escapeHtml(lead.contact)}</a></td>
            <td>${renderBadge(lead.status, badgeType)}</td>
            <td>${dateDisplay}</td>
          </tr>
        `;
      })
      .join('');
  }

  /**
   * Render Tasks Table Rows
   * Columns: Task, Date, Priority, Status, Action
   */
  function renderTasksRows(tasks) {
    if (!tasks || tasks.length === 0) {
      return `<tr><td colspan="5">${renderEmptyState('No tasks found', 'No operational tasks match your active filter settings.')}</td></tr>`;
    }

    return tasks
      .map(t => {
        const priorityBadge = renderBadge(t.priority, getStatusBadgeType(t.priority));
        const statusBadge = renderBadge(t.status, getStatusBadgeType(t.status));
        const overdue = H.isOverdue(t.date, t.status);
        const rowClass = overdue ? 'is-overdue-row' : '';
        const formattedDate = H.formatDate(t.date);

        const dateDisplay = overdue
          ? `<span class="text-overdue" title="Task Overdue"><span aria-hidden="true">!</span> ${H.escapeHtml(formattedDate)} (Overdue)</span>`
          : `<span class="tabular-nums">${H.escapeHtml(formattedDate)}</span>`;

        const isDone = t.status === 'Done';
        const actionBtnText = isDone ? 'Reopen' : 'Mark Done';

        return `
          <tr class="${rowClass}" data-task-id="${H.escapeHtml(t.id)}">
            <td>
              <span class="${isDone ? 'text-muted' : ''}">${H.escapeHtml(t.task)}</span>
            </td>
            <td>${dateDisplay}</td>
            <td>${priorityBadge}</td>
            <td>${statusBadge}</td>
            <td>
              <button type="button" class="btn btn--secondary btn--sm task-toggle-btn" data-id="${H.escapeHtml(t.id)}">
                ${actionBtnText}
              </button>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  /**
   * Global Layout Initializer for Protected Pages
   * Binds current user profile, sets active navigation indicator, wires logout
   */
  function setupShell(activePage) {
    // Session Display
    const currentUser = window.TaskCRMStore.getCurrentUser();
    const userDisplayEl = document.getElementById('sessionUserDisplay');
    if (userDisplayEl && currentUser) {
      userDisplayEl.textContent = currentUser.email;
    }

    // Active Nav Highlight
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const pageTarget = link.getAttribute('data-page');
      if (pageTarget === activePage) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });

    // Logout wireup
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        window.TaskCRMStore.logout();
        window.location.href = 'login.html';
      });
    }
  }

  return {
    renderStatCell,
    renderBadge,
    renderEmptyState,
    renderInlineAlert,
    renderActivityItem,
    renderCustomersRows,
    renderLeadsRows,
    renderTasksRows,
    setupShell
  };
})();

// Attach to window
window.TaskCRMView = TaskCRMView;
