'use client';

import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Section from '@/components/SectionProp';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTshirt,
  FaChild,
  FaHeart,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPaperPlane,
  FaCheckCircle
} from 'react-icons/fa';

export default function NewHerePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [visitorType, setVisitorType] = useState('first-time');
  const [interests, setInterests] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const interestOptions = [
    { id: 'fellowship', label: 'Join a House Fellowship' },
    { id: 'baptism', label: 'Water Baptism / Foundation School' },
    { id: 'ministry', label: 'Volunteer in a Ministry' },
    { id: 'counseling', label: 'Request Pastoral Counseling' },
    { id: 'prayer', label: 'Send a Prayer Request' },
  ];

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/new-here', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, visitorType, interests, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit connect card.');
      }

      toast.success("We're thrilled you connected! Our team will reach out shortly.");
      setName('');
      setEmail('');
      setPhone('');
      setVisitorType('first-time');
      setInterests([]);
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Hero Welcome Header */}
      <Section bgColor="bg-slate-100" className="py-20 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center space-y-6">
          <p className="text-amber-600 uppercase tracking-[0.4em] text-xs font-bold">
            Welcome to River of Life
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold italic text-slate-900 tracking-tight leading-tight">
            We are so glad <br className="sm:hidden" />
            <span className="text-amber-600">you are here.</span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            Whether you are looking for a spiritual home, searching for answers, or just visiting, we want you to feel welcome, accepted, and loved.
          </p>
        </div>
      </Section>

      {/* Pastor's Welcome Message */}
      <Section bgColor="bg-white" className="py-16">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 items-center bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Pastor Profile Area */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-200 flex items-center justify-center relative">
                <img src="/pastor.png" alt="Pastor" className="w-full h-full " />
              </div>
              <div>
                <h3 className="font-headline text-2xl italic font-bold text-slate-900">Pastor-in-Charge</h3>
                <p className="text-amber-600 text-xs tracking-wider uppercase font-semibold mt-1">RCCG LP17 HQ</p>
              </div>
            </div>

            {/* Letter Content */}
            <div className="space-y-6">
              <span className="text-amber-600 font-bold uppercase tracking-widest text-xs">A Letter to Our Visitors</span>
              <h2 className="font-headline text-3xl italic text-slate-900 font-bold">"You have a place in our family"</h2>
              <div className="text-slate-600 font-light text-sm md:text-base leading-relaxed space-y-4">
                <p>
                  We believe that church should be a sanctuary—a place where you can experience the presence of God, build meaningful friendships, and grow in your unique calling.
                </p>
                <p>
                  At River of Life Sanctuary, our doors are open to people from all backgrounds, regardless of where they are on their spiritual journey. We don't expect you to have it all together, because none of us do. We are simply a group of believers walking together toward God's ultimate excellence.
                </p>
                <p className="font-medium text-slate-800 italic">
                  We look forward to meeting you physical or online this Sunday!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* What To Expect Section */}
      <Section bgColor="bg-slate-50" className="py-20 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-amber-600 font-bold uppercase tracking-widest text-xs">Planning Your Visit</span>
            <h2 className="font-headline text-4xl italic font-extrabold text-slate-900">What to expect when visiting</h2>
            <p className="text-slate-500 font-light max-w-md mx-auto text-sm md:text-base">
              Here are answers to some common questions newcomers ask before visiting our parish.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Service Rhythm */}
            <motion.div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4" variants={itemVariants}>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shadow-inner">
                <FaClock />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Service Schedules</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-light">
                Our main Sunday Worship Service starts at <strong>9:00 AM</strong>. We also gather mid-week on Wednesdays at <strong>6:00 PM</strong> for Bible Study and prayer.
              </p>
            </motion.div>

            {/* Dress Code */}
            <motion.div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4" variants={itemVariants}>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shadow-inner">
                <FaTshirt />
              </div>
              <h3 className="text-xl font-bold text-slate-900">What Should I Wear?</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-light">
                Come as you are! Some people wear their Sunday best (suits and traditional attire) while others dress casual (jeans and t-shirts). You are welcome in whatever style makes you comfortable.
              </p>
            </motion.div>

            {/* Kids church */}
            <motion.div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4" variants={itemVariants}>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shadow-inner">
                <FaChild />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Children & Youth</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-light">
                We have a safe, fun, and Bible-centered Children's Church running concurrently with our main service. Our trained teachers will keep your kids engaged and secure.
              </p>
            </motion.div>

            {/* Getting Connected */}
            <motion.div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4" variants={itemVariants}>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shadow-inner">
                <FaHeart />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Next Steps</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-light">
                Immediately after service, we invite all our first-time guests to a brief meet-and-greet in the VIP Lounge. We'd love to say hello and give you a small welcome package!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* Connect Form Section */}
      <Section bgColor="bg-white" className="py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-amber-600 font-bold uppercase tracking-widest text-xs">Digital Connect Card</span>
            <h2 className="font-headline text-4xl italic font-extrabold text-slate-900">Let's stay connected</h2>
            <p className="text-slate-500 font-light max-w-md mx-auto text-sm md:text-base">
              Take a moment to fill out our visitor card so we can welcome you properly and guide you on your next steps.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-1.5">
                      <FaUser className="text-amber-600" /> Full Name *
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

                  {/* Email field */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-1.5">
                      <FaEnvelope className="text-amber-600" /> Email Address *
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone field */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-1.5">
                      <FaPhone className="text-amber-600" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 (0) 801 234 5678"
                      className="w-full bg-white border border-slate-200 rounded-lg text-slate-900 px-4 py-3 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  {/* Visitor Type dropdown */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                      I am:
                    </label>
                    <select
                      value={visitorType}
                      onChange={(e) => setVisitorType(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg text-slate-900 px-4 py-3 focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
                    >
                      <option value="first-time">First-time visitor</option>
                      <option value="returning">Returning visitor</option>
                      <option value="looking-home">Looking for a church home</option>
                      <option value="new-area">New to the area</option>
                    </select>
                  </div>
                </div>

                {/* Checklist options */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-semibold">
                    I would like to: (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {interestOptions.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white cursor-pointer select-none transition hover:bg-slate-50/50 ${interests.includes(opt.id) ? 'border-amber-500/50 bg-amber-50/10' : ''
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={interests.includes(opt.id)}
                          onChange={() => toggleInterest(opt.id)}
                          className="w-4.5 h-4.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500/50 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message field */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                    Message / Prayer Request / Questions
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us a bit about yourself or write your message here..."
                    className="w-full bg-white border border-slate-200 rounded-lg text-slate-900 px-4 py-3 focus:outline-none focus:border-amber-500/50 resize-none font-light"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 text-slate-950 font-bold py-3.5 rounded-lg hover:bg-amber-400 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow hover:shadow-md"
                >
                  <FaPaperPlane className="text-xs" />
                  {loading ? 'Sending...' : 'Submit Connect Card'}
                </button>

                {error && (
                  <p className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-lg px-4 py-3">
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
