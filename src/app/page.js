import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import Hero from './components/home/Hero';
import FeaturedProducts from './components/home/FeaturedProducts';
import WhyChooseUs from './components/home/WhyChooseUs';
import AboutSnippet from './components/home/AboutSnippet';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedProducts />
        <WhyChooseUs />
        <AboutSnippet />
      </main>
      <Footer />
    </>
  );
}
