import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MetricGrid } from "@/components/MetricCard";
import ExamDomainAccordion from "@/components/ExamDomainAccordion";
import SSMExamDomainAccordion from "@/components/SSMExamDomainAccordion";
import LPMExamDomainAccordion from "@/components/LPMExamDomainAccordion";
import PoPMExamDomainAccordion from "@/components/PoPMExamDomainAccordion";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// --- Types ---

interface Instructor {
  id: string;
  name: string;
  bio: string | null;
  linkedin_url: string | null;
  photo_url: string | null;
}

interface Schedule {
  id: string;
  start_date: string;
  end_date: string;
  delivery_mode: string | null;
  location: string | null;
  max_seats: number | null;
  price_cents: number | null;
  status: string | null;
  instructors: Instructor | Instructor[] | null;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration_days: number | null;
  price_cents: number;
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

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
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

// --- PDF mapping (course slug → downloadable overview PDF) ---

const COURSE_PDF_MAP: Record<string, string> = {
  "leading-safe": "SAFe_AI-Empowered_Overview_SA.pdf",
  "leading-safe-for-government": "SAFe_AI-Empowered_forGovt_SA.pdf",
  "safe-popm": "SAFe_AI-Empowered_Overview_POPM.pdf",
  "safe-scrum-master": "SAFe_AI-Empowered_Overview_Partner_SSM.pdf",
  "safe-lpm": "LPM_6.0_Partner.pdf",
};

// --- Badge mapping (course slug → badge file) ---

const BADGE_MAP: Record<string, string> = {
  "leading-safe": "/images/courses/safe-badge-sa.svg",
  "leading-safe-for-government": "/images/courses/safe-badge-sa.svg",
  "safe-popm": "/images/courses/safe-badge-popm.svg",
  "safe-scrum-master": "/images/courses/safe-badge-ssm.svg",
  "safe-lpm": "/images/courses/safe-badge-lpm.svg",
};

// --- Feature cards (same as Training Hub) ---

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
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="5" />
        <path d="M20 21a8 8 0 0 0-16 0" />
      </svg>
    ),
  },
];

// --- Schedule Card (course page variant) ---

function ScheduleCard({
  schedule,
  course,
  darkBg = false,
}: {
  schedule: Schedule;
  course: Course;
  darkBg?: boolean;
}) {
  const schedulePriceCents = schedule.price_cents;
  const coursePriceCents = course.price_cents;
  const isDiscounted =
    schedulePriceCents !== null && schedulePriceCents < coursePriceCents;
  const displayPrice =
    schedulePriceCents !== null ? schedulePriceCents : coursePriceCents;

  return (
    <div className={`group rounded-xl border border-[#00487B] ${darkBg ? "bg-navy" : "bg-navyMid"} p-8 flex flex-col transition-colors duration-200 hover:border-cyan`}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <span className="text-lg font-semibold text-white">
          {formatDateRange(schedule.start_date, schedule.end_date)}
        </span>
        <span className="flex-shrink-0 rounded-full bg-navy px-3 py-1 text-sm text-cyan">
          {schedule.delivery_mode ?? "Virtual"}
        </span>
      </div>

      {/* Time */}
      <div className="mt-3 flex items-center gap-2">
        <ClockIcon />
        <span className="text-muted">9:00 AM – 5:00 PM ET</span>
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
        href={`/training/${course.slug}/register?schedule=${schedule.id}`}
        className="mt-6 block w-full rounded-lg bg-cyan py-3 text-center font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
      >
        Register Now
      </Link>
    </div>
  );
}

// --- Page ---

