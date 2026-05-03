'use client';

import { useState, useEffect, use } from 'react';
import { Button, Input, Typography, App, Spin } from 'antd';
import { ArrowLeftOutlined, SendOutlined, PhoneOutlined, CalendarOutlined, MailOutlined, TagOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Text } = Typography;
const { TextArea } = Input;

const STATUS_STYLE = {
  new:     { background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D' },
  read:    { background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' },
  replied: { background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' },
};
const STATUS_LABEL = { new: 'New', read: 'Read', replied: 'Replied' };

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] ?? { background: '#F5F5F5', color: '#888', border: '1px solid #ddd' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, ...s,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-AU', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Chat bubbles ─────────────────────────────────────────────────────────────

function IncomingBubble({ name, message, timestamp }) {
  return (
    <div style={{ display: 'flex', gap: 10, maxWidth: '72%', alignSelf: 'flex-start' }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0, alignSelf: 'flex-end',
        background: 'linear-gradient(145deg, #F5E4C4, #E8C098)',
        border: '1.5px solid #D4A870',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 14, color: '#7A5040',
      }}>
        {name?.[0]?.toUpperCase() ?? '?'}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#9A8070', marginBottom: 5 }}>{name}</div>
        <div style={{
          background: '#FFFAF2',
          border: '1.5px solid #E8C098',
          borderRadius: '4px 18px 18px 18px',
          padding: '12px 16px',
          fontSize: 14, lineHeight: 1.75, color: '#2A0D04',
          whiteSpace: 'pre-wrap',
          boxShadow: '2px 2px 0px #E8C09850',
        }}>
          {message}
        </div>
        <div style={{ fontSize: 11, color: '#B0A090', marginTop: 5 }}>{timestamp}</div>
      </div>
    </div>
  );
}

function OutgoingBubble({ message, timestamp }) {
  return (
    <div style={{ display: 'flex', gap: 10, maxWidth: '72%', alignSelf: 'flex-end', flexDirection: 'row-reverse' }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0, alignSelf: 'flex-end',
        background: '#CC3A20',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800, color: '#fff',
      }}>
        You
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#9A8070', marginBottom: 5 }}>You</div>
        <div style={{
          background: 'linear-gradient(145deg, #CC3A20, #A83020)',
          borderRadius: '18px 4px 18px 18px',
          padding: '12px 16px',
          fontSize: 14, lineHeight: 1.75, color: '#fff',
          whiteSpace: 'pre-wrap',
          boxShadow: '2px 2px 0px #7A200888',
          textAlign: 'left',
        }}>
          {message}
        </div>
        <div style={{ fontSize: 11, color: '#B0A090', marginTop: 5 }}>{timestamp}</div>
      </div>
    </div>
  );
}

// ─── ContactDetail ────────────────────────────────────────────────────────────

export default function ContactDetail({ params }) {
  const { id } = use(params);
  const { message } = App.useApp();
  const router = useRouter();
  const [submission, setSubmission]     = useState(null);
  const [loading, setLoading]           = useState(true);
  const [replyBody, setReplyBody]       = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [sending, setSending]           = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch(`/api/admin/contacts/${id}`);
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
        body: JSON.stringify({
          body:    replyBody,
          subject: replySubject || `Re: ${submission?.subject || 'Your enquiry'}`,
        }),
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

  if (loading) {
    return (
      <div style={{ padding: '28px 32px', display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div style={{ padding: '28px 32px' }}>
        <Text type="secondary">Submission not found.</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '44px 32px 32px' }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/admin/contacts')}
          style={{ borderRadius: 8, flexShrink: 0 }}
        >
          Inbox
        </Button>
        <Text style={{ fontWeight: 700, fontSize: 18, color: '#2A0D04' }}>
          Message from {submission.name}
        </Text>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* ── Left: Chat panel ── */}
        <div style={{
          flex: 1, minWidth: 0,
          background: '#FFFAF2', borderRadius: 16,
          border: '1.5px solid #E8C098', overflow: 'hidden',
        }}>

          {/* Message thread */}
          <div style={{
            padding: '24px 20px',
            display: 'flex', flexDirection: 'column', gap: 20,
            minHeight: 320,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 39px, #F5E4C420 39px, #F5E4C420 40px)',
          }}>
            <IncomingBubble
              name={submission.name}
              message={submission.message}
              timestamp={formatDate(submission.createdAt)}
            />
            {submission.replies?.map((reply, i) => (
              <OutgoingBubble
                key={i}
                message={reply.body}
                timestamp={formatDate(reply.sentAt)}
              />
            ))}
          </div>

          {/* Compose area */}
          <div style={{ borderTop: '1.5px solid #E8C098', padding: '20px 24px' }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#CC3A20',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
            }}>
              Reply to {submission.name}
            </div>
            <Input
              placeholder={`Re: ${submission.subject || 'Your enquiry'}`}
              value={replySubject}
              onChange={(e) => setReplySubject(e.target.value)}
              style={{ borderRadius: 8, marginBottom: 10 }}
            />
            <TextArea
              rows={5}
              placeholder={`Hi ${submission.name},\n\nThank you for reaching out…`}
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              style={{ borderRadius: 8, marginBottom: 12 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, color: '#9A8070' }}>Sending to {submission.email}</Text>
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={sending}
                onClick={handleSendReply}
                style={{ background: '#CC3A20', borderColor: '#CC3A20', borderRadius: 8, fontWeight: 600 }}
              >
                Send Reply
              </Button>
            </div>
          </div>
        </div>

        {/* ── Right: Info sidebar ── */}
        <div style={{ width: 264, flexShrink: 0, position: 'sticky', top: 24 }}>
          <div style={{
            background: '#FFFAF2', borderRadius: 16,
            border: '1.5px solid #E8C098', overflow: 'hidden',
          }}>

            {/* Status */}
            <div style={{
              padding: '14px 20px', borderBottom: '1.5px solid #E8C098',
              background: 'linear-gradient(145deg, #FFF8EE, #FFFAF2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <Text style={{ fontSize: 12, fontWeight: 700, color: '#9A8070', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Status
              </Text>
              <StatusBadge status={submission.status} />
            </div>

            {/* Avatar + name */}
            <div style={{
              padding: '20px 20px 16px',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              borderBottom: '1.5px solid #F0DDB8', textAlign: 'center',
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: 16, marginBottom: 12,
                background: 'linear-gradient(145deg, #F5E4C4, #E8C098)',
                border: '1.5px solid #D4A870',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 24, color: '#7A5040',
                boxShadow: '2px 2px 0px #D4A87888',
              }}>
                {submission.name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <Text style={{ fontWeight: 700, fontSize: 15, color: '#2A0D04', display: 'block' }}>
                {submission.name}
              </Text>
            </div>

            {/* Detail rows */}
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <MailOutlined style={{ fontSize: 13, color: '#C4956A', marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9A8070', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Email</div>
                  <Text style={{ fontSize: 13, color: '#2A0D04', wordBreak: 'break-all' }}>{submission.email}</Text>
                </div>
              </div>

              {submission.phone && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <PhoneOutlined style={{ fontSize: 13, color: '#C4956A', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9A8070', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Phone</div>
                    <Text style={{ fontSize: 13, color: '#2A0D04' }}>{submission.phone}</Text>
                  </div>
                </div>
              )}

              {submission.subject && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <TagOutlined style={{ fontSize: 13, color: '#C4956A', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9A8070', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Subject</div>
                    <Text style={{ fontSize: 13, color: '#2A0D04' }}>{submission.subject}</Text>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <CalendarOutlined style={{ fontSize: 13, color: '#C4956A', marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9A8070', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Received</div>
                  <Text style={{ fontSize: 13, color: '#2A0D04' }}>{formatDate(submission.createdAt)}</Text>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
