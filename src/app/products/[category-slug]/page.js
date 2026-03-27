import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import ProductCard from '../../components/products/ProductCard';
import { categories, getCategoryBySlug, getProductsByCategory } from '@/lib/products';

export function generateStaticParams() {
  return categories.map((cat) => ({ 'category-slug': cat.slug }));
}

export async function generateMetadata({ params }) {
  const { 'category-slug': categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};
  return {
    title: `${category.label} – Salam Small Goods`,
    description: `Browse our fresh halal ${category.label.toLowerCase()} — ${category.description}`,
  };
}

export default async function CategoryPage({ params }) {
  const { 'category-slug': categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(categorySlug);

  return (
    <>
      <Navbar />
      <main>
        {/* Banner */}
        <section style={{ padding: '48px 24px 0' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="clay-banner" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{category.emoji}</div>
              <h1
                style={{
                  fontWeight: 900,
                  fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                  color: '#ffffff',
                  margin: '0 0 10px',
                  textShadow: '2px 2px 0px rgba(0,0,0,0.2)',
                }}
              >
                {category.label}
              </h1>
              <p style={{ color: '#F5E0C0', fontSize: 16, margin: 0, opacity: 0.9 }}>
                {category.description}
              </p>
            </div>
          </div>
        </section>

        {/* Products */}
        <section style={{ padding: '48px 24px 80px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 14 }}>
              <Link href="/" style={{ color: '#7A5040', textDecoration: 'none' }}>Home</Link>
              <span style={{ color: '#B8784A' }}>›</span>
              <Link href="/products" style={{ color: '#7A5040', textDecoration: 'none' }}>Products</Link>
              <span style={{ color: '#B8784A' }}>›</span>
              <span style={{ color: '#2A0D04', fontWeight: 600 }}>{category.label}</span>
            </div>

            <div style={{ color: '#7A5040', fontSize: 14, marginBottom: 28, fontWeight: 500 }}>
              {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} in {category.label}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 28,
              }}
            >
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
