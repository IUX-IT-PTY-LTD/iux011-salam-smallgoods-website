import { shopInfo } from '@/lib/shopInfo';

export default function ShopInfoCard() {
  return (
    <div className="clay-card" style={{ padding: 36 }}>
      <h3
        style={{
          fontWeight: 800,
          fontSize: 20,
          color: '#3d1a0e',
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: '2px solid #ffeedd',
        }}
      >
        📍 Find Us
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Address */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#ff6b6b', marginBottom: 4 }}>
            ADDRESS
          </div>
          <div style={{ fontSize: 15, color: '#3d1a0e', fontWeight: 500 }}>
            {shopInfo.address}
          </div>
        </div>

        {/* Phone */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#ff6b6b', marginBottom: 4 }}>
            PHONE
          </div>
          <a
            href={`tel:${shopInfo.phone}`}
            style={{ fontSize: 15, color: '#3d1a0e', fontWeight: 500, textDecoration: 'none' }}
          >
            {shopInfo.phone}
          </a>
        </div>

        {/* Email */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#ff6b6b', marginBottom: 4 }}>
            EMAIL
          </div>
          <a
            href={`mailto:${shopInfo.email}`}
            style={{ fontSize: 15, color: '#3d1a0e', fontWeight: 500, textDecoration: 'none' }}
          >
            {shopInfo.email}
          </a>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '2px solid #ffeedd', paddingTop: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#3d1a0e', marginBottom: 16 }}>
            🕐 Trading Hours
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {shopInfo.hours.map((h) => (
              <div
                key={h.day}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 14,
                  padding: '8px 12px',
                  borderRadius: 10,
                  background: 'linear-gradient(145deg, #fff8f0, #ffeedd)',
                  boxShadow: '2px 2px 0px #e0b99a',
                }}
              >
                <span style={{ fontWeight: 600, color: '#3d1a0e' }}>{h.day}</span>
                <span style={{ color: '#8b6f6f' }}>{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
