export const ALL_CITIES = "All Cities";

export const CITY_ORDER = [
  "Delhi",
  "Mumbai",
  "Pune",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Ahmedabad",
  "Kolkata",
  "Jaipur",
  "Lucknow",
];

export const GEMINI_DEFAULT_MODEL = "gemini-2.5-flash";

export const GEMINI_DAILY_LIMIT = 120;
export const GEMINI_MIN_DELAY_MS = 4_000;
export const GEMINI_TOKEN_LIMIT_PER_REQUEST = 7_500;
export const GEMINI_USAGE_STORAGE_KEY = "upyog-gemini-usage";

export const STARTER_QUESTIONS = [
  "Which city has the highest total collection?",
  "How many properties are rejected in Mumbai?",
  "What percentage of Delhi properties are approved?",
  "Which city has the most pending properties?",
  "Compare total registrations between Pune and Jaipur.",
];

export const STARTER_QUESTION_LABELS: Record<string, string> = {
  "Which city has the highest total collection?": "Top collection city",
  "How many properties are rejected in Mumbai?": "Mumbai rejections",
  "What percentage of Delhi properties are approved?": "Delhi approval rate",
  "Which city has the most pending properties?": "Most pending city",
  "Compare total registrations between Pune and Jaipur.": "Pune vs Jaipur",
};

export const INLINE_BULLET_AFTER_COLON = /:\s+\*\s+/g;
export const INLINE_BULLET_ITEM = /\s+\*\s+([A-Za-z][^:*]{1,60}:)/g;
export const INLINE_NUMBERED_ITEM = /\s+(\d+\.)\s+/g;
