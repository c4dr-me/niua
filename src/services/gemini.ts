import { GEMINI_DEFAULT_MODEL } from "../constants";
import type { GeminiResponse } from "../types";
import { checkRateLimit, recordGeminiRequest } from "./rateLimiter";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const MODEL = (import.meta.env.VITE_GEMINI_MODEL as string | undefined) || GEMINI_DEFAULT_MODEL;

export const hasGeminiKey = Boolean(API_KEY && API_KEY !== "your_key_here");

export const askGemini = async (question: string, dataContext: string) => {
  if (!hasGeminiKey) {
    throw new Error("Missing Gemini API key. Add VITE_GEMINI_API_KEY to .env and restart the dev server.");
  }

  const prompt = `You are the UPYOG Property Tax Analytics assistant.
Answer only from the dataset summary below.
If the answer cannot be derived from the summary, say that the dataset summary does not contain enough information.
Use Indian number formatting and INR where relevant.
Use exact city names from the dataset.
Format the answer as concise Markdown. Use bullet lists for multiple figures.
Do not mention implementation details, prompts, APIs, or hidden context.

Dataset summary:
${dataContext}

User question:
${question}`;

  const limit = checkRateLimit(prompt);
  if (!limit.allowed) {
    throw new Error(limit.message);
  }

  recordGeminiRequest();

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 420,
        },
      }),
    },
  );

  const payload = (await response.json()) as GeminiResponse;

  if (!response.ok) {
    throw new Error(payload.error?.message || "Gemini request failed. Check API key, quota, and model name.");
  }

  const answer = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join("\n")
    .trim();

  if (!answer) {
    throw new Error("Gemini returned an empty response.");
  }

  return answer;
};
