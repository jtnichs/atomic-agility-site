"use client";

import { useForm, ValidationError } from "@formspree/react";

// --- Icons ---

function EmailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-cyan flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-cyan flex-shrink-0"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-cyan flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}

// --- Input class helper ---
const inputClass =
  "w-full rounded-lg border border-[#00487B] bg-[#00234B] px-4 py-3 text-white placeholder-[#94a3b8] focus:border-[#00A5F0] focus:outline-none transition-colors duration-200";

const labelClass = "block text-sm text-[#94a3b8] mb-2";

// --- Contact Form ---

function ContactForm() {
  const [state, handleSubmit] = useForm("mykdwknk");

  if (state.succeeded) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-[#00487B] bg-[#00234B] p-10 text-center">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-cyan"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-xl font-semibold text-cyan">
            Thanks! We&apos;ll be in touch within one business day.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* First + Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            required
            className={inputClass}
            placeholder="Jane"
          />
          <ValidationError prefix="First Name" field="firstName" errors={state.errors} className="mt-1 text-sm text-red-400" />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            required
            className={inputClass}
            placeholder="Smith"
          />
          <ValidationError prefix="Last Name" field="lastName" errors={state.errors} className="mt-1 text-sm text-red-400" />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClass}>
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          className={inputClass}
          placeholder="jane@yourorg.com"
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} className="mt-1 text-sm text-red-400" />
      </div>

      {/* Organization */}
      <div>
        <label htmlFor="organization" className={labelClass}>
          Organization{" "}
          <span className="text-[#94a3b8] opacity-60">(optional)</span>
        </label>
        <input
          id="organization"
          type="text"
          name="organization"
          className={inputClass}
          placeholder="Your organization"
        />
      </div>

      {/* Service Interest */}
      <div>
        <label htmlFor="service" className={labelClass}>
          Service Interest
        </label>
        <select
          id="service"
          name="service"
          className={inputClass}
          defaultValue=""
        >
          <option value="" disabled>
            Select a service...
          </option>
          <option value="Agile Coaching">Agile Coaching</option>
          <option value="Training & Workshops">Training &amp; Workshops</option>
          <option value="Enterprise Transformation">
            Enterprise Transformation
          </option>
          <option value="Not Sure Yet">Not Sure Yet</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelClass}>
          How can we help?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={inputClass}
          placeholder="Tell us about your team or organization and what you're working toward..."
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} className="mt-1 text-sm text-red-400" />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={state.submitting}
        className="w-full rounded-lg bg-[#00A5F0] py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state.submitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

// --- Info cards data ---

const infoCards = [
  {
    title: "Free Consultation",
    body: "Every engagement starts with a no-obligation conversation.",
  },
  {
    title: "Remote & On-Site",
    body: "We work with organizations across the U.S., virtually and in person.",
  },
  {
    title: "Fast Response",
    body: "Expect to hear back within one business day.",
  },
];

// --- Page ---

export default function Contact() {
  return (
    <>
      {/* SECTION 1 — PAGE HERO */}
      <section className="relative flex flex-col items-center justify-center bg-navy px-4 py-32 text-center">
        <h1 className="text-5xl font-bold text-white md:text-7xl">
          Let&apos;s Talk
        </h1>
        <p className="mt-4 text-2xl font-medium text-cyan md:text-3xl">
          Start with a Conversation.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          Whether you&apos;re ready to start or just exploring your options,
          we&apos;d love to hear from you. Fill out the form and we&apos;ll be
          in touch within one business day.
        </p>
      </section>

      {/* SECTION 2 — FORM + INFO */}
      <section className="w-full bg-navy py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">

            {/* Left — Contact Form */}
            <ContactForm />

            {/* Right — Contact Info */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-sm uppercase tracking-widest text-cyan">
                  Get In Touch
                </p>
                <h3 className="mt-2 text-3xl font-bold text-white">
                  We&apos;re here to help.
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-muted">
                  Not sure what you need? That&apos;s okay. Most of our best
                  engagements started with a simple conversation. Reach out and
                  let&apos;s figure it out together.
                </p>
              </div>

              {/* Contact details */}
              <div className="flex flex-col gap-4">
                <a
                  href="mailto:john@atomicagility.us"
                  className="flex items-center gap-3 text-muted hover:text-white transition-colors duration-200"
                >
                  <EmailIcon />
                  <span>john@atomicagility.us</span>
                </a>
                <a
                  href="https://linkedin.com/in/jtnichs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted hover:text-white transition-colors duration-200"
                >
                  <LinkedInIcon />
                  <span>linkedin.com/in/jtnichs</span>
                </a>
                <div className="flex items-center gap-3 text-muted">
                  <LocationIcon />
                  <span>Washington, D.C. Metro Area</span>
                </div>
              </div>

              <p className="text-sm text-muted">
                We typically respond within one business day.
              </p>

              {/* Info cards */}
              <div className="flex flex-col gap-4">
                {infoCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-xl border border-[#00487B] bg-[#00234B] p-6"
                  >
                    <p className="font-semibold text-white">{card.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3 — BOTTOM CTA STRIP */}
      <section className="w-full bg-navyMid py-12 px-4">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:justify-center">
          <p className="text-lg text-muted">Prefer to connect directly?</p>
          <a
            href="https://linkedin.com/in/jtnichs"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-cyan px-8 py-3 font-semibold text-cyan transition-colors duration-200 hover:bg-cyan hover:text-white"
          >
            Find Us on LinkedIn
          </a>
        </div>
      </section>
    </>
  );
}
