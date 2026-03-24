import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import Hero from './components/home/Hero';
import HomeCategories from './components/home/HomeCategories';
import WhyChooseUs from './components/home/WhyChooseUs';
import AboutSnippet from './components/home/AboutSnippet';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HomeCategories />
        <WhyChooseUs />
        <AboutSnippet />
      </main>
      <Footer />
    </>
  );
}
