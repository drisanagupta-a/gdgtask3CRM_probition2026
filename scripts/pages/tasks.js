document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const store = window.TaskCRMStore;
  const view = window.TaskCRMView;

  if (!store.isAuthenticated()) {
    window.location.replace('login.html');
    return;
  }

  view.setupShell('tasks');


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


  const totalTaskCount = document.getElementById('totalTaskCount');
  const pendingTaskCount = document.getElementById('pendingTaskCount');
  const progressTaskCount = document.getElementById('progressTaskCount');
  const completedTaskCount = document.getElementById('completedTaskCount');


  const state = {
    statusFilter: 'all',
    priorityFilter: 'all'
  };


  function updateSummary(tasks) {

    const total = tasks.length;

    const pending = tasks.filter(
      task => task.status === 'Pending'
    ).length;

    const progress = tasks.filter(
      task => task.status === 'In Progress'
    ).length;

    const completed = tasks.filter(
      task => task.status === 'Done'
    ).length;


    if (totalTaskCount) {
      totalTaskCount.textContent = total;
    }

    if (pendingTaskCount) {
      pendingTaskCount.textContent = pending;
    }

    if (progressTaskCount) {
      progressTaskCount.textContent = progress;
    }

    if (completedTaskCount) {
      completedTaskCount.textContent = completed;
    }
  }


  function render() {

    const allTasks = store.getTasks();

    /* Summary cards always show totals */
    updateSummary(allTasks);


    const status = state.statusFilter;
    const priority = state.priorityFilter;


    const filtered = allTasks.filter(task => {

      const matchStatus =
        status === 'all' ||
        task.status.toLowerCase() === status.toLowerCase();

      const matchPriority =
        priority === 'all' ||
        task.priority.toLowerCase() === priority.toLowerCase();

      return matchStatus && matchPriority;
    });


    filtered.sort((a, b) => {

      const timeA = a.date
        ? new Date(a.date).getTime()
        : Infinity;

      const timeB = b.date
        ? new Date(b.date).getTime()
        : Infinity;

      return timeA - timeB;
    });


    if (resultCountEl) {
      resultCountEl.textContent =
        `${filtered.length} of ${allTasks.length} tasks`;
    }


    if (tableBody) {

      tableBody.innerHTML =
        view.renderTasksRows(filtered);


      const toggleButtons =
        tableBody.querySelectorAll('.task-toggle-btn');


      toggleButtons.forEach(button => {

        button.addEventListener('click', event => {

          const taskId =
            event.currentTarget.getAttribute('data-id');

          if (taskId) {
            store.toggleTaskStatus(taskId);
            render();
          }

        });

      });

    }

  }


  if (statusFilter) {

    statusFilter.addEventListener('change', event => {

      state.statusFilter = event.target.value;

      render();

    });

  }


  if (priorityFilter) {

    priorityFilter.addEventListener('change', event => {

      state.priorityFilter = event.target.value;

      render();

    });

  }


  if (addTaskBtn && taskDialog) {

    addTaskBtn.addEventListener('click', () => {

      if (modalAlert) {
        modalAlert.innerHTML = '';
      }

      if (addTaskForm) {
        addTaskForm.reset();
      }


      const dateInput =
        document.getElementById('newTaskDate');

      if (dateInput) {
        dateInput.value =
          new Date().toISOString().split('T')[0];
      }


      taskDialog.showModal();

    });

  }


  function closeDialog() {

    if (taskDialog) {
      taskDialog.close();
    }

  }


  if (closeDialogBtn) {
    closeDialogBtn.addEventListener(
      'click',
      closeDialog
    );
  }


  if (cancelDialogBtn) {
    cancelDialogBtn.addEventListener(
      'click',
      closeDialog
    );
  }


  if (taskDialog) {

    taskDialog.addEventListener('click', event => {

      const rect =
        taskDialog.getBoundingClientRect();

      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        closeDialog();
      }

    });

  }


  if (addTaskForm) {

    addTaskForm.addEventListener('submit', event => {

      event.preventDefault();


      const task =
        document.getElementById(
          'newTaskDescription'
        ).value.trim();

      const date =
        document.getElementById(
          'newTaskDate'
        ).value;

      const priority =
        document.getElementById(
          'newTaskPriority'
        ).value;

      const status =
        document.getElementById(
          'newTaskStatus'
        ).value;


      if (!task || !date) {

        if (modalAlert) {

          modalAlert.innerHTML =
            view.renderInlineAlert(
              'Please enter task description and target date.',
              'danger'
            );

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


  render();

});