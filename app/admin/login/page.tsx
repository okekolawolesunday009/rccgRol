'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/events');
        router.refresh();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-slate-950 flex items-center justify-center px-4"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-amber-500 font-headline text-2xl italic font-bold">Ω</span>
          </div>
          <h1 className="font-headline text-3xl text-white font-bold">RCCG LP17 HQ</h1>
          <p className="text-slate-400 font-body text-sm mt-2 tracking-widest uppercase">
            Admin Portal
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl shadow-black/40"
        >
          <div>
            <label className="block text-xs font-body text-slate-400 uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white font-body px-4 py-3 focus:outline-none focus:border-amber-500/50 transition-colors placeholder-slate-700"
              placeholder="admin@rccglp17.org"
            />
          </div>
          <div>
            <label className="block text-xs font-body text-slate-400 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white font-body px-4 py-3 focus:outline-none focus:border-amber-500/50 transition-colors placeholder-slate-700"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 font-body text-sm text-center">{error}</p>
          )}

          <button
            id="admin-login-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-slate-950 font-bold tracking-widest uppercase text-sm py-3 rounded-lg hover:bg-amber-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
