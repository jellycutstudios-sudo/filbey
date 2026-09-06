'use client';

import { useState } from 'react';
import { DeliveryInfo } from '@/context/CartContext';

// Restaurant anchor point
const RESTAURANT = { lat: 12.9696, lng: 80.2435, name: 'Perungudi, OMR' };
const MIN_ORDER = 299;

/** Haversine distance in km between two lat/lng pairs */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getDeliveryFee(km: number): number | null {
  if (km <= 3) return 39;
  if (km <= 5) return 59;
  return null; // out of core delivery range (> 5 km)
}

function isOpen(): boolean {
  const now = new Date();
  const totalMins = now.getHours() * 60 + now.getMinutes();
  return totalMins >= 11 * 60 + 30 && totalMins <= 23 * 60 + 30;
}

type Status = 'idle' | 'loading' | 'success' | 'out-of-range' | 'denied' | 'manual-confirm';

interface LocationCheckProps {
  onConfirm: (info: DeliveryInfo) => void;
}

export default function LocationCheck({ onConfirm }: LocationCheckProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [detectedKm, setDetectedKm] = useState<number | null>(null);
  const [detectedFee, setDetectedFee] = useState<number | null>(null);
  const [manualArea, setManualArea] = useState('');
  const [manualError, setManualError] = useState('');
  const open = isOpen();

  const handleGPS = () => {
    if (!navigator.geolocation) { setStatus('denied'); return; }
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const km = haversineKm(pos.coords.latitude, pos.coords.longitude, RESTAURANT.lat, RESTAURANT.lng);
        const fee = getDeliveryFee(km);
        setDetectedKm(km);
        if (fee === null) {
          setStatus('out-of-range');
        } else {
          setDetectedFee(fee);
          setStatus('success');
        }
      },
      () => setStatus('denied'),
      { timeout: 10000 }
    );
  };

  const handleManualCheck = () => {
    if (manualArea.trim().length < 3) { setManualError('Please enter your area name'); return; }
    setManualError('');
    setStatus('manual-confirm');
  };

  const confirmManual = () => {
    // Manual entry – assume ~3.5km (mid-range tier 2) so we charge ₹59
    onConfirm({ distance: 3.5, fee: 59, locationName: manualArea.trim() });
  };

  const confirmGPS = () => {
    onConfirm({ distance: detectedKm!, fee: detectedFee!, locationName: 'Your location' });
  };

  const reset = () => {
    setStatus('idle');
    setDetectedKm(null);
    setDetectedFee(null);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-10">

      {/* Closed banner */}
      {!open && (
        <div className="w-full max-w-md mb-6 bg-error-container border border-error/20 rounded-2xl p-4 text-center">
          <span className="material-symbols-outlined text-error text-3xl block mb-1">schedule</span>
          <p className="font-semibold text-on-error-container text-sm">We&apos;re currently closed</p>
          <p className="text-xs text-on-error-container/70 mt-0.5">Open daily 11:30 AM – 11:30 PM</p>
        </div>
      )}

      <div className="w-full max-w-md">

        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 shadow-[0_0_0_8px_rgba(93,0,12,0.05)]">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 40 }}>delivery_dining</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg-mobile text-primary uppercase">Deliver to You</h1>
          <p className="text-on-surface-variant mt-2 text-sm leading-relaxed">
            We deliver within <strong>5 km</strong> of Perungudi, OMR.<br />
            Minimum order ₹{MIN_ORDER}.
          </p>
        </div>

        {/* Promo callout */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary-container/25 to-primary/10 border border-primary/20 rounded-2xl p-3.5 mb-6 text-center">
          <div className="flex items-center justify-center gap-1.5 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-sm">local_fire_department</span>
            <span>Direct Ordering Offers</span>
          </div>
          <p className="text-xs text-on-surface font-semibold">
            ⚡ <span className="text-primary font-bold">FREE Delivery</span> on orders above ₹499
          </p>
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            🎉 <span className="font-bold text-on-surface">₹30 OFF</span> on your 1st direct order (min ₹399)
          </p>
        </div>

        {/* Delivery tier cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white rounded-2xl p-4 border border-surface-variant/20 text-center shadow-sm">
            <span className="material-symbols-outlined text-secondary text-2xl">near_me</span>
            <p className="font-bold text-primary text-xl mt-1">₹39</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Within 3 km</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-surface-variant/20 text-center shadow-sm">
            <span className="material-symbols-outlined text-secondary text-2xl">directions_car</span>
            <p className="font-bold text-primary text-xl mt-1">₹59</p>
            <p className="text-xs text-on-surface-variant mt-0.5">3 – 5 km</p>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(42,31,29,0.08)] border border-surface-variant/10">

          {/* IDLE */}
          {(status === 'idle' || status === 'denied') && (
            <div className="flex flex-col gap-4">
              {status === 'idle' && (
                <button
                  id="use-gps-btn"
                  onClick={handleGPS}
                  className="flex items-center justify-center gap-2 bg-primary text-white font-label-lg text-label-lg py-3.5 rounded-full hover:bg-primary-container hover:shadow-[0_8px_30px_rgba(93,0,12,0.3)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">my_location</span>
                  Use My Location
                </button>
              )}

              {status === 'denied' && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 bg-secondary-container/20 rounded-xl px-4 py-3 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-secondary text-lg">info</span>
                    Location access was denied. Allow it in your browser then tap below.
                  </div>
                  <button
                    id="retry-gps-btn"
                    onClick={handleGPS}
                    className="flex items-center justify-center gap-2 border-2 border-primary text-primary font-label-lg text-sm py-3 rounded-full hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">my_location</span>
                    Try Again with GPS
                  </button>
                </div>
              )}

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-surface-variant/40" />
                <span className="text-xs text-on-surface-variant/60 uppercase font-semibold tracking-widest">or</span>
                <div className="flex-1 h-px bg-surface-variant/40" />
              </div>

              <div className="flex flex-col gap-2">
                <input
                  id="manual-area-input"
                  type="text"
                  value={manualArea}
                  onChange={e => { setManualArea(e.target.value); setManualError(''); }}
                  placeholder="Enter your area (e.g. Sholinganallur)"
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-surface-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm"
                />
                {manualError && <p className="text-xs text-error ml-1">{manualError}</p>}
                <button
                  id="check-area-btn"
                  onClick={handleManualCheck}
                  disabled={manualArea.trim().length < 3}
                  className="bg-surface-container text-on-surface font-label-lg text-label-lg py-3 rounded-full border border-surface-variant/20 hover:bg-surface-container-high transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Check Availability
                </button>

                <button
                  type="button"
                  onClick={() => onConfirm({ distance: 2.0, fee: 39, locationName: 'Perungudi (Core Zone)' })}
                  className="mt-2 w-full py-2.5 rounded-full border border-dashed border-primary/40 text-xs font-bold text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">restaurant_menu</span>
                  <span>Browse Menu First (Skip Location) →</span>
                </button>
              </div>
            </div>
          )}

          {/* LOADING */}
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-on-surface-variant text-sm">Getting your location…</p>
            </div>
          )}

          {/* SUCCESS */}
          {status === 'success' && detectedFee !== null && (
            <div className="flex flex-col gap-5 items-center text-center">
              <div className="w-16 h-16 bg-[#e6f9ee] rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#1a7a3e]" style={{ fontSize: 36 }}>check_circle</span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-lg">We deliver to you! 🎉</p>
                <p className="text-on-surface-variant text-sm mt-1">
                  You&apos;re <strong>{detectedKm?.toFixed(1)} km</strong> away ·{' '}
                  <span className="text-primary font-semibold">Delivery ₹{detectedFee}</span>
                </p>
              </div>
              <button
                id="confirm-gps-btn"
                onClick={confirmGPS}
                className="w-full bg-primary text-white font-label-lg text-label-lg py-3.5 rounded-full hover:bg-primary-container hover:shadow-[0_8px_30px_rgba(93,0,12,0.3)] transition-all"
              >
                Browse Menu →
              </button>
              <button onClick={reset} className="text-xs text-on-surface-variant underline">
                Change location
              </button>
            </div>
          )}

          {/* OUT OF RANGE */}
          {status === 'out-of-range' && (
            <div className="flex flex-col gap-5 items-center text-center">
              <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-error" style={{ fontSize: 36 }}>wrong_location</span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-lg">Outside delivery zone</p>
                <p className="text-on-surface-variant text-sm mt-1">
                  You&apos;re <strong>{detectedKm?.toFixed(1)} km</strong> away. We currently deliver within 5 km.
                </p>
                <p className="text-sm text-on-surface-variant mt-3">
                  You can still{' '}
                  <a
                    href="https://wa.me/918122356144"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline font-semibold"
                  >
                    contact us on WhatsApp
                  </a>{' '}
                  or visit us at OMR.
                </p>
              </div>
              <button onClick={reset} className="text-xs text-on-surface-variant underline">
                Try a different location
              </button>
            </div>
          )}

          {/* MANUAL CONFIRM */}
          {status === 'manual-confirm' && (
            <div className="flex flex-col gap-5 items-center text-center">
              <div className="w-16 h-16 bg-secondary-container/30 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: 36 }}>help</span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-lg">Are you within 5 km of OMR?</p>
                <p className="text-on-surface-variant text-sm mt-1">
                  Area: <strong>{manualArea}</strong>
                </p>
                <p className="text-xs text-on-surface-variant/70 mt-3 leading-relaxed">
                  We serve Perungudi, Sholinganallur, Karapakkam,<br />
                  Egattur, Navalur, Padur &amp; nearby areas.
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  id="confirm-manual-btn"
                  onClick={confirmManual}
                  className="flex-1 bg-primary text-white font-label-lg py-3 rounded-full hover:bg-primary-container transition-all text-sm"
                >
                  Yes, I&apos;m nearby
                </button>
                <button
                  onClick={() => setStatus('idle')}
                  className="flex-1 bg-surface-container text-on-surface font-label-lg py-3 rounded-full border border-surface-variant/20 transition-all text-sm"
                >
                  Go back
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-on-surface-variant/50 mt-5">
          📍 Filbey — Perungudi, OMR, Chennai
        </p>
      </div>
    </div>
  );
}
