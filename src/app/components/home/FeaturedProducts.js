import Link from 'next/link';
import { products } from '@/lib/products';

const featured = products.filter((p) => p.featured);

export default function FeaturedProducts() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Heading */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 40,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div style={{ color: '#ff6b6b', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
              HAND-PICKED FOR YOU
            </div>
            <h2 className="clay-section-title">Featured Products</h2>
          </div>
          <Link
            href="/products"
            className="clay-btn-secondary"
            style={{ fontSize: 14, padding: '10px 22px' }}
          >
            View All Products →
          </Link>
        </div>

        {/* Product grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 28,
          }}
        >
          {featured.map((product) => (
            <div key={product.id} className="clay-card" style={{ padding: 28 }}>
              {/* Emoji image */}
              <div
                style={{
                  fontSize: 56,
                  textAlign: 'center',
                  marginBottom: 16,
                  background: 'linear-gradient(145deg, #fff3e8, #ffeedd)',
                  borderRadius: 16,
                  padding: '16px 0',
                }}
              >
                {product.emoji}
              </div>

              {/* Category badge */}
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 12px',
                  borderRadius: 50,
                  fontSize: 11,
                  fontWeight: 700,
                  background: '#fff3e0',
                  color: '#ff6b6b',
                  marginBottom: 10,
                  boxShadow: '2px 2px 0px #e0b99a',
                }}
              >
                {product.category}
              </span>

              <div
                style={{
                  fontWeight: 800,
                  fontSize: 17,
                  color: '#3d1a0e',
                  marginBottom: 8,
                }}
              >
                {product.name}
              </div>

              <p
                style={{
                  fontSize: 13,
                  color: '#8b6f6f',
                  lineHeight: 1.5,
                  margin: '0 0 16px',
                  minHeight: 52,
                }}
              >
                {product.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: 800, fontSize: 17, color: '#ff6b6b' }}>
                  {product.price}
                </span>
                <Link
                  href="/contact"
                  style={{
                    padding: '7px 16px',
                    borderRadius: 50,
                    background: 'linear-gradient(145deg, #ff8080, #ff5555)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13,
                    textDecoration: 'none',
                    boxShadow: '3px 3px 0px #cc3333',
                  }}
                >
                  Enquire
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
