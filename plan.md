# RithuDevQuest — Implementation Plan

## Product Summary

RithuDevQuest is a Duolingo-inspired gamified technical learning platform for DevOps, Cloud, AI, and Web Development skills. Students learn through short lessons, earn XP, build streaks, and master skills — guided by an AI mentor named Rithu.

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 15 | App Router, full-stack React |
| Language | TypeScript | Strict mode, type-safe development |
| Styling | Tailwind CSS v4 | CSS-first configuration |
| UI Components | shadcn/ui | New York style, oklch colors, ownable code |
| Animations | motion | React 19 compatible (npm: `motion`) |
| Backend | Next.js Route Handlers + Server Actions | APIs and server logic |
| Database (Local) | Docker PostgreSQL 16 | Local development |
| Database (Prod) | Neon PostgreSQL | Serverless production database |
| ORM | Prisma 7 | Database access, migrations |
| Validation | Zod | API + AI response validation |
| AI | Groq SDK v1.6 | Question generation, mentor, explanations |
| Auth | Auth.js v5 (next-auth@beta) | Credentials provider, JWT sessions |
| Testing | Vitest + React Testing Library | Unit + component tests |
| Deployment | Vercel | Application hosting |
| Source Control | Git + GitHub | Version control |

---

## Database Strategy: Docker (Dev) + Neon (Prod)

```
Development (Local)                 Production (Vercel)
┌─────────────────────┐            ┌─────────────────────────┐
│ Docker Desktop       │            │ Vercel Serverless        │
│ PostgreSQL 16        │            │                          │
│ localhost:5432       │            │ @prisma/adapter-neon     │
│                      │            │         ↓                │
│ No SSL               │            │ Neon PostgreSQL          │
│ No connection pooling│            │ (pooled connection)      │
│ Always warm          │            │ Scales to zero           │
└─────────────────────┘            └─────────────────────────┘
```

### Environment Configuration

```bash
# .env (local — Docker)
DATABASE_URL="postgresql://rithu:rithu123@localhost:5432/rithudevquest"
DATABASE_ADAPTER="pg"

# .env.production (Vercel — Neon)
DATABASE_URL="postgresql://...-pooler...neon.tech/rithudevquest?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://...neon.tech/rithudevquest?sslmode=require"
DATABASE_ADAPTER="neon"
GROQ_API_KEY="..."
AUTH_SECRET="..."
```

### Why Docker for Local Development

- Zero cold start — PostgreSQL is always warm
- Offline development — no internet needed for database
- Fast queries — localhost, no network latency
- Easy reset — `docker compose down -v` wipes data cleanly
- Consistent PostgreSQL version across machines

### Why Neon for Production

- Serverless — scales to zero when idle (no cost)
- Connection pooling built-in — handles Vercel's serverless functions
- Branching — create database branches for testing
- Free tier sufficient for personal use
- Native Prisma adapter support

---

## Project Structure

