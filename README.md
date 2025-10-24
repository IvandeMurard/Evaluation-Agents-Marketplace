# live_evals-agent

A tiny demo that:
- Streams multi‑agent events over SSE from a Node/Express backend
- Visualizes them in a Vite + React + Tailwind frontend (Timeline + KPIs)
- Triggers a Make scenario at end‑of‑session that computes KPIs, runs an LLM‑judge, writes a Notion report, and (optionally) pings Slack

This project is respectful of SOC 2 Trust Principles
[Security & Trust](./SECURITY.md)

Flowchart LR
    A[User / Client Team] -- HTTPS + JWT --> B[Frontend (Vercel)]
    B -- Webhook / API --> C[n8n Orchestrator\n(Cron, Webhooks, Secrets Vault)]
    B -- RLS (JWT) --> D[Supabase Auth]
    C -- TLS + service key --> E[(Supabase Postgres\nagent_runs, issues, metrics)]
    C -- Store artifacts --> F[(Supabase Buckets)]
    C -- Prompts (no PII) --> G[LLM Providers\nOpenAI/Anthropic]
    G -- LLM outputs --> C
    C -- Run status / errors --> H[Logging & Monitoring]
    H -- Alert --> I[Slack / Ops Channel]
    J[GitHub Repo\n(n8n blueprints, schemas)] -- Versions --> C

    subgraph Policies & Controls
      K[Backups, Retention, RBAC, Audit Logs]
    end
    K -- Enforced controls --> E

    classDef secure fill:#eaf8f1,stroke:#2e7d32,stroke-width:2px;
    class E,F secure
```
