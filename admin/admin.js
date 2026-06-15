/* ============================================================
   POST 579 ADMIN DASHBOARD — admin.js  v2.0
   Role-Based · Full CRUD · 9 Tables · localStorage persistence
   ============================================================ */

const BACKEND = 'https://terrellos-backend.fly.dev';

// ── ROLES ──────────────────────────────────────────────────────
const ROLES = {
  commander: { label:'Commander',      badge:'role-commander', perms:['all'] },
  adjutant:  { label:'Adjutant',       badge:'role-adjutant',  perms:['members','events','news','messages','volunteers','gallery','officers'] },
  finance:   { label:'Finance Officer',badge:'role-finance',   perms:['donations','members'] },
  events:    { label:'Event Coord.',   badge:'role-readonly',  perms:['events','rentals'] },
  hall:      { label:'Hall Manager',   badge:'role-readonly',  perms:['rentals'] },
  readonly:  { label:'Read Only',      badge:'role-readonly',  perms:['read'] },
};

const ACCOUNTS = [
  {user:'commander', pass:'Post579!Cmd2026', role:'commander'},
  {user:'adjutant',  pass:'Post579!Adj2026', role:'adjutant'},
  {user:'finance',   pass:'Post579!Fin2026', role:'finance'},
  {user:'events',    pass:'Post579!Evt2026', role:'events'},
  {user:'hall',      pass:'Post579!Hll2026', role:'hall'},
  {user:'staff',     pass:'Post579!Ro2026',  role:'readonly'},
];

let CU = null; // current user

function tryLogin(user, pass) {
  const a = ACCOUNTS.find(x => x.user===user && x.pass===pass);
  if (!a) return false;
  CU = {...a, roleObj: ROLES[a.role]};
  sessionStorage.setItem('p579_admin', JSON.stringify(CU));
  return true;
}

function loadSession() {
  const s = sessionStorage.getItem('p579_admin');
  if (s) { try { CU = JSON.parse(s); CU.roleObj = ROLES[CU.role]; return true; } catch {} }
  return false;
}

function logout() { sessionStorage.removeItem('p579_admin'); CU=null; boot(); }
function can(p) { if (!CU) return false; const ps=CU.roleObj.perms; return ps.includes('all')||ps.includes(p)||ps.includes(p+':read'); }
function isCmd() { return CU?.role==='commander'; }

// ── LOCAL DATABASE ──────────────────────────────────────────────
const TABLES = ['members','events','rentals','donations','messages','volunteers','announcements','gallery','officers','capital_projects','maintenance'];
const DB = {};
TABLES.forEach(t => DB[t]=[]);

