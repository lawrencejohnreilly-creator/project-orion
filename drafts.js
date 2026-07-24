// ---------------------------------------------------------------------------
// Project Orion — Draft Manifest
// The single source of truth for the Reilly Protocol Suite (18 active I-Ds).
// Every agent and the frontend constellation render from this list.
//
// star:  Orion constellation position (viewBox 0 0 1000 1200) + stellar class.
//        "red" = Betelgeuse-class anchor drafts, "blue" = Rigel-class,
//        "white" = belt/field stars.
// layer: the five protocol layers of the suite.
// ---------------------------------------------------------------------------

export const LAYERS = [
  { id: "permanence",  name: "Permanence Layer",     blurb: "Dual-Layer Digital Permanence — Bitcoin timestamping, DOI archival, IPFS." },
  { id: "integrity",   name: "Integrity Layer",      blurb: "Sector integrity — banking, government, resilience, sentinel/AI." },
  { id: "identity",    name: "Identity & Proof",     blurb: "Fingerprinting, web-native proof, and token genesis." },
  { id: "cognition",   name: "Cognition Layer",      blurb: "Prompt engineering at the protocol layer, AI evaluation, human epistemic autonomy." },
  { id: "symbiosis",   name: "Symbiosis Layer",      blurb: "Machine-web coordination, unified frameworks, and integrative systems." }
];

export const DRAFTS = [
  {
    id: "draft-reilly-rem-protocol",
    short: "REM Protocol",
    layer: "permanence",
    summary: "Foundation of the suite. Establishes Dual-Layer Digital Permanence: Bitcoin blockchain timestamping (OpenTimestamps) paired with DOI archival for verifiable, permanent records.",
    origin: "September 2025 — the first draft of the suite.",
    star: { x: 500, y: 620, class: "red", mag: 1.0 }
  },
  {
    id: "draft-reilly-banking-integrity",
    short: "RBIP — Banking Integrity",
    layer: "integrity",
    summary: "Applies REM permanence guarantees to banking records and financial audit trails.",
    star: { x: 350, y: 560, class: "white", mag: 0.7 }
  },
  {
    id: "draft-reilly-government-integrity",
    short: "RGIP — Government Integrity",
    layer: "integrity",
    summary: "Permanence and verification for government records and public-sector integrity.",
    star: { x: 650, y: 560, class: "white", mag: 0.7 }
  },
  {
    id: "draft-reilly-resilience-protocol",
    short: "RRP — Resilience Protocol",
    layer: "integrity",
    summary: "Resilience and continuity guarantees for systems built on the suite.",
    star: { x: 430, y: 590, class: "white", mag: 0.65 }
  },
  {
    id: "draft-reilly-sentinel-protocol",
    short: "RSP — Sentinel Protocol",
    layer: "integrity",
    summary: "Sentinel / AI-integrity monitoring: continuous verification that AI systems remain within declared bounds.",
    star: { x: 570, y: 590, class: "blue", mag: 0.8 }
  },
  {
    id: "draft-reilly-rlt-genesis",
    short: "RLT Genesis",
    layer: "identity",
    summary: "Genesis specification for the RLT token within the REM ecosystem.",
    star: { x: 300, y: 820, class: "white", mag: 0.6 }
  },
  {
    id: "draft-reilly-rem-triple-fingerprint",
    short: "REM Triple Fingerprint",
    layer: "identity",
    summary: "Triple-fingerprint identity and content verification for REM-anchored records.",
    star: { x: 420, y: 880, class: "white", mag: 0.65 }
  },
  {
    id: "draft-reilly-rmrp",
    short: "RMRP",
    layer: "identity",
    summary: "REM Master Record Protocol — canonical record structure and resolution.",
    star: { x: 360, y: 950, class: "white", mag: 0.6 }
  },
  {
    id: "draft-reilly-webproof",
    short: "WebProof",
    layer: "identity",
    summary: "Web-native proof: verifiable claims about web content, anchored through the permanence layer.",
    star: { x: 250, y: 300, class: "blue", mag: 0.85 }
  },
  {
    id: "draft-reilly-plpes",
    short: "PLPES",
    layer: "cognition",
    summary: "Protocol Layer Prompt Engineering Specification — moving prompt engineering from application code into a specified protocol layer.",
    star: { x: 700, y: 250, class: "red", mag: 0.9 }
  },
  {
    id: "draft-reilly-cts",
    short: "CTS",
    layer: "cognition",
    summary: "Cognitive Trust Specification within the suite's cognition layer.",
    star: { x: 760, y: 330, class: "white", mag: 0.6 }
  },
  {
    id: "draft-reilly-uaemf",
    short: "UAEMF",
    layer: "symbiosis",
    summary: "Unified Autonomous Entity Management Framework — coordinating autonomous agents under a common management model.",
    star: { x: 620, y: 180, class: "white", mag: 0.7 }
  },
  {
    id: "draft-reilly-aimed",
    short: "AIMED",
    layer: "cognition",
    summary: "AI Model Evaluation & Disclosure framework.",
    star: { x: 800, y: 420, class: "white", mag: 0.6 }
  },
  {
    id: "draft-reilly-aimed-eval",
    short: "AIMED-EVAL",
    layer: "cognition",
    summary: "Companion evaluation methodology for AIMED.",
    star: { x: 850, y: 500, class: "white", mag: 0.55 }
  },
  {
    id: "draft-reilly-mws",
    short: "MWS — Machine-Web Symbiosis",
    layer: "symbiosis",
    summary: "Machine-Web Symbiosis framework: extends Licklider's 1960 man-computer symbiosis to the agentic web.",
    star: { x: 200, y: 200, class: "blue", mag: 0.9 }
  },
  {
    id: "draft-reilly-cogsov",
    short: "Cognitive Sovereignty",
    layer: "cognition",
    summary: "Defines how humans retain epistemic autonomy over agent-curated content — the Curation Disclosure Record (CDR) and Sovereignty Fallback.",
    submitted: "2026-07-18",
    star: { x: 640, y: 900, class: "blue", mag: 0.85 }
  },
  {
    id: "draft-reilly-looking-glass",
    short: "Project Looking Glass",
    layer: "symbiosis",
    summary: "Integrative draft unifying the full suite with a live self-healing implementation and a seven-phase deployment path.",
    submitted: "2026-07-21",
    star: { x: 560, y: 960, class: "white", mag: 0.75 }
  },
  {
    id: "draft-reilly-hdrp",
    short: "HDRP — Project Rubik's Cube",
    layer: "symbiosis",
    summary: "Hypercube Data Rotation Protocol: hypercube shard topology with rotation-based moving-target defense.",
    submitted: "2026-07-23",
    star: { x: 700, y: 1020, class: "red", mag: 0.9 }
  }
];

