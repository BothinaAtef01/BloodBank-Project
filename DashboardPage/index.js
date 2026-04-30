/* ============================================
   LIFEFLOW — Blood Bank & Donation System
   index.js — Fully Functional
   ============================================ */

// ─── STATE ─────────────────────────────────────────────────────────────────

const state = {
  donations: [
    { id: 'DON-9941', branch: 'Alex',           status: 'Under Testing', blood: 'O+',  vol: '450 mL', date: '4/21/2026' },
    { id: 'DON-9940', branch: 'Doke, Cairo',    status: 'Rejected',      blood: 'AB+', vol: '450 mL', date: '4/21/2026' },
    { id: 'DON-9939', branch: 'SidiGaber, Al...',status: 'Approved',     blood: 'A-',  vol: '450 mL', date: '4/21/2026' },
    { id: 'DON-9938', branch: 'Cairo',           status: 'Expired',       blood: 'O-',  vol: '450 mL', date: '4/21/2026' },
    { id: 'DON-9937', branch: 'Cairo',           status: 'Reserved',      blood: 'B-',  vol: '450 mL', date: '4/21/2026' },
    { id: 'DON-9936', branch: 'Alex',            status: 'Approved',      blood: 'A+',  vol: '450 mL', date: '4/20/2026' },
    { id: 'DON-9935', branch: 'Giza',            status: 'Under Testing', blood: 'O+',  vol: '450 mL', date: '4/20/2026' },
    { id: 'DON-9934', branch: 'SidiGaber, Al...',status: 'Under Testing', blood: 'B+',  vol: '450 mL', date: '4/20/2026' },
    { id: 'DON-9933', branch: 'Doke, Cairo',     status: 'Approved',      blood: 'AB-', vol: '450 mL', date: '4/19/2026' },
    { id: 'DON-9932', branch: 'Cairo',           status: 'Reserved',      blood: 'O+',  vol: '450 mL', date: '4/19/2026' },
    { id: 'DON-9931', branch: 'Alex',            status: 'Fulfilled',     blood: 'A+',  vol: '450 mL', date: '4/19/2026' },
    { id: 'DON-9930', branch: 'Cairo',           status: 'Rejected',      blood: 'B+',  vol: '450 mL', date: '4/18/2026' },
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

// ─── VIEW MODAL ────────────────────────────────────────────────────────────

function showViewModal(title, rows) {
  let modal = document.getElementById('viewDetailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'viewDetailModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 id="viewModalTitle"></h2>
          <button class="modal-close" onclick="closeModal('viewDetailModal')">×</button>
        </div>
        <div id="viewModalBody" class="view-modal-body"></div>
        <div class="modal-footer">
          <button class="btn-outline" onclick="closeModal('viewDetailModal')">Close</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal('viewDetailModal'); });
  }
  document.getElementById('viewModalTitle').textContent = title;
  document.getElementById('viewModalBody').innerHTML = rows.map(([k,v]) =>
    `<div class="view-row"><span class="view-key">${k}</span><span class="view-val">${v}</span></div>`
  ).join('');
  openModal('viewDetailModal');
}

// ─── EDIT MODAL ────────────────────────────────────────────────────────────

