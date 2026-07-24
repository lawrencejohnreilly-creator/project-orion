// ---------------------------------------------------------------------------
// Agent: Frontend Composer ("Saiph")
// The agent that works on the front-end. It composes the content the UI
// renders — hero line, daily spotlight draft, and a suite status line — and
// publishes it to state.frontend, which the page consumes live. With a key,
// Claude writes the copy; without one, it composes deterministically.
// Changes go through the oversight queue.
// ---------------------------------------------------------------------------
import { DRAFTS, LAYERS } from "../drafts.js";
import { state, log, recordRun, propose, save } from "../state.js";
import { askClaude, hasClaude } from "../claude.js";

export const name = "frontend-composer";
export const intervalMs = 3 * 60 * 60 * 1000; // every 3 hours

export async function run() {
  const live = Object.values(state.drafts).filter(d => d.live).length;
  const dual = Object.values(state.permanence).filter(p => p.txt?.ok && p.mirror?.ok).length;

  // Rotate the spotlight through the suite by day-of-year
  const day = Math.floor(Date.now() / 86400000);
  const spotlight = DRAFTS[day % DRAFTS.length];

  let heroLine = `Eighteen Internet-Drafts. Five layers. One constellation, continuously verified.`;
  let spotlightNote = spotlight.summary;

  if (hasClaude()) {
    try {
      heroLine = await askClaude(
        `Write one confident sentence (max 16 words) for the hero of "Project Orion", a dashboard for an 18-draft IETF protocol suite spanning permanence, integrity, identity, cognition, and machine-web symbiosis. No quotes, no preamble.`,
        { maxTokens: 60 }
      );
      spotlightNote = await askClaude(
        `In one sentence, say why ${spotlight.short} (${spotlight.id}) matters inside a larger protocol suite. Context: ${spotlight.summary}. No preamble.`,
        { maxTokens: 80 }
      );
    } catch (e) {
      log(name, `Claude copy failed (${e.message}); composing deterministically`, "warn");
    }
  }

  const content = {
    heroLine,
    statusLine: `${live}/${DRAFTS.length} live on the Datatracker · ${dual}/${DRAFTS.length} dual-archive verified`,
    spotlight: { id: spotlight.id, short: spotlight.short, note: spotlightNote },
    layers: LAYERS.map(l => ({
      ...l,
      count: DRAFTS.filter(d => d.layer === l.id).length
    })),
    composedAt: new Date().toISOString(),
    composedBy: hasClaude() ? "claude" : "deterministic"
  };

  propose(name, "publish frontend content update", { heroLine: content.heroLine }, () => {
    state.frontend = { content, updatedAt: new Date().toISOString() };
  });

  log(name, "frontend content composed");
  recordRun(name, true, "content composed");
  save();
}