```
rithudevquest/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   ├── signup/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   └── layout.tsx
│   │   ├── (main)/
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── _components/
│   │   │   ├── learn/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [pathId]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [moduleId]/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── [lessonId]/
│   │   │   │   │           ├── page.tsx
│   │   │   │   │           ├── loading.tsx
│   │   │   │   │           └── error.tsx
│   │   │   ├── practice/
│   │   │   │   └── page.tsx
│   │   │   ├── achievements/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── loading.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── ai/
│   │   │   │   ├── generate-question/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── explain/
│   │   │   │   │   └── route.ts
│   │   │   │   └── mentor/
│   │   │   │       └── route.ts
│   │   │   ├── lessons/
│   │   │   │   └── route.ts
│   │   │   ├── quiz/
│   │   │   │   └── route.ts
│   │   │   └── progress/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── not-found.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                    (shadcn — owned, editable)
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   └── signup-form.tsx
│   │   ├── dashboard/
│   │   │   ├── stats-card.tsx
│   │   │   ├── skill-bars.tsx
│   │   │   ├── continue-learning.tsx
│   │   │   └── rithu-greeting.tsx
│   │   ├── learning-path/
│   │   │   ├── skill-tree.tsx
│   │   │   ├── module-card.tsx
│   │   │   ├── unit-list.tsx
│   │   │   └── lesson-node.tsx
│   │   ├── lesson/
│   │   │   ├── lesson-header.tsx
│   │   │   ├── learn-section.tsx
│   │   │   ├── example-section.tsx
│   │   │   ├── question-section.tsx
│   │   │   ├── feedback-section.tsx
│   │   │   └── lesson-complete.tsx
│   │   ├── quiz/
│   │   │   ├── mcq-question.tsx
│   │   │   ├── true-false-question.tsx
│   │   │   ├── command-question.tsx
│   │   │   └── question-progress.tsx
│   │   ├── gamification/
│   │   │   ├── xp-display.tsx
│   │   │   ├── xp-animation.tsx
│   │   │   ├── streak-counter.tsx
│   │   │   ├── level-badge.tsx
│   │   │   ├── achievement-card.tsx
│   │   │   └── progress-bar.tsx
│   │   ├── mentor/
│   │   │   ├── rithu-bubble.tsx
│   │   │   ├── rithu-explanation.tsx
│   │   │   └── rithu-recommendation.tsx
│   │   └── shared/
│   │       ├── header.tsx
│   │       ├── sidebar.tsx
│   │       └── mobile-nav.tsx
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── groq.ts                (Groq client singleton)
│   │   │   ├── generator.ts           (content generation pipeline)
│   │   │   ├── prompts/
│   │   │   │   ├── question.ts
│   │   │   │   ├── explanation.ts
│   │   │   │   └── hint.ts
│   │   │   └── schemas/
│   │   │       ├── question.ts        (Zod schemas)
│   │   │       ├── explanation.ts
│   │   │       └── hint.ts
│   │   ├── db.ts                      (Prisma singleton — pg or neon adapter)
│   │   ├── auth.ts                    (Auth.js v5 config)
│   │   ├── curriculum/
│   │   │   ├── queries.ts             (database queries)
│   │   │   ├── navigation.ts          (prerequisite logic)
│   │   │   └── seed.ts                (seed data types)
│   │   ├── mastery/
│   │   │   ├── score.ts               (mastery calculation)
│   │   │   └── recommendation.ts      (practice recommendations)
│   │   ├── gamification/
│   │   │   ├── xp.ts                  (XP calculation rules)
│   │   │   ├── levels.ts              (level thresholds)
│   │   │   ├── streaks.ts             (streak tracking)
│   │   │   └── achievements.ts        (achievement definitions)
│   │   ├── mentor/
│   │   │   └── responses.ts           (contextual mentor logic)
│   │   └── utils.ts                   (cn helper, shared utilities)
│   ├── types/
│   │   ├── curriculum.ts
│   │   ├── quiz.ts
│   │   ├── gamification.ts
│   │   └── ai.ts
│   └── test/
│       ├── setup.ts
│       ├── unit/
│       │   ├── xp.test.ts
│       │   ├── mastery.test.ts
│       │   ├── levels.test.ts
│       │   ├── streaks.test.ts
│       │   └── question-validation.test.ts
│       ├── integration/
│       │   ├── lesson-flow.test.ts
│       │   └── auth-flow.test.ts
│       └── components/
│           ├── lesson-section.test.tsx
│           └── quiz-question.test.tsx
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── content/
│   └── curriculum/
│       └── devops/
│           ├── linux.ts
│           ├── git.ts
│           ├── docker.ts
│           └── kubernetes.ts
├── docker-compose.yml
├── .env.example
├── .env.local
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── vitest.config.ts
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## Phase 0 — Project Scaffolding & Foundation

### Milestone
`npm run dev` shows a working Next.js app with all tooling configured.

### Steps

1. **Scaffold Next.js project**
   ```bash
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
   ```

2. **Install core dependencies**
   ```bash
   npm install motion zod next-themes
   ```

3. **Initialize shadcn/ui**
   ```bash
   npx shadcn@latest init
   ```
   - Style: New York
   - Base color: Neutral
   - CSS variables: Yes

4. **Add shadcn components**
   ```bash
   npx shadcn@latest add button card input label badge skeleton sonner separator avatar progress
   ```

5. **Set up project directory structure**
   - Create all directories listed in the project structure
   - Add placeholder `index.ts` files where needed for module resolution

6. **Configure Tailwind v4 theme**
   - Custom brand colors (green/purple tech theme)
   - Custom fonts via `next/font`
   - Dark mode configuration via `next-themes`

7. **Set up dark mode**
   - Install `next-themes`
   - Create `providers.tsx` (ThemeSupplier)
   - Wrap root layout with ThemeProvider

8. **Set up Vitest**
   ```bash
   npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event vite-tsconfig-paths
   ```
   - Create `vitest.config.ts`
   - Create `src/test/setup.ts`
   - Add test scripts to `package.json`
   - Write one passing test to verify setup

9. **Configure ESLint + Prettier**
   - Verify Next.js ESLint config works
   - Add Prettier with Tailwind plugin

10. **Create `.env.example`**
    ```bash
    # Database
    DATABASE_URL="postgresql://rithu:rithu123@localhost:5432/rithudevquest"
    DATABASE_ADAPTER="pg"

    # Auth
    AUTH_SECRET="generate-with-npx-auth-secret"

    # AI
    GROQ_API_KEY="your-groq-api-key"
    ```

11. **Create `.gitignore`** — ensure `.env`, `.env.local`, `node_modules`, `.next` are excluded

### Verification Checklist
- [ ] `npm run dev` — app loads at localhost:3000
- [ ] `npm run lint` — passes clean
- [ ] `npm run test:run` — passes (at least 1 test)
- [ ] Dark mode toggles correctly
- [ ] shadcn components render (button, card, input)
- [ ] Tailwind classes apply correctly
- [ ] No TypeScript errors

---

## Phase 1 — Database & Authentication

### Milestone
User can sign up, log in, and see a protected dashboard.

### Steps

1. **Set up Docker PostgreSQL**
   - Create `docker-compose.yml`:
     ```yaml
     services:
       postgres:
         image: postgres:16-alpine
         container_name: rithudevquest-db
         ports:
           - "5432:5432"
         environment:
           POSTGRES_USER: rithu
           POSTGRES_PASSWORD: rithu123
           POSTGRES_DB: rithudevquest
         volumes:
           - pgdata:/var/lib/postgresql/data
         healthcheck:
           test: ["CMD-SHELL", "pg_isready -U rithu -d rithudevquest"]
           interval: 5s
           timeout: 5s
           retries: 5

     volumes:
       pgdata:
     ```
   - `docker compose up -d`
   - Verify connection: `docker exec rithudevquest-db psql -U rithu -d rithudevquest -c '\l'`

2. **Install Prisma + database drivers**
   ```bash
   npm install @prisma/client @prisma/adapter-pg @prisma/adapter-neon pg
   npm install -D prisma @types/pg
   ```

3. **Initialize Prisma**
   ```bash
   npx prisma init --output ./src/generated/prisma
   ```

4. **Create `prisma.config.ts`**
   ```typescript
   import 'dotenv/config'
   import { defineConfig, env } from 'prisma/config'

   export default defineConfig({
     schema: 'prisma/schema.prisma',
     datasource: {
       url: env('DATABASE_URL'),
     },
   })
   ```

5. **Define Prisma schema — Auth.js models**
   ```prisma
   generator client {
     provider = "prisma-client"
     output   = "../src/generated/prisma"
   }

   datasource db {
     provider = "postgresql"
   }

   model User {
     id            String    @id @default(cuid())
     name          String?
     email         String?   @unique
     emailVerified DateTime?
     image         String?
     passwordHash  String?
     role          String    @default("user")
     xp            Int       @default(0)
     level         Int       @default(1)
     accounts      Account[]
     sessions      Session[]
     createdAt     DateTime  @default(now())
     updatedAt     DateTime  @updatedAt
   }

   model Account {
     id                String  @id @default(cuid())
     userId            String
     type              String
     provider          String
     providerAccountId String
     refresh_token     String? @db.Text
     access_token      String? @db.Text
     expires_at        Int?
     token_type        String?
     scope             String?
     id_token          String? @db.Text
     session_state     String?
     user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

     @@unique([provider, providerAccountId])
   }

   model Session {
     id           String   @id @default(cuid())
     sessionToken String   @unique
     userId       String
     expires      DateTime
     user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
   }

   model VerificationToken {
     identifier String
     token      String   @unique
     expires    DateTime

     @@unique([identifier, token])
   }
   ```

6. **Run initial migration**
   ```bash
   npx prisma migrate dev --name init
   ```

7. **Create Prisma singleton — `src/lib/db.ts`**
   ```typescript
   import { PrismaClient } from '@/generated/prisma'
   import { PrismaPg } from '@prisma/adapter-pg'
   import { PrismaNeon } from '@prisma/adapter-neon'

   const globalForPrisma = globalThis as unknown as {
     prisma: PrismaClient | undefined
   }

   function createPrismaClient() {
     const adapter = process.env.DATABASE_ADAPTER === 'neon'
       ? new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
       : new PrismaPg({ connectionString: process.env.DATABASE_URL! })

     return new PrismaClient({ adapter })
   }

   export const prisma = globalForPrisma.prisma ?? createPrismaClient()

   if (process.env.NODE_ENV !== 'production') {
     globalForPrisma.prisma = prisma
   }
   ```

8. **Install Auth.js**
   ```bash
   npm install next-auth@beta @auth/prisma-adapter bcryptjs
   npm install -D @types/bcryptjs
   ```

9. **Create `src/lib/auth.ts`** — Auth.js v5 config
   - Credentials provider (email + password)
   - JWT session strategy
   - Prisma adapter
   - Zod validation for credentials
   - Callbacks for JWT and session

10. **Create `app/api/auth/[...nextauth]/route.ts`**

11. **Create auth pages**
    - `app/(auth)/layout.tsx` — centered card layout
    - `app/(auth)/login/page.tsx` — login form
    - `app/(auth)/signup/page.tsx` — signup form
    - Create signup Server Action with Zod validation
    - Create login form with react-hook-form + Zod

12. **Create `middleware.ts`**
    - Protect all `(main)` routes
    - Redirect unauthenticated users to `/login`
    - Redirect authenticated users away from auth pages

13. **Create basic dashboard layout**
    - `app/(main)/layout.tsx` — header + sidebar + content area
    - `app/(main)/dashboard/page.tsx` — placeholder dashboard

### Verification Checklist
- [ ] `docker compose up -d` — PostgreSQL container starts
- [ ] `npx prisma migrate dev` — migration applies successfully
- [ ] Sign up creates user in database
- [ ] Login returns JWT session
- [ ] Unauthenticated access to `/dashboard` redirects to `/login`
- [ ] Authenticated user sees dashboard
- [ ] `npm run test:run` — all tests pass

---

## Phase 2 — Curriculum System

### Milestone
DevOps learning path is visible and navigable in the UI.

### Steps

1. **Extend Prisma schema — curriculum models**
   ```prisma
   model Career {
     id          String        @id @default(cuid())
     title       String
     description String?
     slug        String        @unique
     order       Int
     paths       LearningPath[]
     createdAt   DateTime      @default(now())
   }

   model LearningPath {
     id          String   @id @default(cuid())
     title       String
     description String?
     slug        String
     order       Int
     careerId    String
     career      Career   @relation(fields: [careerId], references: [id])
     modules     Module[]
     createdAt   DateTime @default(now())

     @@unique([careerId, slug])
   }

   model Module {
     id          String   @id @default(cuid())
     title       String
     description String?
     slug        String
     icon        String?
     order       Int
     pathId      String
     path        LearningPath @relation(fields: [pathId], references: [id])
     units       Unit[]
     createdAt   DateTime @default(now())

     @@unique([pathId, slug])
   }

   model Unit {
     id          String   @id @default(cuid())
     title       String
     description String?
     slug        String
     order       Int
     moduleId    String
     module      Module   @relation(fields: [moduleId], references: [id])
     lessons     Lesson[]
     createdAt   DateTime @default(now())

     @@unique([moduleId, slug])
   }

   model Lesson {
     id                  String   @id @default(cuid())
     title               String
     description         String?
     slug                String
     order               Int
     estimatedMinutes    Int      @default(5)
     learningObjectives  String[]
     unitId              String
     unit                Unit     @relation(fields: [unitId], references: [id])
     skills              Skill[]
     activities          Activity[]
     createdAt           DateTime @default(now())

     @@unique([unitId, slug])
   }

   model Skill {
     id          String   @id @default(cuid())
     name        String
     description String?
     lessonId    String
     lesson      Lesson   @relation(fields: [lessonId], references: [id])
     userSkills  UserSkill[]
     createdAt   DateTime @default(now())
   }

   model Activity {
     id        String   @id @default(cuid())
     type      String   // "learn", "example", "question", "practice", "review"
     content   Json     // flexible content storage
     order     Int
     lessonId  String
     lesson    Lesson   @relation(fields: [lessonId], references: [id])
     createdAt DateTime @default(now())
   }
   ```

2. **Create seed content files**
   ```
   content/curriculum/devops/
   ├── linux.ts        (Basics, Files, Permissions, Processes, Networking)
   ├── git.ts          (Basics, Branching, Merging, Remote, Collaboration)
   ├── docker.ts       (Containers, Images, Volumes, Networking, Compose)
   └── kubernetes.ts   (Fundamentals, Pods, Deployments, Services, ConfigMaps)
   ```

3. **Create curriculum seed script** (`prisma/seed.ts`)
   - Read content files
   - Insert Career → Path → Module → Unit → Lesson → Skill → Activity
   - Handle idempotency (don't duplicate on re-seed)

4. **Run seed**
   ```bash
   npx tsx prisma/seed.ts
   ```

5. **Create `src/lib/curriculum/queries.ts`**
   - `getCareerBySlug()`
   - `getPathWithModules()`
   - `getModuleWithUnits()`
   - `getUnitWithLessons()`
   - `getLessonWithActivities()`

6. **Create `src/lib/curriculum/navigation.ts`**
   - `getNextLesson()` — prerequisite-based unlocking
   - `canAccessLesson()` — check if prerequisites met
   - `getLessonProgress()` — completion status

7. **Create learning path UI**
   - `app/(main)/learn/page.tsx` — skill tree view (Server Component)
   - `app/(main)/learn/[pathId]/page.tsx` — modules list
   - `app/(main)/learn/[pathId]/[moduleId]/page.tsx` — units + lessons list
   - Components: `SkillTree`, `ModuleCard`, `UnitList`, `LessonNode`

8. **Implement prerequisite-based unlocking**
   - First lesson in each module is always unlocked
   - Subsequent lessons unlock after completing the previous one
   - Visual indicators: locked 🔒, available ⚡, completed ✅

### Verification Checklist
- [ ] Seed data loads into database correctly
- [ ] Skill tree renders with full DevOps hierarchy
- [ ] Navigation: Path → Module → Unit → Lesson works
- [ ] Locked lessons show lock icon
- [ ] Completed lessons show checkmark
- [ ] All curriculum data comes from database
- [ ] `npm run test:run` — all tests pass

---

## Phase 3 — Lesson Engine

### Milestone
Student can open a lesson, learn, practice, and complete it.

### Steps

1. **Extend Prisma schema — progress models**
   ```prisma
   model Question {
     id            String   @id @default(cuid())
     type          String   // "mcq", "true_false", "command", "scenario"
     difficulty    String   // "beginner", "intermediate", "advanced"
     question      String
     options       Json?    // for MCQ: array of options
     correctAnswer String
     explanation   String
     hint          String?
     skillId       String?
     skill         Skill?   @relation(fields: [skillId], references: [id])
     source        String   @default("curriculum") // "curriculum", "ai_generated"
     createdAt     DateTime @default(now())
   }

   model LessonAttempt {
     id         String   @id @default(cuid())
     userId     String
     user       User     @relation(fields: [userId], references: [id])
     lessonId   String
     lesson     Lesson   @relation(fields: [lessonId], references: [id])
     score      Int      // percentage 0-100
     xpEarned   Int
     completed  Boolean  @default(false)
     startedAt  DateTime @default(now())
     completedAt DateTime?
   }

   model QuestionAttempt {
     id              String   @id @default(cuid())
     userId          String
     user            User     @relation(fields: [userId], references: [id])
     questionId      String
     question        Question @relation(fields: [questionId], references: [id])
     lessonAttemptId String
     lessonAttempt   LessonAttempt @relation(fields: [lessonAttemptId], references: [id])
     isCorrect       Boolean
     userAnswer      String
     attemptNumber   Int      @default(1) // first try, retry, etc.
     xpEarned        Int
     answeredAt      DateTime @default(now())
   }

   model UserProgress {
     id           String   @id @default(cuid())
     userId       String
     user         User     @relation(fields: [userId], references: [id])
     lessonId     String
     lesson       Lesson   @relation(fields: [lessonId], references: [id])
     completed    Boolean  @default(false)
     score        Int      @default(0)
     lastAccessed DateTime @default(now())

     @@unique([userId, lessonId])
   }
   ```

2. **Create lesson page** — `app/(main)/learn/[pathId]/[moduleId]/[lessonId]/page.tsx`
   - Server Component: fetch lesson data, activities, questions
   - Pass data to client-side lesson player

3. **Create lesson components**
   - `LessonHeader` — progress bar, lesson title, XP display
   - `LearnSection` — markdown/explanation content display
   - `ExampleSection` — code blocks, command examples
   - `QuestionSection` — interactive question display
   - `FeedbackSection` — correct/incorrect feedback with Rithu explanation
   - `LessonComplete` — completion screen with XP earned, stars

4. **Implement lesson flow**
   ```
   Learn → Example → Question(s) → Complete
   ```
   - Sequential progression through activities
   - Each activity must be completed before moving to next
   - Track current position in lesson

5. **Create lesson state management**
   - Current activity index
   - Answers submitted
   - Score tracking
   - XP earned during lesson

6. **Implement lesson completion**
   - Calculate score (correct answers / total questions)
   - Calculate XP earned
   - Record LessonAttempt
   - Record QuestionAttempt for each question
   - Update UserProgress
   - Trigger gamification checks

7. **Create Server Actions**
   - `submitAnswer()` — validate answer, record attempt, return feedback
   - `completeLesson()` — finalize lesson, award XP, check achievements

### Verification Checklist
- [ ] Lesson opens with correct content from database
- [ ] Questions display interactively (MCQ, True/False)
- [ ] Selecting an answer shows feedback
- [ ] Correct answers show positive feedback + XP animation
- [ ] Incorrect answers show explanation
- [ ] Progress bar advances through lesson
- [ ] Lesson completion records progress in database
- [ ] XP is calculated and stored server-side
- [ ] `npm run test:run` — all tests pass

---

## Phase 4 — Duolingo-Grade Quiz Engine (Galaxy Edition)

### Milestone
Transform the quiz experience into an authentic, faithful replica of **Duolingo**'s design, architecture, game mechanics, and styling — elevated with a sleek **Cosmic Galaxy Theme** (deep-space midnight canvas, glowing celestial accents, 3D tactile beveled buttons, sliding bottom action drawer, spaced mistake recycling, a 6-character space crew, synthetic voice chirps, native mobile responsive feel, zero-bloat lightweight code, and end-to-end gamification).

---

### 1. Architectural Blueprint & Philosophy

Duolingo's world-class engagement is driven by high-frequency, low-friction micro-interactions with immediate audiovisual feedback, tactile physical physics, and zero cognitive clutter.

```
┌────────────────────────────────────────────────────────────────────────┐
│ DUOLINGO GALAXY HEADER (Fixed Top, z-40)                               │
│  [✕ Quit]       ═══════════════════[Progress 65%]════     ❤️ 4    🔥 5  │
├────────────────────────────────────────────────────────────────────────┤
│ QUESTION ARENA (Center Focus, Single-Column "Duolingo Zen" Canvas)     │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ [⚡ Astra (Cyber-Eng)] "Choose the command to inspect live logs"│   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ [1]  docker logs -f my-app                                     │   │
│   │      (3D Tactile Card: Deep border-b-4, emerald glow on select)│   │
│   ├────────────────────────────────────────────────────────────────┤   │
│   │ [2]  docker inspect my-app                                     │   │
│   ├────────────────────────────────────────────────────────────────┤   │
│   │ [3]  docker ps -a                                              │   │
│   ├────────────────────────────────────────────────────────────────┤   │
│   │ [4]  docker top my-app                                         │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ DUOLINGO BOTTOM ACTION DRAWER (Sticky Full-Bleed Sheet, z-40)          │
│                                                                        │
│   [Neutral State]:                                                     │
│   [ SKIP ]                                           [   CHECK   ]     │
│                                                     (3D Chunky Button) │
│                                                                        │
│   [Correct State (Slides Up)]: Emerald Glow Banner                     │
│   (✓)  Nicely done!  +10 XP                         [  CONTINUE  ]     │
│                                                                        │
│   [Incorrect State (Slides Up)]: Supernova Crimson Banner              │
│   (✕)  Correct solution: docker logs -f my-app       [   GOT IT   ]     │
│        Explanation: -f streams the live log output                     │
└────────────────────────────────────────────────────────────────────────┘
```

#### UI Paradigm Transformation: Legacy vs. Duolingo Galaxy

| Legacy Quiz UI (To be Removed / Replaced) | Duolingo Galaxy Experience (New Standard) |
| :--- | :--- |
| Multi-column sidebars, breadcrumbs, jump menus | **Single-column "Duolingo Zen" focus arena (`max-w-xl mx-auto`)** |
| Floating Previous / Next / Skip navigation bars | **Sticky sliding bottom action drawer (Neutral $\to$ Emerald $\to$ Crimson)** |
| Flat buttons with faint hover transitions | **Chunky 3D tactile buttons with beveled bottom borders (`border-b-4`)** |
| Disconnected static cards with text headers | **Animated vector Starship Crew member + interactive speech bubble** |
| Silent answer selection and grading | **Web Audio synthesis (tap pops, chimes, heart shatter, voice chirps)** |
| Failed quizzes end in defeat with a low score | **Spaced Mistake Recycling Queue: 100% mastery required to finish** |
| Static hearts counter | **Cracking hearts animation with 3-way recovery (Practice, XP, Timer)** |
| Standard Next/Finish results page | **Victory screen with confetti explosion, odometer XP counter, streak flame** |

---

### 2. Native Mobile-App Architecture & Responsive Feel (iOS & Android)

To guarantee RithuDevQuest feels identical to a native mobile app downloaded from the App Store or Google Play:

```
┌──────────────────────────────────────┐     ┌─────────────────────────────────────────────────────────────┐
│ MOBILE VIEWPORT (375px - 430px)      │     │ DESKTOP VIEWPORT (1024px+)                                  │
│                                      │     │                                                             │
│ ┌──────────────────────────────────┐ │     │ ┌─────────────────────────────────────────────────────────┐ │
│ │ [✕]  ════════[75%]════   ❤️4  🔥3│ │     │ │ [✕ Quit]     ══════════[75%]══════════    ❤️ 4    🔥 3   │ │
│ └──────────────────────────────────┘ │     │ └─────────────────────────────────────────────────────────┘ │
│                                      │     │                                                             │
│ [⚡ Astra] 💬 "Choose the right flag"│     │   ┌──────────────┐  ┌─────────────────────────────────────┐ │
│                                      │     │   │              │  │ 💬 "Choose the command flag to run  │ │
│ ┌──────────────────────────────────┐ │     │   │  [⚡ Astra]   │  │    a container in the background"   │ │
│ │ [1]  docker run -d nginx         │ │     │   │ Cyber-Eng.   │  └─────────────────────────────────────┘ │
│ └──────────────────────────────────┘ │     │   │ (Hover/Blink)│                                          │
│ ┌──────────────────────────────────┐ │     │   └──────────────┘  ┌─────────────────────────────────────┐ │
│ │ [2]  docker run -it nginx        │ │     │                     │ [1]  docker run -d nginx            │ │
│ └──────────────────────────────────┘ │     │                     ├─────────────────────────────────────┤ │
│ ┌──────────────────────────────────┐ │     │                     │ [2]  docker run -it nginx           │ │
│ │ [3]  docker run --rm nginx       │ │     │                     └─────────────────────────────────────┘ │
│ └──────────────────────────────────┘ │     │                                                             │
│                                      │     │ ┌─────────────────────────────────────────────────────────┐ │
│ ┌──────────────────────────────────┐ │     │ │ [ SKIP ]                                  [   CHECK   ] │ │
│ │       [    CHECK (Full Width)  ] │ │     │ └─────────────────────────────────────────────────────────┘ │
│ └──────────────────────────────────┘ │     └─────────────────────────────────────────────────────────────┘
└──────────────────────────────────────┘
```

#### 1. Dynamic Viewport Height & Safe Area Insets (`100dvh`)
- **No Address Bar Jump**: Standard `100vh` causes bottom bars to jump or be occluded when mobile browser chrome expands/collapses. The layout strictly uses:
  ```css
  height: 100dvh;
  max-height: 100dvh;
  padding-top: max(env(safe-area-inset-top), 12px);
  padding-bottom: max(env(safe-area-inset-bottom), 16px);
  overscroll-behavior: none;
  ```
- **Zero 300ms Mobile Tap Delay**: Interactive elements enforce `touch-action: manipulation` across buttons, cards, and token chips, eliminating the native browser 300ms double-tap zoom delay.

#### 2. Physiological Thumb-Zone Action Sheet Architecture
- **Mobile Bottom Bar**: Docked directly in the physiological "Thumb Zone". On mobile screens ($< 640\text{px}$), the 3D "CHECK" button expands to full width (`w-full py-4 text-base sm:text-lg font-black tracking-wide`), making one-handed mobile play effortless.
- **Slide-Up Responsive Sheet**: When evaluating, the drawer springs up to cover 28% to 35% of the mobile viewport, keeping the "CONTINUE" / "GOT IT" button firmly anchored under the right thumb.

#### 3. Native Micro-Haptic Feedback (`navigator.vibrate`)
On supported mobile devices (Android / PWA), physical tactile vibrations synchronize with audio:
- **Card Selection**: `10ms` subtle haptic tick.
- **Correct Answer**: `[30ms, 40ms]` joyous double-tick.
- **Incorrect Answer**: `60ms` heavy error buzz.
- **Heart Loss**: `[25ms, 50ms, 25ms]` triple shatter pulse.

#### 4. Token Silhouette Placeholders (Mobile Word Bank)
- In the mobile Word Bank, screen space is precious. When a user taps a token chip into the answer slot:
  - The token's original position in the lower bank transforms into a faint **dashed silhouette outline** (`border border-dashed border-white/20 bg-white/5 rounded-xl`).
  - This guarantees **Cumulative Layout Shift (CLS) = 0** and visually communicates where each token will return when recalled.

#### 5. Horizontal Motion Slide-Transitions
- Moving between questions uses fluid horizontal slide transitions:
  - Outgoing question: `x: -40, opacity: 0` (exiting left).
  - Incoming question: `x: 40, opacity: 0` (entering from right).
  - Spring physics: `stiffness: 350, damping: 32` for that snappy 60fps native Duolingo feel.

---

### 3. "Duolingo Zen" — Minimalist Clean UI/UX Rules (Zero Clutter)

To guarantee the clean, uncluttered, world-class aesthetic requested:
- **Single-Column Focus**: The quiz arena is constrained to `max-w-xl mx-auto w-full px-4 sm:px-6`. There are strictly zero sidebars, breadcrumbs, user stats side-panels, or distracting chrome.
- **Generous Negative Space**: 32px to 48px breathing room between character, prompt, and options. Visual flow is clean and effortless: Character $\to$ Prompt $\to$ Options $\to$ Bottom Drawer.
- **Thumb-Friendly Tactile Ergonomics**: Option cards have a generous 60px minimum height with `rounded-2xl` geometry and 12px vertical spacing to prevent mis-clicks.
- **Obsidian & Neon Contrast Hierarchy**: Background is deep space obsidian (`#070913`). Questions and characters pop with vibrant neon strokes (Celestial Cyan `#06b6d4`, Galactic Emerald `#10b981`, Solar Amber `#f59e0b`).
- **Typography Clarity**: Chunky, playful, high-readability sans-serif for numbers, prompts, and praise (`font-black`, `tracking-tight`), paired with clean monospace (`font-mono`) exclusively for terminal commands.

