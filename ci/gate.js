// ci/gate.js
// Node 18+ (fetch natif)

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE } = process.env;

const headers = {
  apikey: SUPABASE_SERVICE_ROLE,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE}`,
  Accept: 'application/json',
};

const fail = (msg) => {
  console.error(`❌ Quality gate failed: ${msg}`);
  process.exit(1);
};
const pass = (msg) => {
  console.log(`✅ Quality gate passed: ${msg}`);
  process.exit(0);
};

(async () => {
  try {
    // 1) Dernier run
    const r1 = await fetch(
      `${SUPABASE_URL}/rest/v1/agent_runs?select=id,metrics&order=created_at.desc&limit=1`,
      { headers }
    );
    const runs = await r1.json();
    if (!runs.length) fail('No agent_runs found.');
    const { id: runId, metrics = {} } = runs[0] ?? {};
    const composite = Number(metrics?.composite ?? 0);

    console.log('Run:', runId);
    console.log('Composite:', composite);

    // 2) Issues critiques (PII, Retry/Idempotency)
    const criticalTags = ['pii', 'retry_idem'];
    const r2 = await fetch(
      `${SUPABASE_URL}/rest/v1/run_issues?select=tag,severity&run_id=eq.${runId}`,
      { headers }
    );
    const issues = await r2.json();

    const hasCritical = issues.some((i) =>
      criticalTags.includes(String(i.tag || '').toLowerCase())
    );

    // 3) Règle de décision
    if (hasCritical) fail(`critical issue present (${criticalTags.join(', ')})`);
    if (Number.isNaN(composite)) fail('composite is NaN');
    if (composite < 0.8) fail(`composite ${composite} < 0.8`);

    pass(`composite ${composite} ≥ 0.8 and no critical issues.`);
  } catch (e) {
    fail(e?.message || String(e));
  }
})();
