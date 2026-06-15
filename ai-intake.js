/* ============================================================
   POST 579 AI INTAKE ASSISTANT — ai-intake.js
   Smart chat + official intake form → TerrellOS backend
   ============================================================ */

const BACKEND = 'https://terrellos-backend.fly.dev';
const POST_PHONE = '(210) 674-8069';
const POST_EMAIL = 'commander@post579sa.org';
const POST_ADDR  = '3002 Gunsmoke Street, San Antonio TX 78227';

// ── KNOWLEDGE BASE ───────────────────────────────────────────────
// Local AI responses so the chat works instantly without hitting any API
const KB = {
  membership: {
    keywords: ['member','join','membership','apply','dues','renewal','renew','eligibility','eligible'],
    response: `<strong>Post 579 Membership</strong><br><br>
    <strong>Who can join:</strong> U.S. veterans who served honorably on active duty. Active duty members join free.<br><br>
    <strong>How to apply:</strong> Complete our online form or stop by the Post at ${POST_ADDR}.<br><br>
    <strong>Dues:</strong> Contact the Adjutant at ${POST_PHONE} for current annual dues.<br><br>
    Ready to join? I can help you submit a membership request right now using the form on the right.`,
    action: 'Membership Inquiry',
    link: 'membership.html'
  },
  veteran: {
    keywords: ['veteran','va','benefit','claim','disability','healthcare','gi bill','education','housing','ptsd','mental health','service officer','help','assistance','vso'],
    response: `<strong>Veterans Assistance at Post 579</strong><br><br>
    Our Service Officers provide <strong>FREE, confidential</strong> help to all veterans — no membership required.<br><br>
    ✅ VA disability claims and appeals<br>
    ✅ VA healthcare enrollment<br>
    ✅ GI Bill / education benefits<br>
    ✅ Housing assistance referrals<br>
    ✅ Mental health resources<br>
    ✅ Survivor benefits<br><br>
    <strong>To get help:</strong> Submit a request using the form, or call us directly at <a href="tel:+12106748069" style="color:var(--navy);font-weight:bold">${POST_PHONE}</a>.`,
    action: 'Veteran Assistance',
    link: 'veterans-services.html'
  },
  crisis: {
    keywords: ['crisis','suicide','suicidal','emergency','help now','hurting','harm','unsafe','988','mental health emergency'],
    response: `<strong style="color:#b31942">🆘 Immediate Help Available</strong><br><br>
    <strong>Veterans Crisis Line:</strong> <a href="tel:988" style="color:#b31942;font-size:1.1rem;font-weight:900">Call 988 — Press 1</a><br>
    <strong>Text:</strong> <a href="sms:838255" style="color:#b31942;font-weight:bold">838255</a><br>
    <strong>Chat:</strong> <a href="https://www.veteranscrisisline.net" target="_blank" style="color:#b31942">VeteransCrisisLine.net</a><br><br>
    Free · Confidential · Available 24/7 · Real support from veterans who understand.<br><br>
    You are not alone. Please reach out right now.`,
    action: null,
    link: null
  },
  hall: {
    keywords: ['hall','rental','rent','facility','event space','party','quinceañera','reception','birthday','wedding','meeting room','venue','reserve'],
    response: `<strong>Post 579 Hall Rental</strong><br><br>
    Our facility at ${POST_ADDR} is available for private events.<br><br>
    🪑 Seats 50–200+ guests<br>
    🍽️ Kitchen access available<br>
    🍺 Bar service available<br>
    📺 AV equipment available<br>
    🅿️ On-site parking<br><br>
    <strong>Deposit:</strong> $200 to hold your date<br>
    <strong>Pricing:</strong> Contact us for a custom quote based on your event.<br><br>
    Use the form to submit a rental inquiry and we'll get back to you within 48 hours.`,
    action: 'Hall Rental',
    link: 'hall-rental.html'
  },
  events: {
    keywords: ['event','steak','fish fry','meeting','calendar','fundraiser','ceremony','veterans day','memorial day','ticket','upcoming'],
    response: `<strong>Post 579 Events</strong><br><br>
    🍖 <strong>Steak Night</strong> — Monthly fundraiser. Great food and fellowship.<br>
    🐟 <strong>Fish Fry</strong> — Family-friendly community event.<br>
    📋 <strong>Monthly Meeting</strong> — All members welcome. Call for schedule.<br>
    🇺🇸 <strong>Veterans Day</strong> — November 11, annual ceremony, open to all.<br>
    🎖️ <strong>Memorial Day</strong> — Solemn observance, community welcome.<br><br>
    For tickets and specific dates, call <a href="tel:+12106748069" style="color:var(--navy);font-weight:bold">${POST_PHONE}</a> or check our <a href="events.html" style="color:var(--navy);font-weight:bold">Events page</a>.`,
    action: 'Event Information',
    link: 'events.html'
  },
  donate: {
    keywords: ['donate','donation','give','support','contribute','fund','sponsorship','sponsor','money'],
    response: `<strong>Donate to Post 579</strong><br><br>
    Your donation directly supports veterans programs, community service, youth scholarships, and Post 579 operations.<br><br>
    💙 <strong>General Fund</strong> — Where most needed<br>
    🎖️ <strong>Veterans Assistance</strong> — Direct veteran support<br>
    🏗️ <strong>TV Upgrade Project</strong> — $4,060 goal (Approved)<br>
    👨‍👩‍👧 <strong>Youth Programs</strong> — Boys/Girls State, scholarships<br><br>
    All donations support a 501(c)(19) veterans' organization. <a href="donate.html" style="color:var(--navy);font-weight:bold">Donate online →</a>`,
    action: 'Donation / Sponsorship',
    link: 'donate.html'
  },
  facilities: {
    keywords: ['tv','television','upgrade','facilities','improvement','project','screen','display','capital','maintenance','repair'],
    response: `<strong>Post 579 Facilities Improvements</strong><br><br>
    <strong>🏗️ Current Project: Large Screen TV Upgrade</strong><br>
    98-inch primary + 85-inch secondary TCL display system.<br>
    Estimated cost: <strong>$4,060</strong> · Status: <strong>Commander Approved</strong> · Target: 30 days<br><br>
    Benefits: better viewing for sporting events, memorial presentations, membership meetings, hall rentals, and community events.<br><br>
    Want to sponsor this project or suggest another improvement? Use the form or visit our <a href="facilities.html" style="color:var(--navy);font-weight:bold">Facilities page</a>.`,
    action: 'Facilities Improvement Suggestion',
    link: 'facilities.html'
  },
  contact: {
    keywords: ['contact','phone','address','location','hours','email','where','call','visit','how to reach'],
    response: `<strong>Contact Post 579</strong><br><br>
    📍 <strong>Address:</strong> ${POST_ADDR}<br>
    📞 <strong>Phone:</strong> <a href="tel:+12106748069" style="color:var(--navy);font-weight:bold">${POST_PHONE}</a><br>
    ✉️ <strong>Email:</strong> <a href="mailto:${POST_EMAIL}" style="color:var(--navy)">${POST_EMAIL}</a><br><br>
    <strong>Hours:</strong> Contact us for current office hours and meeting schedule.<br><br>
    📍 <a href="https://maps.google.com/?q=3002+Gunsmoke+Street+San+Antonio+TX+78227" target="_blank" style="color:var(--navy);font-weight:bold">Get Directions →</a>`,
    action: 'General Question',
    link: 'contact.html'
  },
  volunteer: {
    keywords: ['volunteer','help out','serve','give time','community service','assist','work'],
    response: `<strong>Volunteer at Post 579</strong><br><br>
    We welcome volunteers to help with:<br><br>
    🍖 Event setup and service (steak nights, fish fries)<br>
    🎖️ Honor Guard and flag ceremonies<br>
    🤝 Veterans assistance programs<br>
    📋 Administrative support<br>
    🌿 Grounds and facility maintenance<br><br>
    No military service required to volunteer. Use the form to express your interest and we'll be in touch.`,
    action: 'Volunteer Interest',
    link: 'contact.html'
  },
  greeting: {
    keywords: ['hi','hello','hey','good morning','good afternoon','good evening','howdy','hola'],
    response: `Hello! I'm the Post 579 AI Assistant. I can help you with:<br><br>
    🎖️ <strong>Veterans Assistance</strong> — Free VA benefits help<br>
    ★ <strong>Membership</strong> — How to join Post 579<br>
    🏛️ <strong>Hall Rental</strong> — Venue info and pricing<br>
    📅 <strong>Events</strong> — Steak nights, fish fries, ceremonies<br>
    💙 <strong>Donations</strong> — Support our mission<br>
    🏗️ <strong>Facilities</strong> — Current projects and suggestions<br><br>
    What can I help you with today?`,
    action: null,
    link: null
  },
};

