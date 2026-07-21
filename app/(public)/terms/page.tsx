import Section from '@/components/SectionProp';
import { termsCondition } from '@/data/termsandcondition';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions — RCCG LP17 HQ',
  description: 'Read the terms and conditions for using the website and services of RCCG LP17 HQ.',
};

export default function TermsPage() {
  const sections = termsCondition
    .split('\n\n')
    .map((section) => section.trim())
    .filter(Boolean);

  const isHeader = (text: string) => {
    const trimmed = text.trim();
    if (trimmed.endsWith(':')) return true;
    if (/^SECTION \d+/i.test(trimmed)) return true;
    if (/^[A-Z\s\-–—]{4,40}$/.test(trimmed)) return true;
    if (/^\d+(\.\d+)*\.\s*[A-Z]/.test(trimmed)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Hero Header Section */}
      <Section bgColor="bg-slate-100" className="py-20 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p className="text-amber-600 uppercase tracking-[0.4em] text-xs font-bold mb-4">
            Terms & Conditions
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold italic text-slate-900 mb-6 tracking-tight">
            Our guidelines and terms of service.
          </h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-light">
            Please read these terms and conditions carefully before using our website and participating in our digital sanctuary.
          </p>
        </div>
      </Section>

      {/* Main Content Section */}
      <Section bgColor="bg-white" className="py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <div className="space-y-6">
            {sections.map((section, index) => {
              if (isHeader(section)) {
                return (
                  <h2 key={index} className="text-xl md:text-2xl font-bold text-slate-900 pt-6 pb-2 border-b border-slate-100 tracking-tight">
                    {section}
                  </h2>
                );
              }
              return (
                <p key={index} className="text-slate-700 leading-relaxed whitespace-pre-line text-sm md:text-base font-light">
                  {section}
                </p>
              );
            })}
          </div>

        </div>
      </Section>
    </div>
  );
}
