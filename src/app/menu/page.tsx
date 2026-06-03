import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MenuClient from '@/components/MenuClient';

export const metadata: Metadata = {
  title: 'Dine-In Menu - Filbey Fried Chicken & Burgers',
  description:
    'Explore the full dine-in menu of Filbey Fried Chicken & Burgers Chennai. Featuring 100% Halal chicken, dynamite wings, loaded fries, classic burgers, and signature shakes at our dine-in outlet.',
  keywords: [
    'Filbey menu',
    'Filbey dine-in menu',
    'fried chicken menu',
    'halal food menu Chennai',
    'dynamite wings',
    'burgers menu',
    'restaurant menu',
    'shakes',
  ],
  alternates: { canonical: 'https://thefilbey.com/menu' },
  openGraph: {
    url: 'https://thefilbey.com/menu',
    title: 'Dine-In Menu - Filbey Fried Chicken & Burgers',
    description:
      'Explore our full dine-in menu featuring 100% Halal chicken, dynamite wings, loaded fries, classic burgers, and signature shakes.',
    images: [{ url: '/Document.png' }],
  },
};

const menuJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Filbey Fried Chicken & Burgers',
  image: 'https://thefilbey.com/Document.png',
  '@id': 'https://thefilbey.com/',
  url: 'https://thefilbey.com/',
  telephone: '+91 63834 00144',
  servesCuisine: ['Fast Food', 'Fried Chicken', 'Burgers', 'Halal'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'OMR',
    addressLocality: 'Perungudi',
    addressRegion: 'Chennai',
    addressCountry: 'IN',
  },
  menu: 'https://thefilbey.com/menu',
};

export default function MenuPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
      />
      <Navbar isMenuPage />

      <main className="pt-24 pb-margin-desktop">
        {/* Title */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center mb-6 mt-8">
          <h1 className="font-display text-display text-primary uppercase">Our Dine-In Menu</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl mx-auto">
            A Little Crunch. A Lot of Comfort!{' '}
            <br />
            <span className="text-sm italic">
              * GST extra on all items. Dine-in pricing only. Vegetarian options available across menu.
            </span>
          </p>
        </section>

        {/* Dynamic Interactive Menu Client Component */}
        <MenuClient />
      </main>

      <Footer />
    </>
  );
}
