# Decisions Log

Append-only record of decisions the operator and I make. Never edit past entries. Add a follow-up entry if a prior decision is reversed.

Why this matters: a single sentence of *why* now is worth an hour of archaeology in six months. Future-you (and future-AI) reads this before re-litigating settled questions.

## Format

```
## YYYY-MM-DD — {{short title}}

- Decision: what was decided, in one sentence.
- Why: the reason, including constraints, deadlines, or stakeholders.
- Alternatives considered: what was rejected and why.
- Reversibility: easy / medium / hard.
- Follow-up: any work this commits us to.
```

---

## 2026-06-01 — Initial scaffold completed

- Decision: Build the AIOS on the cloned Nate Herk kit. Keep the 3Ms framework and Four-Cs audit layer as the editorial spine.
- Why: Operator wants a personal AIOS for software-engineering productivity, eventually templateable for other businesses. Starting from a structured kit beats reinventing the folder shape.
- Alternatives considered: Strip the 3Ms layer for a neutral structure (rejected — operator chose to keep it permanently). Skip the scaffold and jump straight to skills (rejected — kit machinery needs the missing files to function).
- Reversibility: easy. Files are markdown and can be re-written or removed.
- Follow-up: Operator fills `aios-intake.md` Q1-Q7, then runs `/onboard`. Then Phase 2 (code-focused skills like `/review`, `/pr-desc`, `/commit-msg`).

## 2026-06-01 — /onboard run

- Decision: Personalized the AIOS from `aios-intake.md` Q1-Q7 (with resume + chat as supplements).
- Why: First `/onboard` run. Operator is Anson Cordeiro, full-stack SWE, running NexGen Studio + InterlockGo NOCO simultaneously. Quarter priorities: grow InterlockGo to #1 in Greeley, build NexGen Studio via shipped projects.
- Alternatives considered: Defer until intake was 100% complete (rejected — Q4/Q5/Q6 details were minor and could be filled later without blocking value).
- Reversibility: easy. Prior file versions are in git.
- Follow-up: Operator reviews populated files. Then Phase 2 code skills. Q4/Q5/Q6 gaps marked in `connections.md` under "Pending confirmation" — fill when convenient.

## 2026-06-01 — Top weekly pain identified

- Decision: Treat "scaffolding new Next.js apps from scratch every time" as Phase 2's primary target. Build `/scaffold-next` skill this session.
- Why: Operator named it explicitly. High frequency (every NexGen client), high pain (boilerplate without leverage), and immediately solvable as a skill — fits the 3Ms Method filter (frequency × pain, draft is good enough, reversible).
- Alternatives considered: Build voicemail/SMS triage first (rejected — requires OpenPhone MCP integration which is Tier 4 work, not a skill). Defer all code skills and build hooks instead (rejected — skills have faster payoff for solo operator).
- Reversibility: easy.
- Follow-up: After `/scaffold-next` ships, run it on the next real NexGen project and capture lessons in `.sessions/`.
