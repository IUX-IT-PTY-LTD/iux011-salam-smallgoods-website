'use client';

import { useState, useEffect, use } from 'react';
import {
  Card, Tag, Button, Input, Typography, Divider, App, Space, Descriptions, Spin,
} from 'antd';
import { ArrowLeftOutlined, SendOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;
const { TextArea } = Input;

const STATUS_COLORS = { new: 'red', read: 'blue', replied: 'green' };

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-AU', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function ContactDetail({ params }) {
  const { id } = use(params);
  const { message } = App.useApp();
  const router = useRouter();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyBody, setReplyBody] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/contacts/${id}`);
        const data = await res.json();
        setSubmission(data);
        if (data.status === 'new') {
          await fetch(`/api/admin/contacts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'read' }),
          });
          setSubmission((s) => s ? { ...s, status: 'read' } : s);
        }
      } catch {
        message.error('Failed to load submission');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, message]);

  async function handleSendReply() {
    if (!replyBody.trim()) { message.warning('Reply body cannot be empty'); return; }
    setSending(true);
    try {
      const res = await fetch(`/api/admin/contacts/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: replyBody, subject: replySubject || `Re: ${submission?.subject || 'Your enquiry'}` }),
      });
      if (!res.ok) throw new Error('Send failed');
      const { sentAt } = await res.json();
      setSubmission((s) => ({
        ...s,
        status: 'replied',
        replies: [...(s.replies ?? []), { body: replyBody, sentAt }],
      }));
      setReplyBody('');
      setReplySubject('');
      message.success('Reply sent');
    } catch (err) {
      message.error(err.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  if (!submission) return <div>Submission not found.</div>;

  return (
    <div style={{ maxWidth: 780 }}>
      <Space style={{ marginBottom: 20 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/admin/contacts')}>
          Back to Inbox
        </Button>
        <Tag color={STATUS_COLORS[submission.status] ?? 'default'} style={{ fontSize: 13 }}>
          {submission.status?.toUpperCase()}
        </Tag>
      </Space>

      <Card style={{ marginBottom: 20 }}>
        <Descriptions column={1} size="small">
          <Descriptions.Item label="From">{submission.name} &lt;{submission.email}&gt;</Descriptions.Item>
          {submission.phone && <Descriptions.Item label="Phone">{submission.phone}</Descriptions.Item>}
          {submission.subject && <Descriptions.Item label="Subject">{submission.subject}</Descriptions.Item>}
          <Descriptions.Item label="Received">{formatDate(submission.createdAt)}</Descriptions.Item>
        </Descriptions>
        <Divider style={{ margin: '16px 0' }} />
        <Text style={{ fontSize: 15, lineHeight: 1.75, whiteSpace: 'pre-wrap', display: 'block' }}>
          {submission.message}
        </Text>
      </Card>

      {submission.replies?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <Title level={5} style={{ marginBottom: 12 }}>Reply Thread</Title>
          {submission.replies.map((reply, i) => (
            <Card
              key={i}
              size="small"
              style={{ marginBottom: 10, background: '#F5E4C4', borderColor: '#D4A870' }}
            >
              <div style={{ fontSize: 12, color: '#7A5040', marginBottom: 8 }}>
                Sent {formatDate(reply.sentAt)}
              </div>
              <Text style={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>{reply.body}</Text>
            </Card>
          ))}
        </div>
      )}

      <Card title="Send Reply">
        <Input
          placeholder="Subject (optional)"
          value={replySubject}
          onChange={(e) => setReplySubject(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <TextArea
          rows={5}
          placeholder={`Hi ${submission.name},\n\nThank you for reaching out...`}
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          loading={sending}
          onClick={handleSendReply}
          style={{ background: '#CC3A20', borderColor: '#CC3A20' }}
        >
          Send Reply to {submission.email}
        </Button>
      </Card>
    </div>
  );
}
