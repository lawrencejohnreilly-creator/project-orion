// ---------------------------------------------------------------------------
// Project Orion — Orchestrator
// Boots the agent constellation, staggers first runs, and keeps each agent
// on its own interval. Modeled on the UAEMF idea: autonomous entities under
// one management frame, with a human-oversight/autonomous mode toggle.
// ---------------------------------------------------------------------------
import * as draftMonitor from "./draftMonitor.js";
import * as permanenceAgent from "./permanenceAgent.js";
import * as briefingAgent from "./briefingAgent.js";
import * as frontendAgent from "./frontendAgent.js";
import * as crossrefAgent from "./crossrefAgent.js";
import * as healthAgent from "./healthAgent.js";
import { log, recordRun } from "./state.js";

export const AGENTS = [
  draftMonitor,
  permanenceAgent,
  briefingAgent,
  frontendAgent,
  crossrefAgent,
  healthAgent
];

async function safeRun(agent) {
  try {
    await agent.run();
  } catch (e) {
    log(agent.name, `run failed: ${e.message}`, "error");
    recordRun(agent.name, false, e.message);
  }
}

export function start() {
  healthAgent.setRegistry(AGENTS);
  log("orchestrator", `launching ${AGENTS.length} agents`);
  AGENTS.forEach((agent, i) => {
    // Stagger first runs 3s apart so boot is orderly
    setTimeout(() => safeRun(agent), 3000 * (i + 1));
    setInterval(() => safeRun(agent), agent.intervalMs);
  });
}

export async function runNow(name) {
  const agent = AGENTS.find(a => a.name === name);
  if (!agent) return false;
  await safeRun(agent);
  return true;
}
