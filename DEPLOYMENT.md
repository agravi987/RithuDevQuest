# Deploy RithuDevQuest to Vercel with Neon Postgres

Step-by-step guide to deploy the application on **Vercel** (hosting) with **Neon** (PostgreSQL database).

---

## Prerequisites

Before you start, make sure you have:

- A [Vercel account](https://vercel.com/signup) (free tier works)
- A [Neon account](https://neon.tech/free-tier) (free tier includes 0.5 GB storage)
- A [Groq API key](https://console.groq.com/keys) (free tier available)
- Your GitHub repository pushed to GitHub

---

## Step 1 — Create a Neon Database

1. Sign in to [Neon Console](https://console.neon.tech).
2. Click **Create Project**.
3. Choose a region close to your Vercel deployment region (e.g. `us-east-1` for US East).
4. Name the database `rithudevquest`.
5. Click **Create**. Neon will create the project and database for you.
6. On the project dashboard, go to **Connection Details** and copy the **Pooled connection string**. It looks like:
   ```
   postgresql://neondb_owner:xxxx@ep-xxx.us-east-1.aws.neon.tech/rithudevquest?sslmode=require
   ```
7. Also copy the **Unpooled connection string** (used for migrations). It looks similar but uses a different port and does not include connection pooling.

---

## Step 2 — Run Database Migrations

You need to push the Prisma schema to your Neon database. You can do this from your local machine:

1. Create a `.env` file locally (or update your existing one) with the Neon connection string:

   ```env
   DATABASE_URL="postgresql://neondb_owner:xxxx@ep-xxx.us-east-1.aws.neon.tech/rithudevquest?sslmode=require"
   DATABASE_ADAPTER="neon"
   DATABASE_URL_UNPOOLED="postgresql://neondb_owner:xxxx@ep-xxx.us-east-1.aws.neon.tech/rithudevquest?sslmode=require"
   ```

2. Run migrations and seed:

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   npx tsx prisma/seed.ts
   ```

   > **Note:** If this is your very first deployment and you have no existing migrations, run `npx prisma migrate dev --name init` first to create the migration files, then `npx prisma migrate deploy`.

---

## Step 3 — Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your GitHub repository.
3. Vercel auto-detects Next.js. The build settings should be:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
4. Click **Deploy** — this first deploy will fail because env vars aren't set yet. That's expected.

### Option B: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel --prod
```

---

## Step 4 — Set Environment Variables on Vercel

Go to your project on Vercel → **Settings** → **Environment Variables** and add:

| Variable | Value | Environments |
|---|---|---|
| `DATABASE_URL` | Your Neon **pooled** connection string (from Step 1) | Production, Preview |
| `DATABASE_URL_UNPOOLED` | Your Neon **unpooled** connection string (from Step 1) | Production, Preview |
| `DATABASE_ADAPTER` | `neon` | Production, Preview |
| `AUTH_SECRET` | A random secret string (generate with `npx auth secret` or `openssl rand -base64 32`) | Production, Preview |
| `AUTH_URL` | Your Vercel app URL, e.g. `https://your-app.vercel.app` | Production, Preview |
| `GROQ_API_KEY` | Your Groq API key from [console.groq.com](https://console.groq.com/keys) | Production, Preview |

> **Important:** The `AUTH_URL` must match your deployed URL exactly, including `https://`. For preview deployments, you can set a separate `AUTH_URL` per preview branch or leave it to use the default.

After adding all variables, go to **Deployments** and redeploy (or trigger a new deployment).

---

## Step 5 — Verify the Deployment

1. Open your deployed URL.
2. You should see the landing page at `/`.
3. Sign up for a new account or log in.
4. Navigate to the dashboard and explore lessons.

---

## How the Neon Adapter Works

The app switches between database adapters based on the `DATABASE_ADAPTER` environment variable:

- **`DATABASE_ADAPTER="pg"`** — Uses `@prisma/adapter-pg` with a direct PostgreSQL connection. Use this for **local development** with Docker.
- **`DATABASE_ADAPTER="neon"`** — Uses `@prisma/adapter-neon` with Neon's serverless driver. Use this for **Vercel deployments** where direct database connections may hit connection limits.

This logic lives in `src/lib/db.ts`.

---

## Troubleshooting

### Build fails with "prisma generate" errors

Vercel runs `npm install` which triggers the `postinstall` script (`prisma generate`). If this fails:
- Make sure `prisma` and `@prisma/client` are in your dependencies (not just devDependencies).
- Check that your `prisma/schema.prisma` file is committed to the repository.

### "DATABASE_URL is not defined" error at runtime

- Double-check that `DATABASE_URL` is set in Vercel environment variables for the correct environment (Production/Preview).
- Make sure you're using the **pooled** connection string for runtime.

### Auth redirect loop or "unauthorized" errors

- Ensure `AUTH_URL` is set to your full deployed URL (e.g. `https://rithudevquest.vercel.app`).
- Ensure `AUTH_SECRET` is set and is a strong random string (at least 32 characters).

### Neon connection timeout

- Neon's free tier auto-scales to zero when idle. The first request after idle may take a few seconds while the database wakes up. This is normal on the free tier.
- Consider upgrading to a paid Neon plan for always-on compute if this is a problem.

### Prisma migration errors

If `npx prisma migrate deploy` fails:
- Ensure you're using the **unpooled** connection string for migrations (set as `DATABASE_URL` locally when running migrate commands).
- Check that the Neon database exists and the connection string is correct.

---

## Vercel Project Settings Summary

| Setting | Value |
|---|---|
| Framework | Next.js |
| Node.js Version | 20.x (default) |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |
| Root Directory | `/` (monorepo root) |

---

## Costs Estimate

| Service | Free Tier | What You Get |
|---|---|---|
| **Vercel** | Hobby plan | 100 GB bandwidth, 1000 build minutes/month |
| **Neon** | Free plan | 0.5 GB storage, 24/7 compute for 200 hrs/month |
| **Groq** | Free tier | 30 req/min, 14,400 req/day |

For a personal project or MVP, the total cost is **$0/month**.

---

## Post-Deployment Checklist

- [ ] Neon database created and migrations applied
- [ ] All environment variables set on Vercel
- [ ] `AUTH_URL` matches the deployed URL
- [ ] Landing page loads at `/`
- [ ] Sign up and login work
- [ ] Lessons and quizzes load
- [ ] AI features (hints, explanations) work with Groq