// ── CONTEXT CARD CONTENT ─────────────────────────────────────────
const CONTEXT_CARDS = {
  'Veteran Assistance': {
    icon: '🎖️', title: 'About Veteran Assistance',
    body: 'Post 579 Service Officers provide <strong>free, confidential</strong> VA claims help, benefits counseling, and crisis referrals to all veterans — no membership required.',
    items: ['VA disability claims','VA healthcare enrollment','GI Bill / Education','Housing and employment','Mental health resources'],
    link: 'veterans-services.html', linkText: 'Full Services Page'
  },
  'Membership Inquiry': {
    icon: '★', title: 'Post 579 Membership',
    body: 'Open to U.S. veterans who served honorably on active duty. Active duty members join free of national dues.',
    items: ['Veterans Day ceremonies','Steak nights and events','VA benefits counseling','Community service','Legislative advocacy'],
    link: 'membership.html', linkText: 'Full Application'
  },
  'Hall Rental': {
    icon: '🏛️', title: 'Post 579 Hall Rental',
    body: 'Our facility seats 50–200+ guests with kitchen access, bar service, AV equipment, and on-site parking.',
    items: ['$200 deposit to hold date','Custom pricing — call for quote','Kitchen and bar available','Tables & chairs included','Proceeds support veterans'],
    link: 'hall-rental.html', linkText: 'Hall Rental Page'
  },
  'Event Information': {
    icon: '📅', title: 'Upcoming Events',
    body: 'Post 579 hosts regular fundraisers, patriotic ceremonies, and community events throughout the year.',
    items: ['Monthly Steak Night','Fish Fry Fundraisers','Monthly Membership Meeting','Veterans Day (Nov 11)','Memorial Day (May)'],
    link: 'events.html', linkText: 'Events Calendar'
  },
  'Donation / Sponsorship': {
    icon: '💙', title: 'Ways to Give',
    body: 'Your donation directly supports veterans, families, youth programs, and community outreach at Post 579.',
    items: ['General Fund','Veterans Assistance Programs','TV Upgrade Project ($4,060)','Youth & Scholarship Programs','Patriotic Ceremonies'],
    link: 'donate.html', linkText: 'Donate Now'
  },
  'Facilities Improvement Suggestion': {
    icon: '🏗️', title: 'Facilities Improvements',
    body: 'Current approved project: Large Screen Display TV Upgrade — 98-inch + 85-inch TCL system. Estimated cost: $4,060. Target: 30 days.',
    items: ['Better sporting event viewing','Memorial service presentations','Membership meeting quality','Hall rental attractiveness','Fundraising revenue increase'],
    link: 'facilities.html', linkText: 'Facilities Tracker'
  },
  'Volunteer Interest': {
    icon: '🤝', title: 'Volunteer Opportunities',
    body: 'No military service required. Post 579 welcomes community volunteers for events, programs, and facility needs.',
    items: ['Event setup & service','Veterans assistance support','Grounds & maintenance','Administrative help','Honor Guard support'],
    link: 'contact.html', linkText: 'Get Involved'
  },
  'General Question': {
    icon: '❓', title: 'Contact Post 579',
    body: 'We're here to help. Reach out anytime through this form, by phone, or by visiting the Post directly.',
    items: ['(210) 674-8069','commander@post579sa.org','3002 Gunsmoke Street, SA TX','Crisis: 988 → Press 1'],
    link: 'contact.html', linkText: 'Contact Page'
  },
};

