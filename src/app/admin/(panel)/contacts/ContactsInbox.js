'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Button, Typography, App } from 'antd';
import { useRouter } from 'next/navigation';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const STATUS_STYLE = {
  new:     { background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D' },
  read:    { background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' },
  replied: { background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' },
};
const STATUS_LABEL = { new: 'New', read: 'Read', replied: 'Replied' };

const FILTERS = [
  { key: 'all',     label: 'All' },
  { key: 'new',     label: 'New' },
  { key: 'read',    label: 'Read' },
  { key: 'replied', label: 'Replied' },
];

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] ?? { background: '#F5F5F5', color: '#888', border: '1px solid #ddd' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 700,
      ...s,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: 'currentColor', flexShrink: 0,
      }} />
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

export default function ContactsInbox() {
  const { message } = App.useApp();
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeFilter, setFilter]     = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/contacts?status=all');
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch {
      message.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = useMemo(() =>
    activeFilter === 'all'
      ? submissions
      : submissions.filter((s) => s.status === activeFilter),
    [submissions, activeFilter]
  );

  const counts = useMemo(() => ({
    new:     submissions.filter((s) => s.status === 'new').length,
    read:    submissions.filter((s) => s.status === 'read').length,
    replied: submissions.filter((s) => s.status === 'replied').length,
  }), [submissions]);

  const columns = [
    {
      title: 'Sender',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      onCell: () => ({ style: { paddingLeft: 20 } }),
      onHeaderCell: () => ({ style: { paddingLeft: 20 } }),
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(145deg, #F5E4C4, #E8C098)',
            border: '1.5px solid #E8C098',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 15, color: '#7A5040',
          }}>
            {name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: record.status === 'new' ? 700 : 600, fontSize: 14, color: '#2A0D04' }}>
              {name}
            </div>
            <div style={{ fontSize: 12, color: '#9A8070', marginTop: 1 }}>
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      ellipsis: true,
      render: (s) => s
        ? <Text style={{ fontSize: 13 }}>{s}</Text>
        : <Text type="secondary" style={{ fontSize: 13, fontStyle: 'italic' }}>No subject</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: (s) => <StatusBadge status={s} />,
      filters: FILTERS.slice(1).map((f) => ({ text: f.label, value: f.key })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Received',
      dataIndex: 'createdAt',
      width: 180,
      render: (d) => <Text style={{ fontSize: 13, color: '#7A5040' }}>{formatDate(d)}</Text>,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: 'descend',
    },
    {
      title: '',
      width: 90,
      render: (_, record) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={(e) => { e.stopPropagation(); router.push(`/admin/contacts/${record.id}`); }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: '#2A0D04' }}>Contact Submissions</Title>
          <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
            {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
            {counts.new > 0 && (
              <span style={{ marginLeft: 8, fontWeight: 700, color: '#92400E' }}>
                · {counts.new} unread
              </span>
            )}
          </Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} style={{ borderRadius: 8 }}>
          Refresh
        </Button>
      </div>

      {/* Table card */}
      <div style={{ background: '#FFFAF2', borderRadius: 16, border: '1.5px solid #E8C098', overflow: 'hidden' }}>

        {/* Filter toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '12px 20px', borderBottom: '1.5px solid #E8C098',
        }}>
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.key;
            const count    = f.key === 'all' ? submissions.length : counts[f.key];
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 14px', borderRadius: 20, cursor: 'pointer', border: 'none',
                  fontWeight: isActive ? 700 : 500, fontSize: 13,
                  background: isActive ? '#CC3A20' : 'transparent',
                  color: isActive ? '#fff' : '#7A5040',
                  transition: 'all 0.15s',
                }}
              >
                {f.label}
                {count > 0 && (
                  <span style={{
                    minWidth: 18, height: 18, borderRadius: 9, padding: '0 5px',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, lineHeight: 1,
                    background: isActive ? 'rgba(255,255,255,0.25)' : '#F0DDB8',
                    color: isActive ? '#fff' : '#7A5040',
                  }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 20, showSizeChanger: false, hideOnSinglePage: true }}
          size="middle"
          style={{ margin: 0 }}
          className="products-table"
          onRow={(record) => ({
            style: {
              cursor: 'pointer',
              background: record.status === 'new' ? '#FFFDF7' : undefined,
            },
            onClick: () => router.push(`/admin/contacts/${record.id}`),
          })}
        />
      </div>
    </div>
  );
}
