'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GalleryItem } from '@/types';

interface GalleryAdminItem extends GalleryItem {
  id: number;
}

const defaultForm = {
  category: '',
  caption: '',
  description: '',
  imageUrls: [''],
  displayOrder: 0,
  status: 'published',
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery');
      if (!res.ok) throw new Error('Unable to load gallery items');
      const data = await res.json();
      setItems(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (index: number, file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setForm((prev) => {
        const imageUrls = [...prev.imageUrls];
        imageUrls[index] = data.url;
        return { ...prev, imageUrls };
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const addImageField = () => setForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }));
  const removeImageField = (index: number) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, idx) => idx !== index),
    }));
  };

  const openCreate = () => {
    setEditId(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (item: GalleryAdminItem) => {
    setEditId(item.id);
    setForm({
      category: item.category,
      caption: item.caption,
      description: item.description ?? '',
      imageUrls: item.imageUrls.length > 0 ? item.imageUrls : [''],
      displayOrder: item.displayOrder ?? 0,
      status: item.status ?? 'published',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = { ...form, imageUrls: form.imageUrls.filter(Boolean) };
      const method = editId ? 'PUT' : 'POST';
      const body = editId ? { ...payload, id: editId } : payload;

      const res = await fetch('/api/admin/gallery', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || 'Save failed');
      }

      const saved = await res.json();
      setItems((prev) => {
        if (editId) {
          return prev.map((item) => (item.id === saved.id ? saved : item));
        }
        return [saved, ...prev];
      });
      setShowModal(false);
      setEditId(null);
      setForm(defaultForm);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to save gallery item');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this gallery item?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete gallery item');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-headline italic font-bold">Gallery Manager</h1>
          <p className="text-slate-600 text-sm mt-1">Upload, reorder, and manage sanctuary gallery moments.</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-amber-500 text-slate-950 px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-amber-400 transition"
        >
          Add Gallery Item
        </button>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center text-slate-500 shadow-sm">
          Loading gallery items...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-16 text-center text-rose-700 shadow-sm">
          {error}
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2 items-center mb-3">
                    <span className="text-slate-500 text-xs uppercase tracking-[0.35em]">{item.category}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-600">
                      {item.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">{item.caption}</h2>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2">{item.description}</p>
                  <p className="text-slate-400 text-xs mt-3">{item.imageUrls.length} image(s) • order {item.displayOrder ?? 0}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={actionLoading}
                    className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">{editId ? 'Edit Gallery Item' : 'Add Gallery Item'}</h2>
                  <p className="text-slate-500 text-sm">Upload the images and details shown on the public gallery.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-900">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6 max-h-[75vh] overflow-y-auto">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="font-semibold">Category</span>
                    <input
                      required
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="font-semibold">Caption</span>
                    <input
                      required
                      value={form.caption}
                      onChange={(e) => setForm({ ...form, caption: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500"
                    />
                  </label>
                </div>

                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Description</span>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500"
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="font-semibold">Display Order</span>
                    <input
                      type="number"
                      value={form.displayOrder}
                      onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="font-semibold">Status</span>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </label>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-slate-900">Image URLs</h3>
                    <button
                      type="button"
                      onClick={addImageField}
                      className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200 transition"
                    >
                      Add Image
                    </button>
                  </div>

                  {form.imageUrls.map((imageUrl, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="grid gap-2 md:grid-cols-[1fr_auto] items-start">
                        <input
                          value={imageUrl}
                          onChange={(e) => {
                            const imageUrls = [...form.imageUrls];
                            imageUrls[idx] = e.target.value;
                            setForm({ ...form, imageUrls });
                          }}
                          placeholder="Enter image URL or upload file"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500"
                        />
                        <div className="flex gap-2">
                          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 cursor-pointer hover:bg-slate-100 transition">
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleUpload(idx, e.target.files?.[0] ?? null)}
                            />
                          </label>
                          {form.imageUrls.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeImageField(idx)}
                              className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 hover:bg-rose-100 transition"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>

                      {imageUrl ? (
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">Preview</p>
                          <div className="overflow-hidden rounded-3xl bg-white border border-slate-200">
                            <img
                              src={imageUrl}
                              alt={`Gallery preview ${idx + 1}`}
                              className="h-48 w-full object-cover"
                              onError={(event) => {
                                const target = event.currentTarget as HTMLImageElement;
                                target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 240\'%3E%3Crect width=\'400\' height=\'240\' fill=\'%23f1f5f9\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23626c7a\' font-family=\'Arial, sans-serif\' font-size=\'16\'%3EInvalid image URL%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading || uploading}
                    className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition disabled:opacity-50"
                  >
                    {editId ? 'Save Changes' : 'Create Item'}
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
