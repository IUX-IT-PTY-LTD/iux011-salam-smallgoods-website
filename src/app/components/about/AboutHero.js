export default function AboutHero() {
  return (
    <section style={{ padding: '48px 24px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="clay-banner" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏪</div>
          <h1
            style={{
              fontWeight: 900,
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              color: '#ffffff',
              margin: '0 0 10px',
              textShadow: '2px 2px 0px rgba(0,0,0,0.2)',
            }}
          >
            About Us
          </h1>
          <p style={{ color: '#F5E0C0', fontSize: 16, margin: 0, opacity: 0.9 }}>
            Family-owned and halal-certified since 1998 — this is our story
          </p>
        </div>
      </div>
    </section>
  );
}
