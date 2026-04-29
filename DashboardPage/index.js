/* ============================================
   LIFEFLOW — Blood Bank & Donation System
   app.js
   ============================================ */

// ─── STATE ─────────────────────────────────────────────────────────────────

const state = {
  donations: [
    { id: 'DON-9941', branch: 'Alex',          status: 'Under Testing', blood: 'O+',  vol: '450 mL', date: '4/21/2026' },
    { id: 'DON-9940', branch: 'Doke, Cairo',   status: 'Rejected',      blood: 'AB+', vol: '450 mL', date: '4/21/2026' },
    { id: 'DON-9939', branch: 'SidiGaber, Al..',status: 'Approved',     blood: 'A-',  vol: '450 mL', date: '4/21/2026' },
    { id: 'DON-9938', branch: 'Cairo',          status: 'Expired',       blood: 'O-',  vol: '450 mL', date: '4/21/2026' },
    { id: 'DON-9937', branch: 'Cairo',          status: 'Reserved',      blood: 'B-',  vol: '450 mL', date: '4/21/2026' },
    { id: 'DON-9936', branch: 'Alex',           status: 'Approved',      blood: 'A+',  vol: '450 mL', date: '4/20/2026' },
    { id: 'DON-9935', branch: 'Giza',           status: 'Under Testing', blood: 'O+',  vol: '450 mL', date: '4/20/2026' },
    { id: 'DON-9934', branch: 'SidiGaber, Al..',status: 'Under Testing', blood: 'B+',  vol: '450 mL', date: '4/20/2026' },
    { id: 'DON-9933', branch: 'Doke, Cairo',    status: 'Approved',      blood: 'AB-', vol: '450 mL', date: '4/19/2026' },
    { id: 'DON-9932', branch: 'Cairo',          status: 'Reserved',      blood: 'O+',  vol: '450 mL', date: '4/19/2026' },
    { id: 'DON-9931', branch: 'Alex',           status: 'Fulfilled',     blood: 'A+',  vol: '450 mL', date: '4/19/2026' },
    { id: 'DON-9930', branch: 'Cairo',          status: 'Rejected',      blood: 'B+',  vol: '450 mL', date: '4/18/2026' },
  ],

  accounts: [
    { initials: 'AM', name: 'Alex Morgan',   email: 'alex@nexus.com',    role: 'Admin',          branch: 'All',         status: 'Active',   lastLogin: 'Today, 10:30 AM' },
    { initials: 'SJ', name: 'Sarah Jenkins', email: 'sarah@nexus.com',   role: 'Staff',          branch: 'Cairo Main',  status: 'Active',   lastLogin: 'Yesterday, 2:15 PM' },
    { initials: 'OH', name: 'Omar Hassan',   email: 'omar@nexus.com',    role: 'Lab Tech',       branch: 'Alex Central',status: 'Inactive', lastLogin: '1 week ago' },
    { initials: 'DM', name: 'Dr. Mona',      email: 'mona@nexus.com',    role: 'Branch Manager', branch: 'Sidi Gaber',  status: 'Active',   lastLogin: 'Today, 08:00 AM' },
    { initials: 'YA', name: 'Youssef Ali',   email: 'youssef@nexus.com', role: 'Staff',          branch: 'Doke Clinic', status: 'Pending',  lastLogin: 'Never' },
  ],

  branches: [
    { name: 'Alex Central', location: 'Alexandria', manager: 'Dr. Ahmed', donors: 4500,  capacity: 85, status: 'Active' },
    { name: 'Cairo Main',   location: 'Cairo',      manager: 'Dr. Sarah', donors: 12000, capacity: 92, status: 'Active' },
    { name: 'Giza Branch',  location: 'Giza',       manager: 'Dr. Omar',  donors: 3200,  capacity: 45, status: 'Warning' },
    { name: 'Sidi Gaber',   location: 'Alexandria', manager: 'Dr. Mona',  donors: 2800,  capacity: 78, status: 'Active' },
    { name: 'Doke Clinic',  location: 'Cairo',      manager: 'Dr. Youssef',donors: 1500, capacity: 30, status: 'Critical' },
  ],

  bloodInventory: [
    { type: 'O+',  count: 2450, status: '' },
    { type: 'O-',  count: 120,  status: 'critical' },
    { type: 'A+',  count: 1840, status: '' },
    { type: 'A-',  count: 340,  status: 'warning' },
    { type: 'B+',  count: 1250, status: '' },
    { type: 'B-',  count: 210,  status: 'warning' },
    { type: 'AB+', count: 450,  status: '' },
    { type: 'AB-', count: 85,   status: 'critical' },
  ],

  alerts: [
    { type: 'critical', icon: '⚠', title: 'Critical Shortage: AB-',   desc: 'Inventory levels for AB- have fallen below the critical threshold (800 units remaining). Immediate donor outreach required.', time: '10 mins ago' },
    { type: 'warning',  icon: '⚠', title: 'Expiring Units',            desc: '300 units of O+ are set to expire in the next 48 hours. Prioritize fulfillment from this batch.',                          time: '1 hour ago' },
    { type: 'info',     icon: 'ℹ', title: 'New Branch Added',          desc: 'Giza Central branch has been successfully onboarded and is now accepting donations.',                                       time: '2 hours ago' },
    { type: 'warning',  icon: '⚠', title: 'High Rejection Rate',       desc: 'Doke, Cairo branch reported a 15% rejection rate today. Review screening procedures.',                                     time: '5 hours ago' },
  ],
};

