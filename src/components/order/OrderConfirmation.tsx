'use client';

import { useCart } from '@/context/CartContext';
import { CustomerDetails } from './CustomerDetailsForm';

interface OrderConfirmationProps {
  customer: CustomerDetails;
  onBack: () => void;
  onOrderPlaced: () => void;
}

const WA_NUMBER = '918122356144';

function buildWhatsAppMessage(
  items: ReturnType<typeof useCart>['items'],
  subtotal: number,
  total: number,
  baseDeliveryFee: number,
  effectiveDeliveryFee: number,
  isFreeDelivery: boolean,
  discount: number,
  gstAmount: number,
  customer: CustomerDetails,
  locationName: string
): string {
  const itemLines = items
    .map(i => `• ${i.quantity}x ${i.name}${i.priceLabel ? ` (${i.priceLabel})` : ''} — ₹${i.price * i.quantity}`)
    .join('\n');

  const deliveryStr = isFreeDelivery ? `FREE (Order above ₹499 🎉)` : `₹${effectiveDeliveryFee}`;
  const discountStr = discount > 0 ? `\n🎁 *First Direct Order Discount:* -₹${discount}` : '';

  const mapsLink = customer.mapsUrl
    ? customer.mapsUrl
    : `https://maps.google.com/?q=${encodeURIComponent(customer.address + (customer.address.toLowerCase().includes('chennai') ? '' : ', Chennai'))}`;

  return (
    `🍗 *New Order — Filbey Direct Delivery*\n\n` +
    `📦 *Items:*\n${itemLines}\n\n` +
    `💰 *Subtotal:* ₹${subtotal}` +
    discountStr + `\n` +
    `🚗 *Delivery:* ${deliveryStr}\n` +
    `🧾 *GST on Food (5%):* ₹${gstAmount}\n` +
    `✅ *Total to Pay:* ₹${total}\n\n` +
    `📍 *Delivery Address:*\n${customer.address}\n` +
    `🗺️ *Google Maps Pin:* ${mapsLink}\n` +
    `🏙️ *Area:* ${locationName}\n\n` +
    `👤 *Name:* ${customer.name}\n` +
    `📞 *Phone:* +91 ${customer.phone}\n` +
    (customer.notes ? `📝 *Notes:* ${customer.notes}\n` : '') +
    `\n✨ _Customer ordered via Direct Web Menu — eligible for repeat direct ordering VIP perks!_`
  );
}

