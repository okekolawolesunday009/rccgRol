import { getSession } from './admin-auth';
import { NextResponse } from 'next/server';

export async function checkAdminAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function checkAdminAuthApi() {
  const session = await getSession();
  if (!session) {
    return { authenticated: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { authenticated: true, session };
}
