/**
 * Task CRM — Automated Test Runner & Verification Suite (scripts/test-runner.cjs)
 * Validates data layer, business logic, overdue rules, filtering, and HTML/CSS integrity.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('\n========================================');
console.log('TASK CRM — AUTOMATED SYSTEM QA TEST');
console.log('========================================\n');

// 1. Verify File Structure
console.log('1. Checking Required File Structure...');
const requiredFiles = [
  'planning/product-brief.md',
  'planning/visual-system.md',
  'planning/architecture-notes.md',
  'planning/build-log.md',
  'planning/stack-constraints.md',
  'guidelines/coding-standards.md',
  'styles/reset.css',
  'styles/tokens.css',
  'styles/base.css',
  'styles/layout.css',
  'styles/patterns.css',
  'scripts/store.js',
  'scripts/view.js',
  'scripts/helpers.js',
  'scripts/pages/login.js',
  'scripts/pages/dashboard.js',
  'scripts/pages/customers.js',
  'scripts/pages/leads.js',
  'scripts/pages/tasks.js',
  'index.html',
  'login.html',
  'dashboard.html',
  'customers.html',
  'leads.html',
  'tasks.html',
  'README.md'
];

requiredFiles.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  assert(fs.existsSync(filePath), `File exists: ${file}`);
});

// 2. Validate Design Tokens in styles/tokens.css
console.log('\n2. Validating Color Palette in styles/tokens.css...');
const tokensCss = fs.readFileSync(path.join(ROOT_DIR, 'styles/tokens.css'), 'utf-8');
const requiredTokens = [
  { name: '--color-ink', val: '#111111' },
  { name: '--color-bg', val: '#F8F8F6' },
  { name: '--color-surface', val: '#FFFFFF' },
  { name: '--color-accent', val: '#E43D30' },
  { name: '--color-muted', val: '#6B6B67' },
  { name: '--color-border', val: '#D8D8D3' },
  { name: '--color-success', val: '#3F7650' },
  { name: '--color-warning', val: '#A66A18' },
  { name: '--color-danger', val: '#B52F28' },
  { name: '--color-info', val: '#41677A' }
];

requiredTokens.forEach(token => {
  const present = tokensCss.includes(token.name) && tokensCss.toLowerCase().includes(token.val.toLowerCase());
  assert(present, `Design token defined: ${token.name} (${token.val})`);
});

// 3. Test Storage & Helpers in Node environment
console.log('\n3. Testing helpers.js...');
// Mock browser environment
const mockLocalStorage = {};
global.localStorage = {
  getItem: (k) => mockLocalStorage[k] || null,
  setItem: (k, v) => { mockLocalStorage[k] = String(v); },
  removeItem: (k) => { delete mockLocalStorage[k]; },
  clear: () => { Object.keys(mockLocalStorage).forEach(k => delete mockLocalStorage[k]); }
};
global.window = global;

// Load helpers
eval(fs.readFileSync(path.join(ROOT_DIR, 'scripts/helpers.js'), 'utf-8'));
const H = global.TaskCRMHelpers;

assert(typeof H.formatCurrency(142850) === 'string' && H.formatCurrency(142850).includes('142,850'), 'formatCurrency handles thousands');
assert(H.escapeHtml('<script>alert("xss")</script>') === '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;', 'escapeHtml defends against XSS');

// Test isOverdue rules
assert(H.isOverdue('2020-01-01', 'New') === true, 'Past date on New lead is marked overdue');
assert(H.isOverdue('2020-01-01', 'Converted') === false, 'CRITICAL: Converted leads must NEVER be marked overdue');
assert(H.isOverdue('2020-01-01', 'Done') === false, 'Done tasks must NEVER be marked overdue');
assert(H.isOverdue('2099-01-01', 'Pending') === false, 'Future date is not overdue');

// 4. Test store.js
console.log('\n4. Testing store.js...');
eval(fs.readFileSync(path.join(ROOT_DIR, 'scripts/store.js'), 'utf-8'));
const S = global.TaskCRMStore;

const customers = S.getCustomers();
assert(customers.length >= 15, `Seed customers loaded: ${customers.length} (>= 15 required)`);
assert(customers[0].name && customers[0].email && customers[0].company, 'Customer record contains realistic fields');

const leads = S.getLeads();
assert(leads.length >= 15, `Seed leads loaded: ${leads.length} (>= 15 required)`);

const tasks = S.getTasks();
assert(tasks.length >= 15, `Seed tasks loaded: ${tasks.length} (>= 15 required)`);

const stats = S.getDashboardStats();
assert(stats.totalCustomers === customers.length, `Dashboard total customers dynamic (${stats.totalCustomers})`);
assert(stats.totalLeads === leads.length, `Dashboard total leads dynamic (${stats.totalLeads})`);
assert(stats.totalSales > 0, `Dashboard total sales dynamic ($${stats.totalSales})`);
assert(stats.pendingTasks >= 0, `Dashboard pending tasks dynamic (${stats.pendingTasks})`);

// Test Authentication in store
console.log('\n5. Testing Authentication Logic...');
assert(S.isAuthenticated() === false, 'Initial state: not authenticated');
const failLogin = S.login('wrong@taskcrm.io', 'badpass');
assert(failLogin.success === false, 'Invalid login rejected with error');
assert(S.isAuthenticated() === false, 'Still unauthenticated after failure');

const okLogin = S.login('admin@taskcrm.io', 'admin');
assert(okLogin.success === true, 'Valid demo credentials (admin@taskcrm.io / admin) succeed');
assert(S.isAuthenticated() === true, 'Session token persisted in localStorage');
assert(S.getCurrentUser().email === 'admin@taskcrm.io', 'Current user retrieved from session');

S.logout();
assert(S.isAuthenticated() === false, 'Logout clears authentication state');

// 5. Test view.js
console.log('\n6. Testing view.js...');
eval(fs.readFileSync(path.join(ROOT_DIR, 'scripts/view.js'), 'utf-8'));
const V = global.TaskCRMView;

const statCellHtml = V.renderStatCell('Total Sales', '$386,000', { highlight: true });
assert(statCellHtml.includes('stat-cell--highlight') && statCellHtml.includes('Total Sales'), 'Stat cell renders with highlight class');

const badgeHtml = V.renderBadge('Active', 'success');
assert(badgeHtml.includes('badge--success') && badgeHtml.includes('Active'), 'Badge renders text and semantic class');

const customersTableHtml = V.renderCustomersRows(customers.slice(0, 3));
assert(customersTableHtml.includes(customers[0].name) && customersTableHtml.includes(customers[0].company), 'Customers table renders row markup');

const leadsTableHtml = V.renderLeadsRows(leads);
assert(leadsTableHtml.includes(leads[0].name), 'Leads table renders row markup');

// Verify converted lead row does not have is-overdue-row class
const convertedLead = leads.find(l => l.status === 'Converted');
assert(convertedLead !== undefined, 'Found converted lead in seed dataset');
const convertedRowsHtml = V.renderLeadsRows([convertedLead]);
assert(!convertedRowsHtml.includes('is-overdue-row') && !convertedRowsHtml.includes('text-overdue'), 'Converted lead is NOT styled as overdue in table');

// 7. Validate HTML files structure and script imports
console.log('\n7. Validating HTML Markup & Semantic Links...');
const pages = ['login.html', 'dashboard.html', 'customers.html', 'leads.html', 'tasks.html'];
pages.forEach(page => {
  const content = fs.readFileSync(path.join(ROOT_DIR, page), 'utf-8');
  assert(content.includes('styles/reset.css'), `${page} links reset.css`);
  assert(content.includes('styles/tokens.css'), `${page} links tokens.css`);
  assert(content.includes('styles/base.css'), `${page} links base.css`);
  assert(content.includes('styles/layout.css'), `${page} links layout.css`);
  assert(content.includes('styles/patterns.css'), `${page} links patterns.css`);
  assert(content.includes('scripts/helpers.js'), `${page} links helpers.js`);
  assert(content.includes('scripts/store.js'), `${page} links store.js`);
  assert(content.includes('scripts/view.js'), `${page} links view.js`);
  assert(!content.includes('v2.4 Editorial'), `${page} does not contain artificial version label`);
  assert(!content.includes('v2.4'), `${page} does not contain version string`);
});

// 8. Validate Natural Language Polish Labels
console.log('\n8. Validating Natural Language CRM Labels...');
const loginContent = fs.readFileSync(path.join(ROOT_DIR, 'login.html'), 'utf-8');
assert(loginContent.includes('Sign in to Task CRM'), 'login.html has natural title');
assert(loginContent.includes('Manage customers, leads, and follow-ups in one place.'), 'login.html has natural subtitle');
assert(loginContent.includes('Sign In →'), 'login.html has Sign In button');

const dashContent = fs.readFileSync(path.join(ROOT_DIR, 'dashboard.html'), 'utf-8');
assert(dashContent.includes('Dashboard'), 'dashboard.html has Dashboard title');
assert(dashContent.includes('View Customers →'), 'dashboard.html has View Customers button');
assert(dashContent.includes('Recent Activity'), 'dashboard.html has Recent Activity section');
assert(dashContent.includes('Recent Sales'), 'dashboard.html has Recent Sales section');

const custContent = fs.readFileSync(path.join(ROOT_DIR, 'customers.html'), 'utf-8');
assert(custContent.includes('+ Add Customer'), 'customers.html has + Add Customer button');
assert(custContent.includes('Add Customer'), 'customers.html modal title updated');

const leadContent = fs.readFileSync(path.join(ROOT_DIR, 'leads.html'), 'utf-8');
assert(leadContent.includes('+ Add Lead'), 'leads.html has + Add Lead button');
assert(leadContent.includes('Add Lead'), 'leads.html modal title updated');

const taskContent = fs.readFileSync(path.join(ROOT_DIR, 'tasks.html'), 'utf-8');
assert(taskContent.includes('+ Add Task'), 'tasks.html has + Add Task button');
assert(taskContent.includes('Add Task'), 'tasks.html modal title updated');

const dashScript = fs.readFileSync(path.join(ROOT_DIR, 'scripts/pages/dashboard.js'), 'utf-8');
assert(dashScript.includes('active customers'), 'dashboard.js has active customers hint');
assert(dashScript.includes('converted leads'), 'dashboard.js has converted leads hint');
assert(dashScript.includes('Tasks that still need attention'), 'dashboard.js has Tasks that still need attention hint');
assert(dashScript.includes('Total revenue to date'), 'dashboard.js has Total revenue to date hint');

// Final Summary
console.log('\n========================================');
console.log(`TOTAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('========================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('All tests passed with 100% success rate!\n');
}
