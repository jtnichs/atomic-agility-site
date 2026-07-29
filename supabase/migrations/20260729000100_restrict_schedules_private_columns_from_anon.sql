-- Restrict private schedules columns from the public anon key.
--
-- schedules is world-readable via RLS policy "Public can read schedules"
-- (USING true), and the site queries it with the anon key that ships in the
-- browser bundle. Two columns should never appear in a public payload:
--
--   meeting_link    class join links - previously readable by anyone,
--                   without registering or paying (pre-existing exposure)
--   miro_board_url  capability link to student work product / class IP
--
-- IMPORTANT: a column-level REVOKE does NOT subtract from a table-level GRANT
-- in Postgres. anon held table-wide SELECT (granted by postgres), which covers
-- every column including columns added later. The only working fix is to drop
-- the table-wide grant and re-grant an explicit column list.
--
-- This also fails closed: a future ALTER TABLE ADD COLUMN is invisible to anon
-- until deliberately added to the list below.
--
-- service_role bypasses column grants, so API routes and the post-class
-- automation continue to read both columns normally.

REVOKE SELECT ON schedules FROM anon, authenticated;

GRANT SELECT (
  id, course_id, instructor_id, start_date, end_date, delivery_mode,
  location, max_seats, created_at, price_cents, status, platform,
  start_time, end_time, timezone
) ON schedules TO anon, authenticated;
