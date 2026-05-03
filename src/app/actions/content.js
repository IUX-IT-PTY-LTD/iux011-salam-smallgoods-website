'use server';

import { adminDb } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

const PAGE_PATHS = {
  home: '/',
  about: '/about',
  products: '/products',
  contact: '/contact',
};

export async function saveSection(pageSlug, sectionKey, updates) {
  const sectionRef = adminDb.doc(`page_sections/${pageSlug}_${sectionKey}`);
  const batch = adminDb.batch();

  for (const [key, { type, value }] of Object.entries(updates)) {
    const blockRef = sectionRef.collection('content_blocks').doc(key);
    batch.set(blockRef, { key, type, value }, { merge: true });
  }

  await batch.commit();

  if (PAGE_PATHS[pageSlug]) revalidatePath(PAGE_PATHS[pageSlug]);
}
