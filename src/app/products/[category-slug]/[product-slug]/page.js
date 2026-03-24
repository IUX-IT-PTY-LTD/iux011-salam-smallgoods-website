import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/shared/Navbar';
import Footer from '../../../components/shared/Footer';
import ProductCard from '../../../components/products/ProductCard';
import {
  products,
  getCategoryBySlug,
  getProductBySlug,
  getProductsByCategory,
} from '@/lib/products';

export function generateStaticParams() {
  return products.map((p) => ({
    'category-slug': p.categorySlug,
    'product-slug': p.slug,
  }));
}

export function generateMetadata({ params }) {
  const product = getProductBySlug(params['category-slug'], params['product-slug']);
  if (!product) return {};
  return {
    title: `${product.name} – Salam Small Goods`,
    description: product.description,
  };
}

export default function ProductPage({ params }) {
  const product = getProductBySlug(params['category-slug'], params['product-slug']);
  if (!product) notFound();

  const category = getCategoryBySlug(params['category-slug']);
  const related = getProductsByCategory(params['category-slug'])
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        <section style={{ padding: '48px 24px 80px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, fontSize: 14, flexWrap: 'wrap' }}>
              <Link href="/" style={{ color: '#7A5040', textDecoration: 'none' }}>Home</Link>
              <span style={{ color: '#B8784A' }}>›</span>
              <Link href="/products" style={{ color: '#7A5040', textDecoration: 'none' }}>Products</Link>
              <span style={{ color: '#B8784A' }}>›</span>
              <Link href={`/products/${product.categorySlug}`} style={{ color: '#7A5040', textDecoration: 'none' }}>
                {category?.label}
              </Link>
              <span style={{ color: '#B8784A' }}>›</span>
              <span style={{ color: '#2A0D04', fontWeight: 600 }}>{product.name}</span>
            </div>

            {/* Product detail card */}
            <div
              className="clay-card-strong"
              style={{
                padding: '48px 40px',
                display: 'grid',
                gridTemplateColumns: '1fr 1.5fr',
                gap: 48,
                alignItems: 'start',
                marginBottom: 64,
              }}
            >
              {/* Left: visual */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: 100,
                    background: 'linear-gradient(145deg, #EDD5B0, #E0C090)',
                    borderRadius: 24,
                    padding: '40px 0',
                    boxShadow: '6px 6px 0px #B8784A, inset 2px 2px 8px #F5E0C0',
                    marginBottom: 20,
                  }}
                >
                  {product.emoji}
                </div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 16px',
                    borderRadius: 50,
                    fontSize: 12,
                    fontWeight: 700,
                    background: 'linear-gradient(145deg, #EDD5B0, #E0C090)',
                    color: '#CC3A20',
                    boxShadow: '2px 2px 0px #B8784A',
                  }}
                >
                  {product.category}
                </span>
              </div>

              {/* Right: info */}
              <div>
                <h1
                  style={{
                    fontWeight: 900,
                    fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                    color: '#2A0D04',
                    margin: '0 0 16px',
                  }}
                >
                  {product.name}
                </h1>

                <div
                  style={{
                    fontWeight: 900,
                    fontSize: 28,
                    color: '#CC3A20',
                    marginBottom: 24,
                  }}
                >
                  {product.price}
                </div>

                <p
                  style={{
                    fontSize: 15,
                    color: '#5A3020',
                    lineHeight: 1.8,
                    marginBottom: 32,
                  }}
                >
                  {product.details}
                </p>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link
                    href="/contact"
                    className="clay-btn-primary"
                    style={{ fontSize: 15 }}
                  >
                    📞 Enquire Now
                  </Link>
                  <Link
                    href={`/products/${product.categorySlug}`}
                    className="clay-btn-secondary"
                    style={{ fontSize: 15 }}
                  >
                    ← Back to {category?.label}
                  </Link>
                </div>
              </div>
            </div>

            {/* Related products */}
            {related.length > 0 && (
              <div>
                <h2
                  style={{
                    fontWeight: 900,
                    fontSize: 'clamp(1.3rem, 2vw, 1.8rem)',
                    color: '#2A0D04',
                    marginBottom: 28,
                  }}
                >
                  More in {category?.label}
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: 28,
                  }}
                >
                  {related.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
