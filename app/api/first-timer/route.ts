import { NextResponse } from 'next/server';
import { db, ensureFirstTimeVisitorsTable } from '@/lib/db';
import { firstTimeVisitors } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

export async function POST(request: Request) {
  const data = await request.formData();
  const fullName = data.get('fullName')?.toString().trim() ?? '';
  const phoneNumber = data.get('phoneNumber')?.toString().trim() ?? '';
  const email = data.get('email')?.toString().trim() ?? '';
  const gender = data.get('gender')?.toString().trim() ?? '';
  const dateOfBirth = data.get('dateOfBirth')?.toString().trim() ?? '';
  const homeAddress = data.get('homeAddress')?.toString().trim() ?? '';
  const city = data.get('city')?.toString().trim() ?? '';
  const state = data.get('state')?.toString().trim() ?? '';
  const firstTime = data.get('firstTime')?.toString().trim() ?? '';
  const visitDate = data.get('visitDate')?.toString().trim() ?? '';
  const serviceAttended = data.get('serviceAttended')?.toString().trim() ?? '';
  const invitationSource = data.get('invitationSource')?.toString().trim() ?? '';
  const invited = data.get('invited')?.toString().trim() ?? '';
  const invitedBy = data.get('invitedBy')?.toString().trim() ?? '';
  const prayerRequest = data.get('prayerRequest')?.toString().trim() ?? '';
  const contactPermission = data.get('contactPermission')?.toString().trim() ?? '';
  const preferredContactMethod = data.get('preferredContactMethod')?.toString().trim() ?? '';
  const additionalComments = data.get('additionalComments')?.toString().trim() ?? '';

  if (!fullName || !phoneNumber || !firstTime || !visitDate) {
    return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 });
  }

  await ensureFirstTimeVisitorsTable();

  const duplicate = await db
    .select()
    .from(firstTimeVisitors)
    .where(and(eq(firstTimeVisitors.phoneNumber, phoneNumber), eq(firstTimeVisitors.visitDate, visitDate)));

  if (duplicate.length > 0) {
    return NextResponse.json({ error: 'A visitor with this phone number and visit date has already submitted.' }, { status: 409 });
  }

  await db.insert(firstTimeVisitors).values({
    fullName,
    phoneNumber,
    email,
    gender,
    dateOfBirth,
    homeAddress,
    city,
    state,
    firstTime,
    visitDate,
    serviceAttended,
    invitationSource,
    invited,
    invitedBy,
    prayerRequest,
    contactPermission,
    preferredContactMethod,
    additionalComments,
    followUpStatus: 'New',
    createdBy: 'public',
    updatedBy: 'public',
  });

  return NextResponse.json({ success: true });
}
