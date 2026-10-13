/* ═══════════════════════════════════════════════════════════════
   NutriBot AI — IBM Granite  |  Frontend Logic (app.js)
   ═══════════════════════════════════════════════════════════════ */

"use strict";

// ── State ──────────────────────────────────────────────────────────────
let currentPlanFilename = null;
let currentUserContext = {};
let loadingTimer = null;

// ── Tab Navigation ──────────────────────────────────────────────────────
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  const idx = ['plan-tab', 'chat-tab', 'about-tab'].indexOf(tabId);
  document.querySelectorAll('.nav-btn')[idx].classList.add('active');
}

// ── Medical History Checkboxes ──────────────────────────────────────────
function updateMedical() {
  const boxes = document.querySelectorAll('.medical-options input[type="checkbox"]');
  const noneBox = document.getElementById('none-check');
  const hiddenField = document.getElementById('medical_history');

  // If "None" checked, uncheck all others
  if (event && event.target === noneBox && noneBox.checked) {
    boxes.forEach(b => { if (b !== noneBox) b.checked = false; });
  } else if (event && event.target !== noneBox) {
    noneBox.checked = false;
  }

  const selected = Array.from(boxes)
    .filter(b => b.checked && b.value !== 'None')
    .map(b => b.value);

  const other = document.getElementById('other_medical').value.trim();
  const allConditions = [...selected, ...(other ? [other] : [])];
  hiddenField.value = allConditions.length ? allConditions.join(', ') : 'None';
}

// ── Loading Steps Animation ─────────────────────────────────────────────
function startLoadingAnimation() {
  const steps = ['ls-1', 'ls-2', 'ls-3', 'ls-4', 'ls-5'];
  let current = 0;

  steps.forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('active', 'done'); }
  });

  const el0 = document.getElementById(steps[0]);
  if (el0) el0.classList.add('active');

  loadingTimer = setInterval(() => {
    const prev = document.getElementById(steps[current]);
    if (prev) { prev.classList.remove('active'); prev.classList.add('done'); }
    current++;
    if (current >= steps.length) {
      clearInterval(loadingTimer);
      return;
    }
    const curr = document.getElementById(steps[current]);
    if (curr) curr.classList.add('active');
  }, 900);
}

function stopLoadingAnimation() {
  if (loadingTimer) { clearInterval(loadingTimer); loadingTimer = null; }
}

// ── Generate Nutrition Plan ─────────────────────────────────────────────
async function generatePlan(event) {
  event.preventDefault();

  // Collect form data
  const name = document.getElementById('name').value.trim();
  const age = document.getElementById('age').value.trim();
  const diet = document.querySelector('input[name="diet"]:checked')?.value || 'Vegetarian';
  const city = document.getElementById('city').value.trim();
  const country = document.getElementById('country').value.trim();
  const goal = document.getElementById('goal').value;
  const activity = document.getElementById('activity').value;

  // Update medical from other field too
  const other = document.getElementById('other_medical').value.trim();
  const selectedBoxes = Array.from(document.querySelectorAll('.medical-options input[type="checkbox"]'))
    .filter(b => b.checked && b.value !== 'None').map(b => b.value);
  const medicalHistory = [...selectedBoxes, ...(other ? [other] : [])].join(', ') || 'None';

  const payload = { name, age, diet, city, country, medical_history: medicalHistory, goal, activity };
  currentUserContext = payload;

  // UI: show loading
  document.getElementById('result-placeholder').style.display = 'none';
  document.getElementById('result-content').style.display = 'none';
  document.getElementById('loading-spinner').style.display = 'block';
  document.getElementById('generate-btn').disabled = true;
  document.getElementById('generate-btn').innerHTML = '<i class="fa fa-spinner fa-spin"></i> Generating...';

  startLoadingAnimation();

  try {
    const response = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    stopLoadingAnimation();

    if (!response.ok || data.error) {
      showError(data.error || 'Something went wrong. Please try again.');
      return;
    }

    // Render result
    currentPlanFilename = data.filename;
    document.getElementById('loading-spinner').style.display = 'none';
    document.getElementById('result-content').style.display = 'block';
    document.getElementById('plan-output').innerHTML = marked.parse(data.plan || '');
    document.getElementById('model-badge').innerHTML =
      `<i class="fa fa-microchip"></i> Generated by ${data.model} ${data.model === 'demo-mode' ? '(Demo Mode — Add Watsonx API key for full AI)' : '(IBM Granite)'}`;

    showToast('✅ Nutrition plan generated successfully!', 'success');

  } catch (err) {
    stopLoadingAnimation();
    showError('Network error: ' + err.message);
  } finally {
    document.getElementById('generate-btn').disabled = false;
    document.getElementById('generate-btn').innerHTML = '<i class="fa fa-magic"></i> Generate My Nutrition Plan';
  }
}

