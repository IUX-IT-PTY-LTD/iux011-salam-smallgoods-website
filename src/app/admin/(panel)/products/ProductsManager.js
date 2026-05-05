'use client';

import { useState, useTransition, useMemo } from 'react';
import {
  Table, Button, Drawer, Form, Input, Select, Switch,
  Space, Tag, App, Upload, Typography, Modal,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  UploadOutlined, SearchOutlined, EyeOutlined,
} from '@ant-design/icons';
import {
  createProduct, updateProduct, deleteProduct, toggleProductStock, bulkDeleteProducts,
} from '@/app/actions/products';

const { TextArea } = Input;
const { Title, Text } = Typography;

// ─── Image pre-processing ─────────────────────────────────────────────────────

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_DIMENSION  = 1200;
const JPEG_QUALITY   = 0.85;

async function preprocessImage(file) {
  if (file.size > MAX_FILE_BYTES) throw new Error('Image must be under 10 MB.');
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width  = Math.round(width  * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => blob
          ? resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
          : reject(new Error('Image processing failed.')),
        'image/jpeg',
        JPEG_QUALITY
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read image.')); };
    img.src = url;
  });
}

// ─── Cloudinary upload helper ─────────────────────────────────────────────────

async function uploadToCloudinary(file) {
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder: 'salam-smallgoods/products' }),
  });
  const { signature, timestamp, cloudName, apiKey, folder } = await res.json();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp);
  formData.append('api_key', apiKey);
  formData.append('folder', folder);
  const upload = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );
  return upload.json();
}

// ─── ImageUpload ─────────────────────────────────────────────────────────────

