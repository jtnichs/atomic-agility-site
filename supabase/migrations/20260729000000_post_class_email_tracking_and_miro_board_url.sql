-- Post-class resource email support.
--
-- registrations.post_class_sent_at: idempotency guard so a re-run of the
--   post-class automation never double-sends. Mirrors onboarding_sent_at.
-- schedules.miro_board_url: deterministic pointer to the class Miro board,
--   replacing brittle title string-matching. Automation prefers this when
--   populated and falls back to title-matching when null.

ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS post_class_sent_at timestamptz DEFAULT NULL;

ALTER TABLE schedules
  ADD COLUMN IF NOT EXISTS miro_board_url text DEFAULT NULL;

-- NOTE: this migration also contained two column-level REVOKE statements that
-- were a no-op (see the following migration, which supersedes them). They are
-- omitted here; the grant fix lives in
-- 20260729000100_restrict_schedules_private_columns_from_anon.sql.