// ─── STATUS BADGE HELPER ───────────────────────────────────────────────────

function badge(status) {
  const map = {
    'Under Testing': 'testing',
    'Approved':      'approved',
    'Rejected':      'rejected',
    'Expired':       'expired',
    'Reserved':      'reserved',
    'Fulfilled':     'fulfilled',
    'Active':        'active',
    'Inactive':      'inactive',
    'Pending':       'pending',
    'Warning':       'warning',
    'Critical':      'critical',
  };
  const cls = map[status] || 'expired';
  return `<span class="badge badge-${cls}">${status}</span>`;
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────

function initNav() {
  document.querySelectorAll('.nav-item[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = link.dataset.page;
      navigateTo(page);
    });
  });

  document.querySelectorAll('.view-all-link[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });
}

function navigateTo(page) {
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');

  // Update pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');

  const titles = {
  dashboard: "Dashboard Overview",
  reports: "Reports Overview",
  alerts: "Alerts",
  accounts: "Manage Accounts",
  branches: "Manage Branches",
  inventory: "Manage Inventory",
  settings: "Settings",
  help: "Help Center"
  };
    document.getElementById("pageTitle").textContent = titles[page] || "Dashboard";


  // Lazy render
  if (page === 'reports') renderCharts();
}

// ─── RENDER RECENT DONATIONS TABLE ───────────────────────────────────────

function actionMenu(type, id) {
  return `
    <div class="action-wrap">
      <button class="action-dots" onclick="toggleActionMenu(this)">⋮</button>
      <div class="action-menu">
        <button class="action-menu-item" onclick="actionView('${type}','${id}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/></svg>
          View
        </button>
        <button class="action-menu-item" onclick="actionEdit('${type}','${id}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </button>
        <button class="action-menu-item" onclick="actionExport('${type}','${id}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export
        </button>
        <button class="action-menu-item danger" onclick="actionDelete('${type}','${id}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          Delete
        </button>
      </div>
    </div>`;
}

function renderRecentDonations(list) {
  const tbody = document.getElementById('recentDonations');
  if (!tbody) return;
  const data = list !== undefined ? list : state.donations.slice(0, 8);
  tbody.innerHTML = data.slice(0, 8).map(d => `
    <tr>
      <td>${d.id}</td>
      <td>${d.branch}</td>
      <td>${badge(d.status)}</td>
      <td>${d.blood}</td>
      <td>${d.vol}</td>
      <td>${d.date}</td>
      <td>${actionMenu('donation', d.id)}</td>
    </tr>
  `).join('');
}

// ─── RENDER ACCOUNTS TABLE ────────────────────────────────────────────────

function renderAccounts(filter = '') {
  const tbody = document.getElementById('accountsTable');
  if (!tbody) return;
  const filtered = state.accounts.filter(a =>
    a.name.toLowerCase().includes(filter.toLowerCase()) ||
    a.email.toLowerCase().includes(filter.toLowerCase()) ||
    a.role.toLowerCase().includes(filter.toLowerCase())
  );
  tbody.innerHTML = filtered.map(a => `
    <tr>
      <td>
        <div class="user-cell">
          <div class="table-avatar">${a.initials}</div>
          <div class="user-cell-info">
            <strong>${a.name}</strong>
            <span>${a.email}</span>
          </div>
        </div>
      </td>
      <td><span class="role-chip">◎ ${a.role}</span></td>
      <td>${a.branch}</td>
      <td>${badge(a.status)}</td>
      <td>${a.lastLogin}</td>
      <td>${actionMenu('account', a.email)}</td>
    </tr>
  `).join('');
}

