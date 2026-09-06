import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import OrderStepper from '@/components/order/OrderStepper';

export const metadata: Metadata = {
  title: 'Order Online',
  description:
    'Order Filbey fried chicken, burgers, shakes and more for home delivery. We deliver within 5 km of Perungudi, OMR, Chennai. Free delivery above ₹499 & ₹30 off on your 1st direct order.',
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
