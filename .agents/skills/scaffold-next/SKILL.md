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
npx --yes create-next-app@latest <name> \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --eslint \
  --use-npm \
  --no-turbopack
```

Notes on what `create-next-app` does for you (current as of Next.js 16.x — re-check on a new major):

- **Initializes git and makes an initial commit** ("Initial commit from Create Next App"). Do NOT run `git init` again — just `git add -A` your layered conventions and create a second commit.
- **Generates a one-line `AGENTS.md`** with a "this is not the Next.js you know" warning, plus a `CLAUDE.md` that just references `@AGENTS.md`. Leave both in place unless the operator asks otherwise. Pass `--no-agents-md` if you want them omitted.
- Uses **Tailwind v4** (no `tailwind.config.ts/js` file — config is CSS-based, lives in `src/app/globals.css`).
- Adds Geist + Geist_Mono fonts and a basic dark-mode-friendly `layout.tsx`.
- `.gitignore` includes `.env*` — this means `.env.example` would also be ignored. **Add `!.env.example` to `.gitignore`** when you create the example file, otherwise it won't be tracked.

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
- **`@prisma/client@^6` and `prisma@^6`** as devDep (pin to 6 — see Prisma version note below)
- Auth-package if applicable

#### Prisma version note (important)

Prisma 7 (released late 2025) is a breaking change:
- `datasource.url` is no longer allowed in `schema.prisma`. Connection URLs must live in a `prisma.config.ts` file.
- `PrismaClient` is no longer instantiated with a `datasourceUrl` constructor option — it needs an adapter (`@prisma/adapter-better-sqlite3`, `@prisma/adapter-pg`, etc.) passed to the constructor.
- The simple "schema + client" pattern this skill produces is incompatible with Prisma 7 defaults.

**Pin to `^6`** for new scaffolds (`npm install @prisma/client@^6 prisma@^6`) until this skill is updated with a Prisma 7 code path. When Anson is ready to adopt Prisma 7, the migration is well-documented at https://pris.ly/d/prisma7-client-config but it changes the shape of `prisma/schema.prisma` and `src/lib/prisma.ts` enough that it should be its own skill update.

### Git

- `create-next-app` has already initialized git and made the first commit (`Initial commit from Create Next App`). **Do not run `git init` again.**
- After layering conventions and installing extra deps, run `git add -A && git commit -m "chore: scaffold from /scaffold-next"`.
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

## Verification before reporting done

After committing, run these and surface any failure to Anson:

```sh
npx prisma generate   # confirms schema parses + client builds
npx tsc --noEmit      # type-check the layered conventions
npm run lint          # eslint clean
npm run build         # next build smoke test (catches type errors in build pipeline too)
```

All four must pass before reporting success. If any fail, stop and surface the error verbatim — don't patch around it.

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
