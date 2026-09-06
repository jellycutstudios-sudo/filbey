'use client';

import { useState, useMemo, useRef } from 'react';
import { MENU_DATA, MenuItem } from '@/data/menuData';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

// Swiggy / Zomato Style Customisation Modal for Multi-portion Dishes
function CustomisationModal({
  item,
  onClose,
  getQty,
  onAdd,
  onUpdateQty,
}: {
  item: MenuItem;
  onClose: () => void;
  getQty: (id: string) => number;
  onAdd: (params: { id: string; name: string; priceLabel?: string; price: number; isVeg?: boolean; isSpicy?: boolean }) => void;
  onUpdateQty: (id: string, qty: number) => void;
}) {
  const prices = item.prices || [];
  const [selectedIdx, setSelectedIdx] = useState(0);

  const activeOption = prices[selectedIdx] || prices[0];
  const activeId = `${item.name}__${activeOption?.label}`;
  const currentQty = activeOption ? getQty(activeId) : 0;

  const handleAddSelected = () => {
    if (!activeOption) return;
    onAdd({
      id: activeId,
      name: item.name,
      priceLabel: activeOption.label,
      price: activeOption.price,
      isVeg: item.isVeg,
      isSpicy: item.isSpicy,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden max-h-[88vh] flex flex-col animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-5 border-b border-surface-variant/20 flex items-start justify-between gap-3 bg-surface-container-lowest">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {item.isVeg ? (
                <span className="w-3.5 h-3.5 rounded-[3px] border border-green-600 flex items-center justify-center p-[2px] bg-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                </span>
              ) : (
                <span className="w-3.5 h-3.5 rounded-[3px] border border-red-700 flex items-center justify-center p-[2px] bg-white">
                  <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-red-700"></span>
                </span>
              )}
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Select Option
              </span>
            </div>
            <h3 className="font-extrabold text-lg text-on-surface leading-tight">
              {item.name}
            </h3>
            {item.desc && (
              <p className="text-xs text-on-surface-variant/80 mt-1 line-clamp-2">
                {item.desc}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer flex-shrink-0"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Portions / Variants List */}
        <div className="p-5 overflow-y-auto flex-1 divide-y divide-surface-variant/15">
          <div className="mb-3">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Choose Portion / Size <span className="text-red-500">*</span>
            </h4>
          </div>

          {prices.map((p, idx) => {
            const isSelected = selectedIdx === idx;
            const variantId = `${item.name}__${p.label}`;
            const variantQty = getQty(variantId);

            return (
              <label
                key={p.label}
                onClick={() => setSelectedIdx(idx)}
                className={`flex items-center justify-between py-3.5 px-2 rounded-xl cursor-pointer transition-colors ${
                  isSelected ? 'bg-emerald-50/70' : 'hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Radio Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-surface-variant'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className={`text-sm ${isSelected ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>
                      {p.label}
                    </p>
                    {variantQty > 0 && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {variantQty} already in cart
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-sm text-on-surface">
                    ₹{p.price}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="p-4 border-t border-surface-variant/20 bg-white flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-on-surface-variant uppercase tracking-wider block font-semibold">
              Selected Total
            </span>
            <span className="font-extrabold text-lg text-on-surface">
              ₹{activeOption ? activeOption.price : 0}
            </span>
          </div>

          <button
            onClick={handleAddSelected}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-md uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
          >
            <span>Add to Cart</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Individual Dish Row Component (Swiggy Style)
function DishOrderRow({
  item,
  getQty,
  onAdd,
  onUpdateQty,
  onOpenCustomise,
}: {
  item: MenuItem;
  getQty: (id: string) => number;
  onAdd: (params: { id: string; name: string; priceLabel?: string; price: number; isVeg?: boolean; isSpicy?: boolean }) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onOpenCustomise: (item: MenuItem) => void;
}) {
  const isMultiPrice = Boolean(item.prices && item.prices.length > 0);

  // Compute starting/lowest price
  const displayPrice = isMultiPrice && item.prices
    ? Math.min(...item.prices.map(p => p.price))
    : (item.price ?? 0);

  // Compute total quantity for this dish
  const totalQty = isMultiPrice && item.prices
    ? item.prices.reduce((sum, p) => sum + getQty(`${item.name}__${p.label}`), 0)
    : getQty(item.name);

  const handleAddSingle = () => {
    onAdd({
      id: item.name,
      name: item.name,
      price: item.price ?? 0,
      isVeg: item.isVeg,
      isSpicy: item.isSpicy,
    });
  };

  return (
    <div className="group flex items-start justify-between gap-4 py-6 border-b border-surface-variant/20 last:border-b-0 transition-colors">
      {/* Left Column: Dish Info */}
      <div className="flex-1 min-w-0 pr-2">
        {/* Dietary Icon + Badges */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {item.isVeg ? (
            <span
              className="w-4 h-4 rounded-[4px] border border-green-600 flex items-center justify-center p-[2px] flex-shrink-0 bg-white shadow-2xs"
              title="Pure Veg"
            >
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
            </span>
          ) : (
            <span
              className="w-4 h-4 rounded-[4px] border border-red-700 flex items-center justify-center p-[2px] flex-shrink-0 bg-white shadow-2xs"
              title="Non-Veg"
            >
              <span className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-red-700"></span>
            </span>
          )}

          {/* Badges */}
          {item.badge === 'BEST SELLER' && (
            <span className="bg-amber-50 text-amber-800 border border-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ⭐ BESTSELLER
            </span>
          )}
          {item.badge === 'POPULAR' && (
            <span className="bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ★ POPULAR
            </span>
          )}
          {item.badge === 'HOT' && (
            <span className="bg-red-50 text-red-700 border border-red-200 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
              🔥 SPICY
            </span>
          )}
          {item.badge === 'SIGNATURE' && (
            <span className="bg-primary/10 text-primary border border-primary/25 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
              👑 SIGNATURE
            </span>
          )}
        </div>

        {/* Dish Name */}
        <h3 className="font-bold text-base md:text-lg text-on-surface leading-snug group-hover:text-primary transition-colors">
          {item.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-extrabold text-base md:text-lg text-on-surface">
            ₹{displayPrice}
          </span>
          {isMultiPrice && (
            <span className="text-[11px] text-on-surface-variant font-medium">
              (Starts from)
            </span>
          )}
        </div>

        {/* Rating */}
        {item.isPopular && (
          <div className="flex items-center gap-1 mt-1 text-xs text-green-800 font-bold">
            <span className="text-green-700">★ 5.0</span>
            <span className="text-on-surface-variant font-normal text-[11px]">(24)</span>
          </div>
        )}

        {/* Description */}
        {item.desc && (
          <p className="text-xs md:text-sm text-on-surface-variant/80 mt-2 line-clamp-2 leading-relaxed max-w-xl">
            {item.desc}
          </p>
        )}
      </div>

      {/* Right Column: Dish Photo & Floating Add Button */}
      <div className="relative flex-shrink-0 w-32 md:w-38 flex flex-col items-center pb-3">
        <div className="relative w-32 h-28 md:w-36 md:h-30 rounded-2xl overflow-hidden bg-surface-container border border-surface-variant/20 shadow-xs flex items-center justify-center">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-container-low text-primary/30">
              <span className="material-symbols-outlined text-4xl">restaurant</span>
            </div>
          )}
        </div>

        {/* Floating ADD Button / Stepper (Swiggy / Zomato style) */}
        <div className="absolute -bottom-2 z-10 flex flex-col items-center">
          {isMultiPrice ? (
            /* Multi-portion item -> opens customisation modal */
            totalQty === 0 ? (
              <button
                onClick={() => onOpenCustomise(item)}
                className="bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 border-2 border-emerald-600 font-extrabold text-xs md:text-sm px-6 py-1.5 rounded-xl shadow-md uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all cursor-pointer select-none"
              >
                ADD <span className="text-sm font-normal leading-none">+</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenCustomise(item)}
                className="bg-emerald-700 text-white font-bold text-xs md:text-sm px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <span>{totalQty} in cart</span>
                <span className="material-symbols-outlined text-xs">edit</span>
              </button>
            )
          ) : (
            /* Single-portion item -> direct ADD / stepper */
            totalQty === 0 ? (
              <button
                onClick={handleAddSingle}
                className="bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 border-2 border-emerald-600 font-extrabold text-xs md:text-sm px-6 py-1.5 rounded-xl shadow-md uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all cursor-pointer select-none"
              >
                ADD <span className="text-sm font-normal leading-none">+</span>
              </button>
            ) : (
              <div className="flex items-center justify-between gap-2.5 bg-emerald-700 text-white rounded-xl px-2.5 py-1 shadow-md min-w-[84px]">
                <button
                  onClick={() => onUpdateQty(item.name, totalQty - 1)}
                  className="w-6 h-6 flex items-center justify-center font-bold text-base hover:bg-emerald-800 rounded transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="font-bold text-xs md:text-sm">{totalQty}</span>
                <button
                  onClick={() => onUpdateQty(item.name, totalQty + 1)}
                  className="w-6 h-6 flex items-center justify-center font-bold text-base hover:bg-emerald-800 rounded transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )
          )}

          {isMultiPrice && (
            <span className="text-[10px] text-neutral-500 font-semibold mt-1 tracking-tight select-none">
              Customisable
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderMenuClient({ onProceed }: { onProceed: () => void }) {
  const {
    items,
    subtotal,
    deliveryInfo,
    addItem,
    updateQty,
    itemCount,
  } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [customiseItem, setCustomiseItem] = useState<MenuItem | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dealsScrollRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  const MIN_ORDER = 149;

  const toggleCategory = (catId: string) => {
    setCollapsedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const scrollDeals = (direction: 'left' | 'right') => {
    if (dealsScrollRef.current) {
      dealsScrollRef.current.scrollBy({
        left: direction === 'left' ? -260 : 260,
        behavior: 'smooth',
      });
    }
  };

  const scrollToCategory = (catId: string) => {
    setCollapsedCategories(prev => ({ ...prev, [catId]: false }));
    setMenuModalOpen(false);

    setTimeout(() => {
      const el = categoryRefs.current[catId];
      if (el) {
        const yOffset = -90;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  const getQty = (id: string) => {
    const found = items.find(i => i.id === id);
    return found ? found.quantity : 0;
  };

  const filteredMenu = useMemo(() => {
    return MENU_DATA.map(cat => ({
      ...cat,
      items: cat.items.filter(item => {
        const matchSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        if (!matchSearch) return false;

        if (activeFilter === 'VEG') return Boolean(item.isVeg);
        if (activeFilter === 'NON_VEG') return !item.isVeg;
        return true;
      }),
    })).filter(cat => cat.items.length > 0);
  }, [searchTerm, activeFilter]);

  const meetsMinOrder = subtotal >= MIN_ORDER;

  return (
    <div className="max-w-3xl mx-auto px-4 mt-3 pb-36 font-sans">

      {/* ── Top Header (Filbey Title & Search Icon) ── */}
      <div className="flex items-center justify-between pt-2 pb-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
            Filbey
          </h1>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
            {deliveryInfo?.locationName ? `Delivering to ${deliveryInfo.locationName} · 30–45 mins` : 'Open daily 11:30 AM – 11:30 PM'}
          </p>
        </div>
        <button
          onClick={() => searchInputRef.current?.focus()}
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
          aria-label="Focus search"
        >
          <span className="material-symbols-outlined text-xl">search</span>
        </button>
      </div>

      {/* ── Deals For You Section ── */}
      <section className="mt-3 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface tracking-tight">
            Deals for you
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollDeals('left')}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all cursor-pointer"
              aria-label="Scroll left"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
            </button>
            <button
              onClick={() => scrollDeals('right')}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all cursor-pointer"
              aria-label="Scroll right"
            >
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Horizontal Deals Carousel */}
        <div
          ref={dealsScrollRef}
          className="flex gap-3.5 overflow-x-auto no-scrollbar scroll-smooth pb-1 -mx-4 px-4"
        >
          {/* Deal Card 1: 1st Order ₹30 OFF */}
          <div className="min-w-[260px] md:min-w-[280px] bg-white border border-surface-variant/30 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-orange-500 text-white flex flex-col items-center justify-center flex-shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-lg leading-none">stars</span>
              <span className="text-[8px] font-extrabold tracking-tighter uppercase leading-none mt-0.5">OFFER</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-sm text-on-surface leading-tight truncate">
                ₹30 Off First Order
              </h3>
              <p className="text-[11px] text-on-surface-variant font-medium mt-0.5 truncate uppercase tracking-wider">
                ON DIRECT ORDERS ₹399+
              </p>
            </div>
          </div>

          {/* Deal Card 2: Free Delivery */}
          <div className="min-w-[260px] md:min-w-[280px] bg-white border border-surface-variant/30 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex flex-col items-center justify-center flex-shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-lg leading-none">local_shipping</span>
              <span className="text-[8px] font-extrabold tracking-tighter uppercase leading-none mt-0.5">FREE</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-sm text-on-surface leading-tight truncate">
                Free Delivery
              </h3>
              <p className="text-[11px] text-on-surface-variant font-medium mt-0.5 truncate uppercase tracking-wider">
                ON ORDERS ABOVE ₹499
              </p>
            </div>
          </div>

          {/* Deal Card 3: Direct Pricing */}
          <div className="min-w-[260px] md:min-w-[280px] bg-white border border-surface-variant/30 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-primary text-white flex flex-col items-center justify-center flex-shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-lg leading-none">percent</span>
              <span className="text-[8px] font-extrabold tracking-tighter uppercase leading-none mt-0.5">DIRECT</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-sm text-on-surface leading-tight truncate">
                Zero Surge Pricing
              </h3>
              <p className="text-[11px] text-on-surface-variant font-medium mt-0.5 truncate uppercase tracking-wider">
                SAVE ₹40-80 PER ORDER
              </p>
            </div>
          </div>

          {/* Deal Card 4: Value Meals */}
          <div className="min-w-[260px] md:min-w-[280px] bg-white border border-surface-variant/30 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-amber-600 text-white flex flex-col items-center justify-center flex-shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-lg leading-none">lunch_dining</span>
              <span className="text-[8px] font-extrabold tracking-tighter uppercase leading-none mt-0.5">MEALS</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-sm text-on-surface leading-tight truncate">
                Value Meals At ₹149
              </h3>
              <p className="text-[11px] text-on-surface-variant font-medium mt-0.5 truncate uppercase tracking-wider">
                BURGER + FRIES + DRINK
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capsule Search Bar ── */}
      <div className="mb-4">
        <div className="relative w-full bg-[#f1f1f5] hover:bg-[#eaeaf0] transition-colors rounded-2xl px-4 py-3 flex items-center gap-3">
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search for dishes"
            className="w-full bg-transparent text-sm text-on-surface placeholder:text-neutral-500 focus:outline-none"
          />
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="text-on-surface-variant/60 hover:text-primary transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          ) : (
            <span className="material-symbols-outlined text-neutral-400 text-xl pointer-events-none">
              search
            </span>
          )}
        </div>
      </div>

      {/* ── Veg & Non-Veg Toggle Switches ── */}
      <div className="flex items-center gap-3 mb-6 pb-2 border-b border-surface-variant/20">
        <button
          onClick={() => setActiveFilter(prev => prev === 'VEG' ? 'ALL' : 'VEG')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer select-none ${
            activeFilter === 'VEG'
              ? 'bg-green-50 border-green-600 text-green-800 shadow-2xs'
              : 'bg-white border-surface-variant/30 text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span className="w-4 h-4 rounded-[3px] border border-green-600 flex items-center justify-center p-[2px] bg-white">
            <span className="w-2 h-2 rounded-full bg-green-600"></span>
          </span>
          <span className="text-xs font-bold">Veg</span>
          <div className={`w-6 h-3.5 rounded-full p-0.5 transition-colors ${activeFilter === 'VEG' ? 'bg-green-600' : 'bg-neutral-300'}`}>
            <div className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${activeFilter === 'VEG' ? 'translate-x-2.5' : 'translate-x-0'}`} />
          </div>
        </button>

        <button
          onClick={() => setActiveFilter(prev => prev === 'NON_VEG' ? 'ALL' : 'NON_VEG')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer select-none ${
            activeFilter === 'NON_VEG'
              ? 'bg-red-50 border-red-700 text-red-800 shadow-2xs'
              : 'bg-white border-surface-variant/30 text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span className="w-4 h-4 rounded-[3px] border border-red-700 flex items-center justify-center p-[2px] bg-white">
            <span className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-red-700"></span>
          </span>
          <span className="text-xs font-bold">Non-Veg</span>
          <div className={`w-6 h-3.5 rounded-full p-0.5 transition-colors ${activeFilter === 'NON_VEG' ? 'bg-red-700' : 'bg-neutral-300'}`}>
            <div className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${activeFilter === 'NON_VEG' ? 'translate-x-2.5' : 'translate-x-0'}`} />
          </div>
        </button>

        {activeFilter !== 'ALL' && (
          <button
            onClick={() => setActiveFilter('ALL')}
            className="text-xs text-primary font-bold hover:underline ml-auto cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* ── Category Sections ── */}
      <div className="flex flex-col gap-6">
        {filteredMenu.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-surface-variant/20 shadow-xs">
            <span className="material-symbols-outlined text-5xl text-primary/30 mb-3 block">search_off</span>
            <h3 className="font-bold text-lg text-on-surface">No dishes found</h3>
            <p className="text-on-surface-variant text-xs mt-1">Try resetting your search or veg/non-veg filter.</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveFilter('ALL'); }}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-full text-xs font-bold hover:bg-primary-container transition-colors cursor-pointer"
            >
              Show All Dishes
            </button>
          </div>
        ) : (
          filteredMenu.map(cat => {
            const isCollapsed = Boolean(collapsedCategories[cat.id]);

            return (
              <section
                key={cat.id}
                ref={el => { categoryRefs.current[cat.id] = el; }}
                className="scroll-mt-24 border-b-8 border-surface-container-low pb-2"
              >
                {/* Accordion Category Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between py-3 cursor-pointer select-none text-left group"
                >
                  <h2 className="text-xl md:text-2xl font-extrabold text-on-surface tracking-tight group-hover:text-primary transition-colors">
                    {cat.title} ({cat.items.length})
                  </h2>
                  <span
                    className={`material-symbols-outlined text-2xl text-on-surface-variant transition-transform duration-300 ${
                      isCollapsed ? 'rotate-180' : ''
                    }`}
                  >
                    keyboard_arrow_up
                  </span>
                </button>

                {/* Dish Item Rows */}
                {!isCollapsed && (
                  <div className="divide-y divide-surface-variant/20">
                    {cat.items.map(item => (
                      <DishOrderRow
                        key={item.name}
                        item={item}
                        getQty={getQty}
                        onAdd={addItem}
                        onUpdateQty={updateQty}
                        onOpenCustomise={(it) => setCustomiseItem(it)}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>

      {/* ── Customisation Modal for Multi-Portion Dishes (Swiggy Style) ── */}
      {customiseItem && (
        <CustomisationModal
          item={customiseItem}
          onClose={() => setCustomiseItem(null)}
          getQty={getQty}
          onAdd={addItem}
          onUpdateQty={updateQty}
        />
      )}

      {/* ── Floating "MENU 🍴" Quick Jump Button ── */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setMenuModalOpen(true)}
          className="bg-[#1c1c27] hover:bg-black text-white px-4 py-2.5 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.35)] flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">restaurant_menu</span>
          <span>MENU</span>
        </button>
      </div>

      {/* ── Category Quick Jump Modal / Drawer ── */}
      {menuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMenuModalOpen(false)}
          />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-surface-variant/20 mb-3">
              <h3 className="font-extrabold text-lg text-on-surface">Menu Categories</h3>
              <button
                onClick={() => setMenuModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="overflow-y-auto flex flex-col gap-2 py-1">
              {MENU_DATA.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container-low transition-colors text-left group cursor-pointer"
                >
                  <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                    {cat.title}
                  </span>
                  <span className="text-xs font-semibold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">
                    {cat.items.length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Floating Cart Bar ── */}
      {itemCount > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-lg">
          <button
            id="view-cart-btn"
            onClick={() => setCartOpen(true)}
            className="w-full bg-[#1ba672] hover:bg-[#158f61] text-white rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgba(27,166,114,0.35)] transition-all cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <span className="bg-white/20 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg">
                {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'}
              </span>
              <span className="font-extrabold text-base">₹{subtotal}</span>
            </div>
            <div className="flex items-center gap-1.5 font-extrabold text-sm uppercase tracking-wider">
              <span>View Cart</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onProceed={() => { setCartOpen(false); onProceed(); }}
        meetsMinOrder={meetsMinOrder}
        minOrder={MIN_ORDER}
      />
    </div>
  );
}
