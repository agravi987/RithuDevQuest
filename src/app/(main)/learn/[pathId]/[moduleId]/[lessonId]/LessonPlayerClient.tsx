"use client";

import dynamic from "next/dynamic";

const LessonPlayer = dynamic(
  () => import("@/components/lesson/lesson-player").then((mod) => mod.LessonPlayer),
  { ssr: false, loading: () => <div className="animate-pulse h-96 w-full" /> }
);

interface LessonPlayerClientProps {
  data: import("@/lib/lesson/types").LessonPlayerData;
  heartsInfo: { hearts: number; maxHearts: number; nextRegen: Date | null };
}

export function LessonPlayerClient({ data, heartsInfo }: LessonPlayerClientProps) {
  return <LessonPlayer data={data} heartsInfo={heartsInfo} />;
}