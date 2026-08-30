import type { SeedCareer } from "@/lib/curriculum/seed";
import { networkingPath } from "./networking";
import { awsPath } from "./aws";
import { gcpPath } from "./gcp";

export const cloudCareer: SeedCareer = {
  title: "Cloud Computing",
  description:
    "Networking fundamentals, Amazon Web Services, and Google Cloud — the models, services, and best practices behind modern cloud infrastructure.",
  slug: "cloud",
  paths: [networkingPath, awsPath, gcpPath],
};

export { networkingPath, awsPath, gcpPath };