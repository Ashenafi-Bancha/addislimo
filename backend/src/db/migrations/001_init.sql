-- Addis Limo — initial schema.
--
-- The shape comes from what the UI already renders: `frontend/src/types`,
-- `frontend/src/features/admin/types.ts` and the aggregates in
-- `features/admin/selectors.ts`. Where a rule can be stated as a constraint it
-- is stated here rather than only in a service, because the database is the
-- last line that holds when two requests arrive at once.

-- ── Reference data ────────────────────────────────────────────────────────
-- The service types in step 1 of the wizard, and the classes in step 4. Rows
-- rather than code so the client can reprice without a deploy.

CREATE TABLE services (
  id           text PRIMARY KEY,
  label        text        NOT NULL,
  description  text        NOT NULL DEFAULT '',
  -- Base fare in ETB before the vehicle-class multiplier.
  base_fare    numeric(12, 2) NOT NULL CHECK (base_fare >= 0),
  sort_order   integer     NOT NULL DEFAULT 0,
  active       boolean     NOT NULL DEFAULT true
);

CREATE TABLE vehicle_classes (
  id             text PRIMARY KEY,
  label          text NOT NULL,
  -- Shown to the customer, e.g. '1–3'.
  capacity_label text NOT NULL,
  note           text NOT NULL DEFAULT '',
  -- Emoji stand-in until the client supplies fleet photography.
  img            text NOT NULL DEFAULT '',
  -- Multiplies the service base fare.
  multiplier     numeric(4, 2) NOT NULL CHECK (multiplier > 0),
  seats_min      integer NOT NULL CHECK (seats_min >= 1),
  seats_max      integer NOT NULL CHECK (seats_max >= seats_min),
  sort_order     integer NOT NULL DEFAULT 0
);

-- ── Fleet network ─────────────────────────────────────────────────────────

CREATE TABLE partners (
  id              text PRIMARY KEY,
  name            text NOT NULL CHECK (length(btrim(name)) > 0),
  type            text NOT NULL CHECK (type IN (
                    'Transport Company', 'Vehicle Owner', 'Tour Operator', 'Events Transport')),
  contact_name    text NOT NULL,
  phone           text NOT NULL,
  email           text NOT NULL,
  -- The percentage Addis Limo keeps. Capped at 50 to match the admin form.
  commission_rate numeric(5, 2) NOT NULL CHECK (commission_rate >= 0 AND commission_rate <= 50),
  status          text NOT NULL CHECK (status IN ('Active', 'Pending', 'Suspended')),
  rating          numeric(2, 1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  joined_at       timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE drivers (
  id         text PRIMARY KEY,
  partner_id text NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  name       text NOT NULL CHECK (length(btrim(name)) > 0),
  phone      text NOT NULL,
  licence_no text NOT NULL,
  -- 'On Trip' is never stored: it is derived from live bookings, so a trip
  -- ending cannot leave a driver stuck as busy.
  status     text NOT NULL CHECK (status IN ('Available', 'Off Duty')),
  rating     numeric(2, 1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- Lets a booking reference (driver_id, partner_id) together, which is how
  -- the database refuses a driver lent to another partner's trip.
  UNIQUE (id, partner_id)
);

CREATE TABLE vehicles (
  id            text PRIMARY KEY,
  partner_id    text NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  make          text NOT NULL CHECK (length(btrim(make)) > 0),
  model         text NOT NULL CHECK (length(btrim(model)) > 0),
  year          integer NOT NULL CHECK (year BETWEEN 1990 AND 2100),
  plate         text NOT NULL,
  vehicle_class text NOT NULL REFERENCES vehicle_classes(id),
  seats         integer NOT NULL CHECK (seats BETWEEN 1 AND 60),
  status        text NOT NULL CHECK (status IN ('Available', 'Maintenance')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, partner_id)
);

-- Plates are the same plate whatever case they are typed in.
CREATE UNIQUE INDEX vehicles_plate_unique ON vehicles (upper(btrim(plate)));
CREATE INDEX drivers_partner_idx ON drivers (partner_id);
CREATE INDEX vehicles_partner_idx ON vehicles (partner_id);

-- ── Bookings ──────────────────────────────────────────────────────────────

CREATE TABLE bookings (
  -- The customer-facing reference, e.g. AL-261115-7Q4K. It is the identifier
  -- the customer quotes on the phone, so it is the primary key rather than a
  -- surrogate nobody can read out.
  id              text PRIMARY KEY,
  customer_name   text NOT NULL CHECK (length(btrim(customer_name)) > 0),
  customer_email  text NOT NULL,
  customer_phone  text NOT NULL DEFAULT '',
  service_id      text NOT NULL REFERENCES services(id),
  pickup          text NOT NULL CHECK (length(btrim(pickup)) > 0),
  destination     text NOT NULL CHECK (length(btrim(destination)) > 0),
  scheduled_at    timestamptz NOT NULL,
  passengers      integer NOT NULL CHECK (passengers BETWEEN 1 AND 60),
  luggage         integer NOT NULL DEFAULT 0 CHECK (luggage >= 0),
  vehicle_class   text REFERENCES vehicle_classes(id),

  partner_id      text REFERENCES partners(id) ON DELETE RESTRICT,
  driver_id       text,
  vehicle_id      text,

  amount          numeric(12, 2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
  -- Fixed when the booking was priced. Changing a partner's rate later must
  -- not rewrite what was already earned, which is why this is a column and
  -- not a join.
  commission      numeric(12, 2) NOT NULL DEFAULT 0 CHECK (commission >= 0),
  commission_rate numeric(5, 2)  NOT NULL DEFAULT 0 CHECK (commission_rate >= 0),

  status          text NOT NULL CHECK (status IN (
                    'Pending', 'Confirmed', 'Assigned',
                    'Driver En Route', 'In Progress', 'Completed', 'Cancelled')),
  notes           text NOT NULL DEFAULT '',
  -- How the request arrived, for the admin and for knowing which channel works.
  source          text NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'whatsapp', 'phone', 'email', 'admin')),
  cancelled_reason text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  completed_at    timestamptz,

  CHECK (commission <= amount),
  -- A driver or vehicle only ever belongs to the partner fulfilling the trip.
  FOREIGN KEY (driver_id, partner_id)  REFERENCES drivers (id, partner_id)  ON DELETE SET NULL (driver_id),
  FOREIGN KEY (vehicle_id, partner_id) REFERENCES vehicles (id, partner_id) ON DELETE SET NULL (vehicle_id),
  -- Nobody can be dispatched before someone is responsible for the trip.
  CHECK (partner_id IS NOT NULL OR (driver_id IS NULL AND vehicle_id IS NULL)),
  -- A trip cannot be under way without a driver to be driving it.
  CHECK (status NOT IN ('Driver En Route', 'In Progress') OR driver_id IS NOT NULL)
);

CREATE INDEX bookings_status_idx       ON bookings (status);
CREATE INDEX bookings_scheduled_idx    ON bookings (scheduled_at DESC);
CREATE INDEX bookings_partner_idx      ON bookings (partner_id);
CREATE INDEX bookings_customer_idx     ON bookings (lower(customer_email));
CREATE INDEX bookings_revenue_idx      ON bookings (scheduled_at) WHERE status = 'Completed';

-- One driver, one live trip. Two dispatchers assigning the same driver at the
-- same moment is exactly the race a service-layer check loses, so the rule
-- lives here where it cannot.
CREATE UNIQUE INDEX bookings_driver_live_unique
  ON bookings (driver_id)
  WHERE driver_id IS NOT NULL AND status IN ('Driver En Route', 'In Progress');

CREATE UNIQUE INDEX bookings_vehicle_live_unique
  ON bookings (vehicle_id)
  WHERE vehicle_id IS NOT NULL AND status IN ('Driver En Route', 'In Progress');

-- Every status change, who made it and when. Dispatch disputes are settled
-- from this table.
CREATE TABLE booking_events (
  id          bigserial PRIMARY KEY,
  booking_id  text NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  at          timestamptz NOT NULL DEFAULT now(),
  -- The admin's email, or 'customer' for the public booking form.
  actor       text NOT NULL,
  kind        text NOT NULL CHECK (kind IN ('created', 'status', 'assigned', 'updated', 'priced')),
  from_status text,
  to_status   text,
  detail      text NOT NULL DEFAULT ''
);

CREATE INDEX booking_events_booking_idx ON booking_events (booking_id, at DESC);

-- ── Admin accounts and sessions ───────────────────────────────────────────

CREATE TABLE admin_users (
  id            text PRIMARY KEY,
  email         text NOT NULL,
  password_hash text NOT NULL,
  name          text NOT NULL,
  role          text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'dispatcher', 'viewer')),
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);

