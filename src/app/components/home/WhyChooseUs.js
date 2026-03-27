const features = [
  {
    emoji: '☪️',
    title: 'Halal Certified',
    description:
      'All our meats are certified halal, sourced from trusted suppliers with full traceability.',
    bg: 'linear-gradient(145deg, #F0D4B8, #E8C098)',
    shadow: '#C09060',
  },
  {
    emoji: '🌿',
    title: 'Fresh Daily Cuts',
    description:
      'We butcher fresh every morning so you always get the best quality, never frozen.',
    bg: 'linear-gradient(145deg, #D4DDB0, #C4CD90)',
    shadow: '#8A9C50',
  },
  {
    emoji: '👨‍👩‍👧',
    title: 'Family Recipe',
    description:
      'Our smallgoods and sausages are made using traditional family recipes passed down for generations.',
    bg: 'linear-gradient(145deg, #EED4A0, #E0C080)',
    shadow: '#B89040',
  },
];

export default function WhyChooseUs() {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #DFB878 0%, #E8D0A8 100%)',
        padding: '80px 24px',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
            WHY US
          </div>
          <h2
            style={{
              fontWeight: 900,
              fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
              color: 'var(--color-ink)',
              margin: 0,
            }}
          >
            Why Choose Salam Small Goods?
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 28,
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                borderRadius: 24,
                background: f.bg,
                boxShadow: `8px 8px 0px ${f.shadow}, inset 2px 2px 8px rgba(255,255,255,0.4)`,
                padding: '36px 32px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 52, marginBottom: 16 }}>{f.emoji}</div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 19,
                  color: 'var(--color-ink)',
                  marginBottom: 12,
                }}
              >
                {f.title}
              </div>
              <p style={{ fontSize: 14, color: 'var(--color-body)', lineHeight: 1.65, margin: 0 }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
