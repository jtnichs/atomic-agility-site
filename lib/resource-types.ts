// Client-safe types and constants for resources.
// IMPORTANT: this file must NOT import `fs`, `path`, or any server-only module,
// because it is imported by client components (ResourceCard / ResourceFilter).
// Server-only helpers (file reading) live in lib/resources.ts.

export type ResourceType = "article" | "whitepaper" | "guide" | "video";
export type ResourceStatus = "published" | "coming_soon";

/**
 * Frontmatter shape for every .mdx file in content/resources/.
 * Keep this in sync with the frontmatter block authors write.
 */
export interface ResourceFrontmatter {
  title: string;
  slug: string;
  type: ResourceType;
  excerpt: string;
  date: string; // ISO date string
  author: string;
  coverImage?: string;
  pdfUrl?: string;
  featured?: boolean;
  readingTime?: string;
  status?: ResourceStatus; // defaults to "published"
}

/** A resource with its parsed frontmatter, normalized status, and raw MDX body. */
export interface Resource extends ResourceFrontmatter {
  status: ResourceStatus; // normalized — never undefined after parsing
  content: string; // raw MDX body
}

/** Human-readable labels for each resource type. */
export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  article: "Article",
  whitepaper: "Whitepaper",
  guide: "Guide",
  video: "Video",
};
