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

export async function getShopInfo() {
  const snap = await adminDb.doc('shop_info/config').get();
  return snap.exists ? serializeDoc(snap.data()) : null;
}
