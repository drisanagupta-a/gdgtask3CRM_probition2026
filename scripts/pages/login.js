
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const store = window.TaskCRMStore;
  const view = window.TaskCRMView;


  if (store.isAuthenticated()) {
    window.location.replace('dashboard.html');
    return;
  }

  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const alertContainer = document.getElementById('loginAlertContainer');
  const fillDemoBtn = document.getElementById('fillDemoCredentials');

  
  if (fillDemoBtn) {
    fillDemoBtn.addEventListener('click', () => {
      emailInput.value = 'admin@taskcrm.io';
      passwordInput.value = 'admin';
      clearAlert();
      passwordInput.focus();
    });
  }

  function showAlert(msg) {
    if (!alertContainer) return;
    alertContainer.innerHTML = view.renderInlineAlert(msg, 'danger');
  }

  function clearAlert() {
    if (!alertContainer) return;
    alertContainer.innerHTML = '';
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAlert();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

  
    if (!email) {
      showAlert('Please enter your work email or username.');
      emailInput.focus();
      return;
    }

    if (!password) {
      showAlert('Please enter your account password.');
      passwordInput.focus();
      return;
    }

    
    const result = store.login(email, password);

    if (result.success) {
     
      window.location.href = 'dashboard.html';
    } else {
      showAlert(result.error || 'Authentication failed. Please verify credentials.');
      passwordInput.value = '';
      passwordInput.focus();
    }
  });
});