function showEditModal(type, id) {
  if (type === 'donation' || type === 'branch-inv') {
    const item = state.donations.find(d => d.id === id);
    if (!item) return;

    let modal = document.getElementById('editDonationModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'editDonationModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal">
          <div class="modal-header">
            <h2>Edit Unit</h2>
            <button class="modal-close" onclick="closeModal('editDonationModal')">×</button>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Status</label>
              <select class="form-input" id="editDonStatus">
                <option>Under Testing</option><option>Approved</option><option>Rejected</option>
                <option>Expired</option><option>Reserved</option><option>Fulfilled</option>
              </select>
            </div>
            <div class="form-group">
              <label>Blood Type</label>
              <select class="form-input" id="editDonBlood">
                <option>O+</option><option>O-</option><option>A+</option><option>A-</option>
                <option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
              </select>
            </div>
            <div class="form-group">
              <label>Volume</label>
              <input type="text" class="form-input" id="editDonVol" />
            </div>
            <div class="form-group">
              <label>Branch</label>
              <input type="text" class="form-input" id="editDonBranch" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-outline" onclick="closeModal('editDonationModal')">Cancel</button>
            <button class="btn-primary" id="editDonSave">Save Changes</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click', e => { if (e.target === modal) closeModal('editDonationModal'); });
    }

    document.getElementById('editDonStatus').value = item.status;
    document.getElementById('editDonBlood').value = item.blood;
    document.getElementById('editDonVol').value = item.vol;
    document.getElementById('editDonBranch').value = item.branch;

    document.getElementById('editDonSave').onclick = () => {
      item.status = document.getElementById('editDonStatus').value;
      item.blood  = document.getElementById('editDonBlood').value;
      item.vol    = document.getElementById('editDonVol').value;
      item.branch = document.getElementById('editDonBranch').value;
      renderRecentDonations();
      renderInventoryTable();
      closeModal('editDonationModal');
      showToast(`Unit ${id} updated successfully`);
    };

    openModal('editDonationModal');
  }

  else if (type === 'account') {
    const item = state.accounts.find(a => a.email === id);
    if (!item) return;

    let modal = document.getElementById('editAccountModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'editAccountModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal">
          <div class="modal-header">
            <h2>Edit Account</h2>
            <button class="modal-close" onclick="closeModal('editAccountModal')">×</button>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" class="form-input" id="editAccName" />
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" class="form-input" id="editAccEmail" />
            </div>
            <div class="form-group">
              <label>Role</label>
              <select class="form-input" id="editAccRole">
                <option>Staff</option><option>Lab Tech</option><option>Branch Manager</option><option>Admin</option>
              </select>
            </div>
            <div class="form-group">
              <label>Status</label>
              <select class="form-input" id="editAccStatus">
                <option>Active</option><option>Inactive</option><option>Pending</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-outline" onclick="closeModal('editAccountModal')">Cancel</button>
            <button class="btn-primary" id="editAccSave">Save Changes</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click', e => { if (e.target === modal) closeModal('editAccountModal'); });
    }

    document.getElementById('editAccName').value   = item.name;
    document.getElementById('editAccEmail').value  = item.email;
    document.getElementById('editAccRole').value   = item.role;
    document.getElementById('editAccStatus').value = item.status;

    document.getElementById('editAccSave').onclick = () => {
      item.name   = document.getElementById('editAccName').value;
      item.email  = document.getElementById('editAccEmail').value;
      item.role   = document.getElementById('editAccRole').value;
      item.status = document.getElementById('editAccStatus').value;
      item.initials = item.name.split(' ').map(w => w[0].toUpperCase()).join('').slice(0, 2);
      renderAccounts();
      closeModal('editAccountModal');
      showToast(`Account updated successfully`);
    };

    openModal('editAccountModal');
  }

  else if (type === 'branch') {
    const item = state.branches.find(b => b.name === id);
    if (!item) return;

    let modal = document.getElementById('editBranchModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'editBranchModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal">
          <div class="modal-header">
            <h2>Edit Branch</h2>
            <button class="modal-close" onclick="closeModal('editBranchModal')">×</button>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Branch Name</label>
              <input type="text" class="form-input" id="editBrName" />
            </div>
            <div class="form-group">
              <label>Location</label>
              <input type="text" class="form-input" id="editBrLocation" />
            </div>
            <div class="form-group">
              <label>Manager</label>
              <input type="text" class="form-input" id="editBrManager" />
            </div>
            <div class="form-group">
              <label>Capacity (%)</label>
              <input type="number" class="form-input" id="editBrCapacity" min="0" max="100" />
            </div>
            <div class="form-group">
              <label>Status</label>
              <select class="form-input" id="editBrStatus">
                <option>Active</option><option>Warning</option><option>Critical</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-outline" onclick="closeModal('editBranchModal')">Cancel</button>
            <button class="btn-primary" id="editBrSave">Save Changes</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click', e => { if (e.target === modal) closeModal('editBranchModal'); });
    }

    document.getElementById('editBrName').value     = item.name;
    document.getElementById('editBrLocation').value = item.location;
    document.getElementById('editBrManager').value  = item.manager;
    document.getElementById('editBrCapacity').value = item.capacity;
    document.getElementById('editBrStatus').value   = item.status;

    document.getElementById('editBrSave').onclick = () => {
      item.name     = document.getElementById('editBrName').value;
      item.location = document.getElementById('editBrLocation').value;
      item.manager  = document.getElementById('editBrManager').value;
      item.capacity = parseInt(document.getElementById('editBrCapacity').value) || item.capacity;
      item.status   = document.getElementById('editBrStatus').value;
      renderBranches();
      closeModal('editBranchModal');
      showToast(`Branch updated successfully`);
    };

    openModal('editBranchModal');
  }
}

