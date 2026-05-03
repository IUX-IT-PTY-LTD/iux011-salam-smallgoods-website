'use client';

import { useState, useTransition } from 'react';
import { Form, Input, Button, App, Typography, Upload, Space } from 'antd';
import {
  SaveOutlined, PlusOutlined, DeleteOutlined,
  ShopOutlined, PhoneOutlined, MailOutlined, HomeOutlined,
  FacebookOutlined, InstagramOutlined, UploadOutlined,
} from '@ant-design/icons';
import { updateShopInfo } from '@/app/actions/shopInfo';

const { Title, Text } = Typography;
const { TextArea } = Input;

// ─── Section definitions ──────────────────────────────────────────────────────

const SECTIONS = [
  { key: 'basic',   label: 'Basic Info' },
  { key: 'contact', label: 'Contact' },
  { key: 'social',  label: 'Social Media' },
  { key: 'hours',   label: 'Trading Hours' },
];

const FIELD_SECTION = {
  name: 'basic', tagline: 'basic', description: 'basic',
  address: 'contact', phone: 'contact', email: 'contact',
  facebook: 'social', instagram: 'social',
};

// ─── ShopInfoForm ─────────────────────────────────────────────────────────────

export default function ShopInfoForm({ initialData }) {
  const { message } = App.useApp();
  const [form]   = Form.useForm();
  const [hours, setHours]           = useState(initialData?.hours ?? []);
  const [activeSection, setActive]  = useState('basic');
  const [dirtySections, setDirty]   = useState({});
  const [isPending, startTransition] = useTransition();
  const [logoUrl, setLogoUrl]               = useState(initialData?.logoUrl ?? '');
  const [logoPublicId, setLogoPublicId]     = useState(initialData?.logoPublicId ?? '');
  const [logoUploading, setLogoUploading]   = useState(false);

  const isAnyDirty = Object.values(dirtySections).some(Boolean);

  function markDirty(sectionKey) {
    setDirty((prev) => ({ ...prev, [sectionKey]: true }));
  }

  function onValuesChange(changedValues) {
    const touched = [...new Set(
      Object.keys(changedValues).map((k) => FIELD_SECTION[k]).filter(Boolean)
    )];
    setDirty((prev) => {
      const next = { ...prev };
      for (const s of touched) next[s] = true;
      return next;
    });
  }

  async function handleLogoUpload({ file, onSuccess, onError }) {
    setLogoUploading(true);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'salam-smallgoods/branding' }),
      });
      const { signature, timestamp, cloudName, apiKey, folder } = await res.json();
      const fd = new FormData();
      fd.append('file', file);
      fd.append('signature', signature);
      fd.append('timestamp', timestamp);
      fd.append('api_key', apiKey);
      fd.append('folder', folder);
      const up = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: fd });
      const result = await up.json();
      setLogoUrl(result.secure_url);
      setLogoPublicId(result.public_id);
      markDirty('basic');
      onSuccess?.(result);
    } catch (err) {
      message.error('Logo upload failed');
      onError?.(err);
    } finally {
      setLogoUploading(false);
    }
  }

  function addHour() {
    setHours((prev) => [...prev, { day: '', time: '', order: prev.length }]);
    markDirty('hours');
  }

  function removeHour(index) {
    setHours((prev) => prev.filter((_, i) => i !== index));
    markDirty('hours');
  }

  function updateHour(index, field, value) {
    setHours((prev) => prev.map((h, i) => i === index ? { ...h, [field]: value } : h));
    markDirty('hours');
  }

  async function handleSave() {
    let values;
    try { values = await form.validateFields(); } catch { return; }

    startTransition(async () => {
      try {
        await updateShopInfo({
          name:        values.name,
          tagline:     values.tagline,
          description: values.description,
          address:     values.address,
          phone:       values.phone,
          email:       values.email,
          hours:       hours.map((h, i) => ({ ...h, order: i })),
          social: {
            facebook:  values.facebook ?? '',
            instagram: values.instagram ?? '',
          },
          logoUrl,
          logoPublicId,
        });
        setDirty({});
        message.success('Shop info saved');
      } catch (err) {
        message.error(err.message || 'Save failed');
      }
    });
  }

  const activeLabel    = SECTIONS.find((s) => s.key === activeSection)?.label ?? '';
  const isSectionDirty = dirtySections[activeSection] ?? false;

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#2A0D04' }}>Shop Info</Title>
        <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
          Select a section from the left to edit its content. Changes are only published when you click Save.
        </Text>
      </div>

      {/* Two-panel card */}
      <div style={{ background: '#FFFAF2', borderRadius: 16, border: '1.5px solid #E8C098', overflow: 'hidden' }}>
        <div style={{ display: 'flex', minHeight: 520 }}>

          {/* ── Sidebar ── */}
          <div style={{ width: 200, flexShrink: 0, borderRight: '1.5px solid #E8C098', paddingTop: 4 }}>
            {SECTIONS.map((s) => {
              const isActive = activeSection === s.key;
              const isDirty  = dirtySections[s.key];
              return (
                <button
                  key={s.key}
                  onClick={() => setActive(s.key)}
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    background: isActive ? '#F5E4C4' : 'transparent',
                    borderTop: 'none', borderRight: 'none', borderBottom: 'none',
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
                    {s.label}
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

          {/* ── Right panel ── */}
          <div style={{ flex: 1, padding: '24px 32px', minWidth: 0, maxWidth: 680 }}>

            {/* Section header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              paddingBottom: 18, marginBottom: 24, borderBottom: '2px solid #E8C098',
            }}>
              <div>
                <Title level={4} style={{ margin: 0, color: '#2A0D04' }}>{activeLabel}</Title>
                {isSectionDirty ? (
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
                loading={isPending}
                onClick={handleSave}
                disabled={!isAnyDirty && !isPending}
                style={{
                  borderRadius: 8, fontWeight: 600,
                  background: isAnyDirty ? '#CC3A20' : undefined,
                  borderColor: isAnyDirty ? '#CC3A20' : undefined,
                }}
              >
                Save changes
              </Button>
            </div>

            {/* ── Basic Info ── */}
            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              onValuesChange={onValuesChange}
              initialValues={{
                name:        initialData?.name,
                tagline:     initialData?.tagline,
                description: initialData?.description,
                address:     initialData?.address,
                phone:       initialData?.phone,
                email:       initialData?.email,
                facebook:    initialData?.social?.facebook,
                instagram:   initialData?.social?.instagram,
              }}
            >
              {activeSection === 'basic' && (
                <>
                  {/* ── Logo ── */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontWeight: 600, color: '#2A0D04', fontSize: 14, marginBottom: 8 }}>Logo</div>
                    {logoUrl ? (
                      <div>
                        <div style={{
                          display: 'inline-block', padding: 10, marginBottom: 10,
                          borderRadius: 10, border: '1.5px solid #E8C098', background: '#FFFAF2',
                        }}>
                          <img src={logoUrl} alt="Logo" style={{ height: 56, maxWidth: 200, objectFit: 'contain', display: 'block' }} />
                        </div>
                        <Space>
                          <Upload showUploadList={false} customRequest={handleLogoUpload} accept="image/*">
                            <Button size="small" icon={<UploadOutlined />} loading={logoUploading}>Replace</Button>
                          </Upload>
                          <Button size="small" danger onClick={() => { setLogoUrl(''); setLogoPublicId(''); markDirty('basic'); }}>Remove</Button>
                        </Space>
                      </div>
                    ) : (
                      <Upload.Dragger
                        showUploadList={false}
                        customRequest={handleLogoUpload}
                        accept="image/*"
                        style={{ borderRadius: 10, background: '#FFFAF2', borderColor: '#C4956A', maxWidth: 320 }}
                      >
                        <div style={{ padding: '12px 0' }}>
                          <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
                          <p style={{ fontWeight: 600, color: '#2A0D04', margin: 0, fontSize: 13 }}>
                            {logoUploading ? 'Uploading…' : 'Drop logo here, or click to browse'}
                          </p>
                          <p style={{ fontSize: 11, color: '#7A5040', margin: '4px 0 0' }}>PNG or SVG recommended</p>
                        </div>
                      </Upload.Dragger>
                    )}
                  </div>

                  <Form.Item
                    name="name"
                    label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>Shop Name</span>}
                    rules={[{ required: true, message: 'Shop name is required' }]}
                  >
                    <Input
                      prefix={<ShopOutlined style={{ color: '#C4956A' }} />}
                      placeholder="e.g. Salam Small Goods"
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="tagline"
                    label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>Tagline</span>}
                  >
                    <Input placeholder="e.g. Fresh · Halal · Quality" style={{ borderRadius: 8 }} />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>Description</span>}
                    style={{ marginBottom: 0 }}
                  >
                    <TextArea rows={4} placeholder="Short description of the business…" style={{ borderRadius: 8 }} />
                  </Form.Item>
                </>
              )}

              {/* ── Contact ── */}
              {activeSection === 'contact' && (
                <>
                  <Form.Item
                    name="address"
                    label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>Address</span>}
                    rules={[{ required: true, message: 'Address is required' }]}
                  >
                    <Input
                      prefix={<HomeOutlined style={{ color: '#C4956A' }} />}
                      placeholder="e.g. 123 Main St, Broadmeadows VIC 3047"
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item
                      name="phone"
                      label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>Phone</span>}
                      style={{ marginBottom: 0 }}
                    >
                      <Input
                        prefix={<PhoneOutlined style={{ color: '#C4956A' }} />}
                        placeholder="(03) 9000 0000"
                        style={{ borderRadius: 8 }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>Email</span>}
                      style={{ marginBottom: 0 }}
                    >
                      <Input
                        prefix={<MailOutlined style={{ color: '#C4956A' }} />}
                        type="email"
                        placeholder="hello@salamsmallgoods.com.au"
                        style={{ borderRadius: 8 }}
                      />
                    </Form.Item>
                  </div>
                </>
              )}

              {/* ── Social Media ── */}
              {activeSection === 'social' && (
                <>
                  <Form.Item
                    name="facebook"
                    label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>Facebook URL</span>}
                  >
                    <Input
                      prefix={<FacebookOutlined style={{ color: '#C4956A' }} />}
                      placeholder="https://facebook.com/…"
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="instagram"
                    label={<span style={{ fontWeight: 600, color: '#2A0D04' }}>Instagram URL</span>}
                    style={{ marginBottom: 0 }}
                  >
                    <Input
                      prefix={<InstagramOutlined style={{ color: '#C4956A' }} />}
                      placeholder="https://instagram.com/…"
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>
                </>
              )}
            </Form>

            {/* ── Trading Hours (outside Form — managed via state) ── */}
            {activeSection === 'hours' && (
              <div>
                {hours.length === 0 && (
                  <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 16 }}>
                    No trading hours set yet — click the button below to add a row.
                  </Text>
                )}
                {hours.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                      background: '#F0DDB8', border: '1px solid #E8C098',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: '#7A5040',
                    }}>
                      {i + 1}
                    </div>
                    <Input
                      placeholder="Day — e.g. Monday – Friday"
                      value={h.day}
                      onChange={(e) => updateHour(i, 'day', e.target.value)}
                      style={{ flex: 2, borderRadius: 8 }}
                    />
                    <Input
                      placeholder="Hours — e.g. 7:00 AM – 6:00 PM"
                      value={h.time}
                      onChange={(e) => updateHour(i, 'time', e.target.value)}
                      style={{ flex: 2, borderRadius: 8 }}
                    />
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeHour(i)}
                      style={{ flexShrink: 0 }}
                    />
                  </div>
                ))}
                <Button
                  icon={<PlusOutlined />}
                  onClick={addHour}
                  style={{
                    marginTop: 4, borderRadius: 8, borderStyle: 'dashed',
                    color: '#7A5040', borderColor: '#C4956A',
                  }}
                >
                  Add trading hours row
                </Button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
