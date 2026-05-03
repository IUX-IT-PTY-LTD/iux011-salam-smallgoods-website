'use client';

import { useState, useEffect, useCallback } from 'react';
import { Table, Tag, Tabs, Typography, Button, App } from 'antd';
import { useRouter } from 'next/navigation';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const STATUS_COLORS = { new: 'red', read: 'blue', replied: 'green' };
const STATUS_LABELS = { new: 'New', read: 'Read', replied: 'Replied' };

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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchData = useCallback(async (status = 'all') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/contacts?status=${status}`);
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch {
      message.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => { fetchData(activeTab); }, [activeTab, fetchData]);

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      width: 90,
      render: (s) => <Tag color={STATUS_COLORS[s] ?? 'default'}>{STATUS_LABELS[s] ?? s}</Tag>,
    },
    { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Email', dataIndex: 'email', ellipsis: true },
    { title: 'Subject', dataIndex: 'subject', ellipsis: true, render: (s) => s || <span style={{ color: '#aaa' }}>—</span> },
    {
      title: 'Received',
      dataIndex: 'createdAt',
      render: (d) => formatDate(d),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: 'descend',
    },
    {
      title: '',
      width: 80,
      render: (_, record) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => router.push(`/admin/contacts/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'new', label: <span>New <Tag color="red" style={{ marginLeft: 4 }}>{submissions.filter(s => s.status === 'new').length || ''}</Tag></span> },
    { key: 'read', label: 'Read' },
    { key: 'replied', label: 'Replied' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Contact Submissions</Title>
        <Button icon={<ReloadOutlined />} onClick={() => fetchData(activeTab)}>Refresh</Button>
      </div>

      <Tabs
        items={tabs}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        style={{ marginBottom: 16 }}
      />

      <Table
        dataSource={submissions}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 20 }}
        size="middle"
        onRow={(record) => ({
          style: { cursor: 'pointer', fontWeight: record.status === 'new' ? 700 : 400 },
          onClick: () => router.push(`/admin/contacts/${record.id}`),
        })}
      />
    </div>
  );
}
