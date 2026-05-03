'use server';

import { adminDb } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

export async function saveTheme(tokens) {
  await adminDb.doc('site_theme/config').set(
    { ...tokens, updatedAt: new Date().toISOString() },
    { merge: true }
  );
  revalidatePath('/', 'layout');
}
