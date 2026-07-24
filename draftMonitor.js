// ---------------------------------------------------------------------------
// Agent: Draft Monitor ("Rigel")
// Polls the IETF Datatracker REST API for every draft in the suite and keeps
// live revision / status / date data in state. Fully autonomous — read-only
// against the outside world, so it applies its own updates in either mode.
// ---------------------------------------------------------------------------
import { DRAFTS } from "./drafts.js";
import { state, log, recordRun, save } from "./state.js";

const API = id => `https://datatracker.ietf.org/api/v1/doc/document/${id}/?format=json`;

export const name = "draft-monitor";
export const intervalMs = 30 * 60 * 1000; // every 30 minutes

export async function run() {
  let ok = 0, fail = 0;
  for (const d of DRAFTS) {
    try {
      const res = await fetch(API(d.id), { headers: { accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const doc = await res.json();
      state.drafts[d.id] = {
        rev: doc.rev,
        pages: doc.pages,
        title: doc.title,
        expires: doc.expires,
        time: doc.time,
        lastChecked: new Date().toISOString(),
        live: true
      };
      ok++;
    } catch (e) {
      state.drafts[d.id] = {
        ...(state.drafts[d.id] || {}),
        lastChecked: new Date().toISOString(),
        live: false,
        error: e.message
      };
      fail++;
    }
    await new Promise(r => setTimeout(r, 400)); // be polite to the datatracker
  }
  const detail = `${ok}/${DRAFTS.length} drafts confirmed live on the Datatracker`;
  log(name, detail, fail ? "warn" : "info");
  recordRun(name, fail === 0, detail);
  save();
}
