---
name: scaffold-next
description: Generate a fresh Next.js project shell matching NexGen Studio conventions — App Router, TypeScript strict, Tailwind, Prisma schema, env scaffold, layout primitives. Use when starting a new client project. Direct hit on Anson's #1 weekly drag.
---

# /scaffold-next

You are generating a fresh Next.js project for Anson. The point is to skip the 30+ minutes of "set up the same thing again" that starts every NexGen Studio client engagement.

## Pre-flight

1. Ask Anson three questions (only these — anything else is overreach):
   - **Project name?** Used for the directory and `package.json` name. Slug-style: `acme-co`, `builtbykiefer`, etc.
   - **Database — Postgres (Fly.io / Supabase) or SQLite (local-only)?** Default Postgres if unsure.
   - **Auth needed — yes / no / "decide later"?** If yes, ask: phone OTP (matches InterlockGo Technician App pattern), email magic link, or NextAuth/Auth.js?
2. Confirm working directory. Default: `~/dev/<project-name>`. Confirm before creating.
3. Check `gh auth status` — if Anson wants a GitHub repo created, we need auth working.

## What you generate

Generate the project by running `npx create-next-app@latest <name>` with these flags, then layer Anson's conventions on top:

```
npx create-next-app@latest <name> \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --eslint \
  --no-turbopack
```

After scaffolding, add:

### Conventions layer

- **`tsconfig.json`:** enforce `"strict": true`, `"noUncheckedIndexedAccess": true`.
- **`src/lib/env.ts`:** Zod-validated env access. Throws on startup if required vars missing.
- **`src/lib/cn.ts`:** the standard `cn()` helper using `clsx` + `tailwind-merge`.
- **`src/lib/prisma.ts`:** singleton Prisma client (avoids dev hot-reload connection storms).
- **`prisma/schema.prisma`:** baseline schema with datasource matching the chosen DB. Empty model section with a `// Models go here` placeholder.
- **`.env.example`:** committed; lists every var the app reads with safe placeholder values.
- **`.env`:** gitignored; left blank for Anson to fill.
- **`src/app/layout.tsx`:** baseline layout with `metadata`, a font setup (Inter or Geist by default), and the `cn` import wired.
- **`src/app/page.tsx`:** simple "It works" landing component, not the create-next-app default boilerplate.
- **`README.md`:** project-specific, lists the stack chosen, env vars needed, dev/build/deploy commands, deploy target placeholder.

### If auth = yes

Add the chosen auth pattern:
- **Phone OTP:** scaffolds `src/lib/auth/otp.ts` with send/verify stubs (OpenPhone-compatible). Adds `User` and `OtpCode` models to Prisma. Matches InterlockGo Technician App pattern.
- **Email magic link:** scaffolds NextAuth/Auth.js config with Email provider. Adds Auth.js models to Prisma.
- **Other:** ask for clarification.

### Dependencies installed

Beyond `create-next-app` defaults, install:
- `zod` (always)
- `clsx`, `tailwind-merge` (for the `cn` helper)
- `@prisma/client`, `prisma` (always — even if Anson says "no DB yet", scaffolding is cheaper to remove than retrofit)
- Auth-package if applicable

### Git + GitHub

- Initialize git, make an initial commit: `chore: scaffold from /scaffold-next`.
- If Anson asked for a GitHub repo: `gh repo create <name> --private --source=. --push`.
- Otherwise, leave local-only and remind Anson the command to push later.

## Output

After scaffold completes, print:

```
# Scaffold complete: <name>

## Stack
- Next.js <version>, App Router, TypeScript strict
- Tailwind, Prisma (<db>), Zod
- Auth: <choice or "none">

## Next steps
1. cd <path>
2. Fill .env (see .env.example for required vars)
3. npx prisma migrate dev --name init
4. npm run dev

## Deploy target
Not configured. When ready: `flyctl launch` (Fly.io) or `vercel` (Vercel).

## Repo
<github URL if created, else "local-only — run `gh repo create` when ready">
```

## Rules

- Don't ask 10 questions. The three pre-flight questions are the contract. Anson can refine later.
- Don't install kitchen-sink dependencies "in case." Each added dep should solve a concrete problem listed above.
- Don't generate marketing pages, dashboards, or component libraries. Scaffold is the foundation, not the building.
- Don't run database migrations automatically — Anson runs them after filling env.
- Don't open a browser, don't auto-start `npm run dev` — leave the terminal clean.
- If `npx create-next-app` errors out, stop and surface the error verbatim. Don't try to patch around it.
- If a file you'd write already exists (shouldn't happen on fresh scaffold, but defensive), ask before overwriting.

## After running

Suggest adding a line to `decisions/log.md`:

```
## YYYY-MM-DD — Scaffolded <name>

- Decision: New NexGen Studio project for <client/purpose>.
- Why: <one line>.
- Stack: as above.
- Reversibility: easy until first deploy.
- Follow-up: define scope, deploy target, first milestone.
```
