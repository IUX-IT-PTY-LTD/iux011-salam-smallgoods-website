const features = [
  {
    emoji: '☪️',
    title: 'Halal Certified',
    description:
      'All our meats are certified halal, sourced from trusted suppliers with full traceability.',
    bg: 'linear-gradient(145deg, #fff0f5, #ffd6e8)',
    shadow: '#e0a0c0',
  },
  {
    emoji: '🌿',
    title: 'Fresh Daily Cuts',
    description:
      'We butcher fresh every morning so you always get the best quality, never frozen.',
    bg: 'linear-gradient(145deg, #f0fff4, #d0f5dd)',
    shadow: '#a0d5b0',
  },
  {
    emoji: '👨‍👩‍👧',
    title: 'Family Recipe',
    description:
      'Our smallgoods and sausages are made using traditional family recipes passed down for generations.',
    bg: 'linear-gradient(145deg, #fff8e8, #ffeebf)',
    shadow: '#e0c87a',
  },
];

export default function WhyChooseUs() {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #fff3e0 0%, #fafaf5 100%)',
        padding: '80px 24px',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ color: '#ff6b6b', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
            WHY US
          </div>
          <h2 className="clay-section-title">Why Choose Salam Small Goods?</h2>
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
                boxShadow: `8px 8px 0px ${f.shadow}, inset 2px 2px 8px #ffffff`,
                padding: '36px 32px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 52, marginBottom: 16 }}>{f.emoji}</div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 19,
                  color: '#3d1a0e',
                  marginBottom: 12,
                }}
              >
                {f.title}
              </div>
              <p style={{ fontSize: 14, color: '#8b6f6f', lineHeight: 1.65, margin: 0 }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
