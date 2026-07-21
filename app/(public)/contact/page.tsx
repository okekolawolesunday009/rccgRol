'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Section from '@/components/SectionProp';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });



      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send message.');
      }
      setLoading(false);

      toast.success('Message sent successfully! We will get back to you shortly.');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100">
      {/* Hero */}


      <Section bgColor="bg-slate-100" className="py-20 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p className="text-amber-600 uppercase tracking-[0.4em] text-xs font-bold mb-4">
            Get In Touch
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold italic text-slate-900 mb-6 tracking-tight">
            Reach out to us.
          </h1>

        </div>
      </Section>

      <Section bgColor="bg-white" className="py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Details */}
          <div className="space-y-8">
            <div>
              <span className="text-amber-500 font-label text-sm tracking-[0.3em] uppercase mb-3 block">
                Connect With Us
              </span>
              <h2 className="font-headline text-4xl italic text-white mb-6">We would love to hear from you</h2>
              <p className="text-black leading-relaxed font-body text-base">
                Whether you are planning a visit, seeking prayer, or looking to join a ministry, our team is here for you. Feel free to call, email, or visit our office.
              </p>
            </div>

            <div className="space-y-6 ">
              <div className="flex gap-4 ">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl shadow-sm w-12 h-12 flex items-center justify-center text-amber-500 flex-shrink-0">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Our Location</h4>
                  <p className="text-black text-sm">RCCG LP17 HQ, River of Life Sanctuary, Lagos, Nigeria</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl shadow-sm w-12 h-12 flex items-center justify-center text-amber-500 flex-shrink-0">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Email Address</h4>
                  <p className="text-black text-sm">info@rccglp17.org / office@rccglp17.org</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl shadow-sm w-12 h-12 flex items-center justify-center text-amber-500 flex-shrink-0">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Phone Number</h4>
                  <p className="text-black text-sm">+234 (0) 123 4567 89 / +234 (0) 987 6543 21</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white border border-slate-200 rounded-lg text-slate-900 px-4 py-3 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-white border border-slate-200 rounded-lg text-slate-900 px-4 py-3 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full bg-white border border-slate-200 rounded-lg text-slate-900 px-4 py-3 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What is this regarding?"
                  className="w-full bg-white border border-slate-200 rounded-lg text-slate-900 px-4 py-3 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message details here..."
                  className="w-full bg-white border border-slate-200 rounded-lg text-slate-900 px-4 py-3 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition-all disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>

              {error && (
                <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}
            </form>
          </div>
        </div>
      </Section>
    </div>
  );
}
