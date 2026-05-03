/**
 * Firestore seed script.
 * Populates all collections with the existing hardcoded prototype data.
 * Safe to re-run: skips collections/docs that already have data.
 * Use --reset flag to overwrite: node --env-file=.env.local scripts/seed.mjs --reset
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const reset = process.argv.includes('--reset');

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore();

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function seedSingleton(docPath, data, label) {
  const ref = db.doc(docPath);
  const snap = await ref.get();
  if (snap.exists && !reset) {
    console.log(`  ⤷ ${label} already exists — skipping`);
    return;
  }
  await ref.set(data);
  console.log(`  ✓ ${label}`);
}

async function seedCollection(collectionPath, docs, idFn, label) {
  const col = db.collection(collectionPath);
  const snap = await col.limit(1).get();
  if (!snap.empty && !reset) {
    console.log(`  ⤷ ${label} already has data — skipping`);
    return;
  }
  const batch = db.batch();
  for (const doc of docs) {
    batch.set(col.doc(idFn(doc)), doc);
  }
  await batch.commit();
  console.log(`  ✓ ${label} (${docs.length} docs)`);
}

async function seedSection(pageSlug, sectionKey, order, blocks) {
  const sectionId = `${pageSlug}_${sectionKey}`;
  const sectionRef = db.doc(`page_sections/${sectionId}`);
  const snap = await sectionRef.get();
  if (snap.exists && !reset) return;

  await sectionRef.set({ pageSlug, sectionKey, visible: true, order });

  const batch = db.batch();
  for (const [key, { type, value }] of Object.entries(blocks)) {
    batch.set(sectionRef.collection('content_blocks').doc(key), { key, type, value });
  }
  await batch.commit();
  console.log(`    ✓ ${sectionId}`);
}

// ─── Site Theme ──────────────────────────────────────────────────────────────

async function seedTheme() {
  console.log('\n📋 Site Theme');
  await seedSingleton('site_theme/config', {
    colorSurface:          '#E8D0A8',
    colorSurfaceRaised:    '#FBF0DC',
    colorSurfaceMid:       '#F5E4C4',
    colorSurfaceStrong:    '#F8EDD4',
    colorSurfaceStrongMid: '#F0E0BC',
    colorSurfaceHi:        '#FFFAF2',
    colorInk:              '#2A0D04',
    colorBody:             '#5A3020',
    colorMuted:            '#7A5040',
    colorShadow:           '#B8784A',
    colorShadowStrong:     '#A06838',
    colorShadowInset:      '#D4A870',
    colorAccent:           '#CC3A20',
    colorAccentDark:       '#B02808',
    colorAccentShadow:     '#7A1808',
    colorAccentHi:         '#E05030',
    colorStatusOk:         '#3E6B2A',
    colorStatusOkDk:       '#2E5220',
    colorStatusOkSh:       '#1E3A10',
    colorStatusErr:        '#A83020',
    colorStatusErrDk:      '#7A1808',
    colorStatusErrSh:      '#4A0C00',
    colorFooterBg:         '#1A0804',
    colorFooterBg2:        '#2A1208',
    colorFooterText:       '#EDD5B0',
    colorFooterMuted:      '#B89070',
    updatedAt: Timestamp.now(),
  }, 'site_theme/config');
}

// ─── Shop Info ────────────────────────────────────────────────────────────────

async function seedShopInfo() {
  console.log('\n🏪 Shop Info');
  await seedSingleton('shop_info/config', {
    name: 'Salam Small Goods',
    tagline: 'Premium Quality Meats & Smallgoods',
    description: 'A family-owned butcher shop serving the community with fresh, halal-certified meats and house-made smallgoods since 1998.',
    address: '42 Mercer Street, Broadmeadows VIC 3047',
    phone: '(03) 9305 4812',
    email: 'hello@salamsmallgoods.com.au',
    hours: [
      { day: 'Monday – Friday', time: '7:00 AM – 6:00 PM', order: 0 },
      { day: 'Saturday',        time: '7:00 AM – 5:00 PM', order: 1 },
      { day: 'Sunday',          time: '8:00 AM – 2:00 PM', order: 2 },
    ],
    social: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
    updatedAt: Timestamp.now(),
  }, 'shop_info/config');
}

// ─── Categories ───────────────────────────────────────────────────────────────

async function seedCategories() {
  console.log('\n🗂️  Categories');
  const categories = [
    { label: 'Beef',         slug: 'beef',        emoji: '🥩', description: 'Premium halal beef cuts, mince & smallgoods', order: 0 },
    { label: 'Lamb',         slug: 'lamb',        emoji: '🍖', description: 'Tender lamb chops, shanks & mince',           order: 1 },
    { label: 'Chicken',      slug: 'chicken',     emoji: '🍗', description: 'Fresh halal chicken — fillets, wings & more', order: 2 },
    { label: 'Smallgoods',   slug: 'smallgoods',  emoji: '🌭', description: 'House-made sausages, salami & deli meats',    order: 3 },
    { label: 'Jerky & Cured',slug: 'jerky-cured', emoji: '🥓', description: 'Smoked, cured & dried meat snacks',           order: 4 },
  ];
  await seedCollection('categories', categories, (c) => c.slug, 'categories');
}

// ─── Products ─────────────────────────────────────────────────────────────────

async function seedProducts() {
  console.log('\n📦 Products');
  const now = Timestamp.now();
  const products = [
    { slug: 'beef-sausages',        name: 'Beef Sausages',        categorySlug: 'beef',        description: 'Juicy, seasoned beef sausages made from premium cuts. Perfect for the BBQ or pan-fry.',                    details: 'Our beef sausages are crafted from hand-selected premium beef cuts, seasoned with a blend of traditional herbs and spices. Each sausage is packed with natural flavour and has a satisfying snap on the grill. Perfect for a weekend BBQ, a quick pan-fry, or sliced into pasta dishes. Sold by the kilogram — minimum 1 kg per order.',                                                                                                                                                                                       imageUrl: 'https://picsum.photos/seed/beef-sausages/600/400', imagePublicId: null, inStock: true,  featured: true,  order: 0,  createdAt: now, updatedAt: now },
    { slug: 'lamb-chops',           name: 'Lamb Chops',           categorySlug: 'lamb',        description: 'Tender lamb chops from free-range lambs. Rich flavour, perfect for grilling.',                               details: 'Sourced from free-range Australian lambs, our lamb chops are cut thick for maximum juiciness on the grill. The natural marbling delivers rich, complex flavour that needs nothing more than a pinch of salt and a hot grill. Available as loin chops or forequarter chops — just let us know your preference when ordering.',                                                                                                                                                                                                   imageUrl: 'https://picsum.photos/seed/lamb-chops/600/400',    imagePublicId: null, inStock: true,  featured: true,  order: 1,  createdAt: now, updatedAt: now },
    { slug: 'chicken-wings',        name: 'Chicken Wings',        categorySlug: 'chicken',     description: 'Fresh chicken wings, great for marinating or frying. Buy in bulk and save.',                                  details: 'Our fresh halal chicken wings are perfect for marinating overnight and throwing on the grill, or coating in seasoned flour for a crispy deep-fry. We split them into flats and drumettes on request. Great for entertaining — buy 3 kg or more and save on the per-kg price. Ask about our signature marinade.',                                                                                                                                                                                                              imageUrl: 'https://picsum.photos/seed/chicken-wing/600/400',  imagePublicId: null, inStock: true,  featured: true,  order: 2,  createdAt: now, updatedAt: now },
    { slug: 'beef-jerky',           name: 'Beef Jerky',           categorySlug: 'jerky-cured', description: 'House-made beef jerky with a smoky, sweet marinade. A fan favourite snack.',                                  details: 'Our signature house-made beef jerky is slow-smoked using a sweet and smoky marinade developed over many years. Made from lean beef silverside, each batch is marinated for 24 hours before being low-and-slow smoked to perfection. Chewy, flavourful, and completely addictive. A fan favourite — we often sell out by midday Saturday.',                                                                                                                                                                                    imageUrl: 'https://picsum.photos/seed/beef-jerky/600/400',    imagePublicId: null, inStock: false, featured: true,  order: 3,  createdAt: now, updatedAt: now },
    { slug: 'lamb-mince',           name: 'Lamb Mince',           categorySlug: 'lamb',        description: 'Freshly minced lamb shoulder. Perfect for kebabs, burgers, or meatballs.',                                    details: 'Freshly minced from lamb shoulder every morning, our lamb mince has the ideal fat-to-lean ratio for juicy kebabs, kofta, burgers, and meatballs. We never use filler or preservatives — just 100% fresh halal lamb. Available in standard or coarse grind. Comes in 500 g or 1 kg portions.',                                                                                                                                                                                                                                imageUrl: 'https://picsum.photos/seed/lamb-mince/600/400',    imagePublicId: null, inStock: true,  featured: false, order: 4,  createdAt: now, updatedAt: now },
    { slug: 'chicken-breast-fillets',name: 'Chicken Breast Fillets',categorySlug: 'chicken',   description: 'Lean chicken breast fillets, skinless and boneless. Ready to cook.',                                          details: 'Skinless, boneless chicken breast fillets from free-range halal chickens. Trimmed and ready to cook — perfect for grilling, pan-frying, stir-frying, or slicing into salads. Lean, versatile, and consistently tender. We also offer them butterflied or sliced into strips for stir-fry on request at no extra charge.',                                                                                                                                                                                                     imageUrl: 'https://picsum.photos/seed/chicken-breast/600/400',imagePublicId: null, inStock: true,  featured: false, order: 5,  createdAt: now, updatedAt: now },
    { slug: 'beef-salami',          name: 'Beef Salami',          categorySlug: 'smallgoods',  description: 'Traditional-style beef salami, sliced thin. A deli classic.',                                                 details: 'Made in-house using a traditional recipe, our beef salami is seasoned with garlic, black pepper, and a blend of spices before being air-dried to develop deep, rich flavour. Sliced thin to order on our deli slicer. Excellent on a cheese board, in a sandwich, or on a pizza. Available by the 100 g or as a whole log.',                                                                                                                                                                                                  imageUrl: 'https://picsum.photos/seed/beef-salami/600/400',   imagePublicId: null, inStock: true,  featured: false, order: 6,  createdAt: now, updatedAt: now },
    { slug: 'beef-mince',           name: 'Beef Mince',           categorySlug: 'beef',        description: 'Premium quality beef mince, ideal for bolognese, burgers, and more.',                                         details: 'Freshly ground every morning from premium beef chuck and brisket, our beef mince strikes the perfect balance of lean and fat for rich, flavourful results. Available in regular (80/20) and lean (90/10) blends. No additives, no preservatives — just fresh halal beef. Comes in 500 g or 1 kg portions.',                                                                                                                                                                                                                    imageUrl: 'https://picsum.photos/seed/beef-mince/600/400',    imagePublicId: null, inStock: true,  featured: false, order: 7,  createdAt: now, updatedAt: now },
    { slug: 'lamb-shank',           name: 'Lamb Shank',           categorySlug: 'lamb',        description: 'Slow-cook lamb shanks that fall off the bone. A winter warmer favourite.',                                    details: 'Our lamb shanks are cut from the lower leg and are perfect for long, slow braises. After a few hours in the oven with aromatics, the meat becomes meltingly tender and falls off the bone. Sold as individual shanks — typically 400–500 g each. A true winter comfort classic and a consistent bestseller from May to August.',                                                                                                                                                                                             imageUrl: 'https://picsum.photos/seed/lamb-shank/600/400',    imagePublicId: null, inStock: false, featured: false, order: 8,  createdAt: now, updatedAt: now },
    { slug: 'chicken-thigh-fillets',name: 'Chicken Thigh Fillets',categorySlug: 'chicken',     description: 'Juicy boneless chicken thigh fillets. More flavour than breast.',                                             details: 'Boneless, skinless chicken thigh fillets from free-range halal chickens. Thighs are more forgiving than breast — they stay moist and juicy even when cooked on high heat. Perfect for BBQ skewers, curries, stir-fries, and slow cooker dishes. We recommend marinating overnight for best results. Available in 500 g or 1 kg portions.',                                                                                                                                                                                    imageUrl: 'https://picsum.photos/seed/chicken-thigh/600/400', imagePublicId: null, inStock: false, featured: false, order: 9,  createdAt: now, updatedAt: now },
    { slug: 'beef-pastrami',        name: 'Beef Pastrami',        categorySlug: 'jerky-cured', description: 'Seasoned and smoked beef pastrami. Perfect for sandwiches.',                                                  details: 'Our house-made beef pastrami starts with a premium beef brisket brined for five days in a spiced curing mix, then coated in cracked black pepper and coriander before being hot-smoked low and slow. The result is a tender, deeply flavoured deli meat that elevates any sandwich or charcuterie board. Sliced to order.',                                                                                                                                                                                                   imageUrl: 'https://picsum.photos/seed/beef-pastrami/600/400', imagePublicId: null, inStock: true,  featured: false, order: 10, createdAt: now, updatedAt: now },
    { slug: 'lamb-sausages',        name: 'Lamb Sausages',        categorySlug: 'smallgoods',  description: 'Herbed lamb sausages, great on the BBQ or with roasted veg.',                                                 details: 'Our lamb sausages are made in-house from freshly minced lamb shoulder, seasoned with rosemary, garlic, cumin, and a touch of chilli. They have a coarser texture than our beef sausages, giving them a rustic, homemade character. Brilliant on the BBQ, roasted alongside vegetables, or sliced into a hearty stew.',                                                                                                                                                                                                         imageUrl: 'https://picsum.photos/seed/lamb-sausages/600/400', imagePublicId: null, inStock: true,  featured: false, order: 11, createdAt: now, updatedAt: now },
  ];
  await seedCollection('products', products, (p) => p.slug, 'products');
}

// ─── Page Sections ────────────────────────────────────────────────────────────

async function seedPageSections() {
  console.log('\n📄 Page Sections & Content Blocks');

  // home / hero
  await seedSection('home', 'hero', 0, {
    title:              { type: 'text',  value: 'Premium Halal Meats' },
    titleAccent:        { type: 'text',  value: '& Smallgoods' },
    overline:           { type: 'text',  value: 'Est. 1998 · Broadmeadows, VIC' },
    description:        { type: 'richtext', value: 'Family-owned and halal-certified since 1998. We butcher fresh every morning and craft our smallgoods from recipes passed down for generations.' },
    ctaPrimaryText:     { type: 'text',  value: 'Browse Products' },
    ctaPrimaryHref:     { type: 'url',   value: '/products' },
    ctaSecondaryText:   { type: 'text',  value: 'Visit Us' },
    ctaSecondaryHref:   { type: 'url',   value: '/contact' },
    stats:              { type: 'json',  value: JSON.stringify([
      { value: '25+',  label: 'Years in Broadmeadows' },
      { value: '100%', label: 'Halal Certified' },
      { value: '500+', label: 'Loyal Customers' },
    ])},
  });

  // home / homeCategories
  await seedSection('home', 'homeCategories', 1, {
    overline: { type: 'text', value: 'BROWSE BY CATEGORY' },
    title:    { type: 'text', value: 'Shop by Category' },
  });

  // home / whyChooseUs
  await seedSection('home', 'whyChooseUs', 2, {
    overline: { type: 'text', value: 'WHY US' },
    title:    { type: 'text', value: 'Why Choose Salam Small Goods?' },
    features: { type: 'json', value: JSON.stringify([
      { emoji: '☪️', title: 'Halal Certified',  description: 'All our meats are certified halal, sourced from trusted suppliers with full traceability.' },
      { emoji: '🌿', title: 'Fresh Daily Cuts', description: 'We butcher fresh every morning so you always get the best quality, never frozen.' },
      { emoji: '👨‍👩‍👧', title: 'Family Recipe',   description: 'Our smallgoods and sausages are made using traditional family recipes passed down for generations.' },
    ])},
  });

  // home / aboutSnippet
  await seedSection('home', 'aboutSnippet', 3, {
    overline:   { type: 'text',     value: 'OUR STORY' },
    title:      { type: 'text',     value: 'A Family Tradition Since 1998' },
    paragraph1: { type: 'richtext', value: 'Salam Small Goods started as a small corner shop in Broadmeadows, driven by a passion for quality meat and traditional butchery. Over the decades, our family has built relationships with trusted local farmers and suppliers to bring you the freshest, most flavourful meats.' },
    paragraph2: { type: 'richtext', value: 'Every sausage, salami and jerky we make follows recipes handed down through generations — because great flavour doesn\'t come from shortcuts.' },
    stats:      { type: 'json',     value: JSON.stringify([
      { value: '25+',  label: 'Years of Service' },
      { value: '100%', label: 'Halal Certified' },
      { value: '500+', label: 'Happy Regulars' },
    ])},
    ctaText: { type: 'text', value: 'Read Our Full Story →' },
    ctaHref: { type: 'url',  value: '/about' },
  });

  // about / aboutHero
  await seedSection('about', 'aboutHero', 0, {
    emoji:       { type: 'text', value: '🏪' },
    title:       { type: 'text', value: 'About Us' },
    description: { type: 'text', value: 'Family-owned and halal-certified since 1998 — this is our story' },
  });

  // about / ourStory
  await seedSection('about', 'ourStory', 1, {
    overline:   { type: 'text',     value: 'OUR STORY' },
    title:      { type: 'text',     value: 'A Family Tradition Since 1998' },
    paragraph1: { type: 'richtext', value: 'Salam Small Goods started as a small corner shop in Broadmeadows, driven by a passion for quality meat and the belief that every family deserves access to fresh, trustworthy halal produce. What began as a modest neighbourhood butcher has grown — through decades of dedication — into one of the most trusted names in Broadmeadows\'s halal food community.' },
    paragraph2: { type: 'richtext', value: 'Over the years, our family has built deep relationships with trusted local farmers and suppliers, allowing us to guarantee freshness and full traceability on every cut we sell. We butcher fresh every single morning — because we know the difference it makes to taste.' },
    paragraph3: { type: 'richtext', value: 'Every sausage, salami, and piece of beef jerky we make follows recipes handed down through generations. These aren\'t shortcuts — they\'re the foundation of everything we do. When you shop with us, you\'re not just buying meat; you\'re supporting a family business that truly cares about what ends up on your table.' },
    stats:      { type: 'json',     value: JSON.stringify([
      { value: '25+',  label: 'Years of Service', emoji: '📅' },
      { value: '100%', label: 'Halal Certified',  emoji: '☪️' },
      { value: '500+', label: 'Happy Regulars',   emoji: '🤝' },
      { value: '1998', label: 'Est. Broadmeadows',emoji: '📍' },
    ])},
  });

  // about / ourValues
  await seedSection('about', 'ourValues', 2, {
    overline: { type: 'text', value: 'WHAT WE STAND FOR' },
    title:    { type: 'text', value: 'Our Values' },
    values:   { type: 'json', value: JSON.stringify([
      {
        emoji: '☪️',
        title: 'Halal Certified',
        description: 'Every product we sell carries full halal certification from trusted Australian certification bodies. We maintain complete supply-chain traceability so you can buy with absolute confidence — from farm to counter.',
      },
      {
        emoji: '👨‍👩‍👧',
        title: 'Family Owned',
        description: "Three generations of the same family have run this shop. That means every decision we make is personal. We're not a corporation chasing margins — we're your neighbours who care deeply about the quality of what we put in front of you.",
      },
      {
        emoji: '🌿',
        title: 'Fresh Daily',
        description: "We butcher and prepare every morning before the doors open. No frozen product, no days-old cuts. If it's not fresh, it doesn't go in the display case. That's a standard we set for ourselves on day one and have never compromised.",
      },
    ])},
  });

  // products / pageBanner
  await seedSection('products', 'pageBanner', 0, {
    emoji:       { type: 'text', value: '🥩' },
    title:       { type: 'text', value: 'Our Products' },
    description: { type: 'text', value: 'Fresh, halal-certified meats & house-made smallgoods — select a category to browse' },
  });

  // contact / pageBanner
  await seedSection('contact', 'pageBanner', 0, {
    emoji:       { type: 'text', value: '📞' },
    title:       { type: 'text', value: 'Get In Touch' },
    description: { type: 'text', value: 'Enquiries, bulk orders, or just a chat — we\'d love to hear from you.' },
  });
}

// ─── Run ──────────────────────────────────────────────────────────────────────

console.log(`\n🌱 Seeding Firestore${reset ? ' (--reset: overwriting existing data)' : ''}...\n`);

try {
  await seedTheme();
  await seedShopInfo();
  await seedCategories();
  await seedProducts();
  await seedPageSections();
  console.log('\n✅ Seed complete.\n');
} catch (err) {
  console.error('\n❌ Seed failed:', err);
  process.exit(1);
}
