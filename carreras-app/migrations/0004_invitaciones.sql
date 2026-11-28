ALTER TABLE users ADD COLUMN pass_set INTEGER NOT NULL DEFAULT 1;
CREATE TABLE invites (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_invites_user ON invites(user_id);
