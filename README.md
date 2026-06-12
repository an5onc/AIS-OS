# AIS-OS

## Explain It Like I Am 5

This is a smart notebook for your AI helper.

Instead of making the AI forget everything every time you start a new chat, this notebook tells it:

- who you are
- what businesses you are building
- what matters right now
- how you like things written
- what tools you use
- what decisions have already been made
- what jobs the AI knows how to do

So when you ask for help, the AI does not start from zero. It can look in the notebook first, understand the situation, and help faster.

That is the whole idea.

## Plain-English Summary

AIS-OS is Anson Cordeiro's personal AI Operating System.

It is not a normal app. It is not a website. It is not a SaaS product yet.

It is a structured workspace that helps Claude Code, Codex, and future AI agents work with persistent context. The repo stores the operating manual, business context, skills, templates, brand assets, proposal drafts, decisions, and session handoffs that make the AI useful across time.

The goal is simple:

> Stop making the AI re-learn the same context every session.

This repo gives the AI a stable memory base and repeatable workflows. It helps Anson move faster across two businesses:

- **NexGen Studio**: digital-engineering studio for small businesses that need websites, software, portals, dashboards, and internal tools.
- **InterlockGo NOCO**: ignition-interlock service business in Northern Colorado with a custom software-supported operations stack.

The system started as a Nate Herk-style AIOS kit with the 3Ms and Four-Cs framework. It has since been personalized for Anson and expanded with software-engineering skills, session handoff rules, hooks, and a full NexGen proposal workflow.

## What This Project Is

AIS-OS is a Markdown-first operating system for AI-assisted work, with small isolated scripts where automation is useful.

It gives agents:

- persistent context
- clear source-of-truth files
- reusable skills
- decision history
- current priorities
- project handoff notes
- proposal templates
- brand references
- competitor research
- lightweight scripts for repeatable outputs

The main value is not the files by themselves. The value is the pattern:

1. Put important context in predictable places.
2. Teach the AI where to look.
3. Turn repeated work into reusable skills.
4. Keep decisions and sessions logged.
5. Build one useful automation at a time.

## What This Project Is Not

This repo is not:

- a deployed app
- a production web service
- a CRM
- a full proposal web app
- a replacement for Anson reviewing client-facing work
- a place to store secrets or API keys

Most of the repo is Markdown. The code currently present is scoped: Claude hook scripts, a proposal PDF renderer and tests, and a small Node-based Facebook social engine under `social/engine/`.

## How The Repo Is Organized

### Root Files

- `AGENTS.md`: project handoff for AI agents. Read this first when working on the repo.
- `CLAUDE.md`: Anson's operator persona. Read this when working for Anson or drafting in his voice.
- `README.md`: this plain-English overview.
- `EXPANSIONS.md`: current and future feature menu.
- `aios-intake.md`: original onboarding questions and raw intake source.
- `connections.md`: registry of tools the AIOS knows about or can reach.

### Context

- `context/about-me.md`: who Anson is and what he is trying to do.
- `context/about-business.md`: NexGen Studio and InterlockGo NOCO business context.
- `context/priorities.md`: current quarter priorities.
- `context/brands/`: brand-specific context, voice, content pillars, and image rules for social/content workflows.

### References

- `references/voice.md`: Anson's writing samples and voice rules.
- `references/3ms-framework.md`: Mindset, Method, Machine framework reference.
- `references/nexgen-offer.md`: NexGen Studio offer positioning.
- `references/nexgen-brand.md`: NexGen brand colors, logo rules, and contact info.
- `references/nexgen-pricing.md`: internal proposal pricing guidance.
- `references/competitors/noco-web-design.md`: Northern Colorado web design competitor research.

### Skills

Skills are reusable AI workflows.

Claude Code reads:

- `.claude/skills/<skill-name>/SKILL.md`

Codex reads:

- `.agents/skills/<skill-name>/SKILL.md`

The two trees are mirrored. When a skill is added or edited, both copies should match.

### Sessions

- `.sessions/SESSION_INDEX.md`: newest-first session index.
- `.sessions/YYYY-MM-DD-*.md`: detailed handoff notes from prior work sessions.
- `.sessions/TEMPLATE.md`: handoff template.

