export interface SavedAddress {
  id: string;
  tag: 'House' | 'Office' | 'Other' | string;
  saveAs: string;
  houseFlatFloor: string;
  buildingStreet: string;
  area: string;
  fullAddress: string;
  registeredPhone: string; // 10-digit mobile number owning this address
  latitude?: number;
  longitude?: number;
  mapsUrl?: string;
  receiverName?: string;
  receiverPhone?: string;
  deliveryInstructions?: string;
  createdAt: number;
}

const STORAGE_KEY = 'filbey_saved_addresses_v3';
const LEGACY_STORAGE_KEY = 'filbey_saved_addresses_v2';
const REGISTERED_PHONE_KEY = 'filbey_registered_phone';
const RESTAURANT_COORDS = { lat: 12.9696, lng: 80.2435 }; // Perungudi, OMR, Chennai

/** Normalize phone to 10 digits */
export function cleanPhoneNumber(raw?: string | null): string {
  if (!raw) return '';
  return raw.replace(/\D/g, '').slice(-10);
}

/** Get currently active/logged-in phone number */
export function getActiveRegisteredPhone(): string {
  if (typeof window === 'undefined') return '';
  try {
    const direct = localStorage.getItem(REGISTERED_PHONE_KEY);
    if (direct) {
      const clean = cleanPhoneNumber(direct);
      if (clean.length === 10) return clean;
    }
    const custRaw = localStorage.getItem('filbey_customer');
    if (custRaw) {
      const parsed = JSON.parse(custRaw);
      const clean = cleanPhoneNumber(parsed.phone);
      if (clean.length === 10) return clean;
    }
  } catch { /* ignore */ }
  return '';
}

/** Set currently active registered phone number */
export function setActiveRegisteredPhone(phone: string): void {
  if (typeof window === 'undefined') return;
  const clean = cleanPhoneNumber(phone);
  if (clean.length === 10) {
    try {
      localStorage.setItem(REGISTERED_PHONE_KEY, clean);
    } catch { /* ignore */ }
  }
}

/** Haversine formula to compute distance in km */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Format distance nicely like '0 m', '120 m', '1.4 km' */
export function formatDistance(km: number): string {
  if (km < 0.1) return '0 m';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/** Get distance from restaurant */
export function getDistanceFromRestaurant(lat?: number, lng?: number): string {
  if (lat == null || lng == null) return '';
  const km = calculateDistanceKm(RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng, lat, lng);
  return formatDistance(km);
}

/** Internal: Read all raw saved addresses from storage */
function getAllRawAddresses(): SavedAddress[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);

    // Migrate from v2 if available
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const list = JSON.parse(legacy);
      const activePhone = getActiveRegisteredPhone();
      const migrated: SavedAddress[] = list.map((item: any) => ({
        ...item,
        registeredPhone: cleanPhoneNumber(item.receiverPhone) || activePhone,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch (err) {
    console.error('Error reading raw addresses:', err);
  }
  return [];
}

/**
 * Read saved addresses ONLY for the specified or active registered mobile number.
 * If no phone is specified or registered, returns an empty array to protect privacy.
 */
export function getSavedAddresses(phone?: string): SavedAddress[] {
  const targetPhone = cleanPhoneNumber(phone) || getActiveRegisteredPhone();
  if (!targetPhone || targetPhone.length !== 10) {
    return []; // ONLY show saved addresses by registered mobile number
  }

  const all = getAllRawAddresses();
  return all.filter(item => cleanPhoneNumber(item.registeredPhone) === targetPhone || cleanPhoneNumber(item.receiverPhone) === targetPhone);
}

/** Save or update an address for a specific registered mobile number */
export function saveAddress(
  addr: Omit<SavedAddress, 'id' | 'createdAt' | 'registeredPhone'> & { id?: string; registeredPhone?: string },
  phone?: string
): SavedAddress {
  const targetPhone = cleanPhoneNumber(phone) || cleanPhoneNumber(addr.registeredPhone) || cleanPhoneNumber(addr.receiverPhone) || getActiveRegisteredPhone();
  const id = addr.id || `addr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const fullAddress = [
    addr.houseFlatFloor,
    addr.buildingStreet,
    addr.area,
  ].filter(Boolean).join(', ');

  const completeItem: SavedAddress = {
    ...addr,
    id,
    registeredPhone: targetPhone,
    fullAddress,
    createdAt: Date.now(),
  };

  const all = getAllRawAddresses();
  const existingIdx = all.findIndex(item => item.id === id);
  let updatedList: SavedAddress[];
  if (existingIdx >= 0) {
    updatedList = [...all];
    updatedList[existingIdx] = completeItem;
  } else {
    updatedList = [completeItem, ...all];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    if (targetPhone.length === 10) {
      setActiveRegisteredPhone(targetPhone);
    }
  } catch (err) {
    console.error('Error saving address:', err);
  }

  return completeItem;
}

/** Delete an address for a specific registered mobile number */
export function deleteSavedAddress(id: string, phone?: string): SavedAddress[] {
  const all = getAllRawAddresses();
  const filtered = all.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Error deleting address:', err);
  }
  return getSavedAddresses(phone);
}
