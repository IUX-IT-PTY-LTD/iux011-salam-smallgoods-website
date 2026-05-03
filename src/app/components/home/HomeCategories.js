'use client';

import Link from 'next/link';

export default function HomeCategories({ categories = [], productCounts = {}, content = {} }) {
  const overline = content.overline ?? 'BROWSE BY CATEGORY';
  const title = content.title ?? 'Shop by Category';

  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{overline}</div>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', color: 'var(--color-ink)', margin: 0 }}>
              {title}
            </h2>
          </div>
          <Link href="/products" className="clay-btn-secondary" style={{ fontSize: 14, padding: '10px 22px' }}>
            View All →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 24 }}>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/products/${cat.slug}`} style={{ textDecoration: 'none' }}>
              <div
                className="clay-card"
                style={{ padding: '28px 20px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: 52, marginBottom: 12 }}>{cat.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--color-ink)', marginBottom: 6 }}>{cat.label}</div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.4, marginBottom: 12 }}>{cat.description}</div>
                <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 50, fontSize: 11, fontWeight: 700, background: 'linear-gradient(145deg, var(--color-surface-raised), var(--color-surface-mid))', color: 'var(--color-ink)', boxShadow: '2px 2px 0px var(--color-shadow)' }}>
                  {productCounts[cat.slug] ?? 0} items
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
