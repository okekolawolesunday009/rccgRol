import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { partners } from '@/lib/db/schema';
import { checkAdminAuthApi } from '@/lib/admin-check';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const list = await db.select().from(partners);
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch partners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const { name, logo, description, website, status } = body;

    if (!name) {
      return NextResponse.json({ error: 'Partner name is required' }, { status: 400 });
    }

    const [newPartner] = await db.insert(partners).values({
      name,
      logo,
      description,
      website,
      status: status || 'active',
    }).returning();

    return NextResponse.json(newPartner);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create partner' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing partner ID' }, { status: 400 });
    }

    await db.delete(partners).where(eq(partners.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete partner' }, { status: 500 });
  }
}
