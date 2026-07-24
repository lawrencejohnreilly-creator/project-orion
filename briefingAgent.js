// ---------------------------------------------------------------------------
// Agent: Briefing Officer ("Bellatrix")
// Writes a plain-language brief for each draft. With an ANTHROPIC_API_KEY it
// fetches the draft text and asks Claude for a two-sentence brief; without a
// key it falls back to the curated manifest summary. Briefs are proposed
// through the oversight queue, so in oversight mode a human signs off.
// ---------------------------------------------------------------------------
import { DRAFTS } from "./drafts.js";
import { state, log, recordRun, propose, save } from "./state.js";
import { askClaude, hasClaude } from "./claude.js";

export const name = "briefing-officer";
export const intervalMs = 6 * 60 * 60 * 1000; // every 6 hours

async function draftText(id, rev) {
  const res = await fetch(`https://www.ietf.org/archive/id/${id}-${rev}.txt`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.text()).slice(0, 12000); // abstract + intro is plenty
}

export async function run() {
  let written = 0;
  for (const d of DRAFTS) {
    if (state.briefs[d.id]?.text && state.briefs[d.id].generatedBy === "claude") continue;
    let text, by;
    if (hasClaude()) {
      try {
        const rev = state.drafts[d.id]?.rev || "00";
        const raw = await draftText(d.id, rev);
        text = await askClaude(
          `Here is the opening of IETF Internet-Draft ${d.id}:\n\n${raw}\n\nWrite a two-sentence plain-language brief of what this draft specifies and why it matters. No preamble.`,
          { system: "You write crisp technical briefs for a protocol suite dashboard.", maxTokens: 200 }
        );
        by = "claude";
      } catch (e) {
        log(name, `Claude brief failed for ${d.id} (${e.message}); using manifest summary`, "warn");
      }
    }
    if (!text) { text = d.summary; by = "manifest"; }
    const brief = { text, generatedBy: by, at: new Date().toISOString() };
    propose(name, `update brief: ${d.short}`, { draft: d.id, preview: text.slice(0, 140) }, () => {
      state.briefs[d.id] = brief;
    });
    written++;
  }
  const detail = written ? `${written} briefs prepared` : "all briefs current";
  log(name, detail);
  recordRun(name, true, detail);
  save();
}
