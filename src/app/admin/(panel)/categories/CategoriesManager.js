'use client';

import { useState, useTransition, useMemo } from 'react';
import {
  Table, Button, Drawer, Form, Input, InputNumber,
  Space, App, Typography, Popover,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/categories';

const { Title, Text } = Typography;

// ─── Emoji data ───────────────────────────────────────────────────────────────

const EMOJI_LIST = [
  { e: '🥩', l: 'meat steak beef' },
  { e: '🍖', l: 'meat bone leg lamb' },
  { e: '🍗', l: 'chicken leg poultry' },
  { e: '🥓', l: 'bacon smallgoods cured' },
  { e: '🌭', l: 'sausage hot dog' },
  { e: '🍔', l: 'burger beef patty' },
  { e: '🐄', l: 'cow beef cattle' },
  { e: '🐑', l: 'sheep lamb' },
  { e: '🐔', l: 'chicken poultry' },
  { e: '🦴', l: 'bone marrow' },
  { e: '🔪', l: 'knife butcher' },
  { e: '🫙', l: 'jar preserved cured jerky' },
  { e: '🥚', l: 'egg' },
  { e: '🧅', l: 'onion' },
  { e: '🧄', l: 'garlic' },
  { e: '🌿', l: 'herb fresh greens' },
  { e: '🌶️', l: 'chilli spice hot' },
  { e: '🥘', l: 'stew casserole pan' },
  { e: '🍲', l: 'soup stew pot' },
  { e: '🫕', l: 'hotpot fondue' },
  { e: '🌮', l: 'taco wrap' },
  { e: '🥙', l: 'pita wrap kebab' },
  { e: '🧆', l: 'falafel' },
  { e: '🐟', l: 'fish seafood' },
  { e: '🦐', l: 'prawn shrimp seafood' },
  { e: '⭐', l: 'featured special star' },
  { e: '🆕', l: 'new' },
  { e: '🏷️', l: 'tag label' },
  { e: '🎁', l: 'gift special bundle' },
  { e: '🛒', l: 'shop cart' },
];

// ─── EmojiPicker ─────────────────────────────────────────────────────────────

function EmojiPicker({ value, onChange }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');

  const filtered = EMOJI_LIST.filter(
    ({ l }) => !query || l.includes(query.toLowerCase())
  );

  const popoverContent = (
    <div style={{ width: 288 }}>
      <Input
        autoFocus
        placeholder="Search emojis…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: 8, borderRadius: 8 }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 2, maxHeight: 180, overflowY: 'auto' }}>
        {filtered.map(({ e }) => (
          <button
            key={e}
            type="button"
            title={EMOJI_LIST.find((x) => x.e === e)?.l}
            onClick={() => { onChange(e); setOpen(false); setQuery(''); }}
            style={{
              fontSize: 22, padding: '5px 0', cursor: 'pointer',
              border: 'none', borderRadius: 6, lineHeight: 1,
              background: value === e ? '#F5E4C4' : 'transparent',
            }}
          >
            {e}
          </button>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '16px 0', color: '#9A8070', fontSize: 12 }}>
            No results
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Popover
        content={popoverContent}
        trigger="click"
        open={open}
        onOpenChange={(v) => { setOpen(v); if (!v) setQuery(''); }}
        placement="bottomLeft"
      >
        <button
          type="button"
          style={{
            fontSize: 28, width: 52, height: 52, borderRadius: 10, flexShrink: 0,
            border: '1.5px solid #C4956A', background: '#FFFAF2',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {value || '➕'}
        </button>
      </Popover>
      <span style={{ fontSize: 12, color: '#9A8070' }}>
        {value ? 'Click to change' : 'Click to pick an emoji'}
      </span>
    </div>
  );
}

// ─── FormSection ─────────────────────────────────────────────────────────────

function FormSection({ label, children, style }) {
  return (
    <div style={{ marginBottom: 28, ...style }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: '#CC3A20',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: 14, paddingBottom: 8,
        borderBottom: '1.5px solid #F0DDB8',
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

// ─── CategoriesManager ────────────────────────────────────────────────────────

export default function CategoriesManager({ initialCategories, productCounts }) {
  const { message, modal } = App.useApp();
  const [categories, setCategories] = useState(initialCategories);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form]                      = Form.useForm();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch]         = useState('');

  // ─── Client-side filtering ────────────────────────────────────────────────

  const filtered = useMemo(() => categories.filter((c) =>
    !search || c.label.toLowerCase().includes(search.toLowerCase())
  ), [categories, search]);

  // ─── Drawer open/close ────────────────────────────────────────────────────

  function openCreate() {
    setEditing(null);
    form.resetFields();
    setDrawerOpen(true);
  }

  function openEdit(category) {
    setEditing(category);
    form.setFieldsValue({
      label:       category.label,
      emoji:       category.emoji,
      description: category.description,
      order:       category.order,
    });
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditing(null);
  }

  // ─── Save ─────────────────────────────────────────────────────────────────

  async function handleSave() {
    let values;
    try { values = await form.validateFields(); } catch { return; }

    startTransition(async () => {
      try {
        if (editing) {
          await updateCategory(editing.slug, values);
          setCategories((prev) =>
            prev.map((c) => c.slug === editing.slug ? { ...c, ...values } : c)
          );
          message.success('Category updated');
        } else {
          const { slug } = await createCategory(values);
          setCategories((prev) => [...prev, { slug, ...values }]);
          message.success('Category created');
        }
        closeDrawer();
      } catch (err) {
        message.error(err.message || 'Save failed');
      }
    });
  }

  // ─── Delete ───────────────────────────────────────────────────────────────

  function confirmDelete(category) {
    const count = productCounts[category.slug] ?? 0;

    if (count > 0) {
      modal.warning({
        title: `Cannot delete "${category.label}"`,
        content: `This category has ${count} product${count !== 1 ? 's' : ''}. Move or delete those products first, then try again.`,
        okText: 'Got it',
      });
      return;
    }

    modal.confirm({
      title: `Delete "${category.label}"?`,
      content: 'This category will be permanently removed and cannot be recovered.',
      okText: 'Delete permanently',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: () => new Promise((resolve, reject) => {
        startTransition(async () => {
          try {
            await deleteCategory(category.slug);
            setCategories((prev) => prev.filter((c) => c.slug !== category.slug));
            message.success(`"${category.label}" deleted`);
            resolve();
          } catch (err) {
            message.error(err.message || 'Delete failed');
            reject(err);
          }
        });
      }),
    });
  }

  // ─── Table columns ────────────────────────────────────────────────────────

  const columns = [
    {
      title: 'Category',
      dataIndex: 'label',
      sorter: (a, b) => a.label.localeCompare(b.label),
      onCell: () => ({ style: { paddingLeft: 20 } }),
      onHeaderCell: () => ({ style: { paddingLeft: 20 } }),
      render: (label, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, flexShrink: 0,
            background: 'linear-gradient(145deg, #F5E4C4, #E8C87A22)',
            border: '1.5px solid #E8C098',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 28,
            boxShadow: '2px 2px 0px #D4A87888',
          }}>
            {record.emoji}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#2A0D04', lineHeight: 1.25, marginBottom: 3 }}>
              {label}
            </div>
            {record.description && (
              <div style={{
                fontSize: 12, color: '#9A8070', lineHeight: 1.4,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                maxWidth: 340,
              }}>
                {record.description}
              </div>
            )}
            <div style={{ marginTop: 5 }}>
              <span style={{
                fontSize: 11, color: '#A07050', background: '#F5E4C4',
                border: '1px solid #E8C098', borderRadius: 5,
                padding: '2px 7px', fontFamily: 'monospace', letterSpacing: '0.02em',
              }}>
                /{record.slug}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Products',
      width: 180,
      sorter: (a, b) => (productCounts[a.slug] ?? 0) - (productCounts[b.slug] ?? 0),
      render: (_, record) => {
        const count = productCounts[record.slug] ?? 0;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: count > 0 ? '#F5E4C4' : '#F0F0F0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14,
              color: count > 0 ? '#2A0D04' : '#bbb',
            }}>
              {count}
            </div>
            <Text style={{ fontSize: 12, color: '#7A5040' }}>
              {count === 1 ? 'product' : 'products'}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Order',
      dataIndex: 'order',
      width: 110,
      sorter: (a, b) => a.order - b.order,
      render: (order) => (
        <Text style={{ fontSize: 13, color: '#7A5040' }}>#{order}</Text>
      ),
    },
    {
      title: '',
      width: 180,
      render: (_, record) => (
        <Space size={4}>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Button
            size="small"
            icon={<EyeOutlined />}
            title="View on website"
            onClick={() => window.open(`/products/${record.slug}`, '_blank')}
          />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete(record)}
          />
        </Space>
      ),
    },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: '#2A0D04' }}>Categories</Title>
          <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
            {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreate}
          style={{ background: '#CC3A20', borderColor: '#CC3A20', borderRadius: 8, fontWeight: 600 }}
        >
          Add Category
        </Button>
      </div>

      {/* Table card */}
      <div style={{ background: '#FFFAF2', borderRadius: 16, border: '1.5px solid #E8C098', overflow: 'hidden' }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderBottom: '1.5px solid #E8C098' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#C4956A' }} />}
            placeholder="Search categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ maxWidth: 260, borderRadius: 8 }}
          />
          {search && (
            <Text type="secondary" style={{ fontSize: 13 }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </Text>
          )}
        </div>

        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="slug"
          loading={isPending}
          pagination={false}
          size="middle"
          style={{ margin: 0 }}
          className="products-table"
        />
      </div>

      {/* Drawer */}
      <Drawer
        title={
          <span style={{ fontWeight: 700, color: '#2A0D04', fontSize: 16 }}>
            {editing ? `Edit: ${editing.label}` : 'New Category'}
          </span>
        }
        open={drawerOpen}
        onClose={closeDrawer}
        width={440}
        styles={{ body: { padding: '24px 28px', background: '#FFFAF2' } }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={closeDrawer}>Cancel</Button>
            <Button
              type="primary"
              loading={isPending}
              onClick={handleSave}
              style={{ background: '#CC3A20', borderColor: '#CC3A20', borderRadius: 8, fontWeight: 600 }}
            >
              {editing ? 'Save changes' : 'Create category'}
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" requiredMark={false}>

          <FormSection label="Basic Info">
            <Form.Item
              name="label"
              label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>Category Name</span>}
              rules={[{ required: true, message: 'Name is required' }]}
            >
              <Input placeholder="e.g. Beef" style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item
              name="emoji"
              label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>Emoji Icon</span>}
              rules={[{ required: true, message: 'Emoji is required' }]}
              style={{ marginBottom: 0 }}
            >
              <EmojiPicker />
            </Form.Item>
          </FormSection>

          <FormSection label="Description">
            <Form.Item
              name="description"
              label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>Short Description</span>}
              extra="Shown on the categories section of the home page"
              style={{ marginBottom: 0 }}
            >
              <Input.TextArea
                rows={3}
                placeholder="e.g. Premium halal beef cuts and products"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
          </FormSection>

          <FormSection label="Display" style={{ marginBottom: 0 }}>
            <Form.Item
              name="order"
              label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>Sort Order</span>}
              initialValue={99}
              extra="Lower numbers appear first in the category list"
              style={{ marginBottom: 0 }}
            >
              <InputNumber min={0} max={999} style={{ width: 100, borderRadius: 8 }} />
            </Form.Item>
          </FormSection>

        </Form>
      </Drawer>
    </div>
  );
}
