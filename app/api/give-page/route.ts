import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { givePageSettings } from '@/lib/db/schema';

const DEFAULT_GIVE_PAGE_SETTINGS = {
  heroTitle: 'Your generosity helps advance the mission, support discipleship, and transform lives through Christ.',
  heroSubtitle: 'A modern giving page designed for clarity, trust, and easy access to donation details.',
  heroDescription: 'Use the details below for secure bank transfers or tap Give Now to explore additional options.',
  donationDetails: [
    { label: 'Bank Name', value: 'Faith Community Bank' },
    { label: 'Account Name', value: 'RCCG LP17 Discipleship Fund' },
    { label: 'Account Number', value: '12345678' },
    { label: 'Reference', value: 'GIVE2026' },
  ],
};

const parseGiveSettings = (row: any) => ({
  heroTitle: row.heroTitle,
  heroSubtitle: row.heroSubtitle,
  heroDescription: row.heroDescription,
  donationDetails: JSON.parse(row.donationDetails || '[]'),
});

export async function GET() {
  try {
    const [row] = await db.select().from(givePageSettings).all();
    if (!row) {
      return NextResponse.json(DEFAULT_GIVE_PAGE_SETTINGS);
    }

    return NextResponse.json({ ...DEFAULT_GIVE_PAGE_SETTINGS, ...parseGiveSettings(row) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load give page settings' }, { status: 500 });
  }
}
