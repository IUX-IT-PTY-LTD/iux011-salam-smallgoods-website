const CARD_STYLES = [
  { bg: 'linear-gradient(145deg, #F0D4B8, #E8C098)', shadow: '#C09060' },
  { bg: 'linear-gradient(145deg, #EED4A0, #E0C080)', shadow: '#B89040' },
  { bg: 'linear-gradient(145deg, #D4DDB0, #C4CD90)', shadow: '#8A9C50' },
];

const DEFAULT_VALUES = [
  { emoji: '☪️', title: 'Halal Certified', description: 'Every product we sell carries full halal certification from trusted Australian certification bodies. We maintain complete supply-chain traceability so you can buy with absolute confidence — from farm to counter.' },
  { emoji: '👨‍👩‍👧', title: 'Family Owned', description: "Three generations of the same family have run this shop. That means every decision we make is personal. We're not a corporation chasing margins — we're your neighbours who care deeply about the quality of what we put in front of you." },
  { emoji: '🌿', title: 'Fresh Daily', description: "We butcher and prepare every morning before the doors open. No frozen product, no days-old cuts. If it's not fresh, it doesn't go in the display case. That's a standard we set for ourselves on day one and have never compromised." },
];

export default function OurValues({ content = {} }) {
  const overline = content.overline ?? 'WHAT WE STAND FOR';
  const title = content.title ?? 'Our Values';
  const values = content.values ?? DEFAULT_VALUES;

  return (
    <section style={{ background: 'linear-gradient(135deg, #DFB878 0%, #E8D0A8 100%)', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{overline}</div>
          <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', color: 'var(--color-ink)', margin: 0 }}>{title}</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
          {values.map((v, i) => {
            const style = CARD_STYLES[i % CARD_STYLES.length];
            return (
              <div
                key={v.title}
                style={{
                  borderRadius: 24,
                  background: style.bg,
                  boxShadow: `8px 8px 0px ${style.shadow}, inset 2px 2px 8px rgba(255,255,255,0.4)`,
                  padding: '36px 32px',
                }}
              >
                <div style={{ fontSize: 52, marginBottom: 16 }}>{v.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--color-ink)', marginBottom: 14 }}>{v.title}</div>
                <p style={{ fontSize: 14, color: 'var(--color-body)', lineHeight: 1.75, margin: 0 }}>{v.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
