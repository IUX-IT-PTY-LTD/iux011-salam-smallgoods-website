'use client';

import { useState } from 'react';
import { Form, Input, App } from 'antd';

const { TextArea } = Input;

const INPUT_STYLE = {
  borderRadius: 14,
  border: '2px solid #ffeedd',
  background: 'linear-gradient(145deg, #ffffff, #fff8f0)',
  boxShadow: 'inset 2px 2px 6px #ffeedd',
  fontSize: 15,
};

export default function ContactForm() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Failed to send');
      form.resetFields();
      message.success("Message sent! We'll get back to you shortly.");
    } catch {
      message.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="clay-card" style={{ padding: 36 }}>
      <h3 style={{ fontWeight: 800, fontSize: 20, color: '#3d1a0e', marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #ffeedd' }}>
        ✉️ Send Us a Message
      </h3>

      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item
          label={<span style={{ fontWeight: 700, color: '#3d1a0e' }}>Full Name</span>}
          name="name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input placeholder="e.g. Ahmed Al-Salam" size="large" style={INPUT_STYLE} />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 700, color: '#3d1a0e' }}>Email Address</span>}
          name="email"
          rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input placeholder="you@example.com" size="large" style={INPUT_STYLE} />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 700, color: '#3d1a0e' }}>Phone Number</span>}
          name="phone"
        >
          <Input placeholder="04XX XXX XXX" size="large" style={INPUT_STYLE} />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 700, color: '#3d1a0e' }}>Subject</span>}
          name="subject"
        >
          <Input placeholder="e.g. Bulk order enquiry" size="large" style={INPUT_STYLE} />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 700, color: '#3d1a0e' }}>Message</span>}
          name="message"
          rules={[{ required: true, message: 'Please enter your message' }]}
        >
          <TextArea
            placeholder="Tell us what you need — product enquiries, bulk orders, anything!"
            rows={5}
            style={{ ...INPUT_STYLE, resize: 'vertical' }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
          <button
            type="submit"
            className="clay-btn-primary"
            disabled={submitting}
            style={{ width: '100%', fontSize: 16, padding: '14px 28px', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
          >
            {submitting ? 'Sending…' : '📨 Send Message'}
          </button>
        </Form.Item>
      </Form>
    </div>
  );
}
