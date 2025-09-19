export type AgentEventType = "agent_step" | "tool_call" | "model_call" | "message" | "report_ready" | "report_pending";

export interface AgentEvent {
  trace_id: string;
  span_id: string;
  parent_span_id?: string | null;
  timestamp: string; // ISO
  type: AgentEventType;
  agent?: string;    // router|retriever|solver|reviewer|supervisor
  role?: string;     // user|assistant|system|tool
  input?: unknown;
  output?: unknown;
  metrics?: { latency_ms?: number; tokens_prompt?: number; tokens_output?: number; cost_usd?: number };
  labels?: Record<string, string>;
  status?: "ok" | "error";
  error?: { name: string; message: string; stack?: string } | null;
}

export interface SessionEndPayload {
  session_id: string;
  events: AgentEvent[];
}
