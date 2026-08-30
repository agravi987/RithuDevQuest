import type { SeedCareer } from "@/lib/curriculum/seed";
import { aiAgentFundamentalsPath } from "./fundamentals";
import { promptEngineeringPath } from "./prompt-engineering";
import { ragMemoryPath } from "./rag";
import { agentFrameworksPath } from "./agent-frameworks";

export const aiAgentsCareer: SeedCareer = {
  title: "AI Agents",
  description:
    "From LLM fundamentals to self-contained agents with tools, memory, and guardrails — how modern AI assistants actually work.",
  slug: "ai-agents",
  paths: [
    aiAgentFundamentalsPath,
    promptEngineeringPath,
    ragMemoryPath,
    agentFrameworksPath,
  ],
};

export {
  aiAgentFundamentalsPath,
  promptEngineeringPath,
  ragMemoryPath,
  agentFrameworksPath,
};