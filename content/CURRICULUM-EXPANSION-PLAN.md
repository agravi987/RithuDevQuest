# RithuDevQuest — Curriculum Expansion Plan

**Status:** Planning only — no code changes made.
**Goal:** Extend the platform from a single DevOps track to 5 career tracks: DevOps, Cloud Computing, AI Agents, Web Dev, and System Design.

---

## 1. Key Insight

The database schema **already supports all 5 tracks**. `prisma/schema.prisma` defines a clean hierarchy:

```
Career ──> LearningPath ──> Module ──> Unit ──> Lesson ──> Skill / Activity / Question
```

Only **one** `Career` (DevOps) and a handful of `LearningPath`s have been authored so far. Everything else is **content authoring** — the data model, UI, mastery engine, gamification, and AI tooling are all track-agnostic. Adding a new track means:

1. Create a `content/curriculum/<career>/` folder with `SeedPath` files
2. Register the career in `content/curriculum/index.ts`
3. Run the existing seed script
4. (UI is already generic — path/module/unit/lesson rendering works for any track)

This is why the `Career` → `LearningPath` split matters: a **career** is the broad topic ("Cloud Computing"), and each **path** is a subtopic ("AWS", "GCP", "Networking"). The URL structure `/learn/[pathId]/[moduleId]/[lessonId]` already accommodates any cell in this tree.

---

## 2. Folder Layout (target)

```
content/curriculum/
├── index.ts                      # registers all 5 careers for the seeder
├── devops/                       # EXISTS — linux, git, docker, kubernetes
├── cloud/
│   ├── aws.ts          (path: AWS)
│   ├── gcp.ts          (path: GCP)
│   ├── networking.ts   (path: Networking)
│   └── index.ts        (career: "Cloud Computing")
├── ai-agents/
│   ├── fundamentals.ts        (path: AI Agent Fundamentals)
│   ├── prompt-engineering.ts  (path: Prompt Engineering)
│   ├── rag.ts                 (path: RAG & Memory)
│   ├── agent-frameworks.ts    (path: Agent Frameworks & Tools)
│   └── index.ts        (career: "AI Agents")
├── web-dev/
│   ├── frontend.ts         (path: HTML/CSS/JS)
│   ├── backend.ts          (path: Node.js / Express)
│   ├── react.ts            (path: React)
│   ├── nextjs.ts           (path: Next.js)
│   └── index.ts     (career: "Web Development")
└── system-design/
    ├── foundations.ts      (path: Foundations)
    ├── hld.ts              (path: High-Level Design)
    ├── lld.ts              (path: Low-Level Design)
    ├── scalability.ts      (path: Scalability & Reliability)
    └── index.ts     (career: "System Design")
```

Each `*Path.ts` file uses the existing `SeedPath` type (`src/lib/curriculum/seed.ts:77`) and exports a path of modules → units → lessons, identical to `devops/linux.ts`.

---

## 3. Career → Path → Module Mapping

A suggested first-pass structure. Each **path** = one large domain; **modules** = its core sub-topics; each module starts with 2–4 units, and each unit with 2–4 lessons. Lessons follow the established pattern: activities (learn/example) + 5–7 questions (mcq / true_false / command / scenario).

### 3.1 Cloud Computing (`Career` slug `cloud`)
Paths: **AWS**, **GCP**, **Networking**

- **AWS**
  - `compute` -> EC2, Lambda, Autoscaling
  - `storage` -> S3, EBS, EFS
  - `databases` -> RDS, DynamoDB
  - `networking-vpc` -> VPC, subnets, security groups, IAM
  - `deployment` -> ECS, EKS, CloudFormation
- **GCP**
  - `compute` -> Compute Engine, Cloud Functions
  - `storage-db` -> Cloud Storage, BigQuery, Cloud SQL
  - `networking-iam` -> VPC, IAM
  - `kubernetes` -> GKE
- **Networking** (cloud-agnostic fundamentals)
  - `basics` -> IP, DNS, HTTP, OSI
  - `troubleshooting` -> ping, traceroute, dig, curl, netstat
  - `security` -> SSL/TLS, firewalls, proxies, load balancers

### 3.2 AI Agents (`Career` slug `ai-agents`)
Paths: **AI Agent Fundamentals**, **Prompt Engineering**, **RAG & Memory**, **Agent Frameworks & Tools**

- **AI Agent Fundamentals**
  - `what-is-agent` -> LLM basics, reasoning, tool use
  - `agent-loop` -> perceive / plan / act / reflect
  - `constraints` -> latency, cost, hallucination, safety
