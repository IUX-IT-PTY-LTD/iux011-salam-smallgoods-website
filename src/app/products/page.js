'use client';

import { useState } from 'react';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import FilterBar from '../components/products/FilterBar';
import ProductCard from '../components/products/ProductCard';
import { products } from '@/lib/products';

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <>
      <Navbar />
      <main>
        {/* Page banner */}
        <section style={{ padding: '48px 24px 0' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div
              className="clay-banner"
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>🥩</div>
              <h1
                style={{
                  fontWeight: 900,
                  fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                  color: '#ffffff',
                  margin: '0 0 10px',
                  textShadow: '2px 2px 0px rgba(0,0,0,0.15)',
                }}
              >
                Our Products
              </h1>
              <p style={{ color: '#fff8f0', fontSize: 16, margin: 0, opacity: 0.9 }}>
                Fresh, halal-certified meats &amp; house-made smallgoods
              </p>
            </div>
          </div>
        </section>

        {/* Products section */}
        <section style={{ padding: '48px 24px 80px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <FilterBar active={activeCategory} onChange={setActiveCategory} />

            {filtered.length === 0 ? (
              <div
                className="clay-card"
                style={{ padding: 60, textAlign: 'center' }}
              >
                <div style={{ fontSize: 60, marginBottom: 16 }}>🤔</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#3d1a0e', marginBottom: 8 }}>
                  No products found
                </div>
                <div style={{ color: '#8b6f6f', fontSize: 15 }}>
                  Try selecting a different category.
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    color: '#8b6f6f',
                    fontSize: 14,
                    marginBottom: 24,
                    fontWeight: 500,
                  }}
                >
                  Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
                  {activeCategory !== 'All' && ` in "${activeCategory}"`}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: 28,
                  }}
                >
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
