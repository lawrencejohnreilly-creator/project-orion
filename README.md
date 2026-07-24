# Project Orion

A living constellation for the **Reilly Protocol Suite** — all 18 active IETF Internet-Drafts by Lawrence John Reilly Jr., rendered as the Orion star field and maintained by a crew of autonomous agents on both the backend and the frontend.

Live sources:
- Datatracker profile 1: https://datatracker.ietf.org/person/lawrencejohnreilly@gmail.com (12 drafts)
- Datatracker profile 2: https://datatracker.ietf.org/person/lreilly250@gmail.com (2 drafts)
- July 2026 submissions: draft-reilly-mws, draft-reilly-cogsov, draft-reilly-looking-glass, draft-reilly-hdrp
- Independent mirror: https://www.nic.funet.fi/pub/mirrors/ftp.ietf.org/internet-drafts/

## The agent constellation

Six autonomous agents, each named for a star in Orion, scheduled by the orchestrator (UAEMF-style unified management):

| Agent | Star | Role | Interval |
|---|---|---|---|
| `draft-monitor` | Rigel | Polls the IETF Datatracker API for live revision/status of every draft | 30 min |
| `permanence-verifier` | Alnilam | Confirms each draft is reachable at BOTH the IETF archive and the funet mirror (Dual-Layer Digital Permanence applied to the suite itself) | 60 min |
| `briefing-officer` | Bellatrix | Fetches draft text and writes plain-language briefs via the Claude API | 6 h |
| `frontend-composer` | Saiph | The frontend agent — composes the hero line, status line, spotlight, and layer content the UI renders | 3 h |
| `crossref-cartographer` | Mintaka | Maintains the dependency graph between drafts and publishes a suite insight | 12 h |
| `health-sentinel` | Meissa | Self-healing supervisor: re-runs any agent that failed or went silent (Sentinel Protocol spirit) | 10 min |

### Human oversight ↔ autonomous mode

Agents that *change what the site says* (briefs, frontend content) route their changes through a proposal queue:

- **HUMAN OVERSIGHT** (default): proposed changes wait in the Pending Approvals panel until you approve or reject them.
- **AUTONOMOUS**: agents apply their own changes immediately.

Toggle from the UI or `POST /api/mode {"mode":"autonomous"}`.

## Run locally

```bash
npm install
export ANTHROPIC_API_KEY=sk-ant-...   # optional — enables Claude-written briefs and copy
npm start
# open http://localhost:3000
```

Without an API key everything still works; briefs and copy fall back to the curated manifest.

## Deploy to Railway

1. Push this folder to a GitHub repo.
2. In Railway: **New Project → Deploy from GitHub repo**.
3. Add environment variable `ANTHROPIC_API_KEY` (optional) and, if desired, `ORION_MODEL`.
4. Railway detects Node, runs `npm start`, and injects `PORT` automatically.

## API

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/manifest` | The 18-draft manifest, layers, edges, agent roster |
| GET | `/api/state` | Full live state: draft status, briefs, permanence checks, agent health, pending queue, mission log |
| POST | `/api/mode` | Switch `oversight` / `autonomous` |
| POST | `/api/approve/:id` | Approve a queued agent action |
| POST | `/api/reject/:id` | Reject a queued agent action |
| POST | `/api/run/:agent` | Trigger an agent run immediately |
| GET | `/health` | Liveness probe |

## Structure

```
project-orion/
├── server.js                  Express server + API
├── src/
│   ├── drafts.js              18-draft manifest, layers, constellation geometry
│   ├── state.js               Shared state, proposal queue, mission log, persistence
│   ├── claude.js              Anthropic API helper
│   ├── orchestrator.js        Agent scheduler
│   └── agents/                The six agents
├── public/index.html          Constellation dashboard (SVG star map + live panels)
└── data/state.json            Persisted state (created at runtime)
```
