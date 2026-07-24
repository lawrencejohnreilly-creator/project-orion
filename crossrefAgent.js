// ---------------------------------------------------------------------------
// Agent: Cross-Reference Cartographer ("Mintaka")
// Maintains the constellation's edge map: which drafts depend on which, and
// what that says about the suite's shape. Publishes graph stats plus a
// one-line insight for the dashboard.
// ---------------------------------------------------------------------------
import { DRAFTS, EDGES } from "../drafts.js";
import { state, log, recordRun, save } from "../state.js";
import { askClaude, hasClaude } from "../claude.js";

export const name = "crossref-cartographer";
export const intervalMs = 12 * 60 * 60 * 1000; // twice a day

export async function run() {
  const degree = {};
  for (const [a, b] of EDGES) {
    degree[a] = (degree[a] || 0) + 1;
    degree[b] = (degree[b] || 0) + 1;
  }
  const hub = Object.entries(degree).sort((x, y) => y[1] - x[1])[0];
  const hubDraft = DRAFTS.find(d => d.id === hub[0]);

  let insight = `${hubDraft.short} is the suite's hub with ${hub[1]} direct connections — every layer routes through the permanence foundation.`;
  if (hasClaude()) {
    try {
      insight = await askClaude(
        `A protocol suite dependency graph has ${DRAFTS.length} drafts and ${EDGES.length} edges; the most connected node is ${hubDraft.short} with ${hub[1]} edges. In one sentence, state what this shape implies about the suite's architecture. No preamble.`,
        { maxTokens: 80 }
      );
    } catch { /* keep deterministic insight */ }
  }

  state.crossref = {
    edges: EDGES,
    degrees: degree,
    hub: hub[0],
    insight,
    at: new Date().toISOString()
  };
  log(name, `graph mapped: ${EDGES.length} edges, hub = ${hubDraft.short}`);
  recordRun(name, true, `hub: ${hubDraft.short}`);
  save();
}
