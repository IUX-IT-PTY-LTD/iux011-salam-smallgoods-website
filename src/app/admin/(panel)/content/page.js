import { getAdminPageSections } from '@/lib/content';
import ContentEditor from './ContentEditor';

export const metadata = { title: 'Content – Admin' };

const PAGES = ['home', 'about', 'products', 'contact'];

export default async function AdminContentPage() {
  const allData = {};
  await Promise.all(
    PAGES.map(async (page) => {
      allData[page] = await getAdminPageSections(page);
    })
  );
  return <ContentEditor initialData={allData} />;
}
