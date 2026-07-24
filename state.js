// ---------------------------------------------------------------------------
// Project Orion — shared state
// In-memory state with best-effort JSON persistence (data/state.json).
// Every agent reads/writes here; the frontend consumes it via /api/state.
// ---------------------------------------------------------------------------
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const STATE_FILE = path.join(DATA_DIR, "state.json");

const MAX_LOG = 400;

export const state = {
  mode: "oversight",            // "oversight" | "autonomous"
  startedAt: new Date().toISOString(),
  drafts: {},                   // id -> { status, rev, lastChecked, datatracker fields }
  briefs: {},                   // id -> { text, generatedBy, at }
  permanence: {},               // id -> { txt: {ok, code}, mirror: {ok, code}, at }
  frontend: { content: null, updatedAt: null },  // frontend agent output
  crossref: { edges: [], insight: null, at: null },
  agents: {},                   // name -> { lastRun, lastResult, runs, errors, healthy }
  pending: [],                  // oversight-mode action queue [{id, agent, action, payload, at}]
  activity: []                  // rolling log [{at, agent, level, msg}]
};

export function log(agent, msg, level = "info") {
  state.activity.unshift({ at: new Date().toISOString(), agent, level, msg });
  if (state.activity.length > MAX_LOG) state.activity.length = MAX_LOG;
  console.log(`[${agent}] ${msg}`);
}

export function recordRun(name, ok, detail = "") {
  const a = state.agents[name] || { runs: 0, errors: 0 };
  a.runs += 1;
  if (!ok) a.errors += 1;
  a.lastRun = new Date().toISOString();
  a.lastResult = detail;
  a.healthy = ok;
  state.agents[name] = a;
}

// An agent proposes an action. In autonomous mode it applies immediately;
// in oversight mode it is queued for human approval via the UI.
export function propose(agent, action, payload, apply) {
  if (state.mode === "autonomous") {
    apply();
    log(agent, `auto-applied: ${action}`);
    return { applied: true };
  }
  const item = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    agent, action, payload, at: new Date().toISOString(), apply
  };
  state.pending.push(item);
  log(agent, `queued for approval: ${action}`);
  return { applied: false, id: item.id };
}

export function approve(id) {
  const i = state.pending.findIndex(p => p.id === id);
  if (i === -1) return false;
  const [item] = state.pending.splice(i, 1);
  item.apply();
  log("operator", `approved: ${item.action} (from ${item.agent})`);
  save();
  return true;
}

export function reject(id) {
  const i = state.pending.findIndex(p => p.id === id);
  if (i === -1) return false;
  const [item] = state.pending.splice(i, 1);
  log("operator", `rejected: ${item.action} (from ${item.agent})`);
  return true;
}

export function save() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    // Strip non-serializable apply functions from pending
    const snapshot = {
      ...state,
      pending: state.pending.map(({ apply, ...rest }) => rest)
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(snapshot, null, 2));
  } catch (e) {
    console.error("state save failed:", e.message);
  }
}

export function load() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const saved = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
      Object.assign(state, saved, { pending: [], startedAt: new Date().toISOString() });
      log("system", "restored persisted state");
    }
  } catch (e) {
    console.error("state load failed:", e.message);
  }
}

// Serializable view for the API (drop apply functions)
export function publicState() {
  return {
    ...state,
    pending: state.pending.map(({ apply, ...rest }) => rest)
  };
}
