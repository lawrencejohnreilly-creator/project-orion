// ---------------------------------------------------------------------------
// Project Orion — Anthropic API helper
// Agents call askClaude() for reasoning tasks. If ANTHROPIC_API_KEY is not
// set, callers fall back to deterministic behavior (the site still works).
// ---------------------------------------------------------------------------

const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.ORION_MODEL || "claude-sonnet-4-5";

export const hasClaude = () => Boolean(process.env.ANTHROPIC_API_KEY);

export async function askClaude(prompt, { system, maxTokens = 800 } = {}) {
  if (!hasClaude()) throw new Error("ANTHROPIC_API_KEY not configured");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      ...(system ? { system } : {}),
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Anthropic API ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data.content || [])
    .filter(b => b.type === "text")
    .map(b => b.text)
    .join("\n")
    .trim();
}
