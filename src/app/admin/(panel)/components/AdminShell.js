'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu, Button, App } from 'antd';
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

export default function AdminShell({ children, logoUrl }) {
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
    <App>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={220}
        style={{ background: '#1A0804' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Logo */}
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '20px 0',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 8,
          }}>
            {logoUrl
              ? <div style={{ position: 'relative', width: collapsed ? 40 : 72, height: collapsed ? 40 : 72, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, transition: 'width 0.2s, height 0.2s' }}>
                  <Image src={logoUrl} alt="Logo" fill priority style={{ objectFit: 'cover', objectPosition: 'center' }} />
                </div>
              : <span style={{ fontSize: collapsed ? 22 : 32 }}>🥩</span>
            }
          </div>

          {/* Nav menu */}
          <Menu
            mode="inline"
            selectedKeys={[activeKey]}
            theme="dark"
            style={{ background: '#1A0804', border: 'none', fontSize: 14, flex: 1 }}
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

          {/* Footer */}
          {!collapsed && (
            <div style={{
              padding: '14px 16px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center',
              fontSize: 11,
              color: 'rgba(255,255,255,0.3)',
              lineHeight: 1.5,
            }}>
              Developed by<br />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}><a href='https://iuxit.com.au/'>IUX IT Pty Ltd</a> </span>
              <br />
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>v1.0.0</span>
            </div>
          )}

        </div>
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
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ fontSize: 13 }}
          >
            Sign Out
          </Button>
        </Header>

        <Content style={{ background: '#E8D0A8', minHeight: 'calc(100vh - 56px)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
    </App>
  );
}
