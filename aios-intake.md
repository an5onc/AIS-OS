# AIOS Intake

Answer the seven questions below. Then run `/onboard` and the operator (Claude / Codex) will rewrite `AGENTS.md`, `CLAUDE.md`, `context/*`, `references/voice.md`, and `connections.md` from your answers.

Keep answers blunt. Bullets over prose. The richer the input, the better the personalization.

---

## Q1. Who are you and what do you do?

Cover: name, role, what business or work you run (or want to run), who you serve, what makes you different.

> See `Resume.pdf` (Anson Cordeiro). Summary distilled from resume:
> - **Name:** Anson Cordeiro
> - **Role:** Full-Stack Software Engineer
> - **Education:** B.S. Computer Software Engineering, University of Northern Colorado, GPA 3.5, May 2026 (just graduated as of session date 2026-06-01)
> - **Prior career:** U.S. Army Aviation Maintenance / Technical Inspector / Supervisor (AH-64), 2004-2016 — 11+ years.
> - **Businesses:**
>   - **NexGen Studio** (`n3xg3nstudio.com`) — founder & lead engineer. Digital-engineering studio building production software, websites, and internal tools for small businesses. Started March 2026.
>   - **InterlockGo NOCO** (`interlockgo.io`, Kawika Capitol Ltd LLC) — founder/owner since May 2023. Ignition-interlock service company in Northern Colorado. Built the full software stack that runs the business.
> - **Stack:** TypeScript, JavaScript, Python, Java, C#, Swift, SQL, Shell, Go / React, Next.js, Vite, Tailwind, Framer Motion / Node, Express, Prisma, PostgreSQL, MySQL, SQLite, Supabase, Zod / Git/GitHub, Puppeteer, Fly.io, Vercel, Railway, Jupyter, iOS / LLM fine-tuning.
> - **What makes you different:** Ships production systems end-to-end across the full stack, including software that runs your own business day to day. Turns messy real-world workflows into clean, maintainable software. Military background = rigor and dependability.

---

## Q2. Voice samples

Paste 2-3 raw chunks of your own writing. Anything you've shipped — emails, LinkedIn posts, journal entries, Slack messages, notes to a coworker. Unedited is better than polished.

### Sample 1

> I sent you an email earlier this week about the rough draft and how I have it saved awaiting pictures of the recent job. If text is fine then I can post it however it wouldn’t look as appealing next to the kitchen and remodel options with pictures. I can possibly meet next week, Tuesday afternoon after my exam around 3. Please let me know if that works.

### Sample 2

> not sure if the one i sent you had the slogan on the bottom but i noticed it while i was edited mark and mindys so i did yours also 

### Sample 3

> (Optional — Samples 1 and 2 are sufficient. Add another later if voice drifts.)

---

## Q3. What are your 2-3 biggest priorities this quarter?

Cover: the outcome, why it matters, the deadline if any.

1. Market Interlockgo-NOCO, build the brand and become the #1 provider for interlock services across Greeley and local surrounding areas
2. Build and push Nexgen Studios, already graduated, now its time to do some real project building to grow the brand 


---

## Q4. How do you measure success / make money?

Cover: revenue model (if business), metrics you watch, the dashboard or place where the truth lives.

> **Pending — operator to fill.** Inferred from resume:
> - Two revenue streams: NexGen Studio (client project work) + InterlockGo NOCO (ignition-interlock services).
> - Specific metrics dashboard not yet defined. Recommend defining: (a) NexGen Studio — leads/month, signed clients, MRR or project value shipped, (b) InterlockGo NOCO — new clients/month, retention, share-of-Greeley.

---

## Q5. Where do conversations happen?

List the comms tools you live in — email, Slack, Discord, iMessage, WhatsApp, LinkedIn DMs, etc. Note which carry the most important conversations.

> Known + inferred (mark `verified` once operator confirms):
> - **Gmail** — primary email. Verified.
> - **OpenPhone** — business phone/SMS for InterlockGo NOCO. Verified (you wire it via OpenPhone API per resume).
> - **iMessage** — assumed personal. Pending confirmation.
> - Slack / Discord / LinkedIn DMs — pending confirmation.

---

## Q6. Where does work get done and tracked?

List the work systems — IDE, terminal, GitHub, Linear/Jira, Notion, calendar, CRM, design tools, whatever. Note which one is the "source of truth" for tasks.

> Known + inferred:
> - **Claude Code** + **Codex** — primary AI dev environment. Verified.
> - **GitHub** (`github.com/an5onc`) — code hosting. Verified.
> - **Fly.io**, **Vercel**, **Railway** — deployment platforms across projects. Verified.
> - **Supabase** — used in some projects. Verified.
> - IDE (VS Code / Cursor / other) — pending confirmation.
> - Task tracker (Linear, GitHub Issues, Todoist, none) — pending confirmation. Currently no task tracker noted; `.sessions/` may be functioning as the de facto source of truth.
> - Notes (Notion, Obsidian, Apple Notes, none) — pending confirmation.

---

## Q7. What's the most annoying repetitive task in your week?

The thing that drains energy, that you'd hand off first if you could. Be specific. What tool is it in? Roughly how often? What would "solved" look like?

> Two named:
> 1. **Scaffolding new Next.js apps from scratch every time.** Every new NexGen Studio client project starts from zero — repo, configs, Tailwind setup, auth scaffold, Prisma schema patterns, layout primitives. "Solved" looks like: one command (or one slash skill) that produces a project shell matching your conventions, with the boilerplate you'd write anyway already in place. Tool: Claude Code / Codex on a fresh GitHub repo.
> 2. **Phone / voicemail triage for InterlockGo NOCO.** Checking voicemails and returning phone calls is a daily drag. Idea: incoming voicemails get auto-transcribed and triaged, with a draft text-message reply prepared (using OpenPhone API which you already use for SMS). "Solved" looks like: voicemail comes in → transcribed → categorized (new lead vs. existing client vs. spam) → a draft SMS reply ready for one-tap send. This is a Phase 4 integration task — not addressed this session, queued in `EXPANSIONS.md` Tier 4.

---

## After filling this in

Run `/onboard`. The operator will:
1. Replace placeholders in `context/about-me.md`, `context/about-business.md`, `context/priorities.md`, `references/voice.md`.
2. Populate the Knowledge Base + Connections sections in `CLAUDE.md` (the operator persona). `AGENTS.md` is the project handoff and is NOT a persona mirror — it is left alone.
3. Stub entries in `connections.md` for each tool you mentioned.
4. Append a "/onboard run" entry to `decisions/log.md`.
