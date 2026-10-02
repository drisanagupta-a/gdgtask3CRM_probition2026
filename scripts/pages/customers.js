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

  const totalCustomerCount = document.getElementById('totalCustomerCount');
  const activeCustomerCount = document.getElementById('activeCustomerCount');
  const prospectCustomerCount = document.getElementById('prospectCustomerCount');
  const inactiveCustomerCount = document.getElementById('inactiveCustomerCount');

  const addCustomerBtn = document.getElementById('openAddCustomerModalBtn');
  const customerDialog = document.getElementById('addCustomerDialog');
  const closeDialogBtn = document.getElementById('closeCustomerDialogBtn');
  const cancelDialogBtn = document.getElementById('cancelCustomerDialogBtn');
  const addCustomerForm = document.getElementById('addCustomerForm');
  const modalTitle = document.getElementById('customerModalTitle');
  const saveCustomerBtn = document.getElementById('saveCustomerBtn');
  const editingCustomerId = document.getElementById('editingCustomerId');

  const deleteDialog = document.getElementById('deleteCustomerDialog');
  const closeDeleteDialogBtn = document.getElementById('closeDeleteDialogBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const deleteCustomerMessage = document.getElementById('deleteCustomerMessage');

  const toast = document.getElementById('customerToast');

  const nameInput = document.getElementById('newCustomerName');
  const emailInput = document.getElementById('newCustomerEmail');
  const phoneInput = document.getElementById('newCustomerPhone');
  const companyInput = document.getElementById('newCustomerCompany');
  const statusInput = document.getElementById('newCustomerStatus');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const companyError = document.getElementById('companyError');

  const state = {
    searchQuery: '',
    statusFilter: 'all',
    deleteId: null
  };

  const approvedCompanies = [
    'HCL',
    'Tata Consultancy Services',
    'Infosys',
    'Wipro',
    'Accenture',
    'Microsoft',
    'Google',
    'Amazon',
    'IBM',
    'Oracle',
    'Deloitte',
    'Capgemini',
    'Tech Mahindra',
    'Reliance Industries',
    'Larsen & Toubro',
    'Apex Capital Partners',
    'Meridian Logistics',
    'Zurich BioTech AG',
    'Gulfstream Energy',
    'Nordic Data Labs',
    'Celtic Financial',
    'Basel Precision Engineering'
  ];

  function updateSummaryCards(customers) {
    const active = customers.filter(
      customer => customer.status.toLowerCase() === 'active'
    ).length;

    const prospects = customers.filter(
      customer => customer.status.toLowerCase() === 'prospect'
    ).length;

    const inactive = customers.filter(
      customer => customer.status.toLowerCase() === 'inactive'
    ).length;

    totalCustomerCount.textContent = customers.length;
    activeCustomerCount.textContent = active;
    prospectCustomerCount.textContent = prospects;
    inactiveCustomerCount.textContent = inactive;
  }

  function render() {
    const allCustomers = store.getCustomers();

    updateSummaryCards(allCustomers);

    const query = state.searchQuery.trim().toLowerCase();
    const status = state.statusFilter;

    const filtered = allCustomers.filter(customer => {
      const matchesStatus =
        status === 'all' ||
        customer.status.toLowerCase() === status.toLowerCase();

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const nameMatch =
        (customer.name || '').toLowerCase().includes(query);

      const emailMatch =
        (customer.email || '').toLowerCase().includes(query);

      const companyMatch =
        (customer.company || '').toLowerCase().includes(query);

      return nameMatch || emailMatch || companyMatch;
    });

    resultCountEl.textContent =
      `${filtered.length} of ${allCustomers.length} accounts`;

    tableBody.innerHTML = view.renderCustomersRows(filtered);
  }

  function showToast(message, type = 'success') {
    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.className = `customer-toast customer-toast--${type} customer-toast--visible`;

    setTimeout(() => {
      toast.classList.remove('customer-toast--visible');
    }, 2800);
  }

  function setFieldState(input, errorElement, message) {
    if (!input || !errorElement) {
      return;
    }

    errorElement.textContent = message;

    input.classList.remove('input-error', 'input-valid');

    if (message) {
      input.classList.add('input-error');
    } else if (input.value.trim()) {
      input.classList.add('input-valid');
    }
  }

  function validateName() {
    const value = nameInput.value.trim();
    const pattern = /^[A-Za-zÀ-ÿ]+(?:[ '-][A-Za-zÀ-ÿ]+)+$/;

    if (!value) {
      setFieldState(
        nameInput,
        nameError,
        'Full name is required.'
      );
      return false;
    }

    if (!pattern.test(value)) {
      setFieldState(
        nameInput,
        nameError,
        'Enter both first name and last name.'
      );
      return false;
    }

    setFieldState(nameInput, nameError, '');
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    const pattern =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!value) {
      setFieldState(
        emailInput,
        emailError,
        'Email address is required.'
      );
      return false;
    }

    if (!pattern.test(value)) {
      setFieldState(
        emailInput,
        emailError,
        'Enter a valid email address.'
      );
      return false;
    }

    setFieldState(emailInput, emailError, '');
    return true;
  }

  function validatePhone() {
    const value = phoneInput.value.trim();
    const pattern = /^\+91\s?[6-9]\d{4}\s?\d{5}$/;

    if (!value) {
      setFieldState(
        phoneInput,
        phoneError,
        'Indian phone number is required.'
      );
      return false;
    }

    if (!pattern.test(value)) {
      setFieldState(
        phoneInput,
        phoneError,
        'Use the Indian format: +91 98765 43210.'
      );
      return false;
    }

    setFieldState(phoneInput, phoneError, '');
    return true;
  }

  function validateCompany() {
    const value = companyInput.value.trim();

    if (!value) {
      setFieldState(
        companyInput,
        companyError,
        'Company name is required.'
      );
      return false;
    }

    const matchedCompany = approvedCompanies.some(
      company => company.toLowerCase() === value.toLowerCase()
    );

    if (!matchedCompany) {
      setFieldState(
        companyInput,
        companyError,
        'Enter a recognized company from the approved company list.'
      );
      return false;
    }

    setFieldState(companyInput, companyError, '');
    return true;
  }

  function validateForm() {
    const validName = validateName();
    const validEmail = validateEmail();
    const validPhone = validatePhone();
    const validCompany = validateCompany();

    return validName &&
      validEmail &&
      validPhone &&
      validCompany;
  }

  function clearValidation() {
    const fields = [
      [nameInput, nameError],
      [emailInput, emailError],
      [phoneInput, phoneError],
      [companyInput, companyError]
    ];

    fields.forEach(([input, error]) => {
      input.classList.remove('input-error', 'input-valid');
      error.textContent = '';
    });
  }

  function resetCustomerForm() {
    addCustomerForm.reset();
    editingCustomerId.value = '';
    clearValidation();

    modalTitle.textContent = 'Add Customer';
    saveCustomerBtn.innerHTML =
      '<i class="fa-solid fa-plus"></i> Save Customer';
  }

  function openAddDialog() {
    resetCustomerForm();
    customerDialog.showModal();
    setTimeout(() => nameInput.focus(), 100);
  }

  function openEditDialog(id) {
    const customer = store
      .getCustomers()
      .find(item => item.id === id);

    if (!customer) {
      return;
    }

    editingCustomerId.value = customer.id;

    nameInput.value = customer.name || '';
    emailInput.value = customer.email || '';
    phoneInput.value = customer.phone || '';
    companyInput.value = customer.company || '';
    statusInput.value = customer.status || 'Prospect';

    clearValidation();

    modalTitle.textContent = 'Edit Customer';
    saveCustomerBtn.innerHTML =
      '<i class="fa-solid fa-check"></i> Update Customer';

    customerDialog.showModal();

    setTimeout(() => nameInput.focus(), 100);
  }

  function closeDialog() {
    if (customerDialog.open) {
      customerDialog.close();
    }
  }

  function openDeleteDialog(id) {
    const customer = store
      .getCustomers()
      .find(item => item.id === id);

    if (!customer) {
      return;
    }

    state.deleteId = id;

    deleteCustomerMessage.textContent =
      `Are you sure you want to delete ${customer.name}? This action cannot be undone.`;

    deleteDialog.showModal();
  }

  function closeDeleteDialog() {
    state.deleteId = null;

    if (deleteDialog.open) {
      deleteDialog.close();
    }
  }

  if (searchInput) {
    const debouncedSearch = helpers.debounce((event) => {
      state.searchQuery = event.target.value;
      render();
    }, 200);

    searchInput.addEventListener('input', debouncedSearch);
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', event => {
      state.statusFilter = event.target.value;
      render();
    });
  }

  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  phoneInput.addEventListener('blur', validatePhone);
  companyInput.addEventListener('blur', validateCompany);

  nameInput.addEventListener('input', () => {
    if (nameInput.classList.contains('input-error')) {
      validateName();
    }
  });

  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('input-error')) {
      validateEmail();
    }
  });

  phoneInput.addEventListener('input', () => {
    if (phoneInput.classList.contains('input-error')) {
      validatePhone();
    }
  });

  companyInput.addEventListener('input', () => {
    if (companyInput.classList.contains('input-error')) {
      validateCompany();
    }
  });

  addCustomerBtn.addEventListener('click', openAddDialog);

  closeDialogBtn.addEventListener('click', closeDialog);

  cancelDialogBtn.addEventListener('click', closeDialog);

  if (customerDialog) {
    customerDialog.addEventListener('click', event => {
      const rect = customerDialog.getBoundingClientRect();

      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) {
        closeDialog();
      }
    });
  }

  tableBody.addEventListener('click', event => {
    const button = event.target.closest(
      '.customer-action-btn'
    );

    if (!button) {
      return;
    }

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === 'edit') {
      openEditDialog(id);
    }

    if (action === 'delete') {
      openDeleteDialog(id);
    }
  });

  addCustomerForm.addEventListener('submit', event => {
    event.preventDefault();

    if (!validateForm()) {
      const firstInvalid =
        document.querySelector('.input-error');

      if (firstInvalid) {
        firstInvalid.focus();
      }

      return;
    }

    const customerData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      company: companyInput.value.trim(),
      status: statusInput.value
    };

    const id = editingCustomerId.value.trim();

    if (id) {
      store.updateCustomer(id, customerData);
      showToast('Customer updated successfully.');
    } else {
      store.addCustomer(customerData);
      showToast('Customer added successfully.');
    }

    closeDialog();
    render();
  });

  confirmDeleteBtn.addEventListener('click', () => {
    if (!state.deleteId) {
      return;
    }

    const deleted = store.deleteCustomer(state.deleteId);

    if (deleted) {
      showToast('Customer deleted successfully.');
    }

    closeDeleteDialog();
    render();
  });

  cancelDeleteBtn.addEventListener('click', closeDeleteDialog);

  closeDeleteDialogBtn.addEventListener(
    'click',
    closeDeleteDialog
  );

  if (deleteDialog) {
    deleteDialog.addEventListener('click', event => {
      const rect = deleteDialog.getBoundingClientRect();

      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) {
        closeDeleteDialog();
      }
    });
  }

  render();
});