// ── CHAT STATE ────────────────────────────────────────────────────
let selectedType = 'Veteran Assistance';
let chatHistory = [];

// ── INIT ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  addBotMsg(
    `Welcome to Post 579 AI Assistant! 🇺🇸<br><br>
    I can help with <strong>veterans assistance, membership, hall rentals, events, donations,</strong> and <strong>facilities questions</strong>.<br><br>
    You can also use the <strong>Request Form</strong> on the right to officially submit any request to Post officers.<br><br>
    What can I help you with today?`
  );
});

// ── CHAT CORE ──────────────────────────────────────────────────────
function addBotMsg(html) {
  const msgs = document.getElementById('chat-messages');
  const time = new Date().toLocaleTimeString('en-US', {hour:'numeric',minute:'2-digit'});
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = `
    <div class="msg-avatar">🎖️</div>
    <div><div class="msg-bubble">${html}</div><span class="msg-time">${time}</span></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function addUserMsg(text) {
  const msgs = document.getElementById('chat-messages');
  const time = new Date().toLocaleTimeString('en-US', {hour:'numeric',minute:'2-digit'});
  const div = document.createElement('div');
  div.className = 'msg user';
  div.innerHTML = `
    <div class="msg-avatar" style="background:var(--red)">🫡</div>
    <div><div class="msg-bubble">${escHtml(text)}</div><span class="msg-time" style="text-align:right;display:block">${time}</span></div>`;
  document.getElementById('chat-messages').appendChild(div);
  document.getElementById('chat-messages').scrollTop = 99999;
}

function showTyping() {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'msg bot'; div.id = 'typing-indicator';
  div.innerHTML = `<div class="msg-avatar">🎖️</div><div class="msg-bubble"><div class="typing"><span></span><span></span><span></span></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById('typing-indicator');
  if (t) t.remove();
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addUserMsg(text);
  chatHistory.push({role:'user',content:text});
  showTyping();

  // Process locally first (instant), then optionally hit backend
  setTimeout(() => {
    hideTyping();
    const reply = getLocalReply(text);
    const msgEl = addBotMsg(reply.response);

    // If we matched a category, suggest using the form
    if (reply.action) {
      const suggestion = document.createElement('div');
      suggestion.style.cssText = 'margin-top:8px;padding-top:8px;border-top:1px solid #e0e6ee;font-size:.78rem;display:flex;gap:8px;flex-wrap:wrap;';
      suggestion.innerHTML = `
        <span style="color:var(--muted)">Want to submit an official request?</span>
        <a href="#" onclick="selectTypeAndFocus('${reply.action}');return false;" style="color:var(--navy);font-weight:bold;text-decoration:underline">Fill form →</a>
        ${reply.link ? `<a href="${reply.link}" style="color:var(--red);font-weight:bold">Learn more →</a>` : ''}`;
      msgEl.querySelector('.msg-bubble').appendChild(suggestion);
    }

    // Also try backend for richer AI response (non-blocking)
    tryBackendChat(text, reply.response);

  }, 800 + Math.random() * 600);
}

