'use client';

import Section from "../SectionProp";

export default function AboutSection() {
  return (
    <Section
      //bgColor="bg-black"
      bgImage="/pastor.png"
      bgSize="55%"
      bgPosition="right center"
      overlay="bg-gradient-to-r from-black via-black/90 to-transparent"
      id="about"
      className="py-32 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center min-h-[600px]">
          {/* Left Div - Content Area */}
          <div className="flex-1 w-full lg:w-1/2 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
            <div className="relative z-10 max-w-lg">
              {/* Label */}
              <span className="text-amber-500 font-label text-sm tracking-[0.3em] uppercase mb-6 block">
                About Our Parish
              </span>

              {/* Headline */}
              <h2 className="font-headline text-4xl lg:text-5xl text-white leading-tight mb-8">
                Rooted in Tradition, <br />
                <span className="italic text-amber-500">Built for the Future.</span>
              </h2>

              {/* Paragraph */}
              <div className="space-y-6 font-body text-gray-300 leading-relaxed text-base lg:text-lg mb-10">
                <p>
                  At RCCG LP17 HQ, we believe in creating a space where the ancient truths of
                  scripture meet the complexities of modern life. Our mission is to raise a generation
                  of believers who are spiritually vibrant and socially relevant.
                </p>
                <p>
                  Whether you are seeking answers, looking for a community, or searching for a home,
                  you are welcome here. We are more than a church; we are a family dedicated to the
                  pursuit of God's presence.
                </p>
              </div>

              {/* CTA Button */}
              <div>
                <a
                  href="#"
                  className="inline-flex items-center gap-3 bg-amber-500 text-slate-950 font-bold tracking-widest uppercase text-sm px-8 py-4 rounded-full hover:bg-amber-400 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  Read Our Vision
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform duration-300">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
