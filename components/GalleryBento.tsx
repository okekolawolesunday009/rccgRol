'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GalleryItem } from '../types';

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[800px]">
      {/* Hero item — spans 2 cols and 2 rows */}
      {main && (
        <motion.div
          id={`gallery-item-${main.id}`}
          className="md:col-span-2 md:row-span-2 relative overflow-hidden group rounded-lg"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <ImageFrame images={main.imageUrls} interval={3000} />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent flex flex-col justify-end p-8">
            <p className="text-amber-500 text-xs tracking-widest uppercase font-bold mb-2">
              {main.category}
            </p>
            <h4 className="font-headline text-2xl text-white">{main.caption}</h4>
          </div>
        </motion.div>
      )}

      {/* Remaining items */}
      {rest.map((item, idx) => (
        <motion.div
          key={item.id}
          id={`gallery-item-${item.id}`}
          className={`relative overflow-hidden group rounded-lg ${
            idx === 0 ? 'md:col-span-2 md:row-span-1' : 'md:col-span-1 md:row-span-1'
          }`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: idx * 0.05 }}
        >
          <ImageFrame images={item.imageUrls} interval={3000} />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent flex flex-col justify-end p-6">
            {idx === 0 && (
              <p className="text-amber-500 text-xs tracking-widest uppercase font-bold mb-2">
                {item.category}
              </p>
            )}
            <h4 className={`font-headline text-white ${idx === 0 ? 'text-2xl' : 'text-lg'}`}>
              {item.caption}
            </h4>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
