'use client';

import Link from 'next/link';
import Section from '@/components/SectionProp';
import type { ChurchEvent } from '@/types';

interface FeaturedEventsProps {
  featuredEvents: ChurchEvent[];
}

export default function FeaturedEvents({ featuredEvents }: FeaturedEventsProps) {
  if (!featuredEvents || featuredEvents.length === 0) {
    return null;
  }

  return (
    <Section bgColor="bg-slate-950" className="py-24">
      <div className="max-w-6xl mx-auto px-6 text-white">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-amber-400 uppercase tracking-[0.35em] text-xs font-semibold mb-3">
            Featured Events
          </p>
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight">
            Join the moments that matter most.
          </h2>
          <p className="mt-4 text-slate-300 text-sm md:text-base leading-7">
            Explore our top upcoming events with the same clean presentation used on the events page.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
          {featuredEvents.map((event) => (
            <Link
              href={`/events?id=${event.id}`}
              key={event.id}
              className="group grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-amber-500/30"
            >
              {event.imageUrl ? (
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-800 shadow-inner">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-3xl bg-slate-800 text-slate-400">
                  <span className="text-sm uppercase tracking-[0.28em]">No image</span>
                </div>
              )}

              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em] text-amber-300 font-bold mb-3">
                    <span>{event.month.slice(0, 3)}</span>
                    <span>{event.date}</span>
                    {event.featured ? (
                      <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-200">Featured</span>
                    ) : null}
                  </div>

                  <h3 className="font-headline text-2xl font-bold text-white tracking-tight">
                    {event.title}
                  </h3>
                  {event.description ? (
                    <p className="mt-3 text-slate-300 text-sm leading-7 line-clamp-3">
                      {event.description}
                    </p>
                  ) : null}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 text-sm text-slate-400">
                    <div className="rounded-3xl bg-slate-950/70 px-4 py-3">
                      <span className="block text-slate-400 text-[0.65rem] uppercase tracking-[0.28em] mb-2">When</span>
                      <p>{event.time}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950/70 px-4 py-3">
                      <span className="block text-slate-400 text-[0.65rem] uppercase tracking-[0.28em] mb-2">Where</span>
                      <p>{event.location}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.35em] text-slate-400">
                    {event.ctaLabel || 'Register'}
                  </span>
                  <span className="inline-flex items-center gap-2 text-amber-300 font-semibold">
                    View details
                    <span className="material-symbols-outlined text-base">east</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/events"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-black/10 transition hover:bg-slate-100"
          >
            Browse all events
          </Link>
        </div>
      </div>
    </Section>
  );
}
