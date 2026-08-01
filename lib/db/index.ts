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

export async function ensureGiveSettingsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS give_page_settings (
      id SERIAL PRIMARY KEY,
      hero_title TEXT NOT NULL,
      hero_subtitle TEXT NOT NULL,
      hero_description TEXT NOT NULL,
      thank_you_headline TEXT NOT NULL,
      thank_you_copy TEXT NOT NULL,
      donation_details TEXT NOT NULL DEFAULT '[]',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
}

export async function ensureEventsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      month TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT,
      cta_label TEXT DEFAULT 'Register',
      image_url TEXT,
      registration_open BOOLEAN NOT NULL DEFAULT true,
      is_public BOOLEAN NOT NULL DEFAULT true,
      registered_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  await db.execute(sql`
    ALTER TABLE events
      ADD COLUMN IF NOT EXISTS cta_label TEXT DEFAULT 'Register',
      ADD COLUMN IF NOT EXISTS image_url TEXT,
      ADD COLUMN IF NOT EXISTS registration_open BOOLEAN NOT NULL DEFAULT true,
      ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true,
      ADD COLUMN IF NOT EXISTS registered_count INTEGER DEFAULT 0;
  `);
}

export async function ensureFirstTimeVisitorsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS first_time_visitors (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      email TEXT,
      gender TEXT,
      date_of_birth TEXT,
      home_address TEXT,
      city TEXT,
      state TEXT,
      first_time TEXT NOT NULL DEFAULT 'yes',
      visit_date TEXT NOT NULL,
      service_attended TEXT,
      invitation_source TEXT,
      invited TEXT,
      invited_by TEXT,
      prayer_request TEXT,
      contact_permission TEXT,
      preferred_contact_method TEXT,
      additional_comments TEXT,
      follow_up_status TEXT NOT NULL DEFAULT 'New',
      created_by TEXT NOT NULL DEFAULT 'public',
      updated_by TEXT NOT NULL DEFAULT 'public',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
}

export async function ensureVisitorNotesTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS visitor_notes (
      id SERIAL PRIMARY KEY,
      visitor_id INTEGER NOT NULL,
      note TEXT NOT NULL,
      admin_name TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
}

export async function ensurePageSettingsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS page_settings (
      id SERIAL PRIMARY KEY,
      page TEXT NOT NULL UNIQUE,
      payload TEXT NOT NULL DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
}

