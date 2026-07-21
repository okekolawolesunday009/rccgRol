import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema.ts';
import { getSslConfig } from './ssl.ts';

const connectionString = process.env.DATABASE_URL;

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle<typeof schema>> | undefined;
};

export const db =
  globalForDb.db ??
  drizzle(
    new Pool({
      connectionString,
      ssl: getSslConfig(),
    }),
    { schema }
  );

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
