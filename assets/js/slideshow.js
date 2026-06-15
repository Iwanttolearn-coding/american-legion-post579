// ============================================================
// AMERICAN LEGION POST 579 — PHOTO SLIDESHOW
// Uses ONLY uploaded Post 579 real photos
// ============================================================

const CDN = "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/";

const SLIDES = [
  { img: CDN + "824194d92_b8641addf_IMG_6548.png",  label: "AMERICAN LEGION POST 579",   sub: "Bicentennial Post · San Antonio, Texas" },
  { img: CDN + "00f5c56c7_729d45095_IMG_6643.png",  label: "HONOR · SERVICE · SACRIFICE", sub: "Serving veterans and their families since 1976" },
  { img: CDN + "bdf3a213d_396b25c30_IMG_6465.jpg",  label: "POST 579 VETERANS",           sub: "Every branch. Every era. One family." },
  { img: CDN + "020753d69_580d65494_IMG_6480.png",  label: "FOR GOD AND COUNTRY",         sub: "American Legion Bicentennial Post 579" },
  { img: CDN + "f1b178b8b_740f32138_IMG_6464.jpg",  label: "COMMUNITY & FELLOWSHIP",      sub: "Lackland Terrace · San Antonio, TX 78227" },
  { img: CDN + "2f1ff7abb_7c1cf3f89_IMG_6481.png",  label: "STEAK NIGHTS · FISH FRIES",   sub: "Join us for events that bring the community together" },
  { img: CDN + "1e1cd191e_99f7c1086_IMG_6467.jpg",  label: "VETERANS ASSISTANCE",         sub: "Free VA benefits guidance for every veteran" },
  { img: CDN + "3c856512c_daaf1a755_IMG_6454.jpg",  label: "JOIN POST 579",               sub: "Membership open to eligible veterans and families" },
  { img: CDN + "7ef2844c2_60ad78586_IMG_6478.jpg",  label: "MEMORIAL · REMEMBRANCE",      sub: "We never forget those who gave everything" },
  { img: CDN + "e90242ebe_44d45c1bb_IMG_6556.jpg",  label: "PATRIOTISM IN ACTION",        sub: "Veterans Day · Memorial Day · POW/MIA Ceremonies" },
  { img: CDN + "16a3e8bb8_d1a3e5270_IMG_6472.jpg",  label: "HALL RENTAL AVAILABLE",       sub: "Reserve our facility for your next event" },
  { img: CDN + "323f1bd78_013a10331_IMG_6463.jpg",  label: "POST 579 FACILITY",           sub: "3002 Gunsmoke Street · San Antonio, TX · (210) 674-8069" },
  { img: CDN + "8ed9e26a3_0351b4a40_20260520_081000.jpg", label: "BICENTENNIAL POST 579",  sub: "A home for every veteran in San Antonio" },
  { img: CDN + "18adc518c_15b0f7eea_20260520_083822.jpg", label: "POST 579 — INSIDE",     sub: "Our hall is open for fellowship, events, and service" },
  { img: CDN + "9db423c08_5ea49e56c_20260520_080919.jpg", label: "SERVING OUR VETERANS",  sub: "Post 579 connects veterans with the help they earned" },
  { img: CDN + "ad0c21aa9_923bc921d_20260520_080913.jpg", label: "AMERICAN PRIDE",        sub: "One nation. One mission. One Post." },
  { img: CDN + "729a27cd6_a396823ea_20260520_080940.jpg", label: "POST 579 COMMUNITY",   sub: "Raising up the next generation of American patriots" },
  { img: CDN + "e7c7ec19c_bd0ed4a0e_20260520_080909.jpg", label: "VETERANS DAY CEREMONY", sub: "Honoring every soldier, sailor, airman, marine, and guardian" },
  { img: CDN + "d74098385_de2a6d8d9_20260520_080933.jpg", label: "LEGION STRONG",         sub: "2 million members. 12,000 posts. One American family." },
  { img: CDN + "c19cea45e_8632e4dc4_20260520_082001.jpg", label: "HALL EVENTS",           sub: "Steak nights, fish fries, banquets and more at Post 579" },
  { img: CDN + "a3cb832eb_f7a3f8598_20260520_083818.jpg", label: "FREEDOM HAS A PRICE",  sub: "We honor every man and woman who paid it." },
  { img: CDN + "9d698feba_ccdca71ce_20260520_083814.jpg", label: "POST 579 GALLERY",     sub: "Decades of service, fellowship, and community" },
  { img: CDN + "ef1d6ed4e_85aced7a3_20260520_080905.jpg", label: "JOIN US",               sub: "American Legion Post 579 · For God and Country 🇺🇸" }
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/060ed68d1_u1.png", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/8ab1cf8b0_u2.png", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/7d97a1a84_u3.png", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/e1b680ff2_u4.png", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/7b3eedcd2_u5.jpg", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/b4ec4707f_u6.png", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/f4e4d7ad5_u7.png", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/1d101b2c2_u8.png", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/08e507081_u9.png", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/ef53a30ea_u10.jpg", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/8c88f1a95_u11.png", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/b478bfa20_u12.png", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/bad5626e5_u13.jpg", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/758ca21ed_u14.png", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/2e87660c4_u15.png", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/8081860cd_u16.png", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/0ec8d8a85_u17.png", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/af396f4b5_u18.png", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/21e77a8fa_u19.jpg", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
  {{ img: "https://base44.app/api/apps/6a0a2d575b77f3b9ebb6b1c9/files/mp/public/6a0a2d575b77f3b9ebb6b1c9/33e42d9c7_u20.png", label: "BICENTENNIAL POST 579", sub: "American Legion Post 579 · San Antonio, Texas" }},
];

