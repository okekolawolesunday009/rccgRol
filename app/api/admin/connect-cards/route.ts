import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { connectCards } from '@/lib/db/schema';
import { checkAdminAuthApi } from '@/lib/admin-check';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) return auth.response;

  try {
    const list = await db
      .select()
      .from(connectCards)
      .orderBy(desc(connectCards.createdAt));
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await db.delete(connectCards).where(eq(connectCards.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });

    const [updated] = await db
      .update(connectCards)
      .set({ status })
      .where(eq(connectCards.id, Number(id)))
      .returning();
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
