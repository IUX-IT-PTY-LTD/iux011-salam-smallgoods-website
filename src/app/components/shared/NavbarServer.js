import { getCategories } from '@/lib/products';
import { getShopInfo } from '@/lib/shopInfo';
import Navbar from './Navbar';

export default async function NavbarServer() {
  const [categories, shopInfo] = await Promise.all([getCategories(), getShopInfo()]);
  return <Navbar categories={categories} shopInfo={shopInfo} />;
}
