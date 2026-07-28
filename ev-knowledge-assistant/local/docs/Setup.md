# Project Setup Guide

## Overview

A split-node, self-hosted AI stack. Inference runs on a dedicated MacBook, while all application services (UI, MCP, database, file server) run in Docker on a Mac mini. Both machines communicate over a private Tailscale network. The end user interacts through Open Web UI.

---

## Architecture

```
[User]
  │
  ▼
[Mac mini — Application Node]
  ├── Open Web UI          (chat interface / frontend)
  ├── MCP File Server      (filesystem access for the model)
  ├── MCP SQLite Server    (structured data / tool memory)
  └── ChromaDB (planned)   (vector store for RAG / embeddings)
        │
        │ Tailscale (private network)
        ▼
[MacBook — Inference Node]
  └── Ollama               (LLM API server)
```

---

## Machine Roles

### MacBook — Inference Node
- Runs **Ollama** only
- Exposes the Ollama API (`/api`) over Tailscale
- No Docker (removed during setup)
- Tailscale provides a stable private IP/hostname for the mini to reach it

### Mac mini — Application Node
- Runs **Docker Desktop** (Docker runtime)
- **Portainer CE** for container management UI — runs standalone from its own `~/portainer/docker-compose.yml`, independent of the ai-stack so it stays manageable even if the ai-stack is down
- All ai-stack services managed via a single `docker-compose.yml`
- Persisted volumes for database and file data
- Open Web UI connects to Ollama on the MacBook via Tailscale

---

## Tech Stack

| Component | Tool | Node |
|---|---|---|
| LLM Inference | Ollama | MacBook |
| Docker Runtime | Docker Desktop | Mac mini |
| Container Management | Portainer CE (standalone, `~/portainer/`) | Mac mini |
| Frontend / Chat UI | Open Web UI | Mac mini |
| File Access (MCP) | `@modelcontextprotocol/server-filesystem` | Mac mini |
| Database (MCP) | `mcp-sqlite` | Mac mini |
| Vector Store (planned) | ChromaDB + ChromaDB Admin | Mac mini |
| Private Networking | Tailscale | Both |

---

## Setup Guide

### Phase 1 — MacBook (Inference Node)

#### 1.1 Remove Docker
If Docker Desktop was installed:
```bash
# Remove app and data
rm -rf ~/.docker
rm -rf ~/Library/Containers/com.docker.docker
rm -rf ~/Library/Application\ Support/Docker\ Desktop
```

If installed via Homebrew:
```bash
brew uninstall docker
brew uninstall docker-compose
```

#### 1.2 Install Ollama
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

#### 1.3 Configure Ollama to Accept Remote Connections
By default Ollama only listens on `localhost`. To accept connections from the mini over Tailscale, set the bind address:

```bash
# Create or edit the Ollama service config
launchctl setenv OLLAMA_HOST "0.0.0.0"
```

Or set it persistently in a launchd plist if running Ollama as a service.

> ⚠️ Ollama has **no authentication** by default. Since this is on Tailscale (private network), this is acceptable for a PoC — but do not expose this to the public internet.

