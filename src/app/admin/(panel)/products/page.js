import { getProducts, getCategories } from '@/lib/products';
import ProductsManager from './ProductsManager';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Products – Admin' };

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return <ProductsManager initialProducts={products} categories={categories} />;
}
