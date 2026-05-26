-- Add admin_alerted_at to track when an admin alert was sent for a pending registration.
-- This prevents the pg_cron job from re-alerting on the same stuck registration every hour.
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS admin_alerted_at timestamptz DEFAULT NULL;
