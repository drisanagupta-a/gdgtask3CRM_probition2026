document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const store = window.TaskCRMStore;
  const view = window.TaskCRMView;
  const helpers = window.TaskCRMHelpers;

  if (!store.isAuthenticated()) {
    window.location.replace('login.html');
    return;
  }

  view.setupShell('customers');

  const searchInput = document.getElementById('customerSearch');
  const statusFilter = document.getElementById('customerStatusFilter');
  const tableBody = document.getElementById('customersTableBody');
  const resultCountEl = document.getElementById('customerResultCount');
  const addCustomerBtn = document.getElementById('openAddCustomerModalBtn');
  const customerDialog = document.getElementById('addCustomerDialog');
  const closeDialogBtn = document.getElementById('closeCustomerDialogBtn');
  const cancelDialogBtn = document.getElementById('cancelCustomerDialogBtn');
  const addCustomerForm = document.getElementById('addCustomerForm');
  const modalAlert = document.getElementById('customerModalAlert');

  const state = {
    searchQuery: '',
    statusFilter: 'all'
  };

  function render() {
    const allCustomers = store.getCustomers();
    const query = state.searchQuery.trim().toLowerCase();
    const status = state.statusFilter;

    const filtered = allCustomers.filter(customer => {
      const matchesStatus =
        status === 'all' ||
        customer.status.toLowerCase() === status.toLowerCase();

      if (!matchesStatus) return false;

      if (!query) return true;

      const nameMatch = (customer.name || '').toLowerCase().includes(query);
      const emailMatch = (customer.email || '').toLowerCase().includes(query);
      const companyMatch = (customer.company || '').toLowerCase().includes(query);

      return nameMatch || emailMatch || companyMatch;
    });

    if (resultCountEl) {
      resultCountEl.textContent =
        `${filtered.length} of ${allCustomers.length} accounts`;
    }

    if (tableBody) {
      tableBody.innerHTML = view.renderCustomersRows(filtered);
    }
  }

  if (searchInput) {
    const debouncedSearch = helpers.debounce((e) => {
      state.searchQuery = e.target.value;
      render();
    }, 200);

    searchInput.addEventListener('input', debouncedSearch);
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      state.statusFilter = e.target.value;
      render();
    });
  }

  if (addCustomerBtn && customerDialog) {
    addCustomerBtn.addEventListener('click', () => {
      if (modalAlert) modalAlert.innerHTML = '';

      if (addCustomerForm) {
        addCustomerForm.reset();
      }

      customerDialog.showModal();
    });
  }

  function closeDialog() {
    if (customerDialog) {
      customerDialog.close();
    }
  }

  if (closeDialogBtn) {
    closeDialogBtn.addEventListener('click', closeDialog);
  }

  if (cancelDialogBtn) {
    cancelDialogBtn.addEventListener('click', closeDialog);
  }

  if (customerDialog) {
    customerDialog.addEventListener('click', (e) => {
      const rect = customerDialog.getBoundingClientRect();

      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        closeDialog();
      }
    });
  }

  if (addCustomerForm) {
    addCustomerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('newCustomerName').value.trim();
      const email = document.getElementById('newCustomerEmail').value.trim();
      const phone = document.getElementById('newCustomerPhone').value.trim();
      const company = document.getElementById('newCustomerCompany').value.trim();
      const status = document.getElementById('newCustomerStatus').value;

      if (!name || !email || !company) {
        if (modalAlert) {
          modalAlert.innerHTML = view.renderInlineAlert(
            'Please provide at least Name, Email, and Company.',
            'danger'
          );
        }

        return;
      }

      store.addCustomer({
        name,
        email,
        phone: phone || '—',
        company,
        status
      });

      closeDialog();
      render();
    });
  }

  render();
});