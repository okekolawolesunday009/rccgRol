'use client';

import { useState, useEffect } from 'react';

interface SubscriberItem {
  id: number;
  email: string;
  status: string;
  createdAt?: string | null;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/newsletter');
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/newsletter?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSubscribers((prev) => prev.filter((item) => item.id !== id));
        setDeleteConfirmId(null);
      } else {
        alert('Failed to delete subscriber');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting subscriber');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-headline italic font-bold text-white">Newsletter Signups</h1>
          <p className="text-slate-400 text-sm mt-1">
            Total Subscribers: <span className="text-amber-500 font-bold">{subscribers.length}</span>
          </p>
        </div>
        <div className="w-full md:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg text-white px-4 py-2 focus:outline-none focus:border-amber-500/50 text-sm placeholder-slate-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm">Loading subscribers...</p>
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <div className="text-center py-20 text-slate-500 border border-slate-800 border-dashed rounded-2xl bg-slate-900/30">
          <span className="material-symbols-outlined text-5xl mb-3 block opacity-40">mail</span>
          <p className="font-body text-sm">No subscribers found.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-850 bg-slate-950/50 text-slate-400">
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Subscriber Email</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-slate-850 hover:bg-slate-950/20 text-slate-300">
                  <td className="px-6 py-4 font-mono font-medium">{sub.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-400">
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : ''}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {deleteConfirmId === sub.id ? (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleDelete(sub.id)}
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
                        onClick={() => setDeleteConfirmId(sub.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
