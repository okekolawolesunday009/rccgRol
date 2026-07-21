'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      } else {
        alert('Failed to sign out');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during sign out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-body text-sm disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-base">logout</span>
      {loading ? 'Signing Out...' : 'Sign Out'}
    </button>
  );
}
