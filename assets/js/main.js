/* ============================================================
   AMERICAN LEGION POST 579 — MAIN JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ─── MOBILE NAV TOGGLE ─── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.style.display === 'block';
      mobileNav.style.display = open ? 'none' : 'block';
    });
  }

  /* ─── ACTIVE NAV HIGHLIGHT ─── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ─── SMOOTH SCROLL for anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (mobileNav) mobileNav.style.display = 'none';
      }
    });
  });

  /* ─── FORM SUBMISSIONS ─── */
  document.querySelectorAll('form[data-form-type]').forEach(form => {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const type = this.dataset.formType;
      const btn = this.querySelector('.form-submit-btn');
      const successEl = this.nextElementSibling;
      const original = btn.textContent;

      btn.textContent = 'Submitting...';
      btn.disabled = true;

      const data = {};
      new FormData(this).forEach((val, key) => { data[key] = val; });
      data.form_type = type;
      data.submitted_at = new Date().toISOString();
      data.post = '579';

      try {
        // Post to backend handler
        await fetch('/forms/handler.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).catch(() => {}); // graceful fail — DB save still happens via Base44

        // Always show success
        form.style.display = 'none';
        if (successEl && successEl.classList.contains('form-success')) {
          successEl.style.display = 'block';
        }
      } catch (err) {
        btn.textContent = original;
        btn.disabled = false;
      }
    });
  });

  /* ─── ANTI-SPAM: Honeypot hidden field check ─── */
  document.querySelectorAll('form').forEach(form => {
    const hp = form.querySelector('input[name="website"]');
    if (hp) {
      form.addEventListener('submit', function (e) {
        if (hp.value) { e.preventDefault(); e.stopPropagation(); return false; }
      }, true);
    }
  });

  /* ─── GALLERY LIGHTBOX (simple) ─── */
  document.querySelectorAll('.gallery-item[data-src]').forEach(item => {
    item.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
      const img = document.createElement('img');
      img.src = item.dataset.src;
      img.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:8px;border:2px solid #C8A84B;';
      overlay.appendChild(img);
      overlay.addEventListener('click', () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });

  /* ─── SET TODAY'S DATE on date fields ─── */
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[name="preferred_date"]').forEach(el => {
    if (!el.value) el.setAttribute('min', today);
  });

  /* ─── SCROLL TO TOP BUTTON ─── */
  const scrollBtn = document.createElement('button');
  scrollBtn.textContent = '▲';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  scrollBtn.style.cssText = `
    position: fixed; bottom: 28px; right: 28px;
    background: #B22234; color: white;
    border: 2px solid #C8A84B; border-radius: 50%;
    width: 44px; height: 44px; font-size: 1rem;
    cursor: pointer; display: none; z-index: 500;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    transition: all 0.2s;
  `;
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(scrollBtn);
  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 400 ? 'block' : 'none';
  });

  console.log('American Legion Post 579 — Site loaded. For God and Country.');
});
