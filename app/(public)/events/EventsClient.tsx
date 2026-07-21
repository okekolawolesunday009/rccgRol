'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '@/components/SectionProp';

interface EventData {
  id: number;
  title: string;
  date: string;
  month: string;
  time: string;
  location: string;
  description?: string | null;
  ctaLabel?: string | null;
  registeredCount?: number | null;
  imageUrl?: string | null;
}

export default function EventsClient({ initialEvents }: { initialEvents: EventData[] }) {
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  const handleShare = async (event: EventData) => {
    const shareUrl = `${window.location.origin}/events?id=${event.id}`;
    const shareData = {
      title: event.title,
      text: event.description || event.title,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // user dismissed
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Event link copied to clipboard.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setIsRegistering(true);
    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          name: regName,
          email: regEmail,
        }),
      });

      if (res.ok) {
        setRegSuccess(true);
        // Increment count locally
        selectedEvent.registeredCount = (selectedEvent.registeredCount || 0) + 1;
      } else {
        alert('Failed to register. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const openRegister = (event: EventData) => {
    setSelectedEvent(event);
    setRegSuccess(false);
    setRegName('');
    setRegEmail('');
  };

  return (
    <div>
      {/* Hero Section */}


      <Section bgColor="bg-slate-100" className="py-20 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p className="text-amber-600 uppercase tracking-[0.4em] text-xs font-bold mb-4">
            Upcoming Events
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold italic text-slate-900 mb-6 tracking-tight">
            Join us for transformative spiritual gatherings and community.
          </h1>

        </div>
      </Section>

      {/* Events List */}
      <Section bgColor="bg-white" className="py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="space-y-4">
            {initialEvents.length === 0 ? (
              <div className="text-center py-20 text-slate-500 border border-slate-200 rounded-2xl">
                <span className="material-symbols-outlined text-5xl mb-4">event_busy</span>
                <p>No upcoming events at this time. Check back later!</p>
              </div>
            ) : (
              initialEvents.map((event) => (
                <motion.div
                  key={event.id}
                  id={`event-card-${event.id}`}
                  onClick={() => openRegister(event)}
                  className={`group grid grid-cols-1 ${event.imageUrl ? 'md:grid-cols-[100px_180px_1fr]' : 'md:grid-cols-[100px_1fr]'} gap-6 py-6 border-b border-slate-200 hover:bg-slate-50 transition-all duration-300 px-6 rounded-xl cursor-pointer`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Date Column */}
                  <div className="text-center md:border-r md:border-slate-200 md:pr-6 flex md:flex-col justify-center items-center">
                    <p className="text-amber-600 font-headline text-4xl italic font-bold leading-none">{event.date}</p>
                    <p className="text-slate-500 text-xs uppercase tracking-widest mt-2 ml-2 md:ml-0 font-semibold">
                      {event.month}
                    </p>
                  </div>

                  {/* Image Column */}
                  {event.imageUrl && (
                    <div className="relative aspect-[4/3] md:aspect-video w-full rounded-xl overflow-hidden shadow-sm border border-slate-100 flex-shrink-0 bg-slate-50">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Content Column */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h4 className="font-headline text-2xl text-slate-900 mb-2 group-hover:text-amber-600 transition-colors duration-300 font-bold">
                        {event.title}
                      </h4>
                      {event.description && (
                        <p className="text-slate-600 font-body text-sm mb-4 leading-relaxed font-light line-clamp-2">{event.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.2em] text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-amber-600">schedule</span>
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-amber-600">location_on</span>
                          {event.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openRegister(event);
                        }}
                        className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-400 shadow-sm"
                      >
                        {event.ctaLabel || 'Register'}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(event);
                        }}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 hover:border-slate-300 shadow-sm"
                      >
                        Share
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </Section>

      {/* Registration & Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedEvent(null)} />
            <motion.div
              className="relative z-10 bg-white border border-slate-100 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-8"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              {/* Event Image in Modal */}
              {selectedEvent.imageUrl && (
                <div className="relative aspect-video w-full bg-slate-100 border-b border-slate-100">
                  <img
                    src={selectedEvent.imageUrl}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div>
                  <span className="text-amber-600 text-xs uppercase tracking-widest block mb-2 font-bold">
                    Event Details
                  </span>
                  <h3 className="text-2xl md:text-3xl font-headline italic text-slate-900 font-extrabold tracking-tight">
                    {selectedEvent.title}
                  </h3>
                </div>

                {/* Event Schedule and Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-y border-slate-100 text-sm text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-600">calendar_month</span>
                    <span>{selectedEvent.date} {selectedEvent.month}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-600">schedule</span>
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-600">location_on</span>
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold">About the Event</h4>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm md:text-base font-light">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                {/* Registration Form */}
                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-900 mb-4">Register for this Event</h4>
                  {regSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-6 text-center space-y-3">
                      <span className="material-symbols-outlined text-4xl text-emerald-500 animate-bounce">
                        check_circle
                      </span>
                      <h5 className="font-bold text-lg">Registration Successful!</h5>
                      <p className="text-emerald-700 text-sm font-light">
                        Thank you for registering. We look forward to seeing you at the event!
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-medium">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg text-slate-900 px-4 py-3 focus:outline-none focus:border-amber-500/50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-medium">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="john@example.com"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg text-slate-900 px-4 py-3 focus:outline-none focus:border-amber-500/50"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isRegistering}
                        className="w-full bg-amber-500 text-slate-950 font-bold py-3 rounded-lg hover:bg-amber-400 transition-all disabled:opacity-50 mt-4 shadow-sm"
                      >
                        {isRegistering ? 'Registering...' : selectedEvent.ctaLabel || 'Confirm Registration'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
