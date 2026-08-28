# RithuDevQuest 🚀

> A Duolingo-inspired, gamified technical learning platform for **DevOps, Cloud, Linux, Docker, Git, and Kubernetes** — guided by **Rithu**, your AI engineering mentor.

---

## 🌟 Key Features

- **🎮 Duolingo-Style Gamification**:
  - **Experience Points (XP)**: Earn XP for lesson completions, first-try accuracy, and daily consistency.
  - **Streak Engine**: Real-time streak flame counter tracking daily active learning.
  - **Player Levels**: 10 progression ranks from *Code Initiate* to *DevOps Legend*.
  - **Quests & Achievements**: Unlock badges with bonus XP rewards.
- **📚 Curated DevOps Roadmap**:
  - Step-by-step skill tree across **Linux Fundamentals, Git Version Control, Docker & Containers, and Kubernetes Orchestration**.
  - Prerequisite-based node unlocking with visual progress indicators.
- **🤖 Groq AI Integration (Llama 3.3)**:
  - Dynamic AI quiz challenges, conceptual mistake explanations, progressive hints, and contextual Rithu mentorship.
- **🎯 Adaptive Practice Arena**:
  - Weighted skill mastery tracking (40% correctness, 20% recency, 20% difficulty, 20% consistency) highlighting weak skills.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Components & Actions) |
| **Language** | TypeScript (Strict Mode) |
| **Styling & UI** | Tailwind CSS v4, shadcn/ui, `motion` animations |
| **Database** | PostgreSQL 16 (Docker Desktop local / Neon serverless prod) |
| **ORM** | Prisma 7 (pg adapter) |
| **Authentication** | Auth.js v5 (next-auth@beta, Credentials + JWT) |
| **AI Engine** | Groq SDK (Llama 3.3 70B & Llama 3.1 8B) |
| **Testing** | Vitest + React Testing Library (135+ automated tests) |

---

## 📋 Prerequisites

Before running the project locally, make sure you have:
1. **Node.js**: `v20.x` or later (with `npm`)
2. **Docker Desktop**: Installed and running (for local PostgreSQL 16)
3. **Groq API Key**: (Free at [console.groq.com](https://console.groq.com/))

---

## 🚀 Getting Started (Step-by-Step)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/rithudevquest.git
cd rithudevquest
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create your local `.env` file by copying the example:
```bash
# On Linux/macOS
cp .env.example .env

# On Windows PowerShell
Copy-Item .env.example .env
```

Ensure your `.env` contains:
```env
# Database (Docker PostgreSQL)
DATABASE_URL="postgresql://rithu:rithu123@localhost:5432/rithudevquest"
DATABASE_ADAPTER="pg"

# Auth.js Secret (generate with: npx auth secret)
AUTH_SECRET="your-generated-auth-secret"
AUTH_URL="http://localhost:3000"

# Groq AI Key
GROQ_API_KEY="your-groq-api-key-here"
```

### 4. Start the Local PostgreSQL Database
Make sure **Docker Desktop** is open, then start the container:
```bash
docker compose up -d
```
> This starts a PostgreSQL 16 database on port `5432` with username `rithu` and password `rithu123`.

### 5. Run Database Migrations & Generate Prisma Client
```bash
# Apply migrations to create database tables
npx prisma migrate dev

# Generate type-safe Prisma client
npx prisma generate
```

### 6. Seed the Curriculum & Achievements
Seed the full DevOps learning path and quest achievements:
```bash
npx tsx prisma/seed.ts
```

### 7. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👤 Test User Credentials

After running the seed script, you can log in with:
- **Email**: `test@rithudevquest.dev`
- **Password**: `password123`

*(Or register a new account on the `/signup` page!)*

---

## 🧪 Testing & Code Quality

Run the test suite:
```bash
# Run all Vitest unit & component tests
npm run test:run

# Run ESLint check
npm run lint

# Run TypeScript typecheck
npx tsc --noEmit

# Test production build
npm run build
```

---

## 📁 Project Structure

```
rithudevquest/
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login & Signup routes
│   │   ├── (main)/             # Protected app routes
│   │   │   ├── dashboard/      # Gamified Dashboard & Roadmaps
│   │   │   ├── learn/          # Skill Tree & Lesson Player
│   │   │   ├── practice/       # Adaptive AI Practice Arena
│   │   │   └── achievements/   # Badges & Quests Hall
│   │   └── api/ai/             # Groq AI endpoints (generate, explain, mentor, hint)
│   ├── components/
│   │   ├── gamification/       # XP, Streaks, Levels, Achievements UI
│   │   ├── lesson/             # Interactive lesson player & quiz engine
│   │   ├── mentor/             # Rithu AI speech bubble & mascot
│   │   └── shared/             # Header, Navigation, Dark Mode
│   └── lib/
│       ├── ai/                 # Groq client, prompt templates, rate-limiting
│       ├── gamification/       # XP, levels, streak math, badge evaluator
│       ├── mastery/            # Weighted mastery algorithm & recommendations
│       └── curriculum/         # Prerequisite unlocking logic & DB queries
├── content/curriculum/         # DevOps curriculum content & question bank
├── prisma/                     # Schema, migrations & seed scripts
└── docker-compose.yml          # Local PostgreSQL 16 container definition
```

---

## 📄 License
MIT License. Crafted with passion for modern DevOps engineering.
