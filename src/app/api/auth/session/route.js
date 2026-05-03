import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';

const EXPIRY_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export async function POST(request) {
  const { idToken } = await request.json();
  if (!idToken) {
    return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
  }
  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: EXPIRY_MS });
    const response = NextResponse.json({ success: true });
    response.cookies.set('__session', sessionCookie, {
      maxAge: EXPIRY_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('__session', '', {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
  return response;
}
