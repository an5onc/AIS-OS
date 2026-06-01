# About Business

Two active businesses. The AIOS supports both.

---

## NexGen Studio

`n3xg3nstudio.com` · Founded March 2026

### Offer

Digital-engineering studio. Production software, websites, and internal tools for small businesses that need more than a template. Full-stack engagements — scope, architecture, build, deploy, maintain.

### Ideal Customer

Small businesses (local service companies, contractors, owner-operators) who have outgrown Squarespace / Wix templates and need real software — authenticated admin areas, document workflows, integrations, custom dashboards.

### Proof of work

- **BuiltbyKiefer** — live client website + ops platform for a construction contractor. ~34,000 LOC. Authenticated admin area, secure document workflows, branded invoice-PDF generation.

### Stack

Next.js / React / TypeScript, Tailwind, Prisma, PostgreSQL or Supabase, deployed on Vercel or Fly.io.

### Revenue Model

Project-based client work. Specific pricing and metrics dashboard still pending (Q4 in intake).

---

## InterlockGo NOCO (Kawika Capitol Ltd LLC)

`interlockgo.io` · Founded May 2023 · Evans, CO

### Offer

Ignition-interlock service company serving Northern Colorado (Greeley and surrounding areas). Install, monitor, and service vehicle interlock devices for DUI/DWI-required drivers.

### Ideal Customer

Drivers in Northern Colorado required to use an ignition-interlock device, plus the courts and providers that refer them.

### Proof of work (self-built software stack)

- **Internal ops dashboard** (Express, SQLite, React, Puppeteer) — automates client scheduling, SMS reminders via OpenPhone API, and provider-portal syncing via headless-Chrome scraping. ~17,000 LOC.
- **Technician app** (Next.js 15, Prisma, PostgreSQL on Fly.io) — searchable year/make/model/trim wiring database with phone-OTP auth and admin moderation. ~18,000 LOC.
- **`interlockgo.io`** — multi-city marketing site with SEO landing pages. 770+ commits, live in production.

### Revenue Model

Service revenue per interlock client (install + monthly monitoring + service calls). Specific metrics dashboard still pending (Q4 in intake).

### Strategic priority

Become the #1 interlock provider in Greeley and surrounding areas. Marketing and brand-building is priority #1 for the quarter.

---

## Revenue Model And Tracking — combined

Two revenue streams running in parallel. No unified dashboard yet. Recommended metrics to track per business (added to `EXPANSIONS.md` Tier 2 as a `/metrics-weekly` skill candidate):

- **NexGen Studio:** leads / month, signed clients / month, project value shipped, MRR if any maintenance retainers.
- **InterlockGo NOCO:** new clients / month, retention, share-of-Greeley estimate, voicemail-to-callback latency.

The truth lives in: GitHub commits (what shipped), OpenPhone (lead inflow for InterlockGo), and email (NexGen Studio leads). Wire these together when Phase 4 (MCP integrations) lands.
