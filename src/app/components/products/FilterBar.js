'use client';

import { categories } from '@/lib/products';

export default function FilterBar({ active, onChange }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 40,
      }}
    >
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cat === active ? 'clay-filter-btn-active' : 'clay-filter-btn'}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
