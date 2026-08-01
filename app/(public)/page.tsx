import HeroSection from '@/components/sections/HeroSection';
import EventTab from '@/components/sections/EventTab';
import AboutSection from '@/components/sections/AboutSection';
import GallerySection from '@/components/sections/GallerySection';
import WeeklyServicesSection from '@/components/sections/WeeklyServicesSection';
import { db, ensureEventsTable } from '@/lib/db';
import { events } from '@/lib/db/schema';

export default async function HomePage() {
  await ensureEventsTable();
  const allEvents = await db.select().from(events);

 
  return (
    <>
      <HeroSection />
     
      <EventTab />
      <AboutSection />
      <GallerySection />
      <WeeklyServicesSection />
    </>
  );
}