// ─── PDF EXPORT ────────────────────────────────────────────────────────────

function loadjsPDF(callback) {
  if (window.jspdf) { callback(); return; }
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  script.onload = () => {
    const s2 = document.createElement('script');
    s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js';
    s2.onload = callback;
    document.head.appendChild(s2);
  };
  document.head.appendChild(script);
}

function exportDonationPDF(id) {
  const item = state.donations.find(d => d.id === id);
  if (!item) return;
  showToast('Generating PDF…');
  loadjsPDF(() => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(155, 29, 66);
    doc.text('LifeFlow — Donation Record', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.autoTable({
      startY: 36,
      head: [['Field', 'Value']],
      body: [
        ['Donation ID', item.id],
        ['Branch',      item.branch],
        ['Blood Type',  item.blood],
        ['Volume',      item.vol],
        ['Status',      item.status],
        ['Date',        item.date],
      ],
      styles: { fontSize: 11 },
      headStyles: { fillColor: [155, 29, 66] },
    });
    doc.save(`${item.id}.pdf`);
    showToast(`${item.id}.pdf downloaded`);
  });
}

function exportAccountPDF(email) {
  const item = state.accounts.find(a => a.email === email);
  if (!item) return;
  showToast('Generating PDF…');
  loadjsPDF(() => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(155, 29, 66);
    doc.text('LifeFlow — Account Record', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.autoTable({
      startY: 36,
      head: [['Field', 'Value']],
      body: [
        ['Name',       item.name],
        ['Email',      item.email],
        ['Role',       item.role],
        ['Branch',     item.branch],
        ['Status',     item.status],
        ['Last Login', item.lastLogin],
      ],
      styles: { fontSize: 11 },
      headStyles: { fillColor: [155, 29, 66] },
    });
    doc.save(`Account-${item.name.replace(/ /g,'_')}.pdf`);
    showToast(`Account PDF downloaded`);
  });
}

function exportBranchPDF(name) {
  const item = state.branches.find(b => b.name === name);
  if (!item) return;
  showToast('Generating PDF…');
  loadjsPDF(() => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(155, 29, 66);
    doc.text('LifeFlow — Branch Record', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.autoTable({
      startY: 36,
      head: [['Field', 'Value']],
      body: [
        ['Branch Name', item.name],
        ['Location',    item.location],
        ['Manager',     item.manager],
        ['Total Donors',item.donors.toLocaleString()],
        ['Capacity',    item.capacity + '%'],
        ['Status',      item.status],
      ],
      styles: { fontSize: 11 },
      headStyles: { fillColor: [155, 29, 66] },
    });
    doc.save(`Branch-${item.name.replace(/ /g,'_')}.pdf`);
    showToast(`Branch PDF downloaded`);
  });
}

function exportFullReportPDF() {
  showToast('Generating full report PDF…');
  loadjsPDF(() => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(155, 29, 66);
    doc.text('LifeFlow — Full Report', 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 120);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

    // Stats summary
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 50);
    doc.text('System Overview', 14, 42);
    doc.autoTable({
      startY: 46,
      head: [['Metric', 'Value']],
      body: [
        ['Total Donors',     '1,248'],
        ['Units Available',  '74,850'],
        ['Critical Shortage','3 Blood Types'],
        ['Donations (April)','87'],
        ['Fulfillment Rate', '97.2%'],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [155, 29, 66] },
      margin: { left: 14, right: 14 },
    });

    // Blood Inventory
    let y = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 50);
    doc.text('Blood Inventory', 14, y);
    doc.autoTable({
      startY: y + 4,
      head: [['Blood Type', 'Units', 'Status']],
      body: state.bloodInventory.map(b => [b.type, b.count.toLocaleString(), b.status || 'Normal']),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [155, 29, 66] },
      margin: { left: 14, right: 14 },
    });

    // Donation Records
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 50);
    doc.text('Donation Records', 14, 20);
    doc.autoTable({
      startY: 25,
      head: [['ID', 'Branch', 'Blood', 'Volume', 'Status', 'Date']],
      body: state.donations.map(d => [d.id, d.branch, d.blood, d.vol, d.status, d.date]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [155, 29, 66] },
      margin: { left: 14, right: 14 },
    });

    // Branches
    y = doc.lastAutoTable.finalY + 12;
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 50);
    doc.text('Branch Performance', 14, y);
    doc.autoTable({
      startY: y + 4,
      head: [['Branch', 'Location', 'Manager', 'Donors', 'Capacity', 'Status']],
      body: state.branches.map(b => [b.name, b.location, b.manager, b.donors.toLocaleString(), b.capacity + '%', b.status]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [155, 29, 66] },
      margin: { left: 14, right: 14 },
    });

    doc.save('LifeFlow-Full-Report.pdf');
    showToast('LifeFlow-Full-Report.pdf downloaded');
  });
}