function dbLoad() { TABLES.forEach(t => { const s=localStorage.getItem('p579_'+t); if(s) try{DB[t]=JSON.parse(s);}catch{} }); }
function dbSave(t) { localStorage.setItem('p579_'+t, JSON.stringify(DB[t])); }
function uid() { return Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
function ins(t,r) { const row={id:uid(),created_at:new Date().toISOString(),...r}; DB[t].push(row); dbSave(t); return row; }
function upd(t,id,u) { const i=DB[t].findIndex(r=>r.id===id); if(i<0)return null; DB[t][i]={...DB[t][i],...u,updated_at:new Date().toISOString()}; dbSave(t); return DB[t][i]; }
function del(t,id) { if(!isCmd()){alert('Only the Commander can delete records.');return false;} DB[t]=DB[t].filter(r=>r.id!==id); dbSave(t); return true; }
function search(t,q) { if(!q)return DB[t]; const ql=q.toLowerCase(); return DB[t].filter(r=>Object.values(r).some(v=>String(v).toLowerCase().includes(ql))); }

// ── FORMATTERS ──────────────────────────────────────────────────
const f  = v => v||'—';
const fd = d => d ? new Date(d).toLocaleDateString('en-US') : '—';
const fm = n => n ? '$'+parseFloat(n).toLocaleString('en-US',{minimumFractionDigits:2}) : '—';
const SB_MAP = {Active:'status-active',Pending:'status-pending',Expired:'status-expired',
  Approved:'status-approved',Rejected:'status-rejected',Read:'status-read',Unread:'status-unread',
  Published:'status-published',Draft:'status-draft',Pinned:'status-pinned'};
const sb = s => `<span class="status ${SB_MAP[s]||'status-pending'}">${s}</span>`;

// ── MODAL ───────────────────────────────────────────────────────
function modal(title, body, onSave, hideSave=false) {
  document.getElementById('modal-title').textContent=title;
  document.getElementById('modal-body').innerHTML=body;
  const sb=document.getElementById('modal-save');
  sb.onclick=onSave; sb.style.display=hideSave?'none':'inline-flex';
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal() { document.getElementById('modal-overlay').classList.remove('open'); }
const $ = id => document.getElementById(id);
const gv = id => $(id)?.value||'';
const gc = id => $(id)?.checked||false;

// ── ROUTING ─────────────────────────────────────────────────────
let PAGE = 'dashboard';
const TITLES = {dashboard:'Dashboard',members:'Member Management',events:'Event Management',
  rentals:'Hall Rentals',donations:'Donations',gallery:'Photo Gallery',news:'Announcements',
  messages:'Contact Requests',volunteers:'Volunteers',officers:'Officers',settings:'Settings'};

function nav(page) {
  PAGE=page;
  document.querySelectorAll('.sidebar-link').forEach(l=>l.classList.toggle('active',l.dataset.page===page));
  $('topbar-title').textContent=TITLES[page]||page;
  const m=$('page-content');
  const renders={dashboard:renderDashboard,members:renderMembers,events:renderEvents,
    rentals:renderRentals,donations:renderDonations,gallery:renderGallery,
    news:renderNews,messages:renderMessages,volunteers:renderVolunteers,
    officers:renderOfficers,settings:renderSettings,
    projects:renderProjects,maintenance:renderMaintenance};
  m.innerHTML=(renders[page]||renderDashboard)();
  bindEvents(page);
}

// ── SHELL ───────────────────────────────────────────────────────
function showGate() { $('admin-gate').style.display='flex'; $('admin-shell').style.display='none'; }
function showShell() {
  $('admin-gate').style.display='none'; $('admin-shell').style.display='flex';
  $('topbar-user').textContent=CU.user;
  $('topbar-role').className='role-badge '+CU.roleObj.badge;
  $('topbar-role').textContent=CU.roleObj.label;
  nav('dashboard');
}

// ── DASHBOARD ───────────────────────────────────────────────────
function renderDashboard() {
  const am=DB.members.filter(m=>m.status==='Active').length;
  const rd=DB.members.filter(m=>m.status==='Pending').length;
  const um=DB.messages.filter(m=>m.status==='Unread').length;
  const pr=DB.rentals.filter(r=>r.status==='Pending').length;
  const td=DB.donations.reduce((s,d)=>s+parseFloat(d.amount||0),0);
  const ue=DB.events.filter(e=>new Date(e.date)>=new Date()).length;
  return `
  <div class="stat-row">
    <div class="stat-card"><div><div class="num">${DB.members.length}</div><div class="lbl">Total Members</div><div class="stat-trend up">↑ ${am} active</div></div><div class="stat-icon">🎖️</div></div>
    <div class="stat-card red"><div><div class="num">${rd}</div><div class="lbl">Renewals Due</div><div class="stat-trend ${rd>0?'warn':'up'}">${rd>0?'⚠ Action needed':'✓ All current'}</div></div><div class="stat-icon">📅</div></div>
    <div class="stat-card gold"><div><div class="num">${fm(td)}</div><div class="lbl">Total Donations</div><div class="stat-trend up">${DB.donations.length} donors</div></div><div class="stat-icon">💙</div></div>
    <div class="stat-card green"><div><div class="num">${ue}</div><div class="lbl">Upcoming Events</div></div><div class="stat-icon">📆</div></div>
    <div class="stat-card orange"><div><div class="num">${pr}</div><div class="lbl">Rental Requests</div><div class="stat-trend ${pr>0?'warn':'up'}">${pr>0?'Pending':'All resolved'}</div></div><div class="stat-icon">🏛️</div></div>
    <div class="stat-card purple"><div><div class="num">${um}</div><div class="lbl">New Messages</div><div class="stat-trend ${um>0?'warn':'up'}">${um>0?'Unread':'All read'}</div></div><div class="stat-icon">✉️</div></div>
    <div class="stat-card"><div><div class="num">${DB.volunteers.length}</div><div class="lbl">Volunteers</div></div><div class="stat-icon">🤝</div></div>
    <div class="stat-card green"><div><div class="num">${DB.announcements.filter(a=>a.status==='Published').length}</div><div class="lbl">Live Articles</div></div><div class="stat-icon">📰</div></div>
  </div>
  <div class="admin-alert warning">🔒 <strong>Privacy Reminder:</strong> Member rosters are <strong>strictly private</strong>. Never export or share member data outside authorized Post officers. Only the Commander may delete records.</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
    <div class="panel"><h3>Recent Messages</h3>
      ${DB.messages.slice(-5).reverse().map(m=>`<div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;"><div><strong style="font-size:.88rem">${f(m.full_name)}</strong><span style="font-size:.75rem;color:var(--muted);display:block">${f(m.subject)} · ${fd(m.created_at)}</span></div>${sb(m.status||'Unread')}</div>`).join('')||'<div class="empty-state" style="padding:20px"><p>No messages yet.</p></div>'}
      <button onclick="nav('messages')" class="topbar-btn ghost" style="margin-top:12px;font-size:.78rem;">View All →</button>
    </div>
    <div class="panel"><h3>Pending Rentals</h3>
      ${DB.rentals.filter(r=>r.status==='Pending').slice(0,5).map(r=>`<div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;"><div><strong style="font-size:.88rem">${f(r.renter_name)}</strong><span style="font-size:.75rem;color:var(--muted);display:block">${f(r.event_name)} · ${fd(r.event_date)}</span></div><div class="row-actions"><button class="row-btn approve" onclick="appRental('${r.id}')">Approve</button><button class="row-btn reject" onclick="rejRental('${r.id}')">Reject</button></div></div>`).join('')||'<div class="empty-state" style="padding:20px"><p>No pending rentals.</p></div>'}
      <button onclick="nav('rentals')" class="topbar-btn ghost" style="margin-top:12px;font-size:.78rem;">View All →</button>
    </div>
  </div>`;
}

// ── MEMBERS ─────────────────────────────────────────────────────
function renderMembers(q='') {
  const rows=search('members',q);
  const branches=['U.S. Army','U.S. Marine Corps','U.S. Navy','U.S. Air Force','U.S. Coast Guard','U.S. Space Force','National Guard / Reserve'];
  return `<div class="data-table-wrap">
    <div class="data-table-header">
      <h3>Member Roster <span style="color:var(--muted);font-weight:400;font-size:.8rem">(${rows.length})</span></h3>
      <div class="actions">
        <input class="search-input" id="msearch" placeholder="Search members…" value="${q}">
        <button class="topbar-btn primary" onclick="addMember()">+ Add Member</button>
        ${isCmd()?`<button class="topbar-btn ghost" onclick="exportCSV('members')">⬇ CSV</button>`:''}
      </div>
    </div>
    <div class="table-scroll"><table>
      <thead><tr><th>ID</th><th>Name</th><th>Branch</th><th>Phone</th><th>Email</th><th>Join</th><th>Renewal</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${rows.length?rows.map(m=>`<tr>
        <td><strong>${f(m.member_number)}</strong></td>
        <td>${f(m.first_name)} ${f(m.last_name)}</td>
        <td>${f(m.branch)}</td>
        <td>${m.phone?`<a href="tel:${m.phone}">${m.phone}</a>`:'—'}</td>
        <td>${m.email?`<a href="mailto:${m.email}">${m.email}</a>`:'—'}</td>
        <td>${fd(m.join_date)}</td><td>${fd(m.renewal_date)}</td>
        <td>${sb(m.status||'Pending')}</td>
        <td><div class="row-actions"><button class="row-btn edit" onclick="editMember('${m.id}')">Edit</button>${isCmd()?`<button class="row-btn delete" onclick="delRec('members','${m.id}','member')">Del</button>`:''}</div></td>
      </tr>`).join(''):`<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--muted)">No members yet.</td></tr>`}
      </tbody>
    </table></div>
    <div class="table-pagination"><span>${rows.length} member${rows.length!==1?'s':''}</span><span style="color:var(--muted);font-size:.78rem">🔒 Private — never publish online</span></div>
  </div>`;
}

function memberForm(m={}) {
  const next='M'+String(DB.members.length+1).padStart(4,'0');
  const branches=['U.S. Army','U.S. Marine Corps','U.S. Navy','U.S. Air Force','U.S. Coast Guard','U.S. Space Force','National Guard / Reserve'];
  const types=['Regular','Active Duty','Associate','Life'];
  const statuses=['Active','Pending','Expired'];
  return `<div class="form-grid">
    <div class="form-group"><label>Member # *</label><input id="m-num" value="${m.member_number||next}"></div>
    <div class="form-group"><label>Status</label><select id="m-st">${statuses.map(s=>`<option${m.status===s?' selected':''}>${s}</option>`).join('')}</select></div>
    <div class="form-group"><label>First Name *</label><input id="m-fn" value="${m.first_name||''}"></div>
    <div class="form-group"><label>Last Name *</label><input id="m-ln" value="${m.last_name||''}"></div>
    <div class="form-group"><label>Branch</label><select id="m-br">${branches.map(b=>`<option${m.branch===b?' selected':''}>${b}</option>`).join('')}</select></div>
    <div class="form-group"><label>Type</label><select id="m-ty">${types.map(t=>`<option${m.membership_type===t?' selected':''}>${t}</option>`).join('')}</select></div>
    <div class="form-group"><label>Phone</label><input id="m-ph" value="${m.phone||''}" type="tel"></div>
    <div class="form-group"><label>Email</label><input id="m-em" value="${m.email||''}" type="email"></div>
    <div class="form-group"><label>Join Date</label><input id="m-jd" type="date" value="${m.join_date||''}"></div>
    <div class="form-group"><label>Renewal Date</label><input id="m-rd" type="date" value="${m.renewal_date||''}"></div>
    <div class="form-group full"><label>Internal Notes</label><textarea id="m-no" style="height:70px">${m.notes||''}</textarea></div>
  </div>`;
}

function getMemberData() {
  return { member_number:gv('m-num'), first_name:gv('m-fn'), last_name:gv('m-ln'),
    branch:gv('m-br'), membership_type:gv('m-ty'), phone:gv('m-ph'), email:gv('m-em'),
    join_date:gv('m-jd'), renewal_date:gv('m-rd'), status:gv('m-st'), notes:gv('m-no') };
}

function addMember() {
  modal('Add New Member', memberForm(), () => {
    const d=getMemberData();
    if (!d.first_name||!d.last_name){alert('Name required.');return;}
    ins('members',d); closeModal(); nav('members');
  });
}

function editMember(id) {
  const m=DB.members.find(r=>r.id===id); if(!m) return;
  modal('Edit Member', memberForm(m), () => {
    upd('members',id,getMemberData()); closeModal(); nav('members');
  });
}

function exportCSV(table) {
  if (!isCmd()){alert('Only the Commander can export data.');return;}
  const rows=DB[table]; if(!rows.length){alert('No records.');return;}
  const keys=Object.keys(rows[0]);
  const csv=[keys.join(','),...rows.map(r=>keys.map(k=>`"${String(r[k]||'').replace(/"/g,'""')}"`).join(','))].join('\n');
  const a=document.createElement('a');
  a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
  a.download=`post579_${table}_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}

// ── EVENTS ──────────────────────────────────────────────────────
function renderEvents() {
  const rows=DB.events;
  return `<div class="data-table-wrap">
    <div class="data-table-header"><h3>Events (${rows.length})</h3>
      <button class="topbar-btn primary" onclick="addEvent()">+ Create Event</button>
    </div>
    <div class="table-scroll"><table>
      <thead><tr><th>Title</th><th>Type</th><th>Date</th><th>Tickets</th><th>RSVP</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${rows.length?rows.sort((a,b)=>new Date(a.date)-new Date(b.date)).map(ev=>`<tr>
        <td><strong>${f(ev.title)}</strong></td><td>${f(ev.type)}</td><td>${fd(ev.date)} ${f(ev.time)}</td>
        <td>${ev.ticket_price?fm(ev.ticket_price):'Free'}</td><td>${ev.rsvp?'✅':'—'}</td>
        <td>${sb(ev.status||'Draft')}</td>
        <td><div class="row-actions"><button class="row-btn edit" onclick="editEvent('${ev.id}')">Edit</button>
          <button class="row-btn ${ev.status==='Published'?'reject':'approve'}" onclick="togglePub('events','${ev.id}')">${ev.status==='Published'?'Unpublish':'Publish'}</button>
          ${isCmd()?`<button class="row-btn delete" onclick="delRec('events','${ev.id}','event')">Del</button>`:''}</div></td>
      </tr>`).join(''):`<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted)">No events yet.</td></tr>`}
      </tbody>
    </table></div>
  </div>`;
}

function eventForm(ev={}) {
  const types=['General Meeting','Steak Night','Fish Fry','Veterans Day','Memorial Day','Fundraiser','Community Event','Other'];
  return `<div class="form-grid">
    <div class="form-group full"><label>Title *</label><input id="ev-t" value="${ev.title||''}"></div>
    <div class="form-group"><label>Type</label><select id="ev-ty">${types.map(t=>`<option${ev.type===t?' selected':''}>${t}</option>`).join('')}</select></div>
    <div class="form-group"><label>Status</label><select id="ev-st"><option${ev.status==='Draft'?' selected':''}>Draft</option><option${ev.status==='Published'?' selected':''}>Published</option></select></div>
    <div class="form-group"><label>Date</label><input id="ev-d" type="date" value="${ev.date||''}"></div>
    <div class="form-group"><label>Time</label><input id="ev-ti" type="time" value="${ev.time||''}"></div>
    <div class="form-group"><label>Ticket Price (0=Free)</label><input id="ev-p" type="number" step="0.01" min="0" value="${ev.ticket_price||''}"></div>
    <div class="form-group"><label>Capacity</label><input id="ev-c" type="number" value="${ev.capacity||''}"></div>
    <div class="form-group full"><label>Location</label><input id="ev-l" value="${ev.location||'3002 Gunsmoke St, San Antonio TX'}"></div>
    <div class="form-group full" style="flex-direction:row;align-items:center;gap:8px;"><input type="checkbox" id="ev-r" ${ev.rsvp?'checked':''}><label for="ev-r" style="text-transform:none;letter-spacing:0;font-size:.9rem;cursor:pointer">Enable RSVP / Tickets</label></div>
    <div class="form-group full"><label>Description</label><textarea id="ev-de">${ev.description||''}</textarea></div>
  </div>`;
}

function getEventData() {
  return {title:gv('ev-t'),type:gv('ev-ty'),status:gv('ev-st'),date:gv('ev-d'),time:gv('ev-ti'),
    ticket_price:gv('ev-p'),capacity:gv('ev-c'),location:gv('ev-l'),
    rsvp:gc('ev-r'),description:gv('ev-de')};
}

function addEvent() { modal('Create Event',eventForm(),()=>{const d=getEventData();if(!d.title){alert('Title required.');return;}ins('events',d);closeModal();nav('events');}); }
function editEvent(id) { const ev=DB.events.find(r=>r.id===id);if(!ev)return; modal('Edit Event',eventForm(ev),()=>{upd('events',id,getEventData());closeModal();nav('events');}); }

// ── HALL RENTALS ─────────────────────────────────────────────────
function renderRentals() {
  const rows=DB.rentals;
  return `<div class="data-table-wrap">
    <div class="data-table-header"><h3>Hall Rental Requests (${rows.length})</h3>
      ${isCmd()?`<button class="topbar-btn ghost" onclick="exportCSV('rentals')">⬇ CSV</button>`:''}
    </div>
    <div class="table-scroll"><table>
      <thead><tr><th>Customer</th><th>Event</th><th>Requested Date</th><th>Guests</th><th>Contact</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${rows.length?rows.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).map(r=>`<tr>
        <td><strong>${f(r.renter_name)}</strong></td><td>${f(r.event_name)}</td><td>${fd(r.event_date)}</td><td>${f(r.guest_count)}</td>
        <td>${r.renter_phone?`<a href="tel:${r.renter_phone}">${r.renter_phone}</a>`:''}${r.renter_email?`<br><a href="mailto:${r.renter_email}" style="font-size:.8rem">${r.renter_email}</a>`:''}</td>
        <td>${sb(r.status||'Pending')}</td>
        <td><div class="row-actions">
          <button class="row-btn view" onclick="viewRental('${r.id}')">View</button>
          ${r.status!=='Approved'?`<button class="row-btn approve" onclick="appRental('${r.id}')">Approve</button>`:''}
          ${r.status!=='Rejected'?`<button class="row-btn reject" onclick="rejRental('${r.id}')">Reject</button>`:''}
          <button class="row-btn email" onclick="emailRenter('${r.renter_email||''}','${r.renter_name||''}')">Email</button>
          ${isCmd()?`<button class="row-btn delete" onclick="delRec('rentals','${r.id}','rental')">Del</button>`:''}</div></td>
      </tr>`).join(''):`<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted)">No rental requests yet.</td></tr>`}
      </tbody>
    </table></div>
  </div>`;
}

function viewRental(id) {
  const r=DB.rentals.find(x=>x.id===id);if(!r)return;
  modal('Rental: '+f(r.renter_name),`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:.9rem;">
    <div><strong>Customer</strong><br>${f(r.renter_name)}</div><div><strong>Status</strong><br>${sb(r.status||'Pending')}</div>
    <div><strong>Phone</strong><br>${r.renter_phone?`<a href="tel:${r.renter_phone}">${r.renter_phone}</a>`:'—'}</div>
    <div><strong>Email</strong><br>${r.renter_email?`<a href="mailto:${r.renter_email}">${r.renter_email}</a>`:'—'}</div>
    <div><strong>Event</strong><br>${f(r.event_name)}</div><div><strong>Date Needed</strong><br>${fd(r.event_date)}</div>
    <div><strong>Guests</strong><br>${f(r.guest_count)}</div><div><strong>Submitted</strong><br>${fd(r.created_at)}</div>
    ${r.special_requests?`<div style="grid-column:1/-1"><strong>Special Requests</strong><br><p style="background:var(--light);padding:10px;border-radius:6px;margin-top:4px">${r.special_requests}</p></div>`:''}
    <div style="grid-column:1/-1;display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;">
      <button class="row-btn approve" onclick="appRental('${r.id}');closeModal()">✅ Approve</button>
      <button class="row-btn reject" onclick="rejRental('${r.id}');closeModal()">❌ Reject</button>
      <button class="row-btn email" onclick="emailRenter('${r.renter_email||''}','${r.renter_name||''}')">📧 Email</button>
    </div>
  </div>`, ()=>closeModal(), true);
}

function appRental(id) { upd('rentals',id,{status:'Approved'}); if(PAGE==='rentals'||PAGE==='dashboard') nav(PAGE); }
function rejRental(id) { upd('rentals',id,{status:'Rejected'}); if(PAGE==='rentals'||PAGE==='dashboard') nav(PAGE); }
function emailRenter(email,name) { window.location.href=`mailto:${email}?subject=Post 579 Hall Rental&body=Dear ${name},%0D%0A%0D%0AThank you for your inquiry. Please call (210) 674-8069 to confirm your date and arrange the $200 deposit.%0D%0A%0D%0AFor God and Country,%0D%0APost 579`; }

// ── DONATIONS ────────────────────────────────────────────────────
function renderDonations() {
  const rows=DB.donations;
  const total=rows.reduce((s,d)=>s+parseFloat(d.amount||0),0);
  return `<div class="stat-row" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px;">
    <div class="stat-card gold"><div><div class="num">${fm(total)}</div><div class="lbl">Total Received</div></div><div class="stat-icon">💰</div></div>
    <div class="stat-card"><div><div class="num">${rows.length}</div><div class="lbl">Total Donors</div></div><div class="stat-icon">🤝</div></div>
    <div class="stat-card green"><div><div class="num">${rows.length?fm(total/rows.length):'$0'}</div><div class="lbl">Avg Donation</div></div><div class="stat-icon">📊</div></div>
  </div>
  <div class="data-table-wrap">
    <div class="data-table-header"><h3>Donation Log (${rows.length})</h3>
      <div class="actions">
        <button class="topbar-btn primary" onclick="addDonation()">+ Record Donation</button>
        ${isCmd()?`<button class="topbar-btn ghost" onclick="exportCSV('donations')">⬇ CSV</button>`:''}
      </div>
    </div>
    <div class="table-scroll"><table>
      <thead><tr><th>Donor</th><th>Amount</th><th>Campaign</th><th>Method</th><th>Date</th><th>Receipt</th><th>Actions</th></tr></thead>
      <tbody>${rows.length?rows.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).map(d=>`<tr>
        <td><strong>${d.donor_name||'Anonymous'}</strong>${d.donor_email?`<br><span style="font-size:.75rem;color:var(--muted)">${d.donor_email}</span>`:''}</td>
        <td><strong style="color:var(--green)">${fm(d.amount)}</strong></td>
        <td>${f(d.campaign)}</td><td>${f(d.method)}</td><td>${fd(d.created_at)}</td>
        <td><button class="row-btn view" onclick="genReceipt('${d.id}')">Print</button></td>
        <td>${isCmd()?`<button class="row-btn delete" onclick="delRec('donations','${d.id}','donation')">Del</button>`:''}</td>
      </tr>`).join(''):`<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted)">No donations yet.</td></tr>`}
      </tbody>
    </table></div>
  </div>`;
}

function addDonation() {
  modal('Record Donation',`<div class="form-grid">
    <div class="form-group"><label>Donor Name</label><input id="d-n" placeholder="Anonymous if blank"></div>
    <div class="form-group"><label>Amount *</label><input id="d-a" type="number" step="0.01" min="1"></div>
    <div class="form-group"><label>Donor Email</label><input id="d-e" type="email"></div>
    <div class="form-group"><label>Date</label><input id="d-d" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
    <div class="form-group"><label>Campaign</label><select id="d-c"><option>General Fund</option><option>Veterans Assistance</option><option>Youth Programs</option><option>Facility</option><option>Events</option></select></div>
    <div class="form-group"><label>Method</label><select id="d-m"><option>PayPal</option><option>Cash</option><option>Check</option><option>Card</option><option>Other</option></select></div>
    <div class="form-group full"><label>Notes</label><textarea id="d-no" style="height:60px"></textarea></div>
  </div>`,()=>{
    const amt=gv('d-a'); if(!amt||parseFloat(amt)<=0){alert('Amount required.');return;}
    ins('donations',{donor_name:gv('d-n')||'Anonymous',amount:amt,donor_email:gv('d-e'),campaign:gv('d-c'),method:gv('d-m'),notes:gv('d-no')});
    closeModal();nav('donations');
  });
}

function genReceipt(id) {
  const d=DB.donations.find(r=>r.id===id);if(!d)return;
  const w=window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>Donation Receipt</title>
  <style>body{font-family:Arial,sans-serif;max-width:600px;margin:40px auto;padding:30px;border:3px solid #071d41;}
  h1{color:#071d41;font-size:1.2rem}.amt{font-size:2.2rem;color:#16a34a;font-weight:900}.ft{color:#666;font-size:.8rem;margin-top:24px;border-top:1px solid #eee;padding-top:16px}</style></head>
  <body><h1>🇺🇸 American Legion Post 579</h1>
  <p>Bicentennial Post 579 · 3002 Gunsmoke St, San Antonio TX 78227 · (210) 674-8069<br>501(c)(19) Veterans' Organization</p><hr>
  <h2>OFFICIAL DONATION RECEIPT</h2>
  <p><strong>Donor:</strong> ${d.donor_name||'Anonymous'}</p>
  <p><strong>Amount:</strong> <span class="amt">${fm(d.amount)}</span></p>
  <p><strong>Campaign:</strong> ${d.campaign||'General Fund'}</p>
  <p><strong>Date:</strong> ${fd(d.created_at)}</p>
  <p><strong>Method:</strong> ${d.method||'—'}</p>
  <p><strong>Receipt ID:</strong> ${d.id}</p>
  <div class="ft"><p>Thank you for supporting Post 579 veterans programs.<br>Donations may be tax-deductible — consult your tax advisor.</p><p><em>For God and Country</em></p></div>
  <script>window.print();<\/script></body></html>`);
}

