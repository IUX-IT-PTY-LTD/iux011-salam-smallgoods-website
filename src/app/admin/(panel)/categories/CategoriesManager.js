'use client';

import { useState, useTransition } from 'react';
import {
  Table, Button, Drawer, Form, Input, InputNumber,
  Space, Popconfirm, Tag, App, Typography,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/categories';

const { Title } = Typography;

export default function CategoriesManager({ initialCategories, productCounts }) {
  const { message } = App.useApp();
  const [categories, setCategories] = useState(initialCategories);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setEditing(null);
    form.resetFields();
    setDrawerOpen(true);
  }

  function openEdit(category) {
    setEditing(category);
    form.setFieldsValue({
      label: category.label,
      emoji: category.emoji,
      description: category.description,
      order: category.order,
    });
    setDrawerOpen(true);
  }

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
        setDrawerOpen(false);
      } catch (err) {
        message.error(err.message || 'Save failed');
      }
    });
  }

  async function handleDelete(category) {
    startTransition(async () => {
      try {
        await deleteCategory(category.slug);
        setCategories((prev) => prev.filter((c) => c.slug !== category.slug));
        message.success('Category deleted');
      } catch (err) {
        message.error(err.message || 'Delete failed');
      }
    });
  }

  const columns = [
    {
      title: 'Emoji',
      dataIndex: 'emoji',
      width: 60,
      render: (e) => <span style={{ fontSize: 24 }}>{e}</span>,
    },
    { title: 'Label', dataIndex: 'label', sorter: (a, b) => a.label.localeCompare(b.label) },
    { title: 'Slug', dataIndex: 'slug', render: (s) => <Tag>{s}</Tag> },
    { title: 'Description', dataIndex: 'description', ellipsis: true },
    {
      title: 'Products',
      width: 100,
      render: (_, record) => (
        <Tag color="gold">{productCounts[record.slug] ?? 0}</Tag>
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
            title={
              productCounts[record.slug] > 0
                ? `This category has ${productCounts[record.slug]} product(s). Delete them first.`
                : 'Delete this category?'
            }
            onConfirm={() => handleDelete(record)}
            okText="Delete"
            okButtonProps={{ danger: true, disabled: productCounts[record.slug] > 0 }}
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
        <Title level={3} style={{ margin: 0 }}>Categories</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ background: '#CC3A20', borderColor: '#CC3A20' }}>
          Add Category
        </Button>
      </div>

      <Table
        dataSource={categories}
        columns={columns}
        rowKey="slug"
        loading={isPending}
        pagination={false}
        size="middle"
      />

      <Drawer
        title={editing ? `Edit: ${editing.label}` : 'Add New Category'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={420}
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
          <Form.Item name="label" label="Category Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="emoji" label="Emoji" rules={[{ required: true }]}>
            <Input maxLength={4} />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item name="order" label="Sort Order" initialValue={99}>
            <InputNumber min={0} max={999} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
