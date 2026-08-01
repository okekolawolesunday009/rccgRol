'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { ChurchEvent } from '../../types';

const MONTH_INDEX: Record<string, number> = {
  JANUARY: 0,
  FEBRUARY: 1,
  MARCH: 2,
  APRIL: 3,
  MAY: 4,
  JUNE: 5,
  JULY: 6,
  AUGUST: 7,
  SEPTEMBER: 8,
  OCTOBER: 9,
  NOVEMBER: 10,
  DECEMBER: 11,
};

function parseEventDate(event: ChurchEvent) {
  const month = MONTH_INDEX[event.month.toUpperCase()] ?? 0;
  const day = Number(event.date) || 1;
  const [hourPart, minutePart] = event.time.split(/[: ]/).filter(Boolean);
  const timeParts = event.time.toUpperCase().includes('PM')
    ? [Number(hourPart) % 12 + 12, Number(minutePart) || 0]
    : [Number(hourPart) || 0, Number(minutePart) || 0];

  const now = new Date();
  let eventDate = new Date(now.getFullYear(), month, day, timeParts[0], timeParts[1], 0);
  if (eventDate.getTime() <= now.getTime()) {
    eventDate = new Date(now.getFullYear() + 1, month, day, timeParts[0], timeParts[1], 0);
  }

  return eventDate;
}

export default function EventTab() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/admin/events');
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (err) {
        console.error('Failed to load events', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const activeEvent = useMemo(() => {
    if (!events.length) return null;

    const now = new Date();
    const upcomingEvents = events
      .map((event) => ({ event, date: parseEventDate(event) }))
      .filter(({ date }) => date.getTime() >= now.getTime())
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return upcomingEvents.length > 0 ? upcomingEvents[0].event : events[0];
  }, [events]);

  if (loading) {
    return (
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-xl">
          <div className="text-center text-sm text-slate-500">Loading events...</div>
        </div>
      </section>
    );
  }

  if (!activeEvent) {
    return null;
  }

  return (
    <motion.section
      className="px-3 py-10 bg-slate-50"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >

       <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-amber-400 uppercase tracking-[0.35em] text-xs font-semibold mb-3">
            Featured Events
          </p>
          <h2 className="text-4xl text-black md:text-5xl font-headline font-extrabold tracking-tight">
            Join the moments that matter most.
          </h2>
          <p className="mt-4 text-slate-500 text-sm md:text-base leading-7">
            Explore our top upcoming events with the same clean presentation used on the events page.
          </p>
        </div>
      <div className="max-w-5xl mx-auto">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="relative overflow-hidden bg-slate-100">
              {activeEvent.imageUrl ? (
                <img
                  src={activeEvent.imageUrl}
                  alt={activeEvent.title}
                  className="h-full min-h-[280px] w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center bg-slate-200 text-slate-500">
                  <span className="text-sm uppercase tracking-[0.25em]">No image available</span>
                </div>
              )}
            </div>

            <div className="space-y-6 p-8 md:p-10">
              <div className="inline-flex items-center gap-3 rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
                <span>{activeEvent.month.slice(0, 3)} {activeEvent.date}</span>
                <span className="text-slate-400">·</span>
                <span>{activeEvent.time}</span>
              </div>

              <div>
                <h2 className="text-3xl font-headline font-bold text-slate-950 tracking-tight">
                  {activeEvent.title}
                </h2>
                {activeEvent.description ? (
                  <p className="mt-4 text-slate-600 leading-8 text-sm md:text-base">
                    {activeEvent.description}
                  </p>
                ) : (
                  <p className="mt-4 text-slate-500 text-sm md:text-base">
                    Join us for this upcoming event and discover more on the events page.
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Time</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{activeEvent.time}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Location</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{activeEvent.location}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/events"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  View all events
                </a>
                <span className="text-sm text-slate-500">Featured event preview</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
