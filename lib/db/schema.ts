import { pgTable, serial, text, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  date: text('date').notNull(), // Day e.g., "14"
  month: text('month').notNull(), // Month e.g., "MARCH"
  time: text('time').notNull(), // Time e.g., "9:00 AM"
  location: text('location').notNull(),
  description: text('description'),
  ctaLabel: text('cta_label').default('Register'),
  imageUrl: text('image_url'),
  registeredCount: integer('registered_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const blogs = pgTable('blogs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  thumbnail: text('thumbnail'),
  status: text('status').default('draft'), // 'draft' | 'published'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const partners = pgTable('partners', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  logo: text('logo'),
  description: text('description'),
  website: text('website'),
  status: text('status').default('active'), // 'active' | 'inactive'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const giveProjects = pgTable('give_projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  accountName: text('account_name').notNull(),
  bank: text('bank').notNull(),
  accountNumber: text('account_number').notNull(),
  description: text('description').notNull().default(''),
  icon: text('icon').notNull().default('FiHeart'),
  colorClass: text('color_class').notNull().default('bg-gradient-to-br from-red-600 to-rose-600'),
  goal: text('goal').default(''),
  order: integer('order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const newsletter = pgTable('newsletter', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  status: text('status').default('subscribed'), // 'subscribed' | 'unsubscribed'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const audioSermons = pgTable('audio_sermons', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  speaker: text('speaker').notNull(),
  audioUrl: text('audio_url').notNull(),
  duration: text('duration'),
  date: text('date'), // "2024-03-10"
  description: text('description'),
  series: text('series'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const videoSermons = pgTable('video_sermons', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  speaker: text('speaker'),
  videoUrl: text('video_url').notNull(),
  thumbnail: text('thumbnail'),
  duration: text('duration'),
  date: text('date'),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject'),
  message: text('message').notNull(),
  status: text('status').default('new'), // 'new' | 'read'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const connectCards = pgTable('connect_cards', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  visitorType: text('visitor_type').default('first-time'),
  interests: text('interests').array(),
  message: text('message'),
  status: text('status').default('new'), // 'new' | 'read'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
