
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const store = window.TaskCRMStore;
  const view = window.TaskCRMView;
  const helpers = window.TaskCRMHelpers;

 
  if (!store.isAuthenticated()) {
    window.location.replace('login.html');
    return;
  }

  
  view.setupShell('tasks');

  // DOM Elements
  const statusFilter = document.getElementById('taskStatusFilter');
  const priorityFilter = document.getElementById('taskPriorityFilter');
  const tableBody = document.getElementById('tasksTableBody');
  const resultCountEl = document.getElementById('taskResultCount');
  const addTaskBtn = document.getElementById('openAddTaskModalBtn');
  const taskDialog = document.getElementById('addTaskDialog');
  const closeDialogBtn = document.getElementById('closeTaskDialogBtn');
  const cancelDialogBtn = document.getElementById('cancelTaskDialogBtn');
  const addTaskForm = document.getElementById('addTaskForm');
  const modalAlert = document.getElementById('taskModalAlert');

  // Page State
  const state = {
    statusFilter: 'all',
    priorityFilter: 'all'
  };

  /**
   * Filter, sort chronologically, and render tasks
   */
  function render() {
    const allTasks = store.getTasks();
    const status = state.statusFilter;
    const priority = state.priorityFilter;

    // Combined filtering
    const filtered = allTasks.filter(item => {
      const matchStatus = status === 'all' || item.status.toLowerCase() === status.toLowerCase();
      const matchPriority = priority === 'all' || item.priority.toLowerCase() === priority.toLowerCase();
      return matchStatus && matchPriority;
    });

    // Default sorting: Date ascending (earliest / most urgent dates first)
    filtered.sort((a, b) => {
      const timeA = a.date ? new Date(a.date).getTime() : Infinity;
      const timeB = b.date ? new Date(b.date).getTime() : Infinity;
      return timeA - timeB;
    });

    // Result summary
    if (resultCountEl) {
      resultCountEl.textContent = `${filtered.length} of ${allTasks.length} tasks`;
    }

    // Render table
    if (tableBody) {
      tableBody.innerHTML = view.renderTasksRows(filtered);

      // Attach event listener for task toggle buttons
      const toggleButtons = tableBody.querySelectorAll('.task-toggle-btn');
      toggleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const taskId = e.currentTarget.getAttribute('data-id');
          if (taskId) {
            store.toggleTaskStatus(taskId);
            render();
          }
        });
      });
    }
  }

  // Event Listeners for Filters
  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      state.statusFilter = e.target.value;
      render();
    });
  }

  if (priorityFilter) {
    priorityFilter.addEventListener('change', (e) => {
      state.priorityFilter = e.target.value;
      render();
    });
  }

  // Modal Dialog Handlers
  if (addTaskBtn && taskDialog) {
    addTaskBtn.addEventListener('click', () => {
      if (modalAlert) modalAlert.innerHTML = '';
      if (addTaskForm) addTaskForm.reset();

      const dateInput = document.getElementById('newTaskDate');
      if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
      }

      taskDialog.showModal();
    });
  }

  function closeDialog() {
    if (taskDialog) taskDialog.close();
  }

  if (closeDialogBtn) closeDialogBtn.addEventListener('click', closeDialog);
  if (cancelDialogBtn) cancelDialogBtn.addEventListener('click', closeDialog);

  if (taskDialog) {
    taskDialog.addEventListener('click', (e) => {
      const rect = taskDialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) closeDialog();
    });
  }

  if (addTaskForm) {
    addTaskForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const task = document.getElementById('newTaskDescription').value.trim();
      const date = document.getElementById('newTaskDate').value;
      const priority = document.getElementById('newTaskPriority').value;
      const status = document.getElementById('newTaskStatus').value;

      if (!task || !date) {
        if (modalAlert) {
          modalAlert.innerHTML = view.renderInlineAlert('Please enter task description and target date.', 'danger');
        }
        return;
      }

      store.addTask({
        task,
        date,
        priority,
        status
      });

      closeDialog();
      render();
    });
  }

  // Initial Render
  render();
});