CREATE UNIQUE INDEX admin_users_email_unique ON admin_users (lower(email));

CREATE TABLE admin_sessions (
  -- The cookie carries a random token; only its hash is stored, so a leaked
  -- database backup is not a set of working sessions.
  token_hash text PRIMARY KEY,
  admin_id   text NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  user_agent text NOT NULL DEFAULT '',
  ip         text NOT NULL DEFAULT ''
);

CREATE INDEX admin_sessions_admin_idx   ON admin_sessions (admin_id);
CREATE INDEX admin_sessions_expiry_idx  ON admin_sessions (expires_at);

-- Failed sign-ins, so the rate limiter survives a restart and a slow
-- credential-stuffing run cannot wait it out.
CREATE TABLE login_attempts (
  id         bigserial PRIMARY KEY,
  email      text NOT NULL,
  ip         text NOT NULL DEFAULT '',
  at         timestamptz NOT NULL DEFAULT now(),
  successful boolean NOT NULL
);

CREATE INDEX login_attempts_lookup_idx ON login_attempts (lower(email), at DESC);

-- ── Settings and site content ─────────────────────────────────────────────

CREATE TABLE settings (
  -- One row, enforced.
  id                      boolean PRIMARY KEY DEFAULT true CHECK (id),
  default_commission_rate numeric(5, 2) NOT NULL DEFAULT 12
                            CHECK (default_commission_rate >= 0 AND default_commission_rate <= 50),
  notify_new_booking      boolean NOT NULL DEFAULT true,
  notify_cancellation     boolean NOT NULL DEFAULT true,
  daily_summary           boolean NOT NULL DEFAULT false,
  updated_at              timestamptz NOT NULL DEFAULT now()
);

INSERT INTO settings (id) VALUES (true);

-- One row per group in frontend/src/features/cms/content.ts.
CREATE TABLE site_content (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text NOT NULL DEFAULT ''
);

CREATE TABLE content_images (
  id         text PRIMARY KEY,
  mime       text NOT NULL,
  bytes      integer NOT NULL CHECK (bytes > 0),
  data       bytea NOT NULL,
  alt        text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL DEFAULT ''
);
