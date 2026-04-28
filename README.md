# Atomic Agility Website

Marketing site and training storefront for [Atomic Agility](https://www.atomicagility.us) — agile coaching, training, and enterprise transformation services. Visitors can browse services, view upcoming SAFe certification courses, register, and pay via Stripe.

## Tech Stack

- **Framework:** Next.js 14 (App Router), TypeScript
- **Styling:** Tailwind CSS
- **Backend / DB:** Supabase (Postgres + auto-generated REST API)
- **Payments:** Stripe Checkout (sessions + webhooks)
- **Transactional email:** Resend (planned — wired in `lib/email.ts`)
- **Forms:** Formspree (contact form)
- **Analytics:** PostHog
- **Hosting:** Vercel (auto-deploy from `main`)
- **DNS:** GoDaddy → Vercel

## Architecture

- **App Router** with server components by default. Pages under `app/` map to URLs.
- **Database access:** Two Supabase clients live in `lib/`. `lib/supabase.ts` is the public anon-key client used by server components for read-only public data (course listings, schedules). `lib/supabase-admin.ts` uses the service-role key and is used by API routes for writes (registrations) and any read that needs to bypass RLS.
- **Checkout flow:**
  1. User submits the registration form on `/training/[slug]/register`.
  2. The form POSTs to `/api/checkout` (`app/api/checkout/route.ts`). That route inserts a `pending` row into the `registrations` table and creates a Stripe Checkout Session, returning the Stripe URL.
  3. User pays on Stripe-hosted checkout. Stripe redirects to `/registration/success`.
  4. Stripe also fires `checkout.session.completed` to `/api/webhooks/stripe` (`app/api/webhooks/stripe/route.ts`). The webhook verifies the signature, flips the `registrations` row to `confirmed`, stores the `payment_intent_id`, and (when Resend is enabled) sends the confirmation email.
- **Shared UI primitives:** `components/MetricCard.tsx` exports `MetricCard`, `MetricGrid`, and the canonical `founderMetrics` list used on Homepage / About / Course pages. Add other shared components alongside.

## Local Development

Prerequisites: Node 18+, npm.

```bash
git clone git@github.com:<owner>/atomic-agility-site.git
cd atomic-agility-site
npm install
cp .env.local.example .env.local   # then fill in the values
npm run dev
```

Site runs at http://localhost:3000.

To exercise the Stripe webhook locally, run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` in a separate terminal and copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET`.

## Environment Variables

All vars live in `.env.local` for dev and in Vercel project settings for prod. None of them should be committed.

| Variable | Used by | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | Project URL for the Supabase instance. Public — safe to expose. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | Anon (RLS-protected) Supabase key for read-only public queries. |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | Service-role key. Used by API routes to insert registrations and bypass RLS. NEVER expose. |
| `STRIPE_SECRET_KEY` | server only | Stripe secret key (`sk_test_…` in sandbox, `sk_live_…` in prod). |
| `STRIPE_WEBHOOK_SECRET` | server only | Signing secret for `checkout.session.completed` webhook. Different value per environment. |
| `NEXT_PUBLIC_SITE_URL` | server | Base URL used for Stripe success/cancel redirects. Defaults to `https://www.atomicagility.us` if unset, so usually only needed in dev (`http://localhost:3000`). |
| `RESEND_API_KEY` | server only | Resend API key for sending the post-purchase confirmation email. |

## Supabase Schema

Four tables drive the storefront:

- **`courses`** — catalog. One row per SAFe course offering (e.g. "Leading SAFe", "SAFe Scrum Master"). Holds `title`, `slug` (used in URL `/training/[slug]`), `description`, `price_cents`, `duration_days`, `is_published`.
- **`schedules`** — concrete instances of a course. One row per cohort. Holds `course_id` (FK), `instructor_id` (FK), `start_date`, `end_date`, `delivery_mode`, `location`, `max_seats`, optional `price_cents` override (used for founding-student discounts).
- **`instructors`** — instructor profiles. Holds `name`, `bio`, `linkedin_url`, `photo_url`. Joined onto schedules.
- **`registrations`** — student records. Inserted as `pending` by `/api/checkout`, flipped to `confirmed` by the Stripe webhook. Holds student details, `schedule_id` (FK), `status`, `amount_paid_cents`, `stripe_payment_intent_id`.

## Stripe Integration

- **Sandbox (test) keys** are used everywhere by default. Card `4242 4242 4242 4242` with any future date and any CVC works for end-to-end testing.
- **Going live** means swapping `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Vercel for the live-mode values, and re-creating the production webhook endpoint pointing at `https://www.atomicagility.us/api/webhooks/stripe` with `checkout.session.completed` selected.
- The webhook expects the raw request body — `app/api/webhooks/stripe/route.ts` reads it as text and verifies the `stripe-signature` header before doing anything.
- Successful webhook events update the matching `registrations` row using the `registrationId` stored in the Stripe Session metadata.

## Deployment

- Hosted on **Vercel**, project linked to the `main` branch of this repo. A push to `main` triggers an automatic build and deploy.
- Custom domain `www.atomicagility.us` is managed in **GoDaddy DNS**, with a CNAME pointing at the Vercel-assigned hostname. The apex `atomicagility.us` redirects to `www`.
- Environment variables are mirrored in Vercel → Project Settings → Environment Variables. Any new var must be added there in addition to `.env.local`.
- Pre-deploy checks: `npx tsc --noEmit` and `npx next lint` should both be clean. Vercel will fail the build on TS errors.

## Common Operational Tasks

**Add a new course schedule (cohort):**
1. Open Supabase → Table Editor → `schedules`.
2. Insert a row with the matching `course_id`, an `instructor_id`, `start_date`, `end_date`, `delivery_mode` (e.g. "Virtual"), `max_seats`, and optional `price_cents` override.
3. Wait a few seconds — the training pages use `force-dynamic` and re-fetch on every request, so the new schedule will appear immediately on `/training` and `/training/[slug]`.

**View registrations:**
- Supabase → Table Editor → `registrations`. Filter by `status = 'confirmed'` for completed payments. Each row has the Stripe `stripe_payment_intent_id`, which links back to the Stripe dashboard for refunds and receipts.

**Switch Stripe from sandbox to live:**
1. In Stripe Dashboard, toggle to live mode.
2. Copy the live secret key into Vercel as `STRIPE_SECRET_KEY` (production environment only).
3. Create a new live-mode webhook endpoint at `https://www.atomicagility.us/api/webhooks/stripe` listening for `checkout.session.completed`. Copy its signing secret into Vercel as `STRIPE_WEBHOOK_SECRET`.
4. Trigger a redeploy (push a no-op commit or click "Redeploy" in Vercel).
5. Smoke-test with a real card on a $1 test schedule before announcing.

**Manual end-to-end payment test (sandbox):**
1. With dev server running and `stripe listen` forwarding to `/api/webhooks/stripe`, open `/training/[slug]/register` for any published course.
2. Submit the form with a test email. Use card `4242 4242 4242 4242`, any future expiry, any CVC.
3. Verify: (a) registration row inserted as `pending`, (b) Stripe redirect to `/registration/success`, (c) webhook fires and flips the row to `confirmed`, (d) `stripe_payment_intent_id` populated, (e) confirmation email sent (when Resend is enabled).

## Known Issues / Gotchas

- **`git push` over HTTPS from the terminal is unreliable on Mac** in this environment — credential prompts hang. Use **GitHub Desktop** for commits and pushes.
- **Supabase joins return arrays *or* objects** depending on the relationship cardinality. The training pages all normalize this with the `Array.isArray(...) ? x[0] : x` pattern. If you add new joined queries, do the same.
- **Course page bio fallback vs. live data:** the instructor bio on `/training/[slug]` is rendered from `instructors.bio` in Supabase if present; otherwise it falls back to a hardcoded paragraph in `app/training/[slug]/page.tsx`. Updating the canonical bio means updating both places (or making sure Supabase is the source of truth and the fallback is a true fallback).
- **`force-dynamic` on training routes** disables Next.js caching so schedule changes show up immediately. If you ever care about page-load speed enough to enable ISR, you'll need to add manual revalidation when schedules change.
- **Founder/credential metrics are centralized** in `components/MetricCard.tsx` (`founderMetrics`). Update that one file to update Homepage, About, and Course pages.

## Useful Links

- Vercel project: https://vercel.com/dashboard (search "atomic-agility-site")
- Supabase project: https://supabase.com/dashboard
- Stripe dashboard: https://dashboard.stripe.com
- PostHog project: https://app.posthog.com
- Miro backlog board: https://miro.com/app/board/uXjVKoTurXA=/
- Live site: https://www.atomicagility.us
