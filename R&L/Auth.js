/* ═══════════════════════════════════════════
   LIFEFLOW — auth.js
   Login & Registration Logic
═══════════════════════════════════════════ */

// ─── TOAST ────────────────────────────────────────────────────────────────

function showToast(msg, type = 'default') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.background = type === 'success' ? '#16864a' : type === 'error' ? '#e11d48' : '#1a1a2e';
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ─── FIELD VALIDATION HELPERS ─────────────────────────────────────────────

function setError(inputId, errorId, msg) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errorId);
  if (input) input.classList.add('error');
  if (err)   err.textContent = msg;
}

function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errorId);
  if (input) { input.classList.remove('error'); input.classList.remove('valid'); }
  if (err)   err.textContent = '';
}

function setValid(inputId) {
  const input = document.getElementById(inputId);
  if (input) { input.classList.remove('error'); input.classList.add('valid'); }
}

function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidDob(v) {
  if (!v) return false;
  const dob = new Date(v);
  const age = (Date.now() - dob) / (1000 * 60 * 60 * 24 * 365.25);
  return age >= 18 && age <= 80;
}

// ─── PASSWORD TOGGLE ──────────────────────────────────────────────────────

function initPasswordToggle(btnId, inputId) {
  const btn   = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    btn.querySelector('.eye-open').style.display  = isHidden ? 'none' : '';
    btn.querySelector('.eye-closed').style.display = isHidden ? '' : 'none';
  });
}

// ─── PASSWORD STRENGTH ────────────────────────────────────────────────────

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8)                score++;
  if (pw.length >= 12)               score++;
  if (/[A-Z]/.test(pw))             score++;
  if (/[0-9]/.test(pw))             score++;
  if (/[^A-Za-z0-9]/.test(pw))      score++;
  return score;
}

function updateStrength(pw) {
  const fill  = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  if (!fill || !label) return;
  const score = getStrength(pw);
  const levels = [
    { w: '0%',   color: '',        text: '' },
    { w: '20%',  color: '#e11d48', text: 'Weak' },
    { w: '40%',  color: '#f97316', text: 'Fair' },
    { w: '60%',  color: '#eab308', text: 'Good' },
    { w: '80%',  color: '#22c55e', text: 'Strong' },
    { w: '100%', color: '#16864a', text: 'Excellent' },
  ];
  const lvl = levels[Math.min(score, 5)];
  fill.style.width      = pw.length === 0 ? '0%' : lvl.w;
  fill.style.background = lvl.color;
  label.textContent     = pw.length === 0 ? '' : lvl.text;
  label.style.color     = lvl.color;
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────

function initLogin() {
  initPasswordToggle('togglePw', 'loginPassword');

  // Live validation
  document.getElementById('loginEmail')?.addEventListener('input', function () {
    if (this.value && !isValidEmail(this.value)) {
      setError('loginEmail', 'emailError', 'Please enter a valid email address');
    } else {
      clearError('loginEmail', 'emailError');
      if (this.value) setValid('loginEmail');
    }
  });

  // Form submit
  document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const email = document.getElementById('loginEmail').value.trim();
    const pw    = document.getElementById('loginPassword').value;

    clearError('loginEmail',    'emailError');
    clearError('loginPassword', 'passwordError');

    if (!email) { setError('loginEmail', 'emailError', 'Email is required'); valid = false; }
    else if (!isValidEmail(email)) { setError('loginEmail', 'emailError', 'Enter a valid email'); valid = false; }
    if (!pw) { setError('loginPassword', 'passwordError', 'Password is required'); valid = false; }

    if (!valid) return;

    // Loading state
    const btn     = document.getElementById('loginBtn');
    const spinner = document.getElementById('loginSpinner');
    const text    = btn.querySelector('.submit-text');
    btn.disabled = true;
    spinner.classList.add('active');
    text.textContent = 'Signing in…';

    // Simulate auth (replace with real API call)
    await new Promise(r => setTimeout(r, 1600));

    // Demo: treat any input as success
    spinner.classList.remove('active');
    text.textContent = '✓ Success!';
    btn.style.background = '#16864a';
    showToast('Welcome back, Alex!', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 900);
  });

  // Google login
  document.getElementById('googleBtn')?.addEventListener('click', () => {
    showToast('Connecting to Google…');
  });

  // Forgot password
  document.getElementById('forgotLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    const modal = document.getElementById('forgotModal');
    if (modal) {
      const emailVal = document.getElementById('loginEmail')?.value;
      if (emailVal) {
        const resetInput = document.getElementById('resetEmail');
        if (resetInput) resetInput.value = emailVal;
      }
      modal.classList.add('open');
    }
  });

  // Close modal on backdrop
  document.getElementById('forgotModal')?.addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('open');
  });

  // Send reset link
  document.getElementById('sendResetBtn')?.addEventListener('click', async () => {
    const email = document.getElementById('resetEmail')?.value.trim();
    if (!email || !isValidEmail(email)) {
      showToast('Please enter a valid email', 'error');
      return;
    }
    const btn = document.getElementById('sendResetBtn');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    await new Promise(r => setTimeout(r, 1400));
    btn.textContent = '✓ Link Sent!';
    btn.style.background = '#16864a';
    showToast('Reset link sent — check your inbox', 'success');
    setTimeout(() => document.getElementById('forgotModal').classList.remove('open'), 1200);
  });
}

