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
  registrationOpen?: boolean | null;
  isPublic?: boolean | null;
  featured?: boolean | null;
  displayOrder?: number | null;
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
    registrationOpen: true,
    isPublic: true,
    featured: false,
    displayOrder: 0,
    imageUrl: '',
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
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

  const resetForm = () => {
    setForm({
      title: '',
      date: '',
      month: '',
      time: '',
      location: '',
      description: '',
      ctaLabel: 'Register',
      registrationOpen: true,
      isPublic: true,
      featured: false,
      displayOrder: 0,
      imageUrl: '',
    });
    setPreviewImage(null);
    setEditingEventId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (event: EventItem) => {
    setEditingEventId(event.id);
    setForm({
      title: event.title,
      date: event.date,
      month: event.month,
      time: event.time,
      location: event.location,
      description: event.description || '',
      ctaLabel: event.ctaLabel || 'Register',
      registrationOpen: event.registrationOpen ?? true,
      isPublic: event.isPublic ?? true,
      featured: event.featured ?? false,
      displayOrder: event.displayOrder ?? 0,
      imageUrl: event.imageUrl || '',
    });
    setPreviewImage(event.imageUrl || null);
    setShowAddModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const method = editingEventId ? 'PUT' : 'POST';
      const body = editingEventId ? { ...form, id: editingEventId } : form;
      const res = await fetch('/api/admin/events', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const savedEvent = await res.json();
        if (editingEventId) {
          setEvents((prev) => prev.map((item) => (item.id === savedEvent.id ? savedEvent : item)));
        } else {
          setEvents((prev) => [savedEvent, ...prev]);
        }
        setShowAddModal(false);
        resetForm();
      } else {
        const errorData = await res.json();
        alert(errorData?.error || 'Failed to save event');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving event');
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
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-headline italic font-bold text-slate-950">Events Manager</h1>
          <p className="text-slate-600 text-sm mt-1">Add, review, and publish upcoming church events.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-amber-500 text-slate-950 px-4 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-amber-400 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Event
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-slate-500 border border-slate-200 border-dashed rounded-3xl bg-white shadow-sm">
          <span className="material-symbols-outlined text-5xl mb-3 block text-slate-400">inbox</span>
          <p className="font-body text-sm">No events found. Add your first event to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-200 rounded-3xl p-6 hover:border-slate-300 transition-all gap-4 shadow-sm"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-3xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-amber-500 font-headline font-bold text-lg leading-none">{event.date}</span>
                  <span className="text-slate-500 text-[9px] uppercase tracking-widest mt-1">{event.month.slice(0, 3)}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-slate-950 font-bold text-base truncate">{event.title}</h3>
                    {event.featured ? (
                      <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] font-bold">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="text-slate-500 text-xs mt-1 truncate">
                    {event.time} • {event.location} • <span className="text-amber-500 font-bold">{event.registeredCount || 0} Registrations</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openEditModal(event)}
                    className="text-slate-600 hover:text-amber-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>

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
                        className="text-slate-500 hover:text-slate-900 text-xs uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(event.id)}
                      className="text-slate-500 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <motion.div
              className="relative z-10 bg-white border border-slate-200 rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200 bg-slate-50">
                <h3 className="font-headline text-xl text-slate-950 font-bold">
                  {editingEventId ? 'Edit Church Event' : 'Add Church Event'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-500 hover:text-slate-900"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto bg-slate-50">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Easter Youth Retreat"
                    className="w-full bg-white border border-slate-200 rounded-2xl text-slate-950 px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Day Number *</label>
                    <input
                      type="text"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      placeholder="e.g. 14"
                      className="w-full bg-white border border-slate-200 rounded-2xl text-slate-950 px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Month Name *</label>
                    <input
                      type="text"
                      required
                      value={form.month}
                      onChange={(e) => setForm({ ...form, month: e.target.value })}
                      placeholder="e.g. MARCH"
                      className="w-full bg-white border border-slate-200 rounded-2xl text-slate-950 px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Time *</label>
                    <input
                      type="text"
                      required
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      placeholder="e.g. 9:00 AM"
                      className="w-full bg-white border border-slate-200 rounded-2xl text-slate-950 px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Location *</label>
                    <input
                      type="text"
                      required
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. Main Auditorium"
                      className="w-full bg-white border border-slate-200 rounded-2xl text-slate-950 px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="flex items-center gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.registrationOpen}
                      onChange={(e) => setForm({ ...form, registrationOpen: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 bg-white text-amber-500 focus:ring-amber-500"
                    />
                    Open registrations
                  </label>
                  <label className="flex items-center gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.isPublic}
                      onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 bg-white text-amber-500 focus:ring-amber-500"
                    />
                    Public event
                  </label>
                  <label className="flex items-center gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 bg-white text-amber-500 focus:ring-amber-500"
                    />
                    Featured on home
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Home Display Order</label>
                    <input
                      type="number"
                      min={0}
                      value={form.displayOrder}
                      onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded-2xl text-slate-950 px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">CTA Button Label</label>
                  <input
                    type="text"
                    value={form.ctaLabel}
                    onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                    placeholder="Register"
                    className="w-full bg-white border border-slate-200 rounded-2xl text-slate-950 px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief details of the event..."
                    className="w-full bg-white border border-slate-200 rounded-2xl text-slate-950 px-4 py-2.5 focus:outline-none focus:border-amber-500/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Event Image</label>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center justify-center w-full border border-dashed border-slate-200 rounded-2xl bg-slate-100 px-4 py-4 text-sm text-slate-500 cursor-pointer hover:border-amber-500/50 transition-colors">
                      <span>{uploadingImage ? 'Uploading...' : 'Choose image'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>

                    {previewImage ? (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        <img src={previewImage} alt="Event preview" className="h-40 w-full object-cover" />
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 bg-amber-500 text-slate-950 font-bold py-3 rounded-2xl hover:bg-amber-400 transition-all disabled:opacity-50"
                  >
                    {actionLoading ? (editingEventId ? 'Saving...' : 'Creating...') : editingEventId ? 'Save Changes' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-2xl hover:border-slate-300 transition-all"
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
