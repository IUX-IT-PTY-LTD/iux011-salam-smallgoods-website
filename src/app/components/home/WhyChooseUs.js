const CARD_STYLES = [
  { bg: 'linear-gradient(145deg, #F0D4B8, #E8C098)', shadow: '#C09060' },
  { bg: 'linear-gradient(145deg, #D4DDB0, #C4CD90)', shadow: '#8A9C50' },
  { bg: 'linear-gradient(145deg, #EED4A0, #E0C080)', shadow: '#B89040' },
];

const DEFAULT_FEATURES = [
  { emoji: '☪️', title: 'Halal Certified', description: 'All our meats are certified halal, sourced from trusted suppliers with full traceability.' },
  { emoji: '🌿', title: 'Fresh Daily Cuts', description: 'We butcher fresh every morning so you always get the best quality, never frozen.' },
  { emoji: '👨‍👩‍👧', title: 'Family Recipe', description: 'Our smallgoods and sausages are made using traditional family recipes passed down for generations.' },
];

export default function WhyChooseUs({ content = {} }) {
  const overline = content.overline ?? 'WHY US';
  const title = content.title ?? 'Why Choose Salam Small Goods?';
  const features = content.features ?? DEFAULT_FEATURES;

  return (
    <section style={{ background: 'linear-gradient(135deg, #DFB878 0%, #E8D0A8 100%)', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
            {overline}
          </div>
          <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', color: 'var(--color-ink)', margin: 0 }}>
            {title}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
          {features.map((f, i) => {
            const style = CARD_STYLES[i % CARD_STYLES.length];
            return (
              <div
                key={f.title}
                style={{
                  borderRadius: 24,
                  background: style.bg,
                  boxShadow: `8px 8px 0px ${style.shadow}, inset 2px 2px 8px rgba(255,255,255,0.4)`,
                  padding: '36px 32px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 52, marginBottom: 16 }}>{f.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 19, color: 'var(--color-ink)', marginBottom: 12 }}>{f.title}</div>
                <p style={{ fontSize: 14, color: 'var(--color-body)', lineHeight: 1.65, margin: 0 }}>{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
