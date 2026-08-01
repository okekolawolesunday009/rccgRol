'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GalleryItem } from '../types';

interface GalleryLightboxProps {
  items: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
}

const clampIndex = (index: number, max: number) => {
  if (max <= 0) return 0;
  return ((index % max) + max) % max;
};

export default function GalleryLightbox({ items, initialIndex, onClose }: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const images = useMemo(
    () => items.flatMap((item) => item.imageUrls.map((url) => ({ url, item }))),
    [items]
  );

  const total = images.length;
  const activeImage = images[currentIndex];
  const prevImage = images[clampIndex(currentIndex - 1, total)];
  const nextImage = images[clampIndex(currentIndex + 1, total)];

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => clampIndex(prevIndex + 1, total));
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => clampIndex(prevIndex - 1, total));
  }, [total]);

  const jumpTo = useCallback((index: number) => {
    setCurrentIndex(clampIndex(index, total));
  }, [total]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > 40) {
        event.preventDefault();
        if (event.deltaY > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleNext, handlePrev]);

  useEffect(() => {
    const handleTouch = (() => {
      let startX = 0;
      let startY = 0;
      return (event: TouchEvent) => {
        if (event.touches.length !== 1) return;
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        const handleMove = (moveEvent: TouchEvent) => {
          const deltaX = moveEvent.touches[0].clientX - startX;
          const deltaY = moveEvent.touches[0].clientY - startY;
          if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY)) {
            moveEvent.preventDefault();
            if (deltaX < 0) {
              handleNext();
            } else {
              handlePrev();
            }
            window.removeEventListener('touchmove', handleMove);
          }
        };

        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('touchend', () => window.removeEventListener('touchmove', handleMove), { once: true });
      };
    })();

    window.addEventListener('touchstart', handleTouch, { passive: true });
    return () => window.removeEventListener('touchstart', handleTouch);
  }, [handleNext, handlePrev]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative mx-4 w-full max-w-[1400px] overflow-hidden rounded-[2rem] bg-slate-950/90 shadow-2xl shadow-black/50 ring-1 ring-white/10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/80 text-slate-100 transition hover:bg-slate-800"
            aria-label="Close gallery"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="grid gap-6 px-6 pb-6 pt-16 lg:grid-cols-[150px_1fr_150px] lg:px-10">
            <div className="hidden lg:block">
              <div className="flex h-full items-center justify-center rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-4 shadow-inner">
                <img
                  src={prevImage.url}
                  alt={prevImage.item.caption}
                  className="h-full w-full rounded-[1.5rem] object-cover opacity-80 transition duration-500 hover:opacity-100"
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-black shadow-2xl shadow-black/40">
              <motion.img
                key={activeImage.url}
                src={activeImage.url}
                alt={activeImage.item.caption}
                className="h-[min(70vh,720px)] w-full object-cover"
                initial={{ opacity: 0.6, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 to-transparent px-6 py-6 text-white">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.35em] text-slate-300">
                  <span>{currentIndex + 1} of {total}</span>
                  <span>{activeImage.item.category}</span>
                </div>
                <h3 className="mt-3 text-2xl font-headline font-bold tracking-tight text-white">
                  {activeImage.item.caption}
                </h3>
                {activeImage.item.description ? (
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                    {activeImage.item.description}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-900/70 text-white shadow-lg shadow-black/20 transition hover:bg-slate-800"
                aria-label="Previous image"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-900/70 text-white shadow-lg shadow-black/20 transition hover:bg-slate-800"
                aria-label="Next image"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            <div className="hidden lg:block">
              <div className="flex h-full items-center justify-center rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-4 shadow-inner">
                <img
                  src={nextImage.url}
                  alt={nextImage.item.caption}
                  className="h-full w-full rounded-[1.5rem] object-cover opacity-80 transition duration-500 hover:opacity-100"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto border-t border-white/10 bg-slate-950/80 px-6 py-4 lg:px-10">
            <div className="flex gap-3">
              {images.map((image, index) => (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  onClick={() => jumpTo(index)}
                  className={`relative h-20 min-w-[120px] overflow-hidden rounded-3xl border transition duration-300 ${index === currentIndex ? 'border-amber-400 shadow-lg shadow-amber-400/20' : 'border-transparent hover:border-white/20'}`}
                >
                  <img
                    src={image.url}
                    alt={image.item.caption}
                    className="h-full w-full object-cover transition duration-300 ease-out"
                  />
                  <span className="absolute inset-x-0 bottom-0 block bg-gradient-to-t from-slate-950/90 to-transparent p-2 text-[11px] text-slate-100 opacity-0 transition duration-300 group-hover:opacity-100">
                    {image.item.caption}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
