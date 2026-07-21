import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletter } from '@/lib/db/schema';
import { checkAdminAuthApi } from '@/lib/admin-check';
import { eq } from 'drizzle-orm';

// GET list of subscribers (Admin only)
export async function GET() {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    const list = await db.select().from(newsletter);
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch newsletter list' }, { status: 500 });
  }
}

// POST new subscription (Public)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const [newSubscriber] = await db.insert(newsletter).values({
      email: email.toLowerCase(),
      status: 'subscribed',
    }).returning();

    return NextResponse.json({ success: true, subscriber: newSubscriber });
  } catch (error: any) {
    // If user is already subscribed, just return success
    if (error.code === '23505' || error.message?.includes('unique')) {
      return NextResponse.json({ success: true, message: 'Already subscribed' });
    }
    return NextResponse.json({ error: error.message || 'Failed to subscribe' }, { status: 500 });
  }
}

// DELETE subscription (Admin only)
export async function DELETE(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing subscriber ID' }, { status: 400 });
    }

    await db.delete(newsletter).where(eq(newsletter.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete subscriber' }, { status: 500 });
  }
}
