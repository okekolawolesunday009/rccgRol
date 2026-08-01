import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pageSettings } from '@/lib/db/schema';
import { checkAdminAuthApi } from '@/lib/admin-check';
import { sql } from 'drizzle-orm';

const upsertPageSettings = async (page: string, payload: Record<string, any>) => {
  const existing = await db.select().from(pageSettings).where(pageSettings.page.eq(page));
  if (existing.length > 0) {
    await db.update(pageSettings).set({ payload: JSON.stringify(payload), updatedAt: sql`now()` }).where(pageSettings.page.eq(page));
  } else {
    await db.insert(pageSettings).values({ page, payload: JSON.stringify(payload) });
  }
};

export async function GET() {
  try {
    const [row] = await db.select().from(pageSettings).where(pageSettings.page.eq('purpose'));
    if (!row) {
      return NextResponse.json({ page: 'purpose', payload: {} });
    }
    return NextResponse.json(JSON.parse(row.payload));
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load purpose page settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) return auth.response;

  try {
    const payload = await request.json();
    await upsertPageSettings('purpose', payload);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save purpose page settings' }, { status: 500 });
  }
}
