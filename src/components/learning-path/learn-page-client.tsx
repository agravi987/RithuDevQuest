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
    progress?: number;
    isRecommended?: boolean;
  }[];
};

export function LearnPageClient({ paths }: LearnPageClientProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2">
      {paths.map((path, i) => (
        <motion.div
          key={path.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
          style={{ contentVisibility: "auto" }}
        >
          <PlanetCard
            slug={path.slug}
            title={path.title}
            description={path.description}
            moduleCount={path.moduleCount}
            lessonCount={path.lessonCount}
            progress={path.progress ?? 0}
            isRecommended={path.isRecommended ?? false}
            href={`/learn/${path.slug}`}
          />
        </motion.div>
      ))}
    </div>
  );
}
