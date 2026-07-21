import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { giveProjects } from '@/lib/db/schema';
import { checkAdminAuthApi } from '@/lib/admin-check';
import { eq } from 'drizzle-orm';

function buildProjectPayload(input: {
  title: string;
  accountName: string;
  bank: string;
  accountNumber: string;
  description?: string | null;
  icon?: string | null;
  colorClass?: string | null;
  goal?: string | null;
  order?: number | null;
}) {
  const title = input.title?.trim();
  const accountName = input.accountName?.trim();
  const bank = input.bank?.trim();
  const accountNumber = input.accountNumber?.trim();

  return {
    title,
    accountName,
    bank,
    accountNumber,
    description: input.description?.trim() || `Support ${title} through ${accountName} at ${bank}.`,
    goal: input.goal?.trim() || `Support ${title}`,
    icon: input.icon || 'FiHeart',
    colorClass: input.colorClass || 'bg-gradient-to-br from-amber-500 to-orange-600',
    order: Number(input.order ?? 0),
  };
}

export async function GET() {
  try {
    const list = await db.select().from(giveProjects).orderBy(giveProjects.order);
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch donation projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const { title, accountName, bank, accountNumber } = body;

    if (!title || !accountName || !bank || !accountNumber) {
      return NextResponse.json({ error: 'Project title, account name, bank, and account number are required' }, { status: 400 });
    }

    const payload = buildProjectPayload({ title, accountName, bank, accountNumber, description: body.description, icon: body.icon, colorClass: body.colorClass, goal: body.goal, order: body.order });

    const [newProject] = await db.insert(giveProjects).values(payload).returning();

    return NextResponse.json(newProject);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create donation project' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const { id, title, accountName, bank, accountNumber } = body;

    if (!id || !title || !accountName || !bank || !accountNumber) {
      return NextResponse.json({ error: 'Project title, account name, bank, and account number are required' }, { status: 400 });
    }

    const payload = buildProjectPayload({ title, accountName, bank, accountNumber, description: body.description, icon: body.icon, colorClass: body.colorClass, goal: body.goal, order: body.order });

    const [updatedProject] = await db.update(giveProjects)
      .set(payload)
      .where(eq(giveProjects.id, Number(id)))
      .returning();

    return NextResponse.json(updatedProject);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update donation project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
    }

    await db.delete(giveProjects).where(eq(giveProjects.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete donation project' }, { status: 500 });
  }
}
