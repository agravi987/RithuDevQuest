import type { SeedCareer } from "@/lib/curriculum/seed";
import { systemDesignFoundationsPath } from "./foundations";
import { systemDesignHldPath } from "./hld";
import { systemDesignLldPath } from "./lld";
import { systemDesignScalabilityPath } from "./scalability";

export const systemDesignCareer: SeedCareer = {
  title: "System Design",
  description:
    "From first principles (clients, servers, databases, caching, CAP) through high-level architectures, low-level object modeling, and the scaling and reliability tactics that keep systems up at scale.",
  slug: "system-design",
  paths: [
    systemDesignFoundationsPath,
    systemDesignHldPath,
    systemDesignLldPath,
    systemDesignScalabilityPath,
  ],
};

export {
  systemDesignFoundationsPath,
  systemDesignHldPath,
  systemDesignLldPath,
  systemDesignScalabilityPath,
};