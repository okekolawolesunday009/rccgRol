import { db, ensureEventsTable } from '@/lib/db';
import { events } from '@/lib/db/schema';
import EventsClient from './EventsClient';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Ensure fresh data on request

const SITE_URL = 'https://rccgrol-lp17.netlify.app';

const DEFAULT_METADATA: Metadata = {
  title: 'Upcoming Events — RCCG LP17 HQ',
  description: 'Join our upcoming church events, conferences, and special services. Register and share with friends.',
};

function normalizeUrl(url?: string | null) {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return url.startsWith('/') ? `${SITE_URL}${url}` : `${SITE_URL}/${url}`;
}

export async function generateMetadata(props: any): Promise<Metadata> {
  try {
    await ensureEventsTable();
    const searchParams = await Promise.resolve(props?.searchParams);
    const idValue = Array.isArray(searchParams?.id)
      ? searchParams.id[0]
      : typeof searchParams?.id === 'string'
      ? searchParams.id
      : undefined;
    const eventId = idValue ? Number(idValue) : NaN;
    if (Number.isNaN(eventId)) {
      return DEFAULT_METADATA;
    }

    const [event] = await db.select().from(events).where(eq(events.id, eventId));
    if (!event) {
      return DEFAULT_METADATA;
    }

    const imageUrl = normalizeUrl(event.imageUrl || undefined);
    const pageUrl = `${SITE_URL}/events?id=${eventId}`;
    const description: string = event.description ?? DEFAULT_METADATA.description ?? '';

    return {
      title: `${event.title} — RCCG LP17 HQ`,
      description,
      openGraph: {
        title: event.title,
        description,
        url: pageUrl,
        type: 'website',
        images: imageUrl ? [{ url: imageUrl, alt: event.title }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: event.title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch (error) {
    return DEFAULT_METADATA;
  }
}

export default async function EventsPage() {
  await ensureEventsTable();
  const list = await db.select().from(events).where(eq(events.isPublic, true));
  
  // Format dates / types if necessary for serialization
  const serializedEvents = list.map(item => ({
    ...item,
    id: item.id, // Keep as number
    createdAt: item.createdAt?.toISOString(),
  }));

  const publicEvents = serializedEvents.filter((event) => event.isPublic !== false);
  return <EventsClient initialEvents={publicEvents} />;
}
