import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutClient from '@/components/AboutClient';

export const metadata: Metadata = {
  title: 'About Us - Filbey Fried Chicken & Burgers',
  description:
    'Discover the story of Filbey Chennai. Home to the best crispy fried chicken and handcrafted burgers in the city, made fresh daily with 100% Halal certified ingredients.',
  keywords: [
    'About Filbey',
    'Best Fried Chicken Chennai',
    'Best Burgers Chennai',
    'Halal Restaurant OMR',
    'Filbey Chennai Story',
  ],
  alternates: { canonical: 'https://thefilbey.com/about' },
  openGraph: {
    url: 'https://thefilbey.com/about',
    title: 'About Us - Filbey Fried Chicken & Burgers',
    description:
      'Discover the story of Filbey Chennai. Home to the best crispy fried chicken and handcrafted burgers in the city, made fresh daily with 100% Halal certified ingredients.',
    images: [{ url: '/Document.png' }],
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutClient />
      <Footer />
    </>
  );
}
