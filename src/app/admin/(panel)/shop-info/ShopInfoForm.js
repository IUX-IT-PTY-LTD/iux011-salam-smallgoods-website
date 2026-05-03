'use client';

import { useState, useTransition } from 'react';
import {
  Form, Input, Button, App, Typography, Divider, Space, Card,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { updateShopInfo } from '@/app/actions/shopInfo';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ShopInfoForm({ initialData }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [hours, setHours] = useState(initialData?.hours ?? []);
  const [isPending, startTransition] = useTransition();

  function addHour() {
    setHours((prev) => [...prev, { day: '', time: '', order: prev.length }]);
  }

  function removeHour(index) {
    setHours((prev) => prev.filter((_, i) => i !== index));
  }

  function updateHour(index, field, value) {
    setHours((prev) => prev.map((h, i) => i === index ? { ...h, [field]: value } : h));
  }

  async function handleSave() {
    let values;
    try { values = await form.validateFields(); } catch { return; }

    startTransition(async () => {
      try {
        await updateShopInfo({
          name: values.name,
          tagline: values.tagline,
          description: values.description,
          address: values.address,
          phone: values.phone,
          email: values.email,
          hours: hours.map((h, i) => ({ ...h, order: i })),
          social: {
            facebook: values.facebook ?? '',
            instagram: values.instagram ?? '',
          },
        });
        message.success('Shop info saved');
      } catch (err) {
        message.error(err.message || 'Save failed');
      }
    });
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Shop Info</Title>
        <Button type="primary" loading={isPending} onClick={handleSave}
          style={{ background: '#CC3A20', borderColor: '#CC3A20' }}>
          Save Changes
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        initialValues={{
          name: initialData?.name,
          tagline: initialData?.tagline,
          description: initialData?.description,
          address: initialData?.address,
          phone: initialData?.phone,
          email: initialData?.email,
          facebook: initialData?.social?.facebook,
          instagram: initialData?.social?.instagram,
        }}
      >
        <Card title="Basic Info" style={{ marginBottom: 24 }}>
          <Form.Item name="name" label="Shop Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tagline" label="Tagline">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} />
          </Form.Item>
        </Card>

        <Card title="Contact Details" style={{ marginBottom: 24 }}>
          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input type="email" />
          </Form.Item>
        </Card>

        <Card title="Social Media" style={{ marginBottom: 24 }}>
          <Form.Item name="facebook" label="Facebook URL">
            <Input placeholder="https://facebook.com/..." />
          </Form.Item>
          <Form.Item name="instagram" label="Instagram URL">
            <Input placeholder="https://instagram.com/..." />
          </Form.Item>
        </Card>

        <Card
          title="Trading Hours"
          extra={
            <Button size="small" icon={<PlusOutlined />} onClick={addHour}>Add Row</Button>
          }
          style={{ marginBottom: 24 }}
        >
          {hours.length === 0 && (
            <Text type="secondary">No hours set — click Add Row to add trading hours.</Text>
          )}
          {hours.map((h, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
              <Input
                placeholder="Day (e.g. Monday – Friday)"
                value={h.day}
                onChange={(e) => updateHour(i, 'day', e.target.value)}
                style={{ flex: 2 }}
              />
              <Input
                placeholder="Hours (e.g. 7:00 AM – 6:00 PM)"
                value={h.time}
                onChange={(e) => updateHour(i, 'time', e.target.value)}
                style={{ flex: 2 }}
              />
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => removeHour(i)}
              />
            </div>
          ))}
        </Card>
      </Form>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" size="large" loading={isPending} onClick={handleSave}
          style={{ background: '#CC3A20', borderColor: '#CC3A20' }}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
