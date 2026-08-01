import { NextResponse } from 'next/server';
import { db, ensureGalleryItemsTable } from '@/lib/db';
import { galleryItems } from '@/lib/db/schema';
import { checkAdminAuthApi } from '@/lib/admin-check';
import { eq } from 'drizzle-orm';

// Gallery items store only image URLs in the DB.
// Actual image files are uploaded through /api/admin/upload and hosted via Cloudinary.
export async function GET() {
  try {
    await ensureGalleryItemsTable();
    const items = await db.select().from(galleryItems).orderBy(galleryItems.displayOrder);
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch gallery items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    await ensureGalleryItemsTable();
    const body = await request.json();
    const { category, caption, description, imageUrls, displayOrder, status } = body;

    if (!category || !caption || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json({ error: 'Missing required gallery fields' }, { status: 400 });
    }

    const [newItem] = await db.insert(galleryItems).values({
      category,
      caption,
      description,
      imageUrls,
      displayOrder: displayOrder ?? 0,
      status: status || 'published',
    }).returning();

    return NextResponse.json(newItem);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create gallery item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    await ensureGalleryItemsTable();
    const body = await request.json();
    const { id, category, caption, description, imageUrls, displayOrder, status } = body;

    if (!id || !category || !caption || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json({ error: 'Missing required gallery fields or id' }, { status: 400 });
    }

    const [updatedItem] = await db.update(galleryItems)
      .set({
        category,
        caption,
        description,
        imageUrls,
        displayOrder: displayOrder ?? 0,
        status: status || 'published',
      })
      .where(eq(galleryItems.id, Number(id)))
      .returning();

    return NextResponse.json(updatedItem);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update gallery item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    await ensureGalleryItemsTable();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing gallery item ID' }, { status: 400 });
    }

    await db.delete(galleryItems).where(eq(galleryItems.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete gallery item' }, { status: 500 });
  }
}
