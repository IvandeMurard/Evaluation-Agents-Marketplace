import fetch from 'node-fetch';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SRK = process.env.SUPABASE_SERVICE_ROLE; // Secret key

const url = `${SUPABASE_URL}/rest/v1/run_dashboard?order=created_at.desc&limit=1`;
const headers = { apikey: SRK, Authorization: `Bearer ${SRK}` };

const res = await fetch(url, { headers });
if (!res.ok) {
  console.error('Fetch error', res.status, await res.text());
  process.exit(1);
}

const rows = await res.json();
const composite = rows?.[0]?.metrics?.composite ?? 0;

console.log('Latest composite =', composite);
if (composite < 0.8) {
  console.error('Quality gate failed (< 0.8).');
  process.exit(1);
}

console.log('Quality gate passed (>= 0.8).');
