import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CollectionChartProps } from "../../types";
import { ALL_CITIES } from "../../constants";
import { formatCompactCurrency, formatCurrency } from "../../utils/formatters";

interface CollectionTooltipProps {
  active?: boolean;
  label?: string;
  payload?: Array<{ value?: number }>;
}

function CollectionTooltip({ active, label, payload }: CollectionTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="border border-[var(--teal)]/35 bg-[var(--panel)] px-3 py-2 text-sm shadow-2xl shadow-black/30">
      <p className="font-semibold text-[var(--ivory)]">{label}</p>
      <p className="mt-1 text-white/75">
        Collection:{" "}
        <span className="font-semibold text-[var(--saffron)]">
          {formatCurrency(Number(payload[0].value || 0))}
        </span>
      </p>
    </div>
  );
}

export function CollectionChart({ summaries, selectedTenant }: CollectionChartProps) {
  const topCollection = Math.max(...summaries.map((summary) => summary.collection));
  const highlightedTenant =
    selectedTenant !== ALL_CITIES &&
    summaries.some((summary) => summary.tenant === selectedTenant)
      ? selectedTenant
      : undefined;

  return (
    <article className="relative overflow-hidden rounded-sm border border-white/10 bg-[linear-gradient(145deg,rgba(16,36,58,0.98),rgba(11,26,43,0.98))] p-5 shadow-xl shadow-black/15">
      <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 translate-x-12 -translate-y-14 rounded-full bg-[var(--saffron)]/12 blur-3xl" />
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--saffron)]">
            City Comparison
          </p>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-[var(--ivory)]">
            Total collection by tenant
          </h2>
        </div>
        <p className="border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-white/60">
          All 10 cities shown side by side
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={summaries} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="collectionBar" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffd166" />
                <stop offset="100%" stopColor="#f2a93b" />
              </linearGradient>
              <linearGradient id="collectionTopBar" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#66f2d0" />
                <stop offset="100%" stopColor="#33b89b" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(247,239,218,0.09)" vertical={false} />
            {highlightedTenant ? (
              <ReferenceArea
                x1={highlightedTenant}
                x2={highlightedTenant}
                stroke="#fff7d8"
                strokeOpacity={0.95}
                strokeWidth={2}
                fill="#fff7d8"
                fillOpacity={0.05}
                ifOverflow="extendDomain"
              />
            ) : null}
            <XAxis
              dataKey="tenant"
              interval={0}
              tick={{ fill: "rgba(247,239,218,0.72)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.14)" }}
              angle={-22}
              textAnchor="end"
              height={58}
            />
            <YAxis
              tickFormatter={formatCompactCurrency}
              tick={{ fill: "rgba(247,239,218,0.62)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={76}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.06)" }}
              content={<CollectionTooltip />}
            />
            <Bar dataKey="collection" radius={[3, 3, 0, 0]} isAnimationActive={false}>
              {summaries.map((summary) => (
                <Cell
                  key={summary.tenant}
                  fill={
                    summary.collection === topCollection
                      ? "url(#collectionTopBar)"
                      : "url(#collectionBar)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