export default function OrderConfirmation({ customer, onBack, onOrderPlaced }: OrderConfirmationProps) {
  const {
    items,
    subtotal,
    total,
    deliveryInfo,
    baseDeliveryFee,
    effectiveDeliveryFee,
    isFreeDelivery,
    discount,
    gstAmount,
    clearCart,
    recordOrderedPhone,
  } = useCart();
  const locationName = deliveryInfo?.locationName ?? 'Your location';

  const handlePlaceOrder = () => {
    const message = buildWhatsAppMessage(
      items,
      subtotal,
      total,
      baseDeliveryFee,
      effectiveDeliveryFee,
      isFreeDelivery,
      discount,
      gstAmount,
      customer,
      locationName
    );
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    // Record phone number so repeat orders from this number detect it
    recordOrderedPhone(customer.phone);

    // Save customer details to Google Sheet for promotions & record keeping
    const itemsSummary = items
      .map(i => `${i.quantity}x ${i.name}${i.priceLabel ? ` (${i.priceLabel})` : ''}`)
      .join(', ');

    fetch('/api/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        area: locationName,
        total,
        items: itemsSummary,
      }),
    }).catch(err => console.warn('Could not sync order to Google Sheet:', err));

    clearCart();
    onOrderPlaced();
  };

  const deliverySavings = isFreeDelivery ? baseDeliveryFee : 0;
  const totalSavings = discount + deliverySavings;

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-on-surface-variant text-sm mb-6 hover:text-primary transition-colors">
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Edit Details
      </button>

      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 32 }}>receipt_long</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile text-primary uppercase">Order Review</h1>
        <p className="text-on-surface-variant text-sm mt-1">Review your order before sending.</p>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-surface-variant/15 shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-3.5 border-b border-surface-variant/15 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-lg">restaurant</span>
          <h2 className="font-label-lg text-on-surface text-sm uppercase tracking-wide">Items Ordered</h2>
        </div>
        <div className="px-5 py-3 flex flex-col gap-2.5">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span className="text-on-surface">
                <span className="font-semibold">{item.quantity}×</span>{' '}
                {item.name}
                {item.priceLabel && <span className="text-on-surface-variant"> ({item.priceLabel})</span>}
                {item.isVeg && ' 🌱'}
              </span>
              <span className="text-primary font-bold flex-shrink-0 ml-3">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 bg-surface-container-low border-t border-surface-variant/15 flex flex-col gap-1.5">
          <div className="flex justify-between text-sm text-on-surface-variant">
            <span>Subtotal</span><span className="font-semibold text-on-surface">₹{subtotal}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-700 font-medium">
              <span>First Direct Order Discount</span>
              <span className="font-semibold">-₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-on-surface-variant">
            <span>Delivery ({deliveryInfo?.distance ? `${deliveryInfo.distance.toFixed(1)} km` : 'Core Zone'})</span>
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
              <span className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded-full text-on-surface-variant/70">5% on food</span>
            </span>
            <span className="font-semibold text-on-surface">₹{gstAmount}</span>
          </div>
          {totalSavings > 0 && (
            <div className="bg-green-100/70 border border-green-200 text-green-800 text-xs px-3 py-1.5 rounded-lg text-center font-medium my-1">
              🎉 Direct Order Savings: <strong>₹{totalSavings}</strong>
            </div>
          )}
          <div className="flex justify-between font-bold text-base text-on-surface pt-1.5 border-t border-surface-variant/20">
            <span>Total to Pay</span><span className="text-primary text-lg">₹{total}</span>
          </div>
        </div>
      </div>

      {/* Delivery details */}
      <div className="bg-white rounded-2xl border border-surface-variant/15 shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-3.5 border-b border-surface-variant/15 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-lg">local_shipping</span>
          <h2 className="font-label-lg text-on-surface text-sm uppercase tracking-wide">Delivery Details</h2>
        </div>
        <div className="px-5 py-4 flex flex-col gap-2.5 text-sm">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-on-surface-variant text-base flex-shrink-0 mt-0.5">person</span>
            <span className="text-on-surface">{customer.name}</span>
          </div>
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-on-surface-variant text-base flex-shrink-0 mt-0.5">call</span>
            <span className="text-on-surface">+91 {customer.phone}</span>
          </div>
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-on-surface-variant text-base flex-shrink-0 mt-0.5">location_on</span>
            <div className="flex-1">
              <span className="text-on-surface">{customer.address}</span>
              <div className="mt-1">
                <a
                  href={customer.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(customer.address + (customer.address.toLowerCase().includes('chennai') ? '' : ', Chennai'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold hover:underline bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                >
                  <span className="material-symbols-outlined text-xs">place</span>
                  Google Maps Pin Attached for Rider ↗
                </a>
              </div>
            </div>
          </div>
          {customer.notes && (
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-on-surface-variant text-base flex-shrink-0 mt-0.5">sticky_note_2</span>
              <span className="text-on-surface-variant italic">{customer.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Est time */}
      <div className="flex items-center gap-3 bg-secondary-container/20 rounded-2xl px-4 py-3 mb-6">
        <span className="material-symbols-outlined text-secondary text-2xl">schedule</span>
        <div>
          <p className="font-semibold text-on-surface text-sm">Estimated Delivery: 30–45 mins</p>
          <p className="text-xs text-on-surface-variant mt-0.5">We&apos;ll confirm via WhatsApp after you place your order.</p>
        </div>
      </div>

      {/* Place Order */}
      <button
        id="place-order-btn"
        onClick={handlePlaceOrder}
        className="w-full bg-[#25D366] text-white font-label-lg text-base py-4 rounded-full hover:bg-[#20bd5a] hover:shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-all flex items-center justify-center gap-2.5 mb-3"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
        </svg>
        Place Order on WhatsApp
      </button>

      {/* Porter section */}
      <div className="bg-surface-container rounded-2xl border border-surface-variant/15 p-4">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary text-2xl flex-shrink-0">local_shipping</span>
          <div>
            <p className="font-semibold text-on-surface text-sm">Need a Porter delivery?</p>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              If we book a Porter rider for your order, you&apos;ll be notified via WhatsApp with tracking details.
              You can also book a Porter pickup directly — use our restaurant address: <strong>Perungudi, OMR, Chennai</strong>.
            </p>
            <a
              href="https://porter.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary/5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              Open Porter App
            </a>
            <p className="text-[10px] text-on-surface-variant/60 mt-1.5">
              Full Porter auto-booking available with Porter Business API (coming soon).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
