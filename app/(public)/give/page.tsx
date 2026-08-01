'use client';

import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import Section from '@/components/SectionProp';

const supportReasons = [
  {
    icon: '❤️',
    title: 'Support the Mission',
    description: 'Help expand ministry and reach more people through faithful generosity.',
    accent: 'from-blue-500 to-cyan-400',
  },
  {
    icon: '📖',
    title: 'Discipleship',
    description: 'Develop resources that help believers grow spiritually and stay rooted in Scripture.',
    accent: 'from-cyan-500 to-emerald-400',
  },
  {
    icon: '🌍',
    title: 'Outreach',
    description: 'Support evangelism and community impact with compassionate action.',
    accent: 'from-blue-600 to-sky-400',
  },
  {
    icon: '🤝',
    title: 'Community Care',
    description: 'Meet practical needs through acts of love and thoughtful service.',
    accent: 'from-emerald-500 to-emerald-300',
  },
  {
    icon: '🎓',
    title: 'Leadership Development',
    description: 'Equip leaders and volunteers for service, training, and mentorship.',
    accent: 'from-sky-500 to-indigo-400',
  },
  {
    icon: '🔒',
    title: 'Faithful Stewardship',
    description: 'Every gift is managed responsibly and transparently for kingdom impact.',
    accent: 'from-cyan-600 to-slate-400',
  },
];

const givingOptions = [
  {
    icon: '🏦',
    title: 'Bank Transfer',
    description: 'Send your gift directly to our ministry bank account.',
  },
  {
    icon: '💳',
    title: 'Debit/Credit Card',
    description: 'Give quickly and securely with your preferred card.',
  },
  {
    icon: '📱',
    title: 'Mobile Payment',
    description: 'Use mobile banking or payment apps for a fast gift.',
  },
  {
    icon: '🌍',
    title: 'International Giving',
    description: 'Support the mission from anywhere in the world.',
  },
];

export default function GivePage() {
  const [pageSettings, setPageSettings] = useState<any>(null);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  useEffect(() => {
    const loadPageSettings = async () => {
      try {
        const res = await fetch('/api/give-page');
        if (!res.ok) return;
        const data = await res.json();
        setPageSettings(data);
        console.log('Give page settings loaded:', data);
      } catch (error) {
        console.error('Failed to load Give page settings', error);
      }
    };

    loadPageSettings();
  }, []);

  const heroTitle = pageSettings?.heroTitle || 'Your generosity helps advance the mission, support discipleship, and transform lives through Christ.';
  const heroSubtitle = pageSettings?.heroSubtitle || 'A modern giving page designed for clarity, trust, and easy access to donation details.';
  const heroDescription = pageSettings?.heroDescription || 'Use the details below for secure bank transfers or tap Give Now to explore additional options.';
  const thankYouHeadline = pageSettings?.thankYouHeadline || 'Thank You for Your Generosity';
  const thankYouCopy = pageSettings?.thankYouCopy || 'Every gift makes an eternal impact. Thank you for partnering with us to share hope, faith, and care.';
  const currentDonationDetails = pageSettings?.donationDetails || [
    { label: 'Bank Name', value: 'FIRST CITY MONUMENT BANK' },
    { label: 'Account Name', value: 'REDEEMED CHRISTIAN CHURCH OF GOD RIVER OF LIFE PARISH' },
    { label: 'Account Number', value: '0256742018' },
    { label: 'Reference', value: 'GIVE2026' },
  ];

  const handleCopy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedLabel(label);
      toast.success('Copied!');

      setTimeout(() => {
        setCopiedLabel((current) => (current === label ? null : current));
      }, 1200);
    } catch {
      toast.error('Unable to copy.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toaster position="bottom-center" toastOptions={{ duration: 1500 }} />

      <Section bgColor="bg-slate-100" className="py-20 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p className="text-amber-600 uppercase tracking-[0.4em] text-xs font-bold mb-4">Give with Purpose</p>
          <h1 className="text-4xl md:text-5xl font-extrabold italic text-slate-900 mb-6 tracking-tight">
            {heroTitle}
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600">
            {heroSubtitle}
          </p>
        </div>
      </Section>

      <Section bgColor="bg-white" className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid gap-10 xl:grid-cols-[1.35fr_0.9fr]">
            <div className="space-y-8">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm shadow-slate-200/50 sm:p-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Why Give?</p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                      Gifts that grow disciples, serve community, and expand the gospel.
                    </h2>
                  </div>
                  <p className="max-w-md text-sm leading-7 text-slate-600">
                    Your support helps build discipleship, outreach, community care, and leadership development.
                  </p>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {supportReasons.map((item) => (
                    <div
                      key={item.title}
                      className="group rounded-3xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                    >
                      <div
                        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${item.accent} text-2xl shadow-lg shadow-slate-200/50`}
                      >
                        <span>{item.icon}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="xl:sticky xl:top-24">
              <div id="donation-details" className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm shadow-slate-200/40 sm:p-10">
                <div className="mb-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Donation Details</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">Bank transfer information</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Copy the details below and use your banking app to send your gift securely.
                  </p>
                </div>

                <div className="space-y-4">
                  {currentDonationDetails.map((item) => (
                    <div key={item.label} className="rounded-3xl border border-slate-200 bg-white px-4 py-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                          <p className="mt-2 font-mono text-sm leading-6 text-slate-900 break-all">{item.value}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.label, item.value)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-200"
                          aria-label={`Copy ${item.label}`}
                        >
                          <span>{copiedLabel === item.label ? '✅' : '📋'}</span>
                          <span>{copiedLabel === item.label ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      <Section bgColor="bg-slate-100" className="py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Other Ways to Give</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Choose the giving method that fits your season.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
                Whether you prefer bank transfers, cards, mobile giving, or international support, every gift helps advance our ministry.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {givingOptions.map((option) => (
                <div key={option.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-2xl shadow-inner shadow-slate-200/40">
                    {option.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">{option.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section bgColor="bg-white" className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 p-10 text-white shadow-lg shadow-slate-200/10 sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center lg:gap-12">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100">{thankYouHeadline}</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Your support enables lives to be transformed, communities to be reached, and disciples to be equipped.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-100/90">
                  {thankYouCopy}
                </p>
              </div>
              <div className="flex items-center justify-start lg:justify-end">
                <a
                  href="#donation-details"
                  className="inline-flex rounded-3xl bg-white px-7 py-4 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Give Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
