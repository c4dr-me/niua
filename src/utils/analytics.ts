import { ALL_CITIES, CITY_ORDER } from "../constants";
import type { CitySummary, PropertyRecord, TenantFilter } from "../types";
import { formatCurrency, formatInteger, formatPercent } from "./formatters";

export const getTenantOptions = (records: PropertyRecord[]) => {
  const discovered = new Set(records.map((record) => record.tenant));
  const ordered = CITY_ORDER.filter((city) => discovered.has(city));
  const remaining = [...discovered].filter((city) => !CITY_ORDER.includes(city)).sort();

  return [ALL_CITIES, ...ordered, ...remaining];
};

export const filterByTenant = (
  records: PropertyRecord[],
  tenant: TenantFilter,
) => (tenant === ALL_CITIES ? records : records.filter((record) => record.tenant === tenant));

export const summarizeRecords = (
  records: PropertyRecord[],
  tenant = ALL_CITIES,
): CitySummary => {
  const approved = records.filter((record) => record.status === "Approved").length;
  const rejected = records.filter((record) => record.status === "Rejected").length;
  const pending = records.filter((record) => record.status === "Pending").length;
  const collection = records.reduce((sum, record) => sum + record.collection_inr, 0);
  const annualTax = records.reduce((sum, record) => sum + record.annual_tax_inr, 0);
  const total = records.length;

  return {
    tenant,
    total,
    approved,
    rejected,
    pending,
    collection,
    annualTax,
    averageTax: total ? annualTax / total : 0,
    approvalPercentage: total ? (approved / total) * 100 : 0,
    pendingPercentage: total ? (pending / total) * 100 : 0,
  };
};

export const getCitySummaries = (records: PropertyRecord[]) =>
  getTenantOptions(records)
    .filter((tenant) => tenant !== ALL_CITIES)
    .map((tenant) => summarizeRecords(filterByTenant(records, tenant), tenant));

export const getTopCollectionCity = (summaries: CitySummary[]) =>
  summaries.reduce<CitySummary | null>((top, summary) => {
    if (!top || summary.collection > top.collection) {
      return summary;
    }

    return top;
  }, null);

export const buildDataContext = (records: PropertyRecord[]) => {
  const summaries = getCitySummaries(records);
  const all = summarizeRecords(records);
  const topCollection = getTopCollectionCity(summaries);
  const mostPending = summaries.reduce<CitySummary | null>((top, summary) => {
    if (!top || summary.pending > top.pending) {
      return summary;
    }

    return top;
  }, null);

  const lines = summaries.map(
    (summary) =>
      `${summary.tenant}: registrations ${summary.total}, approved ${summary.approved}, rejected ${summary.rejected}, pending ${summary.pending}, collection ${formatCurrency(summary.collection)}, approval rate ${formatPercent(summary.approvalPercentage)}, average annual tax ${formatCurrency(summary.averageTax)}.`,
  );

  return [
    `Dataset: ${formatInteger(all.total)} property records across ${summaries.length} Indian city tenants.`,
    `All cities totals: approved ${formatInteger(all.approved)}, rejected ${formatInteger(all.rejected)}, pending ${formatInteger(all.pending)}, collection ${formatCurrency(all.collection)}.`,
    topCollection
      ? `Highest total collection: ${topCollection.tenant} with ${formatCurrency(topCollection.collection)}.`
      : "",
    mostPending
      ? `Most pending properties: ${mostPending.tenant} with ${formatInteger(mostPending.pending)} pending properties.`
      : "",
    "City summaries:",
    ...lines,
  ]
    .filter(Boolean)
    .join("\n");
};

const findCityInQuestion = (question: string) =>
  CITY_ORDER.find((city) => question.toLowerCase().includes(city.toLowerCase()));

export const answerFromLocalAnalytics = (
  question: string,
  records: PropertyRecord[],
) => {
  const normalized = question.toLowerCase();
  const summaries = getCitySummaries(records);
  const all = summarizeRecords(records);
  const topCollection = getTopCollectionCity(summaries);

  if (
    (normalized.includes("across all") || normalized.includes("all cities")) &&
    (normalized.includes("approved") ||
      normalized.includes("rejected") ||
      normalized.includes("pending") ||
      normalized.includes("status"))
  ) {
    return `Across all cities, the records are:\n\n* Approved: ${formatInteger(all.approved)}\n* Rejected: ${formatInteger(all.rejected)}\n* Pending: ${formatInteger(all.pending)}`;
  }

  if (
    normalized.includes("highest") &&
    normalized.includes("collection") &&
    topCollection
  ) {
    return `${topCollection.tenant} has the highest total collection at ${formatCurrency(topCollection.collection)}.`;
  }

  if (normalized.includes("most pending")) {
    const mostPending = summaries.reduce((top, summary) =>
      summary.pending > top.pending ? summary : top,
    );
    return `${mostPending.tenant} has the most pending properties with ${formatInteger(mostPending.pending)} pending records.`;
  }

  const city = findCityInQuestion(question);
  if (city && normalized.includes("rejected")) {
    const summary = summarizeRecords(filterByTenant(records, city), city);
    return `${city} has ${formatInteger(summary.rejected)} rejected properties.`;
  }

  if (city && normalized.includes("approved") && normalized.includes("percentage")) {
    const summary = summarizeRecords(filterByTenant(records, city), city);
    return `${formatPercent(summary.approvalPercentage)} of ${city} properties are approved (${formatInteger(summary.approved)} of ${formatInteger(summary.total)}).`;
  }

  const comparedCities = CITY_ORDER.filter((candidate) =>
    normalized.includes(candidate.toLowerCase()),
  );

  if (
    comparedCities.length >= 2 &&
    (normalized.includes("compare") || normalized.includes("registration"))
  ) {
    return comparedCities
      .slice(0, 2)
      .map((candidate) => {
        const total = filterByTenant(records, candidate).length;
        return `${candidate}: ${formatInteger(total)} registrations`;
      })
      .join("; ");
  }

  return null;
};
