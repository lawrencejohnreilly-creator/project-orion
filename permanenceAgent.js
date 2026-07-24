// ---------------------------------------------------------------------------
// Agent: Permanence Verifier ("Alnilam")
// Applies the Dual-Layer Digital Permanence discipline to the suite itself:
// verifies each draft is reachable at the IETF archive AND at the independent
// nic.funet.fi mirror. Two independent copies, continuously confirmed.
// ---------------------------------------------------------------------------
import { DRAFTS, draftUrls } from "../drafts.js";
import { state, log, recordRun, save } from "../state.js";

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
  let dual = 0;
  for (const d of DRAFTS) {
    const rev = state.drafts[d.id]?.rev || "00";
    const txtUrl = `https://www.ietf.org/archive/id/${d.id}-${rev}.txt`;
    const mirrorUrl = `https://www.nic.funet.fi/pub/mirrors/ftp.ietf.org/internet-drafts/${d.id}-${rev}.txt`;
    const [txt, mirror] = await Promise.all([head(txtUrl), head(mirrorUrl)]);
    state.permanence[d.id] = { txt, mirror, at: new Date().toISOString() };
    if (txt.ok && mirror.ok) dual++;
    await new Promise(r => setTimeout(r, 300));
  }
  const detail = `${dual}/${DRAFTS.length} drafts verified at both the IETF archive and the funet mirror`;
  log(name, detail);
  recordRun(name, true, detail);
  save();
}
