'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Drawer } from 'antd';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Contact Us', href: '/contact' },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header style={{ background: '#fafaf5', padding: '0 24px' }}>
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 28 }}>🥩</span>
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  color: '#3d1a0e',
                  lineHeight: 1.1,
                }}
              >
                Salam Small Goods
              </div>
              <div style={{ fontSize: 11, color: '#8b6f6f', fontWeight: 500 }}>
                Premium Halal Meats
              </div>
            </div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div
          className="desktop-nav"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                <span
                  style={{
                    padding: '8px 20px',
                    borderRadius: 50,
                    fontWeight: active ? 700 : 500,
                    fontSize: 15,
                    color: active ? '#ffffff' : '#3d1a0e',
                    background: active
                      ? 'linear-gradient(145deg, #ff8080, #ff5555)'
                      : 'transparent',
                    boxShadow: active
                      ? '3px 3px 0px #cc3333, inset 2px 2px 6px #ff9999'
                      : 'none',
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
            background: 'linear-gradient(145deg, #fff8f0, #ffeedd)',
            border: 'none',
            borderRadius: 12,
            padding: '8px 12px',
            cursor: 'pointer',
            boxShadow: '3px 3px 0px #e0b99a, inset 1px 1px 4px #ffffff',
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
            <span>🥩</span>
            <span style={{ fontWeight: 800, color: '#3d1a0e' }}>Salam Small Goods</span>
          </div>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={260}
        styles={{ body: { background: '#fafaf5', padding: 24 } }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    padding: '12px 20px',
                    borderRadius: 16,
                    fontWeight: active ? 700 : 500,
                    fontSize: 16,
                    color: active ? '#ffffff' : '#3d1a0e',
                    background: active
                      ? 'linear-gradient(145deg, #ff8080, #ff5555)'
                      : 'linear-gradient(145deg, #fff8f0, #ffeedd)',
                    boxShadow: active
                      ? '3px 3px 0px #cc3333'
                      : '3px 3px 0px #e0b99a',
                  }}
                >
                  {link.label}
                </div>
              </Link>
            );
          })}
        </div>
      </Drawer>

      <style jsx>{`
        @media (max-width: 640px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
