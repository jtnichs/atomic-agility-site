import Link from "next/link";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";

/**
 * Responsive 16:9 YouTube embed for use inside MDX bodies.
 * Usage in .mdx:  <YouTube id="dQw4w9WgXcQ" title="Optional title" />
 */
export function YouTube({ id, title }: { id: string; title?: string }) {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-[#00487B]">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${id}`}
          title={title ?? "YouTube video player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}

/**
 * Inline call-to-action button for use inside MDX bodies.
 * Usage in .mdx:  <CTA href="/training" label="Browse Courses" />
 */
export function CTA({ href, label }: { href: string; label: string }) {
  return (
    <div className="my-8">
      <Link
        href={href}
        className="inline-block rounded-lg bg-cyan px-8 py-3 font-semibold text-white no-underline transition-colors duration-200 hover:bg-[#0090d0]"
      >
        {label}
      </Link>
    </div>
  );
}

/**
 * Component map passed to <MDXRemote /> — combines custom components with
 * styling overrides for standard Markdown elements so MDX bodies match the
 * site's dark navy theme.
 */
export const mdxComponents: MDXRemoteProps["components"] = {
  YouTube,
  CTA,
  h2: (props) => (
    <h2 className="mt-10 text-2xl font-bold text-white" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-8 text-xl font-bold text-white" {...props} />
  ),
  p: (props) => (
    <p className="mt-4 leading-relaxed text-muted" {...props} />
  ),
  ul: (props) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-muted" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  a: (props) => (
    <a className="text-cyan underline hover:text-[#0090d0]" {...props} />
  ),
  strong: (props) => <strong className="font-semibold text-white" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-6 border-l-4 border-cyan pl-4 italic text-muted"
      {...props}
    />
  ),
};
