import Link from 'next/link';
import { shopInfo } from '@/lib/shopInfo';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(145deg, #1A0804, #2A1208)',
        color: '#EDD5B0',
        padding: '48px 24px 24px',
        marginTop: 80,
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 40,
            marginBottom: 40,
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>🥩</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#EDD5B0' }}>
                  {shopInfo.name}
                </div>
                <div style={{ fontSize: 12, color: '#CC3A20' }}>{shopInfo.tagline}</div>
              </div>
            </div>
            <p style={{ color: '#B89070', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              {shopInfo.description}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <div
              style={{ fontWeight: 700, fontSize: 15, color: '#CC3A20', marginBottom: 16 }}
            >
              Quick Links
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/products' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: '#B89070',
                    textDecoration: 'none',
                    fontSize: 14,
                    transition: 'color 0.15s',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div
              style={{ fontWeight: 700, fontSize: 15, color: '#CC3A20', marginBottom: 16 }}
            >
              Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ color: '#B89070', fontSize: 14 }}>📍 {shopInfo.address}</div>
              <div style={{ color: '#B89070', fontSize: 14 }}>📞 {shopInfo.phone}</div>
              <div style={{ color: '#B89070', fontSize: 14 }}>✉️ {shopInfo.email}</div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <div
              style={{ fontWeight: 700, fontSize: 15, color: '#CC3A20', marginBottom: 16 }}
            >
              Trading Hours
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {shopInfo.hours.map((h) => (
                <div key={h.day} style={{ fontSize: 13, color: '#B89070' }}>
                  <span style={{ fontWeight: 600, color: '#EDD5B0' }}>{h.day}</span>
                  <br />
                  {h.time}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid #3A1A08',
            paddingTop: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ color: '#7A5040', fontSize: 13 }}>
            © {new Date().getFullYear()} {shopInfo.name}. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontSize: 20 }}>🔵</span>
            <span style={{ fontSize: 20 }}>📷</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
