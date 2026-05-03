import NavbarServer from '../components/shared/NavbarServer';
import Footer from '../components/shared/Footer';
import AboutHero from '../components/about/AboutHero';
import OurStory from '../components/about/OurStory';
import OurValues from '../components/about/OurValues';
import { getSection } from '@/lib/content';

export const metadata = {
  title: 'About Us – Salam Small Goods',
  description: 'Learn about Salam Small Goods — a family-owned halal butcher in Broadmeadows VIC, serving the community since 1998.',
};

export default async function AboutPage() {
  const [heroContent, storyContent, valuesContent] = await Promise.all([
    getSection('about', 'aboutHero'),
    getSection('about', 'ourStory'),
    getSection('about', 'ourValues'),
  ]);

  return (
    <>
      <NavbarServer />
      <main>
        <AboutHero content={heroContent} />
        <OurStory content={storyContent} />
        <OurValues content={valuesContent} />
      </main>
      <Footer />
    </>
  );
}
