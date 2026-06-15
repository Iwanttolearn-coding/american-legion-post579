/* ============================================================
   POST 579 — MAIN JAVASCRIPT
   ============================================================ */
const POST579 = {
  backend: 'https://terrellos-backend.fly.dev',
  post: 'American Legion Bicentennial Post 579',
  address: '3002 Gunsmoke St, San Antonio TX 78227',
  phone: '(210) 674-8069',
  email: 'commander@post579sa.org',
  crisis: '988 — Press 1',
};

/* ── Mobile nav ── */
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      nav.classList.toggle('open');
    });
  }

  // Mark active nav link
  const path = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '').replace(/\/index\.html$/, '');
    if (href && path.endsWith(href)) a.classList.add('active');
  });
});

/* ── Generic form submit ── */
async function submitForm(formId, endpoint, successMsg) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const origText = btn ? btn.textContent : '';
    if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

    const data = {};
    new FormData(form).forEach((v, k) => { data[k] = v; });

    try {
      const res = await fetch(`${POST579.backend}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) {
        showAlert(formId, successMsg || json.message || 'Submitted successfully!', 'success');
        form.reset();
      } else {
        showAlert(formId, json.detail || json.message || 'Something went wrong. Please try again.', 'error');
      }
    } catch {
      showAlert(formId, 'Connection error. Please call us at ' + POST579.phone, 'error');
    } finally {
      if (btn) { btn.textContent = origText; btn.disabled = false; }
    }
  });
}

function showAlert(containerId, msg, type = 'info') {
  const container = document.getElementById(containerId);
  if (!container) return;
  const existing = container.querySelector('.form-alert');
  if (existing) existing.remove();
  const div = document.createElement('div');
  div.className = `alert alert-${type} form-alert`;
  div.innerHTML = msg;
  container.insertBefore(div, container.firstChild);
  div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── Lightbox ── */
window.openLightbox = (src, caption = '') => {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.querySelector('img').src = src;
  const cap = lb.querySelector('.lb-caption');
  if (cap) cap.textContent = caption;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
};
window.closeLightbox = () => {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('active');
  document.body.style.overflow = '';
};
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ── Load events from backend ── */
async function loadEvents(containerId, limit = 6) {
  const el = document.getElementById(containerId);
  if (!el) return;
  try {
    const res = await fetch(`${POST579.backend}/v1/legion/events`);
    const data = await res.json();
    const events = (data.events || []).slice(0, limit);
    if (!events.length) { el.innerHTML = '<p style="color:#888">No upcoming events. Check back soon.</p>'; return; }
    el.innerHTML = events.map(ev => `
      <div class="card">
        <div class="card-body">
          <span class="badge badge-red">${ev.event_type || 'Event'}</span>
          <h3 style="margin-top:10px">${ev.name}</h3>
          <p style="color:#888;font-size:.82rem;margin:4px 0 8px">📍 ${ev.location || POST579.address}</p>
          <p>${ev.description || ''}</p>
          ${ev.ticket_price ? `<p style="font-weight:bold;color:var(--navy);margin-top:8px">$${ev.ticket_price} per person</p>` : ''}
          <a href="tickets/" class="btn btn-primary btn-sm" style="margin-top:12px">Get Tickets</a>
        </div>
      </div>
    `).join('');
  } catch {
    el.innerHTML = '<p style="color:#888">Unable to load events. Please call (210) 674-8069.</p>';
  }
}
