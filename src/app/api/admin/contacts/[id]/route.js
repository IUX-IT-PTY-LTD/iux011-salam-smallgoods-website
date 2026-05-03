import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifyAdminSession } from '@/lib/adminAuthHelper';

export async function GET(request, { params }) {
  const session = await verifyAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const docRef = adminDb.collection('contact_submissions').doc(id);
  const [snap, repliesSnap] = await Promise.all([
    docRef.get(),
    docRef.collection('replies').get(),
  ]);

  if (!snap.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const replies = repliesSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));

  return NextResponse.json({ id: snap.id, ...snap.data(), replies });
}

export async function PATCH(request, { params }) {
  const session = await verifyAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  await adminDb.collection('contact_submissions').doc(id).update(body);
  return NextResponse.json({ ok: true });
}
