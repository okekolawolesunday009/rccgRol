'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GalleryItem } from '../types';
import GalleryLightbox from './GalleryLightbox';

interface GalleryBentoProps {
  items: GalleryItem[];
}

interface ImageFrameProps {
  images: string[];
  interval: number;
}

const ImageFrame: React.FC<ImageFrameProps> = ({ images, interval }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex: number) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {images.map((image: string, index: number) => (
        <img
          key={index}
          src={image}
          alt={`Frame image ${index + 1}`}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out group-hover:scale-110 transition-transform ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
};

export default function GalleryBento({ items }: GalleryBentoProps) {
  const [main, ...rest] = items;
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const flatImages = items.flatMap((item) => item.imageUrls.map((url) => ({ url, item })));

  const openLightbox = (itemIndex: number, imageIndex: number) => {
    const overallIndex = items
      .slice(0, itemIndex)
      .reduce((sum, next) => sum + next.imageUrls.length, 0) + imageIndex;
    setModalIndex(overallIndex);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[800px]">
        {/* Hero item — spans 2 cols and 2 rows */}
        {main && (
          <motion.button
            type="button"
            onClick={() => openLightbox(0, 0)}
            id={`gallery-item-${main.id}`}
            className="md:col-span-2 md:row-span-2 relative overflow-hidden group rounded-[2rem] border border-slate-200 bg-slate-100 shadow-xl transition hover:-translate-y-0.5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div className="relative h-full min-h-[320px] overflow-hidden">
              <img
                src={main.imageUrls[0]}
                alt={main.caption}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-amber-500 text-xs tracking-[0.35em] uppercase font-semibold mb-2">
                  {main.category}
                </p>
                <h4 className="font-headline text-3xl text-white tracking-tight">{main.caption}</h4>
                {main.description ? (
                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200">{main.description}</p>
                ) : null}
              </div>
            </div>
          </motion.button>
        )}

        {/* Remaining items */}
        {rest.map((item, idx) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => openLightbox(idx + 1, 0)}
            id={`gallery-item-${item.id}`}
            className={`relative overflow-hidden group rounded-[1.75rem] border border-slate-200 bg-slate-100 shadow-xl transition hover:-translate-y-0.5 ${
              idx === 0 ? 'md:col-span-2 md:row-span-1' : 'md:col-span-1 md:row-span-1'
            }`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: idx * 0.05 }}
          >
            <div className="relative h-full min-h-[240px] overflow-hidden">
              <img
                src={item.imageUrls[0]}
                alt={item.caption}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-amber-500 text-[11px] tracking-[0.35em] uppercase font-semibold mb-2">
                  {item.category}
                </p>
                <h4 className={`font-headline text-white ${idx === 0 ? 'text-2xl' : 'text-lg'}`}>
                  {item.caption}
                </h4>
                {item.description ? (
                  <p className="mt-2 text-sm text-slate-200 line-clamp-2">{item.description}</p>
                ) : null}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {modalIndex !== null && (
        <GalleryLightbox
          items={items}
          initialIndex={modalIndex}
          onClose={() => setModalIndex(null)}
        />
      )}
    </>
  );
}
