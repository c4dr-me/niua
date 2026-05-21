import {
  GEMINI_DAILY_LIMIT,
  GEMINI_MIN_DELAY_MS,
  GEMINI_TOKEN_LIMIT_PER_REQUEST,
  GEMINI_USAGE_STORAGE_KEY,
} from "../constants";
import type { UsageState } from "../types";

let lastRequestAt = 0;
const todayKey = () => new Date().toISOString().slice(0, 10);

const getUsage = (): UsageState => {
  if (typeof localStorage === "undefined") {
    return { date: todayKey(), requests: 0 };
  }

  const raw = localStorage.getItem(GEMINI_USAGE_STORAGE_KEY);
  if (!raw) {
    return { date: todayKey(), requests: 0 };
  }

  try {
    const parsed = JSON.parse(raw) as UsageState;
    return parsed.date === todayKey() ? parsed : { date: todayKey(), requests: 0 };
  } catch {
    return { date: todayKey(), requests: 0 };
  }
};

const saveUsage = (usage: UsageState) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(GEMINI_USAGE_STORAGE_KEY, JSON.stringify(usage));
  }
};

export const estimateTokens = (text: string) => Math.ceil(text.length / 4);

export const checkRateLimit = (prompt: string) => {
  const now = Date.now();
  const nextAllowedAt = lastRequestAt + GEMINI_MIN_DELAY_MS;

  if (now < nextAllowedAt) {
    return {
      allowed: false,
      message: `Please wait ${Math.ceil((nextAllowedAt - now) / 1000)}s before asking another AI question.`,
    };
  }

  if (estimateTokens(prompt) > GEMINI_TOKEN_LIMIT_PER_REQUEST) {
    return {
      allowed: false,
      message: "The AI context is too large for one request. Try a shorter question.",
    };
  }

  const usage = getUsage();
  if (usage.requests >= GEMINI_DAILY_LIMIT) {
    return {
      allowed: false,
      message:
        "Daily demo request limit reached. Gemini limits vary by project, so check your Google AI Studio quota before continuing.",
    };
  }

  return { allowed: true, message: "" };
};

export const recordGeminiRequest = () => {
  lastRequestAt = Date.now();
  const usage = getUsage();
  saveUsage({ date: todayKey(), requests: usage.requests + 1 });
};
