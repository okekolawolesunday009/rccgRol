'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventItem {
  id: number;
  title: string;
  date: string;
  month: string;
  time: string;
  location: string;
  description?: string | null;
  ctaLabel?: string | null;
  imageUrl?: string | null;
  registeredCount?: number | null;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    date: '',
    month: '',
    time: '',
    location: '',
    description: '',
    ctaLabel: 'Register',
    imageUrl: '',
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setForm((prev) => ({ ...prev, imageUrl: data.url }));
        setPreviewImage(data.url);
      } else {
        alert('Failed to upload image');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const newEv = await res.json();
        setEvents((prev) => [newEv, ...prev]);
        setShowAddModal(false);
        setForm({
          title: '',
          date: '',
          month: '',
          time: '',
          location: '',
          description: '',
          ctaLabel: 'Register',
          imageUrl: '',
        });
        setPreviewImage(null);
      } else {
        alert('Failed to create event');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setEvents((prev) => prev.filter((item) => item.id !== id));
        setDeleteConfirmId(null);
      } else {
        alert('Failed to delete event');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting event');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-headline italic font-bold text-white">Events Manager</h1>
          <p className="text-slate-400 text-sm mt-1">Add, review, and delete church events.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 text-slate-950 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-amber-400 transition-colors"
        >
          <span className="material-symbols-outlined text-sm font-bold">add</span>
          Add Event
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-slate-500 border border-slate-800 border-dashed rounded-2xl bg-slate-900/30">
          <span className="material-symbols-outlined text-5xl mb-3 block opacity-40">inbox</span>
          <p className="font-body text-sm">No events found. Add your first event to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-amber-500 font-headline font-bold text-lg leading-none">{event.date}</span>
                  <span className="text-slate-400 text-[8px] uppercase tracking-widest mt-1">{event.month.slice(0, 3)}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-bold text-base truncate">{event.title}</h3>
                  <p className="text-slate-400 text-xs mt-1 truncate">
                    {event.time} • {event.location} • <span className="text-amber-500 font-bold">{event.registeredCount || 0} Registrations</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {deleteConfirmId === event.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(event.id)}
                      disabled={actionLoading}
                      className="text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-widest disabled:opacity-50"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="text-slate-400 hover:text-white text-xs uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(event.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <motion.div
              className="relative z-10 bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800 bg-slate-900/50">
                <h3 className="font-headline text-xl text-white font-bold">Add Church Event</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Easter Youth Retreat"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Day Number *</label>
                    <input
                      type="text"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      placeholder="e.g. 14"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Month Name *</label>
                    <input
                      type="text"
                      required
                      value={form.month}
                      onChange={(e) => setForm({ ...form, month: e.target.value })}
                      placeholder="e.g. MARCH"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Time *</label>
                    <input
                      type="text"
                      required
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      placeholder="e.g. 9:00 AM"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Location *</label>
                    <input
                      type="text"
                      required
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. Main Auditorium"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">CTA Button Label</label>
                  <input
                    type="text"
                    value={form.ctaLabel}
                    onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                    placeholder="Register"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief details of the event..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Event Image</label>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center justify-center w-full border border-dashed border-slate-700 rounded-xl bg-slate-950/70 px-4 py-4 text-sm text-slate-400 cursor-pointer hover:border-amber-500/50 transition-colors">
                      <span>{uploadingImage ? 'Uploading...' : 'Choose image'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>

                    {previewImage ? (
                      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                        <img src={previewImage} alt="Event preview" className="h-40 w-full object-cover" />
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 bg-amber-500 text-slate-950 font-bold py-3 rounded-lg hover:bg-amber-400 transition-all disabled:opacity-50"
                  >
                    {actionLoading ? 'Creating...' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 border border-slate-800 text-slate-400 font-bold py-3 rounded-lg hover:border-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