// ── MESSAGES ─────────────────────────────────────────────────────
function renderMessages() {
  const rows=DB.messages;
  return `<div class="data-table-wrap">
    <div class="data-table-header"><h3>Messages (${rows.length}) · <span style="color:var(--red)">${rows.filter(r=>r.status==='Unread').length} unread</span></h3></div>
    <div class="table-scroll"><table>
      <thead><tr><th>Name</th><th>Subject</th><th>Phone</th><th>Email</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${rows.length?rows.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).map(m=>`
      <tr style="${m.status==='Unread'?'font-weight:700':''}" id="msg-${m.id}">
        <td>${f(m.full_name)}</td><td>${f(m.subject)}</td>
        <td>${m.phone?`<a href="tel:${m.phone}">${m.phone}</a>`:'—'}</td>
        <td>${m.email?`<a href="mailto:${m.email}">${m.email}</a>`:'—'}</td>
        <td>${fd(m.created_at)}</td><td>${sb(m.status||'Unread')}</td>
        <td><div class="row-actions">
          <button class="row-btn view" onclick="viewMsg('${m.id}')">View</button>
          <button class="row-btn email" onclick="window.location.href='mailto:${m.email||''}?subject=Re: Post 579&body=Dear ${m.full_name||''},''">Reply</button>
          ${m.status!=='Read'?`<button class="row-btn edit" onclick="upd('messages','${m.id}',{status:'Read'});nav('messages')">Mark Read</button>`:''}
          ${isCmd()?`<button class="row-btn delete" onclick="delRec('messages','${m.id}','message')">Del</button>`:''}</div></td>
      </tr>`).join(''):`<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted)">No messages yet.</td></tr>`}
      </tbody>
    </table></div>
  </div>`;
}

function viewMsg(id) {
  const m=DB.messages.find(r=>r.id===id);if(!m)return;
  upd('messages',id,{status:'Read'});
  modal('Message from '+f(m.full_name),`<div style="font-size:.9rem;display:grid;gap:10px;">
    <div><strong>From:</strong> ${f(m.full_name)}</div>
    <div><strong>Email:</strong> ${m.email?`<a href="mailto:${m.email}">${m.email}</a>`:'—'}</div>
    <div><strong>Phone:</strong> ${m.phone?`<a href="tel:${m.phone}">${m.phone}</a>`:'—'}</div>
    <div><strong>Subject:</strong> ${f(m.subject)}</div>
    <div><strong>Received:</strong> ${fd(m.created_at)}</div>
    <div style="background:var(--light);padding:14px;border-radius:8px;line-height:1.7">${f(m.message)}</div>
    <button class="row-btn email" onclick="window.location.href='mailto:${m.email||''}?subject=Re: Post 579 Message&body=Dear ${m.full_name||''},''">📧 Reply</button>
  </div>`,()=>closeModal(),true);
}

// ── NEWS / ANNOUNCEMENTS ─────────────────────────────────────────
function renderNews() {
  const rows=DB.announcements;
  return `<div class="data-table-wrap">
    <div class="data-table-header"><h3>Announcements (${rows.length})</h3>
      <button class="topbar-btn primary" onclick="addNews()">+ New Article</button>
    </div>
    <div class="table-scroll"><table>
      <thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Pinned</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${rows.length?rows.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).map(a=>`<tr>
        <td><strong>${f(a.title)}</strong></td><td>${f(a.category)}</td><td>${f(a.author)}</td>
        <td>${a.pinned?'📌':'—'}</td><td>${fd(a.created_at)}</td>
        <td>${sb(a.status||'Draft')}</td>
        <td><div class="row-actions">
          <button class="row-btn edit" onclick="editNews('${a.id}')">Edit</button>
          <button class="row-btn ${a.status==='Published'?'reject':'approve'}" onclick="togglePub('announcements','${a.id}')">${a.status==='Published'?'Unpublish':'Publish'}</button>
          ${isCmd()?`<button class="row-btn delete" onclick="delRec('announcements','${a.id}','article')">Del</button>`:''}</div></td>
      </tr>`).join(''):`<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted)">No articles yet.</td></tr>`}
      </tbody>
    </table></div>
  </div>`;
}

function newsForm(a={}) {
  const cats=['Announcement','News','Event Recap','Community','Veterans'];
  return `<div class="form-grid">
    <div class="form-group full"><label>Headline *</label><input id="an-t" value="${a.title||''}"></div>
    <div class="form-group"><label>Category</label><select id="an-c">${cats.map(c=>`<option${a.category===c?' selected':''}>${c}</option>`).join('')}</select></div>
    <div class="form-group"><label>Author</label><input id="an-a" value="${a.author||'Post 579 Staff'}"></div>
    <div class="form-group"><label>Status</label><select id="an-s"><option${!a.status||a.status==='Draft'?' selected':''}>Draft</option><option${a.status==='Published'?' selected':''}>Published</option></select></div>
    <div class="form-group full" style="flex-direction:row;align-items:center;gap:8px;"><input type="checkbox" id="an-p" ${a.pinned?'checked':''}><label for="an-p" style="text-transform:none;letter-spacing:0;font-size:.9rem;cursor:pointer">📌 Pin to top</label></div>
    <div class="form-group full"><label>Body *</label><textarea id="an-b" style="height:180px">${a.body||''}</textarea></div>
  </div>`;
}

function addNews() { modal('New Article',newsForm(),()=>{const t=gv('an-t'),b=gv('an-b');if(!t||!b){alert('Title and body required.');return;}ins('announcements',{title:t,body:b,category:gv('an-c'),author:gv('an-a'),status:gv('an-s'),pinned:gc('an-p')});closeModal();nav('news');}); }
function editNews(id) { const a=DB.announcements.find(r=>r.id===id);if(!a)return;modal('Edit Article',newsForm(a),()=>{upd('announcements',id,{title:gv('an-t'),body:gv('an-b'),category:gv('an-c'),author:gv('an-a'),status:gv('an-s'),pinned:gc('an-p')});closeModal();nav('news');}); }

// ── GALLERY ──────────────────────────────────────────────────────
function renderGallery() {
  const rows=DB.gallery;
  const albums=['Veterans Day','Memorial Day','Community Service','Hall Events','Member Activities','General'];
  return `<div class="panel"><h3>Upload Photo</h3>
    <div class="form-grid">
      <div class="form-group"><label>Caption</label><input id="g-cap" placeholder="Brief description"></div>
      <div class="form-group"><label>Album</label><select id="g-alb">${albums.map(a=>`<option>${a}</option>`).join('')}</select></div>
      <div class="form-group"><label>Photo URL</label><input id="g-url" type="url" placeholder="https://…"></div>
      <div class="form-group"><label>Date Taken</label><input id="g-dt" type="date"></div>
      <div class="form-group full" style="flex-direction:row;align-items:center;gap:8px;"><input type="checkbox" id="g-app" checked><label for="g-app" style="text-transform:none;letter-spacing:0;font-size:.9rem;cursor:pointer">✅ Approved for public display (confirm member consent first)</label></div>
    </div>
    <button class="topbar-btn primary" style="margin-top:12px" onclick="addPhoto()">Save Photo</button>
  </div>
  <div class="admin-alert warning">⚠️ <strong>Consent required.</strong> Never publish photos of members without explicit consent.</div>
  <div class="data-table-wrap"><div class="data-table-header"><h3>Photo Library (${rows.length})</h3></div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;padding:14px;">
    ${rows.length?rows.map(p=>`<div style="position:relative;aspect-ratio:1;background:var(--light);border-radius:8px;overflow:hidden;border:1px solid var(--border);">
      ${p.url?`<img src="${p.url}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'">`:
      `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem;color:var(--muted)">📷</div>`}
      <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.7);padding:6px 8px;">
        <div style="font-size:.65rem;color:#fff;line-height:1.3">${p.caption||'No caption'}</div>
        <div style="font-size:.6rem;color:rgba(255,255,255,.5)">${p.album}</div>
        ${isCmd()?`<button class="row-btn delete" onclick="delRec('gallery','${p.id}','photo');nav('gallery')" style="font-size:.6rem;margin-top:2px;padding:2px 6px">Del</button>`:''}
      </div>
      ${!p.approved?`<div style="position:absolute;top:4px;right:4px;background:var(--red);color:#fff;font-size:.6rem;padding:1px 5px;border-radius:3px;font-weight:bold">PENDING</div>`:''}
    </div>`).join(''):`<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted)">No photos yet. Upload real Post 579 photos above. Target: 50–100 photos.</div>`}
  </div></div>`;
}

function addPhoto() {
  const url=gv('g-url');
  ins('gallery',{caption:gv('g-cap'),album:gv('g-alb'),url,date_taken:gv('g-dt'),approved:gc('g-app')});
  nav('gallery');
}

// ── VOLUNTEERS ───────────────────────────────────────────────────
function renderVolunteers() {
  const rows=DB.volunteers;
  return `<div class="data-table-wrap">
    <div class="data-table-header"><h3>Volunteers (${rows.length})</h3>
      <div class="actions"><button class="topbar-btn primary" onclick="addVolunteer()">+ Add Volunteer</button>
        ${isCmd()?`<button class="topbar-btn ghost" onclick="exportCSV('volunteers')">⬇ CSV</button>`:''}
      </div>
    </div>
    <div class="table-scroll"><table>
      <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Interests</th><th>Availability</th><th>Joined</th><th>Actions</th></tr></thead>
      <tbody>${rows.length?rows.map(v=>`<tr>
        <td><strong>${f(v.full_name)}</strong></td>
        <td>${v.phone?`<a href="tel:${v.phone}">${v.phone}</a>`:'—'}</td>
        <td>${v.email?`<a href="mailto:${v.email}">${v.email}</a>`:'—'}</td>
        <td>${f(v.interests)}</td><td>${f(v.availability)}</td><td>${fd(v.created_at)}</td>
        <td><div class="row-actions">
          <button class="row-btn email" onclick="window.location.href='mailto:${v.email||''}?subject=Post 579 Volunteer Opportunity'">Email</button>
          ${isCmd()?`<button class="row-btn delete" onclick="delRec('volunteers','${v.id}','volunteer')">Del</button>`:''}</div></td>
      </tr>`).join(''):`<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted)">No volunteers.</td></tr>`}
      </tbody>
    </table></div>
  </div>`;
}

function addVolunteer() {
  modal('Add Volunteer',`<div class="form-grid">
    <div class="form-group"><label>Full Name *</label><input id="v-n"></div>
    <div class="form-group"><label>Phone</label><input id="v-p" type="tel"></div>
    <div class="form-group full"><label>Email</label><input id="v-e" type="email"></div>
    <div class="form-group full"><label>Interests</label><input id="v-i" placeholder="e.g. Events, Veterans assistance, Color Guard"></div>
    <div class="form-group full"><label>Availability</label><input id="v-a" placeholder="e.g. Weekends, Weekday evenings"></div>
  </div>`,()=>{ const n=gv('v-n');if(!n){alert('Name required.');return;} ins('volunteers',{full_name:n,phone:gv('v-p'),email:gv('v-e'),interests:gv('v-i'),availability:gv('v-a')});closeModal();nav('volunteers');});
}

// ── OFFICERS ─────────────────────────────────────────────────────
function renderOfficers() {
  const rows=DB.officers;
  const pos=['Commander','1st Vice Commander','2nd Vice Commander','Adjutant','Finance Officer','Service Officer','Chaplain','Sergeant-at-Arms','Historian'];
  return `<div class="admin-alert warning">⚠️ Only publish info with explicit officer consent. Never post personal addresses or private contact data without approval.</div>
  <div class="data-table-wrap">
    <div class="data-table-header"><h3>Officers (${rows.length})</h3><button class="topbar-btn primary" onclick="addOfficer()">+ Add Officer</button></div>
    <div class="table-scroll"><table>
      <thead><tr><th>Position</th><th>Name</th><th>Phone</th><th>Email</th><th>Published</th><th>Actions</th></tr></thead>
      <tbody>${rows.length?rows.map(o=>`<tr>
        <td><strong>${f(o.title)}</strong></td><td>${f(o.name)}</td>
        <td>${o.phone?`<a href="tel:${o.phone}">${o.phone}</a>`:'—'}</td>
        <td>${o.email?`<a href="mailto:${o.email}">${o.email}</a>`:'—'}</td>
        <td>${o.published?'✅ Live':'⬜ Draft'}</td>
        <td><div class="row-actions">
          <button class="row-btn edit" onclick="editOfficer('${o.id}')">Edit</button>
          <button class="row-btn ${o.published?'reject':'approve'}" onclick="upd('officers','${o.id}',{published:${!o.published}});nav('officers')">${o.published?'Unpublish':'Publish'}</button>
          ${isCmd()?`<button class="row-btn delete" onclick="delRec('officers','${o.id}','officer')">Del</button>`:''}</div></td>
      </tr>`).join(''):pos.slice(0,3).map(p=>`<tr style="opacity:.4"><td>${p}</td><td colspan="5" style="color:var(--muted);font-size:.82rem">Not added yet — click Add Officer</td></tr>`).join('')}
      </tbody>
    </table></div>
  </div>`;
}

function officerForm(o={}) {
  const pos=['Commander','1st Vice Commander','2nd Vice Commander','Adjutant','Finance Officer','Service Officer','Chaplain','Sergeant-at-Arms','Historian','Judge Advocate'];
  return `<div class="form-grid">
    <div class="form-group"><label>Position *</label><select id="o-t">${pos.map(p=>`<option${o.title===p?' selected':''}>${p}</option>`).join('')}</select></div>
    <div class="form-group"><label>Full Name *</label><input id="o-n" value="${o.name||''}"></div>
    <div class="form-group"><label>Phone (if approved)</label><input id="o-p" value="${o.phone||''}" type="tel"></div>
    <div class="form-group"><label>Email (if approved)</label><input id="o-e" value="${o.email||''}" type="email"></div>
    <div class="form-group full"><label>Photo URL</label><input id="o-ph" type="url" value="${o.photo_url||''}"></div>
    <div class="form-group full"><label>Bio (2–3 sentences)</label><textarea id="o-b">${o.bio||''}</textarea></div>
    <div class="form-group full" style="flex-direction:row;align-items:center;gap:8px;"><input type="checkbox" id="o-pub" ${o.published?'checked':''}><label for="o-pub" style="text-transform:none;letter-spacing:0;font-size:.9rem;cursor:pointer">Publish on public Leadership page (requires officer consent)</label></div>
  </div>`;
}

function addOfficer() { modal('Add Officer',officerForm(),()=>{ const n=gv('o-n');if(!n){alert('Name required.');return;} ins('officers',{title:gv('o-t'),name:n,phone:gv('o-p'),email:gv('o-e'),photo_url:gv('o-ph'),bio:gv('o-b'),published:gc('o-pub')});closeModal();nav('officers');}); }
function editOfficer(id) { const o=DB.officers.find(r=>r.id===id);if(!o)return;modal('Edit Officer',officerForm(o),()=>{upd('officers',id,{name:gv('o-n'),phone:gv('o-p'),email:gv('o-e'),photo_url:gv('o-ph'),bio:gv('o-b'),published:gc('o-pub')});closeModal();nav('officers');}); }

// ── SETTINGS ──────────────────────────────────────────────────────
function renderSettings() {
  return `<div class="admin-alert info">ℹ️ Connect live Supabase DB, PayPal, and email automation — contact TM Designs to activate production backend.</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
    <div class="panel"><h3>Post Information</h3>
      <div class="form-group" style="margin-bottom:12px"><label>Post Name</label><input value="American Legion Bicentennial Post 579"></div>
      <div class="form-group" style="margin-bottom:12px"><label>Commander Name</label><input placeholder="Enter Commander's full name"></div>
      <div class="form-group" style="margin-bottom:12px"><label>Address</label><input value="3002 Gunsmoke Street, San Antonio TX 78227"></div>
      <div class="form-group" style="margin-bottom:12px"><label>Phone</label><input value="(210) 674-8069"></div>
      <div class="form-group" style="margin-bottom:12px"><label>Email</label><input value="commander@post579sa.org"></div>
      <button class="topbar-btn primary" onclick="alert('Settings saved. Contact TM Designs to push to production.')">Save</button>
    </div>
    <div class="panel"><h3>Integrations</h3>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="padding:12px;background:var(--light);border-radius:8px;border-left:4px solid var(--gold)">
          <strong>💳 PayPal Payments</strong><p style="font-size:.82rem;color:#666;margin:4px 0">Commander's PayPal email for donations and tickets.</p>
          <input placeholder="paypal@email.com" style="padding:8px;border:1px solid var(--border);border-radius:5px;width:100%;font-size:.85rem;margin-top:4px">
        </div>
        <div style="padding:12px;background:var(--light);border-radius:8px;border-left:4px solid #1877F2">
          <strong>📘 Facebook Page URL</strong>
          <input placeholder="https://facebook.com/post579sa" style="padding:8px;border:1px solid var(--border);border-radius:5px;width:100%;font-size:.85rem;margin-top:8px">
        </div>
        <div style="padding:12px;background:var(--light);border-radius:8px;border-left:4px solid var(--green)">
          <strong>📊 Google Analytics ID</strong>
          <input placeholder="G-XXXXXXXXXX" style="padding:8px;border:1px solid var(--border);border-radius:5px;width:100%;font-size:.85rem;margin-top:8px">
        </div>
      </div>
    </div>
    <div class="panel"><h3>Hall Rental Pricing</h3>
      <div class="form-grid">
        <div class="form-group"><label>Security Deposit ($)</label><input type="number" value="200"></div>
        <div class="form-group"><label>Hourly Rate ($)</label><input type="number" placeholder="75"></div>
        <div class="form-group"><label>Full Day Rate ($)</label><input type="number" placeholder="500"></div>
        <div class="form-group"><label>Cleaning Fee ($)</label><input type="number" placeholder="100"></div>
      </div>
      <button class="topbar-btn primary" onclick="alert('Pricing saved.')">Save Pricing</button>
    </div>
    <div class="panel"><h3>User Access</h3>
      ${isCmd()?`<p style="font-size:.85rem;color:#666;margin-bottom:12px">Role permissions for all officer accounts.</p>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${Object.entries(ROLES).map(([k,r])=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--light);border-radius:6px;font-size:.85rem"><span>${r.label}</span><span class="role-badge ${r.badge}">${r.label}</span></div>`).join('')}
      </div>
      <p style="font-size:.78rem;color:var(--muted);margin-top:10px">Contact TM Designs to update passwords or add officers.</p>`
      :`<div class="admin-alert danger">Commander access required.</div>`}
    </div>
  </div>`;
}

