document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const store = window.TaskCRMStore;
  const view = window.TaskCRMView;
  const helpers = window.TaskCRMHelpers;

  if (!store.isAuthenticated()) {
    window.location.replace('login.html');
    return;
  }

  view.setupShell('dashboard');

  const statsContainer = document.getElementById('dashboardStatsContainer');
  const goalsContainer = document.getElementById('goalsContainer');
  const pipelineContainer = document.getElementById('leadPipelineContainer');
  const leadsContainer = document.getElementById('recentLeadsContainer');
  const activityContainer = document.getElementById('recentActivitiesContainer');
  const tasksContainer = document.getElementById('todayTasksContainer');

  function renderMetrics() {
    if (!statsContainer) return;

    const stats = store.getDashboardStats();

    statsContainer.innerHTML = `
      <article class="dashboard-kpi">
        <div class="dashboard-kpi__top">
          <span class="dashboard-kpi__label">Total Customers</span>
          <span class="dashboard-kpi__icon dashboard-kpi__icon--orange">C</span>
        </div>

        <strong class="dashboard-kpi__value">
          ${helpers.formatNumber(stats.totalCustomers)}
        </strong>

        <span class="dashboard-kpi__hint">
          ${stats.activeCustomers} active customers
        </span>
      </article>

      <article class="dashboard-kpi">
        <div class="dashboard-kpi__top">
          <span class="dashboard-kpi__label">Total Leads</span>
          <span class="dashboard-kpi__icon dashboard-kpi__icon--blue">L</span>
        </div>

        <strong class="dashboard-kpi__value">
          ${helpers.formatNumber(stats.totalLeads)}
        </strong>

        <span class="dashboard-kpi__hint">
          ${stats.convertedLeads} converted leads
        </span>
      </article>

      <article class="dashboard-kpi dashboard-kpi--sales">
        <div class="dashboard-kpi__top">
          <span class="dashboard-kpi__label">Total Sales</span>
          <span class="dashboard-kpi__icon dashboard-kpi__icon--orange">₹</span>
        </div>

        <strong class="dashboard-kpi__value">
          ${helpers.formatCurrency(stats.totalSales)}
        </strong>

        <span class="dashboard-kpi__hint">
          Revenue to date
        </span>
      </article>

      <article class="dashboard-kpi">
        <div class="dashboard-kpi__top">
          <span class="dashboard-kpi__label">Pending Tasks</span>
          <span class="dashboard-kpi__icon dashboard-kpi__icon--green">✓</span>
        </div>

        <strong class="dashboard-kpi__value">
          ${helpers.formatNumber(stats.pendingTasks)}
        </strong>

        <span class="dashboard-kpi__hint">
          Tasks needing attention
        </span>
      </article>
    `;
  }

  function renderGoals() {
    if (!goalsContainer) return;

    const stats = store.getDashboardStats();

    const goal = 100000;
    const rawPercentage = (stats.totalSales / goal) * 100;
    const percentage = Math.min(Math.max(rawPercentage, 0), 100);
    const displayPercentage = Math.round(rawPercentage);

    const segmentCount = 24;
    const activeSegments = Math.round((percentage / 100) * segmentCount);

    let segments = '';

    for (let i = 0; i < segmentCount; i += 1) {
      const angle = -90 + (i * (180 / (segmentCount - 1)));

      segments += `
        <span
          class="goal-segment ${i < activeSegments ? 'is-active' : ''}"
          style="--segment-angle:${angle}deg;"
        ></span>
      `;
    }

    goalsContainer.innerHTML = `
      <div class="reference-goal">

        <div class="reference-goal__gauge">

          <div class="goal-segments">
            ${segments}
          </div>

          <div class="goal-scale">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>

          <div class="reference-goal__center">
            <strong>
              ${helpers.formatCurrency(stats.totalSales)}
            </strong>

            <span>
              Out Of ${helpers.formatCurrency(goal)}
            </span>
          </div>

        </div>

      </div>
    `;
  }

  function getMonthKey(dateValue) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  function renderLeadPipeline() {
    if (!pipelineContainer) return;

    const leads = store.getLeads() || [];
    const customers = store.getCustomers() || [];

    if (!leads.length) {
      pipelineContainer.innerHTML = `
        <div class="dashboard-empty">
          <strong>No leads available</strong>
          <span>Add leads to see your lead status.</span>
        </div>
      `;
      return;
    }

    const statuses = [
      {
        name: 'New',
        className: 'new'
      },
      {
        name: 'Contacted',
        className: 'contacted'
      },
      {
        name: 'Converted',
        className: 'converted'
      }
    ];

    const counts = statuses.map(status => ({
      ...status,
      count: leads.filter(lead => lead.status === status.name).length
    }));

    const customerStatuses = [
      {
        name: 'Active',
        className: 'active'
      },
      {
        name: 'Inactive',
        className: 'inactive'
      },
      {
        name: 'Prospect',
        className: 'prospect'
      }
    ];

    const customerCounts = customerStatuses.map(status => ({
      ...status,
      count: customers.filter(customer => customer.status === status.name).length
    }));

    const customerTotal = customers.length || 1;

    const currentDate = new Date();
    const months = [];

    for (let i = 11; i >= 0; i -= 1) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );

      months.push({
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        label: date.toLocaleString('en-IN', { month: 'short' })
      });
    }

    const statusMonthData = statuses.map(status => {
      const values = months.map(month => {
        return leads.filter(lead => {
          return lead.status === status.name &&
            getMonthKey(lead.followUpDate) === month.key;
        }).length;
      });

      return {
        ...status,
        values,
        total: status.count
      };
    });

    const maxMonthlyValue = Math.max(
      ...statusMonthData.flatMap(status => status.values),
      1
    );

    function createDots(status) {
      return months.map((month, monthIndex) => {
        const value = status.values[monthIndex];

        if (!value) {
          return `
            <span class="lead-month-dot lead-month-dot--empty"></span>
          `;
        }

        const size = 7 + Math.min((value / maxMonthlyValue) * 13, 13);

        return `
          <span
            class="lead-month-dot lead-month-dot--${status.className}"
            style="--dot-size:${size}px;"
            title="${status.name}: ${value} lead${value === 1 ? '' : 's'} in ${month.label}"
          ></span>
        `;
      }).join('');
    }

    const leadRows = statusMonthData.map(status => {
      return `
        <div class="lead-source-row">

          <div class="lead-source-label">
            <span>${status.name}</span>
            <strong>${status.total}</strong>
          </div>

          <div class="lead-source-track">
            <span class="lead-source-line"></span>

            <div class="lead-source-dots">
              ${createDots(status)}
            </div>
          </div>

        </div>
      `;
    }).join('');

    const activePercentage =
      Math.round((customerCounts[0].count / customerTotal) * 100);

    const inactivePercentage =
      Math.round((customerCounts[1].count / customerTotal) * 100);

    const prospectPercentage =
      Math.round((customerCounts[2].count / customerTotal) * 100);

    const ringData = [
      {
        className: 'active',
        name: 'Active',
        percentage: activePercentage,
        count: customerCounts[0].count
      },
      {
        className: 'inactive',
        name: 'Inactive',
        percentage: inactivePercentage,
        count: customerCounts[1].count
      },
      {
        className: 'prospect',
        name: 'Prospect',
        percentage: prospectPercentage,
        count: customerCounts[2].count
      }
    ];

    const ringLayers = ringData.map((item, index) => {
      const radius = 76 - (index * 14);
      const circumference = 2 * Math.PI * radius;
      const dash = (item.percentage / 100) * circumference;

      return `
        <div
          class="customer-ring customer-ring--${item.className}"
          style="
            --ring-radius:${radius}px;
            --ring-circumference:${circumference};
            --ring-dash:${dash};
          "
        ></div>
      `;
    }).join('');

    const customerLegend = ringData.map(item => {
      return `
        <div class="customer-ring-label customer-ring-label--${item.className}">
          <span class="customer-ring-label__dot"></span>
          <span>${item.name}</span>
          <strong>${item.count}</strong>
        </div>
      `;
    }).join('');

    pipelineContainer.innerHTML = `
      <div class="lead-status-reference">

        <div class="lead-status-chart">

          <div class="lead-month-grid">
            ${months.map(month => `
              <span>${month.label}</span>
            `).join('')}
          </div>

          <div class="lead-status-rows">
            ${leadRows}
          </div>

          <div class="lead-month-labels">
            ${months.map(month => `
              <span>${month.label}</span>
            `).join('')}
          </div>

        </div>

        <div class="customer-status-chart">

          <div class="customer-rings">
            ${ringLayers}

            <div class="customer-rings-center">
              <strong>${customers.length}</strong>
              <span>Customers</span>
            </div>
          </div>

          <div class="customer-status-legend">
            ${customerLegend}
          </div>

        </div>

      </div>
    `;
  }

  function renderRecentLeads() {
    if (!leadsContainer) return;

    const leads = store.getLeads().slice(0, 5);

    if (!leads.length) {
      leadsContainer.innerHTML = `
        <div class="dashboard-empty">
          <strong>No recent leads</strong>
          <span>Your new leads will appear here.</span>
        </div>
      `;
      return;
    }

    leadsContainer.innerHTML = `
      <div class="dashboard-record-list">
        ${leads.map(lead => `
          <div class="dashboard-record">

            <div class="dashboard-record__avatar">
              ${helpers.escapeHtml(
                (lead.name || '?').charAt(0).toUpperCase()
              )}
            </div>

            <div class="dashboard-record__content">
              <strong>${helpers.escapeHtml(lead.name)}</strong>
              <span>${helpers.escapeHtml(lead.company)}</span>
            </div>

            <span class="dashboard-status dashboard-status--${lead.status.toLowerCase()}">
              ${helpers.escapeHtml(lead.status)}
            </span>

          </div>
        `).join('')}
      </div>
    `;
  }

  function renderActivities() {
    if (!activityContainer) return;

    const activities = store.getActivities(5);

    if (!activities || activities.length === 0) {
      activityContainer.innerHTML = `
        <div class="dashboard-empty">
          <strong>No recent activity</strong>
          <span>New CRM activity will appear here.</span>
        </div>
      `;
      return;
    }

    const itemsHtml = activities
      .map(activity => view.renderActivityItem(activity))
      .join('');

    activityContainer.innerHTML = `
      <div class="activity-stream dashboard-activity-stream">
        ${itemsHtml}
      </div>
    `;
  }

  function renderTodayTasks() {
    if (!tasksContainer) return;

    const tasks = store.getTasks();
    const today = new Date().toISOString().split('T')[0];

    const todayTasks = tasks
      .filter(task => task.status !== 'Done')
      .sort((a, b) => {
        const aToday = a.date === today ? 0 : 1;
        const bToday = b.date === today ? 0 : 1;

        if (aToday !== bToday) {
          return aToday - bToday;
        }

        return String(a.date || '').localeCompare(
          String(b.date || '')
        );
      })
      .slice(0, 5);

    if (!todayTasks.length) {
      tasksContainer.innerHTML = `
        <div class="dashboard-empty">
          <strong>You're all caught up</strong>
          <span>No pending tasks need attention.</span>
        </div>
      `;
      return;
    }

    tasksContainer.innerHTML = `
      <div class="dashboard-record-list">
        ${todayTasks.map(task => `
          <div class="dashboard-task">

            <span class="dashboard-task__check"></span>

            <div class="dashboard-task__content">
              <strong>${helpers.escapeHtml(task.task)}</strong>
              <span>${helpers.escapeHtml(task.date || 'No date')}</span>
            </div>

            <span class="task-priority task-priority--${String(
              task.priority || 'Medium'
            ).toLowerCase()}">
              ${helpers.escapeHtml(task.priority || 'Medium')}
            </span>

          </div>
        `).join('')}
      </div>
    `;
  }

  function renderDashboard() {
    renderMetrics();
    renderGoals();
    renderLeadPipeline();
    renderRecentLeads();
    renderActivities();
    renderTodayTasks();
  }

  renderDashboard();

  const resetDemoBtn = document.getElementById('resetDataBtn');

  if (resetDemoBtn) {
    resetDemoBtn.addEventListener('click', () => {
      store.resetToSeeds();
      renderDashboard();
    });
  }
});