// ─── TAKE ACTION on alerts ─────────────────────────────────────────────────

function takeAction(index) {
  const alert = state.alerts[index];
  if (!alert) return;
  const messages = {
    critical: 'Donor outreach campaign initiated for this blood type.',
    warning:  'Prioritization flagged — fulfillment team notified.',
    info:     'Branch team has been notified.',
  };
  showToast(messages[alert.type] || 'Action taken.');
  // Mark as handled
  state.alerts[index].handled = true;
  renderAlerts();
}

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
      navigateTo(link.dataset.page);
    });
  });

  document.querySelectorAll('.view-all-link[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });

  // Logout
  document.querySelector('.logout-btn')?.addEventListener('click', e => {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
      showToast('Logged out successfully');
    }
  });

  // Notification bell
  document.querySelector('.notif-btn')?.addEventListener('click', () => {
    navigateTo('alerts');
  });

  // Help icon in topbar
  document.querySelectorAll('.icon-btn:not(.notif-btn):not(#themeToggle)').forEach(btn => {
    btn.addEventListener('click', () => navigateTo('help'));
  });
}

function navigateTo(page) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');

  const titles = {
    dashboard: 'Dashboard Overview',
    reports:   'Reports Overview',
    alerts:    'Alerts',
    accounts:  'Manage Accounts',
    branches:  'Branch Network',
    inventory: 'Blood Inventory',
    settings:  'Settings',
    help:      'Help Center',
  };
  document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';

  if (page === 'reports') renderCharts();
}

// ─── ACTION MENU HTML ──────────────────────────────────────────────────────

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
          Export PDF
        </button>
        <button class="action-menu-item danger" onclick="actionDelete('${type}','${id}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          Delete
        </button>
      </div>
    </div>`;
}

// ─── DASHBOARD — BLOOD INVENTORY LIVE ────────────────────────────────────

const DB_BLOOD_TYPES = [
  { key: 'apos',  label: 'A+',  units: 124, max: 150, status: '' },
  { key: 'aneg',  label: 'A−',  units: 45,  max: 150, status: 'warning' },
  { key: 'bpos',  label: 'B+',  units: 98,  max: 150, status: '' },
  { key: 'bneg',  label: 'B−',  units: 22,  max: 150, status: '' },
  { key: 'opos',  label: 'O+',  units: 187, max: 187, status: '' },
  { key: 'oneg',  label: 'O−',  units: 8,   max: 150, status: 'critical' },
  { key: 'abpos', label: 'AB+', units: 112, max: 150, status: '' },
  { key: 'abneg', label: 'AB−', units: 38,  max: 150, status: '' },
];

function renderDbBloodGrid() {
  const grid = document.getElementById('dbBloodGrid');
  if (!grid) return;
  grid.innerHTML = DB_BLOOD_TYPES.map(bt => {
    const pct = Math.round((bt.units / bt.max) * 100);
    const footerClass = bt.status === 'critical' ? 'db-bt-critical' : bt.status === 'warning' ? 'db-bt-warning' : 'db-bt-pct';
    const footerText  = bt.status === 'critical' ? 'CRITICAL' : bt.status === 'warning' ? `${pct}%` : `${pct}%`;
    return `
      <div class="db-bt-card ${bt.key}">
        <div class="db-bt-name">${bt.label}</div>
        <div class="db-bt-units">${bt.units} units</div>
        <div class="db-bt-bar-track">
          <div class="db-bt-bar-fill" style="width:${pct}%"></div>
        </div>
        <div class="db-bt-footer db-bt-${bt.status || 'pct'}">${footerText}</div>
      </div>`;
  }).join('');
}

// ─── DASHBOARD — URGENT BLOOD REQUESTS ───────────────────────────────────

const DB_REQUESTS = [
  { patient: 'Pt. #4421', blood: 'oneg',  bloodLabel: 'O−', hospital: 'City General',     units: 4, priority: 'urgent', status: 'pending' },
  { patient: 'Pt. #4418', blood: 'apos',  bloodLabel: 'A+', hospital: "St. Mary's Medical", units: 2, priority: 'urgent', status: 'approved' },
  { patient: 'Pt. #4415', blood: 'bneg',  bloodLabel: 'B−', hospital: 'Northside Clinic',  units: 6, priority: 'high',   status: 'pending' },
];

function renderDbRequests() {
  const tbody = document.getElementById('dbRequestsTable');
  if (!tbody) return;
  tbody.innerHTML = DB_REQUESTS.map(r => {
    const priClass = r.priority === 'urgent' ? 'db-priority-urgent' : 'db-priority-high';
    const priLabel = r.priority === 'urgent' ? 'Urgent' : 'High';
    const stClass  = r.status === 'approved' ? 'db-status-approved' : 'db-status-pending';
    const stLabel  = r.status === 'approved' ? 'Approved' : 'Pending';
    const btnLabel = r.status === 'approved' ? 'Dispatch' : 'Approve';
    return `
      <tr>
        <td style="color:var(--text-muted);font-weight:500;">${r.patient}</td>
        <td><span class="db-blood-chip ${r.blood}">${r.bloodLabel}</span></td>
        <td>${r.hospital}</td>
        <td style="font-weight:700;">${r.units}</td>
        <td><span class="${priClass}"><span class="db-priority-dot"></span>${priLabel}</span></td>
        <td>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="${stClass}">${stLabel}</span>
            <button class="db-action-btn" onclick="handleDbRequest('${r.patient}','${btnLabel}')">${btnLabel}</button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

