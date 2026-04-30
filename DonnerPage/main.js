/* ═══════════════════════════════════════════
   LIFEFLOW DONOR DASHBOARD — main.js
   All buttons functional, full nav, PDF export
═══════════════════════════════════════════ */

// ─── STATE ────────────────────────────────────────────────────────────────

const donations = [
  { id: 'DON-9941', branch: 'Alex Central', status: 'Under Testing', blood: 'O+', vol: '450 mL', date: '4/21/2026' },
  { id: 'DON-9940', branch: 'Alex Central', status: 'Approved',      blood: 'O+', vol: '450 mL', date: '12/10/2023' },
  { id: 'DON-9939', branch: 'Sidi Gaber',   status: 'Approved',      blood: 'O+', vol: '450 mL', date: '06/05/2023' },
];

const donorAlerts = [
  { type: 'critical', icon: '⚠️', title: 'Blood Shortage: O−', desc: 'Your blood type O+ is in high demand nationwide. Your donation is urgently needed.', time: '1 hour ago' },
  { type: 'success',  icon: '✅', title: 'Donation Approved',   desc: 'Your donation DON-9939 has been approved and dispatched to trauma units.', time: '3 days ago' },
  { type: 'warning',  icon: '⏰', title: 'Reminder: Next Donation', desc: 'You are eligible to donate again on May 12, 2024. Book your appointment early.', time: '1 week ago' },
];

// ─── TOAST ────────────────────────────────────────────────────────────────

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── MODAL ────────────────────────────────────────────────────────────────

function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

// ─── NAVIGATION ───────────────────────────────────────────────────────────

const pageTitles = {
  dashboard: 'Donor Dashboard',
  history:   'Donation History',
  alerts:    'My Alerts',
  profile:   'My Profile',
  records:   'Medical Records',
  settings:  'Settings',
  help:      'Help Center',
};

function navigateTo(page) {
  // Update nav
  document.querySelectorAll('.nav-item[data-page]').forEach(n => n.classList.remove('active'));
  const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  // Update pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');

  // Update title
  const titleEl = document.getElementById('pageTitle');
  if (titleEl) titleEl.textContent = pageTitles[page] || 'Donor Dashboard';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initNav() {
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(item.dataset.page);
    });
  });

  // "View All" links in dashboard table → history page
  document.querySelectorAll('.view-all[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });

  // Logout
  document.querySelector('.nav-item.logout')?.addEventListener('click', e => {
    e.preventDefault();
    if (confirm('Are you sure you want to log out?')) showToast('Logged out successfully');
  });

  // Notification bell → alerts
  document.getElementById('notifBtn')?.addEventListener('click', () => navigateTo('alerts'));

  // Help icon in topbar → help page
  document.getElementById('helpTopBtn')?.addEventListener('click', () => navigateTo('help'));
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────

function applyTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : '';
  localStorage.setItem('lifeflow-donor-theme', dark ? 'dark' : '');
  const dm = document.getElementById('settingsDarkMode');
  if (dm) dm.checked = dark;
}

function initTheme() {
  const saved = localStorage.getItem('lifeflow-donor-theme');
  applyTheme(saved === 'dark');
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme !== 'dark');
  });
  document.getElementById('settingsDarkMode')?.addEventListener('change', function () {
    applyTheme(this.checked);
  });
}

// ─── HERO BANNER DISMISS ──────────────────────────────────────────────────

function initHeroBanner() {
  const banner = document.getElementById('heroBanner');
  const closeBtn = document.getElementById('closeBanner');
  if (!closeBtn || !banner) return;
  closeBtn.addEventListener('click', () => {
    banner.style.transition = 'opacity 0.3s, max-height 0.4s, margin 0.4s, padding 0.4s';
    banner.style.opacity = '0';
    banner.style.maxHeight = '0';
    banner.style.marginBottom = '0';
    banner.style.padding = '0';
    banner.style.overflow = 'hidden';
    setTimeout(() => banner.classList.add('hidden'), 400);
  });
}

// ─── STAT CARD ENTRANCE ───────────────────────────────────────────────────

function initStatCards() {
  const cards = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const i = Array.from(cards).indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(c => observer.observe(c));

  // Level bar animation
  document.querySelectorAll('.level-bar-fill').forEach(bar => {
    const target = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = target; }, 600);
  });

  // Countdown
  const nextDonation = new Date('2024-05-12');
  const diff = Math.max(0, Math.ceil((nextDonation - new Date()) / (1000 * 60 * 60 * 24)));
  const countEl = document.getElementById('countdownVal');
  if (countEl && diff > 0) countEl.innerHTML = `${diff} <span class="days-label">days</span>`;
}

