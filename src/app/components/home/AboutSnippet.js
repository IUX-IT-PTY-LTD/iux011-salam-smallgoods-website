import Link from 'next/link';

const DEFAULT_STATS = [
  { value: '25+', label: 'Years of Service' },
  { value: '100%', label: 'Halal Certified' },
  { value: '500+', label: 'Happy Regulars' },
];

export default function AboutSnippet({ content = {} }) {
  const overline = content.overline ?? 'OUR STORY';
  const title = content.title ?? 'A Family Tradition Since 1998';
  const paragraph1 = content.paragraph1 ?? 'Salam Small Goods started as a small corner shop in Broadmeadows, driven by a passion for quality meat and traditional butchery. Over the decades, our family has built relationships with trusted local farmers and suppliers to bring you the freshest, most flavourful meats.';
  const paragraph2 = content.paragraph2 ?? "Every sausage, salami and jerky we make follows recipes handed down through generations — because great flavour doesn't come from shortcuts.";
  const stats = content.stats ?? DEFAULT_STATS;
  const ctaText = content.ctaText ?? 'Read Our Full Story →';
  const ctaHref = content.ctaHref ?? '/about';

  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="about-grid">
          {/* Image placeholder */}
          <div className="clay-card-strong" style={{ padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 80 }}>🏪</div>
            <div style={{ fontSize: 32 }}>🥩 🌭 🍖 🍗</div>
            <div style={{ fontWeight: 700, color: 'var(--color-muted)', fontSize: 14 }}>Est. 1998 · Broadmeadows, VIC</div>
          </div>

          {/* Text */}
          <div>
            <div style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{overline}</div>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', color: 'var(--color-ink)', margin: '0 0 20px' }}>
              {title}
            </h2>
            <p style={{ fontSize: 15, color: 'var(--color-body)', lineHeight: 1.75, marginBottom: 16 }}>{paragraph1}</p>
            <p style={{ fontSize: 15, color: 'var(--color-body)', lineHeight: 1.75, marginBottom: 32 }}>{paragraph2}</p>

            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 36 }}>
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div style={{ fontWeight: 900, fontSize: 28, color: 'var(--color-accent)' }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 600 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <Link href={ctaHref} className="clay-btn-secondary" style={{ fontSize: 14 }}>{ctaText}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
