'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { MENU_DATA, MenuItem } from '@/data/menuData';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

// Individual Zomato / Swiggy Dish Card Component
function DishOrderCard({
  item,
  getQty,
  onAdd,
  onUpdateQty,
}: {
  item: MenuItem;
  getQty: (id: string) => number;
  onAdd: (params: { id: string; name: string; priceLabel?: string; price: number; isVeg?: boolean; isSpicy?: boolean }) => void;
  onUpdateQty: (id: string, qty: number) => void;
}) {
  // If item has multiple portions/prices, track selected variant index
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const isMultiPrice = Boolean(item.prices && item.prices.length > 0);
  const activeVariant = isMultiPrice && item.prices ? item.prices[selectedVariantIdx] : null;

  const currentId = activeVariant ? `${item.name}__${activeVariant.label}` : item.name;
  const currentPrice = activeVariant ? activeVariant.price : (item.price ?? 0);
  const currentQty = getQty(currentId);

  const handleAdd = () => {
    onAdd({
      id: currentId,
      name: item.name,
      priceLabel: activeVariant ? activeVariant.label : undefined,
      price: currentPrice,
      isVeg: item.isVeg,
      isSpicy: item.isSpicy,
    });
  };

  return (
    <div className="group bg-white rounded-2xl p-4 border border-surface-variant/20 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative">
      <div className="flex items-start justify-between gap-3">
        {/* Left Column: Dish Info */}
        <div className="flex-1 min-w-0 pr-1">
          {/* Badges & Dietary Icon */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {/* Veg / Non-Veg Icon */}
            {item.isVeg ? (
              <span
                className="w-4 h-4 rounded-[4px] border border-green-600 flex items-center justify-center p-[2px] flex-shrink-0 bg-white"
                title="Pure Veg"
              >
                <span className="w-2 h-2 rounded-full bg-green-600"></span>
              </span>
            ) : (
              <span
                className="w-4 h-4 rounded-[4px] border border-red-700 flex items-center justify-center p-[2px] flex-shrink-0 bg-white"
                title="Non-Veg"
              >
                <span className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-red-700"></span>
              </span>
            )}

            {/* Badges */}
            {item.badge === 'BEST SELLER' && (
              <span className="bg-amber-50 text-amber-800 border border-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
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
            {item.badge === 'SPECIAL' && (
              <span className="bg-pink-50 text-pink-700 border border-pink-200 font-bold text-[10px] px-2 py-0.5 rounded-full">
                ✨ SPECIAL
              </span>
            )}
          </div>

          {/* Dish Title */}
          <h3 className="font-headline-md text-base md:text-lg text-on-surface font-bold leading-snug group-hover:text-primary transition-colors">
            {item.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-extrabold text-base md:text-lg text-on-surface">
              ₹{currentPrice}
            </span>
            {isMultiPrice && (
              <span className="text-xs text-on-surface-variant font-medium">
                ({activeVariant?.label})
              </span>
            )}
          </div>

          {/* Variant Selector for Multi-price Items */}
          {isMultiPrice && item.prices && (
            <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
              {item.prices.map((p, idx) => {
                const variantId = `${item.name}__${p.label}`;
                const variantQty = getQty(variantId);
                const isSelected = selectedVariantIdx === idx;
                return (
                  <button
                    key={p.label}
                    onClick={() => setSelectedVariantIdx(idx)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary-fixed/20 text-primary font-bold shadow-xs'
                        : 'border-surface-variant/30 text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <span>{p.label} · ₹{p.price}</span>
                    {variantQty > 0 && (
                      <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {variantQty}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Description */}
          {item.desc && (
            <p className="text-xs md:text-sm text-on-surface-variant/80 mt-1.5 line-clamp-2 leading-relaxed">
              {item.desc}
            </p>
          )}
        </div>

        {/* Right Column: Dish Photo & Floating Add Button */}
        <div className="relative flex-shrink-0 w-28 md:w-36 flex flex-col items-center pt-1">
          {/* Image Container */}
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-white border border-surface-variant/20 shadow-xs flex items-center justify-center">
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
          <div className="-mt-4 z-10 w-full flex justify-center px-1">
            {currentQty === 0 ? (
              <button
                onClick={handleAdd}
                className="bg-white hover:bg-green-50 text-green-700 hover:text-green-800 border-2 border-green-600 font-extrabold text-xs px-5 py-1.5 rounded-xl shadow-md uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                ADD <span className="text-sm font-normal leading-none">+</span>
              </button>
            ) : (
              <div className="flex items-center justify-between gap-2 bg-green-700 text-white rounded-xl px-2 py-1 shadow-md w-24">
                <button
                  onClick={() => onUpdateQty(currentId, currentQty - 1)}
                  className="w-6 h-6 flex items-center justify-center font-bold text-base hover:bg-green-800 rounded transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="font-bold text-sm text-center select-none">{currentQty}</span>
                <button
                  onClick={handleAdd}
                  className="w-6 h-6 flex items-center justify-center font-bold text-base hover:bg-green-800 rounded transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )}
          </div>

          {isMultiPrice && (
            <span className="text-[10px] text-on-surface-variant/70 mt-1 font-medium select-none">
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
    addItem,
    updateQty,
    items,
    itemCount,
    subtotal,
    deliveryInfo,
    baseDeliveryFee,
    isFreeDelivery,
    amountNeededForFreeDelivery,
    discount,
  } = useCart();

  const [activeCategory, setActiveCategory] = useState(MENU_DATA[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'VEG' | 'SPICY' | 'POPULAR'>('ALL');
  const [cartOpen, setCartOpen] = useState(false);
  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const MIN_ORDER = 299;

  const getQty = (id: string) => items.find(i => i.id === id)?.quantity ?? 0;

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    const el = categoryRefs.current[id];
    if (el) {
      const yOffset = -140;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Track active category on scroll
  useEffect(() => {
    const handle = () => {
      const scrollY = window.scrollY + 160;
      for (const cat of MENU_DATA) {
        const ref = categoryRefs.current[cat.id];
        if (ref) {
          const top = ref.offsetTop;
          const height = ref.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveCategory(cat.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const filteredMenu = useMemo(() => {
    return MENU_DATA.map(cat => ({
      ...cat,
      items: cat.items.filter(item => {
        const matchSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        if (!matchSearch) return false;
        if (activeFilter === 'VEG') return item.isVeg;
        if (activeFilter === 'SPICY') return item.isSpicy;
        if (activeFilter === 'POPULAR') return item.isPopular;
        return true;
      }),
    })).filter(cat => cat.items.length > 0);
  }, [searchTerm, activeFilter]);

  const meetsMinOrder = subtotal >= MIN_ORDER;

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-4 pb-40">

      {/* Page title */}
      <section className="text-center mb-4 mt-2">
        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg text-primary uppercase">
          Build Your Order
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Delivering to: <strong>{deliveryInfo?.locationName ?? 'Your location'}</strong> ·{' '}
          {isFreeDelivery ? (
            <span className="text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
              Delivery FREE (Above ₹499)
            </span>
          ) : (
            <span className="text-primary font-semibold">Delivery ₹{baseDeliveryFee}</span>
          )}
        </p>
      </section>

      {/* Promotional progress bar */}
      <div className="bg-gradient-to-r from-primary/5 via-secondary-container/20 to-primary/5 border border-primary/15 rounded-2xl p-3 mb-5 max-w-xl mx-auto shadow-sm">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-sm">local_shipping</span>
            {isFreeDelivery ? (
              <span className="text-green-700 font-bold">🎉 FREE Delivery Unlocked!</span>
            ) : (
              <span>
                Add <strong className="text-primary">₹{amountNeededForFreeDelivery}</strong> more for <strong>FREE Delivery</strong>
              </span>
            )}
          </span>
          <span className="text-[11px] font-bold text-on-surface-variant">
            {subtotal >= 499 ? '100%' : `${Math.min(100, Math.round((subtotal / 499) * 100))}%`}
          </span>
        </div>
        <div className="w-full bg-surface-variant/30 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.round((subtotal / 499) * 100))}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-on-surface-variant mt-2 pt-1.5 border-t border-surface-variant/20">
          <span>🎁 <strong>₹30 OFF</strong> on 1st direct order (min ₹399)</span>
          {discount > 0 && (
            <span className="text-green-700 font-bold bg-green-100/70 text-[10px] px-2 py-0.5 rounded-full">
              ₹30 Discount Applied
            </span>
          )}
        </div>
      </div>

      {/* Search + filters */}
      <div className="bg-surface-container/60 backdrop-blur-md sticky top-20 z-40 py-3 px-4 rounded-2xl flex flex-col md:flex-row gap-3 justify-between items-center shadow-sm border border-surface-variant/20 mb-6">
        <div className="relative w-full md:max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-lg">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search dishes or ingredients…"
            className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-surface-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-primary cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
          {([
            { id: 'ALL', label: 'All Dishes', icon: 'menu_book' },
            { id: 'VEG', label: 'Pure Veg 🌱', icon: 'local_pizza' },
            { id: 'SPICY', label: 'Spicy 🌶️', icon: 'local_fire_department' },
            { id: 'POPULAR', label: 'Popular ★', icon: 'grade' },
          ] as const).map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-label-lg text-label-lg text-xs transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'bg-white text-on-surface-variant border border-surface-variant/20 hover:bg-surface-container'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">

        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-[160px] bg-white rounded-2xl p-4 border border-surface-variant/10 shadow-sm">
          <h3 className="font-headline-md text-xl text-primary uppercase border-b border-surface-variant/20 pb-2 mb-3 px-2">
            Categories
          </h3>
          <nav className="flex flex-col gap-1">
            {MENU_DATA.map(cat => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl font-label-lg text-label-lg transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-primary-fixed text-primary font-bold border-l-4 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                {cat.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile category pills */}
        <div className="lg:hidden w-full overflow-x-auto no-scrollbar flex gap-2 pb-2 mb-2 sticky top-[135px] z-30 bg-background py-2">
          {MENU_DATA.map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap font-label-lg text-xs transition-all shadow-sm flex-shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-on-surface-variant border border-surface-variant/20'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{cat.icon}</span>
              {cat.title}
            </button>
          ))}
        </div>

        {/* Menu items */}
        <div className="lg:col-span-9 flex flex-col gap-8">
          {filteredMenu.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-surface-variant/10">
              <span className="material-symbols-outlined text-5xl text-primary/30 mb-3 block">sentiment_dissatisfied</span>
              <h3 className="font-headline-md text-xl text-on-surface">No dishes found</h3>
              <p className="text-on-surface-variant text-sm mt-1">Try clearing your filters or search terms!</p>
            </div>
          ) : (
            filteredMenu.map(cat => (
              <section
                key={cat.id}
                ref={el => { categoryRefs.current[cat.id] = el; }}
                className="bg-white rounded-2xl p-5 md:p-6 border border-surface-variant/10 shadow-sm scroll-mt-40"
              >
                <h2 className="font-headline-lg text-xl md:text-2xl text-primary uppercase border-b-2 border-primary-container pb-2 mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-2xl">{cat.icon}</span>
                  {cat.title}
                  <span className="text-xs text-on-surface-variant font-normal normal-case ml-auto">
                    {cat.items.length} {cat.items.length === 1 ? 'item' : 'items'}
                  </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cat.items.map((item) => (
                    <DishOrderCard
                      key={item.name}
                      item={item}
                      getQty={getQty}
                      onAdd={addItem}
                      onUpdateQty={updateQty}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>

      {/* Floating cart bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
          <button
            id="view-cart-btn"
            onClick={() => setCartOpen(true)}
            className="w-full bg-primary text-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-[0_8px_32px_rgba(93,0,12,0.35)] hover:bg-primary-container transition-all cursor-pointer"
          >
            <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {itemCount} item{itemCount > 1 ? 's' : ''}
            </span>
            <span className="font-label-lg text-label-lg flex items-center gap-1.5 text-base">
              <span className="material-symbols-outlined text-base">shopping_cart</span>
              View Cart
            </span>
            <span className="font-extrabold text-base">₹{subtotal}</span>
          </button>
        </div>
      )}

      {/* Cart drawer */}
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
