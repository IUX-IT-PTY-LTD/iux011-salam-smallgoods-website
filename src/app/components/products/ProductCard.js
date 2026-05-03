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
      {/* Product image */}
      <div className="product-image-container">
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
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
            background: 'linear-gradient(145deg, var(--color-surface-raised), var(--color-surface-mid))',
            color: 'var(--color-ink)',
            boxShadow: '2px 2px 0px var(--color-shadow)',
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
            background: product.inStock ? '#3E6B2A' : '#A83020',
            color: '#fff',
            boxShadow: product.inStock ? '2px 2px 0px #1E3A10' : '2px 2px 0px #4A0C00',
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
          color: 'var(--color-ink)',
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
          color: 'var(--color-muted)',
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
