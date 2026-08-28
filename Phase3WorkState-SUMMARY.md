# RithuDevQuest — Work State

## Objective
- Build RithuDevQuest (Duolingo-inspired DevOps/Cloud/AI/WebDev platform with AI mentor) following `plan.md`'s phases one at a time. Phases 1–3 (Database & Auth, Curriculum System, **Lesson Engine**) are complete — lint/typecheck/tests/build + runtime verification all green. Next is Phase 4 (Quiz Engine).

## Important Details
- **Stack**: Next.js 15.5.24, TypeScript strict, Tailwind v4, shadcn/ui (radix-nova), `motion`, Vitest + RTL, Docker PostgreSQL 16 local + Neon prod, Prisma 7.10.0, Zod 4, Auth.js v5 beta (Credentials only, JWT strategy).
- **Prisma 7 facts**: `prisma.config.ts`; `prisma-client` generator emits to `src/generated/prisma`; `migrate dev` does not refresh the generated client (`npx prisma generate` needed); seeds/scripts create their own client (don't import `@/lib/db` — it imports `server-only`).
- **Env vars**: `DATABASE_URL`, `DATABASE_ADAPTER` (`pg`/`neon`), `DATABASE_URL_UNPOOLED`, `AUTH_SECRET`, `AUTH_URL`, `GROQ_API_KEY`. Docker `rithudevquest-db` Up. Not yet a git repo. npm 12/Node 24 blocks installs (approve only with justification).
- **AGENTS.md**: server components default; business logic in `lib/`; Zod validation; no new libs; keep lint/build/tests green; never name a variable `module`.
- **Lesson scoring (Phase 3 rules, `src/lib/lesson/scoring.ts`)**: score = % of questions answered correctly on first try (0 questions ⇒ 100); XP = +20 completion, +10 first-try correct, +5 second-try correct, 0 for third+ tries or wrong. XP is awarded per lesson completion (`user.xp += xpEarned`); redoing a lesson currently re-awards XP — plan to formalize/limit in Phase 6. Levels unchanged (Phase 6).
- **Player flow**: Learn → Example → Question(s) → Complete. Number of steps = activities + questions; lessons without questions complete directly. One open `LessonAttempt` per lesson (created on first answer); `questionAttempts` record each try; `completeLesson` closes attempt, upserts `UserProgress` (`@@unique([userId, lessonId])`), +XP.
- **Navigation/access**: `src/lib/curriculum/navigation.ts` is pure (first lesson unlocked, sequential unlock). Lesson page + both server actions enforce `canAccessLesson`; locked lesson requests `redirect()` to the module page (307).
- **Schema deviations from plan (flagged)**: `Question.lessonId` (required) added so lessons → questions is direct (plan had only optional `skillId`, which is kept); seed content uses `question`/`correctAnswer` field names mapped to DB `question`/`correctAnswer`.
- **Question bank in Phase 3**: only the 6 Linux `shell-basics` lessons have questions (2 each, 12 total, MCQ + True/False). Other 54 lessons have 0 questions → complete via content only. Full 10–15/lesson bank is Phase 4.
- **Windows/PowerShell quirks (painful lessons)**:
  - `Start-Process npm start` runs a hidden process; restarting later with log redirect FAILS (`npm` is a .cmd; use `cmd.exe /c "npm start > out 2> err"`). When Node code changes, rebuild AND fully restart the server — a stale `next start` can serve an old build and 404 new routes.
  - `psql` via `docker exec` mangles quoted identifiers from PowerShell args — pipe SQL via stdin instead.
  - React inserts `<!-- -->` between text nodes (`0<!-- -->/<!-- -->4<!-- -->`), so naive `html.includes("0/4")` fails in HTTP smoke checks; check for `lucide-*` classes and real `href`s (server actions' question steps only render when reached).
- **DB state**: 3 migrations; schema up to date; test user `test@rithudevquest.dev`/`password123` has **no progress, xp 0** (smoke-test data reset).

## Work State
### Completed
- **Phase 3 fully complete.**
- Schema: added `Question`, `LessonAttempt`, `QuestionAttempt`, `UserProgress` + back-relations (User/Lesson/Skill); migration `20260828125436_lesson_progress`; client regenerated; seed re-run idempotently (12 questions verified in DB).
- Seed: `SeedQuestion`/`SeedLesson.questions` types; `assertQuestion` validation; content authored in `content/curriculum/devops/linux.ts` (6 shell-basics lessons × 2); `prisma/seed.ts` upserts questions linked to lesson + first skill (deleteMany+createMany per lesson, idempotent).
- Lib: `src/lib/lesson/{scoring,schemas,actions,types}.ts`, `src/lib/progress/queries.ts`, `getLessonQuestions()` added to `src/lib/curriculum/queries.ts`. Actions `submitAnswer`/`completeLesson` are `"use server"`, auth-gated, Zod-validated, access-checked; answers validated & XP computed entirely server-side.
- UI: `src/components/lesson/{markdown,lesson-header,learn-section,example-section,question-section,feedback-section,lesson-complete,lesson-player}.tsx` (markdown renderer is dependency-free: **bold**/`code`/paragraphs). Page `src/app/(main)/learn/[pathId]/[moduleId]/[lessonId]/page.tsx` (with `generateMetadata`, access control, next-lesson href, live `user.xp`).
- Progress wiring: module page passes real `completedLessonIds`; path page shows real per-module `completedCount`; `LessonCard`/`SkillTree` unchanged.
- Tests: `tests/unit/{lesson-scoring,lesson-markdown,lesson-question}.test.{ts,tsx}` added, seed test extended → **8 files / 60 tests pass**. Lint clean, `tsc --noEmit` clean, `npm run build` passes (lesson route 6.18 kB).
- Runtime smoke (production `npm start`): login → lesson page 200 with title/activity/question/options/steps; locked lesson 307 → module page; after DB-flow exercise: module page shows check icon (completed), play icon (next unlocked as real href), lock icons on later lessons; path page card shows `1/6`; previously-locked lesson opens 200. DB flow verified: Q1 first-try correct +10, Q2 wrong then correct (+0/+5), score 50, xp 35 (20+10+5), attempt complete, UserProgress upsert, user xp +35. All temp scripts/logs removed; smoke progress reset (user xp 0).

### Active
- (none) — awaiting go-ahead to start Phase 4.

### Blocked
- (none)

## Next Move
- Start **Phase 4 — Quiz Engine** per `plan.md`: implement remaining question types (command, scenario) + `src/lib/quiz/` answer validation (`validateAnswer`, `calculateScore` tiers: 100%/50%/25% by attempt) + question selection algorithm; seed full 10–15-question bank per lesson and author more questions into content; integrate command-type input into `QuestionSection`/`submitAnswer`; keep lint/typecheck/tests/build green.

## Relevant Files
- `D:\Current Projects\RithuDevQuest\plan.md`: authoritative 10-phase plan (+Phase 3 checklist, all verified).
- `D:\Current Projects\RithuDevQuest\AGENTS.md`: agent/code/security/test rules.
- `D:\Current Projects\RithuDevQuest\prisma\schema.prisma` + `prisma\seed.ts` + `prisma\migrations\` (3): models + idempotent seed.
- `D:\Current Projects\RithuDevQuest\content\curriculum\devops\{index,linux,git,docker,kubernetes}.ts`: curriculum + question bank (shell-basics only so far).
- `D:\Current Projects\RithuDevQuest\src\lib\curriculum\{seed,queries,navigation}.ts`: types, DB queries, pure unlock logic.
- `D:\Current Projects\RithuDevQuest\src\lib\lesson\{scoring,schemas,actions,types}.ts`: Phase 3 engine (server actions, scoring, Zod).
- `D:\Current Projects\RithuDevQuest\src\lib\progress\queries.ts`: completed-lesson/module-count queries.
- `D:\Current Projects\RithuDevQuest\src\components\lesson\*.tsx`: lesson player UI (markdown, sections, feedback, complete, player).
- `D:\Current Projects\RithuDevQuest\src\components\learning-path\*.tsx`: learn UI (unchanged).
- `D:\Current Projects\RithuDevQuest\src\app\(main)\learn\...`: `/learn`, `[pathId]`, `[pathId]/[moduleId]`, `[pathId]/[moduleId]/[lessonId]` pages.
- `D:\Current Projects\RithuDevQuest\tests\unit\*.{ts,tsx}`: 8 test files / 60 tests.
- `D:\Current Projects\RithuDevQuest\tsconfig.json` (`@content/*` alias), `vitest.config.mts`, `prisma.config.ts`, `src\lib\{db,auth,auth.config,auth-actions}.ts`, `src\middleware.ts`, `src\app\(auth)\*`: foundation (unchanged).