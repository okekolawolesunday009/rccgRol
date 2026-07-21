'use client';

import { motion } from 'framer-motion';

type SectionProps = {
  children: React.ReactNode;
  bgColor?: string;
  bgImage?: string;
  bgPosition?: string;
  bgSize?: string;
  overlay?: string;
  className?: string;
  id?: string | undefined;
  viewport?: { once?: boolean; amount?: 'some' | 'all' | number };
};

export default function Section({
  children,
  id,
  bgColor = "bg-white",
  bgImage,
  bgPosition = "center",
  bgSize = "cover",
  overlay = "",
  className,
  viewport = { once: true, amount: 0.05 },
}: SectionProps) {
  return (
    <motion.section
      id={id}
      className={`relative py-16 ${bgColor} ${className ?? ""}`.trim()}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={
        bgImage
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: bgSize,
              backgroundPosition: bgPosition,
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
    >
      {overlay && (
        <div className={`absolute inset-0 ${overlay}`} />
      )}

      <div className="relative max-w-6xl mx-auto px-4">
        {children}
      </div>
    </motion.section>
  );
}