export default async function CoursePage({
  params,
}: {
  params: { slug: string };
}) {
  // Fetch course
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, title, slug, description, duration_days, price_cents")
    .eq("slug", params.slug)
    .single();

  if (courseError || !course) {
    notFound();
  }

  const typedCourse = course as Course;

  // Fetch upcoming schedules with instructor
  const { data: schedules } = await supabase
    .from("schedules")
    .select(`
      id,
      start_date,
      end_date,
      delivery_mode,
      location,
      max_seats,
      price_cents,
      status,
      instructors (
        id,
        name,
        bio,
        linkedin_url,
        photo_url
      )
    `)
    .eq("course_id", typedCourse.id)
    .eq("status", "open")
    .gte("start_date", new Date().toISOString().split("T")[0])
    .order("start_date", { ascending: true });

  const typedSchedules = (schedules ?? []) as Schedule[];

  // Pull instructor from first schedule that has one (Supabase may return array or object)
  const rawInstructor =
    typedSchedules.find((s) => s.instructors)?.instructors ?? null;
  const instructor: Instructor | null = Array.isArray(rawInstructor)
    ? (rawInstructor[0] ?? null)
    : rawInstructor;

  const hasCustomSections =
    params.slug === "leading-safe" ||
    params.slug === "safe-scrum-master" ||
    params.slug === "safe-lpm" ||
    params.slug === "safe-popm";

  return (
    <>
      {/* SECTION 1 — COURSE HERO */}
      <section className="flex flex-col bg-navy px-4 py-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            {/* Left column — all hero text content */}
            <div className="flex-1">
              {/* Breadcrumb */}
              <p className="text-sm text-muted">
                <Link href="/training" className="hover:text-white transition-colors duration-200">
                  Training
                </Link>
                {" → "}
                <span>{typedCourse.title}</span>
              </p>

              <h1 className="mt-4 text-5xl font-bold text-white md:text-6xl">
                {typedCourse.title}
              </h1>
              <p className="mt-4 text-2xl font-medium text-cyan">
                SAFe Certification | 2-Day Virtual Course | Exam Included
              </p>

              {typedCourse.description && (
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
                  {typedCourse.description}
                </p>
              )}

              {/* Stat pills */}
              <div className="mt-6 flex flex-wrap gap-3">
                {["2 Days", "Virtual", "Exam Included", "15 PDUs"].map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-[#00487B] bg-navyMid px-4 py-2 text-sm text-muted"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-start gap-3">
                <a
                  href="#schedules"
                  className="inline-block rounded-lg bg-cyan px-8 py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
                >
                  View Upcoming Dates
                </a>

                {COURSE_PDF_MAP[typedCourse.slug] && (
                  <a
                    href={`/resources/${COURSE_PDF_MAP[typedCourse.slug]}`}
                    download
                    className="inline-flex items-center gap-2 rounded-lg border border-[#00A5F0] px-8 py-4 text-lg font-semibold text-[#00A5F0] transition-colors duration-200 hover:bg-[#00A5F0] hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download Course Overview
                  </a>
                )}
              </div>
            </div>

            {/* Right column — certification badge (desktop only) */}
            {BADGE_MAP[typedCourse.slug] && (
              <div className="hidden md:flex flex-shrink-0 items-center justify-center w-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={BADGE_MAP[typedCourse.slug]}
                  alt="SAFe Certification Badge"
                  style={{ width: "180px", height: "auto" }}
                />
              </div>
            )}
          </div>
        </div>
      </section>


      {/* POPM — WHO THIS IS FOR */}
      {params.slug === "safe-popm" && (
        <section className="w-full bg-navyMid py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white">Who Is This Course For?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
                The AI-Empowered POPM course is designed for professionals who bridge customer needs with program execution to maximize value delivery.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Product Owners */}
              <div className="rounded-xl border border-[#00487B] bg-navy p-8 transition-colors duration-200 hover:border-cyan">
                <div className="mb-4 flex h-10 w-10 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#00A5F0]">Product Owners</h3>
                <p className="mt-3 leading-relaxed text-muted">Own the Team Backlog and drive execution by translating features into stories, ensuring the right work is done at the right time.</p>
              </div>
              {/* Product Managers */}
              <div className="rounded-xl border border-[#00487B] bg-navy p-8 transition-colors duration-200 hover:border-cyan">
                <div className="mb-4 flex h-10 w-10 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#00A5F0]">Product Managers</h3>
                <p className="mt-3 leading-relaxed text-muted">Guide the ART Backlog and roadmap, aligning strategy with execution to ensure the program delivers real business solutions.</p>
              </div>
              {/* Business Owners */}
              <div className="rounded-xl border border-[#00487B] bg-navy p-8 transition-colors duration-200 hover:border-cyan">
                <div className="mb-4 flex h-10 w-10 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#00A5F0]">Business Owners</h3>
                <p className="mt-3 leading-relaxed text-muted">Align release plans and visions to ensure strategic investments and PI Objectives drive continuous organizational improvement.</p>
              </div>
              {/* Portfolio Managers */}
              <div className="rounded-xl border border-[#00487B] bg-navy p-8 transition-colors duration-200 hover:border-cyan">
                <div className="mb-4 flex h-10 w-10 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#00A5F0]">Portfolio Managers</h3>
                <p className="mt-3 leading-relaxed text-muted">Gain visibility into how epics are decomposed into features and stories, using AI-driven insights to optimize investment and delivery.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* POPM — WHAT YOU'LL LEARN */}
      {params.slug === "safe-popm" && (
        <section className="w-full bg-navy py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white">What You&apos;ll Learn</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
                Practical skills to maximize value delivery by bridging customer needs with Agile execution at scale.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-xl border-l-4 border-[#00A5F0] bg-[#00234B] p-8">
                <h3 className="text-xl font-bold text-white">Execute the POPM Roles</h3>
                <p className="mt-3 leading-relaxed text-muted">Perform day-to-day responsibilities of backlog ownership and delivery forecasting. Represent the business and customer to ensure solutions deliver real value while managing risks and dependencies.</p>
              </div>
              <div className="rounded-xl border-l-4 border-[#00A5F0] bg-[#00234B] p-8">
                <h3 className="text-xl font-bold text-white">Facilitate PI Planning</h3>
                <p className="mt-3 leading-relaxed text-muted">Lead and support PI Planning to align roadmaps and vision with business goals. Collaborate with stakeholders and teams to set clear PI Objectives and forecast work effectively.</p>
              </div>
              <div className="rounded-xl border-l-4 border-[#00A5F0] bg-[#00234B] p-8">
                <h3 className="text-xl font-bold text-white">Optimize Workflow</h3>
                <p className="mt-3 leading-relaxed text-muted">Use design thinking and customer-centricity to guide the flow of features and stories. Translate high-level strategy into actionable backlog items that can be built, tested, and delivered quickly.</p>
              </div>
              <div className="rounded-xl border-l-4 border-[#00A5F0] bg-[#00234B] p-8">
                <h3 className="text-xl font-bold text-white">Apply Practical AI Skills</h3>
                <p className="mt-3 leading-relaxed text-muted">Gain specific techniques to apply AI in backlog refinement, prioritization, and feature discovery. Enhance customer connection while protecting sensitive data through responsible AI practices.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* POPM — YOUTUBE EMBED */}
      {params.slug === "safe-popm" && (
        <section className="w-full bg-navyMid py-12 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white">See What SAFe POPM Covers</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
                <iframe
                  src="https://www.youtube.com/embed/4UZH1VUvnMg"
                  title="SAFe POPM Course Overview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LPM — WHO THIS IS FOR */}
      {params.slug === "safe-lpm" && (
        <section className="w-full bg-navyMid py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white">Who Is This Course For?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
                The LPM course is designed for leaders who need to manage an agile approach to portfolio planning, funding, and operations.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {[
                "Executive Leaders",
                "Enterprise Architects",
                "Product Management Leaders",
                "PMO Leaders",
                "Agile Coaches",
                "SAFe Practice Consultants",
              ].map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-[#00487B] bg-navy px-4 py-2 text-sm text-[#00A5F0]"
                >
                  {role}
                </span>
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-gray-300">
              This course gives you the tools to lead with clarity and agility, whether you&apos;re already practicing SAFe or just starting to scale. It&apos;s designed for anyone responsible for bridging the gap between strategic vision and delivery.
            </p>
          </div>
        </section>
      )}

      {/* LPM — WHAT YOU'LL LEARN */}
      {params.slug === "safe-lpm" && (
        <section className="w-full bg-navy py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white">What You&apos;ll Learn</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
                Advanced portfolio skills to connect strategy to execution and fund the right work at the right time.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-xl border-l-4 border-[#00A5F0] bg-[#00234B] p-8">
                <h3 className="text-xl font-bold text-white">Align Strategy with Execution</h3>
                <p className="mt-3 leading-relaxed text-muted">Connect portfolio initiatives directly to business strategy and keep investments focused on the most important outcomes. Bridge the gap between vision and what teams actually deliver.</p>
              </div>
              <div className="rounded-xl border-l-4 border-[#00A5F0] bg-[#00234B] p-8">
                <h3 className="text-xl font-bold text-white">Lean Budgeting &amp; Portfolio Flow</h3>
                <p className="mt-3 leading-relaxed text-muted">Explore how to fund value streams, establish guardrails, and manage epics using portfolio kanban to support continuous, lean flow. Move away from annual budgeting cycles toward dynamic funding.</p>
              </div>
              <div className="rounded-xl border-l-4 border-[#00A5F0] bg-[#00234B] p-8">
                <h3 className="text-xl font-bold text-white">Run Agile Portfolio Operations</h3>
                <p className="mt-3 leading-relaxed text-muted">Gain practical tools for coordinating across value streams, managing change, and supporting excellence through agile PMOs and communities of practice. Keep the portfolio moving without command-and-control.</p>
              </div>
              <div className="rounded-xl border-l-4 border-[#00A5F0] bg-[#00234B] p-8">
                <h3 className="text-xl font-bold text-white">Design Your LPM Adoption Plan</h3>
                <p className="mt-3 leading-relaxed text-muted">Capture your current state, define your portfolio vision, and build a step-by-step plan to bring Lean Portfolio Management to life. Leave with a concrete roadmap, not just theory.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LPM — YOUTUBE EMBED */}
      {params.slug === "safe-lpm" && (
        <section className="w-full bg-navyMid py-12 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white">See What LPM Covers</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
                <iframe
                  src="https://www.youtube.com/embed/IcemmmTPVzs"
                  title="Lean Portfolio Management Course Overview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SSM — WHO THIS IS FOR */}
      {params.slug === "safe-scrum-master" && (
        <section className="w-full bg-navyMid py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white">Who Is This Course For?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
                The SAFe Scrum Master certification is designed for facilitators and problem-solvers who want to guide Agile teams in an enterprise environment.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Project Managers */}
              <div className="rounded-xl border border-[#00487B] bg-navy p-8 transition-colors duration-200 hover:border-cyan">
                <div className="mb-4 flex h-10 w-10 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#00A5F0]">Project Managers</h3>
                <p className="mt-3 leading-relaxed text-muted">Transition from traditional project tracking to Agile facilitation, using AI to streamline workflows and improve predictability across complex enterprise projects.</p>
              </div>
              {/* Engineers & Developers */}
              <div className="rounded-xl border border-[#00487B] bg-navy p-8 transition-colors duration-200 hover:border-cyan">
                <div className="mb-4 flex h-10 w-10 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#00A5F0]">Engineers &amp; Developers</h3>
                <p className="mt-3 leading-relaxed text-muted">Understand the mechanics of SAFe to improve technical collaboration, eliminate bottlenecks, and contribute more effectively to the Agile Release Train.</p>
              </div>
              {/* Customer Support */}
              <div className="rounded-xl border border-[#00487B] bg-navy p-8 transition-colors duration-200 hover:border-cyan">
                <div className="mb-4 flex h-10 w-10 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#00A5F0]">Customer Support Professionals</h3>
                <p className="mt-3 leading-relaxed text-muted">Enhance responsiveness and feedback loops between teams and customers, ensuring rapid value delivery and improved service alignment.</p>
              </div>
              {/* HR Professionals */}
              <div className="rounded-xl border border-[#00487B] bg-navy p-8 transition-colors duration-200 hover:border-cyan">
                <div className="mb-4 flex h-10 w-10 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#00A5F0]">HR Professionals</h3>
                <p className="mt-3 leading-relaxed text-muted">Apply Agile mindsets to talent development and team dynamics, fostering a culture of continuous learning and high performance.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SSM — WHAT YOU'LL LEARN */}
      {params.slug === "safe-scrum-master" && (
        <section className="w-full bg-navy py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white">What You&apos;ll Learn</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
                The core skills to facilitate high-performing Agile teams and align delivery across an enterprise.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-xl border-l-4 border-[#00A5F0] bg-[#00234B] p-8">
                <h3 className="text-xl font-bold text-white">Facilitate Productive Team Events</h3>
                <p className="mt-3 leading-relaxed text-muted">Lead effective Team Syncs, Iteration Planning, and Retrospectives to keep work flowing. Ensure the team remains focused on delivering high-quality value every iteration.</p>
              </div>
              <div className="rounded-xl border-l-4 border-[#00A5F0] bg-[#00234B] p-8">
                <h3 className="text-xl font-bold text-white">Remove Team Impediments</h3>
                <p className="mt-3 leading-relaxed text-muted">Shield the team from external distractions and resolve technical or organizational blockers that slow progress. Create a clear path for execution and delivery.</p>
              </div>
              <div className="rounded-xl border-l-4 border-[#00A5F0] bg-[#00234B] p-8">
                <h3 className="text-xl font-bold text-white">Coach Lean-Agile Practices</h3>
                <p className="mt-3 leading-relaxed text-muted">Guide teams in adopting Scrum, Kanban, and Built-in Quality practices while fostering self-management and autonomy. Drive relentless improvement through data-driven insights.</p>
              </div>
              <div className="rounded-xl border-l-4 border-[#00A5F0] bg-[#00234B] p-8">
                <h3 className="text-xl font-bold text-white">Coordinate Cross-Team Value Delivery</h3>
                <p className="mt-3 leading-relaxed text-muted">Collaborate with Product Owners, other Scrum Masters, and the Release Train Engineer to manage dependencies. Align team efforts with the broader Agile Release Train.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SSM — YOUTUBE EMBED */}
      {params.slug === "safe-scrum-master" && (
        <section className="w-full bg-navyMid py-12 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white">See What SAFe Scrum Master Covers</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
                <iframe
                  src="https://www.youtube.com/embed/V10GGnS4Ca0"
                  title="SAFe Scrum Master Course Overview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LEADING SAFE — WHO THIS IS FOR */}
      {params.slug === "leading-safe" && (
        <section className="w-full bg-navyMid py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white">Who Is This Course For?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
                Leading SAFe is designed for current and aspiring leaders driving transformation in complex environments.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Executives */}
              <div className="rounded-xl border border-[#00487B] bg-navy p-8 transition-colors duration-200 hover:border-cyan">
                <div className="mb-4 flex h-10 w-10 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#00A5F0]">Executives</h3>
                <p className="mt-3 leading-relaxed text-muted">Align strategy with execution and leverage AI to accelerate high-level decision-making across the enterprise.</p>
              </div>
              {/* Directors */}
              <div className="rounded-xl border border-[#00487B] bg-navy p-8 transition-colors duration-200 hover:border-cyan">
                <div className="mb-4 flex h-10 w-10 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#00A5F0]">Directors</h3>
                <p className="mt-3 leading-relaxed text-muted">Transition from traditional management to Lean-Agile leadership and optimize team flow.</p>
              </div>
              {/* Product Managers */}
              <div className="rounded-xl border border-[#00487B] bg-navy p-8 transition-colors duration-200 hover:border-cyan">
                <div className="mb-4 flex h-10 w-10 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#00A5F0]">Product Managers</h3>
                <p className="mt-3 leading-relaxed text-muted">Drive customer-centricity and apply SAFe to prioritize backlogs and define high-impact features.</p>
              </div>
              {/* Agile Coaches */}
              <div className="rounded-xl border border-[#00487B] bg-navy p-8 transition-colors duration-200 hover:border-cyan">
                <div className="mb-4 flex h-10 w-10 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#00A5F0]">Agile Coaches</h3>
                <p className="mt-3 leading-relaxed text-muted">Empower teams to reach high performance by integrating Lean-Agile practices and AI-driven insights.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LEADING SAFE — WHAT YOU'LL LEARN */}
      {params.slug === "leading-safe" && (
        <section className="w-full bg-navy py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white">What You&apos;ll Learn</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
                Strategic skills to lead Lean-Agile transformation and deliver value at scale.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-xl border-l-4 border-[#00A5F0] bg-[#00234B] p-8">
                <h3 className="text-xl font-bold text-white">Drive Business Agility</h3>
                <p className="mt-3 leading-relaxed text-muted">Apply SAFe principles to sustain a successful Lean-Agile transformation. Build the organizational habits that make agility stick long after the training ends.</p>
              </div>
              <div className="rounded-xl border-l-4 border-[#00A5F0] bg-[#00234B] p-8">
                <h3 className="text-xl font-bold text-white">Create Strategic Alignment</h3>
                <p className="mt-3 leading-relaxed text-muted">Move from traditional hierarchies to teams organized around value. Align your entire organization around clear objectives to improve the flow of work.</p>
              </div>
              <div className="rounded-xl border-l-4 border-[#00A5F0] bg-[#00234B] p-8">
                <h3 className="text-xl font-bold text-white">Execute PI Planning</h3>
                <p className="mt-3 leading-relaxed text-muted">Lead and participate in Program Increment Planning to synchronize teams and departments around shared goals. Understand the heartbeat of SAFe delivery.</p>
              </div>
              <div className="rounded-xl border-l-4 border-[#00A5F0] bg-[#00234B] p-8">
                <h3 className="text-xl font-bold text-white">Foster Customer Centricity</h3>
                <p className="mt-3 leading-relaxed text-muted">Apply Lean-Agile mindsets and Design Thinking to build solutions that meet real market needs. Put the customer at the center of every decision.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LEADING SAFE — YOUTUBE EMBED */}
      {params.slug === "leading-safe" && (
        <section className="w-full bg-navyMid py-12 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white">See What Leading SAFe Covers</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
                <iframe
                  src="https://www.youtube.com/embed/URr1ufudorM"
                  title="Leading SAFe Course Overview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2 — WHAT'S INCLUDED */}
      <section className={`w-full ${hasCustomSections ? "bg-navy" : "bg-navyMid"} py-16 px-4`}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm uppercase tracking-widest text-cyan">
              What&apos;s Included
            </p>
            <h2 className="mt-2 text-4xl font-bold text-white">
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
                className={`rounded-xl border border-[#00487B] ${hasCustomSections ? "bg-navyMid" : "bg-navy"} p-8 transition-colors duration-200 hover:border-cyan`}
              >
                {feature.icon}
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* POPM — EXAM AT A GLANCE */}
      {params.slug === "safe-popm" && (
        <section className="w-full bg-navyMid py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-white">Exam At a Glance</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-[#000E22] p-8 text-center">
                <p className="text-3xl font-bold text-[#00A5F0]">90 Minutes</p>
                <p className="mt-2 text-sm text-gray-400">Exam Duration</p>
              </div>
              <div className="rounded-xl bg-[#000E22] p-8 text-center">
                <p className="text-3xl font-bold text-[#00A5F0]">45 Questions</p>
                <p className="mt-2 text-sm text-gray-400">Multiple Choice</p>
              </div>
              <div className="rounded-xl bg-[#000E22] p-8 text-center">
                <p className="text-3xl font-bold text-[#00A5F0]">82%</p>
                <p className="mt-2 text-sm text-gray-400">Passing Score</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* POPM — EXAM DOMAIN BREAKDOWN */}
      {params.slug === "safe-popm" && (
        <section className="w-full bg-navy py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-4">
              <h2 className="text-4xl font-bold text-white">Exam Domain Breakdown</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
                The exam covers six domains. Here&apos;s what to expect on each.
              </p>
            </div>
            <PoPMExamDomainAccordion />
          </div>
        </section>
      )}

      {/* LPM — EXAM AT A GLANCE */}
      {params.slug === "safe-lpm" && (
        <section className="w-full bg-navyMid py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-white">Exam At a Glance</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-[#000E22] p-8 text-center">
                <p className="text-3xl font-bold text-[#00A5F0]">90 Minutes</p>
                <p className="mt-2 text-sm text-gray-400">Exam Duration</p>
              </div>
              <div className="rounded-xl bg-[#000E22] p-8 text-center">
                <p className="text-3xl font-bold text-[#00A5F0]">45 Questions</p>
                <p className="mt-2 text-sm text-gray-400">Multiple Choice</p>
              </div>
              <div className="rounded-xl bg-[#000E22] p-8 text-center">
                <p className="text-3xl font-bold text-[#00A5F0]">80%</p>
                <p className="mt-2 text-sm text-gray-400">Passing Score</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LPM — EXAM DOMAIN BREAKDOWN */}
      {params.slug === "safe-lpm" && (
        <section className="w-full bg-navy py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-4">
              <h2 className="text-4xl font-bold text-white">Exam Domain Breakdown</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
                The LPM exam tests your ability to apply Lean Portfolio Management across four core functions.
              </p>
            </div>
            <LPMExamDomainAccordion />
          </div>
        </section>
      )}

      {/* SSM — EXAM AT A GLANCE */}
      {params.slug === "safe-scrum-master" && (
        <section className="w-full bg-navyMid py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-white">Exam At a Glance</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-[#000E22] p-8 text-center">
                <p className="text-3xl font-bold text-[#00A5F0]">90 Minutes</p>
                <p className="mt-2 text-sm text-gray-400">Exam Duration</p>
              </div>
              <div className="rounded-xl bg-[#000E22] p-8 text-center">
                <p className="text-3xl font-bold text-[#00A5F0]">45 Questions</p>
                <p className="mt-2 text-sm text-gray-400">Multiple Choice</p>
              </div>
              <div className="rounded-xl bg-[#000E22] p-8 text-center">
                <p className="text-3xl font-bold text-[#00A5F0]">73%</p>
                <p className="mt-2 text-sm text-gray-400">Passing Score</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SSM — EXAM DOMAIN BREAKDOWN */}
      {params.slug === "safe-scrum-master" && (
        <section className="w-full bg-navy py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-4">
              <h2 className="text-4xl font-bold text-white">Exam Domain Breakdown</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
                The exam covers four domains. Here&apos;s what to expect on each.
              </p>
            </div>
            <SSMExamDomainAccordion />
          </div>
        </section>
      )}

      {/* LEADING SAFE — EXAM AT A GLANCE */}
      {params.slug === "leading-safe" && (
        <section className="w-full bg-navyMid py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-white">Exam At a Glance</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-[#000E22] p-8 text-center">
                <p className="text-3xl font-bold text-[#00A5F0]">90 Minutes</p>
                <p className="mt-2 text-sm text-gray-400">Exam Duration</p>
              </div>
              <div className="rounded-xl bg-[#000E22] p-8 text-center">
                <p className="text-3xl font-bold text-[#00A5F0]">45 Questions</p>
                <p className="mt-2 text-sm text-gray-400">Multiple Choice</p>
              </div>
              <div className="rounded-xl bg-[#000E22] p-8 text-center">
                <p className="text-3xl font-bold text-[#00A5F0]">80%</p>
                <p className="mt-2 text-sm text-gray-400">Passing Score</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LEADING SAFE — EXAM DOMAIN BREAKDOWN */}
      {params.slug === "leading-safe" && (
        <section className="w-full bg-navy py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-4">
              <h2 className="text-4xl font-bold text-white">Exam Domain Breakdown</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
                The exam covers six domains. Here&apos;s what to expect on each.
              </p>
            </div>
            <ExamDomainAccordion />
          </div>
        </section>
      )}

      {/* SECTION 3 — UPCOMING SCHEDULES */}
      <section id="schedules" className={`w-full ${hasCustomSections ? "bg-navyMid" : "bg-navy"} py-16 px-4`}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">Upcoming Dates</h2>
          </div>

          {typedSchedules.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {typedSchedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  course={typedCourse}
                  darkBg={hasCustomSections}
                />
              ))}
            </div>
          ) : (
            <div className={`mt-12 rounded-xl border border-[#00487B] ${hasCustomSections ? "bg-navy" : "bg-navyMid"} p-12 text-center`}>
              <p className="text-xl font-semibold text-white">
                New dates coming soon.
              </p>
              <p className="mt-2 text-muted">
                Contact us to be added to the waitlist for the next cohort.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-block rounded-lg bg-cyan px-8 py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
              >
                Join the Waitlist
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4 — INSTRUCTOR */}
      <section className={`w-full ${hasCustomSections ? "bg-navy" : "bg-navyMid"} py-16 px-4`}>
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-bold text-white">Your Instructor</h2>

          <div className="mt-12 grid grid-cols-1 gap-16 md:grid-cols-3 md:items-start">
            {/* Photo */}
            <div className="flex justify-center md:justify-start">
              <Image
                src={instructor?.photo_url ?? "/headshot.jpg"}
                alt={instructor?.name ?? "Instructor"}
                width={400}
                height={500}
                className="rounded-2xl border-2 border-[#00487B] object-cover"
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-5 md:col-span-2">
              <h3 className="text-3xl font-bold text-white">
                {instructor?.name ?? "John Nichols"}
              </h3>
              {instructor?.bio ? (
                <p className="text-lg leading-relaxed text-muted">
                  {instructor.bio}
                </p>
              ) : (
                <p className="text-lg leading-relaxed text-muted">
                  Agile coach, consultant, and SAFe-certified trainer with 15+
                  years of experience guiding federal agencies — including the
                  U.S. Census Bureau, Federal Reserve, Department of Commerce,
                  Department of Justice, and OMB — alongside private-sector
                  organizations navigating transformation. Founder of Atomic
                  Agility. 100+ professionals certified.
                </p>
              )}
              <a
                href={
                  instructor?.linkedin_url ??
                  "https://www.linkedin.com/in/john-tyler-nichols/"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-cyan hover:underline"
              >
                Connect on LinkedIn &rarr;
              </a>

              {/* Founder credential metrics — shared with Homepage + About */}
              <div className="mt-2">
                <MetricGrid />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — CTA BANNER */}
      <section className="w-full bg-gradient-to-b from-navy to-navyMid py-24 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-bold text-white">Ready to Register?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Spots are limited to 10 students per class.
          </p>
          <div className="mt-10">
            <Link
              href={`/training/${typedCourse.slug}/register`}
              className="inline-block rounded-lg bg-cyan px-8 py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
