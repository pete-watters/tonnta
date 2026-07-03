-- Alert subscriptions: one row per browser push subscription. The endpoint
-- is the identity — no accounts in v1.
CREATE TABLE IF NOT EXISTS alert_subscriptions (
  endpoint TEXT PRIMARY KEY,
  p256dh TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  spot_id TEXT NOT NULL DEFAULT 'donabate',
  min_wave_m REAL NOT NULL DEFAULT 0.4,
  max_wind_kmh REAL NOT NULL DEFAULT 25,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_alerted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_alert_subscriptions_spot ON alert_subscriptions (spot_id);
