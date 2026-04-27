import Link from "next/link";
import TestimonialCarousel from "@/components/TestimonialCarousel";

// --- Icons ---

function CoachingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-cyan mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-1a4 4 0 00-5.916-3.52M9 20H4v-1a4 4 0 015.916-3.52M15 7a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 11-6 0 3 3 0 016 0zm-18 0a3 3 0 116 0 3 3 0 01-6 0z"
      />
    </svg>
  );
}

function TrainingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-cyan mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25"
      />
    </svg>
  );
}

function TransformIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-cyan mb-4"
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

// --- Service Cards ---

const services = [
  {
    icon: <CoachingIcon />,
    title: "Agile Coaching",
    body: "Hands-on, personalized coaching for teams and leaders navigating real-world agile adoption. We meet you where you are.",
  },
  {
    icon: <TrainingIcon />,
    title: "Training & Workshops",
    body: "SAFe certification training and custom agile workshops designed for the way modern organizations actually work.",
  },
  {
    icon: <TransformIcon />,
    title: "Enterprise Transformation",
    body: "Strategic agile transformation for large organizations. Scale agility with speed, alignment, and lasting cultural change.",
  },
];

// --- Stats ---

const stats = [
  { value: "15+", label: "Years of Agile Experience" },
  { value: "5+", label: "Federal Agencies Served" },
  { value: "SAFe", label: "Certified Practitioners" },
  { value: "100+", label: "Teams Coached" },
  { value: "9.43/10", label: "Likelihood to Recommend" },
];

// --- Agencies ---

const agencies = [
  "U.S. Census Bureau",
  "Federal Reserve",
  "Dept. of Commerce",
  "Dept. of Justice",
  "OMB",
];

// --- Page ---

export default function Home() {
  return (
    <>
      {/* SECTION 1 — HERO */}
      <section className="relative flex min-h-screen flex-col items-center justify-center bg-navy px-4 text-center">
        <h1 className="text-5xl font-bold text-white md:text-7xl">
          Built for This Moment.
        </h1>
        <p className="mt-4 text-2xl font-medium text-cyan md:text-3xl">
          Agile Coaching for the AI Age.
        </p>
        <p className="mt-4 text-lg text-muted">Start small. React rapidly.</p>
        <p className="mt-6 max-w-2xl text-base text-muted">
          AI is reshaping how teams work. Atomic Agility helps organizations
          adapt with the clarity, speed, and structure that agile was always
          meant to provide.
        </p>
        <Link
          href="/contact"
          className="mt-10 rounded-lg bg-cyan px-8 py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
        >
          Work With Us
        </Link>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 flex animate-bounce flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* SECTION 2 — WHAT WE DO */}
      <section className="w-full bg-navyMid py-24 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm uppercase tracking-widest text-cyan">What We Do</p>
          <h2 className="mt-2 text-4xl font-bold text-white">
            Real Agility. Practical Results.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            We help teams, leaders, and enterprises build sustainable agility
            through coaching, training, and transformation support.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {services.map((svc) => (
              <div
                key={svc.title}
                className="group rounded-xl border border-[#00487B] bg-navy p-8 text-left transition-colors duration-200 hover:border-cyan"
              >
                {svc.icon}
                <h3 className="text-xl font-bold text-white">{svc.title}</h3>
                <p className="mt-3 text-muted leading-relaxed">{svc.body}</p>
                <Link
                  href="/services"
                  className="mt-6 inline-block text-cyan hover:underline"
                >
                  Learn more &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — WHY ATOMIC AGILITY */}
      <section className="w-full bg-navy py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm uppercase tracking-widest text-cyan">
              Why Atomic Agility
            </p>
            <h2 className="mt-2 text-4xl font-bold text-white">
              A Framework Built for Disruption.
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-16 md:grid-cols-2 md:items-center">
            {/* Left — body copy */}
            <div className="space-y-6 text-lg leading-relaxed text-muted">
              <p>
                AI isn&apos;t a future concern — it&apos;s reshaping how teams
                operate right now. Most agile frameworks weren&apos;t designed
                with this kind of disruption in mind.
              </p>
              <p>
                Atomic Agility was. Our approach combines 15 years of
                real-world agile experience with a framework specifically
                designed for organizations navigating technological disruption.
              </p>
              <p>
                We&apos;re not AI influencers who discovered agile. We&apos;re
                agile coaches who&apos;ve been preparing for this moment.
              </p>
            </div>

            {/* Right — stat grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[#00487B] bg-navyMid p-6 text-center"
                >
                  <p className="text-4xl font-bold text-cyan">{stat.value}</p>
                  <p className="mt-2 text-sm text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — CREDENTIALS STRIP */}
      <section className="w-full bg-navyMid py-12 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm uppercase tracking-widest text-muted">
            Trusted by Leading Federal Agencies
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
            {agencies.map((agency) => (
              <span
                key={agency}
                className="rounded-lg border border-[#00487B] bg-navy px-6 py-3 text-lg font-medium text-white"
              >
                {agency}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — TESTIMONIALS */}
      <section className="w-full bg-navyMid py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-cyan">
              What Our Students Say
            </p>
            <h2 className="mt-2 text-4xl font-bold text-white">
              Trusted by Practitioners Across Government and Industry
            </h2>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* SECTION 6 — CTA BANNER */}
      <section className="w-full bg-gradient-to-b from-navy to-navyMid py-24 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-bold text-white">
            Ready to Build Real Agility?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Let&apos;s talk about where your organization is and where it needs
            to go.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-lg bg-cyan px-8 py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
            >
              Schedule a Consultation
            </Link>
            <Link
              href="/services"
              className="rounded-lg border border-cyan px-8 py-4 text-lg font-semibold text-cyan transition-colors duration-200 hover:bg-cyan hover:text-white"
            >
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