function handleDbRequest(patient, action) {
  showToast(`${action} action taken for ${patient}`);
}

// ─── DASHBOARD — EXPIRY WATCH ─────────────────────────────────────────────

const DB_EXPIRY = [
  { id: 'BU-8819', blood: 'opos',  bloodLabel: 'O+', date: 'Collected Mar 27' },
  { id: 'BU-8821', blood: 'apos',  bloodLabel: 'A+', date: 'Collected Mar 28' },
  { id: 'BU-8815', blood: 'bpos',  bloodLabel: 'B+', date: 'Collected Apr 1' },
  { id: 'BU-8810', blood: 'abpos', bloodLabel: 'AB+', date: 'Collected Apr 2' },
];

function renderDbExpiry() {
  const list = document.getElementById('dbExpiryList');
  if (!list) return;
  list.innerHTML = DB_EXPIRY.map(e => `
    <div class="db-expiry-item">
      <div class="db-expiry-chips">
        <span class="db-expiry-id">${e.id}</span>
        <span class="db-blood-chip ${e.blood}">${e.bloodLabel}</span>
      </div>
      <div class="db-expiry-date">${e.date}</div>
    </div>`).join('');
}

// ─── RENDER RECENT DONATIONS TABLE ────────────────────────────────────────

function renderRecentDonations(list) {
  const tbody = document.getElementById('recentDonations');
  if (!tbody) return;
  const data = (list !== undefined ? list : state.donations).slice(0, 8);
  tbody.innerHTML = data.map(d => `
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

function filterAccounts(val) { renderAccounts(val); }

// ─── RENDER BRANCHES ──────────────────────────────────────────────────────

function renderBranches(list) {
  const grid = document.getElementById('branchesGrid');
  if (!grid) return;
  const branches = list || state.branches;
  grid.innerHTML = branches.map(b => {
    const capClass = b.capacity < 40 ? 'critical' : b.capacity < 60 ? 'warning' : '';
    return `
      <div class="branch-card">
        <div class="branch-card-header">
          <h3>${b.name}</h3>
          <div class="action-wrap">
            <button class="action-dots" onclick="toggleActionMenu(this)">⋮</button>
            <div class="action-menu">
              <button class="action-menu-item" onclick="actionView('branch','${b.name}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/></svg>
                View
              </button>
              <button class="action-menu-item" onclick="actionEdit('branch','${b.name}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
              <button class="action-menu-item" onclick="actionExport('branch','${b.name}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export PDF
              </button>
              <button class="action-menu-item danger" onclick="actionDeleteBranch('${b.name}')">
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
          <div class="branch-meta-row"><span>Manager</span><span>${b.manager}</span></div>
          <div class="branch-meta-row"><span>👥 Donors</span><span>${b.donors.toLocaleString()}</span></div>
          <div class="branch-meta-row"><span>⚡ Capacity</span><span>${b.capacity}%</span></div>
        </div>
        <div class="branch-card-footer">
          ${badge(b.status)}
          <a href="#" class="crimson-link" onclick="actionView('branch','${b.name}'); return false;">View Details</a>
        </div>
      </div>`;
  }).join('');
}

// ─── RENDER INVENTORY ─────────────────────────────────────────────────────

function renderBloodTypeCards() {
  const container = document.getElementById('bloodTypeCards');
  if (!container) return;
  container.innerHTML = state.bloodInventory.map(bt => {
    const borderClass = bt.status === 'critical' ? 'alert-border' : bt.status === 'warning' ? 'warning-border' : '';
    const alertText = bt.status === 'critical' ? '⚠ Critical' : bt.status === 'warning' ? '⚠ Warning' : '';
    return `
      <div class="blood-type-card ${borderClass}">
        <div class="blood-type-name">${bt.type}</div>
        <div class="blood-type-count">${bt.count.toLocaleString()}</div>
        ${alertText ? `<div class="blood-type-alert ${bt.status}">${alertText}</div>` : ''}
      </div>`;
  }).join('');
}

let selectedBloodType = null;

function renderInventoryTable(filter = '') {
  const tbody = document.getElementById('inventoryTable');
  if (!tbody) return;

  const searchVal = (document.getElementById('inventorySearch')?.value || filter).toLowerCase();

  const filtered = state.donations.filter(d => {
    const matchSearch = !searchVal || d.id.toLowerCase().includes(searchVal);
    const matchBlood  = !selectedBloodType || d.blood === selectedBloodType;
    return matchSearch && matchBlood;
  });

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

function renderFilters() {
  const container = document.getElementById('filters');
  if (!container) return;
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  container.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'filter-btn' + (selectedBloodType === null ? ' active' : '');
  allBtn.textContent = 'All';
  allBtn.onclick = () => { selectedBloodType = null; renderInventoryTable(); };
  container.appendChild(allBtn);

  bloodTypes.forEach(type => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (selectedBloodType === type ? ' active' : '');
    btn.textContent = type;
    btn.onclick = () => { selectedBloodType = type; renderInventoryTable(); };
    container.appendChild(btn);
  });
}

function filterInventory(val) { renderInventoryTable(val); }

// ─── RENDER ALERTS ────────────────────────────────────────────────────────

function renderAlerts() {
  const list = document.getElementById('alertsList');
  if (!list) return;

  const typeMap = {
    critical: { cls: 'alert-critical' },
    warning:  { cls: 'alert-warning' },
    info:     { cls: 'alert-info' },
  };

  list.innerHTML = state.alerts.length === 0
    ? '<p style="color:var(--text-muted);padding:20px 0;text-align:center;">No active alerts.</p>'
    : state.alerts.map((a, i) => {
      const t = typeMap[a.type] || typeMap.info;
      const handled = a.handled ? 'opacity:0.5;' : '';
      return `
        <div class="full-alert-item ${t.cls}" id="alert-${i}" style="${handled}">
          <div class="alert-top">
            <div class="alert-title-row">
              <span>${a.icon}</span>
              <strong>${a.title}</strong>
            </div>
            <span class="alert-time">⏱ ${a.time}</span>
          </div>
          <div class="alert-desc">${a.desc}</div>
          <div class="alert-actions">
            <button class="btn-take-action" onclick="takeAction(${i})" ${a.handled ? 'disabled style="opacity:0.5"' : ''}>
              ${a.handled ? '✓ Actioned' : 'Take Action'}
            </button>
            <button class="btn-dismiss" onclick="dismissAlert(${i})">Dismiss</button>
          </div>
        </div>`;
    }).join('');

  const navBadge = document.querySelector('.nav-badge');
  if (navBadge) navBadge.textContent = state.alerts.filter(a => !a.handled).length;
}

function dismissAlert(index) {
  state.alerts.splice(index, 1);
  renderAlerts();
  showToast('Alert dismissed');
}

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
  const data = [38, 30, 14, 7, 5, 3, 2, 1];
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
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const maxVal = 300;

  const crimson = getComputedStyle(document.documentElement).getPropertyValue('--crimson').trim() || '#9b1d42';
  const textMuted = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#9090a8';
  const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#e8e8f0';

  ctx.clearRect(0, 0, W, H);

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 0.5;
  [0, 65, 130, 195, 280].forEach(v => {
    const y = padT + plotH - (v / maxVal) * plotH;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
    ctx.fillStyle = textMuted;
    ctx.font = '10px DM Sans, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(v, padL - 6, y + 3);
  });

  const pts = data.map((v, i) => ({
    x: padL + (i / (data.length - 1)) * plotW,
    y: padT + plotH - (v / maxVal) * plotH,
  }));

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

  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = crimson;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();

  pts.forEach(p => {
    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = crimson; ctx.fill();
    ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.stroke();
  });

  ctx.fillStyle = textMuted;
  ctx.font = '10px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  labels.forEach((l, i) => ctx.fillText(l, pts[i].x, H - 6));
}

function renderDonutChart() {
  const canvas = document.getElementById('screeningDonut');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2, R = 80, r = 50;
  const crimson = getComputedStyle(document.documentElement).getPropertyValue('--crimson').trim() || '#9b1d42';
  const isDark = document.documentElement.dataset.theme === 'dark';

  const slices = [
    { value: 87, color: crimson },
    { value: 9,  color: isDark ? '#374151' : '#374151' },
    { value: 4,  color: '#f9a8d4' },
  ];

  let angle = -Math.PI / 2;
  slices.forEach(s => {
    const sweep = (s.value / 100) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = s.color; ctx.fill();
    angle += sweep;
  });

  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#ffffff';
  ctx.fill();

  ctx.fillStyle = crimson;
  ctx.font = 'bold 20px DM Sans, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
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

  const dmToggle = document.getElementById('darkModeToggle');
  if (dmToggle) {
    dmToggle.checked = document.documentElement.dataset.theme === 'dark';
    dmToggle.addEventListener('change', toggleTheme);
  }

  // Save profile button
  document.querySelector('#tab-profile .btn-primary')?.addEventListener('click', () => {
    showToast('Profile changes saved');
  });

  // Save password button
  document.querySelector('#tab-security .btn-primary')?.addEventListener('click', () => {
    const cur = document.querySelector('#tab-security input[placeholder="Enter current password"]').value;
    const nw  = document.querySelector('#tab-security input[placeholder="Enter new password"]').value;
    const cnf = document.querySelector('#tab-security input[placeholder="Confirm new password"]').value;
    if (!cur || !nw || !cnf) { showToast('Please fill in all password fields'); return; }
    if (nw !== cnf) { showToast('New passwords do not match'); return; }
    if (nw.length < 6) { showToast('Password must be at least 6 characters'); return; }
    showToast('Password updated successfully');
    document.querySelectorAll('#tab-security input').forEach(i => i.value = '');
  });
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────

function toggleTheme() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = isDark ? '' : 'dark';
  localStorage.setItem('lifeflow-theme', isDark ? '' : 'dark');

  const dmToggle = document.getElementById('darkModeToggle');
  if (dmToggle) dmToggle.checked = !isDark;

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
    }, { once: true });
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
  renderBloodTypeCards();
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

// ─── GLOBAL SEARCH ────────────────────────────────────────────────────────

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

    const filteredBranches = state.branches.filter(b =>
      b.name.toLowerCase().includes(query) || b.location.toLowerCase().includes(query)
    );
    renderBranches(filteredBranches);
  });
}

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    document.getElementById('mainSearch')?.focus();
  }
});

// ─── REPORTS PAGE BUTTONS ─────────────────────────────────────────────────

function initReportsButtons() {
  const dateBtn = document.getElementById('reportDateBtn');
  const branchBtn = document.getElementById('reportBranchBtn');
  const exportBtn = document.getElementById('reportExportBtn');

  dateBtn?.addEventListener('click', function() {
    const options = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year'];
    const curr = options.findIndex(o => this.textContent.includes(o));
    const next = options[(curr + 1) % options.length];
    this.textContent = `📅 ${next}`;
    showToast(`Filtered: ${next}`);
  });

  branchBtn?.addEventListener('click', function() {
    const branches = ['All Branches', 'Cairo Main', 'Alex Central', 'Sidi Gaber', 'Giza Branch', 'Doke Clinic'];
    const curr = branches.findIndex(b => this.textContent.includes(b));
    const next = branches[(curr + 1) % branches.length];
    this.textContent = `⊟ ${next}`;
    showToast(`Branch filter: ${next}`);
  });

  exportBtn?.addEventListener('click', () => exportFullReportPDF());
}

// ─── INVENTORY EXPORT BUTTON ──────────────────────────────────────────────

function initInventoryExportBtn() {
  const exportBtn = document.querySelector('#page-inventory .btn-outline');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      showToast('Generating inventory PDF…');
      loadjsPDF(() => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.setTextColor(155, 29, 66);
        doc.text('LifeFlow — Blood Inventory Export', 14, 20);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 120);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

        // Blood type summary
        doc.setFontSize(13);
        doc.setTextColor(30, 30, 50);
        doc.text('Blood Type Summary', 14, 40);
        doc.autoTable({
          startY: 44,
          head: [['Blood Type', 'Units', 'Status']],
          body: state.bloodInventory.map(b => [b.type, b.count.toLocaleString(), b.status || 'Normal']),
          styles: { fontSize: 10 },
          headStyles: { fillColor: [155, 29, 66] },
          margin: { left: 14, right: 14 },
        });

        // Filter if blood type selected
        const filtered = selectedBloodType
          ? state.donations.filter(d => d.blood === selectedBloodType)
          : state.donations;

        let y = doc.lastAutoTable.finalY + 12;
        doc.setFontSize(13);
        doc.setTextColor(30, 30, 50);
        doc.text(`Inventory Units${selectedBloodType ? ' — ' + selectedBloodType : ''}`, 14, y);
        doc.autoTable({
          startY: y + 4,
          head: [['ID', 'Blood', 'Volume', 'Status', 'Branch', 'Date']],
          body: filtered.map(d => [d.id, d.blood, d.vol, d.status, d.branch, d.date]),
          styles: { fontSize: 9 },
          headStyles: { fillColor: [155, 29, 66] },
          margin: { left: 14, right: 14 },
        });

        doc.save('LifeFlow-Inventory.pdf');
        showToast('LifeFlow-Inventory.pdf downloaded');
      });
    });
  }
}

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
  document.querySelectorAll('.action-menu.open').forEach(m => m.classList.remove('open'));
  if (!isOpen) menu.classList.add('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.action-wrap')) {
    document.querySelectorAll('.action-menu.open').forEach(m => m.classList.remove('open'));
  }
});

function actionView(type, id) {
  document.querySelectorAll('.action-menu.open').forEach(m => m.classList.remove('open'));

  if (type === 'donation') {
    const item = state.donations.find(d => d.id === id);
    if (!item) return;
    showViewModal(`Donation — ${item.id}`, [
      ['Donation ID', item.id],
      ['Branch',      item.branch],
      ['Blood Type',  item.blood],
      ['Volume',      item.vol],
      ['Status',      badge(item.status)],
      ['Date',        item.date],
    ]);
  } else if (type === 'account') {
    const item = state.accounts.find(a => a.email === id);
    if (!item) return;
    showViewModal(`Account — ${item.name}`, [
      ['Name',        item.name],
      ['Email',       item.email],
      ['Role',        item.role],
      ['Branch',      item.branch],
      ['Status',      badge(item.status)],
      ['Last Login',  item.lastLogin],
    ]);
  } else if (type === 'branch') {
    const item = state.branches.find(b => b.name === id);
    if (!item) return;
    showViewModal(`Branch — ${item.name}`, [
      ['Branch Name', item.name],
      ['Location',    `📍 ${item.location}`],
      ['Manager',     item.manager],
      ['Total Donors',item.donors.toLocaleString()],
      ['Capacity',    item.capacity + '%'],
      ['Status',      badge(item.status)],
    ]);
  }
}

function actionEdit(type, id) {
  document.querySelectorAll('.action-menu.open').forEach(m => m.classList.remove('open'));
  showEditModal(type, id);
}

function actionExport(type, id) {
  document.querySelectorAll('.action-menu.open').forEach(m => m.classList.remove('open'));
  if (type === 'donation')  exportDonationPDF(id);
  else if (type === 'account') exportAccountPDF(id);
  else if (type === 'branch')  exportBranchPDF(id);
}

function actionDelete(type, id) {
  document.querySelectorAll('.action-menu.open').forEach(m => m.classList.remove('open'));
  if (type === 'donation') {
    const idx = state.donations.findIndex(d => d.id === id);
    if (idx !== -1) {
      state.donations.splice(idx, 1);
      renderRecentDonations();
      renderInventoryTable();
      showToast(`Deleted unit ${id}`);
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
  renderDbBloodGrid();
  renderDbRequests();
  renderDbExpiry();
  initSystemSearch();
  initReportsButtons();
  initInventoryExportBtn();
}

document.addEventListener('DOMContentLoaded', init);