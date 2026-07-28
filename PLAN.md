# Plan

## Overview
Public-facing showcase app for AI-powered project(s), using own LLM API key, migrating away from a local Docker-based dev stack over time.

Task tracking (status, progress, checklists) lives in GitHub Issues/Milestones. This document covers technology choices, architecture decisions, and open questions only.

## Contents
- [Stack Comparison](#stack-comparison)
- [Stage 1: Local AI Development](#stage-1-local-ai-development)
- [Stage 2: OpenRouter Creation](#stage-2-openrouter-creation)
- [Stage 3: Presentation Branch](#stage-3-presentation-branch)
- [Stage 4: Key Addition](#stage-4-key-addition)
- [Stage 5: RAG Hosting](#stage-5-rag-hosting)
- [Stage 6: MCP Hosting](#stage-6-mcp-hosting)
- [Stage 7: Portfolio Integration](#stage-7-portfolio-integration)
- [Migration Path](#migration-path-stage-1--cutover)
- [Open Decisions](#open-decisions)
- [Cost Snapshot](#cost-snapshot-current-scale-10-occasional-users)

## Stack Comparison

| Layer | Current Stack (Stage 1) | Planned Stack (Stages 2–7) |
|---|---|---|
| Frontend/UI | OpenWebUI | Next.js + Vercel AI SDK |
| Model access | Ollama (local inference) | OpenRouter |
| Hosting | Docker (private server) | Vercel |
| Network | Tailscale (private only) | Public internet |
| Key management | `.env` (Docker) | Vercel env vars (sensitive) |
| RAG | OpenWebUI built-in RAG | Supabase (pgvector), Pinecone, or RAGFlow |
| MCP | Local/private | Cloudflare Workers |
| Access | Private, personal only | Public, portfolio-linked |

---

## Stage 1: Local AI Development
*(existing, private instance — baseline, no changes needed)*

| Technology | Purpose |
|---|---|
| Ollama | Local model inference |
| OpenWebUI | Chat/RAG sandbox UI |
| Docker | Container runtime |
| Tailscale | Private network access |

---

## Stage 2: OpenRouter Creation

| Technology | Purpose |
|---|---|
| OpenRouter | LLM API aggregator — test multiple models, commit later |

Keep Stage 1 and Stage 2 credentials separate unless a shared-credential approach is deliberately adopted.

---

## Stage 3: Presentation Branch

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router, TypeScript, Tailwind v4) | Frontend, scaffolded into `web/` (not repo root) |
| Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/openai`) | Model calls, streaming, chat UI |
| lucide-react | Icon set |
| Git branch: `next` | Dev branch, target Vercel Production Branch |

Sign-in deferred — needs its own auth planning pass.

Not yet mobile-responsive — current layout is fixed-width desktop only (side-nav + chat panel side-by-side); needs a dedicated pass (breakpoints, collapsible/stacked layout on small screens) before public launch.

---

## Stage 4: Key Addition

| Technology | Purpose |
|---|---|
| Vercel Env Vars (`sensitive`) | OpenRouter key storage |
| Next.js API routes | Server-side calls only, key never exposed client-side |

---

## Stage 5: RAG Hosting

**Local testing → production mapping:**

| | Local (testing) | Production |
|---|---|---|
| **General vector search** | ChromaDB — Machine 1 (OpenWebUI) | Supabase (pgvector) or Pinecone — cloud |
| **RAGFlow** | Self-hosted — Machine 2 (freed from Ollama), exposed to Machine 1 via Tailscale | RAGFlow Cloud — managed, already public |

**Note:** Tailscale is sufficient for Machine 1 ↔ Machine 2 testing since both are on the same tailnet. If self-hosted RAGFlow is later attached to the Next.js frontend (Vercel), that's off the tailnet — a Cloudflare Tunnel exposing just the RAGFlow endpoint will be needed at that point (Vercel serverless functions cannot join a tailnet directly).

### Candidate Backends

*(open decision — four candidates below)*

| Technology | Type | Use Case | Notes |
|---|---|---|---|
| OpenWebUI native (ChromaDB) | Built-in | Baseline/sandbox — already running, no setup needed | Local SQLite-backed; not safe with multiple workers; tied to OpenWebUI, not reusable by other apps |
| Supabase (pgvector) | Managed | Simple semantic search alongside existing relational data; good if the app already needs a DB | Free tier; 7-day idle auto-pause risk |
| Pinecone | Managed | Pure vector search at larger scale, ops-simplicity priority over complex parsing | Free tier; no pause, but $50/mo minimum once off free tier |
| RAGFlow | Cloud or self-hosted | Complex documents (tables, scanned PDFs, slide decks) needing citation-grounded answers | Deep document parsing (tables, scans, OCR) |

**RAGFlow — Cloud vs. self-hosted:**

| | RAGFlow Cloud | Self-hosted (private server) |
|---|---|---|
| Cost | Free tier: 100MB storage, 500 pages/mo parsing. Beyond that: $59/mo (5GB, 5K pages) | $0 license (Apache 2.0) — only infra cost |
| Hardware | None needed | 16GB+ RAM, 4+ cores, 50GB+ disk required |
| Setup | Account signup, API key | Docker Compose stack (Elasticsearch, MySQL, MinIO, Redis) — heavier than OpenWebUI's current RAG |
| Data location | Third-party (InfiniFlow) | Stays on private server |
| Network path to public Next.js app | Direct — public API endpoint already exists | Needs exposure (Cloudflare Tunnel recommended) since app calls out from Vercel to the private server |
| Maintenance | None — managed | Updates, backups, uptime owned locally |
| Risk of hitting limits | Free tier's 500 pages/mo could be tight depending on document volume | No usage caps, just hardware limits |

**Note:** RAGFlow Cloud pricing is currently in a beta/promo period (PDF parsing billed, other formats temporarily free) — no published end date for the promo.

**Recommendation:** unless deep document parsing is core to the showcase, Supabase or Pinecone stay the simpler/cheaper picks. If RAGFlow is chosen for its parsing quality, RAGFlow Cloud's free tier is the simpler path at this scale — no server changes, no tunnel setup, no added load on the private server. Self-hosting is worth it if documents can't leave the infrastructure or usage will exceed the 500-page/mo parsing cap.

**Document/upload storage:** the Docs page's uploaded files currently live in browser localStorage (stopgap, no backend yet). Vercel's serverless functions have no persistent disk, so this needs a real storage service, not just "a folder in the app":
- **Vercel Blob** or **Supabase Storage** — least new-vendor overhead if paired with the RAG backend chosen above.
- **Cloudflare R2 / AWS S3** — vendor-independent object storage.
- **RAGFlow** — handles storage internally as part of its own ingestion pipeline if that path is chosen; no separate storage service needed.

---

## Stage 6: MCP Hosting

| Technology | Purpose |
|---|---|
| Cloudflare Workers | Edge-hosted MCP servers, 100K req/day free tier |

### EV Databases

| Category | Tool/API | Notes |
|---|---|---|
| Charging station data (free, official) | NLR Alternative Fuel Station API (formerly NREL — domain migrated to `developer.nlr.gov`, `developer.nrel.gov` retired May 29, 2026) | 88K+ US stations, free API key, EV networks/connector types/pricing |
| EPA fuel economy/range data (free, official) | fueleconomy.gov data | MPGe, official EPA range, efficiency, CO2 |
| Vehicle specs (commercial) | API Ninjas Electric Vehicle API | Simple REST, range/battery/charging/performance fields, cheap tier |
| Vehicle specs (commercial, deeper) | VehicleDatabases EV Specs API | More granular battery/charging detail, paid credits |
| Vehicle specs (community-sourced) | EV Database (ev-database.org) | Comprehensive spec/pricing data; API access requires contacting sales (registered companies only), not self-serve |
| Route/consumption modeling | NLR RouteE Powertrain / RouteE Compass, EVI-Pro | Energy-aware routing and charging-need modeling — relevant for real-world range vs. spec-sheet range |

Structured data (range, battery, charging speed) from these sources is best rendered as charts/tables in the UI; unstructured content (reviews, owner reports, manufacturer docs) goes through RAGFlow for cited answers instead.

### MCP Tools — OpenWebUI (sandbox)

OpenWebUI supports connecting to external MCP-compatible tool servers. Since OpenWebUI is the sandbox environment until production launch, wire EV data tools here first to validate them before porting to the production Next.js app.

### MCP Tools — RAGFlow

RAGFlow ships an official MCP server for exposing retrieval as a tool (`ragflow_retrieval_tool`, dataset/chat management tools) — no custom build needed for the RAG-querying use case. Note: bind to `localhost` only if running without public exposure planned yet, since MCP auth is still API-key-based rather than a hardened auth standard.

---

## Stage 7: Portfolio Integration

| Technology | Purpose |
|---|---|
| GitHub Pages | Static redirect page only (cannot host app/hide keys) |
| Vercel URL | Actual showcase app destination |

---

## Migration Path (Stage 1 → Cutover)

Stage 1 (OpenWebUI/Docker) remains the working dev environment throughout Stages 2–7 — no changes required to it during the build-out. Once the `next` branch app is feature-complete and tested in production on Vercel, cut over by merging `next` → `main` and re-pointing Vercel's Production Branch (or keep `next` as the permanent deploy branch — undecided). Post-cutover, decide whether to decommission the OpenWebUI/Docker stack or keep it running as a personal sandbox (undecided either way), and rotate the OpenRouter key if it was ever exposed in a non-sensitive var or shared across environments during development.

## Open Decisions
- [ ] RAG backend: Supabase vs. Pinecone vs. RAGFlow (Cloud or self-hosted)
- [ ] If RAGFlow self-hosted: Cloudflare Tunnel setup for the RAGFlow endpoint
- [ ] Whether/when Next.js and OpenWebUI share API/network access before full cutover
- [ ] Timeline for `next` → `main` cutover
- [ ] Whether to keep OpenWebUI running post-cutover or decommission it

## Cost Snapshot (current scale, <10 occasional users)
- Vercel: $0 (Hobby — non-commercial use only)
- OpenRouter: pay-as-you-go, negligible at this volume
- Supabase, Pinecone, or RAGFlow: $0 (free tier); RAGFlow self-hosted: $0 license (existing infra)
- Cloudflare Workers: $0 (free tier)
