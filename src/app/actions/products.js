'use server';

import { adminDb } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

export async function createProduct(data) {
  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const ref = adminDb.collection('products').doc(slug);
  const snap = await ref.get();
  if (snap.exists) throw new Error(`Product with slug "${slug}" already exists.`);

  await ref.set({
    slug,
    name: data.name,
    categorySlug: data.categorySlug,
    description: data.description ?? '',
    details: data.details ?? '',
    imageUrl: data.imageUrl ?? '',
    imagePublicId: data.imagePublicId ?? '',
    inStock: data.inStock ?? true,
    featured: data.featured ?? false,
    order: data.order ?? 99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  revalidatePath('/products');
  revalidatePath(`/products/${data.categorySlug}`);
  revalidatePath('/');
  return { slug };
}

export async function updateProduct(slug, data) {
  const ref = adminDb.collection('products').doc(slug);
  await ref.update({
    ...data,
    updatedAt: new Date().toISOString(),
  });

  revalidatePath('/products');
  revalidatePath(`/products/${data.categorySlug ?? ''}`);
  revalidatePath(`/products/${data.categorySlug ?? ''}/${slug}`);
  revalidatePath('/');
}

export async function deleteProduct(slug, categorySlug) {
  await adminDb.collection('products').doc(slug).delete();
  revalidatePath('/products');
  if (categorySlug) revalidatePath(`/products/${categorySlug}`);
  revalidatePath('/');
}

export async function toggleProductStock(slug, inStock, categorySlug) {
  await adminDb.collection('products').doc(slug).update({
    inStock,
    updatedAt: new Date().toISOString(),
  });
  revalidatePath('/products');
  if (categorySlug) {
    revalidatePath(`/products/${categorySlug}`);
    revalidatePath(`/products/${categorySlug}/${slug}`);
  }
  revalidatePath('/');
}

export async function toggleProductFeatured(slug, featured) {
  await adminDb.collection('products').doc(slug).update({
    featured,
    updatedAt: new Date().toISOString(),
  });
  revalidatePath('/');
}