// ── SHARED UTILS ──────────────────────────────────────────────────
function togglePub(t,id) { const r=DB[t].find(x=>x.id===id);if(!r)return;upd(t,id,{status:r.status==='Published'?'Draft':'Published'});nav(PAGE); }
function delRec(t,id,label) { if(!isCmd()){alert('Only the Commander can delete records.');return;} if(confirm('Permanently DELETE this '+label+'? Cannot be undone.')){del(t,id);nav(PAGE);} }
function bindEvents(page) {
  if(page==='members'){
    const si=$('msearch'); if(si) si.addEventListener('input',()=>{$('page-content').innerHTML=renderMembers(si.value);bindEvents('members');});
  }
}


// ── CAPITAL PROJECTS ─────────────────────────────────────────────
function renderProjects() {
  const rows=DB.capital_projects||[];
  const totalBudget=rows.reduce((s,p)=>s+parseFloat(p.approved_budget||p.estimated_cost||0),0);
  const totalActual=rows.reduce((s,p)=>s+parseFloat(p.actual_cost||0),0);
  const active=rows.filter(p=>['proposed','approved','in-progress'].includes(p.status)).length;
  return `<div class="stat-row" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px;">
    <div class="stat-card"><div><div class="num">${rows.length}</div><div class="lbl">Total Projects</div></div><div class="stat-icon">🏗️</div></div>
    <div class="stat-card gold"><div><div class="num">${fm(totalBudget)}</div><div class="lbl">Total Approved Budget</div></div><div class="stat-icon">💰</div></div>
    <div class="stat-card green"><div><div class="num">${fm(totalActual)}</div><div class="lbl">Total Spent</div></div><div class="stat-icon">✅</div></div>
    <div class="stat-card orange"><div><div class="num">${active}</div><div class="lbl">Active Projects</div></div><div class="stat-icon">⚙️</div></div>
  </div>
  <div class="data-table-wrap">
    <div class="data-table-header">
      <h3>Capital Improvement Projects (${rows.length})</h3>
      <div class="actions">
        <button class="topbar-btn primary" onclick="addProject()">+ Add Project</button>
        ${isCmd()?`<button class="topbar-btn ghost" onclick="exportCSV('capital_projects')">⬇ CSV</button>`:''}
      </div>
    </div>
    <div class="table-scroll"><table>
      <thead><tr><th>Project</th><th>Category</th><th>Est. Cost</th><th>Budget</th><th>Actual</th><th>Vendor</th><th>Target Date</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${rows.length?rows.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).map(p=>`<tr>
          <td><strong>${f(p.project_name)}</strong>${p.sponsor?`<br><span style="font-size:.75rem;color:var(--muted)">Sponsor: ${p.sponsor}</span>`:''}</td>
          <td>${f(p.category)}</td>
          <td>${fm(p.estimated_cost)}</td>
          <td style="color:#8B6914;font-weight:700">${fm(p.approved_budget)}</td>
          <td style="color:var(--green);font-weight:700">${p.actual_cost?fm(p.actual_cost):'—'}</td>
          <td>${f(p.vendor)}</td>
          <td>${p.target_completion?fd(p.target_completion):'—'}</td>
          <td>${sb(p.status==='in-progress'?'Active':p.status.charAt(0).toUpperCase()+p.status.slice(1))}</td>
          <td><div class="row-actions">
            <button class="row-btn edit" onclick="editProject('${p.id}')">Edit</button>
            ${isCmd()?`<button class="row-btn delete" onclick="delRec('capital_projects','${p.id}','project')">Del</button>`:''}
          </div></td>
        </tr>`).join(''):`<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--muted)">No projects yet.</td></tr>`}
      </tbody>
    </table></div>
  </div>`;
}

function projectForm(p={}) {
  const cats=['Facilities','Audio/Visual','Kitchen','Parking','Landscaping','Safety','Technology','Other'];
  const statuses=['proposed','approved','in-progress','completed','cancelled'];
  return `<div class="form-grid">
    <div class="form-group full"><label>Project Name *</label><input id="p-name" value="${p.project_name||''}"></div>
    <div class="form-group"><label>Category</label><select id="p-cat">${cats.map(c=>`<option${p.category===c?' selected':''}>${c}</option>`).join('')}</select></div>
    <div class="form-group"><label>Status</label><select id="p-st">${statuses.map(s=>`<option value="${s}"${p.status===s?' selected':''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`).join('')}</select></div>
    <div class="form-group"><label>Estimated Cost ($)</label><input id="p-ec" type="number" step="0.01" min="0" value="${p.estimated_cost||''}"></div>
    <div class="form-group"><label>Approved Budget ($)</label><input id="p-ab" type="number" step="0.01" min="0" value="${p.approved_budget||''}"></div>
    <div class="form-group"><label>Actual Cost ($)</label><input id="p-ac" type="number" step="0.01" min="0" value="${p.actual_cost||''}"></div>
    <div class="form-group"><label>Sponsor</label><input id="p-sp" value="${p.sponsor||''}"></div>
    <div class="form-group"><label>Vendor</label><input id="p-vn" value="${p.vendor||'TBD'}"></div>
    <div class="form-group"><label>Start Date</label><input id="p-sd" type="date" value="${p.start_date||''}"></div>
    <div class="form-group"><label>Target Completion</label><input id="p-td" type="date" value="${p.target_completion||''}"></div>
    <div class="form-group full"><label>Description</label><textarea id="p-de">${p.description||''}</textarea></div>
    <div class="form-group full"><label>Notes</label><textarea id="p-no" style="height:70px">${p.notes||''}</textarea></div>
  </div>`;
}

function getProjectData(){return{project_name:gv('p-name'),category:gv('p-cat'),status:gv('p-st'),estimated_cost:gv('p-ec'),approved_budget:gv('p-ab'),actual_cost:gv('p-ac'),sponsor:gv('p-sp'),vendor:gv('p-vn'),start_date:gv('p-sd'),target_completion:gv('p-td'),description:gv('p-de'),notes:gv('p-no')};}

function addProject(){
  modal('Add Capital Project',projectForm(),()=>{
    const d=getProjectData();if(!d.project_name){alert('Project name required.');return;}
    if(!DB.capital_projects)DB.capital_projects=[];
    ins('capital_projects',d);closeModal();nav('projects');
  });
}
function editProject(id){
  if(!DB.capital_projects)DB.capital_projects=[];
  const p=DB.capital_projects.find(r=>r.id===id);if(!p)return;
  modal('Edit Project',projectForm(p),()=>{upd('capital_projects',id,getProjectData());closeModal();nav('projects');});
}

// ── MAINTENANCE ───────────────────────────────────────────────────
function renderMaintenance(){
  if(!DB.maintenance)DB.maintenance=[];
  const rows=DB.maintenance;
  const open=rows.filter(r=>r.status==='Open').length;
  const urgent=rows.filter(r=>r.priority==='Urgent').length;
  return `<div class="stat-row" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px;">
    <div class="stat-card red"><div><div class="num">${open}</div><div class="lbl">Open Requests</div></div><div class="stat-icon">🔧</div></div>
    <div class="stat-card orange"><div><div class="num">${urgent}</div><div class="lbl">Urgent</div></div><div class="stat-icon">⚠️</div></div>
    <div class="stat-card green"><div><div class="num">${rows.filter(r=>r.status==='Resolved').length}</div><div class="lbl">Resolved</div></div><div class="stat-icon">✅</div></div>
  </div>
  <div class="data-table-wrap">
    <div class="data-table-header">
      <h3>Maintenance Requests (${rows.length})</h3>
      <button class="topbar-btn primary" onclick="addMaintenance()">+ New Request</button>
    </div>
    <div class="table-scroll"><table>
      <thead><tr><th>Title</th><th>Location</th><th>Priority</th><th>Reported By</th><th>Assigned To</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${rows.length?rows.sort((a,b)=>{const po={Urgent:0,High:1,Normal:2,Low:3};return (po[a.priority]||99)-(po[b.priority]||99);}).map(r=>`<tr>
        <td><strong>${f(r.title)}</strong>${r.description?`<br><span style="font-size:.75rem;color:var(--muted)">${r.description.slice(0,60)}${r.description.length>60?'…':''}</span>`:''}</td>
        <td>${f(r.location)}</td>
        <td><span style="font-weight:bold;color:${r.priority==='Urgent'?'var(--red)':r.priority==='High'?'var(--orange)':'var(--navy)'}">${f(r.priority)}</span></td>
        <td>${f(r.reported_by)}</td>
        <td>${f(r.assigned_to)}</td>
        <td>${fd(r.created_at)}</td>
        <td>${sb(r.status||'Open')}</td>
        <td><div class="row-actions">
          <button class="row-btn edit" onclick="editMaintenance('${r.id}')">Edit</button>
          ${r.status!=='Resolved'?`<button class="row-btn approve" onclick="upd('maintenance','${r.id}',{status:'Resolved',resolved_at:new Date().toISOString().slice(0,10)});nav('maintenance')">Resolve</button>`:''}
          ${isCmd()?`<button class="row-btn delete" onclick="delRec('maintenance','${r.id}','request')">Del</button>`:''}
        </div></td>
      </tr>`).join(''):`<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--muted)">No maintenance requests. All clear! ✅</td></tr>`}
      </tbody>
    </table></div>
  </div>`;
}

function maintForm(m={}){
  const priorities=['Urgent','High','Normal','Low'];
  const statuses=['Open','In Progress','Resolved'];
  return `<div class="form-grid">
    <div class="form-group full"><label>Issue Title *</label><input id="m2-t" value="${m.title||''}"></div>
    <div class="form-group"><label>Location in Building</label><input id="m2-l" value="${m.location||''}" placeholder="e.g. Main Hall, Kitchen, Parking Lot"></div>
    <div class="form-group"><label>Priority</label><select id="m2-p">${priorities.map(p=>`<option${m.priority===p?' selected':''}>${p}</option>`).join('')}</select></div>
    <div class="form-group"><label>Reported By</label><input id="m2-rb" value="${m.reported_by||''}"></div>
    <div class="form-group"><label>Assigned To</label><input id="m2-at" value="${m.assigned_to||''}"></div>
    <div class="form-group"><label>Status</label><select id="m2-s">${statuses.map(s=>`<option${m.status===s?' selected':''}>${s}</option>`).join('')}</select></div>
    <div class="form-group full"><label>Description</label><textarea id="m2-d">${m.description||''}</textarea></div>
    <div class="form-group full"><label>Notes</label><textarea id="m2-no" style="height:70px">${m.notes||''}</textarea></div>
  </div>`;
}

function addMaintenance(){modal('New Maintenance Request',maintForm(),()=>{const t=gv('m2-t');if(!t){alert('Title required.');return;}if(!DB.maintenance)DB.maintenance=[];ins('maintenance',{title:t,location:gv('m2-l'),priority:gv('m2-p'),reported_by:gv('m2-rb'),assigned_to:gv('m2-at'),status:gv('m2-s'),description:gv('m2-d'),notes:gv('m2-no')});closeModal();nav('maintenance');});}
function editMaintenance(id){if(!DB.maintenance)DB.maintenance=[];const m=DB.maintenance.find(r=>r.id===id);if(!m)return;modal('Edit Request',maintForm(m),()=>{upd('maintenance',id,{title:gv('m2-t'),location:gv('m2-l'),priority:gv('m2-p'),reported_by:gv('m2-rb'),assigned_to:gv('m2-at'),status:gv('m2-s'),description:gv('m2-d'),notes:gv('m2-no')});closeModal();nav('maintenance');});}


// ── INIT ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  dbLoad();

  // Seed TV Upgrade project on first load
  if (!DB.capital_projects || DB.capital_projects.length === 0) {
    if (!DB.capital_projects) DB.capital_projects = [];
    const seed = {
      id: 'tv-upgrade-seed-001',
      project_name: 'Large Screen Display TV Upgrade',
      category: 'Facilities',
      description: '98 inch TCL primary display, 85 inch secondary display, professional mounts, installation and complete cabling.',
      estimated_cost: 4060,
      approved_budget: 4060,
      actual_cost: 0,
      status: 'approved',
      sponsor: '',
      vendor: 'TBD',
      start_date: '',
      target_completion: '',
      completed_date: null,
      notes: 'Commander approved. Vendor selection in progress. 30-day target for installation.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    DB.capital_projects.push(seed);
    dbSave('capital_projects');
  }

  loadSession() ? showShell() : showGate();

  $('login-form').addEventListener('submit',e=>{
    e.preventDefault();
    const u=$('login-user').value.trim().toLowerCase();
    const p=$('login-pass').value;
    if(tryLogin(u,p)){showShell();}
    else{$('login-error').textContent='Invalid credentials. Contact the Post Adjutant.';$('login-error').style.display='block';}
  });

  $('modal-cancel').onclick=closeModal;
  $('modal-overlay').addEventListener('click',e=>{if(e.target===$('modal-overlay'))closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
});
