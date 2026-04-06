import Image from "next/image";
import Link from "next/link";

// --- Icons for Approach cards ---

function StartSmallIcon() {
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
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}

function ReactRapidlyIcon() {
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
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}

function DisruptionIcon() {
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

// --- Data ---

const stats = [
  { value: "15+", label: "Years of Experience" },
  { value: "5+", label: "Federal Agencies Served" },
  { value: "100+", label: "Teams Coached" },
  { value: "SAFe", label: "Certified Practitioner" },
];

const principles = [
  {
    icon: <StartSmallIcon />,
    title: "Start Small",
    body: "We don't believe in big-bang transformations. We help teams identify the smallest meaningful change and build momentum from there.",
  },
  {
    icon: <ReactRapidlyIcon />,
    title: "React Rapidly",
    body: "Agility is meaningless without speed. We build the feedback loops and decision-making structures that let organizations respond in real time.",
  },
  {
    icon: <DisruptionIcon />,
    title: "Built for Disruption",
    body: "AI is changing how teams work. Our framework was designed for organizations navigating technological disruption — not adapted from a pre-AI playbook.",
  },
];

// --- Page ---

export default function About() {
  return (
    <>
      {/* SECTION 1 — PAGE HERO */}
      <section className="relative flex flex-col items-center justify-center bg-navy px-4 py-32 text-center">
        <h1 className="text-5xl font-bold text-white md:text-7xl">
          About Atomic Agility
        </h1>
        <p className="mt-4 text-2xl font-medium text-cyan md:text-3xl">
          15 Years. Real Teams. Real Results.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          We didn&apos;t discover agile during the AI boom. We&apos;ve been
          building agile organizations for 15 years — and we built our framework
          for exactly this moment.
        </p>
      </section>

      {/* SECTION 2 — OUR FOUNDER */}
      <section className="w-full bg-navy py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:items-start">
            {/* Left — headshot */}
            <div className="flex justify-center md:justify-start">
              <Image
                src="/headshot.jpg"
                alt="John Nichs, Founder of Atomic Agility"
                width={400}
                height={500}
                className="rounded-2xl border-2 border-[#00487B] object-cover"
              />
            </div>

            {/* Right — bio (spans 2 columns) */}
            <div className="flex flex-col gap-6 md:col-span-2">
              <div>
                <p className="text-sm uppercase tracking-widest text-cyan">
                  Our Founder
                </p>
                <h2 className="mt-2 text-4xl font-bold text-white">
                  John Nichs
                </h2>
              </div>

              <div className="space-y-5 text-lg leading-relaxed text-muted">
                <p>
                  John Nichs is an agile coach and consultant with 15 years of
                  experience helping teams and organizations build real,
                  sustainable agility. His work spans federal government,
                  enterprise, and high-growth organizations.
                </p>
                <p>
                  Before founding Atomic Agility, John led agile transformations
                  at some of the most complex organizations in the federal
                  government — including the U.S. Census Bureau, Federal
                  Reserve, Department of Commerce, Department of Justice, and
                  the Office of Management and Budget.
                </p>
                <p>
                  Atomic Agility was built on a simple belief: agile done right
                  is a competitive advantage. Not a process. Not a ceremony. A
                  way of working that lets organizations move faster, adapt
                  smarter, and deliver more value — especially in times of
                  disruption.
                </p>
              </div>

              <a
                href="https://linkedin.com/in/jtnichs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-cyan hover:underline"
              >
                Connect on LinkedIn &rarr;
              </a>

              {/* Stat grid */}
              <div className="mt-4 grid grid-cols-2 gap-6">
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
        </div>
      </section>

      {/* SECTION 3 — OUR APPROACH */}
      <section className="w-full bg-navyMid py-24 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm uppercase tracking-widest text-cyan">
            Our Approach
          </p>
          <h2 className="mt-2 text-4xl font-bold text-white">
            Simple. Clear. Actionable Agility.
          </h2>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="group rounded-xl border border-[#00487B] bg-navy p-8 text-left transition-colors duration-200 hover:border-cyan"
              >
                {principle.icon}
                <h3 className="text-xl font-bold text-white">
                  {principle.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">
                  {principle.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — BOTTOM CTA BANNER */}
      <section className="w-full bg-gradient-to-b from-navy to-navyMid py-24 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-bold text-white">
            Ready to Work Together?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Let&apos;s start with a conversation about where your organization
            is and where it needs to go.
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
