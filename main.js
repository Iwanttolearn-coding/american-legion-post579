/* ============================================================
   AMERICAN LEGION POST 579 — main.js
   Production · Built by TM Designs™
   ============================================================ */

const BACKEND = 'https://terrellos-backend.fly.dev';
const POST_PHONE = '(210) 674-8069';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile Nav ── */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      nav.classList.toggle('open');
    });
    // Close on link click (mobile)
    nav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        nav.classList.remove('open');
      })
    );
  }

  /* ── Active nav highlight ── */
  const path = window.location.pathname;
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) return;
    if (path.includes(href.replace('../','')) && href.length > 1) {
      a.classList.add('active');
    }
  });

  /* ── Wire all forms ── */
  wireForm('membership-interest-form', '/v1/legion/membership/apply',
    '✅ Membership request received! Our Adjutant will contact you within 3–5 business days. Welcome, future member!');

  wireForm('hall-rental-form', '/v1/legion/hall-rental',
    '✅ Rental inquiry submitted! A Post officer will contact you within 48 hours to confirm availability and pricing.');

  wireForm('contact-form', '/v1/legion/contact',
    '✅ Message received! Post 579 will respond within 2–3 business days. For urgent matters, call ' + POST_PHONE);

  wireForm('veteran-assist-form', '/v1/legion/contact',
    '✅ Assistance request received. A Post Service Officer will contact you shortly. For urgent help, call ' + POST_PHONE + ' or dial 988.');

  wireForm('donate-form', '/v1/legion/donate',
    '✅ Thank you for your generous support of Post 579 veterans programs!');

  /* ── Smooth scroll for hash links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Back to top ── */
  const topBtn = document.createElement('button');
  topBtn.innerHTML = '▲';
  topBtn.title = 'Back to top';
  topBtn.style.cssText = [
    'position:fixed;bottom:24px;right:24px',
    'background:#071d41;color:#f5c542',
    'border:2px solid #f5c542;border-radius:50%',
    'width:44px;height:44px;font-size:.9rem',
    'cursor:pointer;display:none;z-index:500',
    'box-shadow:0 4px 16px rgba(0,0,0,.3)',
    'transition:opacity .2s'
  ].join(';');
  topBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(topBtn);
  window.addEventListener('scroll', () => {
    topBtn.style.display = window.scrollY > 400 ? 'block' : 'none';
  });

});

/* ── Form handler ── */
function wireForm(formId, endpoint, successMsg) {
  const form = document.getElementById(formId);
  if (!form) return;

  // Create message div
  const msgDiv = document.createElement('div');
  msgDiv.className = 'form-msg';
  form.insertBefore(msgDiv, form.firstChild);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const orig = btn ? btn.textContent : '';
    if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

    const data = {};
    new FormData(form).forEach((v, k) => { data[k] = v; });

    // Add metadata
    data.source_page = window.location.pathname;
    data.submitted_at = new Date().toISOString();

    try {
      const res = await fetch(`${BACKEND}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        msgDiv.className = 'form-msg success';
        msgDiv.textContent = successMsg || json.message || 'Submitted successfully!';
        form.reset();
      } else {
        msgDiv.className = 'form-msg error';
        msgDiv.textContent = json.detail || json.message || 'Something went wrong. Please try again or call us at ' + POST_PHONE;
      }
    } catch {
      msgDiv.className = 'form-msg error';
      msgDiv.textContent = 'Connection error. Please call us directly at ' + POST_PHONE;
    } finally {
      if (btn) { btn.textContent = orig; btn.disabled = false; }
      msgDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

/* ── Lightbox (for gallery) ── */
window.openLightbox = (src, caption) => {
  let lb = document.getElementById('lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px';
    lb.innerHTML = `
      <button onclick="closeLightbox()" style="position:absolute;top:20px;right:28px;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;opacity:.7">✕</button>
      <img id="lb-img" style="max-width:90vw;max-height:82vh;object-fit:contain;border-radius:4px">
      <p id="lb-cap" style="color:#ccc;font-size:.88rem;text-align:center;max-width:600px"></p>`;
    document.body.appendChild(lb);
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  }
  lb.querySelector('#lb-img').src = src;
  lb.querySelector('#lb-cap').textContent = caption || '';
  lb.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = () => {
  const lb = document.getElementById('lightbox');
  if (lb) lb.style.display = 'none';
  document.body.style.overflow = '';
};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
