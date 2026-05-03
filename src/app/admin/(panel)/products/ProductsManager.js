'use client';

import { useState, useTransition } from 'react';
import {
  Table, Button, Drawer, Form, Input, Select, Switch, InputNumber,
  Space, Popconfirm, Tag, App, Upload, Image, Typography, Divider,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined,
} from '@ant-design/icons';
import {
  createProduct, updateProduct, deleteProduct,
  toggleProductStock, toggleProductFeatured,
} from '@/app/actions/products';

const { TextArea } = Input;
const { Title } = Typography;

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

export default function ProductsManager({ initialProducts, categories }) {
  const { message } = App.useApp();
  const [products, setProducts] = useState(initialProducts);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [imagePublicId, setImagePublicId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const categoryOptions = categories.map((c) => ({ value: c.slug, label: c.label }));

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
      name: product.name,
      categorySlug: product.categorySlug,
      description: product.description,
      details: product.details,
      inStock: product.inStock,
      featured: product.featured,
      order: product.order,
    });
    setImageUrl(product.imageUrl ?? '');
    setImagePublicId(product.imagePublicId ?? '');
    setDrawerOpen(true);
  }

  async function handleImageUpload({ file }) {
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      if (result.secure_url) {
        setImageUrl(result.secure_url);
        setImagePublicId(result.public_id);
        message.success('Image uploaded');
      } else {
        message.error('Upload failed');
      }
    } catch {
      message.error('Upload error');
    } finally {
      setUploading(false);
    }
    return false;
  }

  async function handleSave() {
    let values;
    try { values = await form.validateFields(); } catch { return; }

    startTransition(async () => {
      try {
        if (editing) {
          await updateProduct(editing.slug, { ...values, imageUrl, imagePublicId });
          setProducts((prev) =>
            prev.map((p) => p.slug === editing.slug ? { ...p, ...values, imageUrl, imagePublicId } : p)
          );
          message.success('Product updated');
        } else {
          const { slug } = await createProduct({ ...values, imageUrl, imagePublicId });
          setProducts((prev) => [...prev, { slug, ...values, imageUrl, imagePublicId }]);
          message.success('Product created');
        }
        setDrawerOpen(false);
      } catch (err) {
        message.error(err.message || 'Save failed');
      }
    });
  }

  async function handleDelete(product) {
    startTransition(async () => {
      try {
        await deleteProduct(product.slug, product.categorySlug);
        setProducts((prev) => prev.filter((p) => p.slug !== product.slug));
        message.success('Product deleted');
      } catch (err) {
        message.error(err.message || 'Delete failed');
      }
    });
  }

  async function handleStockToggle(product, inStock) {
    startTransition(async () => {
      try {
        await toggleProductStock(product.slug, inStock, product.categorySlug);
        setProducts((prev) => prev.map((p) => p.slug === product.slug ? { ...p, inStock } : p));
      } catch {
        message.error('Update failed');
      }
    });
  }

  async function handleFeaturedToggle(product, featured) {
    startTransition(async () => {
      try {
        await toggleProductFeatured(product.slug, featured);
        setProducts((prev) => prev.map((p) => p.slug === product.slug ? { ...p, featured } : p));
      } catch {
        message.error('Update failed');
      }
    });
  }

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      width: 72,
      render: (url) => url
        ? <Image src={url} width={48} height={48} style={{ objectFit: 'cover', borderRadius: 8 }} preview={false} />
        : <div style={{ width: 48, height: 48, background: '#F5E5C0', borderRadius: 8 }} />,
    },
    { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    {
      title: 'Category',
      dataIndex: 'categorySlug',
      render: (slug) => {
        const cat = categories.find((c) => c.slug === slug);
        return <Tag color="gold">{cat?.label ?? slug}</Tag>;
      },
      filters: categories.map((c) => ({ text: c.label, value: c.slug })),
      onFilter: (value, record) => record.categorySlug === value,
    },
    {
      title: 'In Stock',
      dataIndex: 'inStock',
      width: 100,
      render: (val, record) => (
        <Switch checked={val} size="small" onChange={(v) => handleStockToggle(record, v)} />
      ),
      filters: [{ text: 'In Stock', value: true }, { text: 'Out of Stock', value: false }],
      onFilter: (value, record) => record.inStock === value,
    },
    {
      title: 'Featured',
      dataIndex: 'featured',
      width: 100,
      render: (val, record) => (
        <Switch checked={val} size="small" onChange={(v) => handleFeaturedToggle(record, v)} />
      ),
    },
    { title: 'Order', dataIndex: 'order', width: 80, sorter: (a, b) => a.order - b.order },
    {
      title: 'Actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            title="Delete this product?"
            onConfirm={() => handleDelete(record)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Products</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ background: '#CC3A20', borderColor: '#CC3A20' }}>
          Add Product
        </Button>
      </div>

      <Table
        dataSource={products}
        columns={columns}
        rowKey="slug"
        loading={isPending}
        pagination={{ pageSize: 20, showSizeChanger: true }}
        size="middle"
      />

      <Drawer
        title={editing ? `Edit: ${editing.name}` : 'Add New Product'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={520}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" loading={isPending} onClick={handleSave}
              style={{ background: '#CC3A20', borderColor: '#CC3A20' }}>
              Save
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="categorySlug" label="Category" rules={[{ required: true }]}>
            <Select options={categoryOptions} />
          </Form.Item>

          <Form.Item name="description" label="Short Description" rules={[{ required: true }]}>
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item name="details" label="Full Details">
            <TextArea rows={4} />
          </Form.Item>

          <Divider>Image</Divider>

          {imageUrl && (
            <div style={{ marginBottom: 16 }}>
              <img src={imageUrl} alt="preview" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8 }} />
            </div>
          )}
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            customRequest={handleImageUpload}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              {imageUrl ? 'Replace Image' : 'Upload Image'}
            </Button>
          </Upload>
          {imageUrl && (
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste Cloudinary URL"
              style={{ marginTop: 8 }}
            />
          )}
          {!imageUrl && (
            <Input
              placeholder="Or paste image URL"
              onChange={(e) => setImageUrl(e.target.value)}
              style={{ marginTop: 8 }}
            />
          )}

          <Divider />

          <Space style={{ width: '100%' }} direction="vertical">
            <Form.Item name="inStock" label="In Stock" valuePropName="checked" initialValue={true} style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
            <Form.Item name="featured" label="Featured on Homepage" valuePropName="checked" initialValue={false} style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
          </Space>

          <Form.Item name="order" label="Sort Order" initialValue={99} style={{ marginTop: 16 }}>
            <InputNumber min={0} max={999} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
