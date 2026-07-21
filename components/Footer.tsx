'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaFacebook, FaYoutube, FaTwitter, FaInstagram } from 'react-icons/fa';

const footerLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Contact', href: '/contact' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Location', href: '#' },
];

const socialLinks = [
  { icon: <FaFacebook />, label: 'Facebook', href: 'https://facebook.com/rccglp17' },
  { icon: <FaYoutube />, label: 'YouTube', href: 'https://youtube.com/rccglp17' },
  { icon: <FaInstagram />, label: 'Instagram', href: 'https://instagram.com/rccglp17' },
  { icon: <FaTwitter />, label: 'Twitter', href: 'https://twitter.com/rccglp17' },
];

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.footer
      className="w-full py-20 px-6 md:px-12 border-t border-slate-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12"
          variants={itemVariants}
        >
          {/* Brand */}
          <motion.div
            className="flex flex-col gap-4 text-center md:text-left"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link href="/" className="flex items-center  justify-center lg:justify-start gap-4 group">
              <img src="/rccg.png" alt="RCCG LP17 HQ Logo" width={150} height={50} className="w-[150px] h-[50px] object-contain" />
            </Link>
            <p className="font-body text-xs tracking-widest uppercase opacity-70 text-amber-500">
              © {new Date().getFullYear()} RCCG LP17 HQ — River Of Life Sanctuary
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 md:gap-10"
            variants={itemVariants}
          >
            {footerLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-black hover:text-amber-400 transition-colors font-body text-xs tracking-widest uppercase"
                whileHover={{ scale: 1.1, color: '#f59e0b' }}
                transition={{ duration: 0.2 }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>

          {/* Social Icons */}
          <motion.div
            className="flex gap-4"
            variants={itemVariants}
          >
            {socialLinks.map(({ icon, label, href }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-amber-500 hover:text-white transition-all duration-300 flex items-center justify-center text-slate-600 text-lg shadow-sm hover:shadow-md cursor-pointer"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {icon}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Divider + Scripture */}
        <motion.div
          className="pt-12 border-t border-slate-800 text-center"
          variants={itemVariants}
          whileHover={{ opacity: 0.8 }}
        >
          <p className="font-headline italic text-black text-sm">
            Jesus Christ is the same yesterday and today and forever. — Hebrews 13:8
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
