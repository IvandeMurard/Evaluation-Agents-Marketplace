import "dotenv/config";
import express from "express";
import cors from "cors";
import { runMockSession } from "./mockAgents.js";
import { AgentEvent, SessionEndPayload } from "./types.js";
import { postToMake } from "./makeClient.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// --- SSE clients store
type Client = { id: string; res: express.Response };
const clients: Client[] = [];

app.get("/api/stream", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();
  const id = `${Date.now()}-${Math.random()}`;
  clients.push({ id, res });
  req.on("close", () => {
    const i = clients.findIndex(c => c.id === id);
    if (i >= 0) clients.splice(i, 1);
  });
});

function broadcast(event: AgentEvent) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const c of clients) c.res.write(payload);
}

// Start a demo run
app.post("/api/run", async (req, res) => {
  const { session_id = `sess_${Date.now()}`, userQuery = "How do I fix latency?" } = req.body || {};
  (async () => {
    for await (const ev of runMockSession(session_id, userQuery)) broadcast(ev);
    // Announce report pending and call Make
    broadcast({ trace_id: session_id, span_id: session_id, timestamp: new Date().toISOString(), type: "report_pending", labels: { session_id } });
    if (process.env.MAKE_WEBHOOK_URL) {
      const payload: SessionEndPayload = { session_id, events: (globalThis as any).lastEvents || [] };
      try {
        const result = await postToMake(process.env.MAKE_WEBHOOK_URL, payload);
        broadcast({ trace_id: session_id, span_id: session_id, timestamp: new Date().toISOString(), type: "report_ready", agent: "supervisor", output: result, labels: { session_id } });
      } catch (e) {
        console.error(e);
      }
    }
  })();
  res.json({ ok: true, session_id });
});

// Optional: receive raw events (if you instrument a real stack)
app.post("/api/event", (req, res) => {
  const ev = req.body as AgentEvent;
  ((globalThis as any).lastEvents ||= []).push(ev);
  broadcast(ev);
  res.json({ ok: true });
});

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`Server on http://localhost:${port}`));