These files let a future AI agent pick up where the last session stopped.

### Decisions

- `decisions/log.md`: append-only decision history.

This prevents the same decisions from being re-argued every week.

### Proposal System

- `leads/`: structured lead briefs.
- `proposals/`: proposal drafts and final PDFs.
- `proposals/follow-ups/`: drafted follow-up messages.
- `templates/proposal.md`: reusable proposal structure.
- `templates/lead-brief.md`: reusable lead intake structure.
- `templates/proposal-follow-up.md`: reusable follow-up structure.
- `scripts/render_proposal_pdf.py`: branded PDF renderer.
- `tests/test_render_proposal_pdf.py`: renderer tests.

### Social Post System

- `context/brands/kiefer-built/`: Kiefer Built brand, voice, content pillars, and image strategy.
- `context/brands/interlockgo/`: InterlockGo brand, voice, content pillars, and image strategy.
- `social/_inbox/`: optional daily notes that override normal content rotation.
- `social/_templates/daily-posts-template.md`: review template for daily posts.
- `social/YYYY-MM-DD/posts.md`: earlier static generated draft posts, kept as historical/reviewable outputs.
- `social/engine/`: Node ESM generate -> review dashboard -> approve/publish/delete Facebook engine.
- `social/engine/secrets.env.example`: template for Page token config; the real `secrets.env` is gitignored.

### Brand Assets

- `brand-assets/nexgen/`: NexGen Studio logo/card assets and generated logo variants for PDFs.

## Features Already Built

### 1. Personal AIOS Foundation

The base system now has the core files needed for an AI assistant to understand Anson's work.

Built files include:

- `AGENTS.md`
- `CLAUDE.md`
- `context/about-me.md`
- `context/about-business.md`
- `context/priorities.md`
- `references/voice.md`
- `connections.md`
- `decisions/log.md`
- `.sessions/`

Why it matters:

Without these files, each AI session starts cold. With them, the AI can quickly understand Anson's businesses, priorities, voice, decisions, and current project state.

### 2. Persona vs. Project Separation

The repo now separates two different kinds of instructions:

- `AGENTS.md` is for working on the repo.
- `CLAUDE.md` is for working for Anson.

Why it matters:

Project rules and personal voice are different. Mixing them makes both weaker. This split lets agents know when they are editing the system versus when they are drafting or deciding on Anson's behalf.

### 3. Session Handoff System

The repo has a structured session handoff process.

Built files:

- `.sessions/SESSION_INDEX.md`
- `.sessions/TEMPLATE.md`
- `.sessions/2026-06-01-initial-setup.md`
- `.sessions/2026-06-03-proposal-builder.md`

What it does:

- records what changed
- records what passed verification
- records what is blocked
- lists next-session TODOs
- lets future agents start with context

Why it matters:

Long AI projects fail when context gets lost. Session files keep continuity across days, agents, and tools.

### 4. Decision Log

The decisions log records meaningful choices and the reasoning behind them.

Examples already logged:

- keep the 3Ms and Four-Cs framework
- run `/onboard`
- ship Phase 3 hooks
- build `/scaffold-next`
- build the proposal workflow

Why it matters:

Future Anson and future agents can see not just what happened, but why it happened.

### 5. Core Kit Skills

These are the original AIOS rhythm skills.

#### `/onboard`

Runs the initial intake and regenerates context/persona files.

Use it when:

- `aios-intake.md` changes
- the AIOS needs to refresh who Anson is
- business priorities or voice change

#### `/audit`

Runs a Four-Cs gap report.

Use it to check:

- Context
- Connections
- Capabilities
- Cadence

It answers: is this AIOS structurally healthy?

#### `/level-up`

Runs a weekly 3Ms interview to find one high-leverage automation.

It asks:

- where did manual work repeat?
- what should be eliminated, automated, or delegated?
- what is small enough to ship now?

It answers: what should the AIOS improve next?

### 6. Code Workflow Skills

These support Anson's software-engineering work.

#### `/review-diff`

House-rules code review for Anson's TypeScript, Next.js, Prisma, and full-stack projects.

It focuses on:

- bugs
- regressions
- missing tests
- risky patterns
- framework-specific issues

