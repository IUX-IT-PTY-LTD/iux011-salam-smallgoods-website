'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Drawer } from 'antd';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products', hasDropdown: true },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

export default function Navbar({ categories = [], shopInfo = null }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header style={{ background: '#E8D0A8', padding: '0 24px', position: 'relative', zIndex: 100 }}>
      <nav
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 0',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {shopInfo?.logoUrl
              ? <div style={{ position: 'relative', height: 40, width: 120, flexShrink: 0 }}>
                  <Image src={shopInfo.logoUrl} alt={shopInfo.name ?? 'Logo'} fill style={{ objectFit: 'contain', objectPosition: 'left center' }} />
                </div>
              : <span style={{ fontSize: 28 }}>🥩</span>
            }
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: '#2A0D04', lineHeight: 1.1 }}>
                {shopInfo?.name ?? 'Salam Small Goods'}
              </div>
              <div style={{ fontSize: 11, color: '#7A5040', fontWeight: 500 }}>
                {shopInfo?.tagline ?? 'Premium Halal Meats'}
              </div>
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

            if (link.hasDropdown) {
              return (
                <div
                  key={link.href}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <Link href={link.href} style={{ textDecoration: 'none' }}>
                    <span
                      style={{
                        padding: '8px 20px',
                        borderRadius: 50,
                        fontWeight: active ? 700 : 500,
                        fontSize: 15,
                        color: active ? '#ffffff' : '#2A0D04',
                        background: active ? 'linear-gradient(145deg, #CC3A20, #B02808)' : 'transparent',
                        boxShadow: active ? '3px 3px 0px #7A1808, inset 2px 2px 6px #E05030' : 'none',
                        transition: 'all 0.15s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        cursor: 'pointer',
                      }}
                    >
                      {link.label} <span style={{ fontSize: 10 }}>▾</span>
                    </span>
                  </Link>

                  {dropdownOpen && (
                    <div
                      className="clay-card"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        left: 0,
                        minWidth: 200,
                        padding: '12px 8px',
                        zIndex: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                      }}
                    >
                      <Link href="/products" style={{ textDecoration: 'none' }} onClick={() => setDropdownOpen(false)}>
                        <div
                          style={{ padding: '8px 14px', borderRadius: 10, fontSize: 14, fontWeight: 700, color: '#CC3A20' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(145deg, #CC3A20, #B02808)'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#CC3A20'; }}
                        >
                          All Products
                        </div>
                      </Link>
                      <div style={{ height: 1, background: '#D4A870', margin: '4px 6px' }} />
                      {categories.map((cat) => (
                        <Link key={cat.slug} href={`/products/${cat.slug}`} style={{ textDecoration: 'none' }} onClick={() => setDropdownOpen(false)}>
                          <div
                            style={{ padding: '8px 14px', borderRadius: 10, fontSize: 14, fontWeight: 500, color: '#2A0D04', display: 'flex', alignItems: 'center', gap: 8 }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(145deg, #EDD5B0, #E0C090)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            <span>{cat.emoji}</span>
                            {cat.label}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                <span
                  style={{
                    padding: '8px 20px',
                    borderRadius: 50,
                    fontWeight: active ? 700 : 500,
                    fontSize: 15,
                    color: active ? '#ffffff' : '#2A0D04',
                    background: active ? 'linear-gradient(145deg, #CC3A20, #B02808)' : 'transparent',
                    boxShadow: active ? '3px 3px 0px #7A1808, inset 2px 2px 6px #E05030' : 'none',
                    transition: 'all 0.15s ease',
                    display: 'inline-block',
                  }}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setDrawerOpen(true)}
          style={{
            display: 'none',
            background: 'linear-gradient(145deg, #EDD5B0, #E0C090)',
            border: 'none',
            borderRadius: 12,
            padding: '8px 12px',
            cursor: 'pointer',
            boxShadow: '3px 3px 0px #B8784A, inset 1px 1px 4px #F5E0C0',
            fontSize: 20,
          }}
          aria-label="Open menu"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {shopInfo?.logoUrl
              ? <div style={{ position: 'relative', height: 28, width: 80, flexShrink: 0 }}>
                  <Image src={shopInfo.logoUrl} alt={shopInfo.name ?? 'Logo'} fill style={{ objectFit: 'contain', objectPosition: 'left center' }} />
                </div>
              : <span>🥩</span>
            }
            <span style={{ fontWeight: 800, color: '#2A0D04' }}>{shopInfo?.name ?? 'Salam Small Goods'}</span>
          </div>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        size="default"
        styles={{ body: { background: '#E8D0A8', padding: 24 } }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

            if (link.hasDropdown) {
              return (
                <div key={link.href}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Link href={link.href} onClick={() => setDrawerOpen(false)} style={{ textDecoration: 'none', flex: 1 }}>
                      <div style={{ padding: '12px 20px', borderRadius: 16, fontWeight: active ? 700 : 500, fontSize: 16, color: active ? '#ffffff' : '#2A0D04', background: active ? 'linear-gradient(145deg, #CC3A20, #B02808)' : 'linear-gradient(145deg, #EDD5B0, #E0C090)', boxShadow: active ? '3px 3px 0px #7A1808' : '3px 3px 0px #B8784A' }}>
                        {link.label}
                      </div>
                    </Link>
                    <button
                      onClick={() => setMobileProductsOpen((v) => !v)}
                      style={{ background: 'linear-gradient(145deg, #EDD5B0, #E0C090)', border: 'none', borderRadius: 12, padding: '12px 14px', cursor: 'pointer', boxShadow: '3px 3px 0px #B8784A', fontSize: 14, color: '#2A0D04', fontWeight: 700 }}
                    >
                      {mobileProductsOpen ? '▲' : '▼'}
                    </button>
                  </div>
                  {mobileProductsOpen && (
                    <div style={{ marginLeft: 16, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {categories.map((cat) => (
                        <Link key={cat.slug} href={`/products/${cat.slug}`} onClick={() => { setDrawerOpen(false); setMobileProductsOpen(false); }} style={{ textDecoration: 'none' }}>
                          <div style={{ padding: '10px 16px', borderRadius: 12, fontSize: 14, fontWeight: 500, color: '#2A0D04', background: 'linear-gradient(145deg, #EDD5B0, #E0C090)', boxShadow: '2px 2px 0px #B8784A', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>{cat.emoji}</span>
                            {cat.label}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={link.href} href={link.href} onClick={() => setDrawerOpen(false)} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '12px 20px', borderRadius: 16, fontWeight: active ? 700 : 500, fontSize: 16, color: active ? '#ffffff' : '#2A0D04', background: active ? 'linear-gradient(145deg, #CC3A20, #B02808)' : 'linear-gradient(145deg, #EDD5B0, #E0C090)', boxShadow: active ? '3px 3px 0px #7A1808' : '3px 3px 0px #B8784A' }}>
                  {link.label}
                </div>
              </Link>
            );
          })}
        </div>
      </Drawer>

      <style jsx>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}
