"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: Wire this up to a real backend (Supabase / Resend / Formspree).
    //       For now we just acknowledge the submission client-side.
    //       Do NOT ship this to production as-is — no email is stored or sent yet.
    setSubmitted(true);
    setEmail("");
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-[#00487B] bg-navyMid p-8 text-center">
      <h2 className="text-2xl font-bold text-white">
        Get New Resources in Your Inbox
      </h2>
      <p className="mx-auto mt-3 max-w-md text-muted">
        New whitepapers, guides, and articles — delivered when they drop. No
        spam, unsubscribe anytime.
      </p>

      {submitted ? (
        <p className="mt-6 font-medium text-cyan">
          Thanks — you&apos;re on the list. (Submission is a stub; no email sent
          yet.)
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-lg border border-[#00487B] bg-navy px-4 py-3 text-white placeholder-muted focus:border-cyan focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-cyan px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
