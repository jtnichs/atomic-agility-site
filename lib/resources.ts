import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Resource, ResourceFrontmatter } from "@/lib/resource-types";

// Re-export client-safe types/constants so server components can keep
// importing everything from "@/lib/resources" if they prefer.
export type {
  Resource,
  ResourceFrontmatter,
  ResourceType,
  ResourceStatus,
} from "@/lib/resource-types";
export { RESOURCE_TYPE_LABELS } from "@/lib/resource-types";

// --- Constants ---

const RESOURCES_DIR = path.join(process.cwd(), "content", "resources");

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
