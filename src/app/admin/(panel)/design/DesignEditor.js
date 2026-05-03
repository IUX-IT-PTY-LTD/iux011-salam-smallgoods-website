'use client';

import { useState, useTransition } from 'react';
import { ColorPicker, Button, Typography, App, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { saveTheme } from '@/app/actions/theme';

const { Title, Text } = Typography;

const TOKEN_GROUPS = [
  {
    label: 'Text & Page Background',
    tokens: [
      { key: 'colorInk',              label: 'Ink (headings)' },
      { key: 'colorBody',             label: 'Body text' },
      { key: 'colorMuted',            label: 'Muted text' },
      { key: 'colorSurface',          label: 'Page background' },
    ],
  },
  {
    label: 'Card Surfaces',
    tokens: [
      { key: 'colorSurfaceRaised',    label: 'Card light stop' },
      { key: 'colorSurfaceMid',       label: 'Card dark stop' },
      { key: 'colorSurfaceStrong',    label: 'Elevated card light' },
      { key: 'colorSurfaceStrongMid', label: 'Elevated card dark' },
      { key: 'colorSurfaceHi',        label: 'Inset highlight' },
    ],
  },
  {
    label: 'Shadows',
    tokens: [
      { key: 'colorShadow',           label: 'Standard shadow' },
      { key: 'colorShadowStrong',     label: 'Elevated shadow' },
      { key: 'colorShadowInset',      label: 'Inset shadow' },
    ],
  },
  {
    label: 'Brand Accent',
    tokens: [
      { key: 'colorAccent',           label: 'Accent (CTAs, banners)' },
      { key: 'colorAccentDark',       label: 'Accent dark stop' },
      { key: 'colorAccentShadow',     label: 'Accent shadow' },
      { key: 'colorAccentHi',         label: 'Accent highlight' },
    ],
  },
  {
    label: 'Status',
    tokens: [
      { key: 'colorStatusOk',         label: 'In stock' },
      { key: 'colorStatusOkDk',       label: 'In stock dark' },
      { key: 'colorStatusOkSh',       label: 'In stock shadow' },
      { key: 'colorStatusErr',        label: 'Out of stock' },
      { key: 'colorStatusErrDk',      label: 'Out of stock dark' },
      { key: 'colorStatusErrSh',      label: 'Out of stock shadow' },
    ],
  },
  {
    label: 'Footer',
    tokens: [
      { key: 'colorFooterBg',         label: 'Footer background' },
      { key: 'colorFooterBg2',        label: 'Footer background 2' },
      { key: 'colorFooterText',       label: 'Footer text' },
      { key: 'colorFooterMuted',      label: 'Footer muted text' },
    ],
  },
];

function tokenToCssVar(key) {
  return '--' + key.replace(/([A-Z])/g, (_, c) => '-' + c.toLowerCase());
}

function buildPreviewStyle(tokens) {
  const style = {};
  for (const [key, value] of Object.entries(tokens)) {
    style[tokenToCssVar(key)] = value;
  }
  return style;
}

// ─── TokenRow ─────────────────────────────────────────────────────────────────

function TokenRow({ tokenKey, label, value, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '9px 14px', borderRadius: 10,
      background: '#FFF8EE', border: '1px solid #F0DDB8',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 16, height: 16, borderRadius: 4, flexShrink: 0,
          background: value,
          border: '1.5px solid rgba(0,0,0,0.12)',
          boxShadow: '1px 1px 0px rgba(0,0,0,0.08)',
        }} />
        <Text style={{ fontSize: 13, color: '#2A0D04' }}>{label}</Text>
      </div>
      <ColorPicker
        value={value}
        onChange={(color) => onChange(tokenKey, color)}
        showText={(color) => color.toHexString()}
        size="small"
      />
    </div>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────

function SectionHeader({ label }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: '#CC3A20',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      marginBottom: 10, paddingBottom: 8,
      borderBottom: '1.5px solid #F0DDB8',
    }}>
      {label}
    </div>
  );
}

// ─── DesignEditor ─────────────────────────────────────────────────────────────

