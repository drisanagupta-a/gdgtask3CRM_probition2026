document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const store = window.TaskCRMStore;
  const view = window.TaskCRMView;
  const helpers = window.TaskCRMHelpers;

  if (!store.isAuthenticated()) {
    window.location.replace('login.html');
    return;
  }

  view.setupShell('leads');

  const searchInput = document.getElementById('leadSearch');
  const statusFilter = document.getElementById('leadStatusFilter');
  const tableBody = document.getElementById('leadsTableBody');
  const resultCountEl = document.getElementById('leadResultCount');

  const totalLeadCount = document.getElementById('totalLeadCount');
  const newLeadCount = document.getElementById('newLeadCount');
  const contactedLeadCount = document.getElementById('contactedLeadCount');
  const convertedLeadCount = document.getElementById('convertedLeadCount');

  const addLeadBtn = document.getElementById('openAddLeadModalBtn');
  const leadDialog = document.getElementById('addLeadDialog');
  const closeDialogBtn = document.getElementById('closeLeadDialogBtn');
  const cancelDialogBtn = document.getElementById('cancelLeadDialogBtn');
  const addLeadForm = document.getElementById('addLeadForm');
  const modalAlert = document.getElementById('leadModalAlert');

  const nameInput = document.getElementById('newLeadName');
  const companyInput = document.getElementById('newLeadCompany');
  const contactInput = document.getElementById('newLeadContact');
  const statusInput = document.getElementById('newLeadStatus');
  const followUpInput = document.getElementById('newLeadFollowUp');

  const nameError = document.getElementById('leadNameError');
  const companyError = document.getElementById('leadCompanyError');
  const contactError = document.getElementById('leadContactError');
  const editingLeadId = document.getElementById('editingLeadId');

  const deleteDialog = document.getElementById('deleteLeadDialog');
  const deleteMessage = document.getElementById('deleteLeadMessage');
  const closeDeleteDialogBtn = document.getElementById('closeDeleteLeadDialogBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteLeadBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteLeadBtn');

  const state = {
    searchQuery: '',
    statusFilter: 'all',
    deletingId: null
  };

  function setFieldState(input, errorElement, message) {
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
      setFieldState(nameInput, nameError, 'Contact name is required.');
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

    if (value.length < 2) {
      setFieldState(
        companyInput,
        companyError,
        'Enter a valid company name.'
      );
      return false;
    }

    setFieldState(companyInput, companyError, '');
    return true;
  }

  function validateContact() {
    const value = contactInput.value.trim();

    const emailPattern =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const phonePattern =
      /^(?:\+91[\s-]?)?[6-9]\d{9}$/;

    if (!value) {
      setFieldState(
        contactInput,
        contactError,
        'Email or phone number is required.'
      );
      return false;
    }

    if (!emailPattern.test(value) && !phonePattern.test(value.replace(/[\s-]/g, ''))) {
      setFieldState(
        contactInput,
        contactError,
        'Enter a valid email address or Indian phone number.'
      );
      return false;
    }

    setFieldState(contactInput, contactError, '');
    return true;
  }

  function validateForm() {
    return validateName() &&
      validateCompany() &&
      validateContact();
  }

  function clearValidation() {
    [
      [nameInput, nameError],
      [companyInput, companyError],
      [contactInput, contactError]
    ].forEach(([input, error]) => {
      input.classList.remove('input-error', 'input-valid');
      error.textContent = '';
    });
  }

  function updateSummary(leads) {
    totalLeadCount.textContent = leads.length;

    newLeadCount.textContent =
      leads.filter(lead => lead.status === 'New').length;

    contactedLeadCount.textContent =
      leads.filter(lead => lead.status === 'Contacted').length;

    convertedLeadCount.textContent =
      leads.filter(lead => lead.status === 'Converted').length;
  }

  function render() {
    const allLeads = store.getLeads();
    const query = state.searchQuery.trim().toLowerCase();
    const filter = state.statusFilter;

    updateSummary(allLeads);

    const filtered = allLeads.filter(lead => {
      const matchesStatus =
        filter === 'all' ||
        lead.status.toLowerCase() === filter.toLowerCase();

      if (!matchesStatus) return false;

      if (!query) return true;

      return (
        (lead.name || '').toLowerCase().includes(query) ||
        (lead.company || '').toLowerCase().includes(query) ||
        (lead.contact || '').toLowerCase().includes(query)
      );
    });

    resultCountEl.textContent =
      `${filtered.length} of ${allLeads.length} leads`;

    tableBody.innerHTML = view.renderLeadsRows(filtered);
  }

  function resetForm() {
    addLeadForm.reset();
    editingLeadId.value = '';
    modalAlert.innerHTML = '';
    clearValidation();

    const d = new Date();
    d.setDate(d.getDate() + 3);
    followUpInput.value = d.toISOString().split('T')[0];

    document.getElementById('leadModalTitle').textContent = 'Add Lead';
  }

  function openAddDialog() {
    resetForm();
    leadDialog.showModal();
    nameInput.focus();
  }

  function openEditDialog(id) {
    const lead = store.getLeads().find(item => item.id === id);

    if (!lead) return;

    editingLeadId.value = lead.id;
    nameInput.value = lead.name || '';
    companyInput.value = lead.company || '';
    contactInput.value = lead.contact || '';
    statusInput.value = lead.status || 'New';
    followUpInput.value = lead.followUpDate || '';

    modalAlert.innerHTML = '';
    clearValidation();

    document.getElementById('leadModalTitle').textContent = 'Edit Lead';

    leadDialog.showModal();
    nameInput.focus();
  }

  function closeDialog() {
    if (leadDialog.open) {
      leadDialog.close();
    }
  }

  function openDeleteDialog(id) {
    const lead = store.getLeads().find(item => item.id === id);

    if (!lead) return;

    state.deletingId = id;

    deleteMessage.textContent =
      `Delete ${lead.name} from ${lead.company}? This record will be permanently removed.`;

    deleteDialog.showModal();
  }

  function closeDeleteDialog() {
    state.deletingId = null;

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

  addLeadBtn.addEventListener('click', openAddDialog);

  closeDialogBtn.addEventListener('click', closeDialog);
  cancelDialogBtn.addEventListener('click', closeDialog);

  nameInput.addEventListener('blur', validateName);
  companyInput.addEventListener('blur', validateCompany);
  contactInput.addEventListener('blur', validateContact);

  nameInput.addEventListener('input', () => {
    if (nameInput.classList.contains('input-error')) {
      validateName();
    }
  });

  companyInput.addEventListener('input', () => {
    if (companyInput.classList.contains('input-error')) {
      validateCompany();
    }
  });

  contactInput.addEventListener('input', () => {
    if (contactInput.classList.contains('input-error')) {
      validateContact();
    }
  });

  addLeadForm.addEventListener('submit', event => {
    event.preventDefault();

    if (!validateForm()) {
      const firstInvalid = document.querySelector(
        '#addLeadForm .input-error'
      );

      if (firstInvalid) {
        firstInvalid.focus();
      }

      return;
    }

    const data = {
      name: nameInput.value.trim(),
      company: companyInput.value.trim(),
      contact: contactInput.value.trim(),
      status: statusInput.value,
      followUpDate: followUpInput.value
    };

    if (editingLeadId.value) {
      store.updateLead(editingLeadId.value, data);
    } else {
      store.addLead(data);
    }

    closeDialog();
    render();
  });

  tableBody.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');

    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === 'edit') {
      openEditDialog(id);
    }

    if (action === 'delete') {
      openDeleteDialog(id);
    }
  });

  confirmDeleteBtn.addEventListener('click', () => {
    if (!state.deletingId) return;

    store.deleteLead(state.deletingId);
    closeDeleteDialog();
    render();
  });

  cancelDeleteBtn.addEventListener('click', closeDeleteDialog);
  closeDeleteDialogBtn.addEventListener('click', closeDeleteDialog);

  leadDialog.addEventListener('click', event => {
    const rect = leadDialog.getBoundingClientRect();

    const isInside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!isInside) {
      closeDialog();
    }
  });

  deleteDialog.addEventListener('click', event => {
    const rect = deleteDialog.getBoundingClientRect();

    const isInside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!isInside) {
      closeDeleteDialog();
    }
  });

  render();
});