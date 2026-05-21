import { BadgeCheck, IndianRupee, Landmark, XCircle } from "lucide-react";
import type { KpiGridProps } from "../../types";
import { formatCompactCurrency, formatInteger, formatPercent } from "../../utils/formatters";

export function KpiGrid({ summary }: KpiGridProps) {
  const items = [
    {
      label: "Total Properties Registered",
      value: formatInteger(summary.total),
      helper: summary.tenant,
      icon: Landmark,
      accent: "text-[var(--teal)]",
    },
    {
      label: "Total Properties Approved",
      value: formatInteger(summary.approved),
      helper: formatPercent(summary.approvalPercentage),
      icon: BadgeCheck,
      accent: "text-emerald-300",
    },
    {
      label: "Total Properties Rejected",
      value: formatInteger(summary.rejected),
      helper: `${formatInteger(summary.pending)} pending`,
      icon: XCircle,
      accent: "text-rose-300",
    },
    {
      label: "Total Collection",
      value: formatCompactCurrency(summary.collection),
      helper: "Collected amount",
      icon: IndianRupee,
      accent: "text-[var(--saffron)]",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.label}
            className="group relative flex min-h-44 flex-col overflow-hidden rounded-sm border border-white/10 bg-[var(--surface)] p-5 shadow-xl shadow-black/15 transition duration-300 hover:-translate-y-0.5 hover:border-white/20"
          >
            <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-white/10 blur-2xl transition group-hover:bg-[var(--saffron)]/20" />
            <div className="flex flex-1 items-start justify-between gap-4">
              <div className="flex h-full flex-col">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                  {item.label}
                </p>
                <p className="mt-auto pt-6 text-3xl font-semibold leading-none text-[var(--ivory)]">
                  {item.value}
                </p>
                <p className="mt-5 text-sm text-white/58">{item.helper}</p>
              </div>
              <span className={`grid h-10 w-10 place-items-center border border-white/10 bg-white/[0.06] ${item.accent}`}>
                <Icon size={20} strokeWidth={1.9} />
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
