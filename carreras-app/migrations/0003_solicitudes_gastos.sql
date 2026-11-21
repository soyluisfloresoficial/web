ALTER TABLE trips ADD COLUMN trip_time TEXT;
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  exp_date TEXT NOT NULL,
  category TEXT NOT NULL,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  note TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_expenses_date ON expenses(exp_date);
CREATE TABLE trip_requests (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES users(id),
  req_date TEXT NOT NULL,
  req_time TEXT,
  pickup TEXT NOT NULL,
  dropoff TEXT NOT NULL,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','cancelled')),
  trip_id TEXT,
  answer_note TEXT,
  created_at TEXT NOT NULL,
  answered_at TEXT
);
CREATE INDEX idx_requests_status ON trip_requests(status, req_date);
CREATE INDEX idx_requests_client ON trip_requests(client_id, created_at);