// ─── REMIND ME ────────────────────────────────────────────────────────────

function initRemindBtn() {
  const remindBtn = document.getElementById('remindBtn');
  const confirmBtn = document.getElementById('confirmRemind');
  const cancelBtn  = document.getElementById('cancelRemind');

  remindBtn?.addEventListener('click', () => openModal('modalRemind'));
  cancelBtn?.addEventListener('click', () => closeModal('modalRemind'));

  confirmBtn?.addEventListener('click', () => {
    confirmBtn.textContent = 'Reminder Set ✓';
    confirmBtn.style.background = '#16864a';
    confirmBtn.disabled = true;
    setTimeout(() => closeModal('modalRemind'), 900);
    if (remindBtn) {
      remindBtn.textContent = '✓ Reminder Set';
      remindBtn.style.background = '#f0fdf4';
      remindBtn.style.color = '#16864a';
      remindBtn.style.borderColor = '#86efac';
      remindBtn.disabled = true;
    }
    showToast('Donation reminder set for May 12, 2024');
  });
}

// ─── DONATION TABLE (dashboard + history) ────────────────────────────────

function badgeHtml(status) {
  const map = {
    'Under Testing': 'badge-testing',
    'Approved':      'badge-approved',
    'Rejected':      'badge-rejected',
    'Expired':       'badge-expired',
    'Reserved':      'badge-reserved',
    'Fulfilled':     'badge-fulfilled',
  };
  return `<span class="badge ${map[status] || 'badge-expired'}">${status}</span>`;
}

let currentDonationId = null;

function viewDonation(id) {
  const d = donations.find(x => x.id === id);
  if (!d) return;
  currentDonationId = id;
  document.getElementById('donationModalTitle').textContent = `Donation — ${d.id}`;
  document.getElementById('donationModalBody').innerHTML = [
    ['Donation ID', d.id],
    ['Branch',      d.branch],
    ['Blood Type',  d.blood],
    ['Volume',      d.vol],
    ['Status',      badgeHtml(d.status)],
    ['Date',        d.date],
  ].map(([k, v]) => `
    <div class="view-row">
      <span class="view-key">${k}</span>
      <span class="view-val">${v}</span>
    </div>`).join('');
  openModal('modalDonation');
}

function renderDonationTable(containerId, data) {
  const tbody = document.getElementById(containerId);
  if (!tbody) return;
  tbody.innerHTML = data.map(d => `
    <tr>
      <td class="donation-id">${d.id}</td>
      <td class="muted">${d.branch}</td>
      <td>${badgeHtml(d.status)}</td>
      <td>${d.blood}</td>
      <td class="muted">${d.vol}</td>
      <td class="muted">${d.date}</td>
      <td><button class="action-btn" onclick="viewDonation('${d.id}')">···</button></td>
    </tr>`).join('');
}

function initHistoryPage() {
  renderDonationTable('donationTableBody', donations);
  renderHistoryTable();

  document.getElementById('historyStatusFilter')?.addEventListener('change', renderHistoryTable);
  document.getElementById('historyYearFilter')?.addEventListener('change', renderHistoryTable);

  document.getElementById('exportHistoryBtn')?.addEventListener('click', exportHistoryPDF);
  document.getElementById('exportSinglePdfBtn')?.addEventListener('click', () => {
    if (currentDonationId) exportSinglePDF(currentDonationId);
  });
}

function renderHistoryTable() {
  const statusFilter = document.getElementById('historyStatusFilter')?.value || '';
  const yearFilter   = document.getElementById('historyYearFilter')?.value || '';

  const filtered = donations.filter(d => {
    const matchStatus = !statusFilter || d.status === statusFilter;
    const matchYear   = !yearFilter || d.date.includes(yearFilter);
    return matchStatus && matchYear;
  });

  const countBadge = document.getElementById('historyCount');
  if (countBadge) countBadge.textContent = `${filtered.length} record${filtered.length !== 1 ? 's' : ''}`;

  renderDonationTable('historyTableBody', filtered);
}

// ─── ALERTS ───────────────────────────────────────────────────────────────

