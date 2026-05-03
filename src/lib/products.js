import { adminDb } from '@/lib/firebaseAdmin';

function serializeDoc(data) {
  if (!data) return null;
  const result = {};
  for (const [k, v] of Object.entries(data)) {
    if (v && typeof v === 'object' && typeof v.toDate === 'function') {
      result[k] = v.toDate().toISOString();
    } else {
      result[k] = v;
    }
  }
  return result;
}

export async function getCategories() {
  const snap = await adminDb.collection('categories').orderBy('order').get();
  return snap.docs.map((d) => serializeDoc(d.data()));
}

export async function getCategoryBySlug(slug) {
  const snap = await adminDb.collection('categories').doc(slug).get();
  return snap.exists ? serializeDoc(snap.data()) : null;
}

export async function getProducts() {
  const snap = await adminDb.collection('products').orderBy('order').get();
  return snap.docs.map((d) => serializeDoc(d.data()));
}

export async function getFeaturedProducts(limit = 4) {
  const snap = await adminDb.collection('products').where('featured', '==', true).get();
  const all = snap.docs.map((d) => serializeDoc(d.data()));
  return all.sort((a, b) => a.order - b.order).slice(0, limit);
}

export async function getProductsByCategory(categorySlug) {
  const snap = await adminDb
    .collection('products')
    .where('categorySlug', '==', categorySlug)
    .get();
  const all = snap.docs.map((d) => serializeDoc(d.data()));
  return all.sort((a, b) => a.order - b.order);
}

export async function getProductBySlug(categorySlug, productSlug) {
  const snap = await adminDb.collection('products').doc(productSlug).get();
  if (!snap.exists) return null;
  const product = serializeDoc(snap.data());
  return product.categorySlug === categorySlug ? product : null;
}
