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
          <div className="w-10 h-1 bg-surface-variant rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 pt-2 border-b border-surface-variant/20 flex-shrink-0">
          <div>
            <h2 className="font-headline-md text-xl text-primary uppercase">Your Cart</h2>
            <p className="text-xs text-on-surface-variant">Order directly for the freshest fried chicken</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Free delivery prompt */}
        {items.length > 0 && (
          <div className="px-5 py-2.5 bg-secondary-container/20 border-b border-surface-variant/15 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-sm">local_shipping</span>
              {isFreeDelivery ? (
                <span className="text-green-700 font-bold">🎉 FREE Delivery Unlocked!</span>
              ) : (
                <span>Add <strong className="text-primary font-bold">₹{amountNeededForFreeDelivery}</strong> for <strong>FREE Delivery</strong></span>
              )}
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant bg-white px-2 py-0.5 rounded-full border border-surface-variant/30">
              Orders ₹499+
            </span>
          </div>
        )}

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="material-symbols-outlined text-5xl text-primary/20 mb-3">shopping_cart</span>
              <p className="text-on-surface-variant text-sm">Your cart is empty.<br />Add some delicious items!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest border border-surface-variant/15">
                  <div className="flex-1 min-w-0">
                    <p className="font-label-lg text-sm text-on-surface truncate">
                      {item.name}
                      {item.priceLabel && <span className="text-on-surface-variant font-normal"> ({item.priceLabel})</span>}
                      {item.isVeg && <span className="ml-1">🌱</span>}
                    </p>
                    <p className="text-primary font-bold text-sm mt-0.5">₹{item.price * item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-primary-fixed/30 rounded-full px-1 flex-shrink-0">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-primary font-bold text-lg hover:bg-primary/10 rounded-full transition-colors"
                    >
                      −
                    </button>
                    <span className="text-primary font-bold text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-primary font-bold text-lg hover:bg-primary/10 rounded-full transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-error-container transition-colors flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-error text-sm">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 pb-6 pt-3 border-t border-surface-variant/20 flex-shrink-0 bg-white">
            {/* Min order warning */}
            {!meetsMinOrder && (
              <div className="flex items-center gap-2 bg-secondary-container/20 rounded-xl px-3 py-2 mb-3">
                <span className="material-symbols-outlined text-secondary text-sm">info</span>
                <p className="text-xs text-on-surface-variant">
                  Add ₹{minOrder - subtotal} more to meet the ₹{minOrder} minimum order.
                </p>
              </div>
            )}

            {/* First order discount toggle */}
            <div className="bg-surface-container-low rounded-xl p-3 mb-3 border border-surface-variant/20">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-on-surface cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFirstOrderDiscountApplied}
                    onChange={toggleFirstOrderDiscount}
                    className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
                  />
                  <span>🎁 1st Direct Order Discount (₹30 OFF)</span>
                </label>
                {subtotal >= 399 ? (
                  <span className="text-green-700 font-bold text-xs bg-green-100 px-2 py-0.5 rounded-full">
                    -₹30
                  </span>
                ) : (
                  <span className="text-[10px] text-on-surface-variant">
                    Min ₹399
                  </span>
                )}
              </div>
              {subtotal < 399 && (
                <p className="text-[11px] text-on-surface-variant/80 mt-1 pl-6">
                  Add ₹{399 - subtotal} more to unlock this discount!
                </p>
              )}
            </div>

            {/* Bill breakdown */}
            <div className="flex flex-col gap-1.5 mb-3">
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-semibold text-on-surface">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-700 font-medium">
                  <span className="flex items-center gap-1">
                    <span>First Order Discount</span>
                  </span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Delivery</span>
                {isFreeDelivery ? (
                  <span className="font-semibold">
                    <span className="line-through text-on-surface-variant/50 mr-1.5">₹{baseDeliveryFee}</span>
                    <span className="text-green-700 font-bold">FREE</span>
                  </span>
                ) : (
                  <span className="font-semibold text-on-surface">₹{effectiveDeliveryFee}</span>
                )}
              </div>
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span className="flex items-center gap-1">
                  GST
                  <span className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded-full text-on-surface-variant/70">5% CGST+SGST</span>
                </span>
                <span className="font-semibold text-on-surface">₹{gstAmount}</span>
              </div>
              {totalSavings > 0 && (
                <div className="bg-green-50 border border-green-200/60 rounded-lg px-2.5 py-1 text-center text-[11px] text-green-800 font-medium my-0.5">
                  🎉 Total direct savings on this order: <strong>₹{totalSavings}</strong>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-on-surface pt-1.5 border-t border-surface-variant/20">
                <span>Total</span>
                <span className="text-primary text-lg">₹{total}</span>
              </div>
            </div>

            <button
              id="proceed-to-checkout-btn"
              onClick={onProceed}
              disabled={!meetsMinOrder}
              className="w-full bg-primary text-white font-label-lg text-label-lg py-4 rounded-full hover:bg-primary-container hover:shadow-[0_8px_30px_rgba(93,0,12,0.35)] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
