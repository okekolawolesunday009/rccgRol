const fs = require('fs');
const { Pool } = require('pg');

const envLines = fs.readFileSync('.env.local', 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .filter((line) => !line.trim().startsWith('#'));

const env = Object.fromEntries(
  envLines.map((line) => {
    const idx = line.indexOf('=');
    return [line.slice(0, idx), line.slice(idx + 1)];
  })
);

const pool = new Pool({ connectionString: env.DATABASE_URL });

(async () => {
  const cols = await pool.query(
    "select column_name, data_type, is_nullable, column_default from information_schema.columns where table_schema='public' and table_name='events' order by ordinal_position"
  );
  const cons = await pool.query(
    "select tc.constraint_name, tc.constraint_type, kcu.column_name, pg_get_constraintdef(con.oid) as definition from pg_constraint con join information_schema.table_constraints tc on con.conname = tc.constraint_name and con.connamespace = tc.table_schema::regnamespace join information_schema.key_column_usage kcu on kcu.constraint_name = tc.constraint_name and kcu.constraint_schema = tc.constraint_schema where tc.table_schema='public' and tc.table_name='events';"
  );
  const idxs = await pool.query(
    "select indexname, indexdef from pg_indexes where schemaname='public' and tablename='events';"
  );

  console.log(JSON.stringify({ cols: cols.rows, cons: cons.rows, idxs: idxs.rows }, null, 2));
  await pool.end();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
