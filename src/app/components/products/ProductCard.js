import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <div
      className="clay-card"
      style={{
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Emoji */}
      <div
        style={{
          fontSize: 56,
          textAlign: 'center',
          marginBottom: 14,
          background: 'linear-gradient(145deg, #E8CCA8, #DCBC88)',
          borderRadius: 16,
          padding: '16px 0',
        }}
      >
        {product.emoji}
      </div>

      {/* Category badge + stock status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '3px 12px',
            borderRadius: 50,
            fontSize: 11,
            fontWeight: 700,
            background: 'linear-gradient(145deg, #EDD5B0, #E0C090)',
            color: '#CC3A20',
            boxShadow: '2px 2px 0px #B8784A',
          }}
        >
          {product.category}
        </span>
        <span
          style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: 50,
            fontSize: 11,
            fontWeight: 700,
            background: product.inStock
              ? 'linear-gradient(145deg, #4CAF50, #388E3C)'
              : 'linear-gradient(145deg, #E53935, #B71C1C)',
            color: '#fff',
            boxShadow: product.inStock ? '2px 2px 0px #2E7D32' : '2px 2px 0px #7F0000',
          }}
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      {/* Name */}
      <div
        style={{
          fontWeight: 800,
          fontSize: 16,
          color: '#2A0D04',
          marginBottom: 8,
          lineHeight: 1.3,
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

      {/* CTA */}
      <Link
        href={`/products/${product.categorySlug}/${product.slug}`}
        className="clay-btn-primary"
        style={{
          fontSize: 13,
          padding: '10px 16px',
          textAlign: 'center',
          display: 'block',
          whiteSpace: 'nowrap',
        }}
      >
        Read More →
      </Link>
    </div>
  );
}
