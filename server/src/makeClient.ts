import fetch from "node-fetch";

export async function postToMake(webhookUrl: string, body: unknown) {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Make webhook failed: ${res.status}`);
  return res.json().catch(() => ({}));
}
