# Connections

Registry of every system this AIOS can reach. One entry per tool. Updated whenever a connection is added, removed, or changes status.

`/audit` reads this file weekly and grades freshness as part of the Four-Cs report.

## Status legend

- `connected` — wired up and verified working (MCP, script, export, or API).
- `partial` — credentials exist but not all flows tested, or read-only when write was intended.
- `aware` — the AIOS knows the tool exists and where it sits in your stack, but cannot reach it.
- `archived` — deliberately disconnected. Keep the row so future-you remembers why.

## Entry template

Copy this block for each tool.

```
### {{tool name}}
- Purpose: what you use it for.
- Status: aware | partial | connected | archived
- Reach: MCP server name, script path, export location, or API base URL.
- Owner: who maintains the connection (usually you).
- Last verified: YYYY-MM-DD
- Notes: quirks, auth method, rate limits, gotchas.
```

## Connections

### Claude Code
- Purpose: primary AI dev environment for coding, this AIOS, daily work.
- Status: connected
- Reach: native CLI / IDE integration.
- Owner: Anson
- Last verified: 2026-06-01
- Notes: paid plan.

### Codex
- Purpose: secondary AI dev environment.
- Status: connected
- Reach: native CLI / IDE integration. Reads `AGENTS.md` and `.agents/skills/`.
- Owner: Anson
- Last verified: 2026-06-01
- Notes: paid plan. Persona mirrors `CLAUDE.md`; skills mirror `.claude/skills/`.

### Gmail
- Purpose: primary email — NexGen Studio client comms, general correspondence.
- Status: aware
- Reach: not yet wired. Candidate for Gmail MCP (Phase 4).
- Owner: Anson (vball04life@gmail.com)
- Last verified: 2026-06-01
- Notes: Gmail MCP would unlock daily-triage skill (see EXPANSIONS Tier 4).

### OpenPhone
- Purpose: InterlockGo NOCO business phone / SMS. Used for client reminders + lead intake.
- Status: partial
- Reach: API wired in InterlockGo Admin Dashboard production code (Express). Not exposed as MCP to the AIOS yet.
- Owner: Anson
- Last verified: 2026-06-01
- Notes: API already proven in production. Future MCP integration would enable voicemail→transcript→SMS-draft triage skill (Q7 pain #2, EXPANSIONS Tier 4).

### GitHub
- Purpose: code hosting for all NexGen Studio + InterlockGo + personal projects.
- Status: aware
- Reach: `github.com/an5onc`. `gh` CLI available locally. GitHub MCP not yet wired.
- Owner: Anson
- Last verified: 2026-06-01
- Notes: GitHub MCP would unlock PR babysitter + issue triage (EXPANSIONS Tier 5).

### Fly.io
- Purpose: deployment platform for InterlockGo Technician App (Next.js 15 + Prisma + PostgreSQL).
- Status: aware
- Reach: `flyctl` CLI locally. No MCP integration.
- Owner: Anson
- Last verified: 2026-06-01
- Notes: production InterlockGo Technician App runs here.

### Vercel
- Purpose: deployment platform for NexGen Studio client sites (Next.js).
- Status: aware
- Reach: Vercel CLI, dashboard. No MCP integration.
- Owner: Anson
- Last verified: 2026-06-01

### Railway
- Purpose: deployment platform for some services.
- Status: aware
- Reach: dashboard. No MCP integration.
- Owner: Anson
- Last verified: 2026-06-01

### Supabase
- Purpose: managed Postgres + auth for selected projects.
- Status: aware
- Reach: project dashboards. No MCP integration.
- Owner: Anson
- Last verified: 2026-06-01

---

## Pending confirmation

These tools were not explicitly confirmed during `/onboard` and should be added or marked archived once Anson clarifies:

- IDE — VS Code, Cursor, or other?
- Task tracker — Linear, GitHub Issues, Todoist, or none?
- Notes — Notion, Obsidian, Apple Notes, or none?
- iMessage / Slack / Discord / LinkedIn DMs — which carry meaningful conversations?