#### `/pr-desc`

Drafts pull request descriptions from diffs and commits.

It includes:

- summary
- why
- changes
- verification
- risk
- out-of-scope notes

#### `/commit-msg`

Generates Conventional Commit messages from staged changes.

It helps keep commits readable and consistent.

#### `/scaffold-next`

Scaffolds a new Next.js project with Anson's preferred defaults.

It covers:

- Next.js App Router
- TypeScript
- Tailwind
- Prisma
- environment validation
- auth options
- verification commands

Why it matters:

Starting new client projects was one of Anson's biggest repeated manual drags.

### 7. Project-Local Hooks

Hooks were added under `.claude/hooks/` and wired in `.claude/settings.json`.

#### Bash Guard

Blocks dangerous shell commands like:

- `rm -rf`
- `git reset --hard`
- force push
- destructive git clean commands

Why it matters:

It protects the workspace from accidental destructive tool calls.

#### Skill Integrity Check

Checks `SKILL.md` files after edits.

It helps catch:

- missing YAML frontmatter
- skill name mismatch
- `.claude` and `.agents` mirror drift

Why it matters:

The AIOS depends on skills being registered correctly.

#### Session Continuity Hook

Injects latest session context at session start.

Why it matters:

It helps new AI sessions start warm instead of cold.

### 8. NexGen Proposal Workflow

This is the largest feature built so far.

It turns a repeated NexGen Studio sales task into a reusable workflow:

1. capture rough lead notes
2. write a structured lead brief
3. draft the proposal
4. include competitor context
5. finalize a branded PDF
6. draft follow-up messages

#### `/lead-intake`

Turns messy client notes into a clean lead brief.

Inputs can be:

- rough text
- voice-dumped notes
- screenshots
- copied messages
- partial client info

Outputs:

- `leads/YYYY-MM-DD-client-name.md`

Why it matters:

Many leads start messy. This skill organizes the information before proposal writing.

#### `/proposal-builder`

Drafts a NexGen Studio proposal from client inputs and local market context.

It reads:

- business context
- voice rules
- NexGen offer notes
- competitor research
- proposal template
- pricing guidance

Outputs:

- `proposals/YYYY-MM-DD-client-name.md`

Why it matters:

It removes most of the repeated work around writing website/software proposals.

#### `/proposal-finalizer`

Turns proposal Markdown into a branded PDF.

It checks:

- price
- service area
- placeholders
- NexGen branding
- PDF text
- visual preview

Outputs:

- `proposals/client-name-branded.pdf`

Why it matters:

This converts a draft into something Anson can actually send.

#### `/competitor-refresh`

Refreshes competitor research before proposals.

It captures:

- competitor name
- location
- services
- public pricing
- add-ons
- timeline claims
- source links
- proposal tradeoffs

Why it matters:

Proposal research changes. Pricing and offers should be checked live before making claims.

#### `/proposal-follow-up`

Drafts follow-up messages after a proposal is sent.

It supports:

- email
- SMS
- same-day follow-up
- 2-day follow-up
- 1-week follow-up
- final check-in

Why it matters:

Sending the proposal is not the end. Follow-up turns proposals into signed work.

### 9. NexGen Brand System

NexGen proposal branding is now documented and stored.

Built references/assets:

- `references/nexgen-brand.md`
- `brand-assets/nexgen/nexgenlogo.png`
- `brand-assets/nexgen/nexgencard.png`
- generated cropped/clean logo variants

Brand rules include:

- NexGen blue
- NexGen cyan
- NexGen green accent
- header/footer rules
- PDF cover rules
- contact info

Why it matters:

Proposal PDFs should look like NexGen Studio, not random AI output.

### 10. NexGen Pricing Reference

`references/nexgen-pricing.md` now stores draft pricing guidance.

Current lanes:

- Website Refresh
- Custom Business Website
- Website + Operations Workflow
- Custom Software / Portal

Why it matters:

The AI should not invent prices. This file gives it a controlled reference and tells it when to ask Anson.

### 11. Competitor Research Notes

`references/competitors/noco-web-design.md` stores Northern Colorado web design competitor research.

It includes:

- public offer summaries
- public pricing
- add-ons
- source links
- NexGen proposal angles

