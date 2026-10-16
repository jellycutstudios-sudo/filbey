'use client';

import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
  meetsMinOrder: boolean;
  minOrder: number;
}

export default function CartDrawer({ open, onClose, onProceed, meetsMinOrder, minOrder }: CartDrawerProps) {
  const {
    items,
    updateQty,
    removeItem,
    subtotal,
    total,
    baseDeliveryFee,
    effectiveDeliveryFee,
    isFreeDelivery,
    amountNeededForFreeDelivery,
    discount,
    gstAmount,
    isFirstOrderDiscountApplied,
    toggleFirstOrderDiscount,
    isPhoneEligibleForFirstOrder,
  } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const deliverySavings = isFreeDelivery ? baseDeliveryFee : 0;
  const totalSavings = discount + deliverySavings;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-3xl shadow-[0_-8px_40px_rgba(42,31,29,0.15)] transition-transform duration-300 ease-out flex flex-col max-h-[90vh] ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 pt-2 border-b-2 border-stone-200 flex-shrink-0">
          <div>
            <h2 className="font-headline-md text-xl text-primary font-black uppercase">Your Cart</h2>
            <p className="text-xs text-stone-700 font-medium">Order directly for the freshest fried chicken</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <span className="material-symbols-outlined text-xl font-bold">close</span>
          </button>
        </div>

        {/* Free delivery prompt */}
        {items.length > 0 && (
          <div className="px-5 py-2.5 bg-amber-50 border-y-2 border-amber-300 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-stone-900 font-semibold">
              <span className="material-symbols-outlined text-amber-700 text-sm font-bold">local_shipping</span>
              {isFreeDelivery ? (
                <span className="text-emerald-800 font-extrabold">🎉 FREE Delivery Unlocked!</span>
              ) : (
                <span>Add <strong className="text-primary font-black">₹{amountNeededForFreeDelivery}</strong> for <strong className="text-stone-950 font-black">FREE Delivery</strong></span>
              )}
            </div>
            <span className="text-[10px] font-black text-stone-900 bg-white px-2.5 py-0.5 rounded-full border border-amber-400 shadow-2xs">
              Orders ₹499+
            </span>
          </div>
        )}

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="material-symbols-outlined text-5xl text-primary/30 mb-3">shopping_cart</span>
              <p className="text-stone-700 font-medium text-sm">Your cart is empty.<br />Add some delicious items!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border-2 border-stone-200 shadow-2xs">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-stone-950 truncate">
                      {item.name}
                      {item.priceLabel && <span className="text-stone-600 font-semibold"> ({item.priceLabel})</span>}
                      {item.isVeg && <span className="ml-1">🌱</span>}
                    </p>
                    <p className="text-primary font-black text-base mt-0.5">₹{item.price * item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-stone-100 border border-stone-300 rounded-full px-1.5 py-0.5 flex-shrink-0 shadow-2xs">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-stone-900 font-black text-base hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="text-stone-950 font-black text-sm w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-stone-900 font-black text-base hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors flex-shrink-0 cursor-pointer"
                    aria-label="Remove item"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 pb-6 pt-3 border-t-2 border-stone-200 flex-shrink-0 bg-white">
            {/* Min order warning */}
            {!meetsMinOrder && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 mb-3">
                <span className="material-symbols-outlined text-amber-700 text-sm font-bold">info</span>
                <p className="text-xs text-amber-950 font-semibold">
                  Add <strong className="font-black text-stone-950">₹{minOrder - subtotal}</strong> more to meet the ₹{minOrder} minimum order.
                </p>
              </div>
            )}

            {/* First order discount toggle */}
            {isPhoneEligibleForFirstOrder && (
              <div className="bg-amber-50/70 rounded-2xl p-3.5 mb-3 border-2 border-amber-300 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-black text-stone-950 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isFirstOrderDiscountApplied}
                      onChange={toggleFirstOrderDiscount}
                      className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary cursor-pointer"
                    />
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-amber-700 font-bold">sell</span>
                      <span>1st Direct Order Discount (₹30 OFF)</span>
                    </span>
                  </label>
                  {subtotal >= 399 ? (
                    <span className="text-emerald-800 font-black text-xs bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                      -₹30
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-stone-700 bg-white border border-stone-300 px-2 py-0.5 rounded-full">
                      Min ₹399
                    </span>
                  )}
                </div>
                {subtotal < 399 && (
                  <p className="text-xs text-stone-800 font-medium mt-1.5 pl-6">
                    Add ₹{399 - subtotal} more to unlock this discount!
                  </p>
                )}
              </div>
            )}

            {/* Bill breakdown */}
            <div className="flex flex-col gap-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-stone-700 font-semibold">Subtotal</span>
                <span className="font-bold text-stone-950">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-800 font-bold">
                  <span className="flex items-center gap-1">
                    <span>First Order Discount</span>
                  </span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-stone-700 font-semibold">Delivery</span>
                {isFreeDelivery ? (
                  <span className="font-bold">
                    <span className="line-through text-stone-400 mr-1.5">₹{baseDeliveryFee}</span>
                    <span className="text-emerald-700 font-black">FREE</span>
                  </span>
                ) : (
                  <span className="font-bold text-stone-950">₹{effectiveDeliveryFee}</span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1.5 text-stone-700 font-semibold">
                  GST
                  <span className="text-[10px] font-bold bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded-md text-stone-700">5% on food</span>
                </span>
                <span className="font-bold text-stone-950">₹{gstAmount}</span>
              </div>
              {totalSavings > 0 && (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl px-3 py-1.5 text-center text-xs text-emerald-900 font-bold my-0.5">
                  🎉 Total direct savings on this order: <strong className="font-black">₹{totalSavings}</strong>
                </div>
              )}
              <div className="flex items-center justify-between text-base font-black text-stone-950 pt-2 border-t-2 border-stone-200">
                <span>Total</span>
                <span className="text-primary font-black text-2xl">₹{total}</span>
              </div>
            </div>

            <button
              id="proceed-to-checkout-btn"
              onClick={onProceed}
              disabled={!meetsMinOrder}
              className="w-full bg-primary text-white font-extrabold text-base py-4 rounded-2xl hover:bg-primary-container hover:shadow-[0_8px_30px_rgba(93,0,12,0.35)] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
