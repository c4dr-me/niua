import { useMemo, useState } from "react";
import rawData from "./data/properties.json";
import { ChatAssistant } from "./components/chat/ChatAssistant";
import { CollectionChart } from "./components/dashboard/CollectionChart";
import { DashboardHeader } from "./components/layout/DashboardHeader";
import { KpiGrid } from "./components/dashboard/KpiGrid";
import { StatusChart } from "./components/dashboard/StatusChart";
import { TenantFilter } from "./components/dashboard/TenantFilter";
import { ALL_CITIES } from "./constants";
import type { PropertyRecord } from "./types";
import {
  buildDataContext,
  filterByTenant,
  getCitySummaries,
  getTenantOptions,
  summarizeRecords,
} from "./utils/analytics";

const propertyData = rawData as PropertyRecord[];

function App() {
  const [selectedTenant, setSelectedTenant] = useState(ALL_CITIES);

  const tenantOptions = useMemo(() => getTenantOptions(propertyData), []);
  const citySummaries = useMemo(() => getCitySummaries(propertyData), []);
  const filteredRecords = useMemo(
    () => filterByTenant(propertyData, selectedTenant),
    [selectedTenant],
  );
  const currentSummary = useMemo(
    () => summarizeRecords(filteredRecords, selectedTenant),
    [filteredRecords, selectedTenant],
  );
  const dataContext = useMemo(() => buildDataContext(propertyData), []);

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--ink)] text-[var(--ivory)]">
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute left-[-8rem] top-[-10rem] h-80 w-80 rounded-full bg-[var(--teal)]/20 blur-3xl" />
        <div className="absolute right-[-12rem] top-24 h-96 w-96 rounded-full bg-[var(--saffron)]/15 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(247,239,218,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(247,239,218,0.045)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <DashboardHeader recordCount={propertyData.length} />

        <section className="rounded-sm border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20 backdrop-blur md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--saffron)]">
                Tenant Control
              </p>
              <h1 className="mt-2 max-w-3xl font-serif text-3xl font-semibold leading-tight text-[var(--ivory)] md:text-5xl">
                Property tax command centre for UPYOG cities.
              </h1>
            </div>
            <TenantFilter
              options={tenantOptions}
              value={selectedTenant}
              onChange={setSelectedTenant}
            />
          </div>
        </section>

        <KpiGrid summary={currentSummary} />

        <section className="grid min-w-0 gap-5 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="grid min-w-0 gap-5">
            <CollectionChart summaries={citySummaries} selectedTenant={selectedTenant} />
            <StatusChart summaries={citySummaries} selectedTenant={selectedTenant} />
          </div>
          <ChatAssistant dataContext={dataContext} records={propertyData} />
        </section>
      </div>
    </main>
  );
}

export default App;
