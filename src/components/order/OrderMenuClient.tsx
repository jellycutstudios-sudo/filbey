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
        <div className="p-5 overflow-y-auto flex-1 divide-y divide-stone-200">
          <div className="mb-3">
            <h4 className="text-xs font-extrabold text-stone-800 uppercase tracking-wider">
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
                className={`flex items-center justify-between py-3.5 px-3 rounded-xl cursor-pointer transition-colors ${
                  isSelected ? 'bg-emerald-50 border-2 border-emerald-600' : 'hover:bg-stone-100 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Radio Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-stone-400'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className={`text-sm ${isSelected ? 'font-black text-stone-950' : 'font-bold text-stone-800'}`}>
                      {p.label}
                    </p>
                    {variantQty > 0 && (
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        {variantQty} already in cart
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-base text-stone-950">
                    ₹{p.price}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="p-4 border-t-2 border-stone-200 bg-white flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-stone-700 uppercase tracking-wider block font-bold">
              Selected Total
            </span>
            <span className="font-black text-xl text-stone-950">
              ₹{activeOption ? activeOption.price : 0}
            </span>
          </div>

          <button
            onClick={handleAddSelected}
            className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm py-3.5 px-6 rounded-2xl shadow-md uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
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
    <div className="group flex items-start justify-between gap-4 py-6 border-b border-stone-200/90 last:border-b-0 transition-colors">
      {/* Left Column: Dish Info */}
      <div className="flex-1 min-w-0 pr-2">
        {/* Dietary Icon + Badges */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {item.isVeg ? (
            <span
              className="w-4 h-4 rounded-[4px] border-2 border-green-700 flex items-center justify-center p-[2px] flex-shrink-0 bg-white shadow-2xs"
              title="Pure Veg"
            >
              <span className="w-2 h-2 rounded-full bg-green-700"></span>
            </span>
          ) : (
            <span
              className="w-4 h-4 rounded-[4px] border-2 border-red-700 flex items-center justify-center p-[2px] flex-shrink-0 bg-white shadow-2xs"
              title="Non-Veg"
            >
              <span className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-red-700"></span>
            </span>
          )}

          {/* Badges */}
          {item.badge === 'BEST SELLER' && (
            <span className="bg-amber-100 text-amber-950 border border-amber-400 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs">
              ⭐ BESTSELLER
            </span>
          )}
          {item.badge === 'POPULAR' && (
            <span className="bg-amber-100 text-amber-950 border border-amber-400 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs">
              ★ POPULAR
            </span>
          )}
          {item.badge === 'HOT' && (
            <span className="bg-red-100 text-red-950 border border-red-400 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs">
              🔥 SPICY
            </span>
          )}
          {item.badge === 'SIGNATURE' && (
            <span className="bg-primary/15 text-primary border border-primary/40 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs">
              👑 SIGNATURE
            </span>
          )}
        </div>

        {/* Dish Name */}
        <h3 className="font-black text-base md:text-lg text-stone-950 leading-snug group-hover:text-primary transition-colors">
          {item.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-black text-lg md:text-xl text-stone-950">
            ₹{displayPrice}
          </span>
          {isMultiPrice && (
            <span className="text-xs text-stone-600 font-bold">
              (Starts from)
            </span>
          )}
        </div>

        {/* Rating */}
        {item.isPopular && (
          <div className="flex items-center gap-1 mt-1 text-xs text-emerald-800 font-black">
            <span className="text-emerald-700">★ 5.0</span>
            <span className="text-stone-600 font-bold text-xs">(24)</span>
          </div>
        )}

        {/* Description */}
        {item.desc && (
          <p className="text-xs md:text-sm text-stone-700 font-medium mt-1.5 line-clamp-2 leading-relaxed max-w-xl">
            {item.desc}
          </p>
        )}
      </div>

      {/* Right Column: Dish Photo & Floating Add Button */}
      <div className="relative flex-shrink-0 w-32 md:w-38 flex flex-col items-center pb-3">
        <div className="relative w-32 h-28 md:w-36 md:h-30 rounded-2xl overflow-hidden bg-stone-100 border-2 border-stone-200/90 shadow-xs flex items-center justify-center">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">
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
                className="bg-white hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 border-2 border-emerald-600 font-black text-xs md:text-sm px-6 py-1.5 rounded-xl shadow-md uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all cursor-pointer select-none"
              >
                ADD <span className="text-sm font-black leading-none">+</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenCustomise(item)}
                className="bg-emerald-800 text-white font-black text-xs md:text-sm px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
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
                className="bg-white hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 border-2 border-emerald-600 font-black text-xs md:text-sm px-6 py-1.5 rounded-xl shadow-md uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all cursor-pointer select-none"
              >
                ADD <span className="text-sm font-black leading-none">+</span>
              </button>
            ) : (
              <div className="flex items-center justify-between gap-2.5 bg-emerald-800 text-white rounded-xl px-2.5 py-1 shadow-md min-w-[84px]">
                <button
                  onClick={() => onUpdateQty(item.name, totalQty - 1)}
                  className="w-6 h-6 flex items-center justify-center font-bold text-base hover:bg-emerald-900 rounded transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="font-extrabold text-xs md:text-sm">{totalQty}</span>
                <button
                  onClick={() => onUpdateQty(item.name, totalQty + 1)}
                  className="w-6 h-6 flex items-center justify-center font-bold text-base hover:bg-emerald-900 rounded transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )
          )}

          {isMultiPrice && (
            <span className="text-[10px] text-stone-600 font-extrabold mt-1 tracking-tight select-none">
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
  const [customiseItem, setCustomiseItem] = useState<MenuItem | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const MIN_ORDER = 149;

  const toggleCategory = (catId: string) => {
    setCollapsedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
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

      {/* ── Compact Delivery Header & Offer Strip ── */}
      <div className="pt-2 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-stone-200 mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            moped
          </span>
          <div className="min-w-0">
            <p className="text-xs font-black text-stone-950 truncate">
              {deliveryInfo?.locationName ? `Delivering to ${deliveryInfo.locationName}` : 'Delivering in Perungudi, OMR'}
            </p>
            <p className="text-xs text-stone-700 font-semibold">30–45 mins · Live Kitchen</p>
          </div>
        </div>

        {/* Slim 1-Line Offer Pill */}
        <div className="inline-flex items-center gap-1.5 bg-white border-2 border-amber-400 px-3 py-1 rounded-full text-xs font-black text-stone-950 w-fit shadow-xs">
          <span className="material-symbols-outlined text-amber-600 text-sm font-bold">sell</span>
          <span className="text-amber-950 font-black">₹30 OFF First Order (₹399+)</span>
          <span className="text-stone-300 font-black">•</span>
          <span className="text-emerald-800 font-black">Free Del ₹499+</span>
        </div>
      </div>

      {/* ── Compact Search & Dietary Filter Row ── */}
      <div className="flex items-center gap-2 mb-4">
        {/* Search Input */}
        <div className="relative flex-1 h-11 bg-white hover:border-stone-400 focus-within:border-stone-900 focus-within:ring-2 focus-within:ring-stone-900/10 transition-all rounded-2xl px-3.5 flex items-center gap-2.5 border-2 border-stone-300 shadow-xs">
          <span className="material-symbols-outlined text-stone-700 text-lg pointer-events-none shrink-0 font-bold">
            search
          </span>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search dishes..."
            className="w-full bg-transparent border-0 border-none p-0 text-xs sm:text-sm text-stone-950 placeholder:text-stone-500 font-semibold focus:ring-0 focus:outline-none focus:border-0 shadow-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-stone-600 hover:text-stone-950 transition-colors cursor-pointer shrink-0 p-0.5"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>

        {/* Veg Filter Chip */}
        <button
          onClick={() => setActiveFilter(prev => prev === 'VEG' ? 'ALL' : 'VEG')}
          className={`h-11 flex items-center gap-1.5 px-3 rounded-2xl border-2 transition-all cursor-pointer select-none font-bold text-xs shrink-0 focus:outline-none focus:ring-0 shadow-xs ${
            activeFilter === 'VEG'
              ? 'bg-emerald-700 border-emerald-700 text-white'
              : 'bg-white border-stone-300 text-stone-900 hover:border-emerald-600'
          }`}
        >
          <span className="w-3.5 h-3.5 rounded-[3px] border-2 border-emerald-600 flex items-center justify-center p-[1px] bg-white shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          </span>
          <span>Veg</span>
        </button>

        {/* Non-Veg Filter Chip */}
        <button
          onClick={() => setActiveFilter(prev => prev === 'NON_VEG' ? 'ALL' : 'NON_VEG')}
          className={`h-11 flex items-center gap-1.5 px-3 rounded-2xl border-2 transition-all cursor-pointer select-none font-bold text-xs shrink-0 focus:outline-none focus:ring-0 shadow-xs ${
            activeFilter === 'NON_VEG'
              ? 'bg-red-800 border-red-800 text-white'
              : 'bg-white border-stone-300 text-stone-900 hover:border-red-700'
          }`}
        >
          <span className="w-3.5 h-3.5 rounded-[3px] border-2 border-red-700 flex items-center justify-center p-[1px] bg-white shrink-0">
            <span className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[5.5px] border-b-red-700"></span>
          </span>
          <span>Non-Veg</span>
        </button>

        {activeFilter !== 'ALL' && (
          <button
            onClick={() => setActiveFilter('ALL')}
            className="text-xs text-primary font-black hover:underline shrink-0 cursor-pointer px-1"
          >
            Reset
          </button>
        )}
      </div>

      {/* ── Category Sections ── */}
      <div className="flex flex-col gap-6">
        {filteredMenu.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-stone-200 shadow-xs">
            <span className="material-symbols-outlined text-5xl text-primary/30 mb-3 block">search_off</span>
            <h3 className="font-black text-lg text-stone-950">No dishes found</h3>
            <p className="text-stone-700 text-xs mt-1 font-medium">Try resetting your search or veg/non-veg filter.</p>
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
                className="scroll-mt-24 border-b-4 border-stone-200/80 pb-2"
              >
                {/* Accordion Category Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between py-3 cursor-pointer select-none text-left group"
                >
                  <h2 className="text-xl md:text-2xl font-black text-stone-950 tracking-tight group-hover:text-primary transition-colors">
                    {cat.title} ({cat.items.length})
                  </h2>
                  <span
                    className={`material-symbols-outlined text-2xl text-stone-900 font-bold transition-transform duration-300 ${
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

      {/* ── Floating Cart Bar ── */}

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
