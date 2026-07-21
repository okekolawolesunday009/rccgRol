'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  status: string;
  createdAt?: string | null;
}

interface ConnectCard {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  visitorType?: string | null;
  interests?: string[] | null;
  message?: string | null;
  status: string;
  createdAt?: string | null;
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
        status === 'new'
          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          : 'bg-slate-700/50 text-slate-400 border border-slate-700'
      }`}
    >
      {status === 'new' ? '● New' : '✓ Read'}
    </span>
  );
}

function LoadingSpinner() {
  return (
    <div className="text-center py-20 text-slate-500">
      <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-sm">Loading submissions...</p>
    </div>
  );
}

function EmptyState({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="text-center py-20 text-slate-500 border border-slate-800 border-dashed rounded-2xl bg-slate-900/30">
      <span className="material-symbols-outlined text-5xl mb-3 block opacity-40">{icon}</span>
      <p className="font-body text-sm">{label}</p>
    </div>
  );
}

// ─── Contact Messages Tab ─────────────────────────────────────────────────────

function ContactTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inbox');
      if (res.ok) setMessages(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'new' ? 'read' : 'new';
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/inbox?id=${id}&status=${newStatus}`, { method: 'PATCH' });
      if (res.ok) {
        setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: newStatus } : m));
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/inbox?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setDeleteConfirm(null);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
  );

  const newCount = messages.filter((m) => m.status === 'new').length;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <p className="text-slate-400 text-sm">
          Total: <span className="text-white font-bold">{messages.length}</span>
          {newCount > 0 && (
            <span className="ml-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              {newCount} unread
            </span>
          )}
        </p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search messages..."
          className="w-full md:w-64 bg-slate-900 border border-slate-800 rounded-lg text-white px-4 py-2 focus:outline-none focus:border-amber-500/50 text-sm placeholder-slate-500"
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState icon="mail" label="No contact messages yet." />
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all ${
                msg.status === 'new' ? 'border-amber-500/30' : 'border-slate-800'
              }`}
            >
              {/* Row header */}
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-amber-500 flex-shrink-0 font-bold text-sm">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{msg.name}</p>
                    <p className="text-slate-400 text-xs truncate">{msg.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  {msg.subject && (
                    <span className="hidden sm:block text-slate-400 text-xs max-w-[160px] truncate italic">
                      "{msg.subject}"
                    </span>
                  )}
                  <StatusBadge status={msg.status} />
                  <span className="text-slate-500 text-xs hidden md:block">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </span>
                  <span className="material-symbols-outlined text-slate-500 text-base transition-transform" style={{ transform: expanded === msg.id ? 'rotate(180deg)' : 'none' }}>
                    expand_more
                  </span>
                </div>
              </div>

              {/* Expanded detail */}
              <AnimatePresence>
                {expanded === msg.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-slate-800 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        {msg.phone && (
                          <div>
                            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Phone</p>
                            <p className="text-slate-300">{msg.phone}</p>
                          </div>
                        )}
                        {msg.subject && (
                          <div>
                            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Subject</p>
                            <p className="text-slate-300">{msg.subject}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Received</p>
                          <p className="text-slate-300">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : '-'}</p>
                        </div>
                      </div>

                      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                        <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Message</p>
                        <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => handleMarkRead(msg.id, msg.status)}
                          disabled={actionLoading}
                          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-amber-400 transition-colors disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {msg.status === 'new' ? 'mark_email_read' : 'mark_email_unread'}
                          </span>
                          {msg.status === 'new' ? 'Mark as Read' : 'Mark as Unread'}
                        </button>
                        <span className="text-slate-700">·</span>
                        <a
                          href={`mailto:${msg.email}`}
                          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-amber-400 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">reply</span>
                          Reply
                        </a>
                        <span className="text-slate-700">·</span>
                        {deleteConfirm === msg.id ? (
                          <div className="flex gap-2 items-center">
                            <button onClick={() => handleDelete(msg.id)} disabled={actionLoading} className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest disabled:opacity-50">Confirm Delete</button>
                            <button onClick={() => setDeleteConfirm(null)} className="text-slate-500 hover:text-white text-xs uppercase tracking-widest">Cancel</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(msg.id)}
                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Connect Cards Tab ────────────────────────────────────────────────────────

function ConnectCardsTab() {
  const [cards, setCards] = useState<ConnectCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { fetchCards(); }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/connect-cards');
      if (res.ok) setCards(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'new' ? 'read' : 'new';
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/connect-cards?id=${id}&status=${newStatus}`, { method: 'PATCH' });
      if (res.ok) {
        setCards((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/connect-cards?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCards((prev) => prev.filter((c) => c.id !== id));
        setDeleteConfirm(null);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = cards.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const newCount = cards.filter((c) => c.status === 'new').length;

  const visitorTypeLabel: Record<string, string> = {
    'first-time': 'First-time Visitor',
    returning: 'Returning Visitor',
    'looking-home': 'Looking for a Church Home',
    'new-area': 'New to the Area',
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <p className="text-slate-400 text-sm">
          Total: <span className="text-white font-bold">{cards.length}</span>
          {newCount > 0 && (
            <span className="ml-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              {newCount} unread
            </span>
          )}
        </p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full md:w-64 bg-slate-900 border border-slate-800 rounded-lg text-white px-4 py-2 focus:outline-none focus:border-amber-500/50 text-sm placeholder-slate-500"
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState icon="person_add" label="No connect cards submitted yet." />
      ) : (
        <div className="space-y-3">
          {filtered.map((card) => (
            <div
              key={card.id}
              className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all ${
                card.status === 'new' ? 'border-amber-500/30' : 'border-slate-800'
              }`}
            >
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                onClick={() => setExpanded(expanded === card.id ? null : card.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-amber-500 flex-shrink-0 font-bold text-sm">
                    {card.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{card.name}</p>
                    <p className="text-slate-400 text-xs truncate">{card.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className="hidden sm:block text-slate-400 text-xs italic">
                    {visitorTypeLabel[card.visitorType ?? ''] ?? card.visitorType}
                  </span>
                  <StatusBadge status={card.status} />
                  <span className="text-slate-500 text-xs hidden md:block">
                    {card.createdAt ? new Date(card.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </span>
                  <span className="material-symbols-outlined text-slate-500 text-base transition-transform" style={{ transform: expanded === card.id ? 'rotate(180deg)' : 'none' }}>
                    expand_more
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {expanded === card.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-slate-800 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        {card.phone && (
                          <div>
                            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Phone</p>
                            <p className="text-slate-300">{card.phone}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Visitor Type</p>
                          <p className="text-slate-300">{visitorTypeLabel[card.visitorType ?? ''] ?? card.visitorType ?? '-'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Submitted</p>
                          <p className="text-slate-300">{card.createdAt ? new Date(card.createdAt).toLocaleString() : '-'}</p>
                        </div>
                      </div>

                      {card.interests && card.interests.length > 0 && (
                        <div>
                          <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Interests</p>
                          <div className="flex flex-wrap gap-2">
                            {card.interests.map((interest) => (
                              <span
                                key={interest}
                                className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold px-3 py-1 rounded-full"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {card.message && (
                        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                          <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Message / Prayer Request</p>
                          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{card.message}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => handleMarkRead(card.id, card.status)}
                          disabled={actionLoading}
                          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-amber-400 transition-colors disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {card.status === 'new' ? 'mark_email_read' : 'mark_email_unread'}
                          </span>
                          {card.status === 'new' ? 'Mark as Read' : 'Mark as Unread'}
                        </button>
                        <span className="text-slate-700">·</span>
                        <a
                          href={`mailto:${card.email}`}
                          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-amber-400 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">reply</span>
                          Reply
                        </a>
                        <span className="text-slate-700">·</span>
                        {deleteConfirm === card.id ? (
                          <div className="flex gap-2 items-center">
                            <button onClick={() => handleDelete(card.id)} disabled={actionLoading} className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest disabled:opacity-50">Confirm Delete</button>
                            <button onClick={() => setDeleteConfirm(null)} className="text-slate-500 hover:text-white text-xs uppercase tracking-widest">Cancel</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(card.id)}
                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Inbox Page ──────────────────────────────────────────────────────────

export default function AdminInboxPage() {
  const [activeTab, setActiveTab] = useState<'contacts' | 'cards'>('contacts');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-headline italic font-bold text-white">Inbox</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage contact form messages and new-visitor connect cards.
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl w-fit mb-8">
        {([
          { key: 'contacts', label: 'Contact Messages', icon: 'mail' },
          { key: 'cards', label: 'Connect Cards', icon: 'person_add' },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'contacts' ? <ContactTab /> : <ConnectCardsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
