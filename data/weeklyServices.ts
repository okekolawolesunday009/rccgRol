import { FiCalendar, FiClock, FiHeart, FiStar } from 'react-icons/fi';
import type { IconType } from 'react-icons';

export interface WeeklyService {
  title: string;
  day: string;
  time: string;
  tag: string;
  colorClass: string;
  offsetClass: string;
  icon: IconType;
}

export const weeklyServices: WeeklyService[] = [
  {
    title: 'Sunday Service',
    day: 'Sunday',
    time: '9:00 AM',
    tag: 'Redeem Weekly Service',
    colorClass: 'bg-gradient-to-br from-purple-700 to-violet-600',
    offsetClass: 'md:-mt-6 md:rotate-[-2deg] lg:-mt-10',
    icon: FiCalendar,
  },
  {
    title: 'Tuesday Digging Deep',
    day: 'Tuesday',
    time: '6:00 PM',
    tag: 'Midweek Refresh',
    colorClass: 'bg-gradient-to-br from-sky-600 to-blue-700',
    offsetClass: 'md:-mt-2 md:rotate-[2deg] lg:-mt-6',
    icon: FiClock,
  },
  {
    title: 'Faith Clinic',
    day: 'Thursday',
    time: '7:30 PM',
    tag: 'Join the Prayer Circle',
    colorClass: 'bg-gradient-to-br from-rose-500 to-pink-600',
    offsetClass: 'md:mt-6 md:rotate-[-1deg] lg:mt-0',
    icon: FiHeart,
  },
  {
    title: 'Youth Sunday',
    day: '3rd Sunday',
    time: '8:00 PM',
    tag: 'Community Focus',
    colorClass: 'bg-gradient-to-br from-orange-500 to-orange-600',
    offsetClass: 'md:mt-12 md:rotate-[1deg] lg:mt-6',
    icon: FiStar,
  },
];
