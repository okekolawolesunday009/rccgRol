import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { givePageSettings } from '@/lib/db/schema';
import { checkAdminAuthApi } from '@/lib/admin-check';
import { sql } from 'drizzle-orm';

const DEFAULT_GIVE_PAGE_SETTINGS = {
  heroTitle: 'Your generosity helps advance the mission, support discipleship, and transform lives through Christ.',
  heroSubtitle: 'A modern giving page designed for clarity, trust, and easy access to donation details.',
  heroDescription: 'Use the details below for secure bank transfers or tap Give Now to explore additional options.',
  thankYouHeadline: 'Thank You for Your Generosity',
  thankYouCopy: 'Every gift makes an eternal impact. Thank you for partnering with us to share hope, faith, and care.',
  donationDetails: [
    { label: 'Bank Name', value: 'FIRST CITY MONUMENT Bank' },
    { label: 'Account Name', value: 'REDEEMED CHRISTIAN CHURCH OF GOD RIVER OF LIFE PARISH' },
    { label: 'Account Number', value: '0256742018' },
    { label: 'Reference', value: 'GIVE2026' },
  ],
};

const upsertGiveSettings = async (payload: Record<string, any>) => {
  const existing = await db.select().from(givePageSettings).all();
  if (existing.length > 0) {
    await db.update(givePageSettings)
      .set({
        heroTitle: payload.heroTitle,
        heroSubtitle: payload.heroSubtitle,
        heroDescription: payload.heroDescription,
        thankYouHeadline: payload.thankYouHeadline,
        thankYouCopy: payload.thankYouCopy,
        donationDetails: JSON.stringify(payload.donationDetails || []),
        updatedAt: sql`now()`,
      })
      .where(givePageSettings.id.eq(existing[0].id));
  } else {
    await db.insert(givePageSettings).values({
      heroTitle: payload.heroTitle,
      heroSubtitle: payload.heroSubtitle,
      heroDescription: payload.heroDescription,
      thankYouHeadline: payload.thankYouHeadline,
      thankYouCopy: payload.thankYouCopy,
      donationDetails: JSON.stringify(payload.donationDetails || []),
    });
  }
};

const parseRow = (row: any) => ({
  heroTitle: row.heroTitle,
  heroSubtitle: row.heroSubtitle,
  heroDescription: row.heroDescription,
  thankYouHeadline: row.thankYouHeadline,
  thankYouCopy: row.thankYouCopy,
  donationDetails: JSON.parse(row.donationDetails || '[]'),
});

export async function GET() {
  try {
    const [row] = await db.select().from(givePageSettings).all();
    if (!row) {
      return NextResponse.json(DEFAULT_GIVE_PAGE_SETTINGS);
    }
    return NextResponse.json({ ...DEFAULT_GIVE_PAGE_SETTINGS, ...parseRow(row) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load give page settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) return auth.response;

  try {
    const payload = await request.json();
    await upsertGiveSettings(payload);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save give page settings' }, { status: 500 });
  }
}