function filterAccounts(val) {
  renderAccounts(val);
}

// ─── RENDER BRANCHES ──────────────────────────────────────────────────────

function renderBranches(list) {
  const grid = document.getElementById('branchesGrid');
  if (!grid) return;

  const branches = list || state.branches;

  grid.innerHTML = branches.map((b, idx) => {
    const capClass = b.capacity < 40 ? 'critical' : b.capacity < 60 ? 'warning' : '';
    const branchId = b.name;
    return `
      <div class="branch-card">
        <div class="branch-card-header">
          <h3>${b.name}</h3>
          <div class="action-wrap">
            <button class="action-dots" onclick="toggleActionMenu(this)">⋮</button>
            <div class="action-menu">
              <button class="action-menu-item" onclick="actionView('branch','${branchId}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/></svg>
                View
              </button>
              <button class="action-menu-item" onclick="actionEdit('branch','${branchId}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
              <button class="action-menu-item" onclick="actionExport('branch','${branchId}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export
              </button>
              <button class="action-menu-item danger" onclick="actionDeleteBranch('${branchId}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                Delete
              </button>
            </div>
          </div>
        </div>
        <div class="branch-location">📍 ${b.location}</div>
        <div class="capacity-bar">
          <div class="capacity-fill ${capClass}" style="width:${b.capacity}%"></div>
        </div>
        <div class="branch-meta">
          <div class="branch-meta-row">
            <span>Manager</span><span>${b.manager}</span>
          </div>
          <div class="branch-meta-row">
            <span>👥 Donors</span><span>${b.donors.toLocaleString()}</span>
          </div>
          <div class="branch-meta-row">
            <span>⚡ Capacity</span><span>${b.capacity}%</span>
          </div>
        </div>
        <div class="branch-card-footer">
          ${badge(b.status)}
          <a href="#" class="crimson-link" onclick="actionView('branch','${branchId}'); return false;">View Details</a>
        </div>
      </div>
    `;
  }).join('');
}

// ─── RENDER INVENTORY ─────────────────────────────────────────────────────

function renderBloodTypeCards() {
  const container = document.getElementById('bloodTypeCards');
  if (!container) return;
  container.innerHTML = state.bloodInventory.map(bt => {
    const borderClass = bt.status === 'critical' ? 'alert-border' : bt.status === 'warning' ? 'warning-border' : '';
    const alertText = bt.status === 'critical' ? '⚠ Critical' : bt.status === 'warning' ? '⚠ Warning' : '';
    const alertClass = bt.status || '';
    return `
      <div class="blood-type-card ${borderClass}">
        <div class="blood-type-name">${bt.type}</div>
        <div class="blood-type-count">${bt.count.toLocaleString()}</div>
        ${alertText ? `<div class="blood-type-alert ${alertClass}">${alertText}</div>` : ''}
      </div>
    `;
  }).join('');
}

let selectedBloodType = null;

function renderInventoryTable(filter = '') {
  const tbody = document.getElementById('inventoryTable');
  if (!tbody) return;

  const searchVal = (document.getElementById('inventorySearch')?.value || filter).toLowerCase();
  const statusFilter = document.getElementById('statusFilter')?.value || '';

  const filtered = state.donations.filter(d => {
    const matchSearch = !searchVal || d.id.toLowerCase().includes(searchVal);
    const matchBlood  = !selectedBloodType || d.blood === selectedBloodType;
    const matchStatus = !statusFilter || d.status === statusFilter;
    return matchSearch && matchBlood && matchStatus;
  });

  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const container = document.getElementById("filters");

function renderFilters() {
  if (!container) return;
  container.innerHTML = "";

  // "All" button
  const allBtn = document.createElement("button");
  allBtn.className = "filter-btn" + (selectedBloodType === null ? " active" : "");
  allBtn.textContent = "All";
  allBtn.onclick = () => {
    selectedBloodType = null;
    renderInventoryTable();
  };
  container.appendChild(allBtn);

  bloodTypes.forEach(type => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (selectedBloodType === type ? " active" : "");
    btn.textContent = type;
    btn.onclick = () => {
      selectedBloodType = type;
      renderInventoryTable();
    };
    container.appendChild(btn);
  });
}

