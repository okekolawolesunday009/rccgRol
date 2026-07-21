import { NextResponse } from 'next/server';
import { db, ensureContactTable } from '@/lib/db';
import { contactmessages } from '@/lib/db/schema';
import { sendContactNotification } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }
    await ensureContactTable();

    const [newMsg] = await db
      .insert(contactmessages)
      .values({ name, email, phone: phone || null, subject: subject || null, message })
      .returning();

    // Send email notification non-blocking
    sendContactNotification({ name, email, phone, subject, message }).catch(console.error);

    return NextResponse.json({ success: true, id: newMsg.id });
  } catch (error: any) {
    console.error('[api/contact] POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send message.' }, { status: 500 });
  }
}

