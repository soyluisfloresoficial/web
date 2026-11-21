ALTER TABLE trips ADD COLUMN pickup_lat REAL;
ALTER TABLE trips ADD COLUMN pickup_lng REAL;
ALTER TABLE trips ADD COLUMN dropoff_lat REAL;
ALTER TABLE trips ADD COLUMN dropoff_lng REAL;
ALTER TABLE trip_requests ADD COLUMN pickup_lat REAL;
ALTER TABLE trip_requests ADD COLUMN pickup_lng REAL;
ALTER TABLE trip_requests ADD COLUMN dropoff_lat REAL;
ALTER TABLE trip_requests ADD COLUMN dropoff_lng REAL;
CREATE TABLE saved_places (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  address TEXT NOT NULL,
  lat REAL,
  lng REAL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_places_user ON saved_places(user_id);
CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
