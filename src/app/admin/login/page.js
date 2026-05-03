'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Alert } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onFinish({ email, password }) {
    setLoading(true);
    setError(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) throw new Error('Session creation failed');
      router.push('/admin/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #1A0804, #2A1208)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: 'linear-gradient(145deg, #FBF0DC, #F5E4C4)',
        borderRadius: 28,
        padding: '44px 40px',
        boxShadow: '10px 10px 0px #A06838, inset 3px 3px 10px #FFFAF2, inset -2px -2px 6px #D4A870',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🥩</div>
          <h1 style={{
            fontSize: 22,
            fontWeight: 900,
            color: '#2A0D04',
            margin: '0 0 6px',
          }}>
            Salam Admin
          </h1>
          <p style={{ color: '#7A5040', fontSize: 13, margin: 0 }}>
            Sign in to manage your website
          </p>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 20, borderRadius: 12 }}
          />
        )}

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="email"
            label={<span style={{ color: '#5A3020', fontWeight: 600, fontSize: 13 }}>Email</span>}
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input
              size="large"
              placeholder="admin@example.com"
              style={{ borderRadius: 12 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ color: '#5A3020', fontWeight: 600, fontSize: 13 }}>Password</span>}
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input.Password
              size="large"
              placeholder="••••••••"
              style={{ borderRadius: 12 }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 8, marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                height: 50,
                borderRadius: 50,
                fontWeight: 700,
                fontSize: 15,
                background: 'linear-gradient(145deg, #CC3A20, #B02808)',
                border: 'none',
                boxShadow: '4px 4px 0px #7A1808, inset 2px 2px 6px #E05030',
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