Why it matters:

NexGen proposals can compare market options honestly without making unsupported claims.

### 12. Proposal Templates

Built templates:

- `templates/proposal.md`
- `templates/lead-brief.md`
- `templates/proposal-follow-up.md`

Why it matters:

Templates make outputs consistent and faster to generate.

### 13. Branded PDF Renderer

Built script:

- `scripts/render_proposal_pdf.py`

Test file:

- `tests/test_render_proposal_pdf.py`

What it does:

- parses Markdown proposal files
- extracts title/date/sections
- applies NexGen colors
- prepares logo assets
- creates a branded PDF
- wraps long cover titles
- keeps PDFs text-searchable

Why it matters:

The first branded proposal was hand-built. This script turns that into a repeatable workflow.

### 14. First Real Proposal

Built proposal:

- `proposals/2026-06-03-the-last-brush-llc.md`
- `proposals/2026-06-03-the-last-brush-llc-branded.pdf`

Client:

- The Last Brush LLC

Scope:

- three-page static website
- custom design
- homepage
- about/services page
- contact page
- mobile responsiveness
- SEO-friendly setup
- analytics
- ownership transfer

Why it matters:

This proved the proposal workflow with a real client-style use case.

### 15. Daily Social Post Workflow

Built skill:

- `/social-posts`

Built brand references:

- `context/brands/kiefer-built/brand.md`
- `context/brands/kiefer-built/voice.md`
- `context/brands/kiefer-built/content-pillars.md`
- `context/brands/kiefer-built/image-strategy.md`
- `context/brands/interlockgo/brand.md`
- `context/brands/interlockgo/voice.md`
- `context/brands/interlockgo/content-pillars.md`
- `context/brands/interlockgo/image-strategy.md`

What it started as:

- Markdown drafts for Facebook and Instagram captions.

What it is now:

- a Node social engine in `social/engine/`
- daily Facebook draft generation for KieferBuilt and InterlockGo
- brand-separated voice, content pillars, and image rules
- a local review dashboard at `http://localhost:4600`
- human-approved Facebook publish/delete through Meta Graph API
- local-image upload support through `social/engine/images/`
- launchd agents for the dashboard and 8 AM generation

Important rule:

Nothing should auto-publish. The engine can publish only after human approval in the dashboard or an explicit publish command.

Why it matters:

Daily social content is repetitive but still needs brand discipline. This skill turns it into a consistent review workflow without risking accidental publishing.

## Verification Already Done

Known verification from the session handoff:

- skill directory parity passed
- skill frontmatter checks passed
- skill `name` and `description` checks passed
- proposal-builder mirrors matched
- branded PDF generated
- PDF text checks passed
- cover preview rendered
- header/logo revisions checked visually
- cover rectangle issue fixed
- renderer unit tests passed
- renderer smoke PDF text check passed
- renderer long-title wrapping test passed
- `/social-posts` file tree exists
- `/social-posts` mirrored skill files match byte-for-byte
- today's social post dry run generated with no placeholders
- brand separation, image rules, sensitivity rules, and no-publish rules checked
- social engine JS syntax checks passed
- social engine shell syntax checks passed
- first real Facebook posts went live for both brands
- launchd generation and review agents were installed and verified on 2026-06-06
- local image upload transport was verified against InterlockGo without leaving a feed post

Renderer tests:

```sh
python3 -m unittest discover -s tests -p 'test_*.py' -v
```

Expected result:

```text
Ran 4 tests
OK
```

## Current Gaps

These are known unfinished areas.

### NexGen Pricing Needs Final Confirmation

The pricing reference has draft ranges, but Anson still needs to decide actual defaults.

Open items:

- Website Refresh default price
- Custom Business Website default price
- Website + Operations Workflow starting price
- maintenance/hosting retainer pricing

### The Last Brush LLC Proposal Needs Final Details

Still needed before sending:

- final price
- service area
- logo or brand colors
- phone/email/social links
- photos or testimonials
- domain preference

### Live Integrations Are Partial

The AIOS knows about tools like Gmail, GitHub, OpenPhone, Vercel, Fly.io, Railway, and Supabase, but most are not wired as MCP integrations yet.

Current status:

