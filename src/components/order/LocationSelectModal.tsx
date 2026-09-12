'use client';

import { useState, useEffect, useRef } from 'react';
import {
  SavedAddress,
  getSavedAddresses,
  deleteSavedAddress,
  getDistanceFromRestaurant,
  calculateDistanceKm,
  formatDistance,
  cleanPhoneNumber,
  getActiveRegisteredPhone,
  setActiveRegisteredPhone,
} from '@/utils/addressStorage';

interface LocationResult {
  placeId: string;
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
}

interface LocationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  registeredPhone?: string;
  onSelectLocation: (loc: {
    area: string;
    lat: number;
    lng: number;
    mapsUrl: string;
    savedAddress?: SavedAddress;
  }) => void;
  onAddNewManualAddress?: () => void;
}

// Popular quick areas around Perungudi OMR delivery zone
const POPULAR_AREAS = [
  { name: 'Perungudi', lat: 12.9696, lng: 80.2435, desc: 'OMR Road, Chennai 600096' },
  { name: 'Thoraipakkam', lat: 12.9416, lng: 80.2362, desc: 'OMR, Chennai 600097' },
  { name: 'Kandanchavadi', lat: 12.9644, lng: 80.2482, desc: 'OMR, Chennai 600096' },
  { name: 'Sholinganallur', lat: 12.9010, lng: 80.2279, desc: 'OMR Junction, Chennai 600119' },
  { name: 'Perumbakkam', lat: 12.8985, lng: 80.1914, desc: 'Cheran Nagar / Medavakkam, Chennai 600100' },
  { name: 'Kottivakkam', lat: 12.9734, lng: 80.2592, desc: 'ECR / OMR Link, Chennai 600041' },
  { name: 'Palavakkam', lat: 12.9620, lng: 80.2580, desc: 'ECR, Chennai 600041' },
  { name: 'Velachery', lat: 12.9815, lng: 80.2180, desc: 'Bypass Rd, Chennai 600042' },
];

