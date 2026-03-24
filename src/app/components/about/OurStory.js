const stats = [
  { value: '25+', label: 'Years of Service', emoji: '📅' },
  { value: '100%', label: 'Halal Certified', emoji: '☪️' },
  { value: '500+', label: 'Happy Regulars', emoji: '🤝' },
  { value: '1998', label: 'Est. Broadmeadows', emoji: '📍' },
];

export default function OurStory() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="about-grid">
          {/* Left: Text */}
          <div>
            <div style={{ color: '#CC3A20', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
              OUR STORY
            </div>
            <h2
              style={{
                fontWeight: 900,
                fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                color: '#2A0D04',
                margin: '0 0 24px',
              }}
            >
              A Family Tradition Since 1998
            </h2>
            <p style={{ fontSize: 15, color: '#5A3020', lineHeight: 1.8, marginBottom: 20 }}>
              Salam Small Goods started as a small corner shop in Broadmeadows, driven by a
              passion for quality meat and the belief that every family deserves access to
              fresh, trustworthy halal produce. What began as a modest neighbourhood butcher
              has grown — through decades of dedication — into one of the most trusted names
              in Broadmeadows&apos;s halal food community.
            </p>
            <p style={{ fontSize: 15, color: '#5A3020', lineHeight: 1.8, marginBottom: 20 }}>
              Over the years, our family has built deep relationships with trusted local farmers
              and suppliers, allowing us to guarantee freshness and full traceability on every
              cut we sell. We butcher fresh every single morning — because we know the
              difference it makes to taste.
            </p>
            <p style={{ fontSize: 15, color: '#5A3020', lineHeight: 1.8 }}>
              Every sausage, salami, and piece of beef jerky we make follows recipes handed
              down through generations. These aren&apos;t shortcuts — they&apos;re the foundation
              of everything we do. When you shop with us, you&apos;re not just buying meat;
              you&apos;re supporting a family business that truly cares about what ends up on
              your table.
            </p>
          </div>

          {/* Right: Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              className="clay-card-strong"
              style={{
                padding: 28,
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              <div style={{ fontSize: 72, marginBottom: 12 }}>🏪</div>
              <div style={{ fontSize: 28 }}>🥩 🌭 🍖 🍗</div>
              <div style={{ fontWeight: 700, color: '#7A5040', fontSize: 13, marginTop: 12 }}>
                Est. 1998 · Broadmeadows, VIC
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
              }}
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="clay-card"
                  style={{ padding: '20px 16px', textAlign: 'center' }}
                >
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{stat.emoji}</div>
                  <div style={{ fontWeight: 900, fontSize: 24, color: '#CC3A20', lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 11, color: '#7A5040', fontWeight: 600, marginTop: 4 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
