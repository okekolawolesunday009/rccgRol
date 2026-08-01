import { NextResponse } from 'next/server';
import { db, ensureEventsTable } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    await ensureEventsTable();
    const { eventId, name, email } = await request.json();
    if (!eventId) {
      return NextResponse.json({ error: 'Missing event ID' }, { status: 400 });
    }

    // Increment registeredCount in db
    await db.update(events)
      .set({ registeredCount: sql`${events.registeredCount} + 1` })
      .where(eq(events.id, Number(eventId)));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
