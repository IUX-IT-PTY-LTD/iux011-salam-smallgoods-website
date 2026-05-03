import AdminShell from './components/AdminShell';

export const metadata = {
  title: 'Admin — Salam Small Goods',
  robots: 'noindex, nofollow',
};

export default function PanelLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
