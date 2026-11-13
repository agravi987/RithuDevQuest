import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  const byType = await prisma.question.groupBy({
    by: ["type"],
    _count: { type: true },
  });
  const total = byType.reduce((sum, row) => sum + row._count.type, 0);
  console.log(`Total questions: ${total}`);
  for (const row of [...byType].sort((a, b) => b._count.type - a._count.type)) {
    console.log(`  ${row.type.padEnd(16)} ${row._count.type}`);
  }

  // Spot-check the content fixes from the grading audit.
  const checks: Array<{ label: string; contains: string; want: string }> = [
    { label: "aws AMI synonyms", contains: "An ___ (AMI)", want: "Amazon Machine Image|AMI" },
    { label: "curl -L synonyms", contains: "follows HTTP redirects", want: "-L|--location" },
    { label: "CA synonyms", contains: "signs certificates", want: "certificate authority|CA" },
    { label: "lb 5xx synonyms", contains: "fails three times", want: "500|5xx|503" },
    { label: "docker -f synonyms", contains: "custom path", want: "-f|--file" },
  ];
  for (const check of checks) {
    const q = await prisma.question.findFirst({
      where: { question: { contains: check.contains }, source: "curriculum" },
      select: { correctAnswer: true },
    });
    const ok = q?.correctAnswer === check.want;
    console.log(`${ok ? "OK  " : "FAIL"} ${check.label}: ${q?.correctAnswer ?? "not found"}`);
  }

  // The rewritten linux code_completion should now have a single blank.
  const linuxCode = await prisma.question.findFirst({
    where: { type: "code_completion", question: { contains: "GNU find" } },
    select: { correctAnswer: true },
  });
  console.log(
    `${linuxCode?.correctAnswer === "-mtime -7" ? "OK  " : "FAIL"} linux code_completion single blank: ${linuxCode?.correctAnswer ?? "not found"}`,
  );

  // The backend match should no longer have duplicate right values.
  const backendMatch = await prisma.question.findFirst({
    where: { type: "match", question: { contains: "invalid input" } },
    select: { correctAnswer: true },
  });
  const rights = (backendMatch?.correctAnswer ?? "").split("|");
  const unique = new Set(rights).size === rights.length;
  console.log(
    `${unique ? "OK  " : "FAIL"} backend match unique rights: ${backendMatch?.correctAnswer ?? "not found"}`,
  );

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
