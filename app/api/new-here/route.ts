import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { connectCards } from '@/lib/db/schema';
import { sendConnectCardNotification } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, visitorType, interests, message } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const [newCard] = await db
      .insert(connectCards)
      .values({
        name,
        email,
        phone: phone || null,
        visitorType: visitorType || 'first-time',
        interests: Array.isArray(interests) ? interests : [],
        message: message || null,
      })
      .returning();

    // Send email notification — non-blocking
    await sendConnectCardNotification({ name, email, phone, visitorType, interests, message });

    return NextResponse.json({ success: true, id: newCard.id });
  } catch (error: any) {
    console.error('[api/new-here] POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit connect card.' }, { status: 500 });
  }
}
