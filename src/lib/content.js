import { adminDb } from '@/lib/firebaseAdmin';

function parseBlocks(docs) {
  const result = {};
  for (const doc of docs) {
    const { key, type, value } = doc.data();
    if (type === 'json') {
      try { result[key] = JSON.parse(value); } catch { result[key] = value; }
    } else {
      result[key] = value;
    }
  }
  return result;
}

export async function getSection(pageSlug, sectionKey) {
  try {
    const snap = await adminDb
      .doc(`page_sections/${pageSlug}_${sectionKey}`)
      .collection('content_blocks')
      .get();
    return parseBlocks(snap.docs);
  } catch {
    return {};
  }
}

// For admin editor: returns sections with raw block data for each page
export async function getAdminPageSections(pageSlug) {
  const sectionsSnap = await adminDb
    .collection('page_sections')
    .where('pageSlug', '==', pageSlug)
    .get();

  const sections = sectionsSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => a.order - b.order);

  return Promise.all(
    sections.map(async (section) => {
      const blocksSnap = await adminDb
        .doc(`page_sections/${section.id}`)
        .collection('content_blocks')
        .get();
      const blocks = blocksSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return { ...section, blocks };
    })
  );
}
