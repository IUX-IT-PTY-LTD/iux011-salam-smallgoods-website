import Link from 'next/link';

const badges = [
  { emoji: '✅', label: 'Halal Certified' },
  { emoji: '🌿', label: 'Fresh Daily' },
  { emoji: '👨‍👩‍👧', label: 'Family Owned' },
];

export default function Hero() {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0cc 50%, #ffd0b5 100%)',
        padding: '80px 24px',
      }}
    >
      <div className="hero-grid" style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Left: Text */}
        <div>
          {/* Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
            {badges.map((b) => (
              <span key={b.label} className="clay-badge" style={{ color: '#3d1a0e' }}>
                {b.emoji} {b.label}
              </span>
            ))}
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 900,
              color: '#3d1a0e',
              lineHeight: 1.15,
              margin: '0 0 20px',
            }}
          >
            Premium Quality{' '}
            <span style={{ color: '#ff6b6b' }}>Meats &amp; Smallgoods</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: '#8b6f6f',
              lineHeight: 1.7,
              margin: '0 0 36px',
              maxWidth: 480,
            }}
          >
            Family-owned and halal-certified since 1998. We deliver the freshest cuts and
            house-made smallgoods straight to your table.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/products" className="clay-btn-primary" style={{ fontSize: 15 }}>
              🛒 Browse Products
            </Link>
            <Link href="/contact" className="clay-btn-secondary" style={{ fontSize: 15 }}>
              📞 Contact Us
            </Link>
          </div>
        </div>

        {/* Right: Visual */}
        <div className="hero-visual" style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            className="clay-card-strong"
            style={{
              width: '100%',
              maxWidth: 380,
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 100 }}>🥩</div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 22,
                color: '#3d1a0e',
                textAlign: 'center',
              }}
            >
              Salam Small Goods
            </div>
            <div style={{ display: 'flex', gap: 8, fontSize: 36 }}>
              <span>🌭</span>
              <span>🍖</span>
              <span>🍗</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
