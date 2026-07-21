'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PartnerItem {
  id: number;
  name: string;
  logo?: string | null;
  description?: string | null;
  website?: string | null;
  status: string;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    logo: '',
    description: '',
    website: '',
    status: 'active',
  });
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/partners');
      if (res.ok) {
        const data = await res.json();
        setPartners(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, logo: data.url }));
        alert('Logo uploaded successfully!');
      } else {
        alert('Failed to upload logo');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const newPartner = await res.json();
        setPartners((prev) => [newPartner, ...prev]);
        setShowAddModal(false);
        setForm({
          name: '',
          logo: '',
          description: '',
          website: '',
          status: 'active',
        });
      } else {
        alert('Failed to add partner');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding partner');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/partners?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPartners((prev) => prev.filter((item) => item.id !== id));
        setDeleteConfirmId(null);
      } else {
        alert('Failed to delete partner');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting partner');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-headline italic font-bold text-white">Partners Directory</h1>
          <p className="text-slate-400 text-sm mt-1">Manage partner ministries, donors and NGOs.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 text-slate-950 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-amber-400 transition-colors"
        >
          <span className="material-symbols-outlined text-sm font-bold">add</span>
          Add Partner
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm">Loading partners...</p>
        </div>
      ) : partners.length === 0 ? (
        <div className="text-center py-20 text-slate-500 border border-slate-800 border-dashed rounded-2xl bg-slate-900/30">
          <span className="material-symbols-outlined text-5xl mb-3 block opacity-40">handshake</span>
          <p className="font-body text-sm">No partners added yet. Add one to show partner associations!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all gap-4"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                      <span className="material-symbols-outlined text-xl">handshake</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{partner.name}</h3>
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-500 text-xs hover:underline mt-0.5 inline-block"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
                {partner.description && (
                  <p className="text-slate-300 text-sm leading-relaxed">{partner.description}</p>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-slate-850 pt-4 mt-auto">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                  partner.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {partner.status}
                </span>

                {deleteConfirmId === partner.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(partner.id)}
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
                    onClick={() => setDeleteConfirmId(partner.id)}
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
              className="relative z-10 bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800 bg-slate-900/50">
                <h3 className="font-headline text-xl text-white font-bold">Add Partner</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Partner Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Compassion International"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Logo Image</label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="text"
                      value={form.logo}
                      onChange={(e) => setForm({ ...form, logo: e.target.value })}
                      placeholder="https://cloudinary.url/..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50 text-sm"
                    />
                    <label className="bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-lg text-xs cursor-pointer whitespace-nowrap">
                      {uploading ? 'Uploading...' : 'Choose File'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Website URL</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="https://example.org"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief partnership description..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50 text-sm resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 bg-amber-500 text-slate-950 font-bold py-3 rounded-lg hover:bg-amber-400 transition-all disabled:opacity-50"
                  >
                    {actionLoading ? 'Adding...' : 'Add Partner'}
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
