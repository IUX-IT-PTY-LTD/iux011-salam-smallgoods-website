import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <div
      className="clay-card"
      style={{
        padding: 28,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Emoji image */}
      <div
        style={{
          fontSize: 60,
          textAlign: 'center',
          marginBottom: 16,
          background: 'linear-gradient(145deg, #E8CCA8, #DCBC88)',
          borderRadius: 16,
          padding: '18px 0',
        }}
      >
        {product.emoji}
      </div>

      {/* Category badge */}
      <span
        style={{
          display: 'inline-block',
          alignSelf: 'flex-start',
          padding: '3px 12px',
          borderRadius: 50,
          fontSize: 11,
          fontWeight: 700,
          background: 'linear-gradient(145deg, #EDD5B0, #E0C090)',
          color: '#CC3A20',
          marginBottom: 10,
          boxShadow: '2px 2px 0px #B8784A',
        }}
      >
        {product.category}
      </span>

      {/* Name */}
      <div
        style={{
          fontWeight: 800,
          fontSize: 17,
          color: '#2A0D04',
          marginBottom: 8,
        }}
      >
        {product.name}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 13,
          color: '#7A5040',
          lineHeight: 1.55,
          margin: '0 0 20px',
          flex: 1,
        }}
      >
        {product.description}
      </p>

      {/* Price */}
      <div style={{ fontWeight: 800, fontSize: 17, color: '#CC3A20', marginBottom: 14 }}>
        {product.price}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 8 }}>
        <Link
          href={`/products/${product.categorySlug}/${product.slug}`}
          className="clay-btn-primary"
          style={{ fontSize: 13, padding: '8px 16px', flex: 1, justifyContent: 'center' }}
        >
          Read More
        </Link>
        <Link
          href="/contact"
          className="clay-btn-secondary"
          style={{ fontSize: 13, padding: '8px 16px', flex: 1, justifyContent: 'center' }}
        >
          Enquire
        </Link>
      </div>
    </div>
  );
}
