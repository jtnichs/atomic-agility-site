import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// --- Types ---

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price_cents: number;
  is_published: boolean;
}

interface Schedule {
  id: string;
  start_date: string;
  end_date: string;
  delivery_mode: string | null;
  location: string | null;
  max_seats: number | null;
  price_cents: number | null;
  courses: Course | Course[];
}

// --- Helpers ---

function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US")}`;
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${s.toLocaleDateString("en-US", { month: "long", day: "numeric" })}–${e.getDate()}, ${e.getFullYear()}`;
  }
  const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
  return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", opts)}`;
}

// --- Icons ---

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

// --- Feature card data ---

const features = [
  {
    title: "Pre-Class Context Questionnaire",
    body: "Complete our AI-powered questionnaire before class. Your responses shape real examples and exercises used throughout the course — tailored to your organization and value streams.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    title: "Post-Class Consulting Session",
    body: "One 60-minute individual consulting session after class. Bring your questions, your challenges, and real scenarios from your workplace.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: "AI Integration Toolkit",
    body: "A practical toolkit of AI prompts, templates, and workflows designed for agile practitioners. Includes AI led quiz preparation and practice exam. Start applying AI to your agile practice on day one.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
  },
  {
    title: "Implementation Coaching",
    body: "30 days of post-class coaching support via email. We help you apply what you learned to your actual organization — not just pass the exam.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-1a4 4 0 00-5.916-3.52M9 20H4v-1a4 4 0 015.916-3.52M15 7a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 11-6 0 3 3 0 016 0zm-18 0a3 3 0 116 0 3 3 0 01-6 0z" />
      </svg>
    ),
  },
];

// --- Schedule Card ---

type NormalizedSchedule = Omit<Schedule, "courses"> & { courses: Course };

function ScheduleCard({ schedule }: { schedule: NormalizedSchedule }) {
  const course = schedule.courses;
  const schedulePriceCents = schedule.price_cents;
  const coursePriceCents = course.price_cents;
  const isDiscounted =
    schedulePriceCents !== null && schedulePriceCents < coursePriceCents;
  const displayPrice =
    schedulePriceCents !== null ? schedulePriceCents : coursePriceCents;

  return (
    <div className="group rounded-xl border border-[#00487B] bg-navy p-8 flex flex-col transition-colors duration-200 hover:border-cyan">
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold text-white">{course.title}</h3>
        <span className="flex-shrink-0 rounded-full bg-navyMid px-3 py-1 text-sm text-cyan">
          {schedule.delivery_mode ?? "Virtual"}
        </span>
      </div>

      {/* Date */}
      <div className="mt-4 flex items-center gap-2">
        <CalendarIcon />
        <span className="text-lg text-white">
          {formatDateRange(schedule.start_date, schedule.end_date)}
        </span>
      </div>

      {/* Seats */}
      {schedule.max_seats !== null && (
        <div className="mt-2 flex items-center gap-2">
          <UsersIcon />
          <span className="text-muted">{schedule.max_seats} seats available</span>
        </div>
      )}

      {/* Pricing */}
      <div className="mt-4 border-t border-[#00487B] pt-4">
        {isDiscounted ? (
          <>
            <span className="inline-block rounded-full bg-cyan px-3 py-1 text-xs font-semibold text-white">
              Founding Student Rate
            </span>
            <p className="mt-2 text-3xl font-bold text-cyan">
              {formatPrice(displayPrice)}
            </p>
            <p className="mt-1 text-sm text-muted">
              <span className="line-through">
                Regular price {formatPrice(coursePriceCents)}
              </span>
            </p>
          </>
        ) : (
          <p className="text-3xl font-bold text-cyan">
            {formatPrice(displayPrice)}
          </p>
        )}
      </div>

      {/* CTA */}
      <Link
        href={`/training/${course.slug}?schedule=${schedule.id}`}
        className="mt-6 block w-full rounded-lg bg-cyan py-3 text-center font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
      >
        Register Now
      </Link>
    </div>
  );
}

// --- Page ---

export default async function TrainingPage() {
  const today = new Date().toISOString().split("T")[0];

  const { data: schedules, error } = await supabase
    .from("schedules")
    .select(`
      id,
      start_date,
      end_date,
      delivery_mode,
      location,
      max_seats,
      price_cents,
      courses (
        id,
        title,
        slug,
        description,
        price_cents,
        is_published
      )
    `)
    .gte("start_date", today)
    .order("start_date", { ascending: true });

  console.log("Raw schedules from Supabase:", JSON.stringify(schedules, null, 2));
  console.log("Schedule count:", schedules?.length);
  console.log("Training page — error:", error);

  // Normalize: Supabase may return courses as an array or object; flatten to single Course
  type NormalizedSchedule = Omit<Schedule, "courses"> & { courses: Course };

  const validSchedules: NormalizedSchedule[] = (schedules ?? [])
    .filter((s) => s.courses !== null && s.courses !== undefined)
    .map((s) => ({
      ...s,
      courses: Array.isArray(s.courses) ? s.courses[0] : (s.courses as Course),
    }))
    .filter((s) => s.courses !== undefined && s.courses.is_published === true) as NormalizedSchedule[];

  return (
    <>
      {/* SECTION 1 — HERO */}
      <section className="flex flex-col items-center justify-center bg-navy px-4 py-24 text-center">
        <p className="text-sm uppercase tracking-widest text-cyan">
          Training &amp; Certification
        </p>
        <h1 className="mt-2 text-5xl font-bold text-white md:text-6xl">
          SAFe Certification Training
        </h1>
        <p className="mt-4 text-2xl font-medium text-cyan md:text-3xl">
          Virtual. Expert-Led. Built for the AI Age.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          All courses include certification exam, post-class consulting
          session, AI Integration Toolkit with AI powered quiz prep, and
          personalized coaching support.
        </p>

        {/* Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {[
            "✓ Exam Included",
            "✓ Post-Class Consulting Session",
            "✓ AI Integration Toolkit",
            "✓ Founding Student Rates Available",
          ].map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-[#00487B] bg-navyMid px-4 py-2 text-sm text-muted"
            >
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* SECTION 2 — COURSE CARDS */}
      <section id="courses" className="w-full bg-navyMid py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm uppercase tracking-widest text-cyan">
              Upcoming Classes
            </p>
            <h2 className="mt-2 text-4xl font-bold text-white">
              Find Your Course
            </h2>
          </div>

          {validSchedules.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {validSchedules.map((schedule) => (
                <ScheduleCard key={schedule.id} schedule={schedule} />
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-xl border border-[#00487B] bg-navy p-12 text-center">
              <p className="text-xl font-semibold text-white">
                New dates coming soon.
              </p>
              <p className="mt-2 text-muted">
                Sign up below to be notified when new classes are scheduled.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-block rounded-lg bg-cyan px-8 py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
              >
                Get Notified
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3 — INCLUDED WITH EVERY COURSE */}
      <section className="w-full bg-navy py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">
              More Than Just a Certification.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
              Every Atomic Agility course includes features you won&apos;t find
              at the big training providers.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-[#00487B] bg-navyMid p-8 transition-colors duration-200 hover:border-cyan"
              >
                {feature.icon}
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — CTA BANNER */}
      <section className="w-full bg-gradient-to-b from-navy to-navyMid py-24 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-bold text-white">
            Ready to Get Certified?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Join our founding cohort and lock in your rate before standard
            pricing takes effect.
          </p>
          <div className="mt-10">
            <a
              href="#courses"
              className="inline-block rounded-lg bg-cyan px-8 py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
            >
              View All Courses
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
