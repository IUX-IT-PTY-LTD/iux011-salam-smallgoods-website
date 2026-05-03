import NavbarServer from './components/shared/NavbarServer';
import Footer from './components/shared/Footer';
import Hero from './components/home/Hero';
import HomeCategories from './components/home/HomeCategories';
import WhyChooseUs from './components/home/WhyChooseUs';
import AboutSnippet from './components/home/AboutSnippet';
import { getCategories, getProducts } from '@/lib/products';
import { getSection } from '@/lib/content';

export default async function Home() {
  const [categories, products, heroContent, homeCatsContent, whyContent, aboutSnippetContent] = await Promise.all([
    getCategories(),
    getProducts(),
    getSection('home', 'hero'),
    getSection('home', 'homeCategories'),
    getSection('home', 'whyChooseUs'),
    getSection('home', 'aboutSnippet'),
  ]);

  const productCounts = Object.fromEntries(
    categories.map((c) => [c.slug, products.filter((p) => p.categorySlug === c.slug).length])
  );

  return (
    <>
      <NavbarServer />
      <main>
        <Hero content={heroContent} />
        <HomeCategories categories={categories} productCounts={productCounts} content={homeCatsContent} />
        <WhyChooseUs content={whyContent} />
        <AboutSnippet content={aboutSnippetContent} />
      </main>
      <Footer />
    </>
  );
}