export default function LocationSelectModal({
  isOpen,
  onClose,
  registeredPhone,
  onSelectLocation,
  onAddNewManualAddress,
}: LocationSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [currentGpsAddress, setCurrentGpsAddress] = useState<string>('');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activePhone, setActivePhone] = useState<string>('');
  const [phoneLookupInput, setPhoneLookupInput] = useState<string>('');
  const [isChangingPhone, setIsChangingPhone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load saved addresses ONLY for registered phone
  useEffect(() => {
    if (isOpen) {
      const p = cleanPhoneNumber(registeredPhone) || getActiveRegisteredPhone();
      setActivePhone(p);
      setPhoneLookupInput(p);
      if (p && p.length === 10) {
        setSavedAddresses(getSavedAddresses(p));
      } else {
        setSavedAddresses([]);
      }
      setTimeout(() => inputRef.current?.focus(), 150);

      // Pre-check if current position is cached
      if (navigator.geolocation && !currentGpsAddress) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setCurrentCoords({ lat, lng });
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
                { headers: { 'Accept-Language': 'en' } }
              );
              const data = await res.json();
              const parts = [
                data.address?.road,
                data.address?.suburb,
                data.address?.neighbourhood,
                data.address?.city_district || data.address?.city,
                data.address?.state,
                data.address?.postcode ? `India (${data.address.postcode})` : 'India',
              ].filter(Boolean);
              setCurrentGpsAddress(parts.join(', ') || `${data.display_name}`);
            } catch {
              setCurrentGpsAddress(`GPS Pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
            }
          },
          () => {
            // Geolocation denied or unavailable
          },
          { timeout: 8000 }
        );
      }
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // First filter popular local areas
    const localMatches = POPULAR_AREAS.filter(
      p => p.name.toLowerCase().includes(q.toLowerCase()) || p.desc.toLowerCase().includes(q.toLowerCase())
    ).map(p => ({
      placeId: `local_${p.name}`,
      name: p.name,
      formattedAddress: `${p.name}, ${p.desc}`,
      lat: p.lat,
      lng: p.lng,
    }));

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const queryWithCity = q.toLowerCase().includes('chennai') ? q : `${q}, Chennai`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryWithCity)}&format=json&addressdetails=1&limit=5`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        const apiMatches: LocationResult[] = (data || []).map((item: any) => ({
          placeId: String(item.place_id),
          name: item.name || item.display_name.split(',')[0],
          formattedAddress: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        }));

        // Combine local fast matches + Nominatim results
        const combined = [...localMatches];
        for (const m of apiMatches) {
          if (!combined.some(c => Math.abs(c.lat - m.lat) < 0.005 && Math.abs(c.lng - m.lng) < 0.005)) {
            combined.push(m);
          }
        }
        setSearchResults(combined.slice(0, 7));
      } catch (err) {
        console.warn('Location search error:', err);
        setSearchResults(localMatches);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Location services not available on this browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
        let detected = currentGpsAddress;

        if (!detected) {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const data = await res.json();
            const parts = [
              data.address?.road,
              data.address?.suburb,
              data.address?.neighbourhood,
              data.address?.city_district || data.address?.city,
              data.address?.state,
              data.address?.postcode ? `${data.address.postcode}` : '',
            ].filter(Boolean);
            detected = parts.join(', ');
          } catch {
            detected = `GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          }
        }

        setIsLocating(false);
        onSelectLocation({
          area: detected || `GPS Pin: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          lat,
          lng,
          mapsUrl,
        });
        onClose();
      },
      (err) => {
        setIsLocating(false);
        alert('Please allow location permissions to use current location.');
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  const handleSelectSearchResult = (res: LocationResult) => {
    onSelectLocation({
      area: res.formattedAddress,
      lat: res.lat,
      lng: res.lng,
      mapsUrl: `https://maps.google.com/?q=${res.lat},${res.lng}`,
    });
    onClose();
  };

  const handleSelectSaved = (saved: SavedAddress) => {
    onSelectLocation({
      area: saved.area,
      lat: saved.latitude || 12.9696,
      lng: saved.longitude || 80.2435,
      mapsUrl: saved.mapsUrl || `https://maps.google.com/?q=${saved.latitude || 12.9696},${saved.longitude || 80.2435}`,
      savedAddress: saved,
    });
    onClose();
  };

  const handleDeleteSaved = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = deleteSavedAddress(id, activePhone);
    setSavedAddresses(updated);
    setDeleteConfirmId(null);
  };

  const handlePhoneLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cleanPhoneNumber(phoneLookupInput);
    if (clean.length === 10) {
      setActivePhone(clean);
      setActiveRegisteredPhone(clean);
      setSavedAddresses(getSavedAddresses(clean));
      setIsChangingPhone(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card - High Contrast Light Theme */}
      <div className="relative w-full sm:max-w-md bg-[#F8F9FA] rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden max-h-[92vh] flex flex-col border border-gray-300">
        
        {/* Header */}
        <div className="bg-white px-5 pt-4 pb-3.5 border-b border-gray-200 flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-800 transition-colors border border-gray-300"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-xl text-gray-900 font-bold">keyboard_arrow_down</span>
          </button>
          <h2 className="text-lg font-black text-gray-950 tracking-tight">
            Select a location
          </h2>
        </div>

        {/* Search Bar - High Contrast */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-red-600 material-symbols-outlined text-xl pointer-events-none font-bold">
              search
            </span>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for area, street name..."
              className="w-full pl-11 pr-10 py-3 bg-gray-50 rounded-2xl border-2 border-gray-300 text-gray-950 placeholder-gray-500 font-medium text-sm focus:outline-none focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-gray-500 hover:text-gray-900 p-1 rounded-full"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">

          {/* Search Results if typing */}
          {searchQuery.trim().length > 0 ? (
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-2 shadow-sm">
              <div className="px-3 py-1.5 flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                <span>Matching Locations</span>
                {isSearching && (
                  <span className="flex items-center gap-1 text-red-600 normal-case font-semibold">
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span> Searching...
                  </span>
                )}
              </div>
              {searchResults.length === 0 && !isSearching ? (
                <div className="py-6 text-center text-sm text-gray-600">
                  No areas found for &quot;{searchQuery}&quot;.<br />
                  <span className="text-xs text-gray-500">Try searching a street, landmark or pincode in Chennai.</span>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {searchResults.map((res) => (
                    <button
                      key={res.placeId}
                      onClick={() => handleSelectSearchResult(res)}
                      className="w-full text-left p-3 hover:bg-red-50/70 rounded-xl transition-colors flex items-start gap-3 group cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-red-600 text-xl mt-0.5 shrink-0 group-hover:scale-110 transition-transform">
                        location_on
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-950 group-hover:text-red-700 transition-colors">
                          {res.name}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-0.5 leading-relaxed">
                          {res.formattedAddress}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-gray-400 group-hover:text-red-600 text-sm mt-1 shrink-0">
                        chevron_right
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Primary Location Options (Screenshot 2) */}
              <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden divide-y divide-gray-200">
                
                {/* 1. Use Current Location */}
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="w-full text-left p-4 hover:bg-red-50/40 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-red-200 transition-colors">
                      <span className={`material-symbols-outlined text-red-600 text-2xl ${isLocating ? 'animate-spin' : ''}`}>
                        {isLocating ? 'sync' : 'my_location'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-black text-sm text-red-600 tracking-tight">
                          {isLocating ? 'Detecting current location...' : 'Use current location'}
                        </p>
                      </div>
                      <p className="text-xs text-gray-700 font-medium line-clamp-2 mt-0.5 leading-relaxed">
                        {currentGpsAddress || 'Tap to accurately detect your exact house/building GPS coordinates'}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-red-600 text-lg shrink-0">
                    chevron_right
                  </span>
                </button>

                {/* 2. Add Address */}
                <button
                  type="button"
                  onClick={() => {
                    if (onAddNewManualAddress) onAddNewManualAddress();
                    onClose();
                  }}
                  className="w-full text-left p-4 hover:bg-red-50/40 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 flex items-center justify-center shrink-0 group-hover:bg-red-200 transition-colors">
                      <span className="material-symbols-outlined text-red-600 text-2xl font-bold">
                        add
                      </span>
                    </div>
                    <div>
                      <p className="font-black text-sm text-red-600 tracking-tight">
                        Add Address
                      </p>
                      <p className="text-xs text-gray-600 font-medium">
                        Enter flat, building, street &amp; landmark manually
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-red-600 text-lg shrink-0">
                    chevron_right
                  </span>
                </button>
              </div>

              {/* SAVED ADDRESSES SECTION (Strictly by registered mobile number) */}
              <div className="pt-2">
                <div className="px-1 mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-black text-gray-700 uppercase tracking-widest flex items-center gap-1.5">
                    <span>Saved Addresses</span>
                    {activePhone && (
                      <span className="text-red-700 font-bold normal-case text-[11px] bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        +91 {activePhone}
                      </span>
                    )}
                  </h3>
                  {activePhone ? (
                    <button
                      type="button"
                      onClick={() => setIsChangingPhone(!isChangingPhone)}
                      className="text-[11px] font-black text-red-600 hover:underline cursor-pointer"
                    >
                      {isChangingPhone ? 'Cancel' : 'Change Mobile'}
                    </button>
                  ) : null}
                </div>

                {/* If no phone registered or user clicked Change Mobile: prompt for registered number */}
                {(!activePhone || isChangingPhone) && (
                  <div className="bg-white rounded-2xl border-2 border-gray-300 p-4 shadow-sm mb-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="material-symbols-outlined text-red-600 text-lg font-bold">lock_person</span>
                      <p className="font-black text-xs text-gray-950 uppercase tracking-wide">
                        View Saved Addresses for Your Number
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 font-medium mb-3">
                      Saved addresses are strictly tied to your registered mobile number for accuracy and privacy.
                    </p>
                    <form onSubmit={handlePhoneLookupSubmit} className="flex items-center gap-2">
                      <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-xl text-xs font-black text-gray-800 shrink-0">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phoneLookupInput}
                        onChange={(e) => setPhoneLookupInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 10-digit mobile number"
                        className="flex-1 px-3 py-2 bg-gray-50 rounded-xl border-2 border-gray-300 text-gray-950 text-xs font-bold focus:outline-none focus:border-red-600 focus:bg-white"
                      />
                      <button
                        type="submit"
                        disabled={phoneLookupInput.length !== 10}
                        className="px-4 py-2 bg-red-600 disabled:opacity-40 text-white rounded-xl text-xs font-black shrink-0 hover:bg-red-700 cursor-pointer shadow-xs"
                      >
                        View
                      </button>
                    </form>
                  </div>
                )}

                {activePhone && savedAddresses.length === 0 ? (
                  <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 text-center shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 text-gray-400 flex items-center justify-center mx-auto mb-2">
                      <span className="material-symbols-outlined text-2xl">home_pin</span>
                    </div>
                    <p className="font-black text-sm text-gray-900">No saved addresses for +91 {activePhone}</p>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto font-medium">
                      Use &quot;Use current location&quot; or tap &quot;Add Address&quot; above to save your first delivery location!
                    </p>
                  </div>
                ) : !activePhone ? null : (
                  <div className="space-y-3">
                    {savedAddresses.map((addr) => {
                      const distStr = getDistanceFromRestaurant(addr.latitude, addr.longitude);
                      const isHouse = addr.tag === 'House' || addr.saveAs.toLowerCase().includes('home');
                      const isOffice = addr.tag === 'Office' || addr.saveAs.toLowerCase().includes('office') || addr.saveAs.toLowerCase().includes('work');

                      return (
                        <div
                          key={addr.id}
                          onClick={() => handleSelectSaved(addr)}
                          className="w-full bg-white rounded-2xl border-2 border-gray-300 hover:border-red-600 p-4 shadow-sm hover:shadow-md transition-all text-left flex items-start gap-3.5 group cursor-pointer relative"
                        >
                          {/* Left Icon & Distance */}
                          <div className="flex flex-col items-center shrink-0 w-11 text-center pt-0.5">
                            <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center group-hover:bg-red-50 group-hover:border-red-200 transition-colors">
                              <span className="material-symbols-outlined text-gray-900 group-hover:text-red-600 text-xl">
                                {isHouse ? 'home' : isOffice ? 'business' : 'place'}
                              </span>
                            </div>
                            {distStr && (
                              <span className="text-[11px] font-black text-gray-900 mt-1.5 leading-none">
                                {distStr}
                              </span>
                            )}
                          </div>

                          {/* Address Details */}
                          <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-black text-sm text-gray-950 capitalize">
                                {addr.saveAs || addr.tag || 'Home'}
                              </span>
                              {addr.receiverName && (
                                <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md border border-gray-200">
                                  {addr.receiverName}
                                </span>
                              )}
                            </div>

                            <p className="text-xs font-semibold text-gray-900 leading-snug line-clamp-1">
                              {addr.houseFlatFloor}
                            </p>
                            {addr.buildingStreet && (
                              <p className="text-xs text-gray-700 leading-snug line-clamp-1 mt-0.5">
                                {addr.buildingStreet}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 leading-snug line-clamp-1 mt-0.5 font-medium">
                              {addr.area}
                            </p>

                            {addr.receiverPhone && (
                              <p className="text-[11px] text-gray-600 font-medium mt-1">
                                Phone number: <span className="font-bold text-gray-900">+91-{addr.receiverPhone}</span>
                              </p>
                            )}

                            {/* Bottom micro-actions */}
                            <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-gray-100">
                              <span className="text-[11px] font-bold text-red-600 group-hover:underline flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">done</span> Deliver to this address
                              </span>
                            </div>
                          </div>

                          {/* Delete action */}
                          <div className="absolute top-3 right-3">
                            {deleteConfirmId === addr.id ? (
                              <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={(e) => handleDeleteSaved(e, addr.id)}
                                  className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                                  className="text-[10px] font-bold text-gray-600 px-1"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirmId(addr.id);
                                }}
                                className="w-7 h-7 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                                title="Delete address"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-gray-200 flex justify-between items-center text-xs text-gray-600 font-medium">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-green-700 font-bold">verified</span>
            High-accuracy doorstep delivery in Chennai
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
