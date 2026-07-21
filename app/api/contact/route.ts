import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactMessages } from '@/lib/db/schema';
import { sendContactNotification } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const [newMsg] = await db
      .insert(contactMessages)
      .values({ name, email, phone: phone || null, subject: subject || null, message })
      .returning();

    // Send email notification — non-blocking, won't fail the request
    await sendContactNotification({ name, email, phone, subject, message });

    return NextResponse.json({ success: true, id: newMsg.id });
  } catch (error: any) {
    console.error('[api/contact] POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send message.' }, { status: 500 });
  }
}