renderFilters();

  tbody.innerHTML = filtered.map(d => `
    <tr>
      <td>${d.id}</td>
      <td><span class="blood-badge">${d.blood}</span></td>
      <td>${d.vol}</td>
      <td>${badge(d.status)}</td>
      <td>${d.branch}</td>
      <td>${d.date}</td>
      <td>${actionMenu('donation', d.id)}</td>
    </tr>
  `).join('');
}

function filterInventory(val) {
  renderInventoryTable(val);
}

// ─── RENDER ALERTS ────────────────────────────────────────────────────────

function renderAlerts() {
  const list = document.getElementById('alertsList');
  if (!list) return;

  const typeMap = {
    critical: { cls: 'alert-critical', badge: 'badge-critical' },
    warning:  { cls: 'alert-warning',  badge: 'badge-warning' },
    info:     { cls: 'alert-info',     badge: '' },
  };

  list.innerHTML = state.alerts.map((a, i) => {
    const t = typeMap[a.type] || typeMap.info;
    return `
      <div class="full-alert-item ${t.cls}" id="alert-${i}">
        <div class="alert-top">
          <div class="alert-title-row">
            <span>${a.icon}</span>
            <strong>${a.title}</strong>
          </div>
          <span class="alert-time">⏱ ${a.time}</span>
        </div>
        <div class="alert-desc">${a.desc}</div>
        <div class="alert-actions">
          <button class="btn-take-action">Take Action</button>
          <button class="btn-dismiss" onclick="dismissAlert(${i})">Dismiss</button>
        </div>
      </div>
    `;
  }).join('');

  // Update badge count
  const badge = document.querySelector('.nav-badge');
  if (badge) badge.textContent = state.alerts.length;
}

function dismissAlert(index) {
  state.alerts.splice(index, 1);
  renderAlerts();
  showToast('Alert dismissed');
}

// Mark all as read
document.addEventListener('click', e => {
  if (e.target.id === 'markAllRead') {
    e.preventDefault();
    state.alerts = [];
    renderAlerts();
    showToast('All alerts marked as read');
  }
});

// ─── CHARTS ───────────────────────────────────────────────────────────────

let chartsRendered = false;

function renderCharts() {
  if (chartsRendered) return;
  chartsRendered = true;

  renderBarChart();
  renderLineChart();
  renderDonutChart();
}

function renderBarChart() {
  const container = document.getElementById('bloodTypeChart');
  if (!container) return;
  const data = [38, 30, 14, 7, 5, 3, 2, 1]; // percentages
  container.innerHTML = data.map(v => `
    <div class="bar-item" data-val="${v}" style="height:${(v/38)*100}%"></div>
  `).join('');
}

function renderLineChart() {
  const canvas = document.getElementById('donationTrends');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const data = [130, 148, 195, 165, 130, 280, 85];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const padL = 40, padR = 20, padT = 20, padB = 30;

  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxVal = 300;

  // Get crimson color
  const crimson = getComputedStyle(document.documentElement).getPropertyValue('--crimson').trim() || '#9b1d42';
  const textMuted = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#9090a8';
  const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#e8e8f0';

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 0.5;
  [0, 65, 130, 195, 280].forEach(v => {
    const y = padT + plotH - (v / maxVal) * plotH;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(W - padR, y);
    ctx.stroke();
    ctx.fillStyle = textMuted;
    ctx.font = '10px DM Sans, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(v, padL - 6, y + 3);
  });

  // Points
  const pts = data.map((v, i) => ({
    x: padL + (i / (data.length - 1)) * plotW,
    y: padT + plotH - (v / maxVal) * plotH,
  }));

  // Gradient fill
  const grad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
  grad.addColorStop(0, 'rgba(155,29,66,0.15)');
  grad.addColorStop(1, 'rgba(155,29,66,0)');

  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, padT + plotH);
  ctx.lineTo(pts[0].x, padT + plotH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = crimson;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Dots
  pts.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = crimson;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // X-axis labels
  ctx.fillStyle = textMuted;
  ctx.font = '10px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  labels.forEach((l, i) => {
    ctx.fillText(l, pts[i].x, H - 6);
  });
}

