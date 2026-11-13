import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  // The current content only asks the "one ___ at a time" variant; the
  // "reason ___ by ___" row is a stale leftover from before the audit fix.
  const stale = await prisma.question.findMany({
    where: {
      source: "curriculum",
      question: { contains: "reason ___ by ___" },
    },
    select: { id: true, question: true, correctAnswer: true },
  });
  console.log(`Found ${stale.length} stale question(s):`);
  for (const q of stale) console.log(`  - ${q.id}: ${q.question} [${q.correctAnswer}]`);

  if (stale.length > 0) {
    const ids = stale.map((q) => q.id);
    // Attempts reference questions; remove dependent rows first.
    await prisma.questionAttempt.deleteMany({ where: { questionId: { in: ids } } });
    await prisma.question.deleteMany({ where: { id: { in: ids } } });
    console.log(`Deleted ${ids.length} stale question(s).`);
  }

  const total = await prisma.question.count();
  console.log(`Total questions now: ${total}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
