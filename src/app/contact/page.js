import NavbarServer from '../components/shared/NavbarServer';
import Footer from '../components/shared/Footer';
import ContactForm from '../components/contact/ContactForm';
import ShopInfoCard from '../components/contact/ShopInfoCard';
import { getShopInfo } from '@/lib/shopInfo';
import { getSection } from '@/lib/content';

export const metadata = {
  title: 'Contact Us – Salam Small Goods',
  description: 'Get in touch with Salam Small Goods for enquiries, bulk orders, or to find us.',
};

export default async function ContactPage() {
  const [shopInfo, banner] = await Promise.all([
    getShopInfo(),
    getSection('contact', 'pageBanner'),
  ]);

  const emoji = banner.emoji ?? '📞';
  const title = banner.title ?? 'Get In Touch';
  const description = banner.description ?? "Enquiries, bulk orders, or just a chat — we'd love to hear from you.";

  return (
    <>
      <NavbarServer />
      <main>
        <section style={{ padding: '48px 24px 0' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="clay-banner" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{emoji}</div>
              <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#ffffff', margin: '0 0 10px', textShadow: '2px 2px 0px rgba(0,0,0,0.15)' }}>
                {title}
              </h1>
              <p style={{ color: '#fff8f0', fontSize: 16, margin: 0, opacity: 0.9 }}>{description}</p>
            </div>
          </div>
        </section>

        <section style={{ padding: '48px 24px 80px' }}>
          <div className="contact-grid" style={{ maxWidth: 1100, margin: '0 auto' }}>
            <ContactForm />
            <ShopInfoCard shopInfo={shopInfo} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
