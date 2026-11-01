'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { calculateDistanceKm, formatDistance } from '@/utils/addressStorage';

const RESTAURANT = { lat: 12.9696, lng: 80.2435, name: 'Filbey Restaurant, Perungudi' };

interface MapLocationPickerProps {
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
  onConfirm: (loc: {
    lat: number;
    lng: number;
    area: string;
    mapsUrl: string;
    distanceKm: number;
  }) => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    L: any;
  }
}

export default function MapLocationPicker({
  initialLat,
  initialLng,
  initialAddress,
  onConfirm,
  onCancel,
}: MapLocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const deliveryMarkerRef = useRef<any>(null);

  // Center coordinates (starts with initial or Perungudi)
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(() => ({
    lat: initialLat && initialLat !== 12.9696 ? initialLat : 12.9696,
    lng: initialLng && initialLng !== 80.2435 ? initialLng : 80.2435,
  }));

  const [address, setAddress] = useState<string>(initialAddress || 'Locating pin position...');
  const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Calculate distance from Filbey
  const distanceKm = calculateDistanceKm(RESTAURANT.lat, RESTAURANT.lng, coords.lat, coords.lng);
  const isDeliverable = distanceKm <= 15;

  // Reverse geocode given lat & lng
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data && data.address) {
        const parts = [
          data.address.building || data.address.amenity || data.address.house_number,
          data.address.road || data.address.pedestrian,
          data.address.suburb || data.address.neighbourhood || data.address.residential,
          data.address.city_district || data.address.city || 'Chennai',
          data.address.postcode ? `PIN: ${data.address.postcode}` : '',
        ].filter(Boolean);

        const formatted = parts.length > 0 ? parts.join(', ') : data.display_name;
        setAddress(formatted);
      } else if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress(`Pinned Location (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
      }
    } catch (err) {
      setAddress(`Pinned Location (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
    } finally {
      setIsReverseGeocoding(false);
    }
  }, []);

  // Debounced reverse geocoding on coords change
  const geocodeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const triggerGeocode = useCallback((lat: number, lng: number) => {
    if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
    geocodeTimerRef.current = setTimeout(() => {
      reverseGeocode(lat, lng);
    }, 400);
  }, [reverseGeocode]);

  // Load Leaflet dynamically
  useEffect(() => {
    let isCancelled = false;

    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      // Add CSS if not present
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Add Script if not present
      if (!window.L) {
        await new Promise<void>((resolve, reject) => {
          const existingScript = document.getElementById('leaflet-js');
          if (existingScript) {
            existingScript.addEventListener('load', () => resolve());
            return;
          }
          const script = document.createElement('script');
          script.id = 'leaflet-js';
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = () => resolve();
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      if (isCancelled || !mapContainerRef.current) return;

      const L = window.L;
      if (!L) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [coords.lat, coords.lng],
        zoom: 16,
        zoomControl: false,
      });

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Add Zoom control on top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // 1. Restaurant Marker
      const restIcon = L.divIcon({
        className: 'custom-rest-marker',
        html: `<div style="background-color: #5D000C; color: white; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 16px; border: 2.5px solid white;">🍗</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });
      L.marker([RESTAURANT.lat, RESTAURANT.lng], { icon: restIcon })
        .addTo(map)
        .bindPopup('<b>Filbey Restaurant</b><br/>Perungudi OMR Kitchen');

      // 2. Custom Delivery Pin Marker (Interactive & Draggable)
      const deliveryPinIcon = L.divIcon({
        className: 'custom-delivery-pin-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: grab; transform: translate(-50%, -100%);">
            <div style="background: #111827; color: #ffffff; font-weight: 800; font-size: 11px; padding: 3px 9px; border-radius: 9999px; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.4); border: 2px solid #ffffff; margin-bottom: 2px; display: flex; align-items: center; gap: 4px;">
              <span style="color: #ef4444; font-size: 13px;">📍</span> Deliver Here
            </div>
            <div style="width: 38px; height: 38px; background: #dc2626; border: 3px solid white; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 14px rgba(220,38,38,0.5);">
              <div style="width: 14px; height: 14px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
            </div>
            <div style="width: 14px; height: 5px; background: rgba(0,0,0,0.35); border-radius: 50%; filter: blur(1.5px); margin-top: -3px;"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const deliveryMarker = L.marker([coords.lat, coords.lng], {
        icon: deliveryPinIcon,
        draggable: true,
        zIndexOffset: 1000,
      }).addTo(map);

      deliveryMarkerRef.current = deliveryMarker;

      // When marker is dragged
      deliveryMarker.on('dragend', () => {
        const latlng = deliveryMarker.getLatLng();
        setCoords({ lat: latlng.lat, lng: latlng.lng });
        triggerGeocode(latlng.lat, latlng.lng);
      });

      // When map is CLICKED anywhere: Move marker directly to clicked position!
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        setCoords({ lat, lng });
        if (deliveryMarkerRef.current) {
          deliveryMarkerRef.current.setLatLng([lat, lng]);
        }
        map.panTo([lat, lng], { animate: true });
        triggerGeocode(lat, lng);
      });

      mapInstanceRef.current = map;
      setIsMapReady(true);

      // Initial reverse geocode
      triggerGeocode(coords.lat, coords.lng);
    };

    loadLeaflet();

    return () => {
      isCancelled = true;
      if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Use current GPS with high accuracy
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Location services not available on this browser.');
      return;
    }

    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingGPS(false);
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        if (deliveryMarkerRef.current) {
          deliveryMarkerRef.current.setLatLng([latitude, longitude]);
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 17, { animate: true, duration: 1.2 });
        }
        triggerGeocode(latitude, longitude);
      },
      (err) => {
        setIsLocatingGPS(false);
        alert('Could not detect exact GPS position. Please check location permissions or click anywhere on the map.');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // Search places on map
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    setIsSearching(true);
    try {
      const queryWithCity = q.toLowerCase().includes('chennai') ? q : `${q}, Chennai`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryWithCity)}&format=json&addressdetails=1&limit=5`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      setSearchResults(data || []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    setCoords({ lat, lng: lon });
    if (deliveryMarkerRef.current) {
      deliveryMarkerRef.current.setLatLng([lat, lon]);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lon], 17, { animate: true, duration: 1 });
    }
    setSearchResults([]);
    setSearchQuery('');
    triggerGeocode(lat, lon);
  };

  const handleConfirmLocation = () => {
    const mapsUrl = `https://maps.google.com/?q=${coords.lat},${coords.lng}`;
    onConfirm({
      lat: coords.lat,
      lng: coords.lng,
      area: address,
      mapsUrl,
      distanceKm,
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-stone-900/80 backdrop-blur-md justify-end sm:justify-center items-center">
      <div className="relative w-full sm:max-w-xl h-[92vh] sm:h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-200">
        
        {/* Top Header */}
        <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
            </button>
            <div>
              <h3 className="text-sm font-black text-gray-950 tracking-tight flex items-center gap-1.5">
                <span>Set Exact Delivery Location</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-[11px] text-gray-500 font-semibold">
                Tap anywhere on the map or drag the pin to your building/gate
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Search overlay on map */}
        <div className="relative px-3 py-2 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-10 shrink-0">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <span className="absolute left-3 text-red-600 material-symbols-outlined text-lg pointer-events-none font-bold">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apartment, street, landmark in Chennai..."
              className="w-full pl-9 pr-20 py-2 bg-gray-100 rounded-xl text-xs font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-600 border border-transparent focus:border-red-600 transition-all"
            />
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="absolute right-1 px-3 py-1 bg-red-600 text-white rounded-lg text-[11px] font-black uppercase tracking-wider disabled:opacity-40 hover:bg-red-700 transition-colors cursor-pointer"
            >
              {isSearching ? 'Finding...' : 'Search'}
            </button>
          </form>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-3 right-3 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 divide-y divide-gray-100 max-h-48 overflow-y-auto z-30">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full text-left p-2.5 hover:bg-red-50 text-xs flex items-start gap-2 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-red-600 text-base mt-0.5 shrink-0">place</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{item.name || item.display_name.split(',')[0]}</p>
                    <p className="text-[11px] text-gray-500 truncate">{item.display_name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Instruction pill bar right above map */}
        <div className="bg-amber-50 px-3 py-1.5 border-b border-amber-200/80 flex items-center justify-between text-[11px] font-bold text-amber-900 z-10 shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-amber-600 text-sm">touch_app</span>
            <span>Tap anywhere on the map or drag the pin directly</span>
          </span>
          <span className="text-[10px] text-amber-700 font-extrabold uppercase tracking-wide bg-amber-100 px-1.5 py-0.5 rounded">
            Click to Place
          </span>
        </div>

        {/* Interactive Map Canvas */}
        <div className="relative flex-1 w-full bg-slate-100 overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full cursor-crosshair" />

          {/* Floating "Use Exact GPS" Button */}
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocatingGPS}
            className="absolute bottom-4 right-4 z-[500] bg-white hover:bg-gray-50 text-gray-900 px-3.5 py-2.5 rounded-2xl shadow-2xl border-2 border-red-600 flex items-center gap-2 text-xs font-black transition-all transform active:scale-95 cursor-pointer"
          >
            <span className={`material-symbols-outlined text-red-600 text-lg ${isLocatingGPS ? 'animate-spin' : ''}`}>
              {isLocatingGPS ? 'sync' : 'my_location'}
            </span>
            <span>{isLocatingGPS ? 'Locating...' : 'Use My GPS'}</span>
          </button>
        </div>

        {/* Bottom Location Confirmation Sheet */}
        <div className="bg-white px-5 pt-3.5 pb-4 border-t border-gray-200 z-10 shrink-0 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-red-600">pin_drop</span>
                Selected Delivery Spot
              </span>
              <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${isDeliverable ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-red-50 text-red-700 border border-red-300'}`}>
                {formatDistance(distanceKm)} from kitchen ({isDeliverable ? 'Deliverable' : 'Too far'})
              </span>
            </div>

            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 flex items-start gap-2">
              <span className="material-symbols-outlined text-red-600 text-lg mt-0.5 shrink-0">
                {isReverseGeocoding ? 'sync' : 'home_pin'}
              </span>
              <p className={`text-xs font-bold text-gray-950 leading-snug line-clamp-2 ${isReverseGeocoding ? 'opacity-50 animate-pulse' : ''}`}>
                {isReverseGeocoding ? 'Detecting exact street & area name...' : address}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-black transition-colors cursor-pointer border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmLocation}
              disabled={!isDeliverable || isReverseGeocoding}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 px-4 text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <span>Confirm &amp; Use Pin</span>
              <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
