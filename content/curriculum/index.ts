import type { SeedCareer } from "@/lib/curriculum/seed";
import { devopsCareer } from "./devops";
import { cloudCareer } from "./cloud";
import { aiAgentsCareer } from "./ai-agents";
import { webDevCareer } from "./web-dev";
import { systemDesignCareer } from "./system-design";

export const allCareers: SeedCareer[] = [
  devopsCareer,
  cloudCareer,
  aiAgentsCareer,
  webDevCareer,
  systemDesignCareer,
];