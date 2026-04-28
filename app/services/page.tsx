import Image from "next/image";
import Link from "next/link";
import TestimonialGrid from "@/components/TestimonialGrid";

// --- Icons ---

function CoachingIcon() {
  // lucide-react "UserRound" — single rounded figure that reads clearly as one coach
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12 text-cyan"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}

function TrainingIcon() {
  // lucide-react "Presentation" — board on a stand, the clearest "teaching surface" read
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12 text-cyan"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 3h20" />
      <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
      <path d="m7 21 5-5 5 5" />
    </svg>
  );
}

function TransformIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12 text-cyan"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
      />
    </svg>
  );
}

// --- Data ---

const agencies = [
  { src: "/images/agencies/census-seal.svg", alt: "U.S. Census Bureau seal" },
  { src: "/images/agencies/federal-reserve-seal.svg", alt: "Federal Reserve seal" },
  { src: "/images/agencies/doc-seal.svg", alt: "U.S. Department of Commerce seal" },
  { src: "/images/agencies/doj-seal.svg", alt: "U.S. Department of Justice seal" },
  { src: "/images/agencies/omb-seal.svg", alt: "Office of Management and Budget seal" },
];

// --- Page ---

export default function Services() {
  return (
    <>
      {/* SECTION 1 — PAGE HERO */}
      <section className="relative flex flex-col items-center justify-center bg-navy px-4 py-32 text-center">
        <h1 className="text-5xl font-bold text-white md:text-7xl">
          Our Services
        </h1>
        <p className="mt-4 text-2xl font-medium text-cyan md:text-3xl">
          Coaching, Training, and Transformation for the AI Age.
        </p>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          We meet you where you are and build toward where you need to go.
        </p>
      </section>

      {/* SECTION 2 — SERVICE 1: AGILE COACHING */}
      <section className="w-full bg-navyMid py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:items-start">
            {/* Left — identity */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <CoachingIcon />
                <h2 className="text-4xl font-bold text-white">Agile Coaching</h2>
              </div>
              <p className="text-lg leading-relaxed text-muted">
                Whether you&apos;re just starting your agile journey or trying
                to break through a plateau, our coaching goes beyond frameworks.
                We embed with your teams, identify what&apos;s actually blocking
                progress, and build the habits that make agility stick.
              </p>
              <Link
                href="/contact"
                className="mt-2 inline-block self-start rounded-lg bg-cyan px-8 py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
              >
                Schedule a Coaching Consultation
              </Link>
            </div>

            {/* Right — details */}
            <div className="rounded-xl border border-[#00487B] bg-navy p-8">
              <p className="text-sm uppercase tracking-widest text-cyan">
                Who It&apos;s For
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  "Teams adopting agile for the first time",
                  "Organizations struggling with inconsistent agile practices",
                  "Leaders who want to build a coaching culture internally",
                  "Startup founders and entrepreneurs embedding Lean Startup discipline from day one.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-cyan" />
                    <span className="text-muted leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — SERVICE 2: TRAINING & WORKSHOPS */}
      <section className="w-full bg-navy py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:items-start">
            {/* Left — details (reversed order on desktop) */}
            <div className="rounded-xl border border-[#00487B] bg-navyMid p-8 md:order-first">
              <p className="text-sm uppercase tracking-widest text-cyan">
                What&apos;s Included
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  "SAFe Certification Courses",
                  "Custom Agile Workshops",
                  "AI & Agile Integration Workshops",
                  "Post-class resources and consulting support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-cyan" />
                    <span className="text-muted leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — identity */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <TrainingIcon />
                <h2 className="text-4xl font-bold text-white">
                  Training &amp; Workshops
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-muted">
                Our training programs are built for how modern organizations
                actually learn — practical, scenario-based, and immediately
                applicable. We offer SAFe certification training and custom
                workshops tailored to your team&apos;s specific context.
              </p>
              <Link
                href="/training"
                className="mt-2 inline-block self-start rounded-lg bg-cyan px-8 py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
              >
                View Upcoming Training
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — SERVICE 3: ENTERPRISE TRANSFORMATION */}
      <section className="w-full bg-navyMid py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:items-start">
            {/* Left — identity */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <TransformIcon />
                <h2 className="text-4xl font-bold text-white">
                  Enterprise Transformation
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-muted">
                Large-scale agile transformation requires more than a framework
                rollout. We work at the strategic level — aligning leadership,
                restructuring delivery, and building the operating model that
                lets agility scale across your entire organization.
              </p>
              <Link
                href="/contact"
                className="mt-2 inline-block self-start rounded-lg bg-cyan px-8 py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
              >
                Talk to Us About Transformation
              </Link>
            </div>

            {/* Right — details */}
            <div className="rounded-xl border border-[#00487B] bg-navy p-8">
              <p className="text-sm uppercase tracking-widest text-cyan">
                Who It&apos;s For
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  "Enterprises beginning a SAFe or LeSS transformation",
                  "Organizations that have tried agile transformation and stalled",
                  "Government agencies modernizing their delivery model",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-cyan" />
                    <span className="text-muted leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — TESTIMONIALS */}
      <section className="w-full bg-navy py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-cyan">
              Student Feedback
            </p>
            <h2 className="mt-2 text-4xl font-bold text-white">
              What Practitioners Say About Training With Us
            </h2>
          </div>

          {/* Scores row */}
          <div className="mt-10">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "Instructor Knowledge", score: "4.87 / 5.0" },
                { label: "Training & Facilitation", score: "4.82 / 5.0" },
                { label: "Training Content", score: "4.60 / 5.0" },
                { label: "Likelihood to Recommend", score: "9.43 / 10.0" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#00487B] bg-navyMid p-6 text-center"
                >
                  <p className="text-3xl font-bold text-cyan">{item.score}</p>
                  <p className="mt-2 text-sm text-muted">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <TestimonialGrid />
          </div>
        </div>
      </section>

      {/* SECTION 6 — CREDENTIALS STRIP */}
      <section className="w-full bg-navy py-12 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm uppercase tracking-widest text-muted">
            Trusted by Leading Federal Agencies
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {agencies.map((agency) => (
              <Image
                key={agency.alt}
                src={agency.src}
                alt={agency.alt}
                width={120}
                height={100}
                className="h-[100px] w-auto"
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — BOTTOM CTA BANNER */}
      <section className="w-full bg-gradient-to-b from-navy to-navyMid py-24 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-bold text-white">
            Not Sure Where to Start?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Every engagement begins with a conversation. Let&apos;s talk about
            your organization and figure out the right fit.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-lg bg-cyan px-8 py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
            >
              Book a Free Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