function renderAlerts() {
  const list = document.getElementById('donorAlertsList');
  if (!list) return;

  const navBadge = document.querySelector('.nav-badge');
  const notifDot = document.getElementById('notifDot');
  const active = donorAlerts.filter(a => !a.dismissed);

  if (navBadge) navBadge.textContent = active.length;
  if (notifDot) notifDot.className = active.length > 0 ? 'notif-badge' : 'notif-badge hidden';

  if (active.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:24px 0;">No active alerts.</p>';
    return;
  }

  list.innerHTML = active.map((a, i) => `
    <div class="donor-alert-item ${a.type}">
      <span class="alert-icon-sm">${a.icon}</span>
      <div class="alert-content-p">
        <div class="alert-title-p">${a.title}</div>
        <div class="alert-desc-p">${a.desc}</div>
        <div class="alert-time-p">⏱ ${a.time}</div>
      </div>
      <button class="alert-dismiss-btn" onclick="dismissAlert(${i})" title="Dismiss">×</button>
    </div>`).join('');
}

function dismissAlert(i) {
  if (donorAlerts[i]) {
    donorAlerts[i].dismissed = true;
    renderAlerts();
    showToast('Alert dismissed');
  }
}

function initAlerts() {
  renderAlerts();
  document.getElementById('markAllReadBtn')?.addEventListener('click', e => {
    e.preventDefault();
    donorAlerts.forEach(a => a.dismissed = true);
    renderAlerts();
    showToast('All alerts marked as read');
  });
}

// ─── PROFILE ──────────────────────────────────────────────────────────────

