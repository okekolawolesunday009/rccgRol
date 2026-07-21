import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import EventsClient from './EventsClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Ensure fresh data on request

export const metadata: Metadata = {
  title: 'Upcoming Events — RCCG LP17 HQ',
  description: 'Join our upcoming church events, conferences, and special services. Register and share with friends.',
};

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
