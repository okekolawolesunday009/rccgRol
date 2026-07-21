'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiBook, FiHeart, FiHome, FiUsers } from 'react-icons/fi';
import type { IconType } from 'react-icons';

interface GiveProjectItem {
  id: number;
  title: string;
  accountName: string;
  bank: string;
  description: string;
  accountNumber: string;
  icon: string;
  colorClass: string;
  goal?: string | null;
  order?: number | null;
}

const iconMap: Record<string, IconType> = {
  FiHeart,
  FiUsers,
  FiHome,
  FiActivity,
  FiBook,
};

const emptyForm = {
  title: '',
  accountName: '',
  bank: '',
  accountNumber: '',
};

export default function AdminGivePage() {
  const [projects, setProjects] = useState<GiveProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/give');
      if (res.ok) {
        const data = await res.json();
        setProjects(data ?? []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEditModal = (project: GiveProjectItem) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      accountName: project.accountName || '',
      bank: project.bank || '',
      accountNumber: project.accountNumber,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const endpoint = '/api/admin/give';
      const body = JSON.stringify({ id: editingId, ...form });

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error?.error || 'Failed to save project');
        return;
      }

      setShowModal(false);
      setEditingId(null);
      setForm({ ...emptyForm });
      await fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Error saving project');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/give?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        alert('Failed to delete project');
        return;
      }

      setDeleteConfirmId(null);
      await fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Error deleting project');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-headline italic font-bold text-white">Give Page Manager</h1>
          <p className="text-slate-400 text-sm mt-1">Enter the essentials and let the system generate the rest for the Give page.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-amber-500 text-slate-950 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-amber-400 transition-colors"
        >
          <span className="material-symbols-outlined text-sm font-bold">add</span>
          Add Project
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-slate-500 border border-slate-800 border-dashed rounded-2xl bg-slate-900/30">
          <span className="material-symbols-outlined text-5xl mb-3 block opacity-40">account_balance</span>
          <p className="font-body text-sm">No donation projects added yet. Add one to show it on the Give page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => {
            const Icon = iconMap[project.icon] || FiHeart;
            return (
              <div key={project.id} className={`rounded-3xl p-6 border border-slate-800 shadow-2xl shadow-black/20 overflow-hidden ${project.colorClass}`}>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-white/15 p-3 text-white shadow-lg shadow-black/20">
                      <Icon className="text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-white text-2xl font-bold tracking-tight">{project.title}</h2>
                      <p className="text-slate-200 text-sm mt-1">{project.goal || 'Donation project'}</p>
                    </div>
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-white/70">Order {project.order ?? 0}</span>
                </div>

                <p className="text-slate-100 text-sm leading-relaxed mb-5">{project.description}</p>

                <div className="bg-black/35 border border-white/10 rounded-2xl p-4 mb-5">
                  <p className="text-white/70 text-xs uppercase tracking-[0.2em] mb-2">Account Number</p>
                  <p className="font-mono text-white font-semibold">{project.accountNumber}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => openEditModal(project)}
                    className="px-4 py-2 rounded-lg bg-white/15 text-white hover:bg-white/25 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  {deleteConfirmId === project.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={actionLoading}
                        className="px-4 py-2 rounded-lg bg-red-600/90 text-white text-sm font-bold hover:bg-red-500 disabled:opacity-50"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-4 py-2 rounded-lg bg-white/10 text-slate-200 text-sm hover:bg-white/20"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(project.id)}
                      className="px-4 py-2 rounded-lg bg-white/10 text-slate-200 text-sm hover:bg-white/20"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div
              className="relative z-10 bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800 bg-slate-900/50">
                <h3 className="font-headline text-xl text-white font-bold">{editingId ? 'Edit Donation Project' : 'Add Donation Project'}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Account Name *</label>
                    <input
                      type="text"
                      required
                      value={form.accountName}
                      onChange={(e) => setForm((prev) => ({ ...prev, accountName: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Bank *</label>
                    <input
                      type="text"
                      required
                      value={form.bank}
                      onChange={(e) => setForm((prev) => ({ ...prev, bank: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Account Number *</label>
                    <input
                      type="text"
                      required
                      value={form.accountNumber}
                      onChange={(e) => setForm((prev) => ({ ...prev, accountNumber: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                  Other details such as the description, goal label, icon, and card style are generated automatically from the details you enter.
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingId(null);
                      setForm({ ...emptyForm });
                    }}
                    className="px-5 py-3 rounded-lg bg-white/10 text-slate-200 hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-3 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
                  >
                    {editingId ? 'Save Changes' : 'Add Project'}
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
