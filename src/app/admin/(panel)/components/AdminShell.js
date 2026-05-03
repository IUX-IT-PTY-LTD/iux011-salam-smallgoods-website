'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined,
  EditOutlined,
  ShoppingOutlined,
  TagsOutlined,
  ShopOutlined,
  BgColorsOutlined,
  MailOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Sider, Header, Content } = Layout;

const menuItems = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/admin/content', icon: <EditOutlined />, label: 'Content' },
  { key: '/admin/products', icon: <ShoppingOutlined />, label: 'Products' },
  { key: '/admin/categories', icon: <TagsOutlined />, label: 'Categories' },
  { key: '/admin/shop-info', icon: <ShopOutlined />, label: 'Shop Info' },
  { key: '/admin/design', icon: <BgColorsOutlined />, label: 'Design' },
  { key: '/admin/contacts', icon: <MailOutlined />, label: 'Contacts' },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const activeKey =
    menuItems.find(
      (item) => pathname === item.key || pathname.startsWith(item.key + '/')
    )?.key ?? menuItems[0].key;

  async function handleLogout() {
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.push('/admin/login');
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={220}
        style={{ background: '#1A0804' }}
      >
        {/* Brand */}
        <div
          style={{
            padding: collapsed ? '18px 12px' : '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 8,
            minHeight: 64,
          }}
        >
          <span style={{ fontSize: 22, flexShrink: 0 }}>🥩</span>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#EDD5B0', lineHeight: 1.2 }}>
                Salam Admin
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: '#CC3A20',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Control Panel
              </div>
            </div>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          theme="dark"
          style={{ background: '#1A0804', border: 'none', fontSize: 14 }}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: (
              <Link href={item.key} style={{ color: 'inherit' }}>
                {item.label}
              </Link>
            ),
          }))}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#2A1208',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 56,
            lineHeight: '56px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: '#B89070', fontSize: 16 }}
          />
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ color: '#B89070', fontSize: 13 }}
          >
            Sign Out
          </Button>
        </Header>

        <Content style={{ background: '#E8D0A8', minHeight: 'calc(100vh - 56px)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
