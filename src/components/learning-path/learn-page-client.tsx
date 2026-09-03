"use client";

import { motion } from "motion/react";
import { PlanetCard } from "@/components/learning-path/planet-card";

type LearnPageClientProps = {
  paths: {
    id: string;
    title: string;
    description: string | null;
    slug: string;
    moduleCount: number;
    lessonCount: number;
  }[];
};

export function LearnPageClient({ paths }: LearnPageClientProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
      {paths.map((path, i) => (
        <motion.div
          key={path.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
          style={{ contentVisibility: "auto" }}
        >
          <PlanetCard
            slug={path.slug}
            title={path.title}
            description={path.description}
            moduleCount={path.moduleCount}
            lessonCount={path.lessonCount}
            href={`/learn/${path.slug}`}
          />
        </motion.div>
      ))}
    </div>
  );
}
