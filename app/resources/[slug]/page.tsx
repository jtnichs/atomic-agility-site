import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllResources,
  getResourceBySlug,
  RESOURCE_TYPE_LABELS,
} from "@/lib/resources";
import { mdxComponents } from "@/components/mdx/MdxComponents";

// --- Static generation ---

export function generateStaticParams() {
  return getAllResources().map((r) => ({ slug: r.slug }));
}

// --- Per-resource metadata ---

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const resource = getResourceBySlug(params.slug);
  if (!resource) return { title: "Resource Not Found | Atomic Agility" };

  const title = `${resource.title} | Atomic Agility`;
  const images = resource.coverImage ? [{ url: resource.coverImage }] : undefined;

  return {
    title,
    description: resource.excerpt,
    openGraph: {
      title,
      description: resource.excerpt,
      type: "article",
      url: `/resources/${resource.slug}`,
      publishedTime: resource.date,
      authors: [resource.author],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: resource.excerpt,
      images: resource.coverImage ? [resource.coverImage] : undefined,
    },
  };
}

// --- Helpers ---

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  );
}

// --- Page ---

export default function ResourceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const resource = getResourceBySlug(params.slug);
  if (!resource) notFound();

  const isComingSoon = resource.status === "coming_soon";
  const isDownloadable =
    resource.type === "whitepaper" || resource.type === "guide";
  const showDownload =
    isDownloadable && resource.status === "published" && !!resource.pdfUrl;

  return (
    <>
      {/* HEADER */}
      <section className="w-full bg-navy px-4 pt-16 pb-10">
        <div className="mx-auto max-w-3xl">
          {/* Back link */}
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-cyan"
          >
            <span aria-hidden="true">&larr;</span> Back to Resources
          </Link>

          {/* Meta row */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-navyMid px-3 py-1 text-xs font-medium text-cyan">
              {RESOURCE_TYPE_LABELS[resource.type]}
            </span>
            {isComingSoon ? (
              <span className="rounded-full border border-cyan px-3 py-1 text-xs font-semibold text-cyan">
                Coming Soon
              </span>
            ) : (
              <span className="text-sm text-muted">
                {formatDate(resource.date)}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            {resource.title}
          </h1>

          {/* Byline */}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span>By {resource.author}</span>
            {resource.readingTime && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span>{resource.readingTime}</span>
              </>
            )}
          </div>

          {/* Download CTA / Coming soon notice */}
          {isDownloadable && (
            <div className="mt-8">
              {showDownload ? (
                <a
                  href={resource.pdfUrl}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan px-8 py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
                  download
                >
                  <DownloadIcon />
                  Download PDF
                </a>
              ) : isComingSoon ? (
                <div className="rounded-xl border border-[#00487B] bg-navyMid p-6">
                  <p className="font-semibold text-cyan">Coming Soon</p>
                  <p className="mt-2 text-sm text-muted">
                    This {RESOURCE_TYPE_LABELS[resource.type].toLowerCase()}{" "}
                    isn&apos;t available to download yet. Subscribe on the
                    Resources page to be notified the moment it&apos;s live.
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {/* COVER IMAGE */}
      {resource.coverImage && (
        <section className="w-full bg-navy px-4">
          <div className="mx-auto max-w-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resource.coverImage}
              alt=""
              className="w-full rounded-xl border border-[#00487B] object-cover"
            />
          </div>
        </section>
      )}

      {/* BODY */}
      <section className="w-full bg-navy px-4 py-12">
        <article className="mx-auto max-w-3xl">
          <MDXRemote source={resource.content} components={mdxComponents} />
        </article>
      </section>

      {/* CLOSING CTA */}
      <section className="w-full bg-gradient-to-b from-navy to-navyMid px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white">
            Put These Ideas Into Practice
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Our SAFe certification courses turn this thinking into working
            practice — virtual, expert-led, and built for the AI age.
          </p>
          <div className="mt-8">
            <Link
              href="/training"
              className="inline-block rounded-lg bg-cyan px-8 py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
            >
              Explore Training &amp; Certification
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
