import { FiHeart, FiBook, FiUsers, FiHome, FiActivity } from 'react-icons/fi';
import type { IconType } from 'react-icons';

export interface Project {
  id: string;
  title: string;
  description: string;
  accountNumber: string;
  icon: IconType;
  colorClass: string;
  goal?: string;
}

export const projects: Project[] = [
  {
    id: 'general',
    title: 'General Offering',
    description: "Support our church's ongoing ministry, operations, and community outreach programs.",
    accountNumber: 'ACC-001',
    icon: FiHeart,
    colorClass: 'bg-gradient-to-br from-red-600 to-rose-600',
    goal: 'General Church Operations',
  },
  {
    id: 'missions',
    title: 'Missions & Outreach',
    description: 'Help us reach communities locally and globally through missionary work and humanitarian aid.',
    accountNumber: 'ACC-002',
    icon: FiUsers,
    colorClass: 'bg-gradient-to-br from-blue-600 to-cyan-600',
    goal: 'Global Impact',
  },
  {
    id: 'building',
    title: 'Building Fund',
    description: 'Contribute to our facility expansion and renovation projects for better worship spaces.',
    accountNumber: 'ACC-003',
    icon: FiHome,
    colorClass: 'bg-gradient-to-br from-amber-500 to-orange-600',
    goal: 'Church Expansion',
  },
  {
    id: 'education',
    title: 'Christian Education',
    description: 'Support biblical teaching programs, youth development, and discipleship initiatives.',
    accountNumber: 'ACC-004',
    icon: FiActivity,
    colorClass: 'bg-gradient-to-br from-purple-600 to-violet-600',
    goal: 'Growth & Learning',
  },
  {
    id: 'benevolence',
    title: 'Benevolence Fund',
    description: 'Help families in crisis, provide emergency assistance, and support those in need within our congregation.',
    accountNumber: 'ACC-005',
    icon: FiActivity,
    colorClass: 'bg-gradient-to-br from-green-600 to-emerald-600',
    goal: 'Community Care',
  },
  {
    id: 'ministry',
    title: 'Ministry Development',
    description: 'Invest in training leaders, organizing spiritual events, and strengthening our ministry programs.',
    accountNumber: 'ACC-006',
    icon: FiBook,
    colorClass: 'bg-gradient-to-br from-indigo-600 to-blue-600',
    goal: 'Spiritual Growth',
  },
];
