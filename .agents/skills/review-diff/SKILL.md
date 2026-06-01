---
name: review-diff
description: Review the current diff for correctness bugs, security holes, and TS/Next.js conventions specific to Anson's stack. Use after writing code, before committing. Distinct from the built-in /review (PR review) and built-in /code-review (generic diff review) — this is house-rules review tuned to Anson's Prisma + Next.js App Router + Tailwind conventions.
---

# /review-diff

You are reviewing Anson's pending changes. Be honest. Half-shipped is worse than "needs work" — flag real problems and propose minimum-viable fixes.

## Pre-flight

1. Run `git status --short` to see the change surface.
2. Run `git diff --stat` to get the file-level summary, then `git diff` (or `git diff HEAD` if some files are staged) to read the actual changes.
3. If reviewing a PR (not local diff), check `gh pr view <num> --json title,body,files` first.
4. Skim `context/about-business.md` if the diff touches a known project (InterlockGo, NexGen Studio client work) — there may be project-specific constraints you'd otherwise miss.

## What to look for

Hunt across these dimensions. Don't pad with everything — only call out real findings.

### 1. Correctness bugs

- Off-by-one, wrong condition, swapped arguments.
- `null` / `undefined` paths the code doesn't handle.
- Async-without-await, missing `try/catch` on operations that can throw at runtime (network, file I/O, JSON.parse on untrusted input).
- React: stale closures in `useEffect`, missing dependency-array entries, key collisions in lists, state updates after unmount.
- Next.js: server / client boundary violations, accidental data leaks in server components, `use client` placed on wrong file.

### 2. Security

- SQL injection — string-interpolated queries. Anson uses Prisma; raw `$queryRaw` without `Prisma.sql` is a flag.
- XSS — React's raw-HTML injection escape hatch used with un-sanitized input. Look for any direct prop assignment of raw HTML strings into rendered output.
- Secrets in code — API keys, tokens, OpenPhone credentials. Should be in env vars.
- Auth bypass — routes that should require auth but don't check.
- CSRF — state-changing endpoints without proper protection.
- Validation gaps — accepting input without Zod-parsing it at the boundary.

### 3. Anson's stack conventions

- **TypeScript:** no `any` unless commented why; prefer `unknown` + narrow. No `// @ts-ignore` without a one-line reason.
- **Zod:** schema lives next to or above the function that consumes it; parse at the boundary (route handler / form action), not deep in business logic.
- **Prisma:** queries inside `await prisma.$transaction(...)` when multiple writes must succeed together; relations explicit via `include`/`select`.
- **Next.js App Router:** server components by default, `"use client"` only when needed; data fetching in server components or route handlers, not in client components via fetch.
- **Tailwind:** utility composition over arbitrary values; extract repeated class strings into a component or a `cn()` helper instead of duplicating.

### 4. Reuse and simplification

- Code that duplicates an existing helper or pattern in the repo.
- Logic that could collapse to a one-liner or be replaced by a built-in.
- Dead code (unused imports, unreachable branches, commented-out blocks).
- Over-abstraction — interfaces, factories, or generics for code with one caller.

### 5. Performance

- N+1 queries in Prisma loops (`for...of` with `await prisma.x.findUnique()` inside).
- Re-renders from unstable object/function props in React. Memoize only when measured.
- Bundle-blowing imports (full `lodash`, full `date-fns` without tree-shake-friendly imports).
- Sync I/O on hot paths.

## Output format

```
# Review — {{branch or PR}}

## Critical (must fix before merge)
- {{file:line}} — {{problem}}. **Fix:** {{minimum-viable change}}.

## High (fix soon)
- {{file:line}} — {{problem}}. **Fix:** {{change}}.

## Cleanups (optional)
- {{file:line}} — {{simplification}}.

## Looks good
- {{one or two specific positives that show you read the code, not boilerplate}}
```

Skip empty sections. If there are no critical findings, omit the heading rather than writing "none."

## Rules

- Be specific. "Refactor this" is useless; "extract lines 42-58 into a `formatInvoice()` helper because the same shape appears in `pdf.ts:114`" is useful.
- Cite file:line for every finding.
- Don't hallucinate APIs. If you reference a library function, you must have seen it imported in the diff or be confident it exists in that library.
- Don't make stylistic findings ("I'd name this differently") unless tied to a real readability or correctness issue.
- Don't suggest tests Anson didn't ask for. If a missing test is critical (security boundary, complex business logic), flag it as Critical with one sentence.
- Don't apply fixes — this skill only finds. Use `/code-review --fix` (built-in) if Anson wants automatic application.
- After finishing, ask once: "Want me to apply any of these?" Do not auto-apply.
