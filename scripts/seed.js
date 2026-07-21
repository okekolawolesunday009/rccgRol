import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });
import { db } from '../lib/db/index.ts';
import { adminUsers } from '../lib/db/schema.ts';
import bcrypt from 'bcryptjs';

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@rccglp17.org').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || 'change-me';

  const existing = await db.select().from(adminUsers);
  if (existing.length > 0) {
    console.log('Admin user already exists; skipping seed.');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  await db.insert(adminUsers).values({
    email,
    passwordHash,
  });

  console.log(`Seeded admin user: ${email}`);
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