// ─── REGISTRATION STATE ───────────────────────────────────────────────────

const regData = {
  firstName: '', lastName: '', email: '', phone: '', dob: '',
  blood: '', weight: '', gender: '', donated: 'no', branch: '',
};

let currentStep = 1;

function goToStep(step) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(`step${step}`);
  if (el) el.classList.add('active');

  // Update progress bar
  const fill  = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  const totalSteps = 3;
  if (fill) fill.style.width = `${(step / totalSteps) * 100}%`;
  if (label) label.textContent = `Step ${step} of ${totalSteps}`;

  // Update left panel step indicators
  for (let i = 1; i <= totalSteps; i++) {
    const ind = document.getElementById(`step-indicator-${i}`);
    if (!ind) continue;
    ind.classList.remove('active', 'done');
    if (i === step)  ind.classList.add('active');
    if (i < step)    ind.classList.add('done');
    // Checkmark for done steps
    const dot = ind.querySelector('.step-dot');
    if (dot) dot.textContent = i < step ? '✓' : i;
  }

  currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── STEP 1 LOGIC ─────────────────────────────────────────────────────────

function validateStep1() {
  let valid = true;
  clearError('regFirstName', 'firstNameError');
  clearError('regLastName',  'lastNameError');
  clearError('regEmail',     'regEmailError');
  clearError('regDob',       'dobError');

  const first = document.getElementById('regFirstName')?.value.trim();
  const last  = document.getElementById('regLastName')?.value.trim();
  const email = document.getElementById('regEmail')?.value.trim();
  const dob   = document.getElementById('regDob')?.value;

  if (!first) { setError('regFirstName', 'firstNameError', 'First name is required'); valid = false; }
  else setValid('regFirstName');

  if (!last)  { setError('regLastName', 'lastNameError', 'Last name is required'); valid = false; }
  else setValid('regLastName');

  if (!email)                  { setError('regEmail', 'regEmailError', 'Email is required'); valid = false; }
  else if (!isValidEmail(email)){ setError('regEmail', 'regEmailError', 'Enter a valid email'); valid = false; }
  else setValid('regEmail');

  if (!dob) { setError('regDob', 'dobError', 'Date of birth is required'); valid = false; }
  else if (!isValidDob(dob)) { setError('regDob', 'dobError', 'You must be 18–80 years old to donate'); valid = false; }
  else setValid('regDob');

  if (valid) {
    regData.firstName = first;
    regData.lastName  = last;
    regData.email     = email;
    regData.phone     = document.getElementById('regPhone')?.value.trim() || '';
    regData.dob       = dob;
  }
  return valid;
}

// ─── STEP 2 LOGIC ─────────────────────────────────────────────────────────

function validateStep2() {
  let valid = true;
  const bloodErr = document.getElementById('bloodError');
  if (bloodErr) bloodErr.textContent = '';

  if (!regData.blood) {
    if (bloodErr) bloodErr.textContent = 'Please select your blood type';
    valid = false;
  }

  if (valid) {
    regData.weight = document.getElementById('regWeight')?.value || '';
    regData.gender = document.getElementById('regGender')?.value || '';
    regData.donated= document.querySelector('input[name="donated"]:checked')?.value || 'no';
    regData.branch = document.getElementById('regNearestBranch')?.value || '';
  }
  return valid;
}

// ─── REVIEW SUMMARY ───────────────────────────────────────────────────────

function renderReviewSummary() {
  const container = document.getElementById('reviewSummary');
  if (!container) return;
  container.innerHTML = [
    ['Name',       `${regData.firstName} ${regData.lastName}`],
    ['Email',      regData.email],
    ['Blood Type', regData.blood || '—'],
    ['Branch',     regData.branch || '—'],
  ].map(([k, v]) => `
    <div class="review-row">
      <span class="review-key">${k}</span>
      <span class="review-val">${v}</span>
    </div>`).join('');
}

// ─── STEP 3 LOGIC ─────────────────────────────────────────────────────────

