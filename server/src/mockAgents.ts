import { AgentEvent } from "./types.js";
import { nanoid } from "nanoid";

function now() { return new Date().toISOString(); }

export async function* runMockSession(session_id: string, userQuery: string) {
  const trace_id = nanoid();

  // 1) User message → router
  yield <AgentEvent>{ trace_id, span_id: nanoid(), timestamp: now(), type: "message", role: "user", input: { text: userQuery }, labels: { session_id } };

  const routerSpan = nanoid();
  yield <AgentEvent>{ trace_id, span_id: routerSpan, timestamp: now(), type: "agent_step", agent: "router", labels: { session_id } };
  await sleep(200);

  // 2) Router → retriever
  const retrieverSpan = nanoid();
  yield <AgentEvent>{ trace_id, span_id: retrieverSpan, parent_span_id: routerSpan, timestamp: now(), type: "tool_call", agent: "retriever", input: { k: 3 }, metrics: { latency_ms: 180, cost_usd: 0.0004 }, labels: { session_id } };
  await sleep(180);
  yield <AgentEvent>{ trace_id, span_id: nanoid(), parent_span_id: retrieverSpan, timestamp: now(), type: "model_call", agent: "retriever", output: { docs: ["docA", "docB"] }, metrics: { latency_ms: 220, tokens_output: 128, cost_usd: 0.0009 }, labels: { session_id } };

  // 3) Solver
  const solverSpan = nanoid();
  yield <AgentEvent>{ trace_id, span_id: solverSpan, parent_span_id: routerSpan, timestamp: now(), type: "agent_step", agent: "solver", input: { question: userQuery }, labels: { session_id } };
  await sleep(260);
  yield <AgentEvent>{ trace_id, span_id: nanoid(), parent_span_id: solverSpan, timestamp: now(), type: "model_call", agent: "solver", output: { answer: "Proposed solution…" }, metrics: { latency_ms: 260, tokens_output: 96, cost_usd: 0.0012 }, labels: { session_id } };

  // 4) Reviewer
  const reviewerSpan = nanoid();
  yield <AgentEvent>{ trace_id, span_id: reviewerSpan, parent_span_id: solverSpan, timestamp: now(), type: "agent_step", agent: "reviewer", labels: { session_id } };
  await sleep(140);
  yield <AgentEvent>{ trace_id, span_id: nanoid(), parent_span_id: reviewerSpan, timestamp: now(), type: "message", role: "assistant", output: { final: "Final answer ✅" }, metrics: { latency_ms: 140 }, labels: { session_id } };
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
