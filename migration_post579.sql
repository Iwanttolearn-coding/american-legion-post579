-- ============================================================
-- AMERICAN LEGION BICENTENNIAL POST 579
-- FULL SUPABASE DATABASE SCHEMA
-- All tables for the complete website
-- ============================================================

-- ── MEMBERS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS members (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),

  -- Identity
  full_name        TEXT NOT NULL,
  email            TEXT UNIQUE,
  phone            TEXT,
  birth_date       DATE,

  -- Address
  address          TEXT,
  city             TEXT,
  state            TEXT DEFAULT 'TX',
  zip_code         TEXT,

  -- Military Service
  military_branch  TEXT,
  war_era          TEXT,
  rank             TEXT,
  service_number   TEXT,
  entry_date       DATE,
  discharge_date   DATE,
  discharge_type   TEXT DEFAULT 'Honorable',
  dd214_on_file    BOOLEAN DEFAULT FALSE,

  -- Membership
  member_id        TEXT UNIQUE,
  member_type      TEXT DEFAULT 'Regular' CHECK (member_type IN ('Regular','Associate','Auxiliary','Honorary','Life')),
  status           TEXT DEFAULT 'Pending' CHECK (status IN ('Active','Pending','Lapsed','Deceased','Transferred')),
  join_date        DATE,
  expiry_date      DATE,
  dues_paid        BOOLEAN DEFAULT FALSE,
  dues_amount      NUMERIC(8,2),

  -- Post info
  previous_member  BOOLEAN DEFAULT FALSE,
  previous_post    TEXT,
  referral         TEXT,

  -- Admin
  commander_notes  TEXT,
  emergency_name   TEXT,
  emergency_phone  TEXT,
  avatar_url       TEXT,

  CONSTRAINT members_branch_check CHECK (
    military_branch IN (
      'U.S. Army','U.S. Marine Corps','U.S. Navy',
      'U.S. Air Force','U.S. Coast Guard','U.S. Space Force',
      'National Guard','Reserve','Multiple Branches'
    )
  )
);

-- ── OFFICERS / LEADERSHIP ───────────────────────────────────
CREATE TABLE IF NOT EXISTS officers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  full_name    TEXT NOT NULL,
  title        TEXT NOT NULL,   -- Commander, Adjutant, etc.
  rank         TEXT,
  branch       TEXT,
  phone        TEXT,
  email        TEXT,
  bio          TEXT,
  photo_url    TEXT,
  sort_order   INT DEFAULT 0,
  is_active    BOOLEAN DEFAULT TRUE
);

-- ── EVENTS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  title          TEXT NOT NULL,
  description    TEXT,
  event_type     TEXT DEFAULT 'General' CHECK (event_type IN (
    'Steak Night','Fish Fry','Meeting','Ceremony',
    'Fundraiser','Banquet','Community','Youth','Other'
  )),
  event_date     DATE NOT NULL,
  start_time     TIME,
  end_time       TIME,
  location       TEXT DEFAULT '3002 Gunsmoke Street, San Antonio TX 78227',
  ticket_price   NUMERIC(8,2) DEFAULT 0,
  capacity       INT,
  tickets_sold   INT DEFAULT 0,
  is_ticketed    BOOLEAN DEFAULT FALSE,
  is_public      BOOLEAN DEFAULT TRUE,
  image_url      TEXT,
  status         TEXT DEFAULT 'Upcoming' CHECK (status IN ('Upcoming','Active','Cancelled','Completed')),
  paypal_item_id TEXT
);

-- ── TICKETS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tickets (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  event_id       UUID REFERENCES events(id),
  buyer_name     TEXT NOT NULL,
  buyer_email    TEXT NOT NULL,
  buyer_phone    TEXT,
  quantity       INT DEFAULT 1,
  unit_price     NUMERIC(8,2),
  total_amount   NUMERIC(8,2),
  paypal_order_id TEXT,
  payment_status  TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Pending','Paid','Refunded','Cancelled')),
  confirmation_code TEXT UNIQUE DEFAULT SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)
);

-- ── DONATIONS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  donor_name      TEXT,
  donor_email     TEXT,
  donor_phone     TEXT,
  amount          NUMERIC(10,2) NOT NULL,
  donation_type   TEXT DEFAULT 'General' CHECK (donation_type IN (
    'General','Veterans Fund','Youth Program',
    'Memorial','Building Fund','Scholarship','Sponsor'
  )),
  message         TEXT,
  is_anonymous    BOOLEAN DEFAULT FALSE,
  paypal_order_id TEXT,
  payment_status  TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Pending','Completed','Refunded','Failed')),
  receipt_sent    BOOLEAN DEFAULT FALSE
);

-- ── HALL RENTALS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hall_rentals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  renter_name     TEXT NOT NULL,
  renter_email    TEXT NOT NULL,
  renter_phone    TEXT NOT NULL,
  event_name      TEXT NOT NULL,
  event_type      TEXT,
  event_date      DATE NOT NULL,
  start_time      TIME,
  end_time        TIME,
  guest_count     INT,
  special_requests TEXT,
  deposit_amount  NUMERIC(8,2) DEFAULT 200.00,
  total_amount    NUMERIC(8,2),
  deposit_paid    BOOLEAN DEFAULT FALSE,
  paypal_order_id TEXT,
  status          TEXT DEFAULT 'Inquiry' CHECK (status IN (
    'Inquiry','Pending','Confirmed','Cancelled','Completed'
  )),
  commander_notes TEXT
);

