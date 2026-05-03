'use client';

import { useState, useTransition } from 'react';
import {
  Tabs, Card, Button, Input, App, Typography, Space, Divider, Collapse,
} from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { saveSection } from '@/app/actions/content';

const { Title, Text } = Typography;
const { TextArea } = Input;

const SECTION_LABELS = {
  hero: 'Hero',
  homeCategories: 'Category Showcase',
  whyChooseUs: 'Why Choose Us',
  aboutSnippet: 'About Snippet',
  aboutHero: 'Page Banner',
  ourStory: 'Our Story',
  ourValues: 'Our Values',
  pageBanner: 'Page Banner',
};

const FIELD_LABELS = {
  title: 'Heading', titleAccent: 'Accent Heading (colored)', overline: 'Overline',
  description: 'Description', paragraph1: 'Paragraph 1', paragraph2: 'Paragraph 2',
  paragraph3: 'Paragraph 3', ctaPrimaryText: 'Primary Button Text',
  ctaPrimaryHref: 'Primary Button Link', ctaSecondaryText: 'Secondary Button Text',
  ctaSecondaryHref: 'Secondary Button Link', ctaText: 'CTA Text', ctaHref: 'CTA Link',
  stats: 'Stats', features: 'Features', values: 'Values', emoji: 'Emoji',
};

const PAGE_LABELS = { home: '🏠 Home', about: '📖 About', products: '🥩 Products', contact: '📞 Contact' };

function initEditValues(allData) {
  const ev = {};
  for (const sections of Object.values(allData)) {
    for (const section of sections) {
      const sv = {};
      for (const block of section.blocks) {
        if (block.type === 'json') {
          try { sv[block.key] = JSON.parse(block.value); } catch { sv[block.key] = block.value; }
        } else {
          sv[block.key] = block.value;
        }
      }
      ev[section.id] = sv;
    }
  }
  return ev;
}

function JsonArrayEditor({ value, onChange }) {
  const items = Array.isArray(value) ? value : [];

  const template = items.length > 0
    ? Object.fromEntries(Object.keys(items[0]).map((k) => [k, '']))
    : { value: '', label: '' };

  function updateItem(i, key, val) {
    onChange(items.map((item, idx) => (idx === i ? { ...item, [key]: val } : item)));
  }

  return (
    <div>
      {items.map((item, i) => (
        <Card
          key={i}
          size="small"
          style={{ marginBottom: 8, background: '#FBF0DC' }}
          extra={
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            />
          }
        >
          {Object.entries(item).map(([key, val]) => (
            <div key={key} style={{ marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {key}
              </Text>
              {key === 'description' ? (
                <TextArea
                  rows={2}
                  value={val}
                  onChange={(e) => updateItem(i, key, e.target.value)}
                  style={{ marginTop: 4 }}
                />
              ) : (
                <Input
                  value={val}
                  onChange={(e) => updateItem(i, key, e.target.value)}
                  style={{ marginTop: 4 }}
                />
              )}
            </div>
          ))}
        </Card>
      ))}
      <Button
        size="small"
        icon={<PlusOutlined />}
        onClick={() => onChange([...items, { ...template }])}
      >
        Add Item
      </Button>
    </div>
  );
}

function SectionEditor({ section, values, onChange, onSave, saving }) {
  return (
    <Card
      title={SECTION_LABELS[section.sectionKey] ?? section.sectionKey}
      style={{ marginBottom: 16 }}
      extra={
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saving}
          onClick={onSave}
          style={{ background: '#CC3A20', borderColor: '#CC3A20' }}
          size="small"
        >
          Save
        </Button>
      }
    >
      {section.blocks.map((block) => {
        const label = FIELD_LABELS[block.key] ?? block.key;
        const val = values?.[block.key] ?? '';

        return (
          <div key={block.key} style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#5A3020' }}>
              {label}
              <Text type="secondary" style={{ fontSize: 11, marginLeft: 8, fontWeight: 400 }}>
                ({block.type})
              </Text>
            </div>

            {block.type === 'json' ? (
              <JsonArrayEditor
                value={val}
                onChange={(updated) => onChange(block.key, updated)}
              />
            ) : block.type === 'richtext' ? (
              <TextArea
                rows={3}
                value={val}
                onChange={(e) => onChange(block.key, e.target.value)}
              />
            ) : block.type === 'url' ? (
              <Input
                value={val}
                onChange={(e) => onChange(block.key, e.target.value)}
                addonBefore="URL"
              />
            ) : (
              <Input
                value={val}
                onChange={(e) => onChange(block.key, e.target.value)}
              />
            )}
          </div>
        );
      })}
    </Card>
  );
}

export default function ContentEditor({ initialData }) {
  const { message } = App.useApp();
  const [editValues, setEditValues] = useState(() => initEditValues(initialData));
  const [saving, setSaving] = useState({});
  const [isPending, startTransition] = useTransition();

  function handleChange(sectionId, key, value) {
    setEditValues((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [key]: value },
    }));
  }

  function handleSave(section) {
    const values = editValues[section.id] ?? {};
    const updates = {};
    for (const block of section.blocks) {
      const val = values[block.key];
      updates[block.key] = {
        type: block.type,
        value: block.type === 'json' ? JSON.stringify(val ?? []) : (val ?? ''),
      };
    }

    setSaving((s) => ({ ...s, [section.id]: true }));
    startTransition(async () => {
      try {
        await saveSection(section.pageSlug, section.sectionKey, updates);
        message.success(`"${SECTION_LABELS[section.sectionKey] ?? section.sectionKey}" saved`);
      } catch (err) {
        message.error(err.message || 'Save failed');
      } finally {
        setSaving((s) => ({ ...s, [section.id]: false }));
      }
    });
  }

  const tabs = Object.entries(initialData).map(([pageSlug, sections]) => ({
    key: pageSlug,
    label: PAGE_LABELS[pageSlug] ?? pageSlug,
    children: (
      <div style={{ maxWidth: 760 }}>
        {sections.map((section) => (
          <SectionEditor
            key={section.id}
            section={section}
            values={editValues[section.id]}
            onChange={(key, val) => handleChange(section.id, key, val)}
            onSave={() => handleSave(section)}
            saving={saving[section.id] ?? false}
          />
        ))}
      </div>
    ),
  }));

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Page Content</Title>
      <Tabs items={tabs} defaultActiveKey="home" />
    </div>
  );
}
