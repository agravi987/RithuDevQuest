import type { SeedCareer } from "@/lib/curriculum/seed";
import { linuxPath } from "./linux";
import { gitPath } from "./git";
import { dockerPath } from "./docker";
import { kubernetesPath } from "./kubernetes";

export const devopsCareer: SeedCareer = {
  title: "DevOps Engineering",
  description:
    "From Linux fundamentals to orchestrating containers at scale — the complete DevOps journey.",
  slug: "devops",
  paths: [linuxPath, gitPath, dockerPath, kubernetesPath],
};