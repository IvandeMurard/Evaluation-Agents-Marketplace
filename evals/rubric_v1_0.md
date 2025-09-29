RUBRIC v1.0
- coverage: Are requirements complete? (constraints, edge cases)
- feasibility: Technically doable within constraints?
- risks: Security/PII risks, unsafe failure modes?
- testability: Clear acceptance criteria, retry/idempotency, status codes
- user_value: Helps user reach goal with clear messaging?

CONTEXT
- Brief: {{ $json.brief }}
- Constraints: {{ $json.constraints }}
- Conversation (A↔B): 
{{ $json.conversation }}

Return STRICT JSON with this schema:
{
  "version": "1.0",
  "scores": {
    "coverage": number,
    "feasibility": number,
    "risks": number,
    "testability": number,
    "user_value": number
  },
  "verdict": "pass" | "needs_revision",
  "recommendations": [
    {"title": string, "details": string, "priority": 1|2|3|4|5, "tags": string[]}
  ],
  "evidence": [
    {"turn_index": number, "tag": string, "note": string}
  ]
}
