import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebaseAdmin';

export async function verifyAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;
  if (!session) return null;
  try {
    return await adminAuth.verifySessionCookie(session, true);
  } catch {
    return null;
  }
}