- Claude Code: connected
- Codex: connected
- Facebook Pages: wired locally for the social engine via `social/engine/secrets.env`
- OpenPhone: partial through existing InterlockGo production code
- Gmail: aware only
- GitHub: aware only
- deployments/storage tools: aware only

### Competitor Research Must Be Refreshed Before Sending Claims

Competitor pricing and offers can change.

Rule:

If a proposal mentions competitor pricing, run `/competitor-refresh` or browse live first.

### PDF Renderer Is Proposal-Specific

`scripts/render_proposal_pdf.py` is not a general document renderer. It is built for NexGen proposal Markdown.

### Social Posts Are Facebook-Only For Publishing

`/social-posts` now drives the Facebook review/publish engine, but it is still human-approved.

It does:

- generate Facebook drafts
- show a local review dashboard
- publish to Facebook after approval
- delete app-published Facebook posts

It does not:

- publish to Instagram
- auto-publish without approval
- make posts manageable inside Meta Business Suite "Manage posts"

Instagram support is still a future phase.

## Future Features Planned

### 1. OpenPhone Voicemail To SMS Drafts

Goal:

Turn InterlockGo voicemail or missed-call context into categorized SMS reply drafts.

Expected flow:

1. voicemail comes in
2. transcript is read
3. AI categorizes it
4. AI drafts a reply
5. Anson approves before sending

Why it matters:

This targets a major InterlockGo manual drag.

Blocked by:

- OpenPhone MCP or equivalent API integration
- API token/configuration
- clear send/approval rules

### 2. Gmail Inbox Triage

Goal:

Help Anson process NexGen and general email faster.

Possible outputs:

- priority inbox summary
- client reply drafts
- proposal follow-up reminders
- urgent vs. non-urgent sorting

Blocked by:

- Gmail MCP or approved email connector

### 3. GitHub PR Babysitter

Goal:

Monitor active PRs and issues across Anson's repos.

Possible outputs:

- PR status summary
- failing check summary
- stale PR reminders
- issue triage
- review comment summaries

Blocked by:

- GitHub MCP or reliable `gh` workflow

### 4. Calendar Meeting Prep

Goal:

Prepare useful briefs before client calls or business meetings.

Possible outputs:

- who the meeting is with
- related proposals
- related emails
- open questions
- recommended agenda
- follow-up tasks

Blocked by:

- calendar integration
- email/document integration for context

### 5. Weekly Metrics Snapshot

Goal:

Give Anson a weekly picture of what shipped and what moved.

Possible metrics:

- NexGen leads
- proposals drafted
- proposals sent
- signed projects
- GitHub commits
- InterlockGo lead volume
- OpenPhone missed calls/voicemails
- response latency

Blocked by:

- GitHub integration
- Gmail integration
- OpenPhone integration
- possibly dashboard data sources

### 6. Weekly Digest

Goal:

Summarize the week across both businesses.

Possible sections:

- what shipped
- what got stuck
- important decisions
- proposals/leads
- InterlockGo activity
- next week's focus

Could run manually first, then become scheduled later.

### 7. Daily Gmail Triage

Goal:

Produce a daily inbox action list.

Possible sections:

- reply now
- follow up
- delegate
- archive
- proposal opportunity
- InterlockGo issue

Blocked by:

- Gmail integration

### 8. Daily InterlockGo Voicemail Sweep

Goal:

Make sure no InterlockGo lead falls through the cracks.

Possible flow:

- scan OpenPhone
- identify voicemails/missed calls
- categorize
- draft replies
- flag urgent ones

Blocked by:

- OpenPhone MCP/API integration

### 9. `/debug-loop`

Goal:

Create a structured debugging ritual for code issues.

It would guide:

- symptom capture
- reproduction
- hypothesis list
- smallest test
- fix
- verification

Why it matters:

This helps avoid random debugging and over-patching.

### 10. `/repo-intake`

Goal:

Point the AIOS at a new repo and generate a useful project handoff.

Possible output:

- repo summary
- stack
- commands
- architecture notes
- testing instructions
- deployment notes
- agent rules

Why it matters:

Anson works across multiple codebases. Each one needs a good starting context.

### 11. Global Bash Guard

