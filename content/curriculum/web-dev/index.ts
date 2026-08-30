import type { SeedCareer } from "@/lib/curriculum/seed";
import { htmlCssJsPath } from "./frontend";
import { nodeBackendPath } from "./backend";
import { reactPath } from "./react";
import { nextJsPath } from "./nextjs";

export const webDevCareer: SeedCareer = {
  title: "Web Development",
  description:
    "From HTML, CSS and JavaScript up through Node/Express, React, and Next.js — the full stack of modern web applications.",
  slug: "web-dev",
  paths: [htmlCssJsPath, nodeBackendPath, reactPath, nextJsPath],
};

export { htmlCssJsPath, nodeBackendPath, reactPath, nextJsPath };