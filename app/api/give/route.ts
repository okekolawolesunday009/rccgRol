import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { giveProjects } from '@/lib/db/schema';

export async function GET() {
  try {
    const list = await db.select().from(giveProjects).orderBy(giveProjects.order);
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch donation projects' }, { status: 500 });
  }
}
