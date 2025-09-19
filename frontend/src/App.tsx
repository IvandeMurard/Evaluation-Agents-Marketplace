import React, { useEffect, useMemo, useRef, useState } from "react";
import type { AgentEvent } from "./types";

export default function App() {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    const es = new EventSource(import.meta.env.VITE_STREAM_URL || "http://localhost:8787/api/stream");
    es.onmessage = (e) => setEvents((prev) => [...prev, JSON.parse(e.data)]);
    return () => es.close();
  }, []);

  const kpis = useMemo(() => computeKpis(events), [events]);

  async function startDemo() {
    const res = await fetch(import.meta.env.VITE_SERVER_URL || "http://localhost:8787/api/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userQuery: "Find slowest agent and fix" }) });
    const data = await res.json();
    setSessionId(data.session_id);
  }

  return (
    <div className="container">
      <header>
        <h1>Live Agent Trace</h1>
        <button onClick={startDemo}>Run mock session</button>
        <div className="hud">
          <span>events: {events.length}</span>
          <span>cost: ${kpis.cost.toFixed(4)}</span>
          <span>p95: {kpis.p95.toFixed(0)} ms</span>
          <span>errors: {kpis.errors}</span>
        </div>
      </header>

      <section className="timeline">
        {events.map((e, i) => (
          <article key={i} className={`card type-${e.type}`}>
            <div className="meta">
              <strong>{e.agent || e.role || e.type}</strong>
              <small>{new Date(e.timestamp).toLocaleTimeString()}</small>
            </div>
            <pre>{JSON.stringify({ input: e.input, output: e.output, metrics: e.metrics }, null, 2)}</pre>
          </article>
        ))}
      </section>
    </div>
  );
}

function computeKpis(events: AgentEvent[]) {
  const latencies = events.map(e => e.metrics?.latency_ms || 0).filter(Boolean).sort((a,b)=>a-b);
  const idx = Math.floor(0.95 * (latencies.length - 1));
  const p95 = latencies[idx] || 0;
  const cost = events.reduce((s,e)=> s + (e.metrics?.cost_usd || 0), 0);
  const errors = events.filter(e => e.status === "error").length;
  return { p95, cost, errors };
}
