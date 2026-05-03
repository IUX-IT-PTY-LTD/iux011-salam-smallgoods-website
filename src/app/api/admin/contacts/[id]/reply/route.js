import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifyAdminSession } from '@/lib/adminAuthHelper';
import { sendReply } from '@/lib/email';

export async function POST(request, { params }) {
  const session = await verifyAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { body, subject } = await request.json();
  if (!body?.trim()) return NextResponse.json({ error: 'Reply body is required' }, { status: 400 });

  const docRef = adminDb.collection('contact_submissions').doc(id);
  const snap = await docRef.get();
  if (!snap.exists) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });

  const submission = snap.data();
  const sentAt = new Date().toISOString();

  await Promise.all([
    docRef.collection('replies').add({ body, sentAt }),
    docRef.update({ status: 'replied' }),
    sendReply({ to: submission.email, toName: submission.name, subject, body }),
  ]);

  return NextResponse.json({ ok: true, sentAt });
}
