// ---------------------------------------------------------------------------
// Agent: Health Sentinel ("Meissa")
// Self-healing supervisor in the Sentinel Protocol spirit: watches every
// other agent, and if one reported an unhealthy last run or has gone silent
// past twice its interval, re-runs it immediately.
// ---------------------------------------------------------------------------
import { state, log, recordRun } from "../state.js";

export const name = "health-sentinel";
export const intervalMs = 10 * 60 * 1000; // every 10 minutes

// registry is injected by the orchestrator to avoid circular imports
let registry = [];
export function setRegistry(list) {
  registry = list.filter(a => a.name !== name);
}

export async function run() {
  const now = Date.now();
  const healed = [];
  for (const agent of registry) {
    const rec = state.agents[agent.name];
    const stale = rec?.lastRun && now - Date.parse(rec.lastRun) > agent.intervalMs * 2;
    const unhealthy = rec && rec.healthy === false;
    if (unhealthy || stale) {
      log(name, `healing ${agent.name} (${unhealthy ? "unhealthy" : "stale"}) — re-running`, "warn");
      try {
        await agent.run();
        healed.push(agent.name);
      } catch (e) {
        log(name, `re-run of ${agent.name} failed: ${e.message}`, "error");
      }
    }
  }
  const detail = healed.length ? `healed: ${healed.join(", ")}` : "all agents nominal";
  log(name, detail);
  recordRun(name, true, detail);
}