- **Prompt Engineering**
  - `principles` -> zero/few-shot, role prompts, chain-of-thought
  - `structured-output` -> JSON, function calling, schema adherence
  - `evaluation` -> measuring prompt quality, iteration
- **RAG & Memory**
  - `retrieval` -> chunking, embeddings, vector search
  - `pipeline` -> indexing, retrieval, grounded generation
  - `advanced` -> reranking, hybrid search, context management
- **Agent Frameworks & Tools**
  - `frameworks` -> building blocks (ReAct, function calling)
  - `tools` -> tool schemas, MCP, rate limits
  - `build` -> a complete agent end-to-end

### 3.3 Web Development (`Career` slug `web-dev`)
Paths: **HTML/CSS/JS**, **Node.js / Express**, **React**, **Next.js**

- **HTML/CSS/JS**
  - `html` -> elements, forms, semantics, accessibility
  - `css` -> selectors, box model, flexbox, grid, responsive
  - `javascript` -> syntax, DOM, events, fetch, async
- **Node.js / Express**
  - `node-basics` -> modules, NPM, filesystem, HTTP
  - `express` -> routing, middleware, REST, error handling
  - `data` -> JSON, databases via ORM, validation
- **React**
  - `components` -> JSX, props, state, effects
  - `interactions` -> events, forms, hooks
  - `patterns` -> context, custom hooks, performance
- **Next.js**
  - `app-router` -> pages, layouts, routing, server components
  - `data-fetching` -> server actions, route handlers, revalidation
  - `fullstack` -> auth, APIs, deployments

### 3.4 System Design (`Career` slug `system-design`)
Paths: **Foundations**, **High-Level Design**, **Low-Level Design**, **Scalability & Reliability**

- **Foundations**
  - `building-blocks` -> clients/servers, APIs, databases, caching
  - `tradeoffs` -> consistency vs availability (CAP), latency vs cost
- **HLD**
  - `architectures` -> monolithic, microservices, serverless, event-driven
  - `case-study` -> design a chat app / URL shortener / e-commerce
- **LLD**
  - `object-modeling` -> classes, interfaces, SOLID
  - `patterns` -> design patterns, UML, components
- **Scalability & Reliability**
  - `scale` -> horizontal/vertical scaling, load balancing, partitioning
  - `reliability` -> redundancy, failover, monitoring, SLAs

---

## 4. Implementation Steps (when you're ready to build)

1. **Author one path fully first** (recommended: `ai-agents/fundamentals.ts`) to establish the rhythm and question quality, mirroring `devops/linux.ts`.
2. **Ensure the seeder accepts multiple careers** — check `prisma/seed.ts` handles a `Career[]` array (it already registers `devopsCareer`; extend `content/curriculum/index.ts` to export all 5).
3. **Run seed** (`npx tsx prisma/seed.ts`) and verify the new careers appear.
4. **Add an "onboarding" choice** in Phase 9-style UX so new users pick a career on signup.
5. **Per-track achievements/skills**: add achievement conditions (e.g. `aws_starter`) as careers grow.
6. **Author content iteratively** — one module per session, matching the existing per-lesson curriculum-structure conventions.

---

## 5. Recommendations & Notes

- **Content volume is the real cost.** Each lesson needs quality activities + 5–7 questions. Plan for depth per track over breadth; the AI generator (`src/lib/ai/generator.ts`) can supplement questions, but curated core content should anchor each lesson.
- **Keep careers independent.** No cross-career prerequisites for MVP; mastering/unlocking stays per-path as today.
- **Reuse networking + Linux** across tracks (a Cloud path may reference DevOps fundamentals) via links, not duplication — respect the "no duplicated logic" rule.
- **Gamification is already generic.** XP, streaks, leagues, quests operate on lessons/skills regardless of track.
- **Standardize quiz question types** per domain: `command` type suits DevOps/Cloud; AI/Web/System-Design will lean on `mcq` and `scenario`.

---

## 6. Suggested Build Order (when starting)

1. AI Agents `--fundamentals` (small, high-demo-value, shows reasoning + tool-use questions)
2. Cloud `--networking` (cloud-agnostic, reuses Linux/CLI skills)
3. Web Dev `--frontend` (HTML/CSS/JS — approachable, quick wins)
4. System Design `--foundations` + `--hld` (conceptual, mcq/scenario heavy)
5. Backfill remaining paths per track.

Each step is independently verifiable with `npx prisma migrate` (if schema changes), re-seed, and `npm run test:run`.
