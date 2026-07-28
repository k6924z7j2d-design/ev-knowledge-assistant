# EV Knowledge Assistant & Dashboard

A self-hosted AI assistant for electric vehicle research — grounded in owner manuals, NHTSA safety data, and manufacturer specifications, connected to live EV data APIs, and guided through research and comparison workflows by structured skills.

**Goal**: Build a knowledge assistant that answers questions about electric vehicles using curated, up-to-date sources: manufacturer spec sheets, NHTSA safety reports and recalls, owner manuals, and charging infrastructure data. The same architecture that grounds AI agents in proprietary documentation (RAG + MCP + Agent Skills) applied to the EV domain, running entirely on self-hosted hardware.

---

## Technology Decisions

| Layer | Component | Status | Notes |
|-------|-----------|--------|-------|
| **Inference** | vLLM | Decided | High-throughput GPU serving with PagedAttention |
| **Fine-tuning hardware** | DGX Spark | Decided | — |
| **Model** | Llama 3.2 | Evaluating | Considering Gemma 4 27B/31B (MoE) |
| **RAG pipeline** | ChromaDB + nomic-embed-text | Evaluating | Document grounding for EV specs and owner manuals |
| **Tool interface** | MCP (FastMCP / SSE) | Evaluating | Translation layer between LLM and EV data APIs |
| **Agent Skills** | SKILL.md format | Evaluating | EV research and comparison workflows |
| **GPU efficiency** | — | Open | CPU offloading, Flash Attention, MoE, containerized subagents |
| **Pre-processing** | — | Open | JSON normalization pipeline for ingested EV documents |

---

## Documentation

| Doc | What it covers |
|-----|---------------|
| [EV.md](local/docs/EV.md) | EV domain: data sources, learning roadmap, domain concepts |
| [Setup.md](local/docs/Setup.md) | Prerequisites, configuration, deployment workflow, troubleshooting |
| [Tailscale-Remote-Access.md](local/docs/Tailscale-Remote-Access.md) | Tailscale SSH + Portainer remote access for the split-node setup |
