---
name: pr-desc
description: Generate a PR description from the current branch's diff + commits. Includes summary, why, test plan, and risk callouts. Use before pushing or opening a PR.
---

# /pr-desc

You are writing a pull-request description for Anson. The reader is either Anson re-reading his own work in 3 months, or a future collaborator. Both deserve a clear answer to: *what changed, why, and how do I know it works?*

## Pre-flight

1. Determine base branch: usually `main`, confirm with `git symbolic-ref refs/remotes/origin/HEAD` or `git config init.defaultBranch`.
2. Read the branch: `git log <base>..HEAD --oneline` for commit history, `git diff <base>...HEAD --stat` for scope, `git diff <base>...HEAD` for actual changes.
3. If the branch name follows a convention (e.g. `feat/scaffold-next`, `fix/auth-redirect`), note the implied type and scope.
4. Look for related context: issue references in commit messages, TODO comments removed in the diff, files added under `.sessions/` or `decisions/log.md` near the date of the first commit.

## Output format

Use this template. Skip sections that don't apply rather than writing "n/a."

```
## Summary
{{One or two sentences. What changed. No more.}}

## Why
{{One paragraph. The motivation. If the PR closes an issue, link it. If it implements a decision logged in decisions/log.md, reference that date.}}

## Changes
- {{File or area}}: {{what changed in 1 line}}
- ...

## How to verify
- [ ] {{specific manual check the reviewer or Anson can do in <60s}}
- [ ] {{another check, e.g. "run the dev server and click X"}}

## Risk
{{One line. What could go wrong. Be honest. If there's a migration, a feature flag, or a destructive change, call it out here.}}

## Out of scope
{{Optional. Things noticed during the work but deliberately deferred. Helps future reader know what NOT to expect.}}
```

## Style rules

- Title (if you set one): under 70 chars. Conventional Commit style if commits are conventional (e.g. `feat(scaffold-next): generate fresh Next.js shell with Tailwind + Prisma`).
- "Why" section: *motivation*, not restated "what". Bad: "this PR adds X". Good: "scaffolding new client projects was the #1 weekly drag — this skill collapses it into one command."
- "How to verify" must be doable in under a minute. If verification is complex, link to a longer doc.
- "Risk" section: never lie. Better to say "could break X if Y" than "no risk."

## Rules

- Don't pad. A 3-line PR description for a 20-line change is correct.
- Don't paste the diff. The reader can see the diff.
- Don't fabricate test coverage. If no tests were added, say so in "How to verify" with manual steps.
- Match Anson's voice (`references/voice.md`): direct, time-specific, no corporate-speak. PR descriptions trend toward Sample 1 register (clean, complete sentences).

## After drafting

Show the description to Anson. Ask: "post as the PR body, or revise?" Use `gh pr create --body "$(cat <<'EOF' ... EOF)"` if approved.
