'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { DeliveryInfo } from '@/context/CartContext';
import LocationCheck from './LocationCheck';
import OrderMenuClient from './OrderMenuClient';
import CustomerDetailsForm from './CustomerDetailsForm';
import OrderConfirmation from './OrderConfirmation';

interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

type Step = 'location' | 'menu' | 'details' | 'confirm' | 'success';

const STEPS = ['location', 'menu', 'details', 'confirm'] as const;
const STEP_LABELS = ['Location', 'Menu', 'Details', 'Review'];

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.indexOf(current as (typeof STEPS)[number]);
  if (idx === -1) return null;
  return (
    <div className="flex items-center justify-center gap-0 px-4 py-3 max-w-sm mx-auto">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < idx
                  ? 'bg-primary text-white'
                  : i === idx
                  ? 'bg-primary text-white ring-4 ring-primary/20'
                  : 'bg-surface-container text-on-surface-variant border border-surface-variant/30'
              }`}
            >
              {i < idx ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                i + 1
              )}
            </div>
            <span className={`text-[10px] mt-1 font-semibold ${i === idx ? 'text-primary' : 'text-on-surface-variant/60'}`}>
              {STEP_LABELS[i]}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 flex-1 mx-1 mb-4 rounded-full transition-all duration-500 ${i < idx ? 'bg-primary' : 'bg-surface-variant/30'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function OrderStepper() {
  const [step, setStep] = useState<Step>('location');
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const { setDeliveryInfo } = useCart();

  const handleLocationConfirm = (info: DeliveryInfo) => {
    setDeliveryInfo(info);
    setStep('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMenuProceed = () => {
    setStep('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDetailsSubmit = (details: CustomerDetails) => {
    setCustomer(details);
    setStep('confirm');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = () => {
    setStep('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (step === 'success') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-[#e6f9ee] rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_0_8px_rgba(37,211,102,0.12)] animate-[bounce_0.6s_ease-out]">
          <span className="material-symbols-outlined text-[#1a7a3e]" style={{ fontSize: 44 }}>check_circle</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile text-primary uppercase mb-2">Order Sent! 🎉</h1>
        <p className="text-on-surface-variant text-sm max-w-xs leading-relaxed">
          Your order was sent to our WhatsApp. We&apos;ll confirm and dispatch your hot food within <strong>30–45 minutes</strong>.
        </p>

        {/* Repeat direct customer retention card */}
        <div className="w-full bg-gradient-to-br from-white via-surface-container-low to-secondary-container/20 border border-primary/20 rounded-3xl p-5 mt-6 text-left shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-xl">verified</span>
            <h3 className="font-bold text-on-surface text-sm uppercase tracking-wide">
              Filbey Direct VIP Club
            </h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
            You ordered directly with us! Save our number to unlock <strong>exclusive discounts, priority kitchen prep, and free delivery perks</strong> on all your repeat orders.
          </p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white/80 border border-surface-variant/20 rounded-xl p-2.5 text-center">
              <span className="text-xs font-bold text-primary block">₹0 Surge Fees</span>
              <span className="text-[10px] text-on-surface-variant">Always direct prices</span>
            </div>
            <div className="bg-white/80 border border-surface-variant/20 rounded-xl p-2.5 text-center">
              <span className="text-xs font-bold text-green-700 block">Free Delivery</span>
              <span className="text-[10px] text-on-surface-variant">On orders ₹499+</span>
            </div>
          </div>

          <a
            href="https://wa.me/918122356144?text=Hi%20Filbey!%20I%20just%20placed%20a%20direct%20order.%20Please%20save%20my%20number%20for%20repeat%20VIP%20discounts!"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] text-white font-label-lg text-xs py-3 rounded-full hover:bg-[#20bd5a] hover:shadow-[0_4px_16px_rgba(37,211,102,0.35)] transition-all flex items-center justify-center gap-2 shadow-sm font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg>
            Save Filbey (+91 81223 56144) for 1-Tap Reorder
          </a>
        </div>

        <div className="flex flex-col gap-2.5 mt-6 w-full">
          <button
            onClick={() => { setStep('location'); setCustomer(null); }}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-label-lg py-3.5 rounded-full hover:bg-primary-container transition-all text-sm cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
            Order Something Else
          </button>
          <Link
            href="/menu"
            className="w-full flex items-center justify-center gap-2 bg-surface-container text-on-surface font-label-lg py-3 rounded-full border border-surface-variant/20 hover:bg-surface-container-high transition-all text-xs"
          >
            <span className="material-symbols-outlined text-sm">restaurant_menu</span>
            View Dine-In Menu
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-surface-container text-on-surface font-label-lg py-3 rounded-full border border-surface-variant/20 hover:bg-surface-container-high transition-all text-xs"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Step progress indicator */}
      <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-md border-b border-surface-variant/15 shadow-sm">
        <StepIndicator current={step} />
      </div>

      {step === 'location' && <LocationCheck onConfirm={handleLocationConfirm} />}
      {step === 'menu' && <OrderMenuClient onProceed={handleMenuProceed} />}
      {step === 'details' && (
        <CustomerDetailsForm
          onSubmit={handleDetailsSubmit}
          onBack={() => setStep('menu')}
        />
      )}
      {step === 'confirm' && customer && (
        <OrderConfirmation
          customer={customer}
          onBack={() => setStep('details')}
          onOrderPlaced={handleOrderPlaced}
        />
      )}
    </div>
  );
}
