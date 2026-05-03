'use client';

import { useState, useTransition } from 'react';
import { ColorPicker, Button, Card, Typography, App, Divider, Space } from 'antd';
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

export default function DesignEditor({ initialTokens }) {
  const { message } = App.useApp();
  const [tokens, setTokens] = useState(initialTokens);
  const [isPending, startTransition] = useTransition();

  function handleChange(key, color) {
    setTokens((prev) => ({ ...prev, [key]: color.toHexString() }));
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await saveTheme(tokens);
        message.success('Theme saved — site colours updated globally');
      } catch (err) {
        message.error(err.message || 'Save failed');
      }
    });
  }

  const previewVars = buildPreviewStyle(tokens);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Design Tokens</Title>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={isPending}
          onClick={handleSave}
          size="large"
          style={{ background: tokens.colorAccent, borderColor: tokens.colorAccent }}
        >
          Save & Publish
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
        {/* ── Token groups ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {TOKEN_GROUPS.map((group) => (
            <Card key={group.label} title={group.label} size="small">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
                {group.tokens.map(({ key, label }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <Text style={{ fontSize: 13 }}>{label}</Text>
                    <ColorPicker
                      value={tokens[key]}
                      onChange={(color) => handleChange(key, color)}
                      showText={(color) => color.toHexString()}
                      size="small"
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* ── Live preview ── */}
        <div style={{ position: 'sticky', top: 24 }}>
          <Card title="Live Preview" size="small">
            <div style={previewVars}>
              {/* Banner */}
              <div
                style={{
                  borderRadius: 20,
                  background: `linear-gradient(135deg, ${tokens.colorAccent} 0%, ${tokens.colorAccentDark} 60%)`,
                  boxShadow: `6px 6px 0px ${tokens.colorAccentShadow}`,
                  padding: '20px 24px',
                  marginBottom: 16,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontWeight: 900, fontSize: 18, color: '#fff' }}>Salam Small Goods</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Premium Halal Meats</div>
              </div>

              {/* Clay card */}
              <div className="clay-card" style={{ padding: '16px 20px', marginBottom: 16 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: tokens.colorInk, marginBottom: 6 }}>
                  Beef Sausages
                </div>
                <div style={{ fontSize: 13, color: tokens.colorMuted, marginBottom: 14 }}>
                  Fresh halal beef sausages, perfect for the BBQ.
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 12px',
                      borderRadius: 50,
                      fontSize: 11,
                      fontWeight: 700,
                      background: tokens.colorStatusOk,
                      color: '#fff',
                      boxShadow: `2px 2px 0px ${tokens.colorStatusOkSh}`,
                    }}
                  >
                    ● In Stock
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <div className="clay-btn-primary" style={{ fontSize: 13, padding: '9px 20px', display: 'inline-block' }}>
                  Browse Products
                </div>
                <div className="clay-btn-secondary" style={{ fontSize: 13, padding: '9px 20px', display: 'inline-block' }}>
                  Contact Us
                </div>
              </div>

              <Divider style={{ margin: '14px 0' }} />

              {/* Footer swatch */}
              <div
                style={{
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${tokens.colorFooterBg}, ${tokens.colorFooterBg2})`,
                  padding: '12px 16px',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, color: tokens.colorFooterText }}>Footer</div>
                <div style={{ fontSize: 11, color: tokens.colorFooterMuted, marginTop: 2 }}>
                  © 2025 Salam Small Goods
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