function validateStep3() {
  let valid = true;
  clearError('regPassword', 'regPasswordError');
  const errSpan  = document.getElementById('confirmError');
  const termsErr = document.getElementById('termsError');
  if (errSpan)  errSpan.textContent  = '';
  if (termsErr) termsErr.textContent = '';

  const pw    = document.getElementById('regPassword')?.value;
  const conf  = document.getElementById('regConfirm')?.value;
  const terms = document.getElementById('agreeTerms')?.checked;

  if (!pw)          { setError('regPassword', 'regPasswordError', 'Password is required'); valid = false; }
  else if (pw.length < 6) { setError('regPassword', 'regPasswordError', 'Password must be at least 6 characters'); valid = false; }
  else setValid('regPassword');

  if (pw && conf !== pw) {
    if (errSpan) errSpan.textContent = 'Passwords do not match';
    const confInput = document.getElementById('regConfirm');
    if (confInput) confInput.classList.add('error');
    valid = false;
  } else if (conf) {
    const confInput = document.getElementById('regConfirm');
    if (confInput) { confInput.classList.remove('error'); confInput.classList.add('valid'); }
  }

  if (!terms) {
    if (termsErr) termsErr.textContent = 'You must agree to the terms to continue';
    valid = false;
  }

  return valid;
}

// ─── INIT REGISTRATION ────────────────────────────────────────────────────

function initRegister() {
  // Blood type picker
  document.getElementById('bloodTypePicker')?.addEventListener('click', e => {
    const btn = e.target.closest('.bt-option');
    if (!btn) return;
    document.querySelectorAll('.bt-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    regData.blood = btn.dataset.bt;
    const bloodErr = document.getElementById('bloodError');
    if (bloodErr) bloodErr.textContent = '';
  });

  // Password strength
  document.getElementById('regPassword')?.addEventListener('input', function () {
    updateStrength(this.value);
    // Clear confirm match error on re-type
    const errSpan = document.getElementById('confirmError');
    if (errSpan) errSpan.textContent = '';
    const confInput = document.getElementById('regConfirm');
    if (confInput) confInput.classList.remove('error');
  });

  // Live confirm match check
  document.getElementById('regConfirm')?.addEventListener('input', function () {
    const pw   = document.getElementById('regPassword')?.value;
    const errSpan = document.getElementById('confirmError');
    if (this.value && this.value !== pw) {
      this.classList.add('error');
      if (errSpan) errSpan.textContent = 'Passwords do not match';
    } else {
      this.classList.remove('error');
      if (this.value) this.classList.add('valid');
      if (errSpan) errSpan.textContent = '';
    }
  });

  // Password toggle
  initPasswordToggle('toggleRegPw', 'regPassword');

  // Step 1 → 2
  document.getElementById('nextStep1Btn')?.addEventListener('click', () => {
    if (validateStep1()) goToStep(2);
  });

  // Step 2 → 3
  document.getElementById('nextStep2Btn')?.addEventListener('click', () => {
    if (validateStep2()) {
      renderReviewSummary();
      goToStep(3);
    }
  });

  // Back 2 → 1
  document.getElementById('backStep2Btn')?.addEventListener('click', () => goToStep(1));

  // Back 3 → 2
  document.getElementById('backStep3Btn')?.addEventListener('click', () => goToStep(2));

  // Step 3 submit
  document.getElementById('step3Form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    const btn     = document.getElementById('createAccountBtn');
    const spinner = document.getElementById('regSpinner');
    const text    = btn.querySelector('.submit-text');
    btn.disabled = true;
    spinner.classList.add('active');
    text.textContent = 'Creating account…';

    // Simulate API (replace with real call)
    await new Promise(r => setTimeout(r, 1800));

    spinner.classList.remove('active');

    // Show success step
    const progressWrap = document.querySelector('.progress-bar-wrap');
    if (progressWrap) {
      progressWrap.querySelector('.progress-bar-fill').style.width = '100%';
      progressWrap.querySelector('.progress-label').textContent = 'Complete!';
    }

    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById('stepSuccess').classList.add('active');
    document.getElementById('successName').textContent = regData.firstName;

    // Mark all steps done
    for (let i = 1; i <= 3; i++) {
      const ind = document.getElementById(`step-indicator-${i}`);
      if (ind) {
        ind.classList.remove('active');
        ind.classList.add('done');
        const dot = ind.querySelector('.step-dot');
        if (dot) dot.textContent = '✓';
      }
    }

    showToast(`Welcome, ${regData.firstName}! Account created ✓`, 'success');
  });

  // Live email validation
  document.getElementById('regEmail')?.addEventListener('input', function () {
    if (this.value && !isValidEmail(this.value)) {
      setError('regEmail', 'regEmailError', 'Enter a valid email');
    } else {
      clearError('regEmail', 'regEmailError');
      if (this.value) setValid('regEmail');
    }
  });
}

// ─── INIT ─────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Detect which page we're on
  if (document.getElementById('loginForm')) initLogin();
  if (document.getElementById('step1'))     initRegister();
});