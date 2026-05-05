'use client';

import { useState, useEffect } from 'react';

export default function ProductImageViewer({ thumbUrl, fullUrl, alt }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', aspectRatio: '4 / 3', position: 'relative' }}>
        <img
          src={thumbUrl}
          alt={alt}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {fullUrl && (
          <button
            onClick={() => setOpen(true)}
            style={{
              position: 'absolute', bottom: 10, right: 10,
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
              color: '#fff', fontSize: 11, fontWeight: 700,
              padding: '5px 10px', borderRadius: 8, border: 'none',
              cursor: 'pointer', letterSpacing: '0.04em',
            }}
          >
            ⤢ Full image
          </button>
        )}
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img
              src={fullUrl}
              alt={alt}
              style={{ display: 'block', maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
            />
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute', top: -14, right: -14,
                width: 32, height: 32, borderRadius: '50%',
                background: '#fff', border: 'none', cursor: 'pointer',
                fontSize: 16, fontWeight: 900, color: '#2A0D04',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
