

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

 
  const statusFilter = document.getElementById('leadStatusFilter');
  const tableBody = document.getElementById('leadsTableBody');
  const resultCountEl = document.getElementById('leadResultCount');
  const addLeadBtn = document.getElementById('openAddLeadModalBtn');
  const leadDialog = document.getElementById('addLeadDialog');
  const closeDialogBtn = document.getElementById('closeLeadDialogBtn');
  const cancelDialogBtn = document.getElementById('cancelLeadDialogBtn');
  const addLeadForm = document.getElementById('addLeadForm');
  const modalAlert = document.getElementById('leadModalAlert');

  
  const state = {
    statusFilter: 'all'
  };

  
  function render() {
    const allLeads = store.getLeads();
    const filter = state.statusFilter;

    const filtered = allLeads.filter(lead => {
      if (filter === 'all') return true;
      return lead.status.toLowerCase() === filter.toLowerCase();
    });

    
    if (resultCountEl) {
      resultCountEl.textContent = `${filtered.length} of ${allLeads.length} leads`;
    }

    
    if (tableBody) {
      tableBody.innerHTML = view.renderLeadsRows(filtered);
    }
  }


  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      state.statusFilter = e.target.value;
      render();
    });
  }

 
  if (addLeadBtn && leadDialog) {
    addLeadBtn.addEventListener('click', () => {
      if (modalAlert) modalAlert.innerHTML = '';
      if (addLeadForm) addLeadForm.reset();

      
      const followUpInput = document.getElementById('newLeadFollowUp');
      if (followUpInput) {
        const d = new Date();
        d.setDate(d.getDate() + 3);
        followUpInput.value = d.toISOString().split('T')[0];
      }

      leadDialog.showModal();
    });
  }

  function closeDialog() {
    if (leadDialog) leadDialog.close();
  }

  if (closeDialogBtn) closeDialogBtn.addEventListener('click', closeDialog);
  if (cancelDialogBtn) cancelDialogBtn.addEventListener('click', closeDialog);

  if (leadDialog) {
    leadDialog.addEventListener('click', (e) => {
      const rect = leadDialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) closeDialog();
    });
  }

  if (addLeadForm) {
    addLeadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('newLeadName').value.trim();
      const company = document.getElementById('newLeadCompany').value.trim();
      const contact = document.getElementById('newLeadContact').value.trim();
      const status = document.getElementById('newLeadStatus').value;
      const followUpDate = document.getElementById('newLeadFollowUp').value;

      if (!name || !company || !contact) {
        if (modalAlert) {
          modalAlert.innerHTML = view.renderInlineAlert('Please enter Name, Company, and Contact info.', 'danger');
        }
        return;
      }

      store.addLead({
        name,
        company,
        contact,
        status,
        followUpDate
      });

      closeDialog();
      render();
    });
  }

  // Initial Render
  render();
});
