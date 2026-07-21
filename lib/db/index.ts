import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';
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

export async function ensureConnectCardsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS connect_cards (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      visitor_type TEXT DEFAULT 'first-time',
      interests TEXT[],
      message TEXT,
      status TEXT DEFAULT 'new',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);
}

export async function ensureContactTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS contactmessages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT,
      status TEXT DEFAULT 'new',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    ALTER TABLE contactmessages ADD COLUMN IF NOT EXISTS subject TEXT;
  `);
}

