import { cookies } from 'next/headers';
import Link from 'next/link';
import Section from '@/components/SectionProp';
import { motion } from 'framer-motion';
import { db, ensurePageSettingsTable } from '@/lib/db';
import { firstTimeVisitors } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SERVICE_OPTIONS = [
  'First Service',
  'Second Service',
  'Midweek Service',
  'Special Program',
  'Other',
];

const SOURCE_OPTIONS = [
  'Friend',
  'Family',
  'Social Media',
  'Google',
  'Website',
  'Walk-in',
  'Flyer',
  'Other',
];

function formatDate(value: string) {
  return value;
}

export default async function FirstTimerPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Section bgColor="bg-slate-100" className="py-16 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          
          <p className="text-amber-600 uppercase tracking-[0.4em] text-xs font-bold mb-4">Welcome Guest</p>
          <h1 className="text-4xl md:text-5xl font-extrabold italic text-slate-950 mb-4 tracking-tight">
            We're glad you're here.
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600">
            Tell us a little about yourself so our team can follow up and help you feel at home.
          </p>
        </div>
      </Section>

      <Section bgColor="bg-white" className="py-16">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-500 uppercase tracking-[0.35em] font-semibold">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">01</span>
                Visitor Registration
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">Quick visitor check-in</h2>
              <p className="mt-2 text-slate-600">Complete this form in less than 2 minutes. Your privacy is important to us.</p>
            </div>

            <form action="/api/first-timer" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Full Name *</span>
                  <input name="fullName" required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none" />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Phone Number *</span>
                  <input name="phoneNumber" type="tel" required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Email Address</span>
                  <input name="email" type="email" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none" />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Gender</span>
                  <select name="gender" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none">
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Prefer not to say</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Date of Birth</span>
                  <input name="dateOfBirth" type="date" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none" />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Home Address</span>
                  <input name="homeAddress" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">City</span>
                  <input name="city" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none" />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">State</span>
                  <input name="state" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Is this your first time visiting?</span>
                  <select name="firstTime" required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none">
                    <option value="">Choose one</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Date of Visit</span>
                  <input name="visitDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Service Attended</span>
                  <select name="serviceAttended" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none">
                    <option value="">Select service</option>
                    {SERVICE_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">How did you hear about us?</span>
                  <select name="invitationSource" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none">
                    <option value="">Choose one</option>
                    {SOURCE_OPTIONS.map((source) => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Were you invited?</span>
                  <select name="invited" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none">
                    <option value="">Choose one</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Invited By</span>
                  <input name="invitedBy" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none" />
                </label>
              </div>

              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-semibold">Prayer Request</span>
                <textarea name="prayerRequest" rows={4} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none" />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Would you like someone to contact you?</span>
                  <select name="contactPermission" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none">
                    <option value="">Choose one</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Preferred Contact Method</span>
                  <select name="preferredContactMethod" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none">
                    <option value="">Choose one</option>
                    <option>Phone Call</option>
                    <option>WhatsApp</option>
                    <option>SMS</option>
                    <option>Email</option>
                  </select>
                </label>
              </div>

              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-semibold">Additional Comments</span>
                <textarea name="additionalComments" rows={4} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none" />
              </label>

              <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Privacy Notice</p>
                <p>Your information is used only to welcome you and follow up after your visit. We will not share your details publicly.</p>
              </div>

              <button
                type="submit"
                className="w-full rounded-3xl bg-amber-500 px-6 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 shadow-sm transition hover:bg-amber-400"
              >
                Submit Visitor Card
              </button>
            </form>
          </div>
        </div>
      </Section>
    </div>
  );
}
