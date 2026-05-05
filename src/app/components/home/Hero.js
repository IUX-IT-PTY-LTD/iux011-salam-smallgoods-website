import Link from 'next/link';
import { getFeaturedProducts } from '@/lib/products';

function optimizeCloudinaryUrl(url, w, h) {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/c_fill,w_${w},h_${h},q_auto,f_auto/`);
}

const DEFAULT_STATS = [
  { value: '25+', label: 'Years in Broadmeadows' },
  { value: '100%', label: 'Halal Certified' },
  { value: '500+', label: 'Loyal Customers' },
];

export default async function Hero({ content = {} }) {
  const featured = await getFeaturedProducts(4);

  const stats = content.stats ?? DEFAULT_STATS;
  const overline = content.overline ?? 'Est. 1998 · Broadmeadows, VIC';
  const title = content.title ?? 'Premium Halal Meats';
  const titleAccent = content.titleAccent ?? '& Smallgoods';
  const description = content.description ?? 'Family-owned and halal-certified since 1998. We butcher fresh every morning and craft our smallgoods from recipes passed down for generations.';
  const ctaPrimaryText = content.ctaPrimaryText ?? 'Browse Products';
  const ctaPrimaryHref = content.ctaPrimaryHref ?? '/products';
  const ctaSecondaryText = content.ctaSecondaryText ?? 'Visit Us';
  const ctaSecondaryHref = content.ctaSecondaryHref ?? '/contact';

  return (
    <section style={{ background: '#E8D0A8', padding: '56px 24px 72px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        {/* ── Left column ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 28, height: 3, borderRadius: 2, background: '#CC3A20', flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#CC3A20', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {overline}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 900, color: '#2A0D04', lineHeight: 1.1, margin: '0 0 22px' }}>
            {title}
            <br />
            <span style={{ color: '#CC3A20' }}>{titleAccent}</span>
          </h1>

          <p style={{ fontSize: 16, color: '#5A3020', lineHeight: 1.75, margin: '0 0 36px', maxWidth: 440 }}>
            {description}
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link href={ctaPrimaryHref} className="clay-btn-primary" style={{ fontSize: 15 }}>{ctaPrimaryText}</Link>
            <Link href={ctaSecondaryHref} className="clay-btn-secondary" style={{ fontSize: 15 }}>{ctaSecondaryText}</Link>
          </div>

          <div style={{ display: 'flex', gap: 36, marginTop: 44, paddingTop: 36, borderTop: '1px solid #D4A870', flexWrap: 'wrap' }}>
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontWeight: 900, fontSize: 26, color: '#CC3A20', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#7A5040', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column: product image grid ── */}
        <div className="hero-visual" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {featured.map((product) => (
            <Link key={product.slug} href={`/products/${product.categorySlug}/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div className="clay-card" style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', borderRadius: 20 }}>
                <img
                  src={optimizeCloudinaryUrl(product.imageUrl, 600, 600)}
                  alt={product.name}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(42,13,4,0.75) 0%, transparent 100%)', padding: '20px 12px 10px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{product.name}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
