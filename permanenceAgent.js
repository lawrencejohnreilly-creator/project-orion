// ---------------------------------------------------------------------------
// Agent: Permanence Verifier ("Alnilam")
// Applies the Dual-Layer Digital Permanence discipline to the suite itself:
// verifies each draft is reachable at the IETF archive AND at two independent
// mirrors — nic.funet.fi (Finland) and ftp.otenet.gr (Greece). Three copies
// on three networks, continuously confirmed.
// ---------------------------------------------------------------------------
import { DRAFTS } from "./drafts.js";
import { state, log, recordRun, save } from "./state.js";

export const name = "permanence-verifier";
export const intervalMs = 60 * 60 * 1000; // hourly

async function head(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return { ok: res.ok, code: res.status };
  } catch (e) {
    return { ok: false, code: 0, error: e.message };
  }
}

export async function run() {
  let full = 0;
  for (const d of DRAFTS) {
    const rev = state.drafts[d.id]?.rev || "00";
    const [txt, mirror, otenet] = await Promise.all([
      head(`https://www.ietf.org/archive/id/${d.id}-${rev}.txt`),
      head(`https://www.nic.funet.fi/pub/mirrors/ftp.ietf.org/internet-drafts/${d.id}-${rev}.txt`),
      head(`https://ftp.otenet.gr/doc/internet-drafts/${d.id}-${rev}.txt`)
    ]);
    state.permanence[d.id] = { txt, mirror, otenet, at: new Date().toISOString() };
    if (txt.ok && mirror.ok && otenet.ok) full++;
    await new Promise(r => setTimeout(r, 300));
  }
  const detail = `${full}/${DRAFTS.length} drafts verified at the IETF archive + funet + otenet mirrors`;
  log(name, detail);
  recordRun(name, true, detail);
  save();
}
