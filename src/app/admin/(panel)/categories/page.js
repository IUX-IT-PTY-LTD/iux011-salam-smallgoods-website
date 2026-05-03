import { getCategories, getProducts } from '@/lib/products';
import CategoriesManager from './CategoriesManager';

export const metadata = { title: 'Categories – Admin' };

export default async function AdminCategoriesPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const productCounts = {};
  for (const p of products) {
    productCounts[p.categorySlug] = (productCounts[p.categorySlug] ?? 0) + 1;
  }
  return <CategoriesManager initialCategories={categories} productCounts={productCounts} />;
}
