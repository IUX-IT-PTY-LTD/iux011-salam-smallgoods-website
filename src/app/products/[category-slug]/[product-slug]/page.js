import { notFound } from 'next/navigation';
import Link from 'next/link';
import NavbarServer from '../../../components/shared/NavbarServer';
import ProductImageViewer from './ProductImageViewer';

function optimizeCloudinaryUrl(url, w, h) {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/c_fill,w_${w},h_${h},q_auto,f_auto/`);
}
import Footer from '../../../components/shared/Footer';
import ProductCard from '../../../components/products/ProductCard';
import { getProducts, getCategoryBySlug, getProductBySlug, getProductsByCategory } from '@/lib/products';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({
    'category-slug': p.categorySlug,
    'product-slug': p.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { 'category-slug': categorySlug, 'product-slug': productSlug } = await params;
  const product = await getProductBySlug(categorySlug, productSlug);
  if (!product) return {};
  return {
    title: `${product.name} – Salam Small Goods`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { 'category-slug': categorySlug, 'product-slug': productSlug } = await params;
  const [product, category] = await Promise.all([
    getProductBySlug(categorySlug, productSlug),
    getCategoryBySlug(categorySlug),
  ]);
  if (!product) notFound();

  const related = (await getProductsByCategory(categorySlug))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      <NavbarServer />
      <main>
        {/* Hero banner */}
        <section style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, #A02010 50%, #D04A28 100%)', padding: '48px 24px 64px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13, flexWrap: 'wrap' }}>
              <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Home</Link>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
              <Link href="/products" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Products</Link>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
              <Link href={`/products/${categorySlug}`} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{category?.label}</Link>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{product.name}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 40, alignItems: 'center' }}>
              <ProductImageViewer
                thumbUrl={optimizeCloudinaryUrl(product.imageUrl, 480, 360)}
                fullUrl={product.imageUrl}
                alt={product.name}
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 50, fontSize: 12, fontWeight: 700, background: 'rgba(255,255,255,0.2)', color: '#fff', letterSpacing: '0.05em' }}>{product.category ?? category?.label}</span>
                  <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 50, fontSize: 12, fontWeight: 700, background: product.inStock ? '#3E6B2A' : '#A83020', color: '#fff', boxShadow: product.inStock ? '0 2px 8px rgba(62,107,42,0.5)' : '0 2px 8px rgba(168,48,32,0.5)' }}>
                    {product.inStock ? '● In Stock' : '● Out of Stock'}
                  </span>
                </div>
                <h1 style={{ fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', margin: '0 0 12px', textShadow: '2px 3px 0px rgba(0,0,0,0.2)', lineHeight: 1.1 }}>{product.name}</h1>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.6 }}>{product.description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Detail section */}
        <section style={{ padding: '64px 24px 80px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                <div className="clay-card" style={{ padding: '40px 36px' }}>
                  <div style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', marginBottom: 12 }}>ABOUT THIS PRODUCT</div>
                  <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.3rem, 2vw, 1.7rem)', color: 'var(--color-ink)', margin: '0 0 20px' }}>{product.name}</h2>
                  <p style={{ fontSize: 15, color: 'var(--color-body)', lineHeight: 1.85, margin: 0 }}>{product.details}</p>
                </div>

                <div className="clay-card-strong" style={{ padding: '32px 36px', display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 40 }}>📞</div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--color-ink)', marginBottom: 6 }}>Interested in this product?</div>
                    <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.5 }}>Visit us in-store or get in touch to place an order or ask a question.</div>
                  </div>
                  <Link href="/contact" className="clay-btn-primary" style={{ fontSize: 14, padding: '12px 24px', whiteSpace: 'nowrap' }}>Contact Us →</Link>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="clay-card" style={{ padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, background: product.inStock ? '#3E6B2A' : '#A83020', boxShadow: product.inStock ? '3px 3px 0px #1E3A10' : '3px 3px 0px #4A0C00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff', fontWeight: 900 }}>
                    {product.inStock ? '✓' : '✕'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--color-ink)', marginBottom: 3 }}>{product.inStock ? 'In Stock' : 'Out of Stock'}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.4 }}>
                      {product.inStock ? 'Available now — visit us in-store.' : 'Currently unavailable. Contact us for updates.'}
                    </div>
                  </div>
                </div>

                <div className="clay-card" style={{ padding: '28px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>☪️</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--color-ink)', marginBottom: 6 }}>100% Halal Certified</div>
                  <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.5 }}>All products carry full halal certification from trusted Australian bodies.</div>
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <div style={{ marginTop: 72 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', marginBottom: 4 }}>MORE FROM THIS CATEGORY</div>
                    <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.3rem, 2vw, 1.6rem)', color: 'var(--color-ink)', margin: 0 }}>More {category?.label} Products</h2>
                  </div>
                  <Link href={`/products/${categorySlug}`} className="clay-btn-secondary" style={{ fontSize: 13, padding: '9px 20px' }}>View All →</Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 28 }}>
                  {related.map((p) => <ProductCard key={p.slug} product={p} />)}
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
