---
name: commit-msg
description: Generate a Conventional Commit message from staged changes. Use before committing when staged changes are non-trivial or when you want consistent, scannable history.
---

# /commit-msg

You are writing a commit message for Anson. Conventional Commits format. One commit per logical change. The message should help future-Anson (or a collaborator) bisect, revert, or understand the change in 6 months.

## Pre-flight

1. Run `git status --short` and `git diff --staged` to see exactly what's staged.
2. If nothing is staged, run `git diff` and ask Anson which files to stage first. Don't write a commit message for unstaged work.
3. Look at recent history: `git log -10 --oneline` to match the repo's existing style (some repos use Conventional Commits strictly; others are looser — match what's there unless explicitly told to switch).

## Format

Standard Conventional Commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types (default set)

- `feat` — new feature or capability
- `fix` — bug fix
- `refactor` — code change that neither fixes a bug nor adds a feature
- `perf` — performance improvement
- `docs` — documentation only
- `test` — adding or fixing tests
- `chore` — tooling, config, deps, build
- `style` — formatting only (no logic)
- `ci` — CI / deploy config

### Scope

Optional. Use when the repo has clear subsystems. Examples Anson might use:
- `interlock-admin` / `interlock-tech` / `interlock-site` for InterlockGo projects
- `nexgen-site` for NexGen Studio marketing site
- `client/builtbykiefer` for client work
- `aios` for this AIOS repo

### Subject

- Imperative mood. "Add", "Fix", "Remove" — not "Added", "Fixes", "Removing".
- Under 70 chars total (including type + scope).
- No period at the end.

### Body

Optional. Use when the *why* isn't obvious from the subject. One short paragraph. Wrap at 72 chars.

### Footer

Optional. For:
- Breaking changes: `BREAKING CHANGE: <description>`
- Issue refs: `Closes #123` or `Refs #456`
- Co-author: `Co-Authored-By: Name <email>`

## Examples

Good:
```
feat(scaffold-next): generate fresh Next.js shell with Tailwind + Prisma

Replaces the manual setup that took 30+ minutes per client project.
The skill writes a layout, env scaffold, and Prisma schema matching
NexGen Studio conventions.
```

```
fix(interlock-admin): handle Puppeteer timeout on Guardian portal sync

Guardian's login page occasionally takes 12+s. Bumped the wait to 20s
and added one retry with backoff.
```

```
refactor(aios): split context/about-business.md into per-business sections
```

Bad (don't do these):
- `update stuff` — what stuff, what update
- `WIP` — never commit WIP to a branch you'll merge
- `feat: lots of changes` — split it into multiple commits
- `Fixes the bug.` — past tense, period, no scope, no specifics

## Rules

- One commit per logical change. If staged changes span 3 unrelated areas, tell Anson to split first.
- Don't invent issue numbers. Only reference issues that exist or that Anson names.
- Don't add `Co-Authored-By: Claude` unless Anson asks — his repos may or may not want it.
- When in doubt about scope, leave it out. `feat: ...` is better than `feat(wrong-scope): ...`.
- Output the message ready for `git commit -m "..."` (or `-F`-friendly multi-line via HEREDOC if there's a body).

## After drafting

Show the message. Ask: "commit with this?" If approved, run `git commit` using a HEREDOC for multi-line bodies:

```
git commit -m "$(cat <<'EOF'
feat(scope): subject

body line 1
body line 2
EOF
)"
```
