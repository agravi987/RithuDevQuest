import "server-only";

import Groq from "groq-sdk";

const globalForGroq = globalThis as unknown as {
  groq: Groq | undefined;
};

export const GROQ_DEFAULT_MODEL = "openai/gpt-oss-20b";
export const GROQ_FAST_MODEL = "openai/gpt-oss-20b";
export const GROQ_REASONING_MODEL = "openai/gpt-oss-120b";

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
