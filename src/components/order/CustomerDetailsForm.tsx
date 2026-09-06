'use client';

import { useState } from 'react';

interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

interface CustomerDetailsFormProps {
  onSubmit: (details: CustomerDetails) => void;
  onBack: () => void;
}

export default function CustomerDetailsForm({ onSubmit, onBack }: CustomerDetailsFormProps) {
  const [form, setForm] = useState<CustomerDetails>(() => {
    if (typeof window === 'undefined') return { name: '', phone: '', address: '', notes: '' };
    try {
      const saved = localStorage.getItem('filbey_customer');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return { name: '', phone: '', address: '', notes: '' };
  });
  const [hasSavedProfile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return Boolean(localStorage.getItem('filbey_customer'));
    } catch {
      return false;
    }
  });
  const [errors, setErrors] = useState<Partial<CustomerDetails>>({});
  const [gpsLoading, setGpsLoading] = useState(false);

  const set = (field: keyof CustomerDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors: Partial<CustomerDetails> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) newErrors.phone = 'Enter a valid 10-digit mobile number';
    if (!form.address.trim()) newErrors.address = 'Delivery address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        localStorage.setItem('filbey_customer', JSON.stringify(form));
      } catch { /* ignore */ }
      onSubmit(form);
    }
  };

  const handleGPS = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          // Reverse geocode using free Nominatim API
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const parts = [
            data.address?.road,
            data.address?.suburb,
            data.address?.city_district,
            data.address?.city,
            data.address?.postcode,
          ].filter(Boolean);
          setForm(prev => ({ ...prev, address: parts.join(', ') }));
          setErrors(prev => ({ ...prev, address: '' }));
        } catch {
          // Fallback to raw coords
          setForm(prev => ({
            ...prev,
            address: `Lat: ${pos.coords.latitude.toFixed(5)}, Lng: ${pos.coords.longitude.toFixed(5)}`,
          }));
        } finally {
          setGpsLoading(false);
        }
      },
      () => setGpsLoading(false),
      { timeout: 10000 }
    );
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-on-surface-variant text-sm mb-6 hover:text-primary transition-colors">
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Back to Menu
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 32 }}>person_pin</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile text-primary uppercase">Your Details</h1>
        <p className="text-on-surface-variant text-sm mt-1">Almost there! Provide your delivery address and WhatsApp number.</p>
        {hasSavedProfile && (
          <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-800 text-xs px-3 py-1.5 rounded-full border border-green-200 mt-2.5">
            <span className="material-symbols-outlined text-sm">history</span>
            <span>Welcome back! We prefilled your details from your last order.</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="customer-name" className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-xs">
            Full Name *
          </label>
          <input
            id="customer-name"
            type="text"
            value={form.name}
            onChange={set('name')}
            placeholder="e.g. Ahmed Khan"
            autoComplete="name"
            className={`w-full px-4 py-3.5 bg-white rounded-xl border text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm ${
              errors.name ? 'border-error ring-1 ring-error/30' : 'border-surface-variant/40'
            }`}
          />
          {errors.name && <p className="text-xs text-error ml-1">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <label htmlFor="customer-phone" className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-xs">
            WhatsApp / Mobile *
          </label>
          <div className="flex items-center gap-2">
            <span className="px-3 py-3.5 bg-surface-container rounded-xl border border-surface-variant/40 text-on-surface-variant text-sm font-semibold flex-shrink-0">🇮🇳 +91</span>
            <input
              id="customer-phone"
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              placeholder="9876543210"
              autoComplete="tel-local"
              maxLength={10}
              className={`flex-1 px-4 py-3.5 bg-white rounded-xl border text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm ${
                errors.phone ? 'border-error ring-1 ring-error/30' : 'border-surface-variant/40'
              }`}
            />
          </div>
          {errors.phone ? (
            <p className="text-xs text-error ml-1">{errors.phone}</p>
          ) : (
            <p className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5 ml-1">
              <span className="material-symbols-outlined text-xs text-green-700">chat</span>
              We&apos;ll send live order status &amp; repeat customer rewards to this WhatsApp.
            </p>
          )}
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label htmlFor="customer-address" className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-xs">
              Delivery Address *
            </label>
            <button
              type="button"
              onClick={handleGPS}
              disabled={gpsLoading}
              className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline disabled:opacity-50 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">{gpsLoading ? 'sync' : 'my_location'}</span>
              {gpsLoading ? 'Fetching…' : 'Use my location'}
            </button>
          </div>
          <textarea
            id="customer-address"
            value={form.address}
            onChange={set('address')}
            placeholder="Door No., Street, Area, Landmark, Pincode"
            rows={3}
            className={`w-full px-4 py-3.5 bg-white rounded-xl border text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm resize-none ${
              errors.address ? 'border-error ring-1 ring-error/30' : 'border-surface-variant/40'
            }`}
          />
          {errors.address && <p className="text-xs text-error ml-1">{errors.address}</p>}
        </div>

        {/* Special instructions */}
        <div className="flex flex-col gap-1">
          <label htmlFor="customer-notes" className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-xs">
            Special Instructions <span className="normal-case font-normal">(optional)</span>
          </label>
          <textarea
            id="customer-notes"
            value={form.notes}
            onChange={set('notes')}
            placeholder="e.g. Extra spicy, no onions, ring doorbell…"
            rows={2}
            className="w-full px-4 py-3.5 bg-white rounded-xl border border-surface-variant/40 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm resize-none"
          />
        </div>

        <button
          id="review-order-btn"
          type="submit"
          className="w-full bg-primary text-white font-label-lg text-label-lg py-4 rounded-full mt-2 hover:bg-primary-container hover:shadow-[0_8px_30px_rgba(93,0,12,0.35)] transition-all"
        >
          Review My Order →
        </button>
      </form>
    </div>
  );
}
