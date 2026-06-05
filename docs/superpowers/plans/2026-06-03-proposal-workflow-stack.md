# Proposal Workflow Stack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full NexGen proposal workflow: lead intake, proposal drafting, branded PDF finalization, competitor refresh, and follow-up drafting.

**Architecture:** Keep the AIOS surface skill-driven. Skills orchestrate Markdown inputs/outputs, references hold stable NexGen brand/pricing rules, templates hold reusable artifacts, and `scripts/render_proposal_pdf.py` provides deterministic PDF generation for proposal finalization.

**Tech Stack:** Markdown skills, Python 3, ReportLab, Pillow, pypdf for verification.

---

### Task 1: Renderer Tests

**Files:**
- Create: `tests/test_render_proposal_pdf.py`

- [x] Write failing tests for slug generation, proposal extraction, and PDF creation.
- [x] Run tests and confirm they fail because `scripts/render_proposal_pdf.py` does not exist yet.

### Task 2: Renderer Implementation

**Files:**
- Create: `scripts/render_proposal_pdf.py`

- [x] Implement Markdown proposal parsing, brand image preparation, PDF rendering, and CLI arguments.
- [x] Run renderer tests and confirm they pass.
- [x] Generate a branded PDF from the existing Last Brush proposal as a smoke test.

### Task 3: Workflow Skills And References

**Files:**
- Create mirrored skills:
  - `.claude/skills/proposal-finalizer/SKILL.md`
  - `.agents/skills/proposal-finalizer/SKILL.md`
  - `.claude/skills/competitor-refresh/SKILL.md`
  - `.agents/skills/competitor-refresh/SKILL.md`
  - `.claude/skills/proposal-follow-up/SKILL.md`
  - `.agents/skills/proposal-follow-up/SKILL.md`
  - `.claude/skills/lead-intake/SKILL.md`
  - `.agents/skills/lead-intake/SKILL.md`
- Create:
  - `references/nexgen-brand.md`
  - `references/nexgen-pricing.md`
  - `templates/lead-brief.md`
  - `templates/proposal-follow-up.md`

- [x] Add all skills with YAML frontmatter and operational steps.
- [x] Add brand/pricing references and templates.
- [x] Update `/proposal-builder` to hand off to intake/finalizer.

### Task 4: Documentation And Handoff

**Files:**
- Modify: `CLAUDE.md`
- Modify: `AGENTS.md`
- Modify: `EXPANSIONS.md`
- Modify: `decisions/log.md`
- Modify: `.sessions/2026-06-03-proposal-builder.md`

- [x] Register new skills in persona/project command docs.
- [x] Mark proposal workflow features shipped in `EXPANSIONS.md`.
- [x] Append a decision log entry.
- [x] Update the active session handoff.

### Task 5: Verification

- [x] Run renderer unit tests.
- [x] Run PDF smoke test and text checks.
- [x] Run skill parity checks.
- [x] Run skill frontmatter/name/description checks.
- [x] Run `git status --short`.
