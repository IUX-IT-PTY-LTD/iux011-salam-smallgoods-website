import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import AboutHero from '../components/about/AboutHero';
import OurStory from '../components/about/OurStory';
import OurValues from '../components/about/OurValues';

export const metadata = {
  title: 'About Us – Salam Small Goods',
  description:
    'Learn about Salam Small Goods — a family-owned halal butcher in Broadmeadows VIC, serving the community since 1998.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <OurStory />
        <OurValues />
      </main>
      <Footer />
    </>
  );
}
