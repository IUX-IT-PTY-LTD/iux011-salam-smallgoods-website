import Link from 'next/link';
import NavbarServer from '../components/shared/NavbarServer';
import Footer from '../components/shared/Footer';
import { getCategories, getProducts } from '@/lib/products';
import { getSection } from '@/lib/content';

export const metadata = {
  title: 'Products – Salam Small Goods',
  description: 'Browse our full range of fresh halal meats and house-made smallgoods by category.',
};

export default async function ProductsPage() {
  const [categories, products, banner] = await Promise.all([
    getCategories(),
    getProducts(),
    getSection('products', 'pageBanner'),
  ]);

  const emoji = banner.emoji ?? '🥩';
  const title = banner.title ?? 'Our Products';
  const description = banner.description ?? 'Fresh, halal-certified meats & house-made smallgoods — select a category to browse';

  return (
    <>
      <NavbarServer />
      <main>
        <section style={{ padding: '48px 24px 0' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="clay-banner" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{emoji}</div>
              <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#ffffff', margin: '0 0 10px', textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
                {title}
              </h1>
              <p style={{ color: '#F5E0C0', fontSize: 16, margin: 0, opacity: 0.9 }}>{description}</p>
            </div>
          </div>
        </section>

        <section style={{ padding: '48px 24px 80px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 28 }}>
              {categories.map((cat) => {
                const count = products.filter((p) => p.categorySlug === cat.slug).length;
                return (
                  <Link key={cat.slug} href={`/products/${cat.slug}`} style={{ textDecoration: 'none' }}>
                    <div className="clay-card" style={{ padding: '36px 24px', textAlign: 'center', height: '100%', transition: 'transform 0.15s ease' }}>
                      <div style={{ fontSize: 64, marginBottom: 16 }}>{cat.emoji}</div>
                      <div style={{ fontWeight: 800, fontSize: 18, color: '#2A0D04', marginBottom: 8 }}>{cat.label}</div>
                      <div style={{ fontSize: 13, color: '#7A5040', lineHeight: 1.5, marginBottom: 16 }}>{cat.description}</div>
                      <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 50, fontSize: 12, fontWeight: 700, background: 'linear-gradient(145deg, #CC3A20, #B02808)', color: '#fff', boxShadow: '2px 2px 0px #7A1808' }}>
                        {count} products
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
