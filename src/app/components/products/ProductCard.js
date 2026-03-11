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
          background: 'linear-gradient(145deg, #fff3e8, #ffeedd)',
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
          background: '#fff3e0',
          color: '#ff6b6b',
          marginBottom: 10,
          boxShadow: '2px 2px 0px #e0b99a',
        }}
      >
        {product.category}
      </span>

      {/* Name */}
      <div
        style={{
          fontWeight: 800,
          fontSize: 17,
          color: '#3d1a0e',
          marginBottom: 8,
        }}
      >
        {product.name}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 13,
          color: '#8b6f6f',
          lineHeight: 1.55,
          margin: '0 0 20px',
          flex: 1,
        }}
      >
        {product.description}
      </p>

      {/* Price + CTA */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
        }}
      >
        <span style={{ fontWeight: 800, fontSize: 17, color: '#ff6b6b' }}>
          {product.price}
        </span>
        <Link
          href="/contact"
          style={{
            padding: '8px 18px',
            borderRadius: 50,
            background: 'linear-gradient(145deg, #ff8080, #ff5555)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            textDecoration: 'none',
            boxShadow: '3px 3px 0px #cc3333, inset 1px 1px 4px #ff9999',
            transition: 'transform 0.15s ease',
          }}
        >
          Enquire
        </Link>
      </div>
    </div>
  );
}
