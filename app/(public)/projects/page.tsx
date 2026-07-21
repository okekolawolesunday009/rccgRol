'use client';

import { useState, useEffect } from 'react';
import Section from '@/components/SectionProp';
import ProjectCard from '@/components/ProjectCard';
import type { DonationProject } from '@/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<DonationProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch('/api/give');
        if (res.ok) {
          const data = await res.json();
          setProjects(data ?? []);
        } else {
          console.error('Failed to load donation projects');
        }
      } catch (error) {
        console.error('Failed to load donation projects', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100">
      {/* Hero Section */}


      <Section bgColor="bg-slate-100" className="py-20 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p className="text-amber-600 uppercase tracking-[0.4em] text-xs font-bold mb-4">
            Give with Purpose
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold italic text-slate-900 mb-6 tracking-tight">
            Your generosity fuels our ministry.
          </h1>

        </div>
      </Section>
      {/* Projects Grid Section */}
      <Section bgColor="bg-white" className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col gap-8">
            {/* Section Header */}
            <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="text-amber-500 font-label text-sm tracking-[0.3em] uppercase mb-3 block">
                  Select a Project
                </span>
                <h2 className="font-headline text-4xl md:text-5xl italic text-black">
                  Different ministries, one mission
                </h2>
              </div>
              <p className="max-w-xl text-sm md:text-base text-slate-400 leading-relaxed">
                Each project has a unique account number for tracking your contribution to specific ministries.
              </p>
            </div>

            {/* Projects Grid */}
            <div className="relative mt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onSelect={(selected) => setSelectedProject(selected)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {loading && (
        <Section bgColor="bg-white" className="py-16">
          <div className="max-w-5xl mx-auto px-6 md:px-8 text-center text-slate-400">
            Loading donation projects...
          </div>
        </Section>
      )}

      {!loading && projects.length === 0 && (
        <Section bgColor="bg-white" className="py-16">
          <div className="max-w-5xl mx-auto px-6 md:px-8 text-center text-slate-400">
            No donation projects are currently available.
          </div>
        </Section>
      )}

      {/* Selected Project Details / Donation Info */}
      {selectedProject && (
        <Section bgColor="bg-slate-900 border-t border-slate-800" className="py-16">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <div className={`rounded-2xl p-8 md:p-12 ${selectedProject.colorClass}`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-black mb-2 font-headline italic">
                    {selectedProject.title}
                  </h3>
                  <p className="text-white/80">Giving to: {selectedProject.goal}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white font-semibold"
                >
                  Close
                </button>
              </div>

              <p className="text-white/90 mb-8 text-lg leading-relaxed font-body">
                {selectedProject.description}
              </p>

              {/* Account Information Box */}
              <div className="bg-black/30 rounded-xl p-8 border border-white/10 mb-8">
                <p className="text-white/60 text-sm uppercase tracking-[0.2em] mb-3">
                  Account Number for This Project
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <code className="text-2xl md:text-3xl font-mono font-bold text-white bg-white/10 px-6 py-3 rounded-lg flex-1">
                    {selectedProject.accountNumber}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedProject.accountNumber);
                      alert('Account number copied to clipboard!');
                    }}
                    className="px-4 py-3 rounded-lg bg-white/25 hover:bg-white/35 transition-colors duration-200 text-white font-semibold whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
                <div className="mt-4 space-y-2 text-sm text-white/70">
                  {selectedProject.accountName && (
                    <p><span className="font-semibold text-white/90">Account Name:</span> {selectedProject.accountName}</p>
                  )}
                  {selectedProject.bank && (
                    <p><span className="font-semibold text-white/90">Bank:</span> {selectedProject.bank}</p>
                  )}
                </div>
                <p className="text-white/70 text-sm mt-4">
                  Use this account number when making your donation to ensure your gift supports this specific project.
                </p>
              </div>

              {/* Donation Methods */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="#"
                  className="px-6 py-4 rounded-lg bg-white text-black font-bold hover:bg-white/90 transition-colors duration-200 text-center"
                >
                  Give Online
                </a>
                <a
                  href="#"
                  className="px-6 py-4 rounded-lg bg-white/25 border border-white/30 text-white font-bold hover:bg-white/35 transition-colors duration-200 text-center"
                >
                  Bank Transfer
                </a>
                <a
                  href="#"
                  className="px-6 py-4 rounded-lg bg-white/25 border border-white/30 text-white font-bold hover:bg-white/35 transition-colors duration-200 text-center"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* How To Give Section */}
      <Section bgColor="bg-white" className="py-24 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 italic font-headline">How to Give</h2>
            <p className="text-slate-400 text-lg">Multiple ways to support our ministry</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Online Giving',
                description: 'Fast, secure, and convenient. Give online with your credit card or bank account.',
                icon: '💳',
              },
              {
                title: 'Mobile App',
                description: 'Download our app to give on the go with just a few taps.',
                icon: '📱',
              },
              {
                title: 'In Person',
                description: 'Give during our weekly services using the offering plate or visit our office.',
                icon: '🏢',
              },
            ].map((method, idx) => (
              <div key={idx} className="bg-slate-900 rounded-xl p-8 border border-slate-850 hover:border-slate-800 transition-colors duration-200">
                <div className="text-5xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{method.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
