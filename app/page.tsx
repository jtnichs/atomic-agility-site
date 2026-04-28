import Image from "next/image";
import Link from "next/link";
import TestimonialCarousel from "@/components/TestimonialCarousel";

// --- Icons ---

function CoachingIcon() {
  // lucide-react "UserRound" — single rounded figure that reads clearly as one coach
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-cyan mb-4"
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
      className="h-10 w-10 text-cyan mb-4"
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
  { value: "100+", label: "Professionals Coached" },
  { value: "9.43/10", label: "Likelihood to Recommend" },
];

// --- Agencies ---

const agencies = [
  { src: "/images/agencies/census-seal.svg", alt: "U.S. Census Bureau seal" },
  { src: "/images/agencies/federal-reserve-seal.svg", alt: "Federal Reserve seal" },
  { src: "/images/agencies/doc-seal.svg", alt: "U.S. Department of Commerce seal" },
  { src: "/images/agencies/doj-seal.svg", alt: "U.S. Department of Justice seal" },
  { src: "/images/agencies/omb-seal.svg", alt: "Office of Management and Budget seal" },
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
            We help teams, leaders, entrepreneurs, and enterprises build
            sustainable agility through coaching, training, and transformation
            support.
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

          {/* Body copy */}
          <div className="mx-auto mt-16 max-w-3xl space-y-6 text-lg leading-relaxed text-muted">
            <p>
              AI isn&apos;t a future concern — it&apos;s reshaping how we
              operate right now. Most agile frameworks weren&apos;t designed
              with this kind of disruption in mind.
            </p>
            <p>
              Atomic Agility was. Our approach combines 15 years of real-world
              agile experience with a framework specifically designed for
              businesses, organizations, and entrepreneurs navigating
              technological disruption.
            </p>
            <p>
              We&apos;re not AI influencers who discovered agile. We&apos;re
              agile coaches who&apos;ve been preparing for this moment.
            </p>
          </div>

          {/* Stat grid — 1-up mobile, 2-up tablet, 4-up desktop */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      </section>

      {/* SECTION 4 — CREDENTIALS STRIP */}
      <section className="w-full bg-navyMid py-12 px-4">
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
                height={64}
                className="h-16 w-auto"
              />
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
