# The 3Ms Framework

> *The Three Ms of AI™ is a trademark of Nate Herk. © 2026 Nate Herk.*
>
> The summary below is a neutral interpretation of the framework as understood when this AIOS was scaffolded. Replace each section with the canonical version from Nate Herk's source material (course, videos, posts) when convenient. Until then, the operator should treat this file as a working sketch — directionally right, not authoritative.

## Why this exists

The 3Ms is the editorial spine for how this AIOS thinks about AI work. When the operator runs `/level-up` or `/audit`, those skills reference these three lenses. When the operator wonders *should AI handle this?*, the answer comes from running the question through all three Ms.

The point is balance. A pure-Mindset operator philosophizes and ships nothing. A pure-Machine operator builds elaborate plumbing that nobody uses. A pure-Method operator picks the right tasks but never has the tools to execute. You need all three.

---

## M1 — Mindset

**How to think about AI.**

The set of beliefs and defaults that determine whether you reach for AI at all. Without the right mindset, the best methods and machines sit unused.

Core habits this AIOS reinforces:

- **Default Shift.** When a new task lands, ask "to what extent could AI be leveraged here?" *before* assuming the manual path.
- **Operator, not user.** You are not a consumer of AI tools — you are a builder using them as raw material. Customize, automate, compose.
- **Compounding context.** Every conversation should leave the AIOS smarter than it found it. That's why we keep `decisions/log.md`, `context/`, and `.sessions/` — context that survives the chat.
- **Trust calibration.** AI is right often, but never always. Verify anything you can't undo.

When the mindset is the bottleneck, the symptom is *under-utilization*: AI is available but not used.

---

## M2 — Method

**How to decide what AI should do.**

The framework for picking *which* tasks deserve AI leverage and *how* the work gets sliced.

Core questions this AIOS asks:

- **Frequency × pain.** Is this task done often enough, and painful enough, to justify investing in the automation?
- **Determinism level.** Does this task tolerate a non-deterministic answer? If not, AI is a draftsperson, not the decider.
- **Reversibility.** What's the cost of a wrong output? Cheap reversibility = high leverage. Hard-to-reverse = humans in the loop.
- **Right size.** A skill is a recipe, not a monolith. Pick the smallest atomic task. Compose later.

When the method is the bottleneck, the symptom is *misallocation*: AI is used, but on the wrong things.

---

## M3 — Machine

**How to actually build.**

The plumbing — the skills, hooks, MCP connections, scheduled tasks, and integrations that turn a chat into a system.

Core building blocks this AIOS uses:

- **Skills** (`.claude/skills/*` and `.agents/skills/*`) — codified playbooks invokable as slash commands.
- **Hooks** — event-driven automation in `settings.json` (PreToolUse, PostToolUse, Stop, UserPromptSubmit, etc.).
- **MCP servers** — typed connections to external tools (Gmail, GitHub, Linear, custom APIs).
- **Scheduled tasks** — recurring runs that don't need you in the loop.
- **Persistent files** — `context/`, `decisions/log.md`, `connections.md`, `.sessions/` so context survives across sessions.

When the machine is the bottleneck, the symptom is *friction*: the right task is identified but the tooling makes it slower than doing it manually.

---

## How `/audit` uses this

The Four-Cs audit grades each connection and skill against the 3Ms — does it have the mindset attention it deserves, is it being used in the right method-aligned ways, is the machine built well enough that the friction isn't blocking adoption.

See `.claude/skills/audit/SKILL.md` for the rubric.

## How `/level-up` uses this

The weekly `/level-up` interview walks all three Ms in order — checks mindset blockers, identifies a high-frequency-high-pain task (method), scopes the smallest shippable automation (machine).

See `.claude/skills/level-up/SKILL.md` for the run-book.
