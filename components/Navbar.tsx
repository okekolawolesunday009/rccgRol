'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BiDonateHeart } from "react-icons/bi";

const navLinks = [
  { label: 'Our Story', href: '#about' },
  { label: 'Community', href: '#gallery' },
  { label: 'Events', href: '/events' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  const getLinkHref = (href: string) => {
    if (href.startsWith('/')) return href;
    return isHome ? href : `/${href}`;
  };

  const handleAnchorClick = (href: string) => {
    setMenuOpen(false);
    if (!isHome) return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navThemeClasses = 'bg-white text-black border-b border-slate-800 shadow-sm glass-nav backdrop-blur-md';
  const linkTheme = 'text-black hover:text-amber-400';
  const buttonTheme = 'hover:text-amber-400';

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 ${navThemeClasses}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-8 py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 group">
          <img src="/rccg.png" alt="RCCG LP17 HQ Logo" width={150} height={50} className="w-[150px] h-[50px] object-contain" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={getLinkHref(link.href)}
              onClick={(e) => {
                if (isHome && !link.href.startsWith('/')) {
                  e.preventDefault();
                  handleAnchorClick(link.href);
                }
              }}
              className={`${linkTheme} transition-colors duration-300 font-headline italic text-lg tracking-tight`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="hidden md:block font-headline italic text-lg tracking-tight transition-all duration-300 text-slate-300 hover:text-amber-400"
          >
            <span className='flex space-x-2 items-center'>
              <BiDonateHeart className="inline text-2xl text-red-500" />
              <span>Give</span>
            </span>
          </Link>
          {/* Mobile Menu Button */}
          <button
            id="navbar-menu-toggle"
            aria-label="Toggle navigation menu"
            className={`md:hidden ${buttonTheme} transition-colors text-slate-100`}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="material-symbols-outlined text-2xl">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence mode="wait">
        {menuOpen && (
          <motion.div
            className="md:hidden bg-slate-950/95 border-white/5 backdrop-blur-xl border-t px-6 py-6 space-y-4"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={getLinkHref(link.href)}
                onClick={(e) => {
                  if (isHome && !link.href.startsWith('/')) {
                    e.preventDefault();
                    handleAnchorClick(link.href);
                  }
                }}
                className="block text-slate-300 hover:text-amber-100 font-headline italic text-xl py-2 border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/projects"
              onClick={() => setMenuOpen(false)}
              className="block font-headline italic text-xl py-2 text-slate-300 hover:text-amber-100"
            >
              Give
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