function showError(msg) {
  document.getElementById('loading-spinner').style.display = 'none';
  document.getElementById('result-placeholder').style.display = 'block';
  document.getElementById('result-placeholder').innerHTML = `
    <div class="placeholder-icon">⚠️</div>
    <h3>Something went wrong</h3>
    <p style="color:#dc2626">${msg}</p>
    <button class="btn-primary" onclick="location.reload()" style="margin-top:16px; display:inline-flex; width:auto">Try Again</button>
  `;
  showToast('❌ ' + msg, 'error');
}

// ── Download Plan ────────────────────────────────────────────────────────
function downloadPlan() {
  if (!currentPlanFilename) { showToast('No plan to download yet.', ''); return; }
  window.open(`/api/download/${currentPlanFilename}`, '_blank');
  showToast('📥 Downloading your plan...', 'success');
}

// ── Copy Plan ──────────────────────────────────────────────────────────
function copyPlan() {
  const content = document.getElementById('plan-output')?.innerText;
  if (!content) return;
  navigator.clipboard.writeText(content).then(() => {
    showToast('📋 Plan copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Copy failed — try selecting text manually.', 'error');
  });
}

// ── Print Plan ─────────────────────────────────────────────────────────
function printPlan() {
  const content = document.getElementById('plan-output')?.innerHTML;
  if (!content) return;
  const win = window.open('', '_blank');
  win.document.write(`
    <html><head><title>Nutrition Plan</title>
    <style>
      body { font-family: -apple-system, sans-serif; max-width: 800px; margin: 40px auto; line-height:1.7; color:#1a202c; }
      h1,h2,h3 { color: #0f62fe; } table { border-collapse:collapse; width:100%; } th,td { border:1px solid #e2e8f0; padding:6px 10px; }
      th { background:#eef3ff; } @media print { body { margin:20px; } }
    </style></head>
    <body>${content}</body></html>
  `);
  win.document.close();
  win.print();
}

// ── Chat ─────────────────────────────────────────────────────────────────
function handleChatKey(event) {
  if (event.key === 'Enter') sendMessage();
}

function askQuick(question) {
  document.getElementById('chat-input').value = question;
  sendMessage();
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const question = input.value.trim();
  if (!question) return;

  input.value = '';
  const sendBtn = document.getElementById('send-btn');
  sendBtn.disabled = true;

  // Add user bubble
  appendMessage('user', question);

  // Add typing indicator
  const typingId = 'typing-' + Date.now();
  appendTyping(typingId);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, user_context: currentUserContext })
    });

    const data = await response.json();
    removeTyping(typingId);

    const answer = data.answer || data.error || 'Sorry, I could not process that request.';
    appendMessage('bot', answer);

  } catch (err) {
    removeTyping(typingId);
    appendMessage('bot', '⚠️ Network error. Please check your connection and try again.');
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
}

function appendMessage(role, text) {
  const chatWindow = document.getElementById('chat-window');
  const div = document.createElement('div');
  div.classList.add('chat-message', role === 'bot' ? 'bot-msg' : 'user-msg');

  const avatar = document.createElement('div');
  avatar.classList.add('msg-avatar', role === 'bot' ? 'bot-avatar' : 'user-avatar');
  avatar.innerHTML = role === 'bot' ? '<i class="fa fa-robot"></i>' : '<i class="fa fa-user"></i>';

  const bubble = document.createElement('div');
  bubble.classList.add('msg-bubble');
  // Parse markdown for bot messages
  bubble.innerHTML = role === 'bot' ? marked.parse(text) : escapeHtml(text);

  div.appendChild(avatar);
  div.appendChild(bubble);
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function appendTyping(id) {
  const chatWindow = document.getElementById('chat-window');
  const div = document.createElement('div');
  div.classList.add('chat-message', 'bot-msg');
  div.id = id;
  div.innerHTML = `
    <div class="msg-avatar bot-avatar"><i class="fa fa-robot"></i></div>
    <div class="msg-bubble"><div class="typing-bubble"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>
  `;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function escapeHtml(text) {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Toast Notification ───────────────────────────────────────────────────
function showToast(msg, type = '') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── Health Check on load ─────────────────────────────────────────────────
async function checkHealth() {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    if (data.mode === 'demo') {
      showToast('ℹ️ Running in Demo Mode. Set WATSONX_API_KEY for IBM Granite.', '');
    }
  } catch {/* server not ready yet */}
}

// ── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  checkHealth();

  // Configure marked options
  if (typeof marked !== 'undefined') {
    marked.setOptions({ breaks: true, gfm: true });
  }
});
