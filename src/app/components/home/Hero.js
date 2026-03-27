import Link from 'next/link';
import { products } from '@/lib/products';

const stats = [
  { value: '25+', label: 'Years in Broadmeadows' },
  { value: '100%', label: 'Halal Certified' },
  { value: '500+', label: 'Loyal Customers' },
];

export default function Hero() {
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <section style={{ background: '#E8D0A8', padding: '56px 24px 72px' }}>
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
        }}
      >
        {/* ── Left column ── */}
        <div>
          {/* Overline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 28, height: 3, borderRadius: 2, background: '#CC3A20', flexShrink: 0 }} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#CC3A20',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Est. 1998 · Broadmeadows, VIC
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              fontWeight: 900,
              color: '#2A0D04',
              lineHeight: 1.1,
              margin: '0 0 22px',
            }}
          >
            Premium Halal Meats
            <br />
            <span style={{ color: '#CC3A20' }}>&amp; Smallgoods</span>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 16,
              color: '#5A3020',
              lineHeight: 1.75,
              margin: '0 0 36px',
              maxWidth: 440,
            }}
          >
            Family-owned and halal-certified since 1998. We butcher fresh every morning
            and craft our smallgoods from recipes passed down for generations.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link href="/products" className="clay-btn-primary" style={{ fontSize: 15 }}>
              Browse Products
            </Link>
            <Link href="/contact" className="clay-btn-secondary" style={{ fontSize: 15 }}>
              Visit Us
            </Link>
          </div>

          {/* Stat strip */}
          <div
            style={{
              display: 'flex',
              gap: 36,
              marginTop: 44,
              paddingTop: 36,
              borderTop: '1px solid #D4A870',
              flexWrap: 'wrap',
            }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontWeight: 900, fontSize: 26, color: '#CC3A20', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: '#7A5040', fontWeight: 600, marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column: product image grid ── */}
        <div
          className="hero-visual"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: 12,
            aspectRatio: '1',
          }}
        >
          {featured.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.categorySlug}/${product.slug}`}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <div
                className="clay-card"
                style={{
                  height: '100%',
                  overflow: 'hidden',
                  borderRadius: 20,
                  position: 'relative',
                  minHeight: 160,
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                {/* Label overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(42,13,4,0.75) 0%, transparent 100%)',
                    padding: '20px 12px 10px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#fff',
                      lineHeight: 1.2,
                    }}
                  >
                    {product.name}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
