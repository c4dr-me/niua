export type PropertyStatus = "Approved" | "Rejected" | "Pending";

export type PropertyType =
  | "Residential"
  | "Commercial"
  | "Industrial"
  | "Agricultural";

export interface PropertyRecord {
  property_id: string;
  tenant: string;
  owner_name: string;
  property_type: PropertyType;
  ward: string;
  area_sqft: number;
  status: PropertyStatus;
  annual_tax_inr: number;
  collection_inr: number;
  registration_date: string;
  floor_count: number;
  address: string;
}

export interface CitySummary {
  tenant: string;
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  collection: number;
  annualTax: number;
  averageTax: number;
  approvalPercentage: number;
  pendingPercentage: number;
}

export type TenantFilter = "All Cities" | string;

export interface UsageState {
  date: string;
  requests: number;
}

export interface GeminiCandidate {
  content?: {
    parts?: Array<{ text?: string }>;
  };
}

export interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: {
    message?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
}

export interface DashboardHeaderProps {
  recordCount: number;
}

export interface TenantFilterProps {
  options: string[];
  value: string;
  onChange: (tenant: string) => void;
}

export interface KpiGridProps {
  summary: CitySummary;
}

export interface CollectionChartProps {
  summaries: CitySummary[];
  selectedTenant: string;
}

export interface StatusChartProps {
  summaries: CitySummary[];
  selectedTenant: string;
}

export interface ChatAssistantProps {
  dataContext: string;
  records: PropertyRecord[];
}
