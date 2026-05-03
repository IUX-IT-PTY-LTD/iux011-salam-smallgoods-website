'use server';

import { adminDb } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

export async function updateShopInfo(data) {
  await adminDb.doc('shop_info/config').set(
    { ...data, updatedAt: new Date().toISOString() },
    { merge: true }
  );
  revalidatePath('/', 'layout');
}
