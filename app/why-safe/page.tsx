import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// --- Metadata ---

export const metadata: Metadata = {
  title: "Why SAFe? | Atomic Agility",
  description:
    "SAFe is the world's most trusted framework for enterprise agility. Learn why leading organizations choose SAFe — and why Atomic Agility is your certified partner to get there.",
};

// --- Icons for Why SAFe cards ---

function ScaleIcon() {
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
      <path d="M3 6h18" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

function RoadmapIcon() {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function AIIcon() {
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
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

// --- Data ---

const whyCards = [
  {
    icon: <ScaleIcon />,
    title: "Proven at Scale",
    body: "SAFe works regardless of your organization's size, industry, or complexity. It's configurable to fit where you are today and scalable to grow with you.",
  },
  {
    icon: <RoadmapIcon />,
    title: "A Clear Roadmap",
    body: "SAFe provides a step-by-step implementation roadmap built from real enterprise adoption patterns — not theory. You don't have to figure it out from scratch.",
  },
  {
    icon: <AIIcon />,
    title: "Built for the AI Age",
    body: "SAFe 6.0 integrates AI, human-centered design, and continuous learning into the framework — giving teams the structure to move fast without breaking things.",
  },
];

// --- Page ---

export default function WhySAFe() {
  return (
    <>
      {/* ── SECTION 1 — HERO ─────────────────────────────────────────────── */}
      <section className="w-full bg-navy px-4 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:max-w-3xl">
            {/* SAFe logo */}
            <div>
              <img
                src="/images/SAFe/SAFe_New_Logo_white.svg"
                alt="SAFe® Framework Logo"
                width={160}
                height={48}
                className="h-12 w-auto"
              />
            </div>

            <h1 className="text-5xl font-bold text-white md:text-7xl">
              Why SAFe<span className="align-super text-2xl md:text-4xl">®</span>?
            </h1>

            <p className="text-xl font-medium text-cyan md:text-2xl">
              The world&apos;s most trusted framework for enterprise agility —
              and the foundation of every Atomic Agility course.
            </p>

            <div className="mt-2">
              <Link
                href="/training"
                className="inline-block rounded-lg bg-cyan px-8 py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
              >
                Explore Our SAFe Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — WHAT IS SAFe? ────────────────────────────────────── */}
      <section className="w-full bg-navyMid py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:items-start">
            {/* Left — body copy */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm uppercase tracking-widest text-cyan">
                  The Framework
                </p>
                <h2 className="mt-2 text-4xl font-bold text-white">
                  What Is SAFe?
                </h2>
              </div>

              <div className="space-y-5 text-lg leading-relaxed text-muted">
                <p>
                  SAFe® — the Scaled Agile Framework® — is the world&apos;s
                  leading system for implementing Agile, Lean, and DevOps
                  practices at scale. It gives large, complex organizations a
                  proven structure and shared language to align strategy with
                  execution, accelerate delivery, and respond to change.
                </p>
                <p>
                  More than one million professionals across 20,000 enterprises
                  worldwide have been trained in SAFe — from commercial tech
                  companies to federal agencies navigating some of the most
                  complex delivery environments on the planet.
                </p>
              </div>
            </div>

            {/* Right — SAFe Big Picture
                Image file: /public/images/SAFe/SAFe_Big_Picture.svg
                Download from: https://framework.scaledagile.com/wp-content/uploads/2026/03/SAFe_Big_Picture-AI-Empowered.svg
                Save as: public/images/SAFe/SAFe_Big_Picture.svg
            */}
            <div className="flex flex-col gap-4">
              <a
                href="https://framework.scaledagile.com/#big-picture"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Explore the SAFe Big Picture at framework.scaledagile.com"
                className="group block overflow-hidden rounded-xl border border-[#00487B] transition-colors duration-200 hover:border-cyan"
              >
                <Image
                  src="/images/SAFe/SAFe_Big_Picture.svg"
                  alt="The SAFe® Big Picture — the full framework at a glance"
                  width={600}
                  height={340}
                  className="w-full"
                  unoptimized
                />
              </a>
              <p className="text-sm text-muted">
                The SAFe® Big Picture — the full framework at a glance.
              </p>
              <a
                href="https://framework.scaledagile.com/#big-picture"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-cyan hover:underline"
              >
                Explore the framework at scaledagileframework.com &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — WHY SAFe? CARD GRID ─────────────────────────────── */}
      <section className="w-full bg-navy py-24 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm uppercase tracking-widest text-cyan">
            The Case for SAFe
          </p>
          <h2 className="mt-2 text-4xl font-bold text-white">
            Why Leading Organizations Choose SAFe®
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Over 70% of transformations fail. SAFe exists to beat those odds.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {whyCards.map((card) => (
              <div
                key={card.title}
                className="group rounded-xl border border-[#00487B] bg-navyMid p-8 text-left transition-colors duration-200 hover:border-cyan"
              >
                {card.icon}
                <h3 className="text-xl font-bold text-white">{card.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — PARTNER CALLOUT ──────────────────────────────────── */}
      <section className="w-full bg-navyMid py-24 px-4">
        <div className="mx-auto max-w-7xl text-center">
          {/* Partner badge */}
          <div className="flex justify-center mb-8">
            <img
              src="/images/SAFe/SAI_Partner_Badge_Bronze.svg"
              alt="Scaled Agile Bronze Partner Badge"
              width={80}
              height={80}
              className="h-20 w-auto"
            />
          </div>

          <h2 className="text-4xl font-bold text-white">
            Certified. Accountable. In Your Corner.
          </h2>

          <div className="mx-auto mt-6 max-w-2xl space-y-5 text-lg leading-relaxed text-muted">
            <p>
              Atomic Agility is an official Scaled Agile Bronze Partner. That
              means our courses meet Scaled Agile&apos;s quality and content
              standards — and your certification is backed by the same
              organization that built the framework.
            </p>
            <p>
              When you train with a certified partner, you&apos;re not just
              learning SAFe. You&apos;re earning credentials that carry weight.
            </p>
          </div>

          <div className="mt-8">
            <a
              href="https://scaledagile.com/about-scaled-agile/partner-opportunities/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan hover:underline"
            >
              Learn more about the Scaled Agile Partner Network &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — COURSE CTA ────────────────────────────────────────── */}
      <section className="w-full bg-navy py-24 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-bold text-white">
            Ready to Get SAFe Certified?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            All four of our SAFe courses are delivered virtually, include live
            instructor support, and come with our AI Integration Toolkit at no
            extra cost.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/training"
              className="rounded-lg bg-cyan px-8 py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
            >
              View All Courses
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-cyan px-8 py-4 text-lg font-semibold text-cyan transition-colors duration-200 hover:bg-cyan hover:text-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
