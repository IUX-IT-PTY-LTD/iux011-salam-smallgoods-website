const DEFAULT_STATS = [
  { value: '25+', label: 'Years of Service', emoji: '📅' },
  { value: '100%', label: 'Halal Certified', emoji: '☪️' },
  { value: '500+', label: 'Happy Regulars', emoji: '🤝' },
  { value: '1998', label: 'Est. Broadmeadows', emoji: '📍' },
];

export default function OurStory({ content = {} }) {
  const overline = content.overline ?? 'OUR STORY';
  const title = content.title ?? 'A Family Tradition Since 1998';
  const paragraph1 = content.paragraph1 ?? "Salam Small Goods started as a small corner shop in Broadmeadows, driven by a passion for quality meat and the belief that every family deserves access to fresh, trustworthy halal produce. What began as a modest neighbourhood butcher has grown — through decades of dedication — into one of the most trusted names in Broadmeadows's halal food community.";
  const paragraph2 = content.paragraph2 ?? 'Over the years, our family has built deep relationships with trusted local farmers and suppliers, allowing us to guarantee freshness and full traceability on every cut we sell. We butcher fresh every single morning — because we know the difference it makes to taste.';
  const paragraph3 = content.paragraph3 ?? "Every sausage, salami, and piece of beef jerky we make follows recipes handed down through generations. These aren't shortcuts — they're the foundation of everything we do. When you shop with us, you're not just buying meat; you're supporting a family business that truly cares about what ends up on your table.";
  const stats = content.stats ?? DEFAULT_STATS;

  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="about-grid">
          {/* Left: Text */}
          <div>
            <div style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{overline}</div>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', color: 'var(--color-ink)', margin: '0 0 24px' }}>
              {title}
            </h2>
            <p style={{ fontSize: 15, color: 'var(--color-body)', lineHeight: 1.8, marginBottom: 20 }}>{paragraph1}</p>
            <p style={{ fontSize: 15, color: 'var(--color-body)', lineHeight: 1.8, marginBottom: 20 }}>{paragraph2}</p>
            <p style={{ fontSize: 15, color: 'var(--color-body)', lineHeight: 1.8 }}>{paragraph3}</p>
          </div>

          {/* Right: Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="clay-card-strong" style={{ padding: 28, textAlign: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 72, marginBottom: 12 }}>🏪</div>
              <div style={{ fontSize: 28 }}>🥩 🌭 🍖 🍗</div>
              <div style={{ fontWeight: 700, color: 'var(--color-muted)', fontSize: 13, marginTop: 12 }}>Est. 1998 · Broadmeadows, VIC</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {stats.map((stat) => (
                <div key={stat.label} className="clay-card" style={{ padding: '20px 16px', textAlign: 'center' }}>
                  {stat.emoji && <div style={{ fontSize: 28, marginBottom: 6 }}>{stat.emoji}</div>}
                  <div style={{ fontWeight: 900, fontSize: 24, color: 'var(--color-accent)', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 600, marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
