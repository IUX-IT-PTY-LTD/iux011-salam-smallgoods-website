'use server';

import { adminDb } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

export async function createCategory(data) {
  const slug = data.slug || data.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const ref = adminDb.collection('categories').doc(slug);
  const snap = await ref.get();
  if (snap.exists) throw new Error(`Category with slug "${slug}" already exists.`);

  await ref.set({
    slug,
    label: data.label,
    emoji: data.emoji ?? '🥩',
    description: data.description ?? '',
    order: data.order ?? 99,
  });

  revalidatePath('/products');
  revalidatePath('/');
  return { slug };
}

export async function updateCategory(slug, data) {
  await adminDb.collection('categories').doc(slug).update(data);
  revalidatePath('/products');
  revalidatePath(`/products/${slug}`);
  revalidatePath('/');
}

export async function deleteCategory(slug) {
  const productsSnap = await adminDb.collection('products').where('categorySlug', '==', slug).limit(1).get();
  if (!productsSnap.empty) throw new Error('Cannot delete a category that still has products.');
  await adminDb.collection('categories').doc(slug).delete();
  revalidatePath('/products');
  revalidatePath('/');
}
