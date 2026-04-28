export type Metric = { value: string; label: string };

/**
 * Canonical "founder credentials" metric list. Used on:
 * - Homepage (Why Atomic Agility section)
 * - About page (Our Founder section)
 * - Course page (Your Instructor section)
 *
 * If the numbers change, change them here — the three pages will all update.
 */
export const founderMetrics: Metric[] = [
  { value: "15+", label: "Years of Agile Experience" },
  { value: "5+", label: "Federal Agencies Served" },
  { value: "100+", label: "Professionals Coached" },
  { value: "9.43/10", label: "Likelihood to Recommend" },
];

/**
 * A single stat card. Wrap several in a grid container — see
 * MetricGrid for the standard 4-up layout used on the homepage.
 */
export function MetricCard({ value, label }: Metric) {
  return (
    <div className="rounded-xl border border-[#00487B] bg-navyMid p-6 text-center">
      <p className="text-4xl font-bold text-cyan">{value}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </div>
  );
}

/**
 * Standard 4-up metric grid: 1-col mobile, 2-col tablet, 4-col desktop.
 * Pass `metrics` to override the default founder credentials.
 */
export function MetricGrid({ metrics = founderMetrics }: { metrics?: Metric[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => (
        <MetricCard key={m.label} value={m.value} label={m.label} />
      ))}
    </div>
  );
}