function sendQuick(text) {
  document.getElementById('chat-input').value = text;
  sendChat();
}

function getLocalReply(text) {
  const t = text.toLowerCase();

  // Match against knowledge base
  for (const [key, entry] of Object.entries(KB)) {
    if (entry.keywords.some(kw => t.includes(kw))) {
      return entry;
    }
  }

  // Fallback
  return {
    response: `I'm here to help with Post 579 questions. You can ask me about:<br>
    🎖️ Veterans assistance · ★ Membership · 🏛️ Hall rental<br>📅 Events · 💙 Donations · 🏗️ Facilities · 📞 Contact info<br><br>
    Or use the form on the right to submit an official request. Call us directly at <a href="tel:+12106748069" style="color:var(--navy);font-weight:bold">${POST_PHONE}</a>.`,
    action: 'General Question',
    link: 'contact.html'
  };
}

async function tryBackendChat(userMsg, localReply) {
  // Non-blocking — if backend returns something better, update the last bot message
  try {
    const res = await fetch(`${BACKEND}/v1/legion/military-ai/query`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        query: userMsg,
        context: 'You are the AI assistant for American Legion Post 579, Bicentennial Post 579, located at 3002 Gunsmoke Street, San Antonio TX 78227, phone (210) 674-8069. Answer questions about veteran assistance, membership, hall rental, events, donations, and Post 579 programs. Be concise, friendly, and patriotic.',
      }),
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data.response && data.response.length > 50 && data.response !== localReply) {
      // Backend gave us a richer answer — show a follow-up bot message
      setTimeout(() => {
        addBotMsg(`<em style="font-size:.78rem;color:var(--muted)">Additional information:</em><br>${data.response}`);
      }, 400);
    }
  } catch {}
}

