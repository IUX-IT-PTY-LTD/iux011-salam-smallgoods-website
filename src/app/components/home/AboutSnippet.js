export default function AboutSnippet() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="about-grid">
          {/* Image placeholder */}
          <div
            className="clay-card-strong"
            style={{
              padding: 48,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div style={{ fontSize: 80 }}>🏪</div>
            <div style={{ fontSize: 32 }}>🥩 🌭 🍖 🍗</div>
            <div style={{ fontWeight: 700, color: '#8b6f6f', fontSize: 14 }}>
              Est. 1998 · Broadmeadows, VIC
            </div>
          </div>

          {/* Text */}
          <div>
            <div style={{ color: '#ff6b6b', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
              OUR STORY
            </div>
            <h2
              className="clay-section-title"
              style={{ marginBottom: 20 }}
            >
              A Family Tradition Since 1998
            </h2>
            <p style={{ fontSize: 15, color: '#8b6f6f', lineHeight: 1.75, marginBottom: 16 }}>
              Salam Small Goods started as a small corner shop in Broadmeadows, driven by a
              passion for quality meat and traditional butchery. Over the decades, our family
              has built relationships with trusted local farmers and suppliers to bring you the
              freshest, most flavourful meats.
            </p>
            <p style={{ fontSize: 15, color: '#8b6f6f', lineHeight: 1.75, marginBottom: 32 }}>
              Every sausage, salami and jerky we make follows recipes handed down through
              generations — because great flavour doesn&apos;t come from shortcuts.
            </p>

            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[
                { value: '25+', label: 'Years of Service' },
                { value: '100%', label: 'Halal Certified' },
                { value: '500+', label: 'Happy Regulars' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{ fontWeight: 900, fontSize: 28, color: '#ff6b6b' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 12, color: '#8b6f6f', fontWeight: 600 }}>
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
