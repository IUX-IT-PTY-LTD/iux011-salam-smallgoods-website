'use client';

import { useState, useTransition } from 'react';
import { Tabs, Button, Input, Typography, App } from 'antd';
import { SaveOutlined, PlusOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons';
import { saveSection } from '@/app/actions/content';

const { Text, Title } = Typography;
const { TextArea } = Input;

// ─── Label Maps ──────────────────────────────────────────────────────────────

const SECTION_LABELS = {
  hero:           'Hero Banner',
  homeCategories: 'Category Showcase',
  whyChooseUs:    'Why Choose Us',
  aboutSnippet:   'About Snippet',
  aboutHero:      'Page Banner',
  ourStory:       'Our Story',
  ourValues:      'Our Values',
  pageBanner:     'Page Banner',
};

const FIELD_LABELS = {
  title:              'Main Heading',
  titleAccent:        'Accent Heading',
  overline:           'Overline Label',
  description:        'Description',
  paragraph1:         'Paragraph 1',
  paragraph2:         'Paragraph 2',
  paragraph3:         'Paragraph 3',
  ctaPrimaryText:     'Primary Button Text',
  ctaPrimaryHref:     'Primary Button URL',
  ctaSecondaryText:   'Secondary Button Text',
  ctaSecondaryHref:   'Secondary Button URL',
  ctaText:            'Button Text',
  ctaHref:            'Button URL',
  stats:              'Statistics',
  features:           'Feature Cards',
  values:             'Value Cards',
  emoji:              'Icon',
};

const FIELD_HINTS = {
  overline:           'Small label shown above the heading, e.g. "Est. 1998 · Broadmeadows"',
  titleAccent:        'Second line of the heading — displayed in the brand accent colour',
  ctaPrimaryHref:     'Path or URL, e.g. /products',
  ctaSecondaryHref:   'Path or URL, e.g. /contact',
  ctaHref:            'Path or URL, e.g. /about',
};

const JSON_ITEM_LABELS = {
  stats:    'Stat',
  features: 'Feature',
  values:   'Value',
};

const JSON_SUBFIELD_LABELS = {
  value:       'Value',
  label:       'Label',
  emoji:       'Icon',
  title:       'Title',
  description: 'Description',
  href:        'Link URL',
};

const PAGE_LABELS = {
  home:     'Home',
  about:    'About',
  products: 'Products',
  contact:  'Contact',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initEditValues(allData) {
  const ev = {};
  for (const sections of Object.values(allData)) {
    for (const section of sections) {
      const sv = {};
      for (const block of section.blocks) {
        if (block.type === 'json') {
          try { sv[block.key] = JSON.parse(block.value); } catch { sv[block.key] = []; }
        } else {
          sv[block.key] = block.value;
        }
      }
      ev[section.id] = sv;
    }
  }
  return ev;
}

// ─── JsonArrayEditor ─────────────────────────────────────────────────────────

function JsonArrayEditor({ fieldKey, value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const itemLabel = JSON_ITEM_LABELS[fieldKey] ?? 'Item';
  const template = items.length > 0
    ? Object.fromEntries(Object.keys(items[0]).map((k) => [k, '']))
    : { value: '', label: '' };

  function updateItem(i, key, val) {
    onChange(items.map((item, idx) => (idx === i ? { ...item, [key]: val } : item)));
  }

  return (
    <div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            border: '1.5px solid #E8C098',
            borderRadius: 10,
            padding: 16,
            marginBottom: 10,
            background: '#FFFAF2',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: 700, color: '#CC3A20', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {itemLabel} {i + 1}
            </Text>
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            >
              Remove
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {Object.entries(item).map(([key, val]) => (
              <div key={key}>
                <Text style={{ fontSize: 12, fontWeight: 600, color: '#7A5040', display: 'block', marginBottom: 4 }}>
                  {JSON_SUBFIELD_LABELS[key] ?? key}
                </Text>
                {key === 'description' ? (
                  <TextArea
                    rows={2}
                    value={val}
                    onChange={(e) => updateItem(i, key, e.target.value)}
                    style={{ borderRadius: 8, fontSize: 13 }}
                  />
                ) : (
                  <Input
                    value={val}
                    onChange={(e) => updateItem(i, key, e.target.value)}
                    style={{ borderRadius: 8, fontSize: 13 }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button
        icon={<PlusOutlined />}
        onClick={() => onChange([...items, { ...template }])}
        style={{ borderRadius: 8, borderStyle: 'dashed', color: '#7A5040', borderColor: '#C4956A' }}
      >
        Add {itemLabel}
      </Button>
    </div>
  );
}

// ─── FieldEditor ─────────────────────────────────────────────────────────────

function FieldEditor({ block, value, onChange }) {
  const label = FIELD_LABELS[block.key] ?? block.key;
  const hint  = FIELD_HINTS[block.key];

  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ marginBottom: hint ? 2 : 6 }}>
        <Text style={{ fontSize: 13, fontWeight: 600, color: '#2A0D04' }}>{label}</Text>
      </div>
      {hint && (
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
          {hint}
        </Text>
      )}

      {block.type === 'json' ? (
        <JsonArrayEditor
          fieldKey={block.key}
          value={value}
          onChange={onChange}
        />
      ) : block.type === 'richtext' ? (
        <TextArea
          rows={4}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          style={{ borderRadius: 8 }}
        />
      ) : block.type === 'url' ? (
        <Input
          prefix={<LinkOutlined style={{ color: '#aaa' }} />}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. /products"
          style={{ borderRadius: 8 }}
        />
      ) : (
        <Input
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          style={{ borderRadius: 8 }}
        />
      )}
    </div>
  );
}

// ─── SectionPanel ─────────────────────────────────────────────────────────────

function SectionPanel({ section, values, isDirty, onChange, onSave, saving }) {
  const label = SECTION_LABELS[section.sectionKey] ?? section.sectionKey;

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingBottom: 18,
        marginBottom: 24,
        borderBottom: '2px solid #E8C098',
      }}>
        <div>
          <Title level={4} style={{ margin: 0, color: '#2A0D04' }}>{label}</Title>
          {isDirty ? (
            <Text style={{ fontSize: 12, color: '#B45309', marginTop: 4, display: 'block' }}>
              Unsaved changes
            </Text>
          ) : (
            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              All changes saved
            </Text>
          )}
        </div>

        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saving}
          onClick={onSave}
          disabled={!isDirty && !saving}
          style={{
            borderRadius: 8,
            fontWeight: 600,
            background: isDirty ? '#CC3A20' : undefined,
            borderColor: isDirty ? '#CC3A20' : undefined,
          }}
        >
          Save changes
        </Button>
      </div>

      {/* Fields */}
      {section.blocks.map((block) => (
        <FieldEditor
          key={block.key}
          block={block}
          value={values?.[block.key]}
          onChange={(val) => onChange(block.key, val)}
        />
      ))}
    </div>
  );
}

// ─── ContentEditor ────────────────────────────────────────────────────────────

export default function ContentEditor({ initialData }) {
  const { message } = App.useApp();

  const [editValues, setEditValues]   = useState(() => initEditValues(initialData));
  const [dirtySections, setDirty]     = useState({});
  const [saving, setSaving]           = useState({});
  const [activeSections, setActiveSection] = useState(() => {
    const init = {};
    for (const [page, sections] of Object.entries(initialData)) {
      init[page] = sections[0]?.id ?? null;
    }
    return init;
  });
  const [, startTransition] = useTransition();

  function handleChange(sectionId, key, value) {
    setEditValues((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [key]: value },
    }));
    setDirty((prev) => ({ ...prev, [sectionId]: true }));
  }

  function handleSave(section) {
    const values  = editValues[section.id] ?? {};
    const updates = {};
    for (const block of section.blocks) {
      const val = values[block.key];
      updates[block.key] = {
        type:  block.type,
        value: block.type === 'json' ? JSON.stringify(val ?? []) : (val ?? ''),
      };
    }

    setSaving((s) => ({ ...s, [section.id]: true }));
    startTransition(async () => {
      try {
        await saveSection(section.pageSlug, section.sectionKey, updates);
        setDirty((s) => ({ ...s, [section.id]: false }));
        message.success(`${SECTION_LABELS[section.sectionKey] ?? section.sectionKey} saved`);
      } catch (err) {
        message.error(err.message || 'Save failed');
      } finally {
        setSaving((s) => ({ ...s, [section.id]: false }));
      }
    });
  }

  // ─── Build tabs ──────────────────────────────────────────────────────────

  const tabs = Object.entries(initialData).map(([pageSlug, sections]) => {
    const pageHasDirty = sections.some((s) => dirtySections[s.id]);
    const activeSectionId = activeSections[pageSlug];
    const activeSection   = sections.find((s) => s.id === activeSectionId) ?? sections[0];

    return {
      key: pageSlug,
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {PAGE_LABELS[pageSlug]}
          {pageHasDirty && (
            <span style={{
              display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
              background: '#B45309', flexShrink: 0,
            }} />
          )}
        </span>
      ),
      children: (
        <div style={{ display: 'flex', minHeight: 520 }}>

          {/* Left: section navigation */}
          <div style={{
            width: 200,
            flexShrink: 0,
            borderRight: '1.5px solid #E8C098',
            paddingTop: 4,
          }}>
            {sections.map((section) => {
              const isActive = activeSection?.id === section.id;
              const isDirty  = dirtySections[section.id];
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection((prev) => ({ ...prev, [pageSlug]: section.id }))}
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    background: isActive ? '#F5E4C4' : 'transparent',
                    borderTop: 'none',
                    borderRight: 'none',
                    borderBottom: 'none',
                    borderLeft: `3px solid ${isActive ? '#CC3A20' : 'transparent'}`,
                    textAlign: 'left',
                    transition: 'background 0.15s',
                    outline: 'none',
                  }}
                >
                  <Text style={{
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#2A0D04' : '#5A3020',
                  }}>
                    {SECTION_LABELS[section.sectionKey] ?? section.sectionKey}
                  </Text>
                  {isDirty && (
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#B45309', display: 'inline-block', flexShrink: 0,
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: active section editor */}
          <div style={{ flex: 1, padding: '24px 32px', minWidth: 0, maxWidth: 680 }}>
            {activeSection && (
              <SectionPanel
                section={activeSection}
                values={editValues[activeSection.id]}
                isDirty={dirtySections[activeSection.id] ?? false}
                onChange={(key, val) => handleChange(activeSection.id, key, val)}
                onSave={() => handleSave(activeSection)}
                saving={saving[activeSection.id] ?? false}
              />
            )}
          </div>
        </div>
      ),
    };
  });

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#2A0D04' }}>Page Content</Title>
        <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
          Select a section from the left to edit its content. Changes are only published when you click Save.
        </Text>
      </div>

      <div style={{
        background: '#FFFAF2',
        borderRadius: 16,
        border: '1.5px solid #E8C098',
        overflow: 'hidden',
      }}>
        <Tabs
          items={tabs}
          defaultActiveKey="home"
          tabBarStyle={{
            margin: 0,
            paddingLeft: 24,
            borderBottom: '1.5px solid #E8C098',
            background: 'transparent',
          }}
        />
      </div>
    </div>
  );
}
