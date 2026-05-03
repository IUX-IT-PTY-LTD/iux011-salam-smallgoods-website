import { getCategories } from '@/lib/products';
import Navbar from './Navbar';

export default async function NavbarServer() {
  const categories = await getCategories();
  return <Navbar categories={categories} />;
}
