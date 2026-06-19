import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllResources,
  getFeaturedResource,
  RESOURCE_TYPE_LABELS,
} from "@/lib/resources";
import ResourceFilter from "@/components/ResourceFilter";
import NewsletterSignup from "@/components/NewsletterSignup";
import type { ResourceCardData } from "@/components/ResourceCard";

// --- SEO ---

const PAGE_TITLE = "Resources | Atomic Agility";
const PAGE_DESCRIPTION =
  "Whitepapers, guides, articles, and videos on agile transformation, SAFe, and staying adaptive in the AI age — from Atomic Agility.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    type: "website",
    url: "/resources",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

// --- Featured hero ---

function FeaturedHero({
  resource,
}: {
  resource: NonNullable<ReturnType<typeof getFeaturedResource>>;
}) {
  const isComingSoon = resource.status === "coming_soon";

  return (
    <div className="overflow-hidden rounded-2xl border border-[#00487B] bg-navyMid md:grid md:grid-cols-2">
      {/* Cover */}
      {resource.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resource.coverImage}
          alt=""
          className="h-56 w-full object-cover md:h-full"
        />
      ) : (
        <div className="hidden bg-gradient-to-br from-navy to-[#00487B] md:block" />
      )}

      {/* Content */}
      <div className="flex flex-col justify-center p-8 md:p-12">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-navy px-3 py-1 text-xs font-medium text-cyan">
            {RESOURCE_TYPE_LABELS[resource.type]}
          </span>
          <span className="text-xs uppercase tracking-widest text-muted">
            Featured
          </span>
        </div>

        <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
          {resource.title}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          {resource.excerpt}
        </p>

        <div className="mt-8">
          {isComingSoon ? (
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-block rounded-lg border border-cyan px-6 py-3 font-semibold text-cyan">
                Coming Soon
              </span>
              <Link
                href={`/resources/${resource.slug}`}
                className="text-sm font-medium text-muted underline transition-colors hover:text-cyan"
              >
                Read the preview
              </Link>
            </div>
          ) : (
            <Link
              href={`/resources/${resource.slug}`}
              className="inline-block rounded-lg bg-cyan px-8 py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#0090d0]"
            >
              Read More
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Page ---

export default function ResourcesPage() {
  const all = getAllResources();
  const featured = getFeaturedResource();

  // Strip the MDX body before passing to the client filter component.
  const cardData: ResourceCardData[] = all.map(
    ({ content, ...meta }) => meta,
  );

  return (
    <>
      {/* SECTION 1 — HERO HEADER */}
      <section className="flex flex-col items-center justify-center bg-navy px-4 py-20 text-center">
        <p className="text-sm uppercase tracking-widest text-cyan">
          Resource Library
        </p>
        <h1 className="mt-2 text-5xl font-bold text-white md:text-6xl">
          Resources
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          Whitepapers, guides, articles, and videos to help your teams stay
          adaptive — built for the kind of disruption we&apos;re living through,
          not retrofitted for it.
        </p>
      </section>

      {/* SECTION 2 — FEATURED */}
      {featured && (
        <section className="w-full bg-navy px-4 pb-8">
          <div className="mx-auto max-w-7xl">
            <FeaturedHero resource={featured} />
          </div>
        </section>
      )}

      {/* SECTION 3 — FILTERABLE GRID */}
      <section className="w-full bg-navyMid px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-widest text-cyan">
              Browse the Library
            </p>
            <h2 className="mt-2 text-4xl font-bold text-white">
              All Resources
            </h2>
          </div>

          {cardData.length > 0 ? (
            <ResourceFilter resources={cardData} />
          ) : (
            <div className="rounded-xl border border-[#00487B] bg-navy p-12 text-center">
              <p className="text-xl font-semibold text-white">
                Resources are on the way.
              </p>
              <p className="mt-2 text-muted">
                We&apos;re publishing our first whitepapers and guides soon.
                Check back shortly.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4 — NEWSLETTER */}
      <section className="w-full bg-navy px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <NewsletterSignup />
        </div>
      </section>
    </>
  );
}