function ImageUpload({ imageUrl, onUpload, onRemove, uploading }) {
  if (imageUrl) {
    return (
      <div>
        <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 10, border: '1.5px solid #E8C098' }}>
          <img
            src={imageUrl}
            alt="Product preview"
            style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
          />
        </div>
        <Space>
          <Upload showUploadList={false} customRequest={onUpload} accept=".jpg,.jpeg,.png,image/jpeg,image/png">
            <Button size="small" icon={<UploadOutlined />} loading={uploading}>
              Replace image
            </Button>
          </Upload>
          <Button size="small" danger onClick={onRemove}>Remove</Button>
        </Space>
      </div>
    );
  }

  return (
    <Upload.Dragger
      showUploadList={false}
      customRequest={onUpload}
      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
      style={{
        borderRadius: 10,
        background: '#FFFAF2',
        borderColor: '#C4956A',
        borderStyle: 'dashed',
      }}
    >
      <div style={{ padding: '12px 0' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
        <p style={{ fontWeight: 600, color: '#2A0D04', margin: 0, fontSize: 14 }}>
          {uploading ? 'Uploading…' : 'Drop image here, or click to browse'}
        </p>
        <p style={{ fontSize: 12, color: '#7A5040', margin: '4px 0 0' }}>
          JPG or PNG · Resized to max 1200 px · max 10 MB
        </p>
      </div>
    </Upload.Dragger>
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

// ─── ProductsManager ──────────────────────────────────────────────────────────

export default function ProductsManager({ initialProducts, categories }) {
  const { message, modal } = App.useApp();
  const [products, setProducts]     = useState(initialProducts);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form]                      = Form.useForm();
  const [imageUrl, setImageUrl]     = useState('');
  const [imagePublicId, setImagePublicId] = useState('');
  const [uploading, setUploading]   = useState(false);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch]         = useState('');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const categoryOptions = categories.map((c) => ({
    value: c.slug,
    label: `${c.emoji ?? ''} ${c.label}`.trim(),
  }));

  // ─── Client-side filtering ────────────────────────────────────────────────

  const filteredProducts = useMemo(() => products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = !categoryFilter || p.categorySlug === categoryFilter;
    return matchSearch && matchCat;
  }), [products, search, categoryFilter]);

  // ─── Drawer open/close ────────────────────────────────────────────────────

  function openCreate() {
    setEditing(null);
    form.resetFields();
    setImageUrl('');
    setImagePublicId('');
    setDrawerOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    form.setFieldsValue({
      name:         product.name,
      categorySlug: product.categorySlug,
      description:  product.description,
      details:      product.details,
      inStock:      product.inStock,
      featured:     product.featured,
    });
    setImageUrl(product.imageUrl ?? '');
    setImagePublicId(product.imagePublicId ?? '');
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditing(null);
  }

  // ─── Image upload ─────────────────────────────────────────────────────────

  async function handleImageUpload({ file }) {
    setUploading(true);
    try {
      const optimised = await preprocessImage(file);
      const result = await uploadToCloudinary(optimised);
      if (result.secure_url) {
        setImageUrl(result.secure_url);
        setImagePublicId(result.public_id);
        message.success('Image uploaded');
      } else {
        message.error('Upload failed');
      }
    } catch (err) {
      message.error(err.message || 'Upload error');
    } finally {
      setUploading(false);
    }
    return false;
  }

  // ─── Save ─────────────────────────────────────────────────────────────────

  async function handleSave() {
    let values;
    try { values = await form.validateFields(); } catch { return; }

    startTransition(async () => {
      try {
        if (editing) {
          await updateProduct(editing.slug, { ...values, imageUrl, imagePublicId });
          setProducts((prev) =>
            prev.map((p) =>
              p.slug === editing.slug ? { ...p, ...values, imageUrl, imagePublicId } : p
            )
          );
          message.success('Product updated');
        } else {
          const { slug } = await createProduct({ ...values, imageUrl, imagePublicId });
          setProducts((prev) => [{ slug, ...values, imageUrl, imagePublicId, order: 99 }, ...prev]);
          message.success('Product created');
        }
        closeDrawer();
      } catch (err) {
        message.error(err.message || 'Save failed');
      }
    });
  }

  // ─── Delete ───────────────────────────────────────────────────────────────

  function confirmDelete(product) {
    modal.confirm({
      title: `Delete "${product.name}"?`,
      content: 'This product will be permanently removed from the website and cannot be recovered.',
      okText: 'Delete permanently',
      okButtonProps: { danger: true },
      cancelText: 'Keep product',
      onOk: () => new Promise((resolve, reject) => {
        startTransition(async () => {
          try {
            await deleteProduct(product.slug, product.categorySlug);
            setProducts((prev) => prev.filter((p) => p.slug !== product.slug));
            message.success(`"${product.name}" deleted`);
            resolve();
          } catch (err) {
            message.error(err.message || 'Delete failed');
            reject(err);
          }
        });
      }),
    });
  }

  // ─── Bulk delete ──────────────────────────────────────────────────────────

  function confirmBulkDelete() {
    modal.confirm({
      title: `Delete ${selectedRowKeys.length} product${selectedRowKeys.length !== 1 ? 's' : ''}?`,
      content: 'These products will be permanently removed and cannot be recovered.',
      okText: 'Delete permanently',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: () => new Promise((resolve, reject) => {
        startTransition(async () => {
          try {
            const items = products
              .filter((p) => selectedRowKeys.includes(p.slug))
              .map((p) => ({ slug: p.slug, categorySlug: p.categorySlug }));
            await bulkDeleteProducts(items);
            setProducts((prev) => prev.filter((p) => !selectedRowKeys.includes(p.slug)));
            setSelectedRowKeys([]);
            message.success(`${items.length} product${items.length !== 1 ? 's' : ''} deleted`);
            resolve();
          } catch (err) {
            message.error(err.message || 'Bulk delete failed');
            reject(err);
          }
        });
      }),
    });
  }

  // ─── Stock toggle ─────────────────────────────────────────────────────────

  function handleStockToggle(product, inStock) {
    startTransition(async () => {
      try {
        await toggleProductStock(product.slug, inStock, product.categorySlug);
        setProducts((prev) =>
          prev.map((p) => p.slug === product.slug ? { ...p, inStock } : p)
        );
      } catch {
        message.error('Update failed');
      }
    });
  }

  // ─── Table columns ────────────────────────────────────────────────────────

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      onCell: () => ({ style: { paddingLeft: 20 } }),
      onHeaderCell: () => ({ style: { paddingLeft: 20 } }),
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {record.imageUrl ? (
            <img
              src={record.imageUrl}
              alt={name}
              style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
            />
          ) : (
            <div style={{
              width: 48, height: 48, borderRadius: 8, flexShrink: 0,
              background: '#F0DDB8', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 22,
            }}>
              🥩
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#2A0D04', lineHeight: 1.3 }}>
              {name}
            </div>
            <div style={{
              fontSize: 12, color: '#9A8070', marginTop: 2,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {record.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'categorySlug',
      width: 190,
      render: (slug) => {
        const cat = categories.find((c) => c.slug === slug);
        return (
          <Tag style={{ borderRadius: 20, fontWeight: 600, fontSize: 12 }}>
            {cat?.emoji} {cat?.label ?? slug}
          </Tag>
        );
      },
    },
    {
      title: 'Stock',
      dataIndex: 'inStock',
      width: 200,
      render: (inStock, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Switch
              checked={inStock}
              size="small"
              onChange={(v) => handleStockToggle(record, v)}
              style={{ background: inStock ? '#3E6B2A' : undefined }}
            />
            <Text style={{
              fontSize: 12, fontWeight: 600,
              color: inStock ? '#3E6B2A' : '#A83020',
            }}>
              {inStock ? 'In stock' : 'Out of stock'}
            </Text>
          </div>
          {record.featured && (
            <Text style={{ fontSize: 11, color: '#B45309' }}>⭐ Featured</Text>
          )}
        </div>
      ),
      filters: [
        { text: 'In Stock', value: true },
        { text: 'Out of Stock', value: false },
      ],
      onFilter: (value, record) => record.inStock === value,
    },
    {
      title: '',
      width: 170,
      render: (_, record) => (
        <Space size={4}>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Button
            size="small"
            icon={<EyeOutlined />}
            title="View on website"
            onClick={() => window.open(`/products/${record.categorySlug}/${record.slug}`, '_blank')}
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
          <Title level={3} style={{ margin: 0, color: '#2A0D04' }}>Products</Title>
          <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
            {products.length} product{products.length !== 1 ? 's' : ''} across {categories.length} categories
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreate}
          style={{ background: '#CC3A20', borderColor: '#CC3A20', borderRadius: 8, fontWeight: 600 }}
        >
          Add Product
        </Button>
      </div>

      {/* Table card */}
      <div style={{ background: '#FFFAF2', borderRadius: 16, border: '1.5px solid #E8C098', overflow: 'hidden' }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderBottom: '1.5px solid #E8C098' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#C4956A' }} />}
            placeholder="Search products…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSelectedRowKeys([]); }}
            allowClear
            style={{ maxWidth: 260, borderRadius: 8 }}
          />
          <Select
            placeholder="All categories"
            options={categoryOptions}
            value={categoryFilter}
            onChange={(v) => { setCategoryFilter(v ?? null); setSelectedRowKeys([]); }}
            allowClear
            style={{ width: 180 }}
          />
          {(search || categoryFilter) && (
            <Text type="secondary" style={{ fontSize: 13 }}>
              {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
            </Text>
          )}
          {selectedRowKeys.length > 0 && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 13, fontWeight: 600, color: '#CC3A20' }}>
                {selectedRowKeys.length} selected
              </Text>
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={confirmBulkDelete}
              >
                Delete selected
              </Button>
            </div>
          )}
        </div>

        <Table
          dataSource={filteredProducts}
          columns={columns}
          rowKey="slug"
          loading={isPending}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}–${range[1]} of ${total}`,
          }}
          size="middle"
          onRow={(record) => ({
            style: { opacity: record.inStock ? 1 : 0.6 },
          })}
          style={{ margin: 0 }}
          className="products-table"
        />
      </div>

      {/* Drawer */}
      <Drawer
        title={
          <span style={{ fontWeight: 700, color: '#2A0D04', fontSize: 16 }}>
            {editing ? `Edit: ${editing.name}` : 'New Product'}
          </span>
        }
        open={drawerOpen}
        onClose={closeDrawer}
        width={520}
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
              {editing ? 'Save changes' : 'Create product'}
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" requiredMark={false}>

          <FormSection label="Basic Info">
            <Form.Item
              name="name"
              label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>Product Name</span>}
              rules={[{ required: true, message: 'Name is required' }]}
            >
              <Input placeholder="e.g. Beef Sausages" style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item
              name="categorySlug"
              label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>Category</span>}
              rules={[{ required: true, message: 'Select a category' }]}
              style={{ marginBottom: 0 }}
            >
              <Select options={categoryOptions} placeholder="Select a category" />
            </Form.Item>
          </FormSection>

          <FormSection label="Description">
            <Form.Item
              name="description"
              label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>Short Description</span>}
              rules={[{ required: true, message: 'Short description is required' }]}
              extra="Shown on product cards — keep it under 100 characters"
            >
              <TextArea
                rows={2}
                placeholder="e.g. Juicy, seasoned beef sausages — perfect for the BBQ"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
            <Form.Item
              name="details"
              label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>Full Details</span>}
              extra="Shown on the product detail page — sourcing, preparation, serving tips"
              style={{ marginBottom: 0 }}
            >
              <TextArea
                rows={5}
                placeholder="Describe this product in full — where it comes from, how it's prepared, how to serve it…"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
          </FormSection>

          <FormSection label="Image">
            <ImageUpload
              imageUrl={imageUrl}
              imagePublicId={imagePublicId}
              onUpload={handleImageUpload}
              onRemove={() => { setImageUrl(''); setImagePublicId(''); }}
              uploading={uploading}
            />
          </FormSection>

          <FormSection label="Status" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', gap: 40 }}>
              <Form.Item
                name="inStock"
                label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>In Stock</span>}
                valuePropName="checked"
                initialValue={true}
                style={{ margin: 0 }}
              >
                <Switch />
              </Form.Item>
              <Form.Item
                name="featured"
                label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>Featured on Homepage</span>}
                valuePropName="checked"
                initialValue={false}
                style={{ margin: 0 }}
              >
                <Switch />
              </Form.Item>
            </div>
          </FormSection>

        </Form>
      </Drawer>
    </div>
  );
}