function renderDonutChart() {
  const canvas = document.getElementById('screeningDonut');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2, R = 80, r = 50;
  const crimson = getComputedStyle(document.documentElement).getPropertyValue('--crimson').trim() || '#9b1d42';

  const slices = [
    { value: 87, color: crimson },
    { value: 9,  color: '#374151' },
    { value: 4,  color: '#f9a8d4' },
  ];

  let angle = -Math.PI / 2;
  slices.forEach(s => {
    const sweep = (s.value / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = s.color;
    ctx.fill();
    angle += sweep;
  });

  // Inner cutout
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#ffffff';
  ctx.fillStyle = bg;
  ctx.fill();

  // Center text
  ctx.fillStyle = crimson;
  ctx.font = 'bold 20px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('87%', cx, cy);
}

// ─── SETTINGS TABS ────────────────────────────────────────────────────────

function initSettingsTabs() {
  document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(`tab-${tab.dataset.tab}`);
      if (panel) panel.classList.add('active');
    });
  });

  // Dark mode toggle in settings
  const dmToggle = document.getElementById('darkModeToggle');
  if (dmToggle) {
    dmToggle.checked = document.documentElement.dataset.theme === 'dark';
    dmToggle.addEventListener('change', () => {
      toggleTheme();
    });
  }
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────

function toggleTheme() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = isDark ? '' : 'dark';
  localStorage.setItem('lifeflow-theme', isDark ? '' : 'dark');

  // Sync dark mode toggle in settings
  const dmToggle = document.getElementById('darkModeToggle');
  if (dmToggle) dmToggle.checked = !isDark;

  // Re-render charts with new colors if on reports page
  chartsRendered = false;
  if (document.getElementById('page-reports').classList.contains('active')) {
    renderCharts();
  }
}

document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

// ─── MODAL ────────────────────────────────────────────────────────────────

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal(id);
    });
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}

// ─── ADD ACCOUNT ──────────────────────────────────────────────────────────

function addAccount() {
  const name   = document.getElementById('newAccountName')?.value.trim();
  const email  = document.getElementById('newAccountEmail')?.value.trim();
  const role   = document.getElementById('newAccountRole')?.value;
  const branch = document.getElementById('newAccountBranch')?.value;

  if (!name || !email) { showToast('Please fill in all required fields'); return; }

  const initials = name.split(' ').map(w => w[0].toUpperCase()).join('').slice(0, 2);
  state.accounts.push({ initials, name, email, role, branch, status: 'Pending', lastLogin: 'Never' });

  renderAccounts();
  closeModal('addAccountModal');
  showToast(`Account for ${name} created successfully`);

  // Clear form
  document.getElementById('newAccountName').value = '';
  document.getElementById('newAccountEmail').value = '';
}

// ─── ADD INVENTORY UNIT ───────────────────────────────────────────────────

function addInventoryUnit() {
  const id     = document.getElementById('newUnitId')?.value.trim();
  const blood  = document.getElementById('newUnitBlood')?.value;
  const vol    = document.getElementById('newUnitVol')?.value.trim() || '450 mL';
  const branch = document.getElementById('newUnitBranch')?.value;

  if (!id) { showToast('Please enter a Unit ID'); return; }

  const today = new Date();
  const dateStr = `${today.getMonth()+1}/${today.getDate()}/${today.getFullYear()}`;
  state.donations.unshift({ id, branch, status: 'Under Testing', blood, vol, date: dateStr });

  renderInventoryTable();
  renderRecentDonations();
  closeModal('addInventoryModal');
  showToast(`Unit ${id} added successfully`);

  document.getElementById('newUnitId').value = '';
  document.getElementById('newUnitVol').value = '';
}

// ─── ADD BRANCH ───────────────────────────────────────────────────────────