---

### 4. The Starship Crew — Duolingo-Style Animated Space Characters

Duolingo’s recurring cast (Lily, Zari, Oscar, Junior, Falstaff) gives the app soul. We introduce **The Starship Crew**, rendered as crisp, lightweight vector SVGs with micro-animations and synthetic voice blips:

```
┌────────────────────────────────────────────────────────────────────────┐
│ THE STARSHIP CREW (Duolingo-Style Animated Character Ensemble)        │
│                                                                        │
│  [🤖 Rithu]     [🔬 Dr. Orion]   [⚡ Astra]      [🚀 Nova]      [🛡️ Vance]│
│  Mission Guide   Quantum Sci.    Cyber-Eng.     Star Cadet     EVA Veteran│
│  (Warm/Wise)    (Dramatic)      (Cool/Deadpan) (Hyper-Active) (Stoic)     │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Commander Rithu (The AI Mission Commander & Guide)**:
   - *Archetype*: Duo the Owl / Wise Guide.
   - *Visual*: Pristine white & galactic emerald EVA suit, smart visor with expressive LED animated eyes, antenna with a glowing star.
   - *Voice FX*: Warm synthesizer chime chirp (880 Hz $\to$ 1320 Hz dual harmonic blip).
   - *Topic Affinity*: Milestone Quests, System Onboarding, Core Fundamentals.

2. **Dr. Orion (The Eccentric Quantum Scientist)**:
   - *Archetype*: Oscar the Drama Teacher / The Mad Professor.
   - *Visual*: Flowing anti-grav lab coat over pressure suit, floating holographic math & terminal symbols, wild silver hair, glowing circular goggles.
   - *Voice FX*: Eccentric staccato frequency chirp (587 Hz $\to$ 880 Hz $\to$ 1174 Hz).
   - *Topic Affinity*: Backend Architecture, Distributed Systems, Database Optimization.

3. **Astra (The Cyber-Engineer & Terminal Specialist)**:
   - *Archetype*: Lily the Goth Teen / The Cool Hacker.
   - *Visual*: Midnight-purple flight suit with neon-cyan conduits, oversized holographic noise-cancelling headphones, cyber-stylus.
   - *Voice FX*: Smooth, low-register synth-bass blip (220 Hz $\to$ 330 Hz).
   - *Topic Affinity*: Linux Internals, Shell Scripting, Bash Pipelines, Vim/Git.

4. **Cadet Nova (The Hyper-Energetic Starship Pilot)**:
   - *Archetype*: Zari the Enthusiast / Eager Trainee.
   - *Visual*: Bright solar-orange cadet flight suit, rocket boots with mini thruster sparks, starry pilot patches.
   - *Voice FX*: High-energy ascending whistle chirp (1046 Hz $\to$ 1568 Hz).
   - *Topic Affinity*: Daily Challenges, Speed Practice, Web Development, CI/CD pipelines.

5. **Captain Vance (The Grizzled Deep-Space Veteran)**:
   - *Archetype*: Falstaff the Bear / The Stoic Protector.
   - *Visual*: Heavy armored deep-space EVA dreadnought suit, bionic cyber-arm, scarred helmet visor with constellation markings.
   - *Voice FX*: Resonant sub-bass confirmation hum (110 Hz $\to$ 165 Hz).
   - *Topic Affinity*: Kubernetes Clusters, Docker Container Hardening, Network Security.

6. **Cosmo (The Adorable Recon Space-Bot)**:
   - *Archetype*: Junior the Kid / The Playful Pet.
   - *Visual*: Cute spherical levitating droid with single large emotive sapphire lens, satellite ear-flaps, and tiny magnetic claw hands.
   - *Voice FX*: Playful 8-bit chirps and trills (double square-wave arpeggio).
   - *Topic Affinity*: Beginner Quick Practice, Vocabulary, True/False quick-fires.

---

### 5. Formal Finite State Machine (FSM)

The quiz engine operates as a deterministic finite state machine with strict state transitions, eliminating race conditions or inconsistent UI states:

| Current State | Trigger / Event | Guard / Condition | Next State | Action / Side Effects |
| :--- | :--- | :--- | :--- | :--- |
| `INITIALIZING` | `MOUNT` | Questions loaded | `QUESTION_READY` | Initialize Queue, start timer, play character voice chirp |
| `QUESTION_READY` | `SELECT_OPTION` | Input is valid | `ANSWER_STAGED` | Play tap pop sound, update staged answer |
| `ANSWER_STAGED` | `DESELECT` | Answer cleared | `QUESTION_READY` | Disable CHECK button, clear staged answer |
| `ANSWER_STAGED` | `PRESS_CHECK` / `Enter` | Valid staged answer | `EVALUATING` | Lock inputs, show checking spinner |
| `EVALUATING` | `GRADE_RESULT` | `isCorrect == true` | `FEEDBACK_CORRECT` | Play correct chime, pop from Queue, +XP, mascot `happy_jump` |
| `EVALUATING` | `GRADE_RESULT` | `isCorrect == false && hearts > 1` | `FEEDBACK_INCORRECT` | Play wrong buzz, deduct heart (-1), re-queue to end, mascot `sad_droop` |
| `EVALUATING` | `GRADE_RESULT` | `isCorrect == false && hearts == 1` | `OUT_OF_HEARTS` | Play heart break tone, open Refill/Practice modal |
| `FEEDBACK_CORRECT` | `PRESS_CONTINUE` / `Enter` | `queue.length > 0` | `QUESTION_READY` | Slide drawer down, load next question in queue |
| `FEEDBACK_CORRECT` | `PRESS_CONTINUE` / `Enter` | `queue.length == 0` | `VICTORY_CELEBRATION` | Trigger confetti, fanfare audio, odometer count-up |
| `FEEDBACK_INCORRECT`| `PRESS_GOT_IT` / `Enter` | `queue.length > 0` | `QUESTION_READY` | Slide drawer down, load next question in queue |
| `ANY` | `PRESS_QUIT` / `Escape` | Non-evaluating | `CONFIRM_EXIT` | Pause timer, open Exit confirmation modal |
| `CONFIRM_EXIT` | `CANCEL_QUIT` | None | (Previous State) | Resume timer, dismiss modal |
| `CONFIRM_EXIT` | `CONFIRM_QUIT` | None | `EXITED` | Clean up audio, redirect to parent route |

---

### 6. Signature Duolingo Mechanics (5 Types)

#### 1. Tap-to-Assemble Word Bank (Sentence / Command Scramble)
- Given command: `docker run -d -p 8080:80 --name web nginx`
- Scrambled tokens in bank: `["--name", "web", "-p", "run", "docker", "8080:80", "-d", "nginx"]` + 2 distractors (`"-it"`, `"exec"`).
- Upper target area with dotted slot lines.
- Lower bank with randomized 3D token chips and dashed silhouette placeholders.
- Tapping a chip moves it with spring animation into the target slot; tapping an answer chip returns it to the bank.
- Supports keyboard input (typing first letter or space to pick tokens; `Backspace` removes last placed token).

#### 2. Multiple Choice (MCQ)
- Vertically stacked or 2x2 3D tactile cards.
- Hotkey badges `[1]`, `[2]`, `[3]`, `[4]` in top-left corner.
- Pressing 1-4 selects the corresponding option; space or Enter confirms.
- Selected state glows with cyan neon halo and depresses by 2px (`translate-y-[2px]`).

#### 3. Match Pairs (Tile Matching Grid)
- 2 columns of 4-5 tiles (e.g., Linux signals vs definitions, or Docker CLI commands vs descriptions):
  - Left: `SIGTERM`, `SIGKILL`, `SIGHUP`, `SIGINT`
  - Right: `Graceful stop`, `Force kill`, `Reload config`, `Interrupt (Ctrl+C)` (shuffled).
- Tap 1st tile (cyan highlight) $\to$ Tap 2nd tile:
  - Match: Both flash emerald, play chord chime, and lock into completed/disabled state.
  - Mismatch: Both shake red with error buzz and deselect.
- Step counter updates (`2/4 pairs matched`).

#### 4. Fill in the Blank / Code Cloze
- Command line or YAML block with inline interactive blank slots:
  - `kubectl get pods -n _______` $\to$ choices: `[production, --all, -v, restart]`
  - Interactive token pills drop smoothly into the blank with sound.

#### 5. True / False 3D Cards
- Two giant oversized tactile cards with Check/Cross icons and hotkeys `[1]` / `[2]`.

---

### 7. The Sliding Bottom Action Sheet Drawer
- Fixed to the bottom of the screen (`fixed bottom-0 left-0 right-0 z-40`):
  - **Neutral State**:
    - "Skip" button (left, ghost style).
    - 3D "CHECK" button (right). Disabled (flat gray) when no answer is chosen; illuminates in vibrant green/cyan 3D when an answer is ready.
  - **Correct State (Drawer Slides Up with Spring)**:
    - Background: Glowing Galactic Emerald (`bg-[#064e3b]/95 backdrop-blur-xl border-t border-[#10b981]/40`).
    - Left side: Giant animated green check circle (`CheckCircle2`), bold praise ("Nicely done!", "Spot on!", "Brilliant!"), and "+10 XP" glowing pill.
    - Right side: Big 3D "CONTINUE" button (bright emerald, auto-focused, bound to `Enter`).
    - Audio: Ascending chime sound (`playCorrectSound()`).
  - **Incorrect State (Drawer Slides Up with Spring)**:
    - Background: Deep Supernova Crimson (`bg-[#4c0519]/95 backdrop-blur-xl border-t border-[#f43f5e]/40`).
    - Left side: Giant red X circle (`XCircle`), bold "Correct solution:", code snippet showing the right answer, and helpful explanation.
    - Right side: Big 3D "GOT IT" button (vibrant rose, auto-focused, bound to `Enter`).
    - Audio: Descending buzzer sound (`playWrongSound()`).
    - Hearts: Deducts 1 heart with crack animation.

---

### 8. Gamification, Mastery & Edge-Case Features

#### Feature 7A: Spaced Mistake Recycling (Mastery Loop)
- In Duolingo, you cannot "just finish" a quiz with a failing score.
- **Queue Algorithm (`src/lib/quiz/queue.ts`)**:
  - The session maintains a dynamic queue of question IDs.
  - When answered **correctly**: Question is cleared from the queue.
  - When answered **incorrectly**: Question is **re-inserted at the end of the queue**!
  - Session continues until **every single question is answered correctly**.
  - **Scoring Formula**:
    $$\text{XP}_{\text{awarded}} = \begin{cases} 10 & \text{attempt } = 1 \\ 5 & \text{attempt } = 2 \\ 3 & \text{attempt } \ge 3 \end{cases}$$
    Plus Streak Combo bonus ($+2\text{ XP}$ per consecutive correct answer beyond 3) and Flawless Session bonus ($+15\text{ XP}$ if 0 mistakes).

#### Feature 7B: Cosmic Hearts & 3-Way Out-of-Lives Recovery Flow
- 5 Hearts displayed at top-right. Each error cracks 1 heart and floats `-1`.
- When Hearts == 0, `DuolingoOutOfHeartsModal` opens with 3 distinct recovery options:
  1. **Practice for Hearts**: Launches a casual 3-question refill practice where each correct question restores 1 heart.
  2. **Refill with Stardust / XP**: Instant 5-heart refill for 50 XP.
  3. **Auto-Regen Timer**: Displays live countdown (1 heart every 30 minutes).

#### Feature 7C: Daily Streak Lock-In & Streak Freeze
- When completing the first quiz of the day, an animated streak celebration triggers:
  - 7-day mini calendar strip marks today as completed with a blazing flame.
  - Streak number increments (+1).
  - Shows active "Streak Freeze" shield status.

#### Feature 7D: Interactive "Review Mistakes" Drawer
- On the victory results screen, if any mistakes were made, a "Review Mistakes" button appears.
- Opens an interactive slide-over showing:
  - Question prompt & active character.
  - User's incorrect submission in red strikethrough.
  - Correct solution in glowing emerald.
  - Deep-dive architectural explanation authored by Dr. Orion or Astra.

#### Feature 7E: Mid-Quiz Combo Milestones & Session Persistence
- **Combo Toast**: At 3, 5, and 10 correct answers in a row, a blazing combo banner drops down ("5 IN A ROW! 🔥 You're on fire!").
- **Session Auto-Recovery**: Session queue, score, and hearts state are continuously mirrored in `sessionStorage` (`rdq_quiz_session`). If the user accidentally refreshes their tab, the session seamlessly resumes without lost progress.

---

### 9. Audio Synthesis Specifications (Web Audio API)

No external audio files needed; generated with precision oscillators in `src/lib/sounds.ts`:

| Sound Effect | Waveform | Frequency & Envelopes | Duration | Musical Interval |
| :--- | :--- | :--- | :--- | :--- |
| **Tap Pop** | Sine | 850 Hz $\to$ 400 Hz (exponential decay) | 35 ms | Micro percussion |
| **Correct Chime** | Sine | Triad arpeggio: C5 (523 Hz) $\to$ E5 (659 Hz) $\to$ G5 (784 Hz) $\to$ C6 (1046 Hz) | 300 ms | Major Chord Ascent |
| **Wrong Buzz** | Triangle + LPF | Dissonant descent: Eb4 (311 Hz) $\to$ C4 (261 Hz) | 280 ms | Minor/Diminished drop |
| **Heart Crack** | White Noise + Sine | Crack transient (1200 Hz) + Sub-bass thud (80 Hz) | 180 ms | Impact drop |
| **Combo Flame** | Sine + Triangle | Frequency glide: 300 Hz $\to$ 1100 Hz with vibrato | 350 ms | Energetic whoosh |
| **Victory Fanfare** | Sine + Harmonics | C5 (523 Hz) $\to$ G5 (784 Hz) $\to$ C6 (1046 Hz) $\to$ E6 (1318 Hz sustained) | 600 ms | Triumphant fanfare |
| **Character Voice Chirp** | Dual Sine / FM | Modular frequency blips per character (110 Hz $\to$ 1568 Hz) | 120 ms | Voice blip |

---

### 10. AI Agent Skills, Tools & Execution Strategy

To execute this architecture with extreme precision and strict adherence to `AGENTS.md`, the AI agent leverages specialized built-in tools and skills:

| Tool / Skill | Type | Purpose & Tactical Usage in Phase 4 |
| :--- | :--- | :--- |
| `write_to_file` | Core Tool | Atomic authoring of brand-new, fully typed components (`duo-button.tsx`, `DuolingoHeader.tsx`, `DuolingoBottomDrawer.tsx`, `CosmicCharacter.tsx`, `DuolingoResults.tsx`, question components, queue logic). |
| `replace_file_content` | Core Tool | Surgical, non-destructive updates to existing files (`QuizExperience.tsx`, `globals.css`, `quick-practice-page.tsx`, `daily-challenge-page.tsx`), strictly preserving existing functionality. |
| `run_command` | Core Tool | Automated continuous verification gates after each step: `npx tsc --noEmit` (TypeScript strict mode), `npm run lint` (ESLint zero-tolerance), `npm run test:run` (Vitest unit tests), `npm run build` (Next.js production build verification). |
| `view_file` & `grep_search` | Core Tool | Deep structural inspection of database schemas (`prisma/schema.prisma`), question payloads (`src/lib/quiz/types.ts`), and seed questions to guarantee 100% data contract compatibility without duplication. |
| `generative_ui` | Special Skill | Rendering live interactive HTML sandbox widgets in artifacts during development to test button depression physics, bottom sheet spring curves, character facial rigs, and mobile breakpoint layouts before committing code. |
| `antigravity-guide` & `agy-customizations` | Special Skill | Ensuring absolute compliance with workspace rules (`AGENTS.md`), memory hooks, and project architectural guardrails. |

---

### 11. Faster Lightweight Libraries, Zero-Bloat Dependencies & Code Optimization

To ensure blazing-fast performance on mobile devices with zero lag and zero runtime stutter:

#### 1. Zero External Runtime Audio Dependencies
- **No Howler.js or Tone.js**: We use the native browser **Web Audio API** (`AudioContext`, `OscillatorNode`, `GainNode`, `BiquadFilterNode`).
- **Bundle Impact**: **0 KB** additional bundle weight (saves 150KB+ vs Tone.js).
- **Latency**: Sub-5ms instantaneous audio playback with zero network roundtrips.

#### 2. Tree-Shaken React 19 Motion (`motion/react`)
- Import strictly from `motion/react` (the official React 19 tree-shakeable modern package).
- Only import essential primitives (`motion`, `AnimatePresence`).
- Avoid bloated animation runtimes or legacy Framer Motion packages.

#### 3. Pure React Vector SVG Characters (Zero Raster Images)
- The Starship Crew characters are authored as clean, modular inline SVG React components.
- **Bundle Impact**: Highly compressible vector paths ($< 3\text{ KB}$ per character gzipped vs 200KB+ Lottie runtimes or multi-MB sprite sheets).
- **Quality**: Infinitely scalable from mobile (40px) to desktop (160px) with zero pixelation on retina displays.
- **Performance**: Zero image downloads; zero layout shift (CLS 0); zero Flash of Unstyled Image (FOUI).

#### 4. Hardware-Accelerated CSS Physics
- Bottom drawer slide-up, token placement, and option depression strictly use hardware-accelerated transforms:
  ```css
  transform: translate3d(0, var(--y, 0), 0);
  will-change: transform;
  backface-visibility: hidden;
  ```
- Guarantees locked 60fps animations even on budget smartphones.

#### 5. CSS-Only 3D Tactile Physics
- Tactile button press uses pure CSS `:active` and border transitions (`border-b-4` $\to$ `border-b-0` + `translate-y-1`), saving main thread JS cycles for touch events.

#### 6. Mobile Edge-Case Engineering
- **Audio Context Unlock**: Mobile iOS/Android browsers suspend audio contexts until first user interaction. A global `pointerdown` listener calls `audioCtx.resume()` to guarantee crystal-clear audio on the very first question tap.
- **Touch-Action Manipulation**: Eliminates the 300ms mobile tap delay across all cards and buttons.
- **Virtual Keyboard Shield**: On questions with text entry, `window.visualViewport` listeners prevent the virtual soft keyboard from squishing the header or mascot.
- **Double-Tap Race Condition Protection**: `submittingRef` and `completingRef` prevent duplicate answer submissions or skipped questions from rapid double-taps.
- **Synchronous Micro-Grading**: Grading executes in $< 1\text{ms}$ synchronously in memory, triggering the bottom drawer instantly without perceptible network delay.

---

### 12. Component Props & TypeScript Interface Directory

```typescript
// src/components/quiz/types.ts

export type CharacterId =
  | "rithu"
  | "orion"
  | "astra"
  | "nova"
  | "vance"
  | "cosmo";

export type CharacterMood =
  | "idle"
  | "thinking"
  | "speaking"
  | "happy_jump"
  | "sad_droop"
  | "celebrating";

export interface CosmicCharacterProps {
  characterId: CharacterId;
  mood: CharacterMood;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export type DuolingoQuestionType =
  | "mcq"
  | "word_bank"
  | "match_pairs"
  | "fill_blank"
  | "true_false";

export interface DuolingoMCQPayload {
  options: Array<{ id: string; text: string; code?: boolean }>;
  correctOptionId: string;
  explanation: string;
}

export interface DuolingoWordBankPayload {
  targetSentence: string;
  tokens: Array<{ id: string; text: string }>;
  distractors?: Array<{ id: string; text: string }>;
  explanation: string;
}

export interface DuolingoMatchPairsPayload {
  pairs: Array<{ id: string; left: string; right: string }>;
  explanation?: string;
}

export interface DuolingoFillBlankPayload {
  promptWithBlank: string; // "docker run -d -p ___:80 nginx"
  blankIndex: number;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface DuolingoTrueFalsePayload {
  statement: string;
  correctAnswer: boolean;
  explanation: string;
}

export interface DuolingoQuestion {
  id: string;
  type: DuolingoQuestionType;
  prompt: string;
  characterId?: CharacterId;
  hint?: string;
  payload:
    | DuolingoMCQPayload
    | DuolingoWordBankPayload
    | DuolingoMatchPairsPayload
    | DuolingoFillBlankPayload
    | DuolingoTrueFalsePayload;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface DuolingoQueueItem {
  question: DuolingoQuestion;
  attemptCount: number;
  firstTryCorrect: boolean | null;
  userAnswer?: string;
}
```

---

### 13. Step-by-Step Implementation Roadmap

Execution is structured into 11 strictly ordered, atomic steps to keep lint, build, and tests green throughout:

```
Step 1: 3D Tactile Design Tokens & Primitives
   ↓
Step 2: Web Audio Synthesizer Engine & Character Voice Blips
   ↓
Step 3: Vector SVG Animated Starship Crew (6 Characters)
   ↓
Step 4: Top Header HUD & Progress/Hearts Display
   ↓
Step 5: The 5 Signature Duolingo Question Components
   ↓
Step 6: Sliding Bottom Action Sheet Drawer
   ↓
Step 7: Spaced Mistake Recycling Queue Engine (`queue.ts`)
   ↓
Step 8: Interactive Modals (Exit, Out-of-Hearts, Review Mistakes)
   ↓
Step 9: Victory Celebration Screen (Confetti, Odometer XP, Streak Flame)
   ↓
Step 10: Master Orchestrator Overhaul (`QuizExperience.tsx`) & Page Wiring
   ↓
Step 11: Unit & Integration Testing, Verification, Smoke Tests
```

#### Step 1: 3D Tactile Design Tokens & Primitives
- Create `src/components/quiz/duo-button.tsx` with beveled 3D borders (`border-b-4`, `active:translate-y-1`, `active:border-b-0`, variants: `primary`, `secondary`, `danger`, `neutral`, `ghost`).
- Add utility classes in `src/app/globals.css` (`.duo-card-3d`, `.heart-crack`, `.stardust-twinkle`).

#### Step 2: Web Audio Synthesizer Engine & Character Voice Blips
- Extend `src/lib/sounds.ts` with programmatic synthesizers for:
  - `playTapPopSound()`
  - `playHeartLossSound()`
  - `playComboFlameSound()`
  - `playCharacterVoice(characterId: CharacterId)`

#### Step 3: Vector SVG Animated Starship Crew (6 Characters)
- Create `src/components/quiz/characters/CosmicCharacter.tsx` with vector SVG rigs for:
  - Commander Rithu
  - Dr. Orion
  - Astra
  - Cadet Nova
  - Captain Vance
  - Cosmo
- Create `src/components/quiz/characters/CharacterSpeechBubble.tsx` with clean responsive pointer math.

#### Step 4: Top Header HUD & Progress/Hearts Display
- Create `src/components/quiz/DuolingoHeader.tsx` with Quit button `✕`, glowing capsule progress bar, 5 cosmic hearts, streak flame, and audio toggle.

#### Step 5: The 5 Signature Duolingo Question Components
- Create `src/components/quiz/questions/DuolingoMCQ.tsx` (3D cards with hotkeys [1]-[4]).
- Create `src/components/quiz/questions/DuolingoWordBank.tsx` (tap-to-place token scramble with spring placement).
- Create `src/components/quiz/questions/DuolingoMatchPairs.tsx` (2-column tap-to-match with chime/shake).
- Create `src/components/quiz/questions/DuolingoTrueFalse.tsx` (oversized 3D True/False).
- Create `src/components/quiz/questions/DuolingoFillBlank.tsx` (interactive inline cloze).

#### Step 6: Sliding Bottom Action Sheet Drawer
- Create `src/components/quiz/DuolingoBottomDrawer.tsx` supporting:
  - Neutral state (Disabled gray $\to$ Vibrant green/cyan on staged answer).
  - Correct state (Galactic Emerald with checkmark, "+10 XP", and "CONTINUE").
  - Incorrect state (Supernova Crimson with solution code, explanation, and "GOT IT").
  - Bound to `Enter` key for Check and Continue.

#### Step 7: Spaced Mistake Recycling Queue Engine
- Create `src/lib/quiz/queue.ts` implementing Duolingo's mistake re-queueing algorithm.
- Implement tier-based XP scoring (100% first-try, 50% retry, 25% third+).

#### Step 8: Interactive Modals
- Create `src/components/quiz/modals/DuolingoExitModal.tsx` ("Quit session? All progress lost").
- Create `src/components/quiz/modals/DuolingoOutOfHeartsModal.tsx` with 3-way recovery (Practice for hearts, Refill with XP, Auto-regen timer).
- Create `src/components/quiz/modals/DuolingoMistakesModal.tsx` (Interactive review of missed questions with mentor tips).

#### Step 9: Victory Celebration Screen
- Create `src/components/quiz/DuolingoResults.tsx` with:
  - Confetti explosion shower (`canvas-confetti`).
  - Mascot victory cheer animation.
  - Animated odometer XP counter (0 $\to$ Total XP).
  - Circular accuracy meter.
  - Daily streak flame ignition animation.
  - "Review Mistakes" button.

#### Step 10: Master Orchestrator Overhaul (`QuizExperience.tsx`) & Page Wiring
- Overhaul `src/components/quiz/QuizExperience.tsx` into the fullscreen Duolingo engine.
- Wire FSM transitions, keyboard controls, character rotation, mistake queue, and session persistence in `sessionStorage`.
- Wire `/practice/quick` and `/practice/daily-challenge` into the new engine.

#### Step 11: Unit & Integration Testing, Verification, Smoke Tests
- Write unit tests in `tests/unit/quiz-queue.test.ts` and `tests/unit/quiz-scoring.test.ts`.
- Run typecheck (`tsc --noEmit`), lint (`npm run lint`), and tests (`npm run test:run`).
- Perform runtime verification on production build (`npm run build` + `npm start`).

---

### 14. Verification Checklist

- [x] Fullscreen distraction-free layout with clean galaxy nebula canvas (zero clutter)
- [x] 3D tactile beveled buttons depress on click (`active:translate-y-1`)
- [x] Mobile responsive: dynamic viewport height `100dvh` with safe-area insets (`env(safe-area-inset-*)`)
- [x] Mobile bottom drawer docked in natural thumb reach zone with 100% width button
- [x] Mobile haptic feedback API (`navigator.vibrate`) triggers physical micro-vibrations
- [x] Zero 300ms mobile tap delay: `touch-action: manipulation` enforced
- [x] Mobile Word Bank uses dashed silhouette placeholders to prevent jarring layout jumps (CLS = 0)
- [x] The Starship Crew (all 6 characters) render crisp vector SVGs with idle/speaking/cheer animations
- [x] Character synthetic voice blips play softly when speech bubbles appear
- [x] Speech bubble layout is clean and responsive on mobile and desktop
- [x] Tap-to-place Word Bank correctly moves tokens between bank and answer slot
- [x] Match Pairs validates correctly with green glow and error shake
- [x] MCQ supports keyboard shortcuts [1], [2], [3], [4] and Enter
- [x] Bottom Drawer slides up in Emerald for correct, Supernova Crimson for incorrect
- [x] Missed questions are re-queued at the end of the session until mastered
- [x] Hearts crack and decrement by 1 on incorrect answers; 0 hearts triggers 3-way recovery modal
- [x] Results screen triggers confetti, animated XP count-up, streak flame, and "Review Mistakes"
- [x] Interrupted sessions can be resumed from `sessionStorage`
- [x] Clean lint (`npm run lint`), zero TypeScript errors (`tsc --noEmit`), all unit tests pass (`npm run test:run`)



---

## Phase 5 — Groq AI Integration

### Milestone
AI generates validated questions and explanations.

### Steps

1. **Install Groq SDK**
   ```bash
   npm install groq-sdk
   ```

2. **Create `src/lib/ai/groq.ts`** — Groq client singleton
   ```typescript
   import Groq from 'groq-sdk'

   const globalForGroq = globalThis as unknown as {
     groq: Groq | undefined
   }

   export const groq = globalForGroq.groq ?? new Groq({
     apiKey: process.env.GROQ_API_KEY,
   })

   if (process.env.NODE_ENV !== 'production') {
     globalForGroq.groq = groq
   }
   ```

3. **Create Zod schemas** — `src/lib/ai/schemas/`
   - `question.ts` — validates generated question structure
   - `explanation.ts` — validates explanation content
   - `hint.ts` — validates hint content

4. **Create prompt templates** — `src/lib/ai/prompts/`
   - `question.ts` — prompt for generating questions
   - `explanation.ts` — prompt for generating explanations
   - `hint.ts` — prompt for generating hints

5. **Create `src/lib/ai/generator.ts`** — content generation pipeline
   ```
   Lesson Context
        ↓
   Build Prompt (with lesson topic, difficulty, type)
        ↓
   Call Groq (structured output with Zod → JSON Schema)
        ↓
   Validate Response with Zod
        ↓
   Retry if invalid (max 3 attempts)
        ↓
   Store Valid Output in Database
        ↓
   Return to Student
   ```

6. **Create API routes**
   - `app/api/ai/generate-question/route.ts` — generate questions for a lesson
   - `app/api/ai/explain/route.ts` — explain a concept or wrong answer
   - `app/api/ai/mentor/route.ts` — Rithu contextual responses

7. **Implement rate limiting**
   - Simple in-memory token bucket per user
   - Max 10 AI requests per minute per user
   - Return 429 with retry-after header when exceeded

8. **Implement caching**
   - Store generated questions in database
   - Reuse valid questions instead of regenerating
   - Generate once → validate → store → reuse

### Verification Checklist
- [ ] Groq generates valid MCQ questions for Docker lessons
- [ ] Zod validation catches malformed output
- [ ] Invalid outputs are retried automatically (max 3)
- [ ] Generated questions are stored in database
- [ ] API key never exposed to frontend
- [ ] Rate limiting returns 429 when exceeded
- [ ] Same question is reused on subsequent requests
- [ ] `npm run test:run` — all tests pass

---

## Phase 6 — Gamification System

### Milestone
XP, levels, streaks, and achievements work end-to-end.

### Steps

1. **Extend Prisma schema**
   ```prisma
   model Achievement {
     id          String   @id @default(cuid())
     title       String
     description String
     icon        String
     condition   String   // "first_lesson", "7_day_streak", "docker_rookie", etc.
     threshold   Int?     // numeric threshold if needed
     xpReward    Int      @default(0)
     createdAt   DateTime @default(now())
   }

   model UserAchievement {
     id            String   @id @default(cuid())
     userId        String
     user          User     @relation(fields: [userId], references: [id])
     achievementId String
     achievement   Achievement @relation(fields: [achievementId], references: [id])
     unlockedAt    DateTime @default(now())

     @@unique([userId, achievementId])
   }

   model UserSkill {
     id        String   @id @default(cuid())
     userId    String
     user      User     @relation(fields: [userId], references: [id])
     skillId   String
     skill     Skill    @relation(fields: [skillId], references: [id])
     mastery   Float    @default(0) // 0-100
     updatedAt DateTime @updatedAt

     @@unique([userId, skillId])
   }

   model Streak {
     id           String   @id @default(cuid())
     userId       String   @unique
     user         User     @relation(fields: [userId], references: [id])
     currentStreak Int     @default(0)
     longestStreak Int     @default(0)
     lastActiveDate DateTime?
     createdAt    DateTime @default(now())
     updatedAt    DateTime @updatedAt
   }
   ```

2. **Create gamification library** — `src/lib/gamification/`
   - `xp.ts` — XP calculation rules
     ```
     Lesson completion:    +20 XP
     Practice correct:     +15 XP
     First attempt bonus:  +10 XP
     Challenge:            +50 XP
     Achievement unlock:   varies
     ```
   - `levels.ts` — level thresholds
     ```
     Level 1:  0 XP
     Level 2:  100 XP
     Level 3:  300 XP
     Level 4:  600 XP
     Level 5:  1000 XP
     ... (exponential growth)
     ```
   - `streaks.ts` — streak tracking
     ```
     Check if user was active today
     If yes: no change
     If yesterday: increment streak
     If gap > 1 day: reset streak to 1
     ```
   - `achievements.ts` — achievement definitions + detection
     ```
     🌱 First Lesson — complete your first lesson
     🔥 7 Day Streak — maintain a 7-day streak
     🐳 Docker Rookie — complete all Docker Containers lessons
     ☸️ Kubernetes Explorer — complete all Kubernetes lessons
     ☁️ Cloud Starter — start the Cloud learning path
     🎤 First Interview — complete your first mock interview
     ```

3. **Create gamification Server Actions**
   - `awardXP()` — add XP, check level up
   - `updateStreak()` — update streak on lesson completion
   - `checkAchievements()` — evaluate all achievement conditions
   - `getGamificationData()` — fetch all gamification state for user

4. **Create gamification UI components**
   - `XPDisplay` — show current XP with animation
   - `XPAnimation` — confetti/counter animation on XP gain
   - `StreakCounter` — show current streak with fire icon
   - `LevelBadge` — show current level
   - `AchievementCard` — show achievement with unlock animation
   - `ProgressBar` — animated progress toward level up

5. **Integrate with lesson flow**
   - On lesson completion: award XP → update streak → check achievements
   - Show XP animation on lesson complete screen
   - Show level-up notification if applicable
   - Show new achievement notification if applicable

### Verification Checklist
- [ ] XP awarded correctly for lesson completion
- [ ] Level-up triggers at correct XP thresholds
- [ ] Streak increments on consecutive days
- [ ] Streak resets after gap > 1 day
- [ ] Achievements unlock at correct conditions
- [ ] Dashboard shows all gamification data
- [ ] XP animation plays on lesson completion
- [ ] Level-up notification appears
- [ ] `npm run test:run` — all tests pass

---

## Phase 7 — Mastery Engine & Adaptive Learning

### Milestone
System tracks skill mastery and recommends practice.

### Steps

1. **Create mastery library** — `src/lib/mastery/`
   - `score.ts` — mastery calculation algorithm
     ```
     Mastery = weighted average of:
       - Correctness (40%)
       - Recency (20%) — more recent = higher weight
       - Difficulty (20%) — harder questions worth more
       - Consistency (20%) — fewer attempts = higher score

     Mastery Levels:
       0–40%    Weak       🔴
       40–60%   Developing 🟡
       60–80%   Good       🟢
       80–100%  Mastered   ⭐
     ```
   - `recommendation.ts` — practice recommendation engine
     ```
     1. Get all UserSkills for user
     2. Sort by mastery (lowest first)
     3. Filter: mastery < 80%
     4. Return top 3 weak skills with suggested practice
     ```

2. **Implement mastery tracking**
   - Update UserSkill.mastery after each question attempt
   - Recalculate based on all attempts for that skill

3. **Create practice mode**
   - `app/(main)/practice/page.tsx` — practice dashboard
   - Show weak skills with "Practice" button
   - Generate targeted questions for selected skill
   - Adaptive difficulty based on performance

4. **Create dashboard skills visualization**
   - `SkillBars` component — show mastery per skill with color-coded bars
   - `WeakSkillAlert` — highlight skills below 60%
   - `MasteryHistory` — track improvement over time

5. **Implement adaptive difficulty**
   - If student answers 3+ correct in a row → increase difficulty
   - If student answers 2+ wrong in a row → decrease difficulty
   - Track difficulty level per skill

### Verification Checklist
- [ ] Mastery scores update after each quiz attempt
- [ ] Mastery calculation matches the algorithm
- [ ] Weak skills are correctly identified
- [ ] Practice mode targets weak areas
- [ ] Difficulty adjusts based on performance
- [ ] Dashboard shows accurate skill levels with bars
- [ ] `npm run test:run` — all tests pass

---

## Phase 8 — Rithu AI Mentor

### Milestone
Rithu provides contextual guidance throughout the learning journey.

### Steps

1. **Create mentor logic** — `src/lib/mentor/responses.ts`
   - `getWrongAnswerExplanation()` — explain why answer was wrong
   - `getWeakSkillRecommendation()` — suggest practice for weak skills
   - `getMilestoneCelebration()` — celebrate achievements
   - `getGreetingMessage()` — personalized greeting with progress summary

2. **Create Rithu UI components**
   - `RithuBubble` — floating mentor avatar with contextual tips
   - `RithuExplanation` — expanded explanation for wrong answers
   - `RithuRecommendation` — practice suggestion card
   - `RithuCelebration` — celebration message with animation

3. **Implement contextual triggers**
   ```
   Wrong answer → Rithu explains the concept
   Weak skill detected → Rithu recommends practice
   Achievement unlocked → Rithu celebrates
   Session start → Rithu greets with progress summary
   Lesson complete → Rithu provides encouragement
   ```

4. **Create API route** — `app/api/ai/mentor/route.ts`
   - Accept context (wrong answer, weak skill, milestone)
   - Generate contextual response via Groq
   - Validate with Zod
   - Return to client

5. **Ensure technical accuracy**
   - Always verify generated commands against known documentation
   - If uncertain, express uncertainty rather than hallucinating
   - Use curated content for foundational explanations

### Verification Checklist
- [ ] Wrong answers show Rithu explanation
- [ ] Weak skills trigger recommendation
- [ ] Achievements trigger celebration
- [ ] Dashboard shows Rithu greeting with context
- [ ] No hallucinated technical content
- [ ] Explanations are accurate and helpful
- [ ] `npm run test:run` — all tests pass

---

## Phase 9 — Polish & UX

### Milestone
App feels polished, fast, and motivating.

### Steps

1. **Loading states**
   - Add `loading.tsx` for all route segments
   - Add skeleton components for data-heavy pages
   - Add spinner for form submissions

2. **Error handling**
   - Add `error.tsx` for all route segments
   - Add `not-found.tsx` for invalid routes
   - Add error boundaries for AI generation failures

3. **Animations** (using `motion` package)
   - Lesson transitions (slide between activities)
   - XP counter animation (count up effect)
   - Progress bar animation (smooth fill)
   - Achievement unlock animation (pop + glow)
   - Skill tree reveal (fade in on scroll)
   - Page transitions

4. **Mobile responsiveness**
   - Test all pages on mobile viewport
   - Responsive sidebar → bottom navigation
   - Touch-friendly question selection
   - Swipe gestures for lesson progression

5. **Dark mode polish**
   - Ensure all components look good in dark mode
   - Test color contrast for accessibility
   - Consistent theming across all pages

6. **Onboarding flow**
   - Welcome screen after signup
   - Choose learning path (DevOps for now)
   - Show skill tree overview
   - Start first lesson

7. **SEO & Metadata**
   - Add `generateMetadata()` for all pages
   - Open Graph tags for sharing
   - Proper title hierarchy

8. **Performance audit**
   - Lighthouse score > 90
   - Core Web Vitals check
   - Bundle size analysis
   - Image optimization

### Verification Checklist
- [ ] All pages have loading states
- [ ] Animations are smooth (60fps)
- [ ] Mobile layout works correctly
- [ ] Dark mode is consistent
- [ ] Onboarding flow completes
- [ ] Lighthouse score > 90
- [ ] No console errors

---

## Phase 10 — Testing & Deployment

### Milestone
Tests pass, app is deployed to production.

### Steps

1. **Write unit tests**
   ```
   src/test/unit/
   ├── xp.test.ts              (XP calculation rules)
   ├── mastery.test.ts          (mastery scoring algorithm)
   ├── levels.test.ts           (level thresholds)
   ├── streaks.test.ts          (streak tracking logic)
   └── question-validation.test.ts (answer validation)
   ```

2. **Write integration tests**
   ```
   src/test/integration/
   ├── lesson-flow.test.ts      (lesson → question → answer → progress → XP)
   └── auth-flow.test.ts        (signup → login → session → dashboard)
   ```

3. **Write component tests**
   ```
   src/test/components/
   ├── lesson-section.test.tsx  (lesson interaction)
   └── quiz-question.test.tsx   (quiz flow)
   ```

4. **Set up GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: project scaffolding"
   git remote add origin https://github.com/username/rithudevquest.git
   git push -u origin main
   ```

5. **Set up Neon PostgreSQL**
   - Create Neon project (free tier)
   - Create production database
   - Get pooled URL → `DATABASE_URL` in Vercel
   - Get direct URL → `DATABASE_URL_UNPOOLED` in Vercel

6. **Configure Vercel deployment**
   - Connect GitHub repository
   - Set environment variables:
     ```
     DATABASE_URL=<neon-pooled-url>
     DATABASE_URL_UNPOOLED=<neon-direct-url>
     DATABASE_ADAPTER=neon
     GROQ_API_KEY=<your-key>
     AUTH_SECRET=<generated-secret>
     ```
   - Deploy

7. **Run production migrations**
   ```bash
   # Via Vercel CLI or post-deploy hook
   npx prisma migrate deploy
   ```

8. **Seed production data**
   ```bash
   npx tsx prisma/seed.ts
   ```

9. **Verify production**
   - Authentication works
   - Lessons load correctly
   - AI generation works
   - Gamification works
   - No console errors

### Verification Checklist
- [ ] All unit tests pass (`npm run test:run`)
- [ ] All integration tests pass
- [ ] All component tests pass
- [ ] Lint passes clean
- [ ] Build succeeds (`npm run build`)
- [ ] App deploys to Vercel
- [ ] Authentication works in production
- [ ] Database connections work (Neon)
- [ ] AI generation works in production
- [ ] Gamification works in production

---

## Future Phases (Post-MVP — NOT to implement now)

```
Phase 11 — AI Interview System
Phase 12 — Boss Battles / Challenges
Phase 13 — Leaderboards
Phase 14 — Practical Labs / Terminal
Phase 15 — Project Missions
Phase 16 — Advanced Analytics
```

---

## Critical Path

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8 → Phase 9 → Phase 10
```

Each phase builds on the previous. No phase should be skipped.

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth | Auth.js v5 + Credentials + JWT | Simple, no OAuth complexity for MVP |
| Animations | `motion` package | React 19 compatible, modern |
| Testing | Vitest + RTL | Fast, native TypeScript, Next.js recommended |
| Local DB | Docker PostgreSQL 16 | Fast, offline-capable, no cold start |
| Production DB | Neon PostgreSQL | Serverless, free tier, native Prisma adapter |
| ORM | Prisma 7 | Latest with `prisma.config.ts`, Neon adapter |
| AI | Groq SDK v1.6 | Structured outputs, Zod integration |
| UI | shadcn/ui New York | Ownable, customizable, Tailwind v4 |
| Styling | Tailwind v4 | CSS-first config, faster builds |
