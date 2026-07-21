import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { audioSermons, videoSermons } from '@/lib/db/schema';
import { checkAdminAuthApi } from '@/lib/admin-check';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'audio' | 'video' | null

    if (type === 'audio') {
      const audios = await db.select().from(audioSermons);
      return NextResponse.json(audios);
    } else if (type === 'video') {
      const videos = await db.select().from(videoSermons);
      return NextResponse.json(videos);
    }

    // Default to both
    const audios = await db.select().from(audioSermons);
    const videos = await db.select().from(videoSermons);
    return NextResponse.json({ audios, videos });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch sermons' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const { type, title, speaker, audioUrl, videoUrl, duration, date, description, series, thumbnail } = body;

    if (!type || !title) {
      return NextResponse.json({ error: 'Type and Title are required' }, { status: 400 });
    }

    if (type === 'audio') {
      if (!audioUrl || !speaker) {
        return NextResponse.json({ error: 'Audio URL and Speaker are required' }, { status: 400 });
      }
      const [newAudio] = await db.insert(audioSermons).values({
        title,
        speaker,
        audioUrl,
        duration,
        date,
        description,
        series,
      }).returning();
      return NextResponse.json(newAudio);
    } else if (type === 'video') {
      if (!videoUrl) {
        return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
      }
      const [newVideo] = await db.insert(videoSermons).values({
        title,
        speaker,
        videoUrl,
        thumbnail,
        duration,
        date,
        description,
      }).returning();
      return NextResponse.json(newVideo);
    }

    return NextResponse.json({ error: 'Invalid sermon type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create sermon' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });
    }

    if (type === 'audio') {
      await db.delete(audioSermons).where(eq(audioSermons.id, Number(id)));
      return NextResponse.json({ success: true });
    } else if (type === 'video') {
      await db.delete(videoSermons).where(eq(videoSermons.id, Number(id)));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid sermon type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete sermon' }, { status: 500 });
  }
}
