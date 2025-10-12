import fetch from "node-fetch";

(async () => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SRK = process.env.SUPABASE_SERVICE_ROLE;

    const params = new URLSearchParams({
      select: "id,status,finished_at,metrics",
      status: "eq.succeeded",
      order: "finished_at.desc",
      limit: "1",
    });

    const url = `${SUPABASE_URL}/rest/v1/agent_runs?${params}`;
    const headers = { apikey: SRK, Authorization: `Bearer ${SRK}` };

    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(await res.text());
    const [row] = await res.json();

    const composite = Number(row?.metrics?.composite ?? 0);
    console.log("Latest composite:", composite);

    if (!Number.isFinite(composite)) {
      console.log("No valid composite yet — skipping gate.");
      process.exit(0);
    }

    if (composite < 0.8) {
      console.error("❌  Quality gate failed (< 0.8)");
      process.exit(1);
    }

    console.log("✅  Quality gate passed (≥ 0.8)");
    process.exit(0);
  } catch (err) {
    console.error("Gate error:", err);
    process.exit(1);
  }
})();
