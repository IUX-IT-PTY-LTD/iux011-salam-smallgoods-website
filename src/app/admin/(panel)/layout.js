import AdminShell from './components/AdminShell';
import { getShopInfo } from '@/lib/shopInfo';

export const metadata = {
  title: 'Admin — Salam Small Goods',
  robots: 'noindex, nofollow',
};

export default async function PanelLayout({ children }) {
  const shopInfo = await getShopInfo();
  return <AdminShell logoUrl={shopInfo?.logoUrl ?? null}>{children}</AdminShell>;
}