Goal:

Move the local destructive-command guard to global Claude Code settings.

Why it matters:

Right now the guard protects AIS-OS only. A global guard would protect all repos.

Risk:

It could block harmless commands that contain dangerous text in comments or examples, so it should be promoted carefully.

### 12. Per-Project Typecheck Hooks

Goal:

Add automatic typecheck/lint hooks to Anson's real TypeScript repos.

Why it matters:

AIS-OS is mostly Markdown, so typecheck hooks do not fit here. They do fit in real code projects.

### 13. Proposal Workflow UI

Goal:

Eventually turn the proposal workflow into a small app or dashboard.

Possible flow:

1. enter lead info
2. select package
3. refresh competitors
4. generate draft
5. edit proposal
6. render PDF
7. draft follow-up

Why it matters:

The current skill-based workflow works, but a UI could make it easier to use repeatedly.

### 14. Scheduled Competitor Refresh

Goal:

Refresh local competitor research weekly or monthly.

Possible outputs:

- updated pricing notes
- changed package alerts
- new competitor entries
- proposal angle updates

Blocked by:

- scheduled automation support
- browsing/research workflow

### 15. Client AIOS Productization

Goal:

Turn this pattern into a NexGen Studio service.

Possible offer:

Every client gets a lightweight AIOS for their business:

- context
- decisions
- SOPs
- tool registry
- repeatable AI workflows
- onboarding guide

Why it matters:

This could become a NexGen Studio differentiator, not just an internal tool.

### 16. Instagram Social Publishing

Goal:

Add Instagram support to the social engine.

Blocked by:

- IG Business account per Page
- image hosting or upload pipeline suitable for Instagram publishing
- approval rules matching the Facebook dashboard

### 17. Clean Template Repo

Goal:

Strip personal content and create a reusable starter template.

Would remove:

- Anson-specific business info
- private context
- proposal examples
- personal decisions

Would keep:

- folder structure
- skills
- templates
- setup instructions
- generic examples

### 18. Connector Library

Goal:

Create reusable connection guides for common tools.

Possible connectors:

- Gmail
- Google Calendar
- GitHub
- OpenPhone
- Vercel
- Supabase
- Notion
- Stripe

Why it matters:

Connections are what move the AIOS from "smart notebook" to "can actually do work."

## How To Use This Today

For NexGen proposal work:

1. Use `/lead-intake` if the client info is messy.
2. Use `/competitor-refresh` if market/pricing claims need to be current.
3. Use `/proposal-builder` to draft the proposal.
4. Use `/proposal-finalizer` to create the branded PDF.
5. Use `/proposal-follow-up` after sending.

For daily social content:

1. Check or edit brand context under `context/brands/`.
2. Run `/social-posts` or `cd social/engine && node generate.js`.
3. Review drafts at `http://localhost:4600`.
4. Edit, approve/post, reject, or delete from the dashboard.
5. Drop local photos into `social/engine/images/` and set `imagePath` on a draft when needed.

For software project work:

1. Use `/scaffold-next` to start a new client app.
2. Use `/review-diff` after changes.
3. Use `/pr-desc` before opening a PR.
4. Use `/commit-msg` before committing.

For AIOS growth:

1. Use `/audit` weekly.
2. Use `/level-up` weekly.
3. Build one new automation at a time.
4. Log meaningful decisions in `decisions/log.md`.
5. Keep session handoffs current.

## Big Picture

This AIOS is becoming three things at once:

1. **A personal operating system for Anson**
   - remembers context
   - tracks decisions
   - keeps priorities visible
   - helps AI sessions start faster

2. **A business-growth engine for NexGen Studio**
   - handles lead intake
   - drafts proposals
   - researches competitors
   - creates branded PDFs
   - drafts follow-ups
   - drafts daily social posts

3. **A prototype for a future client offering**
   - the same structure could help other small businesses organize their AI workflows
   - the proposal system itself could become part of NexGen's service package

The current system is still early, but it already has the foundation: context, skills, handoffs, proposal generation, PDF rendering, and a roadmap for live integrations.

The next major step is connecting real tools like Gmail, OpenPhone, GitHub, and Calendar so the AIOS can work from live data instead of only local Markdown files.
