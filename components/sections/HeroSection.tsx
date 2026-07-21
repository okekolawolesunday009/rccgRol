'use client';

import Link from 'next/link';
import ImageSlider from '../ImageSlider';
import { heroSliderImages, sliderConfig } from '../../data/heroSliderImages';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = id;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.main
      id="hero"
      className="relative min-h-screen flex flex-col justify-center pt-32 pb-12 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        <ImageSlider
          images={heroSliderImages}
          autoPlay={sliderConfig.autoPlay}
          interval={sliderConfig.interval}
          showDots={sliderConfig.showDots}
          showArrows={sliderConfig.showArrows}
          className="h-[100vh]"
          aspectRatio="wide"
          objectFit="none"
          imageClassName="transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 w-full flex justify-center items-center">
        <motion.div
          className="text-center space-y-6"
          variants={itemVariants}
        >
          <motion.p
            className='font-headline text-3xl md:text-2xl text-white font-bold tracking-tight'
            variants={itemVariants}
          >
            Welcome to <br />
          </motion.p>
          
          <motion.h1
            className="font-headline text-7xl md:text-7xl leading-tight text-white font-bold tracking-tight"
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span className="italic">River of Life</span>
            <br />
            <span className="italic">LP17 HQ</span>
          </motion.h1>
          <motion.p
            className="font-body text-lg text-gray-100 max-w-2xl mx-auto leading-relaxed font-light"
            variants={itemVariants}
          >
             The Province of Ultimate Excellence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                id="hero-cta-new-here"
                href="/new-here"
                className="flex items-center gap-2 bg-amber-500 text-slate-950 font-body font-semibold tracking-wide uppercase text-sm px-8 py-3 hover:bg-amber-400 transition-all duration-300 rounded-lg shadow-lg"
              >
                New here ?
              </Link>
            </motion.div>
            <motion.button
              id="hero-cta-video"
              onClick={() => scrollTo('weekly-services')}
              className="flex items-center gap-2 text-white font-body font-semibold tracking-wide uppercase text-sm border-2 border-white px-8 py-2 hover:bg-white/10 transition-all duration-300 rounded-lg"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-symbols-outlined text-lg">play_circle</span>
              Schedule
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30 pointer-events-none hidden md:flex"
        variants={itemVariants}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[10px] uppercase tracking-[0.5em]">Scroll to Explore</span>
        <div className="w-px h-12 bg-white/50" />
      </motion.div>
    </motion.main>
  );
}
