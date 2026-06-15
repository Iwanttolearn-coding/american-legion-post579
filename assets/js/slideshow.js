// ============================================================
// AMERICAN LEGION POST 579 — MILITARY BRANCH SLIDESHOW ENGINE
// ============================================================

const BRANCH_SLIDES = [
  {
    img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/824194d92_b8641addf_IMG_6548.png",
    branch: "U.S. ARMY",
    color: "#4a5a2a",
    accent: "#8B7355",
    tag: "Army Strong",
    text: "Serving with courage since 1775. The Army defends our nation and honors all who answered the call."
  },
  {
    img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/00f5c56c7_729d45095_IMG_6643.png",
    branch: "U.S. MARINE CORPS",
    color: "#8B1A1A",
    accent: "#C5A028",
    tag: "Semper Fidelis",
    text: "Always Faithful. Marines have fought from the Halls of Montezuma to the shores of Tripoli."
  },
  {
    img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/bdf3a213d_396b25c30_IMG_6465.jpg",
    branch: "U.S. NAVY",
    color: "#1B2A6B",
    accent: "#C5A028",
    tag: "Anchors Aweigh",
    text: "Masters of the sea. The Navy protects freedom of navigation across every ocean on earth."
  },
  {
    img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/020753d69_580d65494_IMG_6480.png",
    branch: "U.S. AIR FORCE",
    color: "#003087",
    accent: "#00B4F0",
    tag: "Aim High",
    text: "Dominating the skies since 1947. The Air Force delivers airpower wherever freedom calls."
  },
  {
    img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/f1b178b8b_740f32138_IMG_6464.jpg",
    branch: "U.S. COAST GUARD",
    color: "#003366",
    accent: "#CC0000",
    tag: "Semper Paratus",
    text: "Always Ready. The Coast Guard stands watch over America's waters, ports, and coastal communities."
  },
  {
    img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/2f1ff7abb_7c1cf3f89_IMG_6481.png",
    branch: "U.S. SPACE FORCE",
    color: "#0B1A3A",
    accent: "#7B68EE",
    tag: "Semper Supra",
    text: "Always Above. America's newest branch defends U.S. interests in space and cyberspace."
  },
  {
    img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/1e1cd191e_99f7c1086_IMG_6467.jpg",
    branch: "BICENTENNIAL POST 579",
    color: "#B22234",
    accent: "#FFFFFF",
    tag: "For God and Country",
    text: "Mr. Harold Post · 3002 Gunsmoke Street · San Antonio, TX · Serving veterans since 1976."
  },
  {
    img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/3c856512c_daaf1a755_IMG_6454.jpg",
    branch: "VETERANS OF POST 579",
    color: "#1B2A47",
    accent: "#C5A028",
    tag: "Honor · Service · Sacrifice",
    text: "We remember every veteran who walked through these doors. Their legacy lives on in our Post."
  },
  {
    img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/7ef2844c2_60ad78586_IMG_6478.jpg",
    branch: "COMMUNITY & SERVICE",
    color: "#2D5016",
    accent: "#C5A028",
    tag: "Serving San Antonio",
    text: "From youth programs to veteran assistance — Post 579 is committed to the Lackland Terrace community."
  },
  {
    img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/e90242ebe_44d45c1bb_IMG_6556.jpg",
    branch: "POST 579 EVENTS",
    color: "#6B1A1A",
    accent: "#FFD700",
    tag: "Join Us",
    text: "Steak Nights · Fish Fries · Veterans Day Banquets · Family events all year round at the Post."
  },
  {
    img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/16a3e8bb8_d1a3e5270_IMG_6472.jpg",
    branch: "MEMBERSHIP",
    color: "#1B2A47",
    accent: "#B22234",
    tag: "Join Post 579",
    text: "Are you a veteran or active duty member? You belong here. Apply for membership today."
  },
  {
    img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/323f1bd78_013a10331_IMG_6463.jpg",
    branch: "HALL RENTAL",
    color: "#2C1810",
    accent: "#C5A028",
    tag: "Reserve Our Hall",
    text: "Host your event at Post 579. Our facility accommodates reunions, celebrations, and community gatherings."
  }
];

// ── HERO SLIDESHOW ─────────────────────────────────────────
function initHeroSlideshow(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let current = 0;
  let timer = null;

  // Build HTML
  container.innerHTML = `
    <div class="slide-track" id="slide-track">
      ${BRANCH_SLIDES.map((s, i) => `
        <div class="slide-item ${i === 0 ? 'active' : ''}" data-index="${i}" style="background-color:${s.color}">
          <div class="slide-img" style="background-image:url('${s.img}')"></div>
          <div class="slide-overlay" style="background:linear-gradient(to right, ${s.color}ee 40%, ${s.color}88 70%, transparent)"></div>
          <div class="slide-content">
            <div class="slide-tag" style="background:${s.accent};color:${s.color}">${s.tag}</div>
            <h2 class="slide-branch">${s.branch}</h2>
            <p class="slide-text">${s.text}</p>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="slide-dots">
      ${BRANCH_SLIDES.map((s, i) => `
        <button class="dot ${i === 0 ? 'active' : ''}" data-i="${i}" aria-label="${s.branch}" style="--dot-color:${s.accent}"></button>
      `).join('')}
    </div>
    <button class="slide-arrow prev" id="slide-prev">&#8249;</button>
    <button class="slide-arrow next" id="slide-next">&#8250;</button>
    <div class="slide-counter"><span id="slide-cur">1</span> / ${BRANCH_SLIDES.length}</div>
  `;

  function goTo(n) {
    const slides = container.querySelectorAll('.slide-item');
    const dots = container.querySelectorAll('.dot');
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + BRANCH_SLIDES.length) % BRANCH_SLIDES.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    container.querySelector('#slide-cur').textContent = current + 1;
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  container.querySelector('#slide-prev').addEventListener('click', () => goTo(current - 1));
  container.querySelector('#slide-next').addEventListener('click', () => goTo(current + 1));
  container.querySelectorAll('.dot').forEach(d => d.addEventListener('click', () => goTo(+d.dataset.i)));

  timer = setInterval(() => goTo(current + 1), 5000);
}

// ── MINI CARD SLIDESHOW (for branch sections) ──────────────
function initMiniSlideshow(containerId, indices, intervalMs = 4000) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const slides = indices.map(i => BRANCH_SLIDES[i]);
  let cur = 0;

  function render() {
    const s = slides[cur];
    container.innerHTML = `
      <div class="mini-slide" style="background-color:${s.color}">
        <div class="mini-img" style="background-image:url('${s.img}')"></div>
        <div class="mini-overlay" style="background:linear-gradient(to top,${s.color}dd,transparent)"></div>
        <div class="mini-label">
          <span class="mini-tag" style="background:${s.accent};color:${s.color}">${s.tag}</span>
          <strong>${s.branch}</strong>
          <p>${s.text}</p>
        </div>
      </div>
    `;
  }

  render();
  setInterval(() => { cur = (cur + 1) % slides.length; render(); }, intervalMs);
}

// ── AUTO-INIT on DOM ready ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('hero-slideshow')) initHeroSlideshow('hero-slideshow');
  if (document.getElementById('branch-mini-1')) initMiniSlideshow('branch-mini-1', [0,1,2]);
  if (document.getElementById('branch-mini-2')) initMiniSlideshow('branch-mini-2', [3,4,5]);
  if (document.getElementById('branch-mini-3')) initMiniSlideshow('branch-mini-3', [6,7,8]);
});
