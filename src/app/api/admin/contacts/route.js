import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifyAdminSession } from '@/lib/adminAuthHelper';

export async function GET(request) {
  const session = await verifyAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let query = adminDb.collection('contact_submissions');
  if (status && status !== 'all') {
    query = query.where('status', '==', status);
  }

  const snap = await query.get();
  const submissions = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return NextResponse.json(submissions);
}
