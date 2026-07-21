export interface AudioSermon {
  id: number;
  title: string;
  speaker: string;
  audioUrl: string;
  duration?: string | null;
  date?: string | null;
  description?: string | null;
  series?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface VideoSermon {
  id: number;
  title: string;
  videoUrl: string;       // YouTube embed URL
  thumbnail?: string | null;
  description?: string | null;
  speaker?: string | null;
  date?: string | null;
  duration?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ChurchEvent {
  id: number;
  title: string;
  date: string;           // Day number e.g. "14"
  month: string;          // e.g. "MARCH"
  time: string;           // e.g. "9:00 AM"
  location: string;       // e.g. "Main Auditorium"
  description?: string | null;
  imageUrl?: string | null;
  registerUrl?: string | null;
  shareUrl?: string | null;
  ctaLabel?: string | null;      // e.g. "Register" | "Details" | "Join Us"
  registeredCount?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryItem {
  id: string;
  imageUrls: string[];
  category: string;
  caption: string;
  colSpan?: number;
  rowSpan?: number;
}

export type AdminTab = 'events' | 'blogs' | 'partners' | 'newsletter' | 'audio' | 'video';

export interface AdminUser {
  email: string;
}

export interface BlogItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  thumbnail?: string | null;
  status: string;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
}

export interface PartnerItem {
  id: number;
  name: string;
  logo?: string | null;
  description?: string | null;
  website?: string | null;
  status: string;
  createdAt?: Date | string | null;
}

export interface NewsletterItem {
  id: number;
  email: string;
  status: string;
  createdAt?: Date | string | null;
}

import type { IconType } from 'react-icons';

export interface DonationProject {
  id: string;
  title: string;
  accountName?: string | null;
  bank?: string | null;
  description: string;
  accountNumber: string;
  icon: string | IconType;
  colorClass: string;
  goal?: string | null;
}
