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

## Phase 4 — Quiz Engine

### Milestone
Lesson questions are validated, scored, and tracked.

### Steps

1. **Implement question types**
   - MCQ: render options as clickable cards
   - True/False: two-option selection
   - Command: text input for shell commands
   - Scenario: multi-part question with context

2. **Create answer validation logic** — `src/lib/quiz/`
   - `validateAnswer()` — type-specific validation
   - `calculateScore()` — weight by difficulty and attempt number
   - `selectQuestions()` — intelligent question selection

3. **Implement scoring rules**
   ```
   First attempt correct:    100% XP
   Second attempt correct:    50% XP
   Third+ attempt correct:    25% XP
   ```

4. **Create question bank with curated questions**
   - 10-15 questions per lesson
   - Mix of question types
   - Difficulty progression: beginner → intermediate → advanced

5. **Implement question selection algorithm**
   - Start with easier questions
   - Increase difficulty as student answers correctly
   - Avoid repeating recently-asked questions
   - Balance question types

6. **Create `src/lib/quiz/validation.ts`**
   - Zod schemas for each question type
   - Server-side answer validation
   - Prevent client-side answer manipulation

### Verification Checklist
- [ ] All question types render correctly
- [ ] Answer validation works for each type
- [ ] First-attempt correct answers give full XP
- [ ] Retry attempts give reduced XP
- [ ] Attempts are recorded in database
- [ ] Question selection varies across runs
- [ ] Client cannot manipulate answers (server validates)
- [ ] `npm run test:run` — all tests pass

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
