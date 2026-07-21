import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';
import { setSession } from '@/lib/admin-auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const requestedEmail = String(email).trim().toLowerCase();
    const requestedPassword = String(password);
    const configuredSeedEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
    const configuredSeedPassword = process.env.SEED_ADMIN_PASSWORD?.trim();
    const seedEmail = configuredSeedEmail || requestedEmail;
    const seedPassword = configuredSeedPassword || requestedPassword;

    const admins = await db.select().from(adminUsers);
    let admin = admins.find((candidate) => candidate.email.toLowerCase() === requestedEmail);

    if (!admin && admins.length === 0 && requestedEmail === seedEmail && seedPassword) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(seedPassword, salt);
      const [newAdmin] = await db.insert(adminUsers).values({
        email: seedEmail,
        passwordHash,
      }).returning();
      admin = newAdmin;
    }

    if (!admin) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(requestedPassword, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    await setSession({ userId: admin.id, email: admin.email });
    return NextResponse.json({ success: true, user: { email: admin.email } });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
