import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import OrderStepper from '@/components/order/OrderStepper';

export const metadata: Metadata = {
  title: 'Order Online - Direct Home Delivery | Filbey Chennai',
  description:
    'Order Filbey 100% Halal crispy fried chicken, burgers & shakes directly online for doorstep delivery across Perungudi, OMR, Chennai. Free delivery on ₹499+ & ₹30 OFF first direct order.',
  keywords: [
    'order fried chicken Chennai',
    'Filbey delivery',
    'online food order Perungudi',
    'halal burger delivery OMR',
    'fried chicken home delivery Chennai',
    'Filbey online order',
  ],
  alternates: { canonical: 'https://thefilbey.com/order' },
  openGraph: {
    type: 'website',
    url: 'https://thefilbey.com/order',
    title: 'Order Online - Direct Home Delivery | Filbey Chennai',
    description:
      'Direct doorstep delivery in Perungudi, OMR, Chennai. 100% Halal crispy fried chicken, dynamite burgers & shakes. Free delivery on ₹499+.',
    images: [{ url: 'https://thefilbey.com/about-filbey-storefront.jpg', width: 1200, height: 900, alt: 'Order Filbey Online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Order Online - Direct Home Delivery | Filbey Chennai',
    description:
      'Direct doorstep delivery in Perungudi, OMR, Chennai. Free delivery on ₹499+ & ₹30 OFF on your 1st direct order.',
    images: ['https://thefilbey.com/about-filbey-storefront.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function OrderPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-background">
        <OrderStepper />
      </main>
    </>
  );
}
