'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import LocationSelectModal from './LocationSelectModal';
import { saveAddress, SavedAddress, getSavedAddresses } from '@/utils/addressStorage';

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  houseFlatFloor: string;
  buildingStreet: string;
  area: string;
  addressType: 'House' | 'Office' | 'Other';
  saveAs: string;
  useAccountDetails: boolean;
  receiverName?: string;
  receiverPhone?: string;
  deliveryInstructions?: string;
  notes: string;
  mapsUrl?: string;
  latitude?: number;
  longitude?: number;
}

interface CustomerDetailsFormProps {
  onSubmit: (details: CustomerDetails) => void;
  onBack: () => void;
}

const DEFAULT_INSTRUCTION_PRESETS = [
  'Leave at door 🚪',
  'Avoid calling 📵',
  'Don\'t ring bell 🔕',
  'Leave with security 👮',
];

export default function CustomerDetailsForm({ onSubmit, onBack }: CustomerDetailsFormProps) {
  const { checkPhoneEligibility, isPhoneEligibleForFirstOrder, deliveryInfo } = useCart();

  // Load account or last saved profile
  const [account, setAccount] = useState<{ name: string; phone: string }>(() => {
    if (typeof window === 'undefined') return { name: '', phone: '' };
    try {
      const saved = localStorage.getItem('filbey_customer');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { name: parsed.name || '', phone: parsed.phone || '' };
      }
    } catch { /* ignore */ }
    return { name: '', phone: '' };
  });

  const [useAccountDetails, setUseAccountDetails] = useState(true);
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');

  const [addressType, setAddressType] = useState<'House' | 'Office' | 'Other'>('House');
  const [houseFlatFloor, setHouseFlatFloor] = useState('');
  const [buildingStreet, setBuildingStreet] = useState('');
  const [area, setArea] = useState(() => deliveryInfo?.locationName || 'Perungudi, OMR, Chennai, Tamil Nadu 600096');
  const [saveAs, setSaveAs] = useState('Home');

  const [coords, setCoords] = useState<{ lat: number; lng: number }>(() => ({
    lat: 12.9696,
    lng: 80.2435,
  }));
  const [mapsUrl, setMapsUrl] = useState('');

  const [selectedInstructions, setSelectedInstructions] = useState<string[]>([]);
  const [customInstruction, setCustomInstruction] = useState('');
  const [showAddInstructionInput, setShowAddInstructionInput] = useState(false);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [phoneCheckStatus, setPhoneCheckStatus] = useState<'idle' | 'checking' | 'repeat' | 'first-time'>('idle');
  const [detectedRepeatName, setDetectedRepeatName] = useState('');

  // Initialize from saved addresses or customer profile
  useEffect(() => {
    try {
      const savedList = getSavedAddresses();
      if (savedList.length > 0) {
        const primary = savedList[0];
        setHouseFlatFloor(primary.houseFlatFloor || '');
        setBuildingStreet(primary.buildingStreet || '');
        setArea(primary.area || area);
        setAddressType((primary.tag as any) || 'House');
        setSaveAs(primary.saveAs || 'Home');
        if (primary.latitude && primary.longitude) {
          setCoords({ lat: primary.latitude, lng: primary.longitude });
          setMapsUrl(primary.mapsUrl || `https://maps.google.com/?q=${primary.latitude},${primary.longitude}`);
        }
        if (primary.deliveryInstructions) {
          setSelectedInstructions([primary.deliveryInstructions]);
        }
        if (primary.receiverName) setReceiverName(primary.receiverName);
        if (primary.receiverPhone) setReceiverPhone(primary.receiverPhone);
      } else {
        const saved = localStorage.getItem('filbey_customer');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.buildingDetails) setHouseFlatFloor(parsed.buildingDetails);
          if (parsed.landmark) setBuildingStreet(parsed.landmark);
          if (parsed.address) setArea(parsed.address);
          if (parsed.latitude && parsed.longitude) {
            setCoords({ lat: parsed.latitude, lng: parsed.longitude });
            setMapsUrl(parsed.mapsUrl || `https://maps.google.com/?q=${parsed.latitude},${parsed.longitude}`);
          }
        }
      }
    } catch { /* ignore */ }
  }, []);

  // Update saveAs whenever addressType changes unless manually edited
  const handleTypeChange = (type: 'House' | 'Office' | 'Other') => {
    setAddressType(type);
    if (type === 'House') setSaveAs('Home');
    else if (type === 'Office') setSaveAs('Office');
    else setSaveAs('Other');
  };

  // Phone check for repeat customer perks
  const currentPhone = useAccountDetails ? account.phone : receiverPhone;
  useEffect(() => {
    const raw = currentPhone.trim();
    if (!/^[6-9]\d{9}$/.test(raw)) return;

    let isCancelled = false;
    const timer = setTimeout(async () => {
      setPhoneCheckStatus('checking');
      try {
        const res = await checkPhoneEligibility(raw);
        if (!isCancelled) {
          if (res.hasOrdered) {
            setPhoneCheckStatus('repeat');
            const foundName = res.name || account.name || '';
            setDetectedRepeatName(foundName);
            if (!account.name && res.name) {
              setAccount(prev => ({ ...prev, name: res.name || '' }));
            }
          } else {
            setPhoneCheckStatus('first-time');
          }
        }
      } catch {
        if (!isCancelled) setPhoneCheckStatus('idle');
      }
    }, 450);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [currentPhone, checkPhoneEligibility]);

  // Handle location chosen from modal
  const handleLocationSelected = (loc: {
    area: string;
    lat: number;
    lng: number;
    mapsUrl: string;
    savedAddress?: SavedAddress;
  }) => {
    setArea(loc.area);
    setCoords({ lat: loc.lat, lng: loc.lng });
    setMapsUrl(loc.mapsUrl);
    setErrors(prev => ({ ...prev, area: '' }));

    if (loc.savedAddress) {
      const s = loc.savedAddress;
      setHouseFlatFloor(s.houseFlatFloor || '');
      setBuildingStreet(s.buildingStreet || '');
      setAddressType((s.tag as any) || 'House');
      setSaveAs(s.saveAs || 'Home');
      if (s.deliveryInstructions) setSelectedInstructions([s.deliveryInstructions]);
      if (s.receiverName) setReceiverName(s.receiverName);
      if (s.receiverPhone) setReceiverPhone(s.receiverPhone);
    }
  };

  const toggleInstructionPreset = (text: string) => {
    if (selectedInstructions.includes(text)) {
      setSelectedInstructions(selectedInstructions.filter(t => t !== text));
    } else {
      setSelectedInstructions([...selectedInstructions, text]);
    }
  };

  const handleAddCustomInstruction = () => {
    if (customInstruction.trim()) {
      if (!selectedInstructions.includes(customInstruction.trim())) {
        setSelectedInstructions([...selectedInstructions, customInstruction.trim()]);
      }
      setCustomInstruction('');
      setShowAddInstructionInput(false);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (useAccountDetails) {
      if (!account.name.trim()) errs.name = 'Full name is required';
      if (!account.phone.trim()) errs.phone = 'Phone number is required';
      else if (!/^[6-9]\d{9}$/.test(account.phone.trim())) errs.phone = 'Enter a valid 10-digit mobile number';
    } else {
      if (!receiverName.trim()) errs.receiverName = 'Receiver name is required';
      if (!receiverPhone.trim()) errs.receiverPhone = 'Receiver phone number is required';
      else if (!/^[6-9]\d{9}$/.test(receiverPhone.trim())) errs.receiverPhone = 'Enter a valid 10-digit mobile number';
    }

    if (!houseFlatFloor.trim()) {
      errs.houseFlatFloor = 'House / Flat / Floor is required for rider to reach';
    }

    if (!area.trim()) {
      errs.area = 'Area is required';
    }

    if (!saveAs.trim()) {
      errs.saveAs = 'Please provide an address label (e.g. Home)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to first error
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    const finalName = useAccountDetails ? account.name.trim() : receiverName.trim();
    const finalPhone = useAccountDetails ? account.phone.trim() : receiverPhone.trim();
    const finalMapsUrl = mapsUrl || `https://maps.google.com/?q=${coords.lat},${coords.lng}`;
    const allInstructions = selectedInstructions.join(', ');

    // Build combined full address string
    const fullAddress = [
      houseFlatFloor.trim(),
      buildingStreet.trim(),
      area.trim(),
    ].filter(Boolean).join(', ');

    // Save to Saved Addresses storage strictly under registered phone
    saveAddress({
      tag: addressType,
      saveAs: saveAs.trim(),
      houseFlatFloor: houseFlatFloor.trim(),
      buildingStreet: buildingStreet.trim(),
      area: area.trim(),
      fullAddress,
      latitude: coords.lat,
      longitude: coords.lng,
      mapsUrl: finalMapsUrl,
      receiverName: finalName,
      receiverPhone: finalPhone,
      deliveryInstructions: allInstructions,
    }, finalPhone);

    const submissionData: CustomerDetails = {
      name: finalName,
      phone: finalPhone,
      address: fullAddress,
      houseFlatFloor: houseFlatFloor.trim(),
      buildingStreet: buildingStreet.trim(),
      area: area.trim(),
      addressType,
      saveAs: saveAs.trim(),
      useAccountDetails,
      receiverName: useAccountDetails ? undefined : receiverName.trim(),
      receiverPhone: useAccountDetails ? undefined : receiverPhone.trim(),
      deliveryInstructions: allInstructions,
      notes: allInstructions,
      mapsUrl: finalMapsUrl,
      latitude: coords.lat,
      longitude: coords.lng,
    };

    // Store profile for pre-filling next time
    try {
      localStorage.setItem('filbey_customer', JSON.stringify({
        name: finalName,
        phone: finalPhone,
        address: area.trim(),
        buildingDetails: houseFlatFloor.trim(),
        landmark: buildingStreet.trim(),
        latitude: coords.lat,
        longitude: coords.lng,
        mapsUrl: finalMapsUrl,
        notes: allInstructions,
      }));
    } catch { /* ignore */ }

    onSubmit(submissionData);
  };

  const addressSummaryPreview = [
    houseFlatFloor ? `${houseFlatFloor} | ` : '',
    area.length > 38 ? `${area.slice(0, 38)}...` : area,
  ].join('');

  return (
    <div className="min-h-screen bg-[#F4F5F8] pb-16 pt-2">
      <div className="max-w-md mx-auto px-4">

        {/* Top Bar matching Screenshot 1 */}
        <div className="sticky top-20 z-30 bg-[#F4F5F8]/95 backdrop-blur-md py-3 flex items-center gap-3 border-b border-gray-200 mb-4">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-xl font-bold">arrow_back</span>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-gray-950 truncate">
              {addressSummaryPreview || 'Enter delivery address'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          {/* ── SECTION 1: RECEIVER DETAILS (Screenshot 1) ── */}
          <div className="space-y-2">
            <h2 className="text-base font-black text-gray-950 tracking-tight">
              Receiver Details
            </h2>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 shadow-sm">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useAccountDetails}
                  onChange={(e) => setUseAccountDetails(e.target.checked)}
                  className="w-5 h-5 rounded-md border-2 border-gray-400 text-red-600 focus:ring-red-500 focus:ring-offset-0 cursor-pointer accent-red-600"
                />
                <div className="flex-1">
                  <span className="font-extrabold text-sm text-gray-950 block">
                    Use my account details
                  </span>
                  {account.name || account.phone ? (
                    <span className="text-xs font-semibold text-gray-600 mt-0.5 block">
                      {[account.name, account.phone ? `+91-${account.phone}` : ''].filter(Boolean).join(', ')}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500 block">
                      Fill in your primary contact details below
                    </span>
                  )}
                </div>
              </label>

              {/* Editable inputs if useAccountDetails is checked and profile is missing, OR if unchecked */}
              {(!useAccountDetails || !account.name || !account.phone) && (
                <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                      {useAccountDetails ? 'Your Full Name *' : 'Receiver Full Name *'}
                    </label>
                    <input
                      type="text"
                      value={useAccountDetails ? account.name : receiverName}
                      onChange={(e) => {
                        if (useAccountDetails) setAccount(prev => ({ ...prev, name: e.target.value }));
                        else setReceiverName(e.target.value);
                        setErrors(prev => ({ ...prev, name: '', receiverName: '' }));
                      }}
                      placeholder="e.g. Afeef Ahmed"
                      className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-300 text-gray-950 text-sm font-semibold focus:outline-none focus:border-red-600 focus:bg-white"
                    />
                    {(errors.name || errors.receiverName) && (
                      <p className="text-xs text-red-600 font-bold mt-1">
                        {errors.name || errors.receiverName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                      {useAccountDetails ? 'WhatsApp / Mobile *' : 'Receiver Mobile Number *'}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-xl text-xs font-black text-gray-800 shrink-0">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={useAccountDetails ? account.phone : receiverPhone}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '');
                          if (useAccountDetails) setAccount(prev => ({ ...prev, phone: v }));
                          else setReceiverPhone(v);
                          setErrors(prev => ({ ...prev, phone: '', receiverPhone: '' }));
                        }}
                        placeholder="9876543210"
                        className="flex-1 px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-300 text-gray-950 text-sm font-semibold focus:outline-none focus:border-red-600 focus:bg-white"
                      />
                    </div>
                    {(errors.phone || errors.receiverPhone) && (
                      <p className="text-xs text-red-600 font-bold mt-1">
                        {errors.phone || errors.receiverPhone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Repeat Customer / First Order banner */}
              {phoneCheckStatus === 'repeat' && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2.5 text-xs text-emerald-950 font-semibold">
                  <span className="material-symbols-outlined text-emerald-700 text-lg">verified</span>
                  <span>Welcome back{detectedRepeatName ? `, ${detectedRepeatName}` : ''}! Filbey VIP direct discount applied.</span>
                </div>
              )}
              {phoneCheckStatus === 'first-time' && isPhoneEligibleForFirstOrder && (
                <div className="mt-3 p-2.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-2.5 text-xs text-amber-950 font-semibold">
                  <span className="material-symbols-outlined text-amber-700 text-lg">celebration</span>
                  <span>1st direct order! ₹30 discount ready on your final bill.</span>
                </div>
              )}
            </div>
          </div>

          {/* ── SECTION 2: LOCATION DETAILS (Screenshot 1) ── */}
          <div className="space-y-2 pt-1">
            <h2 className="text-base font-black text-gray-950 tracking-tight">
              Location Details
            </h2>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 shadow-sm space-y-3.5">
              
              {/* Category Pills: [ House ] [ Office ] [ Other ] */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleTypeChange('House')}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    addressType === 'House'
                      ? 'bg-gray-950 text-white shadow-md'
                      : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">home</span>
                  <span>House</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange('Office')}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    addressType === 'Office'
                      ? 'bg-gray-950 text-white shadow-md'
                      : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">business_center</span>
                  <span>Office</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange('Other')}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    addressType === 'Other'
                      ? 'bg-gray-950 text-white shadow-md'
                      : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">near_me</span>
                  <span>Other</span>
                </button>
              </div>

              {/* House / Flat / Floor * */}
              <div>
                <input
                  type="text"
                  value={houseFlatFloor}
                  onChange={(e) => {
                    setHouseFlatFloor(e.target.value);
                    setErrors(prev => ({ ...prev, houseFlatFloor: '' }));
                  }}
                  placeholder="House / Flat / Floor *"
                  className={`w-full px-3.5 py-3 bg-white rounded-xl border-2 text-gray-950 text-sm font-medium placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors ${
                    errors.houseFlatFloor ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {errors.houseFlatFloor && (
                  <p className="text-xs text-red-600 font-bold mt-1">{errors.houseFlatFloor}</p>
                )}
              </div>

              {/* Building / Street (Recommended) */}
              <div>
                <input
                  type="text"
                  value={buildingStreet}
                  onChange={(e) => setBuildingStreet(e.target.value)}
                  placeholder="Building / Street (Recommended)"
                  className="w-full px-3.5 py-3 bg-white rounded-xl border-2 border-gray-300 text-gray-950 text-sm font-medium placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              {/* Area Card with Mini-Map Preview and "Change" Pin button (Screenshot 1) */}
              <div className="bg-[#F8F9FB] rounded-2xl border-2 border-gray-300 p-3.5 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-gray-500 uppercase tracking-wider mb-1">
                    <span>Area</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  </div>
                  <p className="text-xs font-bold text-gray-950 leading-relaxed line-clamp-3">
                    {area || 'Tap Change on the right to select your exact delivery area'}
                  </p>
                  {errors.area && (
                    <p className="text-xs text-red-600 font-bold mt-1">{errors.area}</p>
                  )}
                </div>

                {/* Mini Map Thumbnail with Red Pin + "Change" button */}
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="w-20 h-20 rounded-2xl bg-white border-2 border-gray-300 overflow-hidden relative shadow-xs flex flex-col items-center justify-center shrink-0 hover:border-red-600 hover:shadow-md transition-all group cursor-pointer"
                  title="Change Location Pin"
                >
                  {/* Subtle map grid background */}
                  <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:8px_8px] bg-slate-100 pointer-events-none" />
                  
                  {/* Pin icon */}
                  <div className="relative z-10 w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xl">location_on</span>
                  </div>
                  <span className="relative z-10 text-[11px] font-black text-red-600 tracking-tight mt-0.5 group-hover:underline">
                    Change
                  </span>
                </button>
              </div>

              {/* Save address as * */}
              <div>
                <input
                  type="text"
                  value={saveAs}
                  onChange={(e) => {
                    setSaveAs(e.target.value);
                    setErrors(prev => ({ ...prev, saveAs: '' }));
                  }}
                  placeholder="Save address as *"
                  className={`w-full px-3.5 py-3 bg-white rounded-xl border-2 text-gray-950 text-sm font-medium placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors ${
                    errors.saveAs ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.saveAs && (
                  <p className="text-xs text-red-600 font-bold mt-1">{errors.saveAs}</p>
                )}
              </div>
            </div>
          </div>


          {/* ── SECTION 4: DELIVERY INSTRUCTIONS (Recommended) (Screenshot 1) ── */}
          <div className="space-y-2 pt-1">
            <h2 className="text-base font-black text-gray-950 tracking-tight">
              Delivery Instructions (Recommended)
            </h2>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 shadow-sm space-y-3">
              
              {/* Quick Preset Chips */}
              <div className="flex flex-wrap gap-2">
                {DEFAULT_INSTRUCTION_PRESETS.map((preset) => {
                  const active = selectedInstructions.includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => toggleInstructionPreset(preset)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                        active
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-gray-50 text-gray-800 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>

              {/* Instructions input row matching Screenshot 1 */}
              {!showAddInstructionInput ? (
                <div
                  onClick={() => setShowAddInstructionInput(true)}
                  className="w-full py-2.5 px-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-300 flex items-center justify-between text-xs text-gray-600 cursor-pointer transition-colors"
                >
                  <span className="font-medium">Instructions to reach location</span>
                  <span className="font-black text-red-600 tracking-wide">ADD</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customInstruction}
                    onChange={(e) => setCustomInstruction(e.target.value)}
                    placeholder="e.g. Ring bell twice, gate code 402…"
                    className="flex-1 px-3 py-2 bg-white rounded-xl border-2 border-red-500 text-xs font-semibold text-gray-950 focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomInstruction();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomInstruction}
                    className="px-3.5 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shrink-0 hover:bg-red-700"
                  >
                    Add
                  </button>
                </div>
              )}

              {/* Display custom selected chips */}
              {selectedInstructions.some(s => !DEFAULT_INSTRUCTION_PRESETS.includes(s)) && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedInstructions
                    .filter(s => !DEFAULT_INSTRUCTION_PRESETS.includes(s))
                    .map((custom) => (
                      <span
                        key={custom}
                        className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[11px] font-bold px-2.5 py-1 rounded-md border border-red-200"
                      >
                        {custom}
                        <button
                          type="button"
                          onClick={() => setSelectedInstructions(selectedInstructions.filter(i => i !== custom))}
                          className="hover:text-red-950"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="save-address-review-btn"
              type="submit"
              className="w-full bg-[#111827] hover:bg-black text-white font-black text-sm py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] border border-gray-950"
            >
              <span>Save &amp; Review Order</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
            <p className="text-[11px] text-center text-gray-600 font-medium mt-2">
              🔒 Delivery coordinates will be shared directly with your Filbey rider
            </p>
          </div>
        </form>

        {/* Location Select Modal (Screenshot 2) */}
        <LocationSelectModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          registeredPhone={useAccountDetails ? account.phone : receiverPhone}
          onSelectLocation={handleLocationSelected}
          onAddNewManualAddress={() => {
            // Already on manual address form
          }}
        />
      </div>
    </div>
  );
}
