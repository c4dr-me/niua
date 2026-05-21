import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { StatusChartProps, StatusTooltipProps } from "../../types";
import { ALL_CITIES } from "../../constants";
import { formatInteger } from "../../utils/formatters";

function StatusTooltip({ active, label, payload }: StatusTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="border border-[var(--teal)]/35 bg-[var(--panel)] px-3 py-2 text-sm shadow-2xl shadow-black/30">
      <p className="font-semibold text-[var(--ivory)]">{label}</p>
      <div className="mt-2 space-y-1">
        {payload.map((item) => (
          <p key={item.name} className="flex items-center justify-between gap-5 text-white/75">
            <span className="capitalize">{item.name}</span>
            <span className="font-semibold text-[var(--ivory)]">
              {formatInteger(Number(item.value || 0))}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}

export function StatusChart({ summaries, selectedTenant }: StatusChartProps) {
  const selectedIndex = summaries.findIndex(
    (summary) => summary.tenant === selectedTenant,
  );
  const shouldHighlight = selectedTenant !== ALL_CITIES && selectedIndex >= 0;
  const highlightedTenant = shouldHighlight ? summaries[selectedIndex].tenant : undefined;

  return (
    <article className="relative overflow-hidden rounded-sm border border-white/10 bg-[linear-gradient(145deg,rgba(16,36,58,0.98),rgba(10,24,39,0.98))] p-5 shadow-xl shadow-black/15">
      <div className="pointer-events-none absolute left-0 top-0 h-28 w-28 -translate-x-10 -translate-y-10 rounded-full bg-[var(--teal)]/14 blur-3xl" />
      <div className="mb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--teal)]">
            Approval Pipeline
          </p>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-[var(--ivory)]">
            Approved, rejected and pending records
          </h2>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={summaries} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="approvedBar" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#75ead1" />
                <stop offset="100%" stopColor="#36b99e" />
              </linearGradient>
              <linearGradient id="rejectedBar" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ff8aa0" />
                <stop offset="100%" stopColor="#e45473" />
              </linearGradient>
              <linearGradient id="pendingBar" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffd166" />
                <stop offset="100%" stopColor="#f2a93b" />
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
              tick={{ fill: "rgba(247,239,218,0.62)", fontSize: 11 }}
              tickFormatter={formatInteger}
              tickLine={false}
              axisLine={false}
              width={42}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.06)" }}
              content={<StatusTooltip />}
            />
            <Legend wrapperStyle={{ color: "rgba(247,239,218,0.7)", fontSize: 12 }} />
            <Bar
              dataKey="approved"
              fill="url(#approvedBar)"
              radius={[3, 3, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="rejected"
              fill="url(#rejectedBar)"
              radius={[3, 3, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="pending"
              fill="url(#pendingBar)"
              radius={[3, 3, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
