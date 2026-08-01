import HeroSection from '@/components/sections/HeroSection';
import EventTab from '@/components/sections/EventTab';
import AboutSection from '@/components/sections/AboutSection';
import GallerySection from '@/components/sections/GallerySection';
import WeeklyServicesSection from '@/components/sections/WeeklyServicesSection';
import FeaturedEvents from '@/components/FeaturedEvents';
import { db, ensureEventsTable } from '@/lib/db';
import { events } from '@/lib/db/schema';

export default async function HomePage() {
  await ensureEventsTable();
  const allEvents = await db.select().from(events);

  const featuredEvents = allEvents
    .filter((item) => item.isPublic && item.featured)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    .slice(0, 2)
    .map((item) => ({
      ...item,
      createdAt: item.createdAt?.toISOString(),
    }));

  return (
    <>
      <HeroSection />
      <FeaturedEvents featuredEvents={featuredEvents} />
      <EventTab />
      <AboutSection />
      <GallerySection />
      <WeeklyServicesSection />
    </>
  );
}
