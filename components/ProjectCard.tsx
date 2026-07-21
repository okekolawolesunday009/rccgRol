'use client';

import { FiActivity, FiBook, FiHeart, FiHome, FiUsers } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import type { DonationProject } from '@/types';

const iconMap: Record<string, IconType> = {
  FiHeart,
  FiUsers,
  FiHome,
  FiActivity,
  FiBook,
};

interface ProjectCardProps {
  project: DonationProject;
  onSelect?: (project: DonationProject) => void;
}

export default function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const Icon = typeof project.icon === 'string' ? iconMap[project.icon] ?? FiHeart : project.icon;

  return (
    <div
      onClick={() => onSelect?.(project)}
      className={`group relative w-full rounded-2xl p-8 shadow-2xl shadow-black/25 transition-all duration-300 ease-out transform hover:-translate-y-2 hover:scale-[1.02] hover:z-20 overflow-hidden cursor-pointer ${project.colorClass}`}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl" />
      
      <div className="relative z-10 flex h-full flex-col justify-between gap-6">
        {/* Header with Icon and Goal Tag */}
        <div className="flex items-start justify-between gap-4">
          <div className="rounded-xl bg-white/15 p-3 text-white shadow-lg shadow-black/20">
            <Icon className="text-2xl" />
          </div>
          {project.goal && (
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/80 whitespace-nowrap">
              {project.goal}
            </span>
          )}
        </div>

        {/* Title and Description */}
        <div className="space-y-3 text-left">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {project.title}
          </h3>
          <p className="text-sm leading-relaxed text-white/85">
            {project.description}
          </p>
        </div>

        {/* Account Number */}
        <div className="border-t border-white/20 pt-4 mt-3">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-2">Account Number</p>
          <div className="flex items-center justify-between">
            <code className="text-lg md:text-xl font-mono font-bold text-white bg-white/10 px-4 py-2 rounded-lg flex-1 mr-3">
              {project.accountNumber}
            </code>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(project.accountNumber);
                alert('Account number copied!');
              }}
              className="px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white text-xs font-semibold"
              title="Copy account number"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
