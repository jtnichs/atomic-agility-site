import fs from "fs";
import path from "path";
import matter from "gray-matter";

// --- Types ---

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

// --- Constants ---

const RESOURCES_DIR = path.join(process.cwd(), "content", "resources");

/** Human-readable labels for each resource type. */
export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  article: "Article",
  whitepaper: "Whitepaper",
  guide: "Guide",
  video: "Video",
};

// --- Internal helpers ---

function readResourceFile(fileName: string): Resource {
  const fullPath = path.join(RESOURCES_DIR, fileName);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as ResourceFrontmatter;

  return {
    ...fm,
    // Fall back to the filename (minus extension) if no slug is provided.
    slug: fm.slug || fileName.replace(/\.mdx?$/, ""),
    status: fm.status ?? "published",
    content,
  };
}

// --- Public API ---

/**
 * Returns every resource, sorted newest-first by date.
 * Returns an empty array if the content directory does not exist yet.
 */
export function getAllResources(): Resource[] {
  if (!fs.existsSync(RESOURCES_DIR)) return [];

  const files = fs
    .readdirSync(RESOURCES_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files
    .map(readResourceFile)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Returns a single resource by slug, or null if not found. */
export function getResourceBySlug(slug: string): Resource | null {
  return getAllResources().find((r) => r.slug === slug) ?? null;
}

/** Returns the single featured resource (if any). */
export function getFeaturedResource(): Resource | null {
  return getAllResources().find((r) => r.featured) ?? null;
}
