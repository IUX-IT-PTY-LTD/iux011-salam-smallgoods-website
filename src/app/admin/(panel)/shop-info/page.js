import { getShopInfo } from '@/lib/shopInfo';
import ShopInfoForm from './ShopInfoForm';

export const metadata = { title: 'Shop Info – Admin' };

export default async function AdminShopInfoPage() {
  const shopInfo = await getShopInfo();
  return <ShopInfoForm initialData={shopInfo} />;
}
