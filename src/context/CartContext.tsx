'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
  /** Unique key: itemName__priceLabel (or just itemName if single price) */
  id: string;
  name: string;
  priceLabel?: string; // e.g. "6 Pc", "2 Pc"
  price: number;
  quantity: number;
  isVeg?: boolean;
  isSpicy?: boolean;
}

export interface DeliveryInfo {
  distance: number; // km
  fee: number; // ₹
  locationName: string;
}

export const FREE_DELIVERY_THRESHOLD = 499;
export const FIRST_ORDER_DISCOUNT_THRESHOLD = 399;
export const FIRST_ORDER_DISCOUNT_AMOUNT = 30;
export const GST_RATE = 0.05; // 5% GST (CGST 2.5% + SGST 2.5%)

interface CartContextType {
  items: CartItem[];
  deliveryInfo: DeliveryInfo | null;
  setDeliveryInfo: (info: DeliveryInfo) => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  baseDeliveryFee: number;
  effectiveDeliveryFee: number;
  isFreeDelivery: boolean;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  isFirstOrderDiscountApplied: boolean;
  setIsFirstOrderDiscountApplied: (applied: boolean) => void;
  toggleFirstOrderDiscount: () => void;
  isPhoneEligibleForFirstOrder: boolean;
  setIsPhoneEligibleForFirstOrder: (eligible: boolean) => void;
  verifiedPhone: string | null;
  checkPhoneEligibility: (phone: string) => Promise<{ hasOrdered: boolean }>;
  recordOrderedPhone: (phone: string) => void;
  discount: number;
  gstAmount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = sessionStorage.getItem('filbey_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [deliveryInfo, setDeliveryInfoState] = useState<DeliveryInfo | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = sessionStorage.getItem('filbey_delivery');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isFirstOrderDiscountApplied, setIsFirstOrderDiscountApplied] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const hasOrdered = localStorage.getItem('filbey_has_ordered');
      return !hasOrdered;
    } catch {
      return true;
    }
  });
  const [isPhoneEligibleForFirstOrder, setIsPhoneEligibleForFirstOrder] = useState<boolean>(true);
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);

  // Persist items
  useEffect(() => {
    try {
      sessionStorage.setItem('filbey_cart', JSON.stringify(items));
    } catch { /* ignore */ }
  }, [items]);

  const setDeliveryInfo = useCallback((info: DeliveryInfo) => {
    setDeliveryInfoState(info);
    try {
      sessionStorage.setItem('filbey_delivery', JSON.stringify(info));
    } catch { /* ignore */ }
  }, []);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      sessionStorage.removeItem('filbey_cart');
      sessionStorage.removeItem('filbey_delivery');
    } catch { /* ignore */ }
  }, []);

  const toggleFirstOrderDiscount = useCallback(() => {
    setIsFirstOrderDiscountApplied(prev => !prev);
  }, []);

  const checkPhoneEligibility = useCallback(async (phone: string): Promise<{ hasOrdered: boolean }> => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return { hasOrdered: false };
    }

    // 1. Check local device cache for instant response
    try {
      const stored = localStorage.getItem('filbey_ordered_phones');
      const list: string[] = stored ? JSON.parse(stored) : [];
      if (list.includes(cleanPhone)) {
        setIsPhoneEligibleForFirstOrder(false);
        setVerifiedPhone(cleanPhone);
        return { hasOrdered: true };
      }
    } catch { /* ignore */ }

    // 2. Check backend API (Google Sheets)
    try {
      const res = await fetch(`/api/customer?phone=${encodeURIComponent(cleanPhone)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.hasOrdered) {
          setIsPhoneEligibleForFirstOrder(false);
          setVerifiedPhone(cleanPhone);
          try {
            const stored = localStorage.getItem('filbey_ordered_phones');
            const list: string[] = stored ? JSON.parse(stored) : [];
            if (!list.includes(cleanPhone)) {
              list.push(cleanPhone);
              localStorage.setItem('filbey_ordered_phones', JSON.stringify(list));
            }
          } catch { /* ignore */ }
          return { hasOrdered: true };
        }
      }
    } catch (err) {
      console.warn('Error checking phone eligibility:', err);
    }

    setIsPhoneEligibleForFirstOrder(true);
    setVerifiedPhone(cleanPhone);
    return { hasOrdered: false };
  }, []);

  const recordOrderedPhone = useCallback((phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) return;
    try {
      const stored = localStorage.getItem('filbey_ordered_phones');
      const list: string[] = stored ? JSON.parse(stored) : [];
      if (!list.includes(cleanPhone)) {
        list.push(cleanPhone);
        localStorage.setItem('filbey_ordered_phones', JSON.stringify(list));
      }
      localStorage.setItem('filbey_has_ordered', 'true');
    } catch { /* ignore */ }
    setIsPhoneEligibleForFirstOrder(false);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const baseDeliveryFee = deliveryInfo?.fee ?? 0;
  const isFreeDelivery = deliveryInfo !== null && subtotal >= FREE_DELIVERY_THRESHOLD;
  const effectiveDeliveryFee = isFreeDelivery ? 0 : baseDeliveryFee;
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  // ₹30 discount requires: subtotal >= 399, checkbox checked, AND phone is a first-time customer
  const isEligibleForFirstOrder = subtotal >= FIRST_ORDER_DISCOUNT_THRESHOLD && isPhoneEligibleForFirstOrder;
  const discount = (isFirstOrderDiscountApplied && isEligibleForFirstOrder) ? FIRST_ORDER_DISCOUNT_AMOUNT : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const gstAmount = Math.round(taxableAmount * GST_RATE);
  const total = Math.max(0, taxableAmount + gstAmount + effectiveDeliveryFee);

  return (
    <CartContext.Provider value={{
      items,
      deliveryInfo,
      setDeliveryInfo,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      itemCount,
      subtotal,
      baseDeliveryFee,
      effectiveDeliveryFee,
      isFreeDelivery,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      amountNeededForFreeDelivery,
      isFirstOrderDiscountApplied,
      setIsFirstOrderDiscountApplied,
      toggleFirstOrderDiscount,
      isPhoneEligibleForFirstOrder,
      setIsPhoneEligibleForFirstOrder,
      verifiedPhone,
      checkPhoneEligibility,
      recordOrderedPhone,
      discount,
      gstAmount,
      total,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
