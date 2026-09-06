import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MenuClient from '@/components/MenuClient';

export const metadata: Metadata = {
  title: 'Dine-In Menu - Filbey Fried Chicken & Burgers Chennai',
  description:
    'Explore the complete menu of Filbey Fried Chicken & Burgers in Perungudi, Chennai. 100% Halal crispy fried chicken, dynamite burgers, loaded fries, wraps & thick shakes.',
  keywords: [
    'Filbey menu',
    'Filbey dine-in menu',
    'fried chicken menu Chennai',
    'halal food menu OMR',
    'dynamite wings Perungudi',
    'burgers menu Chennai',
    'lotus biscoff shake',
    'Filbey price list',
  ],
  alternates: { canonical: 'https://thefilbey.com/menu' },
  openGraph: {
    type: 'website',
    url: 'https://thefilbey.com/menu',
    title: 'Dine-In Menu - Filbey Fried Chicken & Burgers Chennai',
    description:
      'Explore our full dine-in menu featuring 100% Halal crispy fried chicken, dynamite burgers, loaded fries, and specialty shakes.',
    images: [{ url: 'https://thefilbey.com/about-filbey-storefront.jpg', width: 1200, height: 900, alt: 'Filbey Menu' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dine-In Menu - Filbey Fried Chicken & Burgers Chennai',
    description:
      'Explore our full dine-in menu featuring 100% Halal chicken, dynamite wings, loaded fries, classic burgers, and signature shakes.',
    images: ['https://thefilbey.com/about-filbey-storefront.jpg'],
  },
};

const menuJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  name: 'Filbey Dine-In Menu',
  description: 'Complete menu of Filbey Fried Chicken & Burgers, Perungudi, Chennai',
  inLanguage: 'en',
  hasMenuSection: [
    {
      '@type': 'MenuSection',
      name: 'Chicken Meals',
      description: 'Signature 100% Halal crispy fried chicken with fries, dips, and soft buns',
    },
    {
      '@type': 'MenuSection',
      name: 'Classic & Dynamite Burgers',
      description: 'Handcrafted crispy chicken, double crunch, and paneer burgers with signature sauces',
    },
    {
      '@type': 'MenuSection',
      name: 'Wings & Strips',
      description: 'Fiery hot wings, BBQ glazed wings, and tender boneless chicken strips',
    },
    {
      '@type': 'MenuSection',
      name: 'Wraps & Loaded Sides',
      description: 'Tortilla wraps, cheese fries, dynamite fries, and chicken crunchies',
    },
    {
      '@type': 'MenuSection',
      name: 'Café & Signature Shakes',
      description: 'Lotus Biscoff, Nutella, Belgian Chocolate, Oreo shakes, and refreshing mojitos',
    },
  ],
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
        {/* Dynamic Interactive Menu Client Component */}
        <MenuClient />
      </main>

      <Footer />
    </>
  );
}
