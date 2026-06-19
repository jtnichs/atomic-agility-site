"use client";

import { useState } from "react";
import ResourceCard, { type ResourceCardData } from "@/components/ResourceCard";
import type { ResourceType } from "@/lib/resources";

type FilterValue = "all" | ResourceType;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "article", label: "Articles" },
  { value: "whitepaper", label: "Whitepapers" },
  { value: "guide", label: "Guides" },
  { value: "video", label: "Videos" },
];

export default function ResourceFilter({
  resources,
}: {
  resources: ResourceCardData[];
}) {
  const [active, setActive] = useState<FilterValue>("all");

  const visible =
    active === "all"
      ? resources
      : resources.filter((r) => r.type === active);

  return (
    <div>
      {/* Filter chips */}
      <div className="flex flex-wrap justify-center gap-3">
        {FILTERS.map((f) => {
          const isActive = active === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setActive(f.value)}
              aria-pressed={isActive}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "border-cyan bg-cyan text-white"
                  : "border-[#00487B] bg-navyMid text-muted hover:border-cyan hover:text-cyan"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {visible.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((r) => (
            <ResourceCard key={r.slug} resource={r} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-xl border border-[#00487B] bg-navy p-12 text-center">
          <p className="text-xl font-semibold text-white">
            Nothing here yet.
          </p>
          <p className="mt-2 text-muted">
            No {active === "all" ? "resources" : `${active}s`} have been
            published in this category. Check back soon.
          </p>
        </div>
      )}
    </div>
  );
}
