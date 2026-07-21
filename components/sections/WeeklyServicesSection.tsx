'use client';

import Section from '../SectionProp';
import ServiceCard from '../ServiceCard';
import { weeklyServices } from '../../data/weeklyServices';

export default function WeeklyServicesSection() {
  return (
    <Section bgColor="" id="weekly-services" className="py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-amber-500 font-label text-sm tracking-[0.3em] uppercase mb-3 block">
                Weekly Services
              </span>
              <h2 className="font-headline text-4xl md:text-5xl italic text-black">
                Service rhythm for every week
              </h2>
            </div>
            <p className="max-w-xl text-sm md:text-base text-black leading-relaxed">
              Discover our weekly rhythm of worship, prayer and community gatherings designed to keep your faith strong and your heart engaged.
            </p>
          </div>

          <div className="relative mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {weeklyServices.map((service) => (
                <ServiceCard key={service.title} service={service} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
