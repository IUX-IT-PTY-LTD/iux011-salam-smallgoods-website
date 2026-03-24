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

export async function generateMetadata({ params }) {
  const { 'category-slug': categorySlug, 'product-slug': productSlug } = await params;
  const product = getProductBySlug(categorySlug, productSlug);
  if (!product) return {};
  return {
    title: `${product.name} – Salam Small Goods`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { 'category-slug': categorySlug, 'product-slug': productSlug } = await params;
  const product = getProductBySlug(categorySlug, productSlug);
  if (!product) notFound();

  const category = getCategoryBySlug(categorySlug);
  const related = getProductsByCategory(categorySlug)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero banner */}
        <section
          style={{
            background: 'linear-gradient(135deg, #CC3A20 0%, #A02010 50%, #D04A28 100%)',
            padding: '48px 24px 64px',
          }}
        >
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 32,
                fontSize: 13,
                flexWrap: 'wrap',
              }}
            >
              <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                Home
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
              <Link href="/products" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                Products
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
              <Link
                href={`/products/${categorySlug}`}
                style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}
              >
                {category?.label}
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{product.name}</span>
            </div>

            {/* Hero content */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                gap: 40,
                alignItems: 'center',
              }}
            >
              {/* Emoji tile */}
              <div
                style={{
                  fontSize: 96,
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.12)',
                  borderRadius: 28,
                  padding: '32px 0',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {product.emoji}
              </div>

              {/* Title block */}
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 14px',
                    borderRadius: 50,
                    fontSize: 12,
                    fontWeight: 700,
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    marginBottom: 14,
                    letterSpacing: '0.05em',
                  }}
                >
                  {product.category}
                </span>
                <h1
                  style={{
                    fontWeight: 900,
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    color: '#fff',
                    margin: '0 0 12px',
                    textShadow: '2px 3px 0px rgba(0,0,0,0.2)',
                    lineHeight: 1.1,
                  }}
                >
                  {product.name}
                </h1>
                <p
                  style={{
                    fontSize: 16,
                    color: 'rgba(255,255,255,0.85)',
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detail section */}
        <section style={{ padding: '64px 24px 80px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 340px',
                gap: 40,
                alignItems: 'start',
              }}
            >
              {/* Left: full description */}
              <div
                className="clay-card"
                style={{ padding: '40px 36px' }}
              >
                <div
                  style={{
                    color: '#CC3A20',
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: '0.08em',
                    marginBottom: 12,
                  }}
                >
                  ABOUT THIS PRODUCT
                </div>
                <h2
                  style={{
                    fontWeight: 900,
                    fontSize: 'clamp(1.3rem, 2vw, 1.7rem)',
                    color: '#2A0D04',
                    margin: '0 0 20px',
                  }}
                >
                  {product.name}
                </h2>
                <p
                  style={{
                    fontSize: 15,
                    color: '#5A3020',
                    lineHeight: 1.85,
                    margin: 0,
                  }}
                >
                  {product.details}
                </p>
              </div>

              {/* Right: CTA card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Halal badge card */}
                <div
                  className="clay-card"
                  style={{ padding: '28px 24px', textAlign: 'center' }}
                >
                  <div style={{ fontSize: 40, marginBottom: 10 }}>☪️</div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 15,
                      color: '#2A0D04',
                      marginBottom: 6,
                    }}
                  >
                    100% Halal Certified
                  </div>
                  <div style={{ fontSize: 13, color: '#7A5040', lineHeight: 1.5 }}>
                    All products carry full halal certification from trusted Australian bodies.
                  </div>
                </div>

                {/* Enquire CTA */}
                <div
                  className="clay-card-strong"
                  style={{ padding: '32px 28px', textAlign: 'center' }}
                >
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📞</div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 16,
                      color: '#2A0D04',
                      marginBottom: 8,
                    }}
                  >
                    Interested in this product?
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: '#7A5040',
                      lineHeight: 1.5,
                      marginBottom: 20,
                    }}
                  >
                    Visit us in-store or get in touch to place an order or ask a question.
                  </div>
                  <Link
                    href="/contact"
                    className="clay-btn-primary"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      fontSize: 14,
                      padding: '12px 20px',
                    }}
                  >
                    Contact Us →
                  </Link>
                  <Link
                    href={`/products/${categorySlug}`}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      fontSize: 13,
                      color: '#7A5040',
                      marginTop: 14,
                      textDecoration: 'none',
                    }}
                  >
                    ← Back to {category?.label}
                  </Link>
                </div>
              </div>
            </div>

            {/* Related products */}
            {related.length > 0 && (
              <div style={{ marginTop: 72 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    marginBottom: 28,
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: '#CC3A20',
                        fontWeight: 700,
                        fontSize: 13,
                        letterSpacing: '0.08em',
                        marginBottom: 4,
                      }}
                    >
                      MORE FROM THIS CATEGORY
                    </div>
                    <h2
                      style={{
                        fontWeight: 900,
                        fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
                        color: '#2A0D04',
                        margin: 0,
                      }}
                    >
                      More {category?.label} Products
                    </h2>
                  </div>
                  <Link
                    href={`/products/${categorySlug}`}
                    className="clay-btn-secondary"
                    style={{ fontSize: 13, padding: '9px 20px' }}
                  >
                    View All →
                  </Link>
                </div>
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
