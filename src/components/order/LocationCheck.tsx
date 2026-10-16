import { useState } from 'react';
import { DeliveryInfo } from '@/context/CartContext';
import LocationSelectModal from './LocationSelectModal';
import { SavedAddress, getActiveRegisteredPhone } from '@/utils/addressStorage';

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
  if (km <= 3.5) return 39;
  if (km <= 8.5) return 59;
  if (km <= 15) return 79;
  return null; // out of delivery range (> 15 km)
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const open = isOpen();

  const handleModalSelect = (loc: { area: string; lat: number; lng: number; mapsUrl: string; savedAddress?: SavedAddress }) => {
    let km = haversineKm(loc.lat, loc.lng, RESTAURANT.lat, RESTAURANT.lng);
    let fee = getDeliveryFee(km);
    if (fee === null && km <= 15) {
      km = Math.min(km, 8.5);
      fee = 59;
    }
    if (fee === null) {
      setDetectedKm(km);
      setStatus('out-of-range');
    } else {
      onConfirm({
        distance: km,
        fee,
        locationName: loc.savedAddress?.saveAs
          ? `${loc.savedAddress.saveAs} (${loc.savedAddress.houseFlatFloor})`
          : loc.area,
      });
    }
  };

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
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto">
      <div className="w-full">

        {/* Hero Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-3.5 shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              moped
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl font-black text-stone-900 uppercase tracking-tight">
            Deliver to You
          </h1>
          <p className="text-stone-700 mt-1.5 text-xs sm:text-sm font-medium">
            Direct doorstep delivery across Perungudi, OMR &amp; surrounding areas
          </p>
        </div>

        {/* Unified Location Action Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg shadow-stone-900/5 border border-stone-200">

          {/* IDLE */}
          {status === 'idle' && (
            <div className="flex flex-col gap-3.5">
              {/* Primary 1-Tap GPS */}
              <button
                id="use-gps-btn"
                onClick={handleGPS}
                className="w-full flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-container text-white font-bold text-sm py-4 px-5 rounded-2xl shadow-md shadow-primary/25 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  near_me
                </span>
                <span>Use Current Location (GPS)</span>
              </button>

              {/* Secondary: Search Area / Saved Address Trigger */}
              <button
                type="button"
                id="select-saved-location-btn"
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-stone-50 hover:bg-stone-100 rounded-2xl border-2 border-stone-200 hover:border-primary/40 text-stone-900 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-xl font-bold">search</span>
                  <span className="text-stone-900 font-bold text-sm whitespace-nowrap">Search area or address</span>
                </div>
                <span className="material-symbols-outlined text-stone-400 text-lg group-hover:translate-x-0.5 group-hover:text-primary transition-all">
                  chevron_right
                </span>
              </button>

              {/* Subtle Divider */}
              <div className="relative flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-[11px] text-stone-400 uppercase font-black tracking-widest">or</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>

              {/* Browse Menu First Button */}
              <button
                type="button"
                id="browse-menu-skip-btn"
                onClick={() => onConfirm({ distance: 2.0, fee: 39, locationName: 'Perungudi (Core Zone)' })}
                className="w-full py-3 px-4 bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/30 rounded-2xl text-primary font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] shadow-2xs group"
              >
                <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform">restaurant_menu</span>
                <span>Browse Menu First</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </button>
            </div>
          )}

          {/* DENIED STATE */}
          {status === 'denied' && (
            <div className="flex flex-col gap-3 text-center">
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-xs text-amber-900 text-left">
                <span className="material-symbols-outlined text-amber-700 text-base shrink-0">info</span>
                <span>Location permission was denied. You can search your area or try GPS again.</span>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-primary text-white font-bold text-sm py-3 rounded-full hover:bg-primary-container transition-all cursor-pointer shadow-sm"
              >
                Search Area Manually
              </button>
              <button
                onClick={handleGPS}
                className="w-full border border-surface-variant/30 text-on-surface font-semibold text-xs py-2.5 rounded-full hover:bg-surface-container transition-all cursor-pointer"
              >
                Retry GPS Access
              </button>
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
                  You&apos;re <strong>{detectedKm?.toFixed(1)} km</strong> away. We currently deliver up to 15 km along OMR &amp; nearby areas.
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
                <p className="font-bold text-on-surface text-lg">Are you along the OMR delivery corridor?</p>
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

        {/* Subtle Delivery Info Note */}
        <div className="inline-flex items-center justify-center gap-2 mt-4 text-xs text-stone-700 font-semibold text-center bg-white border border-stone-200 px-4 py-2 rounded-full shadow-2xs w-full sm:w-auto">
          <span>Delivery from ₹39</span>
          <span className="text-stone-300">•</span>
          <span className="text-emerald-700 font-bold">Free delivery ₹499+</span>
          <span className="text-stone-300">•</span>
          <span>Min order ₹299</span>
        </div>

        <p className="text-center text-xs text-stone-500 font-medium mt-3">
          📍 Filbey — Perungudi, OMR, Chennai
        </p>
      </div>

      {/* Location Selector Sheet (Screenshot 2) */}
      <LocationSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        registeredPhone={getActiveRegisteredPhone()}
        onSelectLocation={handleModalSelect}
      />
    </div>
  );
}
