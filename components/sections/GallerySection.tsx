'use client';

import GalleryBento from '../GalleryBento';
import Section from '../SectionProp';
import { galleryItems } from '../../data/gallery';

export default function GallerySection() {
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

        <GalleryBento items={galleryItems} />
      </div>
    </Section>
  );
}
