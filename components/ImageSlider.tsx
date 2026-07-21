'use client';

import { useState, useEffect } from 'react';
import type { ImageSliderImage } from '../data/heroSliderImages';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageSliderProps {
  images: ImageSliderImage[] | string[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
  imageClassName?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  scale?: number;
}

export default function ImageSlider({
  images,
  autoPlay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  className = '',
  imageClassName = '',
  aspectRatio = 'auto',
  objectFit = 'cover',
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Normalize images to SliderImage format
  const normalizedImages = images.map((img) =>
    typeof img === 'string' ? { src: img, alt: '' } : img
  );

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % normalizedImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, normalizedImages.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % normalizedImages.length);
  };

  // Aspect ratio classes
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[16/9]',
    portrait: 'aspect-[3/4]',
    auto: '',
  };

  // Object fit classes
  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  return (
    <div className={`relative w-full ${aspectRatioClasses[aspectRatio]} ${className}`}>
      {/* Images */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <AnimatePresence mode="wait">
          {normalizedImages.map((image, index) => (
            index === currentIndex && (
              <motion.div
                key={index}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  style={{
                      objectFit: image.objectFit || 'cover',
                      transform: image.scale ? `scale(${image.scale})` : 'none',
                      objectPosition: image.objectPosition || 'center',
                    }}
                  className={`w-full h-full ${objectFitClasses[objectFit]} ${imageClassName}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                {/* Optional overlay for better text readability */}
                {image.title && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h3 className="text-white text-xl font-bold">{image.title}</h3>
                  </motion.div>
                )}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <motion.button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="material-symbols-outlined text-2xl group-hover:scale-110">
              chevron_left
            </span>
          </motion.button>
          <motion.button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="material-symbols-outlined text-2xl group-hover:scale-110">
              chevron_right
            </span>
          </motion.button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {normalizedImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-3 h-3'
                  : 'bg-white/50 w-2 h-2 hover:bg-white/75'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
