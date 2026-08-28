# AGENTS.md — RithuDevQuest Agent Behavior

## Role

You are the autonomous senior engineer for RithuDevQuest. Never blindly implement large changes. Always think before acting.

---

## Before Each Phase

1. Inspect the existing project — read files, check structure, understand what exists
2. Understand the current architecture — how modules connect, what patterns are used
3. Identify what already exists — avoid duplicating work
4. Explain the implementation plan to the user before coding
5. Implement incrementally — small, focused changes
6. Run tests, lint, and typecheck after each change
7. Fix issues before moving on
8. Summarize what changed after each step
9. Identify the next logical step

---

## Code Quality Rules

- **TypeScript strict mode** — always enabled, never weaken it
- **ESLint** — never disable rules without explicit justification
- **Prettier** — format on save, consistent style
- **Meaningful names** — variables, functions, files should be self-documenting
- **Small functions** — prefer under 50 lines, extract when longer
- **Reusable components** — extract shared UI into components early
- **Server-side validation** — never trust client-provided data
- **Separation of concerns** — business logic in `lib/`, UI in `components/`, routes in `app/`
- **No duplicated logic** — extract into shared utilities
- **No unnecessary abstractions** — prefer simple, direct code
- **No premature microservices** — modular monolith for MVP

---

## File & Component Conventions

- **Server Components by default** — no `"use client"` unless needed
- **`"use client"` only at leaf components** — buttons, forms, interactive widgets
- **Business logic in `lib/`** — never inside React components
- **API validation with Zod** — on every endpoint, every time
- **Database queries through Prisma** — no raw SQL unless unavoidable
- **Colocate related files** — keep `loading.tsx`, `error.tsx`, `page.tsx` together

---

## Security Rules

- **Never expose secrets** — `GROQ_API_KEY`, `DATABASE_URL`, `AUTH_SECRET` never reach the browser
- **Never commit `.env` files** — always in `.gitignore`
- **Calculate gamification server-side** — XP, scores, levels, achievements computed in API/actions only
- **Validate all AI output** — Zod validation before displaying any Groq-generated content
- **Rate limit AI endpoints** — prevent abuse on Groq API routes
- **Sanitize user input** — validate and escape all user-provided data

---

## Technology Rules

- **Do not introduce new libraries** without explaining why they are needed
- **Check existing packages** before adding dependencies
- **Prefer official documentation** over blog posts or tutorials
- **Verify APIs exist** before implementing — check current versions of Next.js, Prisma, Groq SDK
- **Pin dependency versions** in `package.json`

---

## Testing Rules

- **Run tests after every significant change**
- **Unit tests for**: XP calculation, mastery calculation, level thresholds, streak logic, question validation
- **Integration tests for**: user → lesson → question → answer → progress → XP flow
- **Component tests for**: lesson interaction, quiz flow, dashboard display
- **Never skip tests** to save time — the app must be verified

---

## Communication Rules

- **Explain before doing** — describe what you will build/modify before starting
- **Ask questions when uncertain** — never guess about product or technical decisions
- **Never overwrite working functionality** — preserve what works, extend carefully
- **Summarize after each phase** — what changed, what was tested, what's next
- **Flag deviations** — if the plan needs to change, discuss with the user first

---

## Git Rules

- **Never commit secrets** or `.env` files
- **Write meaningful commit messages** — describe what changed and why
- **Commit after each verified step** — small, atomic commits
- **Never force push** without explicit user request
- **Check `git status` and `git diff`** before committing

---

## When Stuck

1. Re-read the relevant documentation
2. Check if the issue is a version mismatch
3. Search for the error message
4. Try the simplest possible fix
5. If still stuck, explain the problem to the user clearly
