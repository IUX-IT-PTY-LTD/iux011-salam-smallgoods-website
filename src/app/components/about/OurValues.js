const values = [
  {
    emoji: '☪️',
    title: 'Halal Certified',
    description:
      'Every product we sell carries full halal certification from trusted Australian certification bodies. We maintain complete supply-chain traceability so you can buy with absolute confidence — from farm to counter.',
    bg: 'linear-gradient(145deg, #F0D4B8, #E8C098)',
    shadow: '#C09060',
  },
  {
    emoji: '👨‍👩‍👧',
    title: 'Family Owned',
    description:
      "Three generations of the same family have run this shop. That means every decision we make is personal. We're not a corporation chasing margins — we're your neighbours who care deeply about the quality of what we put in front of you.",
    bg: 'linear-gradient(145deg, #EED4A0, #E0C080)',
    shadow: '#B89040',
  },
  {
    emoji: '🌿',
    title: 'Fresh Daily',
    description:
      "We butcher and prepare every morning before the doors open. No frozen product, no days-old cuts. If it's not fresh, it doesn't go in the display case. That's a standard we set for ourselves on day one and have never compromised.",
    bg: 'linear-gradient(145deg, #D4DDB0, #C4CD90)',
    shadow: '#8A9C50',
  },
];

export default function OurValues() {
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
            WHAT WE STAND FOR
          </div>
          <h2
            style={{
              fontWeight: 900,
              fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
              color: 'var(--color-ink)',
              margin: 0,
            }}
          >
            Our Values
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 28,
          }}
        >
          {values.map((v) => (
            <div
              key={v.title}
              style={{
                borderRadius: 24,
                background: v.bg,
                boxShadow: `8px 8px 0px ${v.shadow}, inset 2px 2px 8px rgba(255,255,255,0.4)`,
                padding: '36px 32px',
              }}
            >
              <div style={{ fontSize: 52, marginBottom: 16 }}>{v.emoji}</div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 20,
                  color: 'var(--color-ink)',
                  marginBottom: 14,
                }}
              >
                {v.title}
              </div>
              <p style={{ fontSize: 14, color: 'var(--color-body)', lineHeight: 1.75, margin: 0 }}>
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
