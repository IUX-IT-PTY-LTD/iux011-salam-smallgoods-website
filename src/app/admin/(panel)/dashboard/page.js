import Link from 'next/link';

const sections = [
  { label: 'Content', href: '/admin/content', emoji: '✏️', desc: 'Edit page text and images' },
  { label: 'Products', href: '/admin/products', emoji: '📦', desc: 'Manage product listings' },
  { label: 'Categories', href: '/admin/categories', emoji: '🗂️', desc: 'Organise product categories' },
  { label: 'Shop Info', href: '/admin/shop-info', emoji: '🏪', desc: 'Contact details & trading hours' },
  { label: 'Design', href: '/admin/design', emoji: '🎨', desc: 'Customise colours & theme' },
  { label: 'Contacts', href: '/admin/contacts', emoji: '📩', desc: 'View enquiry submissions' },
];

export default function DashboardPage() {
  return (
    <div style={{ padding: '40px 32px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#CC3A20',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          Admin Panel
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#2A0D04', margin: '0 0 8px' }}>
          Welcome back 👋
        </h1>
        <p style={{ color: '#7A5040', fontSize: 14, margin: 0 }}>
          Manage content, products, and customer enquiries for the Salam Small Goods website.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 20,
        }}
      >
        {sections.map((s) => (
          <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
            <div
              className="clay-card"
              style={{ padding: '28px 24px', height: '100%' }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{s.emoji}</div>
              <div
                style={{ fontWeight: 800, fontSize: 16, color: '#2A0D04', marginBottom: 6 }}
              >
                {s.label}
              </div>
              <div style={{ fontSize: 13, color: '#7A5040' }}>{s.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
