// ---------------------------------------------------------------------------
// Project Orion — server
// Serves the constellation frontend and the agent API.
//   GET  /api/state            full public state (drafts, briefs, agents, log)
//   GET  /api/manifest         the 18-draft manifest + layers + edges
//   POST /api/mode             { mode: "autonomous" | "oversight" }
//   POST /api/approve/:id      approve a queued agent action
//   POST /api/reject/:id       reject a queued agent action
//   POST /api/run/:agent       trigger an agent run now
//   GET  /health               liveness probe
// ---------------------------------------------------------------------------
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DRAFTS, LAYERS, EDGES, draftUrls } from "./src/drafts.js";
import { state, publicState, load, save, approve, reject, log } from "./src/state.js";
import { start, runNow, AGENTS } from "./src/orchestrator.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/manifest", (_req, res) => {
  res.json({
    layers: LAYERS,
    edges: EDGES,
    drafts: DRAFTS.map(d => ({ ...d, urls: draftUrls(d.id) })),
    agents: AGENTS.map(a => ({ name: a.name, intervalMs: a.intervalMs }))
  });
});

app.get("/api/state", (_req, res) => res.json(publicState()));

app.post("/api/mode", (req, res) => {
  const { mode } = req.body || {};
  if (mode !== "autonomous" && mode !== "oversight") {
    return res.status(400).json({ error: "mode must be 'autonomous' or 'oversight'" });
  }
  state.mode = mode;
  log("operator", `mode set to ${mode}`);
  save();
  res.json({ mode });
});

app.post("/api/approve/:id", (req, res) => {
  res.json({ ok: approve(req.params.id) });
});

app.post("/api/reject/:id", (req, res) => {
  res.json({ ok: reject(req.params.id) });
});

app.post("/api/run/:agent", async (req, res) => {
  const ok = await runNow(req.params.agent);
  res.status(ok ? 200 : 404).json({ ok });
});

app.get("/health", (_req, res) => res.json({ ok: true, up: state.startedAt }));

const PORT = process.env.PORT || 3000;
load();
app.listen(PORT, () => {
  console.log(`Project Orion listening on :${PORT}`);
  start();
});
