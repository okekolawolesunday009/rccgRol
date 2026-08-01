import { NextResponse } from 'next/server';
import { db, ensureEventsTable } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { checkAdminAuthApi } from '@/lib/admin-check';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    await ensureEventsTable();
    const list = await db.select().from(events);
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    await ensureEventsTable();
    const body = await request.json();
    const { title, date, month, time, location, description, ctaLabel, imageUrl, registrationOpen, isPublic } = body;

    if (!title || !date || !month || !time || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [newEvent] = await db.insert(events).values({
      title,
      date,
      month,
      time,
      location,
      description,
      ctaLabel: ctaLabel || 'Register',
      imageUrl: imageUrl || null,
      registrationOpen: registrationOpen ?? true,
      isPublic: isPublic ?? true,
      registeredCount: 0,
    }).returning();

    return NextResponse.json(newEvent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create event' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    await ensureEventsTable();
    const body = await request.json();
    const { id, title, date, month, time, location, description, ctaLabel, imageUrl, registrationOpen, isPublic } = body;

    if (!id || !title || !date || !month || !time || !location) {
      return NextResponse.json({ error: 'Missing required fields or id' }, { status: 400 });
    }

    const [updatedEvent] = await db.update(events)
      .set({
        title,
        date,
        month,
        time,
        location,
        description,
        ctaLabel: ctaLabel || 'Register',
        imageUrl: imageUrl || null,
        registrationOpen: registrationOpen ?? true,
        isPublic: isPublic ?? true,
      })
      .where(eq(events.id, Number(id)))
      .returning();

    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    await ensureEventsTable();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing event ID' }, { status: 400 });
    }

    await db.delete(events).where(eq(events.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete event' }, { status: 500 });
  }
}
