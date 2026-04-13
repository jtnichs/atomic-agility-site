import Link from "next/link";

export default function RegistrationSuccess() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-navy px-4 text-center">
      {/* Checkmark */}
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#00A5F0] bg-[#00234B]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-[#00A5F0]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="mt-8 text-5xl font-bold text-white md:text-6xl">
        You&apos;re Registered!
      </h1>

      {/* Subtext */}
      <p className="mx-auto mt-6 max-w-xl text-lg text-[#94a3b8]">
        Check your email for confirmation details. We&apos;ll send your Zoom
        link and pre-class materials 48 hours before class starts.
      </p>

      {/* Spam note */}
      <p className="mt-4 text-sm text-[#94a3b8]">
        Didn&apos;t receive an email? Check your spam folder or contact{" "}
        <a
          href="mailto:john@atomicagility.us"
          className="text-[#00A5F0] hover:underline"
        >
          john@atomicagility.us
        </a>
      </p>

      {/* Buttons */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/training"
          className="rounded-lg bg-[#00A5F0] px-8 py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
        >
          View Your Course Details
        </Link>
        <Link
          href="/training"
          className="rounded-lg border border-[#00A5F0] px-8 py-4 text-lg font-semibold text-[#00A5F0] transition-colors duration-200 hover:bg-[#00A5F0] hover:text-white"
        >
          Return to Training Hub
        </Link>
      </div>
    </section>
  );
}