// ── HERO SLIDESHOW ─────────────────────────────────────────
function initHeroSlideshow(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  let cur = 0, timer = null;

  el.innerHTML = `
    <div class="hs-track">
      ${SLIDES.map((s,i) => `
        <div class="hs-slide ${i===0?'active':''}" style="background-image:url('${s.img}')">
          <div class="hs-overlay"></div>
          <div class="hs-content">
            <div class="hs-flags">🇺🇸 🇺🇸 🇺🇸 🇺🇸 🇺🇸</div>
            <h2 class="hs-label">${s.label}</h2>
            <p class="hs-sub">${s.sub}</p>
          </div>
        </div>`).join('')}
    </div>
    <button class="hs-arrow hs-prev" id="hsPrev">&#8249;</button>
    <button class="hs-arrow hs-next" id="hsNext">&#8250;</button>
    <div class="hs-dots">
      ${SLIDES.map((_,i) => `<button class="hs-dot ${i===0?'active':''}" data-i="${i}"></button>`).join('')}
    </div>
    <div class="hs-counter"><span id="hsCur">1</span>/${SLIDES.length}</div>
  `;

  function go(n) {
    el.querySelectorAll('.hs-slide')[cur].classList.remove('active');
    el.querySelectorAll('.hs-dot')[cur].classList.remove('active');
    cur = (n + SLIDES.length) % SLIDES.length;
    el.querySelectorAll('.hs-slide')[cur].classList.add('active');
    el.querySelectorAll('.hs-dot')[cur].classList.add('active');
    el.querySelector('#hsCur').textContent = cur + 1;
    clearInterval(timer); timer = setInterval(() => go(cur+1), 4500);
  }

  el.querySelector('#hsPrev').onclick = () => go(cur-1);
  el.querySelector('#hsNext').onclick = () => go(cur+1);
  el.querySelectorAll('.hs-dot').forEach(d => d.onclick = () => go(+d.dataset.i));
  timer = setInterval(() => go(cur+1), 4500);
}

// ── MINI STRIP (3-up section) ──────────────────────────────
function initMiniStrip(containerId, startIdx, count, interval=3800) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const pool = SLIDES.slice(startIdx, startIdx + count);
  let cur = 0;
  function render() {
    const s = pool[cur];
    el.style.backgroundImage = `url('${s.img}')`;
    el.querySelector('.ms-label').textContent = s.label;
    el.querySelector('.ms-sub').textContent = s.sub;
  }
  el.innerHTML = `
    <div class="ms-overlay"></div>
    <div class="ms-text">
      <div class="ms-flags">🇺🇸</div>
      <strong class="ms-label"></strong>
      <p class="ms-sub"></p>
    </div>`;
  render();
  setInterval(() => { cur=(cur+1)%pool.length; render(); }, interval);
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('hero-slideshow')) initHeroSlideshow('hero-slideshow');
  if (document.getElementById('ms1')) initMiniStrip('ms1', 0,  8, 3800);
  if (document.getElementById('ms2')) initMiniStrip('ms2', 8,  8, 4200);
  if (document.getElementById('ms3')) initMiniStrip('ms3', 16, 7, 3500);
});
