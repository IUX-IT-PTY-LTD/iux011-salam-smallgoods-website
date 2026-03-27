export const categories = [
  {
    label: 'Beef',
    slug: 'beef',
    emoji: '🥩',
    description: 'Premium halal beef cuts, mince & smallgoods',
  },
  {
    label: 'Lamb',
    slug: 'lamb',
    emoji: '🍖',
    description: 'Tender lamb chops, shanks & mince',
  },
  {
    label: 'Chicken',
    slug: 'chicken',
    emoji: '🍗',
    description: 'Fresh halal chicken — fillets, wings & more',
  },
  {
    label: 'Smallgoods',
    slug: 'smallgoods',
    emoji: '🌭',
    description: 'House-made sausages, salami & deli meats',
  },
  {
    label: 'Jerky & Cured',
    slug: 'jerky-cured',
    emoji: '🥓',
    description: 'Smoked, cured & dried meat snacks',
  },
];

export const products = [
  {
    id: 1,
    slug: 'beef-sausages',
    name: 'Beef Sausages',
    category: 'Beef',
    categorySlug: 'beef',
    description: 'Juicy, seasoned beef sausages made from premium cuts. Perfect for the BBQ or pan-fry.',
    details:
      'Our beef sausages are crafted from hand-selected premium beef cuts, seasoned with a blend of traditional herbs and spices. Each sausage is packed with natural flavour and has a satisfying snap on the grill. Perfect for a weekend BBQ, a quick pan-fry, or sliced into pasta dishes. Sold by the kilogram — minimum 1 kg per order.',
    image: 'https://picsum.photos/seed/beef-sausages/600/400',
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    slug: 'lamb-chops',
    name: 'Lamb Chops',
    category: 'Lamb',
    categorySlug: 'lamb',
    description: 'Tender lamb chops from free-range lambs. Rich flavour, perfect for grilling.',
    details:
      'Sourced from free-range Australian lambs, our lamb chops are cut thick for maximum juiciness on the grill. The natural marbling delivers rich, complex flavour that needs nothing more than a pinch of salt and a hot grill. Available as loin chops or forequarter chops — just let us know your preference when ordering.',
    image: 'https://picsum.photos/seed/lamb-chops/600/400',
    inStock: true,
    featured: true,
  },
  {
    id: 3,
    slug: 'chicken-wings',
    name: 'Chicken Wings',
    category: 'Chicken',
    categorySlug: 'chicken',
    description: 'Fresh chicken wings, great for marinating or frying. Buy in bulk and save.',
    details:
      'Our fresh halal chicken wings are perfect for marinating overnight and throwing on the grill, or coating in seasoned flour for a crispy deep-fry. We split them into flats and drumettes on request. Great for entertaining — buy 3 kg or more and save on the per-kg price. Ask about our signature marinade.',
    image: 'https://picsum.photos/seed/chicken-wing/600/400',
    inStock: true,
    featured: true,
  },
  {
    id: 4,
    slug: 'beef-jerky',
    name: 'Beef Jerky',
    category: 'Jerky & Cured',
    categorySlug: 'jerky-cured',
    description: 'House-made beef jerky with a smoky, sweet marinade. A fan favourite snack.',
    details:
      'Our signature house-made beef jerky is slow-smoked using a sweet and smoky marinade developed over many years. Made from lean beef silverside, each batch is marinated for 24 hours before being low-and-slow smoked to perfection. Chewy, flavourful, and completely addictive. A fan favourite — we often sell out by midday Saturday.',
    image: 'https://picsum.photos/seed/beef-jerky/600/400',
    inStock: false,
    featured: true,
  },
  {
    id: 5,
    slug: 'lamb-mince',
    name: 'Lamb Mince',
    category: 'Lamb',
    categorySlug: 'lamb',
    description: 'Freshly minced lamb shoulder. Perfect for kebabs, burgers, or meatballs.',
    details:
      'Freshly minced from lamb shoulder every morning, our lamb mince has the ideal fat-to-lean ratio for juicy kebabs, kofta, burgers, and meatballs. We never use filler or preservatives — just 100% fresh halal lamb. Available in standard or coarse grind. Comes in 500 g or 1 kg portions.',
    image: 'https://picsum.photos/seed/lamb-mince/600/400',
    inStock: true,
    featured: false,
  },
  {
    id: 6,
    slug: 'chicken-breast-fillets',
    name: 'Chicken Breast Fillets',
    category: 'Chicken',
    categorySlug: 'chicken',
    description: 'Lean chicken breast fillets, skinless and boneless. Ready to cook.',
    details:
      'Skinless, boneless chicken breast fillets from free-range halal chickens. Trimmed and ready to cook — perfect for grilling, pan-frying, stir-frying, or slicing into salads. Lean, versatile, and consistently tender. We also offer them butterflied or sliced into strips for stir-fry on request at no extra charge.',
    image: 'https://picsum.photos/seed/chicken-breast/600/400',
    inStock: true,
    featured: false,
  },
  {
    id: 7,
    slug: 'beef-salami',
    name: 'Beef Salami',
    category: 'Smallgoods',
    categorySlug: 'smallgoods',
    description: 'Traditional-style beef salami, sliced thin. A deli classic.',
    details:
      'Made in-house using a traditional recipe, our beef salami is seasoned with garlic, black pepper, and a blend of spices before being air-dried to develop deep, rich flavour. Sliced thin to order on our deli slicer. Excellent on a cheese board, in a sandwich, or on a pizza. Available by the 100 g or as a whole log.',
    image: 'https://picsum.photos/seed/beef-salami/600/400',
    inStock: true,
    featured: false,
  },
  {
    id: 8,
    slug: 'beef-mince',
    name: 'Beef Mince',
    category: 'Beef',
    categorySlug: 'beef',
    description: 'Premium quality beef mince, ideal for bolognese, burgers, and more.',
    details:
      'Freshly ground every morning from premium beef chuck and brisket, our beef mince strikes the perfect balance of lean and fat for rich, flavourful results. Available in regular (80/20) and lean (90/10) blends. No additives, no preservatives — just fresh halal beef. Comes in 500 g or 1 kg portions.',
    image: 'https://picsum.photos/seed/beef-mince/600/400',
    inStock: true,
    featured: false,
  },
  {
    id: 9,
    slug: 'lamb-shank',
    name: 'Lamb Shank',
    category: 'Lamb',
    categorySlug: 'lamb',
    description: 'Slow-cook lamb shanks that fall off the bone. A winter warmer favourite.',
    details:
      'Our lamb shanks are cut from the lower leg and are perfect for long, slow braises. After a few hours in the oven with aromatics, the meat becomes meltingly tender and falls off the bone. Sold as individual shanks — typically 400–500 g each. A true winter comfort classic and a consistent bestseller from May to August.',
    image: 'https://picsum.photos/seed/lamb-shank/600/400',
    inStock: false,
    featured: false,
  },
  {
    id: 10,
    slug: 'chicken-thigh-fillets',
    name: 'Chicken Thigh Fillets',
    category: 'Chicken',
    categorySlug: 'chicken',
    description: 'Juicy boneless chicken thigh fillets. More flavour than breast.',
    details:
      'Boneless, skinless chicken thigh fillets from free-range halal chickens. Thighs are more forgiving than breast — they stay moist and juicy even when cooked on high heat. Perfect for BBQ skewers, curries, stir-fries, and slow cooker dishes. We recommend marinating overnight for best results. Available in 500 g or 1 kg portions.',
    image: 'https://picsum.photos/seed/chicken-thigh/600/400',
    inStock: false,
    featured: false,
  },
  {
    id: 11,
    slug: 'beef-pastrami',
    name: 'Beef Pastrami',
    category: 'Jerky & Cured',
    categorySlug: 'jerky-cured',
    description: 'Seasoned and smoked beef pastrami. Perfect for sandwiches.',
    details:
      'Our house-made beef pastrami starts with a premium beef brisket brined for five days in a spiced curing mix, then coated in cracked black pepper and coriander before being hot-smoked low and slow. The result is a tender, deeply flavoured deli meat that elevates any sandwich or charcuterie board. Sliced to order.',
    image: 'https://picsum.photos/seed/beef-pastrami/600/400',
    inStock: true,
    featured: false,
  },
  {
    id: 12,
    slug: 'lamb-sausages',
    name: 'Lamb Sausages',
    category: 'Smallgoods',
    categorySlug: 'smallgoods',
    description: 'Herbed lamb sausages, great on the BBQ or with roasted veg.',
    details:
      'Our lamb sausages are made in-house from freshly minced lamb shoulder, seasoned with rosemary, garlic, cumin, and a touch of chilli. They have a coarser texture than our beef sausages, giving them a rustic, homemade character. Brilliant on the BBQ, roasted alongside vegetables, or sliced into a hearty stew.',
    image: 'https://picsum.photos/seed/lamb-sausages/600/400',
    inStock: true,
    featured: false,
  },
];

export function getProductBySlug(categorySlug, productSlug) {
  return (
    products.find(
      (p) => p.categorySlug === categorySlug && p.slug === productSlug
    ) || null
  );
}

export function getProductsByCategory(categorySlug) {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug) || null;
}
