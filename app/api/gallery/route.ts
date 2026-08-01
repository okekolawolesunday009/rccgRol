import { NextResponse } from 'next/server';
import { db, ensureGalleryItemsTable } from '@/lib/db';
import { galleryItems } from '@/lib/db/schema';

export async function GET() {
  try {
    await ensureGalleryItemsTable();
    const items = await db.select().from(galleryItems).orderBy(galleryItems.displayOrder);
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load gallery items' }, { status: 500 });
  }
}
