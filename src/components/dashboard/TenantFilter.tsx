import { ChevronDown, MapPin } from "lucide-react";
import type { TenantFilterProps } from "../../types";

export function TenantFilter({ options, value, onChange }: TenantFilterProps) {
  return (
    <label className="flex min-w-full flex-col gap-2 md:min-w-72">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
        Select Tenant
      </span>
      <span className="relative">
        <MapPin
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--teal)]"
          size={18}
        />
        <select
          className="h-12 w-full appearance-none rounded-sm border border-white/15 bg-[var(--panel)] px-10 text-sm font-semibold text-[var(--ivory)] outline-none transition focus:border-[var(--saffron)] focus:ring-2 focus:ring-[var(--saffron)]/25"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option} className="bg-[var(--panel)] text-white">
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/45"
          size={17}
        />
      </span>
    </label>
  );
}