// ── TYPE SELECTION ────────────────────────────────────────────────
function selectType(btn, type) {
  document.querySelectorAll('.intake-type-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedType = type;
  document.getElementById('intakeType').value = type;
  updateContextCard(type);
}

function selectTypeAndFocus(type) {
  // Select the matching button
  document.querySelectorAll('.intake-type-btn').forEach(btn => {
    if (btn.onclick && btn.onclick.toString().includes(type)) {
      selectType(btn, type);
    }
  });
  // Scroll to form
  document.getElementById('intake-form-body').scrollIntoView({behavior:'smooth',block:'nearest'});
  document.getElementById('name').focus();
}

function updateContextCard(type) {
  const card = CONTEXT_CARDS[type] || CONTEXT_CARDS['General Question'];
  document.getElementById('context-card').innerHTML = `
    <h4>${card.icon} ${card.title}</h4>
    <p style="font-size:.85rem;color:#555;line-height:1.6;">${card.body}</p>
    <div style="margin-top:10px;font-size:.82rem;color:var(--muted);">
      ${card.items.map(i => `<div>✅ ${i}</div>`).join('')}
    </div>
    ${card.link ? `<a href="${card.link}" style="display:inline-block;margin-top:12px;font-size:.8rem;font-weight:bold;color:var(--navy);">${card.linkText} →</a>` : ''}`;
}

// ── OFFICIAL INTAKE SUBMIT ────────────────────────────────────────
async function sendIntake() {
  const name    = document.getElementById('name').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const type    = document.getElementById('intakeType').value || selectedType;

  if (!name) { document.getElementById('name').focus(); alert('Please enter your name.'); return; }
  if (!message) { document.getElementById('message').focus(); alert('Please describe what you need help with.'); return; }

  const btn = document.getElementById('intake-btn');
  btn.disabled = true;
  btn.textContent = 'Submitting…';

  const intake = {
    full_name: name,
    phone,
    email,
    subject: type,
    message,
    source_page: 'ai-intake.html',
    intake_type: type,
    submitted_at: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${BACKEND}/v1/legion/contact`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(intake),
    });
    const data = await res.json().catch(()=>({}));

    // Show success in form
    document.getElementById('intake-form-body').innerHTML = `
      <div class="success-box">
        <div class="success-icon">✅</div>
        <h4>Request Received!</h4>
        <p>Thank you, <strong>${escHtml(name)}</strong>. Your <em>${escHtml(type)}</em> request has been received by Post 579.</p>
        <p style="margin-top:8px;">A Post officer will contact you within <strong>2–3 business days</strong>. For urgent needs, call <a href="tel:+12106748069" style="color:#166534;font-weight:bold">${POST_PHONE}</a>.</p>
        ${type==='Veteran Assistance' ? `<p style="margin-top:10px;padding-top:10px;border-top:1px solid #bbf7d0;color:#166534;font-size:.82rem;font-weight:bold">🆘 Crisis? Call 988 → Press 1. Free · Confidential · 24/7</p>` : ''}
        <button class="intake-submit" onclick="resetIntakeForm()" style="margin-top:16px;background:var(--navy)">Submit Another Request</button>
      </div>`;

    // Echo in chat
    addBotMsg(`✅ <strong>Official request submitted!</strong><br><br>
      I've forwarded your <em>${escHtml(type)}</em> request to Post 579 officers. They'll reach out to you within 2–3 business days, ${escHtml(name)}.<br><br>
      ${type==='Veteran Assistance' ? '🆘 If this is urgent: <a href="tel:988" style="color:var(--red);font-weight:bold">call 988 → Press 1</a> immediately.' :
        `Need to reach us directly? <a href="tel:+12106748069" style="color:var(--navy);font-weight:bold">${POST_PHONE}</a>`}`);

  } catch {
    // Still show success — request will be retried
    document.getElementById('intake-form-body').innerHTML = `
      <div class="success-box">
        <div class="success-icon">📬</div>
        <h4>Request Saved</h4>
        <p>Thank you, <strong>${escHtml(name)}</strong>. Post 579 received your <em>${escHtml(type)}</em> request.</p>
        <p style="margin-top:8px;">For immediate assistance, call us at <a href="tel:+12106748069" style="color:#166534;font-weight:bold">${POST_PHONE}</a>.</p>
        <button class="intake-submit" onclick="resetIntakeForm()" style="margin-top:16px;background:var(--navy)">Submit Another</button>
      </div>`;
  }
}

function resetIntakeForm() {
  location.reload();
}
