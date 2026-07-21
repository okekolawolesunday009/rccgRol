'use client';

import { motion } from 'framer-motion';
import type { WeeklyService } from '../data/weeklyServices';

interface ServiceCardProps {
  service: WeeklyService;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <motion.div
      className={`group relative w-full min-w-0 rounded-[24px] p-8 shadow-2xl shadow-black/25 transition-transform duration-300 ease-out transform hover:-translate-y-2 hover:scale-[1.03] hover:z-20 overflow-hidden ${service.colorClass} ${service.offsetClass}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      whileHover={{ scale: 1.04 }}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-[24px]" />
      <div className="relative z-10 flex h-full flex-col justify-between gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="rounded-2xl bg-white/15 p-3 text-white shadow-lg shadow-black/20">
            <Icon className="text-2xl" />
          </div>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/80">
            {service.tag}
          </span>
        </div>

        <div className="space-y-4 text-left">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-white/70">{service.day}</p>
            <h3 className="text-3xl font-bold tracking-tight text-white">{service.title}</h3>
          </div>
          <div className="text-lg font-semibold text-white/90">{service.time}</div>
        </div>
      </div>
    </motion.div>
  );
}
