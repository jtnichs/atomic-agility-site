import Link from "next/link";
import type { Resource } from "@/lib/resource-types";
import { RESOURCE_TYPE_LABELS } from "@/lib/resource-types";

// Card data is the frontmatter without the (potentially large) MDX body.
export type ResourceCardData = Omit<Resource, "content">;

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Type pill — matches the cyan pill used on schedule cards. */
function TypeBadge({ type }: { type: ResourceCardData["type"] }) {
  return (
    <span className="flex-shrink-0 rounded-full bg-navyMid px-3 py-1 text-xs font-medium text-cyan">
      {RESOURCE_TYPE_LABELS[type]}
    </span>
  );
}

export default function ResourceCard({ resource }: { resource: ResourceCardData }) {
  const isComingSoon = resource.status === "coming_soon";

  return (
    <Link
      href={`/resources/${resource.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#00487B] bg-navy transition-colors duration-200 hover:border-cyan"
    >
      {/* Cover image (optional) */}
      {resource.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resource.coverImage}
          alt=""
          className="h-44 w-full object-cover"
        />
      )}

      <div className="flex flex-1 flex-col p-6">
        {/* Top row: type badge + date / coming soon */}
        <div className="flex items-center justify-between gap-3">
          <TypeBadge type={resource.type} />
          {isComingSoon ? (
            <span className="flex-shrink-0 rounded-full border border-cyan px-3 py-1 text-xs font-semibold text-cyan">
              Coming Soon
            </span>
          ) : (
            <span className="text-xs text-muted">{formatDate(resource.date)}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-4 text-xl font-bold text-white transition-colors duration-200 group-hover:text-cyan">
          {resource.title}
        </h3>

        {/* Excerpt */}
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {resource.excerpt}
        </p>

        {/* Footer: reading time */}
        {resource.readingTime && (
          <p className="mt-4 text-xs text-muted">{resource.readingTime}</p>
        )}
      </div>
    </Link>
  );
}