function addBranch() {
  const name     = document.getElementById('newBranchName')?.value.trim();
  const location = document.getElementById('newBranchLocation')?.value.trim();
  const manager  = document.getElementById('newBranchManager')?.value.trim();
  const capacity = parseInt(document.getElementById('newBranchCapacity')?.value) || 0;

  if (!name || !location) { showToast('Please fill in required fields'); return; }

  state.branches.push({ name, location, manager: manager || 'TBD', donors: 0, capacity, status: 'Active' });

  renderBranches();
  closeModal('addBranchModal');
  showToast(`Branch "${name}" added successfully`);

  document.getElementById('newBranchName').value = '';
  document.getElementById('newBranchLocation').value = '';
  document.getElementById('newBranchManager').value = '';
  document.getElementById('newBranchCapacity').value = '';
}

// ─── TOAST ────────────────────────────────────────────────────────────────

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── GLOBAL SEARCH SYSTEM ───────────────────────────────────────
function initSystemSearch() {
  const searchInput = document.getElementById('mainSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();

    const filteredDonations = state.donations.filter(d => 
      d.id.toLowerCase().includes(query) || 
      d.branch.toLowerCase().includes(query) ||
      d.blood.toLowerCase().includes(query)
    );
    renderRecentDonations(filteredDonations);

    if (window.renderBranches) {
        const filteredBranches = state.branches.filter(b => 
          b.name.toLowerCase().includes(query) || b.location.toLowerCase().includes(query)
        );
        renderBranches(filteredBranches);
    }
  });
}
// ─── SEARCH BAR KEYBOARD SHORTCUT ────────────────────────────────────────

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    document.getElementById('mainSearch')?.focus();
  }
});

// ─── RESTORE THEME ────────────────────────────────────────────────────────

function restoreTheme() {
  const saved = localStorage.getItem('lifeflow-theme');
  if (saved === 'dark') {
    document.documentElement.dataset.theme = 'dark';
    const dmToggle = document.getElementById('darkModeToggle');
    if (dmToggle) dmToggle.checked = true;
  }
}

// ─── ACTION DROPDOWN LOGIC ────────────────────────────────────────────────

function toggleActionMenu(btn) {
  const menu = btn.nextElementSibling;
  const isOpen = menu.classList.contains('open');
  // Close all open menus first
  document.querySelectorAll('.action-menu.open').forEach(m => m.classList.remove('open'));
  if (!isOpen) menu.classList.add('open');
}

// Close dropdown when clicking outside
document.addEventListener('click', e => {
  if (!e.target.closest('.action-wrap')) {
    document.querySelectorAll('.action-menu.open').forEach(m => m.classList.remove('open'));
  }
});

function actionView(type, id) {
  document.querySelectorAll('.action-menu.open').forEach(m => m.classList.remove('open'));
  showToast(`Viewing ${type}: ${id}`);
}

function actionEdit(type, id) {
  document.querySelectorAll('.action-menu.open').forEach(m => m.classList.remove('open'));
  showToast(`Editing ${type}: ${id}`);
}

function actionExport(type, id) {
  document.querySelectorAll('.action-menu.open').forEach(m => m.classList.remove('open'));
  showToast(`Exporting ${type}: ${id}`);
}

function actionDelete(type, id) {
  document.querySelectorAll('.action-menu.open').forEach(m => m.classList.remove('open'));
  if (type === 'donation') {
    const idx = state.donations.findIndex(d => d.id === id);
    if (idx !== -1) {
      state.donations.splice(idx, 1);
      renderRecentDonations();
      renderInventoryTable();
      showToast(`Deleted donation ${id}`);
    }
  } else if (type === 'account') {
    const idx = state.accounts.findIndex(a => a.email === id);
    if (idx !== -1) {
      const name = state.accounts[idx].name;
      state.accounts.splice(idx, 1);
      renderAccounts();
      showToast(`Deleted account: ${name}`);
    }
  }
}

function actionDeleteBranch(name) {
  document.querySelectorAll('.action-menu.open').forEach(m => m.classList.remove('open'));
  const idx = state.branches.findIndex(b => b.name === name);
  if (idx !== -1) {
    state.branches.splice(idx, 1);
    renderBranches();
    showToast(`Deleted branch: ${name}`);
  }
}

// ─── INIT ─────────────────────────────────────────────────────────────────

// دور على function init() وخليها كده:
function init() {
  restoreTheme();
  initNav();
  initSettingsTabs();
  renderRecentDonations();
  renderAccounts();
  renderBranches();
  renderBloodTypeCards();
  renderInventoryTable();
  renderAlerts();
  
  initSystemSearch(); 
}

document.addEventListener('DOMContentLoaded', init);