// Constellation lines (draft id -> draft id) — drawn on the star map to show
// how the suite hangs together. Edges reflect real dependencies: everything
// integrity/identity anchors to REM; cognition drafts feed the symbiosis layer.
export const EDGES = [
  ["draft-reilly-rem-protocol", "draft-reilly-banking-integrity"],
  ["draft-reilly-rem-protocol", "draft-reilly-government-integrity"],
  ["draft-reilly-rem-protocol", "draft-reilly-resilience-protocol"],
  ["draft-reilly-rem-protocol", "draft-reilly-sentinel-protocol"],
  ["draft-reilly-rem-protocol", "draft-reilly-rem-triple-fingerprint"],
  ["draft-reilly-rem-triple-fingerprint", "draft-reilly-rmrp"],
  ["draft-reilly-rem-triple-fingerprint", "draft-reilly-rlt-genesis"],
  ["draft-reilly-webproof", "draft-reilly-rem-protocol"],
  ["draft-reilly-webproof", "draft-reilly-mws"],
  ["draft-reilly-plpes", "draft-reilly-cts"],
  ["draft-reilly-plpes", "draft-reilly-uaemf"],
  ["draft-reilly-cts", "draft-reilly-aimed"],
  ["draft-reilly-aimed", "draft-reilly-aimed-eval"],
  ["draft-reilly-uaemf", "draft-reilly-mws"],
  ["draft-reilly-rem-protocol", "draft-reilly-cogsov"],
  ["draft-reilly-cogsov", "draft-reilly-looking-glass"],
  ["draft-reilly-looking-glass", "draft-reilly-hdrp"],
  ["draft-reilly-sentinel-protocol", "draft-reilly-aimed-eval"]
];

export function draftUrls(id) {
  return {
    datatracker: `https://datatracker.ietf.org/doc/${id}/`,
    html: `https://www.ietf.org/archive/id/${id}-00.html`,
    txt: `https://www.ietf.org/archive/id/${id}-00.txt`,
    mirror: `https://www.nic.funet.fi/pub/mirrors/ftp.ietf.org/internet-drafts/${id}-00.txt`
  };
}