function initProfile() {
  document.getElementById('saveProfileBtn')?.addEventListener('click', () => {
    const first = document.getElementById('pfFirstName')?.value.trim();
    const last  = document.getElementById('pfLastName')?.value.trim();
    if (!first || !last) { showToast('Please fill in your name'); return; }
    document.querySelector('.user-name').textContent = `${first} ${last}`;
    document.querySelector('.profile-name').textContent = `${first} ${last}`;
    showToast('Profile saved successfully');
  });
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────

function initSettings() {
  document.getElementById('savePasswordBtn')?.addEventListener('click', () => {
    const cur = document.getElementById('pwCurrent')?.value;
    const nw  = document.getElementById('pwNew')?.value;
    const cnf = document.getElementById('pwConfirm')?.value;
    if (!cur || !nw || !cnf) { showToast('Please fill in all password fields'); return; }
    if (nw !== cnf) { showToast('New passwords do not match'); return; }
    if (nw.length < 6) { showToast('Password must be at least 6 characters'); return; }
    document.querySelectorAll('#page-settings input[type="password"]').forEach(i => i.value = '');
    showToast('Password updated successfully');
  });

  document.getElementById('settingsEmail')?.addEventListener('change', function () {
    showToast(`Email notifications ${this.checked ? 'enabled' : 'disabled'}`);
  });
  document.getElementById('settingsReminders')?.addEventListener('change', function () {
    showToast(`Donation reminders ${this.checked ? 'enabled' : 'disabled'}`);
  });
  document.getElementById('settingsAlerts')?.addEventListener('change', function () {
    showToast(`Blood shortage alerts ${this.checked ? 'enabled' : 'disabled'}`);
  });
}

// ─── HELP PAGE ────────────────────────────────────────────────────────────

function initHelp() {
  document.getElementById('helpNurseBtn')?.addEventListener('click', () => showToast('Connecting to 24/7 nurse line…'));
  document.getElementById('helpBookBtn')?.addEventListener('click', () => openModal('modalBook'));
  document.getElementById('helpChatBtn')?.addEventListener('click', () => showToast('Starting live chat support…'));
  document.getElementById('helpFaqBtn')?.addEventListener('click', () => showToast('Opening FAQ library…'));
  document.getElementById('helpBranchBtn')?.addEventListener('click', () => showToast('Finding nearest branches…'));
  document.getElementById('helpEmailBtn')?.addEventListener('click', () => showToast('Opening email composer…'));
  document.querySelector('.nurse-btn')?.addEventListener('click', () => showToast('Connecting to 24/7 nurse line…'));
}

// ─── SHARE BUTTONS ────────────────────────────────────────────────────────

function initShare() {
  document.querySelector('.share-btn.referral')?.addEventListener('click', function () {
    const orig = this.innerHTML;
    this.textContent = 'Link Copied! ✓';
    this.style.color = '#16864a';
    this.style.borderColor = '#86efac';
    setTimeout(() => {
      this.innerHTML = orig;
      this.style.color = '';
      this.style.borderColor = '';
    }, 2000);
    showToast('Referral link copied to clipboard');
  });

  document.querySelector('.share-btn.facebook')?.addEventListener('click', () => showToast('Opening Facebook…'));
  document.querySelector('.share-btn.twitter')?.addEventListener('click', () => showToast('Opening X (Twitter)…'));
  document.querySelector('.share-btn.instagram')?.addEventListener('click', () => showToast('Opening Instagram…'));
}

// ─── BOOK APPOINTMENT ─────────────────────────────────────────────────────

function initBooking() {
  // Set min date to today
  const bookDate = document.getElementById('bookDate');
  if (bookDate) {
    const today = new Date().toISOString().split('T')[0];
    bookDate.min = today;
    bookDate.value = today;
  }

  document.getElementById('confirmBookBtn')?.addEventListener('click', () => {
    const branch = document.getElementById('bookBranch')?.value;
    const date   = document.getElementById('bookDate')?.value;
    const time   = document.getElementById('bookTime')?.value;
    if (!branch || !date) { showToast('Please fill in all booking fields'); return; }
    closeModal('modalBook');
    showToast(`Appointment booked at ${branch} on ${date} at ${time}`);
  });
}

// ─── PDF EXPORT ───────────────────────────────────────────────────────────

function loadjsPDF(callback) {
  if (window.jspdf) { callback(); return; }
  const s1 = document.createElement('script');
  s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  s1.onload = () => {
    const s2 = document.createElement('script');
    s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js';
    s2.onload = callback;
    document.head.appendChild(s2);
  };
  document.head.appendChild(s1);
}

function exportHistoryPDF() {
  showToast('Generating history PDF…');
  loadjsPDF(() => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(155, 29, 66);
    doc.text('LifeFlow — My Donation History', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 120);
    doc.text(`Donor: Alex Johnson  ·  Blood Type: O+  ·  Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.autoTable({
      startY: 36,
      head: [['Donation ID', 'Branch', 'Blood', 'Volume', 'Status', 'Date']],
      body: donations.map(d => [d.id, d.branch, d.blood, d.vol, d.status, d.date]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [155, 29, 66] },
    });
    doc.save('My-Donation-History.pdf');
    showToast('My-Donation-History.pdf downloaded');
  });
}

function exportSinglePDF(id) {
  const d = donations.find(x => x.id === id);
  if (!d) return;
  showToast('Generating PDF…');
  loadjsPDF(() => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(155, 29, 66);
    doc.text('LifeFlow — Donation Record', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 120);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.autoTable({
      startY: 36,
      head: [['Field', 'Value']],
      body: [
        ['Donation ID', d.id],
        ['Branch',      d.branch],
        ['Blood Type',  d.blood],
        ['Volume',      d.vol],
        ['Status',      d.status],
        ['Date',        d.date],
      ],
      styles: { fontSize: 11 },
      headStyles: { fillColor: [155, 29, 66] },
    });
    doc.save(`${d.id}.pdf`);
    showToast(`${d.id}.pdf downloaded`);
    closeModal('modalDonation');
  });
}

function initMedicalRecords() {
  document.getElementById('exportRecordsBtn')?.addEventListener('click', () => {
    showToast('Generating medical records PDF…');
    loadjsPDF(() => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.setTextColor(155, 29, 66);
      doc.text('LifeFlow — Medical Records', 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 120);
      doc.text(`Donor: Alex Johnson  ·  Blood: O+  ·  Generated: ${new Date().toLocaleString()}`, 14, 28);
      doc.autoTable({
        startY: 36,
        head: [['Field', 'Value']],
        body: [
          ['Blood Type',       'O+ (Universal Donor)'],
          ['Weight',           '72 kg — Eligible'],
          ['Hemoglobin',       '14.2 g/dL — Normal'],
          ['Last Screening',   'Apr 21, 2026 — Passed'],
          ['Disease Screening','All Clear — No flags'],
          ['Next Eligible',    'May 12, 2024'],
        ],
        styles: { fontSize: 11 },
        headStyles: { fillColor: [155, 29, 66] },
      });
      doc.save('Medical-Records.pdf');
      showToast('Medical-Records.pdf downloaded');
    });
  });
}

// ─── KEYBOARD SHORTCUTS ───────────────────────────────────────────────────

document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    navigateTo('dashboard');
  }
});

// ─── INIT ─────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initHeroBanner();
  initStatCards();
  initRemindBtn();
  initHistoryPage();
  initAlerts();
  initProfile();
  initSettings();
  initHelp();
  initShare();
  initBooking();
  initMedicalRecords();
});