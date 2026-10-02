const TaskCRMView = (function () {
  'use strict';

  const H = window.TaskCRMHelpers;

  function renderStatCell(label, value, options = {}) {
    const isHighlight = options.highlight ? 'stat-cell--highlight' : '';
    const hintHtml = options.hint
      ? `<span class="stat-cell__hint">${H.escapeHtml(options.hint)}</span>`
      : '';

    return `
      <div class="stat-cell ${isHighlight}">
        <span class="stat-cell__label">${H.escapeHtml(label)}</span>
        <span class="stat-cell__value tabular-nums">${H.escapeHtml(String(value))}</span>
        ${hintHtml}
      </div>
    `;
  }

  function renderBadge(text, type = 'muted') {
    const safeText = H.escapeHtml(text);

    return `
      <span class="badge badge--${type}">
        <span class="badge__dot" aria-hidden="true"></span>
        <span>${safeText}</span>
      </span>
    `;
  }

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

  function renderInlineAlert(message, type = 'danger') {
    return `
      <div class="inline-alert inline-alert--${type}" role="alert">
        <span aria-hidden="true">${type === 'danger' ? '▲' : '●'}</span>
        <span>${H.escapeHtml(message)}</span>
      </div>
    `;
  }

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

  function renderCustomersRows(customers) {
    if (!customers || customers.length === 0) {
      return `
        <tr>
          <td colspan="6">
            ${renderEmptyState(
              'No customers found',
              'No customer records match your current search query or status filter.'
            )}
          </td>
        </tr>
      `;
    }

    return customers
      .map((customer, index) => {
        const badgeType = getStatusBadgeType(customer.status);

        return `
          <tr class="customer-row" data-customer-id="${H.escapeHtml(customer.id)}" style="--row-index:${index}">
            <td>
              <div class="customer-name-cell">
                <div class="customer-avatar">
                  ${H.escapeHtml((customer.name || '?').charAt(0).toUpperCase())}
                </div>
                <div>
                  <strong>${H.escapeHtml(customer.name)}</strong>
                  <span class="customer-record-label">Customer</span>
                </div>
              </div>
            </td>

            <td>
              <a href="mailto:${H.escapeHtml(customer.email)}" class="customer-email">
                ${H.escapeHtml(customer.email)}
              </a>
            </td>

            <td class="tabular-nums">
              ${H.escapeHtml(customer.phone)}
            </td>

            <td>
              <span class="customer-company">
                ${H.escapeHtml(customer.company)}
              </span>
            </td>

            <td>
              ${renderBadge(customer.status, badgeType)}
            </td>

            <td>
              <div class="customer-actions">
                <button
                  type="button"
                  class="customer-action-btn customer-action-btn--edit"
                  data-action="edit"
                  data-id="${H.escapeHtml(customer.id)}"
                  title="Edit customer"
                  aria-label="Edit ${H.escapeHtml(customer.name)}"
                >
                  <i class="fa-solid fa-pen"></i>
                </button>

                <button
                  type="button"
                  class="customer-action-btn customer-action-btn--delete"
                  data-action="delete"
                  data-id="${H.escapeHtml(customer.id)}"
                  title="Delete customer"
                  aria-label="Delete ${H.escapeHtml(customer.name)}"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  function renderLeadsRows(leads) {
    if (!leads || leads.length === 0) {
      return `
        <tr>
          <td colspan="5">
            ${renderEmptyState(
              'No leads found',
              'No leads match the selected criteria.'
            )}
          </td>
        </tr>
      `;
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

  function renderTasksRows(tasks) {
    if (!tasks || tasks.length === 0) {
      return `
        <tr>
          <td colspan="5">
            ${renderEmptyState(
              'No tasks found',
              'No operational tasks match your active filter settings.'
            )}
          </td>
        </tr>
      `;
    }

    return tasks
      .map(t => {
        const priorityBadge = renderBadge(
          t.priority,
          getStatusBadgeType(t.priority)
        );

        const statusBadge = renderBadge(
          t.status,
          getStatusBadgeType(t.status)
        );

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
              <span class="${isDone ? 'text-muted' : ''}">
                ${H.escapeHtml(t.task)}
              </span>
            </td>

            <td>${dateDisplay}</td>
            <td>${priorityBadge}</td>
            <td>${statusBadge}</td>

            <td>
              <button
                type="button"
                class="btn btn--secondary btn--sm task-toggle-btn"
                data-id="${H.escapeHtml(t.id)}"
              >
                ${actionBtnText}
              </button>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  function setupShell(activePage) {
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

window.TaskCRMView = TaskCRMView;