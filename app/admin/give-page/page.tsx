'use client';

import { useEffect, useState } from 'react';



export default function AdminGivePage() {
  const [settings, setSettings] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/admin/give-page');
        if (res.ok) {
          const data = await res.json();
          setSettings({ ...data });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/give-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      alert('Give page settings saved successfully.');
    } catch (err) {
      console.error(err);
      alert('Unable to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-headline italic font-bold text-white">Give Page Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Edit the Give page hero content, donation details, and thank-you CTA.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-amber-500 text-slate-950 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading settings...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-300">Hero Title</span>
              <textarea
                value={settings.heroTitle}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
                rows={3}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-300">Hero Subtitle</span>
              <textarea
                value={settings.heroSubtitle}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
                rows={3}
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-300">Hero Description</span>
            <textarea
              value={settings.heroDescription}
              onChange={(e) => handleChange('heroDescription', e.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              rows={4}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-300">Thank You Headline</span>
              <input
                value={settings.thankYouHeadline}
                onChange={(e) => handleChange('thankYouHeadline', e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-300">Thank You Copy</span>
              <textarea
                value={settings.thankYouCopy}
                onChange={(e) => handleChange('thankYouCopy', e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
                rows={4}
              />
            </label>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
            <h2 className="text-lg font-semibold text-white">Donation Details JSON</h2>
            <p className="text-sm text-slate-400 mt-1">Update the donation items array below.</p>
            <textarea
              value={JSON.stringify(settings.donationDetails || [], null, 2)}
              onChange={(e) => handleChange('donationDetails', JSON.parse(e.target.value))}
              className="mt-4 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white font-mono"
              rows={10}
            />
          </div>
        </div>
      )}
    </div>
  );
}
