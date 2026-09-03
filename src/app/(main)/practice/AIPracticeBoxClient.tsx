"use client";

import dynamic from "next/dynamic";

const AIPracticeBox = dynamic(
  () => import("@/components/practice/ai-practice-box").then((mod) => mod.AIPracticeBox),
  { ssr: false, loading: () => <div className="animate-pulse h-64 rounded-2xl bg-muted/30" /> }
);

export function AIPracticeBoxClient() {
  return <AIPracticeBox />;
}