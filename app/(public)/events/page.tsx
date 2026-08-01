import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import EventsClient from './EventsClient';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Ensure fresh data on request

const DEFAULT_METADATA: Metadata = {
  title: 'Upcoming Events — RCCG LP17 HQ',
  description: 'Join our upcoming church events, conferences, and special services. Register and share with friends.',
};

export async function generateMetadata(props: any): Promise<Metadata> {
  const searchParams = props?.searchParams as { id?: string };
  const eventId = searchParams?.id ? Number(searchParams.id) : NaN;
  if (Number.isNaN(eventId)) {
    return DEFAULT_METADATA;
  }

  const [event] = await db.select().from(events).where(eq(events.id, eventId));
  if (!event) {
    return DEFAULT_METADATA;
  }

  const imageUrl = event.imageUrl || undefined;
  const pageUrl = `https://rccgrol-lp17.netlify.app/events?id=${eventId}`;

  return {
    title: `${event.title} — RCCG LP17 HQ`,
    description: event.description || DEFAULT_METADATA.description,
    openGraph: {
      title: event.title,
      description: event.description || DEFAULT_METADATA.description,
      url: pageUrl,
      type: 'website',
      images: imageUrl ? [{ url: imageUrl, alt: event.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description || DEFAULT_METADATA.description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function EventsPage() {
  const list = await db.select().from(events);
  
  // Format dates / types if necessary for serialization
  const serializedEvents = list.map(item => ({
    ...item,
    id: item.id, // Keep as number
    createdAt: item.createdAt?.toISOString(),
  }));

  return <EventsClient initialEvents={serializedEvents} />;
}
