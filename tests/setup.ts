import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mock";
process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || "mock-groq-api-key";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "geist-sans", className: "geist-sans" }),
  Geist_Mono: () => ({ variable: "geist-mono", className: "geist-mono" }),
}));

vi.mock("next/navigation", () => {
  const push = vi.fn();
  const replace = vi.fn();
  const back = vi.fn();
  return {
    useRouter: () => ({ push, replace, back }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
    redirect: vi.fn(),
    notFound: vi.fn(),
  };
});