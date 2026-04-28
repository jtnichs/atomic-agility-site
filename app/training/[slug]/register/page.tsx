"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// --- Types ---

interface Course {
  id: string;
  title: string;
  slug: string;
  price_cents: number;
}

interface Schedule {
  id: string;
  start_date: string;
  end_date: string;
  price_cents: number | null;
  delivery_mode: string | null;
  max_seats: number | null;
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
  const opts: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", opts)}`;
}

function normalizeCourse(raw: Course | Course[]): Course {
  return Array.isArray(raw) ? raw[0] : raw;
}

// --- Input styles ---
const inputClass =
  "w-full rounded-lg border border-[#00487B] bg-[#00234B] px-4 py-3 text-white placeholder-[#94a3b8] focus:border-[#00A5F0] focus:outline-none transition-colors duration-200";
const labelClass = "block text-sm text-[#94a3b8] mb-2";

// --- Spinner ---
function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// --- Page ---

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scheduleId = searchParams.get("schedule");

  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [hearAboutUs, setHearAboutUs] = useState("");
  const [accessibility, setAccessibility] = useState("");

  // Load schedule + course on mount
  useEffect(() => {
    if (!scheduleId) {
      setLoading(false);
      return;
    }
    async function load() {
      const { data, error: fetchError } = await supabase
        .from("schedules")
        .select(
          `id, start_date, end_date, price_cents, delivery_mode, max_seats,
           courses ( id, title, slug, price_cents )`
        )
        .eq("id", scheduleId)
        .single();

      if (fetchError || !data) {
        setError("Could not load schedule details. Please try again.");
      } else {
        const s = data as Schedule;
        setSchedule(s);
        setCourse(normalizeCourse(s.courses));
      }
      setLoading(false);
    }
    load();
  }, [scheduleId]);

  const schedulePriceCents = schedule?.price_cents ?? null;
  const coursePriceCents = course?.price_cents ?? 0;
  const isDiscounted =
    schedulePriceCents !== null && schedulePriceCents < coursePriceCents;
  const displayPrice =
    schedulePriceCents !== null ? schedulePriceCents : coursePriceCents;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !organization.trim() || !jobTitle.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduleId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          organization: organization.trim(),
          jobTitle: jobTitle.trim(),
          hearAboutUs,
          accessibility,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.url) {
        // Surface full error details from the API for debugging
        const detail = json.details
          ? ` — ${JSON.stringify(json.details)}`
          : "";
        setError(`${json.error ?? "Something went wrong. Please try again."}${detail}`);
        setSubmitting(false);
        return;
      }

      router.push(json.url);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  // --- Loading state ---
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy">
        <Spinner />
      </div>
    );
  }

  // --- Missing schedule param ---
  if (!scheduleId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-4 text-center">
        <p className="text-xl text-white">No schedule selected.</p>
        <Link href="/training" className="mt-4 text-cyan hover:underline">
          Return to Training Hub
        </Link>
      </div>
    );
  }

  const dateLabel =
    schedule
      ? formatDateRange(schedule.start_date, schedule.end_date)
      : "Loading…";

  return (
    <>
      {/* HERO */}
      <section className="bg-navy px-4 py-16 text-center">
        <p className="text-sm text-[#94a3b8]">
          <Link href="/training" className="hover:text-white transition-colors duration-200">Training</Link>
          {" → "}
          {course ? (
            <Link href={`/training/${course.slug}`} className="hover:text-white transition-colors duration-200">
              {course.title}
            </Link>
          ) : "Course"}
          {" → "}
          <span className="text-white">Register</span>
        </p>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
          Complete Your Registration
        </h1>
        {course && (
          <p className="mt-3 text-xl font-medium text-cyan">
            {course.title} — {dateLabel}
          </p>
        )}
      </section>

      {/* FORM */}
      <section className="bg-navy px-4 pb-24">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mx-auto max-w-2xl"
        >
          {/* Order Summary */}
          <div className="mb-8 rounded-xl border border-[#00487B] bg-[#00234B] p-6">
            <p className="text-xl font-bold text-white">
              {course?.title ?? "Loading…"}
            </p>
            <div className="mt-3 space-y-1 text-sm text-[#94a3b8]">
              <p>📅 {dateLabel}</p>
              <p>🕘 9:00 AM – 5:00 PM ET</p>
            </div>

            <div className="mt-4 border-t border-[#00487B] pt-4">
              {isDiscounted ? (
                <>
                  <span className="inline-block rounded-full bg-[#00A5F0] px-3 py-1 text-xs font-semibold text-white">
                    Founding Student Rate
                  </span>
                  <p className="mt-2 text-2xl font-bold text-[#00A5F0]">
                    {formatPrice(displayPrice)}
                  </p>
                  <p className="mt-1 text-sm text-[#94a3b8]">
                    <span className="line-through">
                      Regular price {formatPrice(coursePriceCents)}
                    </span>
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold text-[#00A5F0]">
                  {formatPrice(displayPrice)}
                </p>
              )}
            </div>

            <p className="mt-4 text-sm text-[#94a3b8]">
              ✓ Includes: Exam, Post-Class Consulting Session, AI Toolkit,
              Implementation Coaching
            </p>
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-5">
            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className={labelClass}>
                  First Name <span className="text-[#00A5F0]">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                  placeholder="Jane"
                />
              </div>
              <div>
                <label htmlFor="lastName" className={labelClass}>
                  Last Name <span className="text-[#00A5F0]">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                  placeholder="Smith"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address <span className="text-[#00A5F0]">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="jane@yourorg.com"
              />
            </div>

            {/* Organization */}
            <div>
              <label htmlFor="organization" className={labelClass}>
                Organization / Company <span className="text-[#00A5F0]">*</span>
              </label>
              <input
                id="organization"
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className={inputClass}
                placeholder="Your organization"
              />
            </div>

            {/* Job Title */}
            <div>
              <label htmlFor="jobTitle" className={labelClass}>
                Job Title / Role <span className="text-[#00A5F0]">*</span>
              </label>
              <input
                id="jobTitle"
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className={inputClass}
                placeholder="Scrum Master, Product Owner, etc."
              />
            </div>

            {/* How did you hear */}
            <div>
              <label htmlFor="hearAboutUs" className={labelClass}>
                How did you hear about us?
              </label>
              <select
                id="hearAboutUs"
                value={hearAboutUs}
                onChange={(e) => setHearAboutUs(e.target.value)}
                className={inputClass}
              >
                <option value="">Select an option…</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Google Search">Google Search</option>
                <option value="Colleague Referral">Colleague Referral</option>
                <option value="Scaled Agile Website">Scaled Agile Website</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Accessibility */}
            <div>
              <label htmlFor="accessibility" className={labelClass}>
                Accessibility needs or special accommodations{" "}
                <span className="text-[#94a3b8] opacity-60">(optional)</span>
              </label>
              <textarea
                id="accessibility"
                rows={3}
                value={accessibility}
                onChange={(e) => setAccessibility(e.target.value)}
                className={inputClass}
                placeholder="Let us know if you have any accessibility needs or special accommodations."
              />
            </div>
          </div>

          {/* Refund policy */}
          <p className="mt-4 text-sm text-[#94a3b8]">
            Full refund if cancelled 7 or more days before class start. No
            refund within 7 days, but you may transfer your registration to a
            future cohort.
          </p>

          {/* Error */}
          {error && (
            <p className="mt-4 rounded-lg border border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg bg-[#00A5F0] py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Spinner />
                Processing…
              </>
            ) : (
              "Proceed to Payment →"
            )}
          </button>
        </form>
      </section>
    </>
  );
}
