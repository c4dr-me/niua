import { Building2, Database, ShieldCheck } from "lucide-react";
import type { DashboardHeaderProps } from "../../types";
import { formatInteger } from "../../utils/formatters";

export function DashboardHeader({ recordCount }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-sm border border-[var(--saffron)]/50 bg-[var(--saffron)]/10 text-[var(--saffron)]">
          <Building2 size={23} strokeWidth={1.8} />
        </div>
        <div>
          <p className="font-serif text-2xl font-semibold leading-none text-[var(--ivory)]">
            UPYOG
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-white/55">
            Property Tax Analytics
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-white/70">
        <span className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.05] px-3 py-2">
          <Database size={16} />
          {formatInteger(recordCount)} records
        </span>
        <span className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.05] px-3 py-2">
          <ShieldCheck size={16} />
          Client-side JSON demo
        </span>
      </div>
    </header>
  );
}