-- ── CONTACT MESSAGES ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  subject     TEXT,
  message     TEXT NOT NULL,
  status      TEXT DEFAULT 'New' CHECK (status IN ('New','Read','Replied','Archived')),
  replied_at  TIMESTAMPTZ,
  notes       TEXT
);

-- ── VOLUNTEERS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS volunteers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  full_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  availability TEXT,
  interests    TEXT[],
  veteran      BOOLEAN DEFAULT FALSE,
  branch       TEXT,
  status       TEXT DEFAULT 'New' CHECK (status IN ('New','Active','Inactive'))
);

-- ── ANNOUNCEMENTS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS announcements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  priority    TEXT DEFAULT 'Normal' CHECK (priority IN ('Low','Normal','High','Urgent')),
  published   BOOLEAN DEFAULT FALSE,
  publish_at  TIMESTAMPTZ,
  expires_at  TIMESTAMPTZ,
  author      TEXT
);

-- ── NEWS / POSTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE,
  body         TEXT,
  summary      TEXT,
  cover_image  TEXT,
  author       TEXT DEFAULT 'Post 579',
  category     TEXT DEFAULT 'General' CHECK (category IN (
    'General','Veterans','Events','Community','Programs','Legion News'
  )),
  published    BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  tags         TEXT[]
);

-- ── GALLERY ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_photos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  title        TEXT,
  caption      TEXT,
  image_url    TEXT NOT NULL,
  category     TEXT DEFAULT 'General' CHECK (category IN (
    'Events','Members','Facility','Ceremonies','Community','Historical','Military'
  )),
  event_id     UUID REFERENCES events(id),
  sort_order   INT DEFAULT 0,
  is_featured  BOOLEAN DEFAULT FALSE,
  uploaded_by  TEXT
);

-- ── VETERAN ASSISTANCE REQUESTS ─────────────────────────────
CREATE TABLE IF NOT EXISTS veteran_assistance (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  full_name       TEXT NOT NULL,
  email           TEXT,
  phone           TEXT NOT NULL,
  branch          TEXT,
  assistance_type TEXT CHECK (assistance_type IN (
    'VA Benefits','Disability Claim','Housing','Food',
    'Employment','Mental Health','Transportation','Documents','Other'
  )),
  description     TEXT,
  urgency         TEXT DEFAULT 'Normal' CHECK (urgency IN ('Low','Normal','High','Crisis')),
  status          TEXT DEFAULT 'New' CHECK (status IN ('New','In Progress','Referred','Closed')),
  assigned_to     TEXT,
  notes           TEXT,
  follow_up_date  DATE
);

-- ── COMMUNITY SERVICE LOGS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS service_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  member_id    UUID REFERENCES members(id),
  member_name  TEXT,
  activity     TEXT NOT NULL,
  hours        NUMERIC(5,2) NOT NULL,
  service_date DATE NOT NULL,
  location     TEXT,
  notes        TEXT
);

-- ── YOUTH PROGRAMS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS youth_participants (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  full_name    TEXT NOT NULL,
  email        TEXT,
  phone        TEXT,
  age          INT,
  program      TEXT CHECK (program IN ('Boys State','Girls State','Scholarship','Other')),
  school       TEXT,
  grade        INT,
  guardian     TEXT,
  guardian_phone TEXT,
  status       TEXT DEFAULT 'Applicant'
);

-- ── ADMIN USERS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  email        TEXT UNIQUE NOT NULL,
  full_name    TEXT NOT NULL,
  role         TEXT DEFAULT 'Officer' CHECK (role IN ('Commander','Adjutant','Officer','Staff')),
  is_active    BOOLEAN DEFAULT TRUE,
  last_login   TIMESTAMPTZ
);

-- ── INDEXES ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_branch ON members(military_branch);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_tickets_event ON tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_hall_rentals_date ON hall_rentals(event_date);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_photos(category);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_posts(published, published_at);

-- ── SEED: OFFICERS ───────────────────────────────────────────
INSERT INTO officers (full_name, title, sort_order) VALUES
  ('Mr. Harold', 'Commander', 1),
  ('TBD', 'Adjutant', 2),
  ('TBD', 'Vice Commander', 3),
  ('TBD', 'Sergeant-at-Arms', 4),
  ('TBD', 'Chaplain', 5),
  ('TBD', 'Finance Officer', 6)
ON CONFLICT DO NOTHING;

-- ── SEED: EVENTS ────────────────────────────────────────────
INSERT INTO events (title, event_type, event_date, ticket_price, is_ticketed, is_public, description) VALUES
  ('Steak Night — July 2026', 'Steak Night', '2026-07-18', 25.00, TRUE, TRUE, 'Monthly steak night fundraiser. All proceeds support Post 579 veteran programs.'),
  ('Fish Fry Friday — July', 'Fish Fry', '2026-07-11', 15.00, TRUE, TRUE, 'Monthly fish fry. Open to the community. Plates include fish, sides, and dessert.'),
  ('Veterans Day Banquet 2026', 'Banquet', '2026-11-11', 45.00, TRUE, TRUE, 'Annual Veterans Day tribute banquet. Formal dinner, awards, and guest speakers.'),
  ('Monthly Post Meeting — July', 'Meeting', '2026-07-14', 0, FALSE, FALSE, 'Monthly general membership meeting. All Post 579 members welcome.')
ON CONFLICT DO NOTHING;

