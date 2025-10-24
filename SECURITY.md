# 🛡️ Security & Trust

_Last updated: October 2025_  
_This project is designed with SOC 2 principles in mind (security, availability, processing integrity, confidentiality, and privacy)._

---

## 1. Overview

This repository powers an **AI Evaluation Agent** system built on **Supabase**, **n8n**, and **LLM-based evaluation pipelines**.  
While not yet SOC 2–certified, the system is structured to be **SOC 2-ready by design** — following security, privacy, and integrity best practices.

---

## 2. Infrastructure & Access Control

- **Environment isolation:** separate Supabase projects for development and production.  
- **Secrets management:** API keys and credentials stored in encrypted environment variables (never committed to Git).  
- **Access restriction:** limited to authorized contributors with 2FA enabled.  
- **Audit logs:** Supabase and n8n logs maintained for activity traceability.

---

## 3. Data Security & Privacy

- **No PII:** the system does not collect or store personal data.  
- **Encryption:** all Supabase connections require SSL; data is encrypted at rest by default.  
- **Data minimization:** only essential metadata (run_id, timestamps, evaluation scores) is stored.  
- **Retention policy:** evaluation data is automatically deleted or anonymized after a defined retention period.  
- **Prompt hygiene:** all sensitive text is redacted before storage or sharing.

---

## 4. Reliability & Integrity

- **Workflow versioning:** all n8n workflows and Supabase schemas are version-controlled in Git.  
- **Backups:** daily automated backups via Supabase; weekly exports for redundancy.  
- **Monitoring:** Slack notifications triggered on failed or delayed runs.  
- **Recovery:** documented restore procedure from latest successful backup.

---

## 5. LLM & Agent Governance

- **Transparency:** every evaluation run logs the model, prompt version, and parameters used.  
- **Reproducibility:** outputs and metadata are stored with a unique `run_id`.  
- **Quality control:** a secondary “Evaluator C” agent and manual validation ensure consistency.  
- **Human oversight:** no model decisions are auto-deployed without review.

---

## 6. Third-Party Dependencies

| Service | Purpose | Security Reference |
|----------|----------|--------------------|
| **Supabase** | Database & API hosting | [supabase.com/security](https://supabase.com/security) |
| **n8n** | Workflow automation | [n8n.io/security](https://n8n.io/security) |
| **OpenAI / Anthropic** | LLM inference | [openai.com/security](https://openai.com/security) |
| **Vercel** | Front-end hosting | [vercel.com/security](https://vercel.com/security) |

Each vendor is SOC 2 or ISO 27001 certified and processes only anonymized data.

---

## 7. Incident Response & Reporting

In the event of a suspected security or data integrity issue:
1. The issue is logged and triaged within 24 hours.  
2. Access keys are rotated immediately if credentials are affected.  
3. Stakeholders are notified within 72 hours.  
4. A post-incident review documents root cause and mitigation.

Security incidents can be reported confidentially via **[security@yourdomain.com](mailto:security@yourdomain.com)**.

---

## 8. Roadmap Toward SOC 2 Readiness

- [x] Implement environment isolation and access control  
- [x] Add logging and retention automation  
- [x] Document policies (this file)  
- [ ] Formalize monitoring dashboards  
- [ ] Conduct external security review / penetration test  
- [ ] SOC 2 readiness audit (target → Q2 2026)

---

## 9. Responsible Disclosure

We value the security community’s contributions.  
If you identify a vulnerability, please **do not open a public issue**.  
Contact us privately at **[security@yourdomain.com](mailto:security@yourdomain.com)** — we will respond promptly and responsibly.

---

_This document is for transparency and trust. It does not imply SOC 2 certification, only compliance alignment and readiness._
