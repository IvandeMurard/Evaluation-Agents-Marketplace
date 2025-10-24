# live_evals-agent

A tiny demo that:
- Streams multi‑agent events over SSE from a Node/Express backend
- Visualizes them in a Vite + React + Tailwind frontend (Timeline + KPIs)
- Triggers a Make scenario at end‑of‑session that computes KPIs, runs an LLM‑judge, writes a Notion report, and (optionally) pings Slack

This project is respectful of SOC 2 Trust Principles
[Security & Trust](./SECURITY.md)

## 🧩 SOC 2-Ready Data Flow
```mermaid
flowchart LR
    A[User / Client Team] --> B[Frontend_Vercel]
    B --> C["n8n Orchestrator (Cron, Webhooks, Secrets Vault)"]
    B --> D[Supabase Auth]
    C --> E[("Supabase Postgres: agent_runs, issues, metrics")]
    C --> F[(Supabase Buckets)]
    C --> G["LLM Providers (OpenAI-Anthropic)"]
    G --> C
    C --> H[Logging & Monitoring]
    H --> I[Slack Ops Channel]
    J["GitHub Repo (n8n blueprints, schemas)"] --> C
    subgraph Policies_and_Controls
        K[Backups, Retention, RBAC, Audit Logs]
    end
    K --> E
    classDef secure fill:#eaf8f1,stroke:#2e7d32,stroke-width:2px,color:#000;
    class E,F secure;
```
