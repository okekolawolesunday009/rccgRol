import HeroSection from '@/components/sections/HeroSection';
import EventTab from '@/components/sections/EventTab';
import AboutSection from '@/components/sections/AboutSection';
import GallerySection from '@/components/sections/GallerySection';
import WeeklyServicesSection from '@/components/sections/WeeklyServicesSection';

export default function HomePage() {
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
