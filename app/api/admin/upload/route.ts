import { NextResponse } from 'next/server';
import { checkAdminAuthApi } from '@/lib/admin-check';
import { uploadImageBuffer } from '@/lib/storage/local';

export async function POST(request: Request) {
  const auth = await checkAdminAuthApi();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imageUrl = await uploadImageBuffer(buffer);
    return NextResponse.json({ url: imageUrl });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
