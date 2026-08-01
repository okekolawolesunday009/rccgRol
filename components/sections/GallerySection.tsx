'use client';

import { useEffect, useState } from 'react';
import GalleryBento from '../GalleryBento';
import Section from '../SectionProp';
import type { GalleryItem } from '../../types';

export default function GallerySection() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch('/api/gallery');
        if (!res.ok) {
          throw new Error('Unable to load the gallery.');
        }
        const data = await res.json();
        setGalleryItems(data);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Failed to load gallery.');
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);

  return (
    <Section bgColor='' id="gallery" className="py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-amber-500 font-label text-sm tracking-[0.3em] uppercase mb-4 block">
              Recent Moments
            </span>
            <h2 className="font-headline text-5xl text-black italic">Life in the Sanctuary</h2>
          </div>
          <a
            href="#"
            className="text-slate-400 hover:text-amber-400 transition-colors font-body text-sm tracking-widest uppercase hidden md:block"
          >
            View Full Archive
          </a>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center text-slate-500 shadow-sm">
            Loading gallery...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-16 text-center text-rose-700 shadow-sm">
            {error}
          </div>
        ) : (
          <GalleryBento items={galleryItems} />
        )}
      </div>
    </Section>
  );
}
