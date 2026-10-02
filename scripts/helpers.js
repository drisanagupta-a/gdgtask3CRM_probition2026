const TaskCRMHelpers = (function () {
  'use strict';

  function debounce(fn, delayMs = 200) {
    let timer = null;

    return function (...args) {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delayMs);
    };
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) return dateStr;

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  function isOverdue(dateStr, status) {
    if (!dateStr) return false;

    if (status) {
      const normalizedStatus = status.trim().toLowerCase();

      if (normalizedStatus === 'converted' || normalizedStatus === 'done') {
        return false;
      }
    }

    const targetDate = new Date(dateStr);

    if (isNaN(targetDate.getTime())) return false;

    const targetMidnight = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate()
    ).getTime();

    const now = new Date();

    const todayMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();

    return targetMidnight < todayMidnight;
  }

  function formatCurrency(amount) {
    const numeric = typeof amount === 'number'
      ? amount
      : parseFloat(amount) || 0;

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numeric);
  }

  function formatNumber(val) {
    const numeric = typeof val === 'number'
      ? val
      : parseInt(val, 10) || 0;

    return new Intl.NumberFormat('en-US').format(numeric);
  }

  function generateId(prefix = 'item') {
    const timestamp = Math.floor(Date.now() / 1000);
    const randomHex = Math.random().toString(16).substring(2, 6);

    return `${prefix}_${timestamp}_${randomHex}`;
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';

    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  return {
    debounce,
    formatDate,
    isOverdue,
    formatCurrency,
    formatNumber,
    generateId,
    escapeHtml
  };
})();

window.TaskCRMHelpers = TaskCRMHelpers;