export default function DesignEditor({ initialTokens }) {
  const { message } = App.useApp();
  const [tokens, setTokens]         = useState(initialTokens);
  const [isDirty, setIsDirty]       = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleChange(key, color) {
    setTokens((prev) => ({ ...prev, [key]: color.toHexString() }));
    setIsDirty(true);
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await saveTheme(tokens);
        setIsDirty(false);
        message.success('Theme saved — site colours updated globally');
      } catch (err) {
        message.error(err.message || 'Save failed');
      }
    });
  }

  const previewVars = buildPreviewStyle(tokens);

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: '#2A0D04' }}>Design Tokens</Title>
          {isDirty ? (
            <Text style={{ fontSize: 13, color: '#B45309', marginTop: 4, display: 'block' }}>
              Unsaved changes — save to publish globally
            </Text>
          ) : (
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
              Colour tokens that drive the entire site. Changes apply globally when saved.
            </Text>
          )}
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={isPending}
          onClick={handleSave}
          disabled={!isDirty && !isPending}
          style={{
            borderRadius: 8, fontWeight: 600,
            background: isDirty ? '#CC3A20' : undefined,
            borderColor: isDirty ? '#CC3A20' : undefined,
          }}
        >
          Save & Publish
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

        {/* ── Token groups ── */}
        <div style={{
          background: '#FFFAF2', borderRadius: 16,
          border: '1.5px solid #E8C098', padding: '24px 28px',
        }}>
          {TOKEN_GROUPS.map((group, gi) => (
            <div key={group.label} style={{ marginBottom: gi < TOKEN_GROUPS.length - 1 ? 28 : 0 }}>
              <SectionHeader label={group.label} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {group.tokens.map(({ key, label }) => (
                  <TokenRow
                    key={key}
                    tokenKey={key}
                    label={label}
                    value={tokens[key]}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Live preview ── */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div style={{
            background: '#FFFAF2', borderRadius: 16,
            border: '1.5px solid #E8C098', overflow: 'hidden',
          }}>
            {/* Preview header */}
            <div style={{
              padding: '14px 20px',
              borderBottom: '1.5px solid #E8C098',
            }}>
              <Text style={{ fontWeight: 700, color: '#2A0D04', fontSize: 14 }}>Live Preview</Text>
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 2 }}>
                Updates as you change tokens
              </Text>
            </div>

            {/* Preview body */}
            <div style={{ padding: 20, ...previewVars }}>

              {/* Banner */}
              <div style={{
                borderRadius: 16,
                background: `linear-gradient(135deg, ${tokens.colorAccent} 0%, ${tokens.colorAccentDark} 60%)`,
                boxShadow: `5px 5px 0px ${tokens.colorAccentShadow}`,
                padding: '18px 20px',
                marginBottom: 14,
                textAlign: 'center',
              }}>
                <div style={{ fontWeight: 900, fontSize: 16, color: '#fff' }}>Salam Small Goods</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 3 }}>Premium Halal Meats</div>
              </div>

              {/* Clay card */}
              <div className="clay-card" style={{ padding: '14px 18px', marginBottom: 14 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: tokens.colorInk, marginBottom: 5 }}>
                  Beef Sausages
                </div>
                <div style={{ fontSize: 12, color: tokens.colorMuted, marginBottom: 12 }}>
                  Fresh halal beef sausages — perfect for the BBQ.
                </div>
                <span style={{
                  display: 'inline-block', padding: '3px 10px', borderRadius: 50,
                  fontSize: 11, fontWeight: 700,
                  background: tokens.colorStatusOk, color: '#fff',
                  boxShadow: `2px 2px 0px ${tokens.colorStatusOkSh}`,
                }}>
                  ● In Stock
                </span>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                <div className="clay-btn-primary" style={{ fontSize: 12, padding: '8px 16px' }}>
                  Browse Products
                </div>
                <div className="clay-btn-secondary" style={{ fontSize: 12, padding: '8px 16px' }}>
                  Contact Us
                </div>
              </div>

              <Divider style={{ margin: '12px 0', borderColor: '#E8C098' }} />

              {/* Footer swatch */}
              <div style={{
                borderRadius: 10,
                background: `linear-gradient(135deg, ${tokens.colorFooterBg}, ${tokens.colorFooterBg2})`,
                padding: '12px 16px',
              }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: tokens.colorFooterText }}>Footer</div>
                <div style={{ fontSize: 11, color: tokens.colorFooterMuted, marginTop: 2 }}>
                  © 2025 Salam Small Goods
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
