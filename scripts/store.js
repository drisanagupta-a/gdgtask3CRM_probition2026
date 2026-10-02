const TaskCRMStore = (function () {
  'use strict';

  const STORAGE_KEYS = {
    CUSTOMERS: 'task_crm_customers',
    LEADS: 'task_crm_leads',
    TASKS: 'task_crm_tasks',
    ACTIVITIES: 'task_crm_activities',
    SALES: 'task_crm_sales',
    AUTH: 'task_crm_session'
  };

  const DEMO_CREDENTIALS = [
    { email: 'admin@taskcrm.io', password: 'admin', name: 'Drisana (Lead Admin)' },
    { email: 'demo@taskcrm.io', password: 'demo', name: 'Demo Operator' }
  ];

  function relativeDate(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  function getInitialSeeds() {
    const customers = [
      {
        id: 'cust_01',
        name: 'Elena Rostova',
        email: 'elena.rostova@meridianlogistics.com',
        phone: '+91 98765 43210',
        company: 'Meridian Logistics',
        status: 'Active',
        createdAt: '2026-01-14'
      },
      {
        id: 'cust_02',
        name: 'Marcus Vance',
        email: 'm.vance@zurichbiotech.ch',
        phone: '+91 91234 56789',
        company: 'Zurich BioTech AG',
        status: 'Active',
        createdAt: '2026-02-03'
      },
      {
        id: 'cust_03',
        name: 'Sophia Chen',
        email: 'schen@apexcapital.co',
        phone: '+91 98123 45678',
        company: 'Apex Capital Partners',
        status: 'Active',
        createdAt: '2026-02-18'
      },
      {
        id: 'cust_04',
        name: 'Tariq Al-Mansoor',
        email: 'tariq@gulfstreamenergy.ae',
        phone: '+91 87654 32109',
        company: 'Gulfstream Energy',
        status: 'Prospect',
        createdAt: '2026-03-05'
      },
      {
        id: 'cust_05',
        name: 'Amara Okafor',
        email: 'amara.okafor@helsinkidata.fi',
        phone: '+91 99887 66554',
        company: 'Nordic Data Labs',
        status: 'Active',
        createdAt: '2026-03-12'
      },
      {
        id: 'cust_06',
        name: 'Liam O’Connor',
        email: 'loconnor@celticfin.ie',
        phone: '+91 90909 12345',
        company: 'Celtic Financial',
        status: 'Inactive',
        createdAt: '2026-03-20'
      },
      {
        id: 'cust_07',
        name: 'Katarina Lindqvist',
        email: 'klindqvist@baselprecision.ch',
        phone: '+91 93456 78901',
        company: 'Basel Precision Engineering',
        status: 'Active',
        createdAt: '2026-04-02'
      },
      {
        id: 'cust_08',
        name: 'Julian Thorne',
        email: 'jthorne@strata-aerospace.co.uk',
        phone: '+91 88223 44556',
        company: 'Strata Aerospace',
        status: 'Active',
        createdAt: '2026-04-19'
      },
      {
        id: 'cust_09',
        name: 'Mei-Ling Zhou',
        email: 'mlzhou@pacifica-tech.sg',
        phone: '+91 97654 32108',
        company: 'Pacifica Technologies',
        status: 'Prospect',
        createdAt: '2026-05-08'
      },
      {
        id: 'cust_10',
        name: 'Mateo Hernandez',
        email: 'mhernandez@iberiaglobal.es',
        phone: '+91 90123 45678',
        company: 'Iberia Global Trade',
        status: 'Inactive',
        createdAt: '2026-05-24'
      },
      {
        id: 'cust_11',
        name: 'Dr. Aris Thorne',
        email: 'aris.thorne@genevagenetics.org',
        phone: '+91 98712 34567',
        company: 'Geneva Genetics Lab',
        status: 'Active',
        createdAt: '2026-06-11'
      },
      {
        id: 'cust_12',
        name: 'Valerie Dupuis',
        email: 'valerie@lyonmaterials.fr',
        phone: '+91 87901 23456',
        company: 'Lyon Advanced Materials',
        status: 'Active',
        createdAt: '2026-06-28'
      },
      {
        id: 'cust_13',
        name: 'Siddharth Rao',
        email: 'siddharth@deccancloud.in',
        phone: '+91 99123 45670',
        company: 'Deccan Cloud Systems',
        status: 'Prospect',
        createdAt: '2026-07-15'
      },
      {
        id: 'cust_14',
        name: 'Greta Weiss',
        email: 'greta.weiss@munichrobotics.de',
        phone: '+91 88888 77777',
        company: 'Munich Autonomous Robotics',
        status: 'Active',
        createdAt: '2026-08-01'
      },
      {
        id: 'cust_15',
        name: 'Ephraim Sterling',
        email: 'sterling@sterlingmaritime.com',
        phone: '+91 93210 45678',
        company: 'Sterling Maritime Line',
        status: 'Inactive',
        createdAt: '2026-08-20'
      },
      {
        id: 'cust_16',
        name: 'Nadia Benali',
        email: 'n.benali@atlascleantech.ma',
        phone: '+91 96543 21098',
        company: 'Atlas CleanTech',
        status: 'Prospect',
        createdAt: '2026-09-02'
      },
      {
        id: 'cust_17',
        name: 'Henrik Vanger',
        email: 'hvanger@scandicmetals.se',
        phone: '+91 80765 43210',
        company: 'Scandic Metals AB',
        status: 'Active',
        createdAt: '2026-09-10'
      },
      {
        id: 'cust_18',
        name: 'Clara Oswald',
        email: 'clara@tardissolutions.uk',
        phone: '+91 94567 89012',
        company: 'Chronos Digital',
        status: 'Active',
        createdAt: '2026-09-18'
      }
    ];

    const leads = [
      {
        id: 'lead_01',
        name: 'Dominic Sterling',
        company: 'Alpine Solar Dynamics',
        contact: 'd.sterling@alpinesolar.ch',
        status: 'New',
        followUpDate: relativeDate(-4)
      },
      {
        id: 'lead_02',
        name: 'Aurelia Dubois',
        company: 'Bordeaux AgroTech',
        contact: 'aurelia@bordeauxagro.fr',
        status: 'Contacted',
        followUpDate: relativeDate(-2)
      },
      {
        id: 'lead_03',
        name: 'Vikram Sethi',
        company: 'Indus Semiconductor',
        contact: 'vsethi@indussemi.com',
        status: 'New',
        followUpDate: relativeDate(3)
      },
      {
        id: 'lead_04',
        name: 'Brigitte Meyer',
        company: 'Zurich Quantum Software',
        contact: 'bmeyer@zurichquantum.ch',
        status: 'Converted',
        followUpDate: relativeDate(-10)
      },
      {
        id: 'lead_05',
        name: 'Carlos Mendez',
        company: 'Andalusia Olive Ventures',
        contact: 'cmendez@andalusiaolive.es',
        status: 'Contacted',
        followUpDate: relativeDate(1)
      },
      {
        id: 'lead_06',
        name: 'Hiroshi Tanaka',
        company: 'Kansai Precision Automation',
        contact: 'tanaka@kansaiprecision.jp',
        status: 'New',
        followUpDate: relativeDate(-1)
      },
      {
        id: 'lead_07',
        name: 'Ingrid Bergman',
        company: 'Stockholm BioSynthetics',
        contact: 'ingrid@stockholmbio.se',
        status: 'Converted',
        followUpDate: relativeDate(-5)
      },
      {
        id: 'lead_08',
        name: 'Kwame Asante',
        company: 'Accra Fintech Solutions',
        contact: 'kasante@accrafintech.gh',
        status: 'Contacted',
        followUpDate: relativeDate(5)
      },
      {
        id: 'lead_09',
        name: 'Fatima Zahra',
        company: 'Casablanca Logistics Hub',
        contact: 'fzahra@casalog.ma',
        status: 'New',
        followUpDate: relativeDate(2)
      },
      {
        id: 'lead_10',
        name: 'Oliver Queen',
        company: 'Starling Medical Devices',
        contact: 'queen@starlingmed.com',
        status: 'Contacted',
        followUpDate: relativeDate(-6)
      },
      {
        id: 'lead_11',
        name: 'Svetlana Petrova',
        company: 'Danube Cryogenics',
        contact: 'spetrova@danubecryo.at',
        status: 'Converted',
        followUpDate: relativeDate(-15)
      },
      {
        id: 'lead_12',
        name: 'Sean MacNamara',
        company: 'Galway Marine Energy',
        contact: 'sean@galwaymarine.ie',
        status: 'New',
        followUpDate: relativeDate(0)
      },
      {
        id: 'lead_13',
        name: 'Lucia Fontana',
        company: 'Milano Industrial Fabrics',
        contact: 'fontana@milanofabrics.it',
        status: 'Contacted',
        followUpDate: relativeDate(4)
      },
      {
        id: 'lead_14',
        name: 'Darius Vance',
        company: 'Bavaria Rail Logistics',
        contact: 'dvance@bavariarail.de',
        status: 'New',
        followUpDate: relativeDate(7)
      },
      {
        id: 'lead_15',
        name: 'Zoe Katsaros',
        company: 'Aegean Cyber Defense',
        contact: 'zkatsaros@aegeancyber.gr',
        status: 'Contacted',
        followUpDate: relativeDate(-3)
      },
      {
        id: 'lead_16',
        name: 'Jonas Lie',
        company: 'Oslo Subsea Systems',
        contact: 'jlie@oslosubsea.no',
        status: 'Converted',
        followUpDate: relativeDate(-20)
      }
    ];

    const tasks = [
      {
        id: 'task_01',
        task: 'Finalize enterprise MSA contract for Zurich BioTech AG',
        date: relativeDate(-3),
        priority: 'High',
        status: 'Pending'
      },
      {
        id: 'task_02',
        task: 'Conduct technical discovery call with Kansai Precision',
        date: relativeDate(-1),
        priority: 'Medium',
        status: 'In Progress'
      },
      {
        id: 'task_03',
        task: 'Deliver customized Q3 SLA proposal to Meridian Logistics',
        date: relativeDate(0),
        priority: 'High',
        status: 'Pending'
      },
      {
        id: 'task_04',
        task: 'Coordinate procurement audit review with Celtic Financial',
        date: relativeDate(-8),
        priority: 'Low',
        status: 'Done'
      },
      {
        id: 'task_05',
        task: 'Schedule executive demonstration for Apex Capital team',
        date: relativeDate(2),
        priority: 'High',
        status: 'Pending'
      },
      {
        id: 'task_06',
        task: 'Review compliance documentation for Geneva Genetics Lab',
        date: relativeDate(3),
        priority: 'Medium',
        status: 'In Progress'
      },
      {
        id: 'task_07',
        task: 'Send updated tariff breakdown to Iberia Global Trade',
        date: relativeDate(4),
        priority: 'Low',
        status: 'Pending'
      },
      {
        id: 'task_08',
        task: 'Verify wire transfer settlement from Munich Autonomous Robotics',
        date: relativeDate(-4),
        priority: 'High',
        status: 'Done'
      },
      {
        id: 'task_09',
        task: 'Quarterly pipeline sync with regional account executives',
        date: relativeDate(5),
        priority: 'Medium',
        status: 'Pending'
      },
      {
        id: 'task_10',
        task: 'Prepare onboarding documentation for Chronos Digital',
        date: relativeDate(6),
        priority: 'Low',
        status: 'Pending'
      },
      {
        id: 'task_11',
        task: 'Re-engage dormant accounts list from Q1 2026',
        date: relativeDate(-5),
        priority: 'Medium',
        status: 'Pending'
      },
      {
        id: 'task_12',
        task: 'Security questionnaire sign-off for Nordic Data Labs',
        date: relativeDate(-12),
        priority: 'High',
        status: 'Done'
      },
      {
        id: 'task_13',
        task: 'Draft pricing model for multi-tenant deployment',
        date: relativeDate(8),
        priority: 'High',
        status: 'Pending'
      },
      {
        id: 'task_14',
        task: 'Follow up with Oliver Queen on device evaluation phase',
        date: relativeDate(1),
        priority: 'Medium',
        status: 'In Progress'
      },
      {
        id: 'task_15',
        task: 'Update customer contact index following leadership changes',
        date: relativeDate(10),
        priority: 'Low',
        status: 'Pending'
      }
    ];

    const sales = [
      {
        id: 'sale_01',
        customer: 'Meridian Logistics',
        amount: 34500,
        date: '2026-09-22',
        rep: 'Drisana'
      },
      {
        id: 'sale_02',
        customer: 'Zurich BioTech AG',
        amount: 52000,
        date: '2026-09-18',
        rep: 'Drisana'
      },
      {
        id: 'sale_03',
        customer: 'Apex Capital Partners',
        amount: 41200,
        date: '2026-09-10',
        rep: 'Drisana'
      },
      {
        id: 'sale_04',
        customer: 'Munich Autonomous Robotics',
        amount: 68000,
        date: '2026-08-29',
        rep: 'Drisana'
      },
      {
        id: 'sale_05',
        customer: 'Nordic Data Labs',
        amount: 28400,
        date: '2026-08-14',
        rep: 'Drisana'
      },
      {
        id: 'sale_06',
        customer: 'Basel Precision Engineering',
        amount: 37500,
        date: '2026-08-03',
        rep: 'Drisana'
      },
      {
        id: 'sale_07',
        customer: 'Geneva Genetics Lab',
        amount: 49000,
        date: '2026-07-21',
        rep: 'Drisana'
      },
      {
        id: 'sale_08',
        customer: 'Strata Aerospace',
        amount: 76000,
        date: '2026-07-09',
        rep: 'Drisana'
      },
      {
        id: 'sale_09',
        customer: 'Lyon Advanced Materials',
        amount: 22800,
        date: '2026-06-25',
        rep: 'Drisana'
      },
      {
        id: 'sale_10',
        customer: 'Chronos Digital',
        amount: 19500,
        date: '2026-06-12',
        rep: 'Drisana'
      }
    ];

    const activities = [
      {
        id: 'act_01',
        message: 'Contract executed: Meridian Logistics closed enterprise tier',
        amount: 34500,
        timestamp: '2 hours ago'
      },
      {
        id: 'act_02',
        message: 'New prospect enrolled: Atlas CleanTech via inbound inquiry',
        timestamp: '5 hours ago'
      },
      {
        id: 'act_03',
        message: 'Lead converted: Zurich Quantum Software upgraded to Customer',
        timestamp: 'Yesterday at 16:40'
      },
      {
        id: 'act_04',
        message: 'High-priority task scheduled: MSA contract for Zurich BioTech AG',
        timestamp: 'Yesterday at 11:15'
      },
      {
        id: 'act_05',
        message: 'Contract executed: Munich Autonomous Robotics paid annual license',
        amount: 68000,
        timestamp: '3 days ago'
      },
      {
        id: 'act_06',
        message: 'Customer status updated: Celtic Financial shifted to Inactive',
        timestamp: '4 days ago'
      },
      {
        id: 'act_07',
        message: 'Discovery meeting concluded with Kansai Precision Automation',
        timestamp: '5 days ago'
      },
      {
        id: 'act_08',
        message: 'Quarterly pipeline target achieved (₹4,25,000 threshold surpassed)',
        timestamp: '1 week ago'
      }
    ];

    return {
      customers,
      leads,
      tasks,
      sales,
      activities
    };
  }

  function safeGet(key, defaultVal) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      return defaultVal;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error writing ${key} to localStorage:`, e);
      return false;
    }
  }

  function init() {
    const existing = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);

    if (!existing) {
      const seeds = getInitialSeeds();

      safeSet(STORAGE_KEYS.CUSTOMERS, seeds.customers);
      safeSet(STORAGE_KEYS.LEADS, seeds.leads);
      safeSet(STORAGE_KEYS.TASKS, seeds.tasks);
      safeSet(STORAGE_KEYS.SALES, seeds.sales);
      safeSet(STORAGE_KEYS.ACTIVITIES, seeds.activities);

      console.info('Task CRM: LocalStorage initialized with realistic seeds.');
    }
  }

  function getCustomers() {
    return safeGet(STORAGE_KEYS.CUSTOMERS, []);
  }

  function addCustomer(data) {
    const list = getCustomers();

    const newCustomer = {
      id: data.id || ('cust_' + Date.now()),
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      company: data.company.trim(),
      status: data.status || 'Prospect',
      createdAt: data.createdAt || new Date().toISOString().split('T')[0]
    };

    list.unshift(newCustomer);
    safeSet(STORAGE_KEYS.CUSTOMERS, list);

    addActivity(
      `New customer account created: ${newCustomer.name} (${newCustomer.company})`
    );

    return newCustomer;
  }

  
  function updateCustomer(id, patch) {
  const list = getCustomers();
  const index = list.findIndex(c => c.id === id);

  if (index === -1) return null;

  const previous = list[index];

  list[index] = {
    ...previous,
    ...patch
  };

  safeSet(STORAGE_KEYS.CUSTOMERS, list);

  addActivity(
    `Customer updated: ${list[index].name} (${list[index].company})`
  );

  return list[index];
}

function deleteCustomer(id) {
  const list = getCustomers();
  const customer = list.find(c => c.id === id);

  if (!customer) return false;

  const filtered = list.filter(c => c.id !== id);

  safeSet(STORAGE_KEYS.CUSTOMERS, filtered);

  addActivity(
    `Customer deleted: ${customer.name} (${customer.company})`
  );

  return true;
}

  function getLeads() {
    return safeGet(STORAGE_KEYS.LEADS, []);
  }

  function addLead(data) {
    const list = getLeads();

    const newLead = {
      id: data.id || ('lead_' + Date.now()),
      name: data.name.trim(),
      company: data.company.trim(),
      contact: data.contact.trim(),
      status: data.status || 'New',
      followUpDate: data.followUpDate || ''
    };

    list.unshift(newLead);
    safeSet(STORAGE_KEYS.LEADS, list);

    addActivity(
      `New lead registered: ${newLead.name} (${newLead.company})`
    );

    return newLead;
  }

  function updateLead(id, patch) {
    const list = getLeads();
    const index = list.findIndex(l => l.id === id);

    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...patch
    };

    safeSet(STORAGE_KEYS.LEADS, list);

    return list[index];
  }

  function getTasks() {
    return safeGet(STORAGE_KEYS.TASKS, []);
  }

  function addTask(data) {
    const list = getTasks();

    const newTask = {
      id: data.id || ('task_' + Date.now()),
      task: data.task.trim(),
      date: data.date,
      priority: data.priority || 'Medium',
      status: data.status || 'Pending'
    };

    list.unshift(newTask);
    safeSet(STORAGE_KEYS.TASKS, list);

    addActivity(
      `Task created: "${newTask.task}" [${newTask.priority}]`
    );

    return newTask;
  }

  function updateTask(id, patch) {
    const list = getTasks();
    const index = list.findIndex(t => t.id === id);

    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...patch
    };

    safeSet(STORAGE_KEYS.TASKS, list);

    return list[index];
  }

  function toggleTaskStatus(id) {
    const list = getTasks();
    const task = list.find(t => t.id === id);

    if (!task) return null;

    if (task.status === 'Done') {
      task.status = 'Pending';
    } else if (task.status === 'Pending') {
      task.status = 'In Progress';
    } else {
      task.status = 'Done';
    }

    safeSet(STORAGE_KEYS.TASKS, list);

    addActivity(
      `Task updated: "${task.task}" is now ${task.status}`
    );

    return task;
  }

  function getActivities(limit = 8) {
    const list = safeGet(STORAGE_KEYS.ACTIVITIES, []);

    return list.slice(0, limit);
  }

  function addActivity(message, amount = null) {
    const list = safeGet(STORAGE_KEYS.ACTIVITIES, []);

    const newAct = {
      id: 'act_' + Date.now(),
      message,
      amount,
      timestamp: 'Just now'
    };

    list.unshift(newAct);

    safeSet(
      STORAGE_KEYS.ACTIVITIES,
      list.slice(0, 30)
    );

    return newAct;
  }

  function getSales() {
    return safeGet(STORAGE_KEYS.SALES, []);
  }

  function getDashboardStats() {
    const customers = getCustomers();
    const leads = getLeads();
    const tasks = getTasks();
    const sales = getSales();

    const totalSalesAmount = sales.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );

    const pendingTasksCount = tasks.filter(
      t => t.status === 'Pending'
    ).length;

    return {
      totalCustomers: customers.length,
      totalLeads: leads.length,
      totalSales: totalSalesAmount,
      pendingTasks: pendingTasksCount,
      activeCustomers: customers.filter(
        c => c.status === 'Active'
      ).length,
      convertedLeads: leads.filter(
        l => l.status === 'Converted'
      ).length
    };
  }

  function isAuthenticated() {
    const session = safeGet(STORAGE_KEYS.AUTH, null);

    return session !== null && Boolean(session.token);
  }

  function getCurrentUser() {
    const session = safeGet(STORAGE_KEYS.AUTH, null);

    return session ? session.user : null;
  }

  function login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    const matched = DEMO_CREDENTIALS.find(
      c =>
        c.email.toLowerCase() === cleanEmail &&
        c.password === cleanPassword
    );

    if (matched) {
      const session = {
        token:
          'token_' +
          Math.random().toString(36).substring(2) +
          Date.now(),

        user: {
          email: matched.email,
          name: matched.name
        },

        loginTime: new Date().toISOString()
      };

      safeSet(STORAGE_KEYS.AUTH, session);

      return {
        success: true,
        user: session.user
      };
    }

    return {
      success: false,
      error: 'Invalid email or password. Please verify your credentials.'
    };
  }

  function logout() {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch (e) {
      console.error('Error logging out:', e);
    }
  }

  function resetToSeeds() {
    const seeds = getInitialSeeds();

    safeSet(STORAGE_KEYS.CUSTOMERS, seeds.customers);
    safeSet(STORAGE_KEYS.LEADS, seeds.leads);
    safeSet(STORAGE_KEYS.TASKS, seeds.tasks);
    safeSet(STORAGE_KEYS.SALES, seeds.sales);
    safeSet(STORAGE_KEYS.ACTIVITIES, seeds.activities);

    return true;
  }

  init();

  return {
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getLeads,
    addLead,
    updateLead,
    getTasks,
    addTask,
    updateTask,
    toggleTaskStatus,
    getActivities,
    addActivity,
    getSales,
    getDashboardStats,
    isAuthenticated,
    getCurrentUser,
    login,
    logout,
    resetToSeeds
  };
})();

window.TaskCRMStore = TaskCRMStore;