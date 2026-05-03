import { getShopInfo } from '@/lib/shopInfo';

export default async function Footer() {
  const shopInfo = await getShopInfo();
  if (!shopInfo) return null;

  return (
    <footer style={{ background: 'linear-gradient(145deg, #1A0804, #2A1208)', color: '#EDD5B0', padding: '52px 24px 28px', marginTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 48, marginBottom: 44 }}>
          {/* Brand */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: '#EDD5B0', marginBottom: 6 }}>{shopInfo.name}</div>
            <div style={{ fontSize: 12, color: '#CC3A20', fontWeight: 600, marginBottom: 16, letterSpacing: '0.04em' }}>{shopInfo.tagline}</div>
            <p style={{ color: '#B89070', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{shopInfo.description}</p>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#CC3A20', marginBottom: 18, letterSpacing: '0.08em' }}>CONTACT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ color: '#B89070', fontSize: 14, lineHeight: 1.5 }}>
                <span style={{ display: 'block', fontWeight: 600, color: '#EDD5B0', fontSize: 11, letterSpacing: '0.06em', marginBottom: 2 }}>ADDRESS</span>
                {shopInfo.address}
              </div>
              <div style={{ color: '#B89070', fontSize: 14, marginTop: 4 }}>
                <span style={{ display: 'block', fontWeight: 600, color: '#EDD5B0', fontSize: 11, letterSpacing: '0.06em', marginBottom: 2 }}>PHONE</span>
                {shopInfo.phone}
              </div>
              <div style={{ color: '#B89070', fontSize: 14, marginTop: 4 }}>
                <span style={{ display: 'block', fontWeight: 600, color: '#EDD5B0', fontSize: 11, letterSpacing: '0.06em', marginBottom: 2 }}>EMAIL</span>
                {shopInfo.email}
              </div>
            </div>
          </div>

          {/* Trading Hours */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#CC3A20', marginBottom: 18, letterSpacing: '0.08em' }}>TRADING HOURS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(shopInfo.hours ?? []).map((h) => (
                <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontWeight: 600, color: '#EDD5B0', fontSize: 13 }}>{h.day}</span>
                  <span style={{ color: '#B89070', fontSize: 13 }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #3A1A08', paddingTop: 20 }}>
          <div style={{ color: '#7A5040', fontSize: 13 }}>
            © {new Date().getFullYear()} {shopInfo.name}. All rights reserved.
          </div>
          <div style={{ color: '#4A2A18', fontSize: 12, marginTop: 6 }}>Developed by IUX IT Pty Ltd</div>
        </div>
      </div>
    </footer>
  );
}