#### 1.4 Install Tailscale
- Download from [tailscale.com](https://tailscale.com/download)
- Sign in and connect to your tailnet
- Note the Tailscale IP or hostname assigned to the MacBook — you'll need it for the mini's config

#### 1.5 Pull a Model
```bash
ollama pull llama3.2
# or whichever model you intend to use
```

#### 1.6 Verify
```bash
curl http://localhost:11434/api/tags
```
Should return a JSON list of installed models.

---

### Phase 2 — Mac mini (Application Node)

#### 2.1 Install Docker Desktop
The Mac mini runs macOS Monterey (12), which requires a specific older version.
Download Docker Desktop **4.41.2** (last version supporting macOS 12) directly:

- [Mac with Intel chip](https://desktop.docker.com/mac/main/amd64/191736/Docker.dmg)

> ⚠️ Do not allow Docker Desktop to auto-update. Version 4.42+ requires macOS Ventura (13.3) and will break on this machine. Disable automatic updates in Docker Desktop → Settings → Software Updates.

Docker Desktop includes the Docker engine, `docker compose`, and a GUI dashboard.

Verify:
```bash
docker --version
docker compose version
```

#### 2.2 Install Tailscale
Same as MacBook — install, sign in, connect to the same tailnet.

Verify connectivity to the MacBook:
```bash
ping <macbook-tailscale-hostname>
# or
curl http://<macbook-tailscale-ip>:11434/api/tags
```

#### 2.3 Project Directory Structure
```
~/ai-stack/
├── docker-compose.yml
├── .env
├── data/
│   ├── sqlite/        # SQLite database files
│   ├── files/         # Files exposed to MCP file server
│   └── open-webui/    # Open Web UI persistent data

~/portainer/
└── docker-compose.yml   # standalone Portainer, kept separate (see 2.5a)
```

```bash
mkdir -p ~/ai-stack/data/{sqlite,files,open-webui}
cd ~/ai-stack
```

#### 2.4 Environment File
Create `~/ai-stack/.env`:
```env
OLLAMA_BASE_URL=http://<macbook-tailscale-ip>:11434
WEBUI_SECRET_KEY=changeme-use-a-real-secret
```

Replace `<macbook-tailscale-ip>` with the actual Tailscale IP or MagicDNS hostname of the MacBook.

#### 2.5 Docker Compose
Create `~/ai-stack/docker-compose.yml`:

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    restart: unless-stopped
    ports:
      - "3000:8080"
    environment:
      - OLLAMA_BASE_URL=${OLLAMA_BASE_URL}
      - WEBUI_SECRET_KEY=${WEBUI_SECRET_KEY}
    volumes:
      - ./data/open-webui:/app/backend/data
    depends_on:
      - mcp-filesystem
      - mcp-sqlite

  mcp-filesystem:
    image: node:20-alpine
    container_name: mcp-filesystem
    restart: unless-stopped
    working_dir: /app
    command: npx -y @modelcontextprotocol/server-filesystem /mnt/files
    volumes:
      - ./data/files:/mnt/files

  mcp-sqlite:
    image: node:20-alpine
    container_name: mcp-sqlite
    restart: unless-stopped
    working_dir: /app
    command: npx -y mcp-sqlite /mnt/db/main.db
    volumes:
      - ./data/sqlite:/mnt/db

networks:
  default:
    name: ai-stack
```

#### 2.5a Portainer (standalone)
Portainer is kept out of the ai-stack compose file — it manages the whole Docker host (including the ai-stack containers), so it shouldn't go down or come up with that stack's lifecycle. It lives in its own directory: `~/portainer/docker-compose.yml`:

```yaml
services:
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    restart: unless-stopped
    ports:
      - "9000:9000"
      - "9443:9443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer-data:/data

volumes:
  portainer-data:
```

```bash
cd ~/portainer
docker compose up -d
```

> ℹ️ Portainer mounts the Docker socket (`/var/run/docker.sock`) so it can manage all containers on the host. It will be accessible at `http://localhost:9000` (HTTP) or `https://localhost:9443` (HTTPS). First launch prompts you to create an admin account — do this within the first few minutes or Portainer locks down for security.

#### 2.6 Start the Stack
```bash
cd ~/ai-stack
docker compose up -d
```

Check all containers are running:
```bash
docker compose ps
```

Check Open Web UI logs:
```bash
docker compose logs -f open-webui
```

#### 2.7 Access Open Web UI
Navigate to `http://localhost:3000` in a browser on the mini, or from another device on your network at `http://<mini-local-ip>:3000`.

First launch will prompt you to create an admin account.

---

### Phase 3 — Connect Open Web UI to Ollama

1. Log into Open Web UI
2. Go to **Settings → Connections**
3. Set the Ollama URL to the value in your `.env`: `http://<macbook-tailscale-ip>:11434`
4. Click **Verify** — it should confirm a successful connection
5. Your models from Ollama should now appear in the model selector

---

### Phase 4 — Connect MCP Servers to Open Web UI

Open Web UI supports MCP via its **Tools** interface. The exact steps depend on the Open Web UI version, but generally:

1. Go to **Settings → Tools**
2. Add each MCP server endpoint
3. Enable the tools per conversation or globally

> ⚠️ Open Web UI's MCP integration is still maturing. Check the current docs at [docs.openwebui.com](https://docs.openwebui.com) for the latest connection method (SSE vs stdio transport may affect how you configure this).

---

## Phase 5 — ChromaDB Upgrade (Planned)

When ready to replace SQLite with a vector store:

Add to `docker-compose.yml`:
```yaml
  chromadb:
    image: chromadb/chroma:latest
    container_name: chromadb
    restart: unless-stopped
    ports:
      - "8000:8000"
    volumes:
      - ./data/chromadb:/chroma/chroma

  chromadb-admin:
    image: ghcr.io/flanker/chromadb-admin:latest
    container_name: chromadb-admin
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - CHROMADB_URL=http://chromadb:8000
```

ChromaDB Admin UI will be accessible at `http://localhost:3001` and lets you browse collections, inspect vectors, and view document metadata.

---

## Known Risks & Considerations

| Risk | Notes |
|---|---|
| Ollama has no auth | Acceptable on private Tailscale network. Do not expose port 11434 publicly. |
| Tailscale latency | Minor overhead on every inference call. Measure if you notice sluggishness. |
| Open Web UI MCP support maturity | Verify transport type (SSE/stdio) matches what OWI expects before spending time debugging. |
| Data persistence | All Docker volumes are bind-mounted to `./data/` — back this up if the data matters. |
| MCP containers using `npx` | Cold starts will pull packages. Pin versions once stable to avoid breaking changes. |
| CVE-2025-9074 (CVSS 9.3) | Unpatched on Monterey — fix requires 4.44.3+ which won't run on macOS 12. A malicious container can access the Docker Engine API without auth and escape to the host. Risk is low if you only run trusted images. Do not run untrusted containers on this machine. |

---

## Quick Reference

| Service | URL |
|---|---|
| Open Web UI | `http://<mini-ip>:3000` |
| Portainer | `http://<mini-ip>:9000` |
| Ollama API | `http://<macbook-tailscale-ip>:11434` |
| ChromaDB API (planned) | `http://<mini-ip>:8000` |
| ChromaDB Admin (planned) | `http://<mini-ip>:3001` |

---

## Current Status

- [x] MacBook: Docker removed
- [x] MacBook: Ollama installed and configured for remote access
- [x] MacBook: Tailscale connected
- [x] Mac mini: Wiped and ready
- [x] Mac mini: Docker Desktop 4.41.2 installed (pinned — do not update)
- [x] Mac mini: Tailscale connected and verified against MacBook
- [x] Mac mini: `docker-compose.yml` created and stack started
- [x] Portainer: Admin account created
- [x] Open Web UI: Connected to Ollama
- [ ] MCP servers: Connected to Open Web UI
- [ ] ChromaDB: Planned — not yet implemented
