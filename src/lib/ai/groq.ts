import "server-only";

import Groq from "groq-sdk";

const globalForGroq = globalThis as unknown as {
  groq: Groq | undefined;
};

export const GROQ_DEFAULT_MODEL = "llama-3.3-70b-versatile";
export const GROQ_FAST_MODEL = "llama-3.1-8b-instant";

function createGroqClient(): Groq {
  return new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
    dangerouslyAllowBrowser: process.env.NODE_ENV === "test",
  });
}

export const groq = globalForGroq.groq ?? createGroqClient();

if (process.env.NODE_ENV !== "production") {
  globalForGroq.groq = groq;
}
