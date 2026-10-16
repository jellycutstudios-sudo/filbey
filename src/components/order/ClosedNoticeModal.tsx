'use client';

import React, { useState, useEffect } from 'react';
import { OpenStatus, getAvailableDeliverySlots } from '@/utils/restaurantHours';

interface ClosedNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: OpenStatus | null;
  currentSlot: string | null;
  onConfirmSchedule: (slot: string) => void;
  onBrowseOnly: () => void;
}

export default function ClosedNoticeModal({
  isOpen,
  onClose,
  status,
  currentSlot,
  onConfirmSchedule,
  onBrowseOnly,
}: ClosedNoticeModalProps) {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const slots = getAvailableDeliverySlots();
      setAvailableSlots(slots);
      if (currentSlot && slots.includes(currentSlot)) {
        setSelectedSlot(currentSlot);
      } else if (slots.length > 0) {
        setSelectedSlot(slots[0]);
      }
    }
  }, [isOpen, currentSlot]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedSlot) {
      onConfirmSchedule(selectedSlot);
    } else {
      onBrowseOnly();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-2 border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Strip with Icon & Live Status */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-stone-50 p-5 border-b border-stone-200 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black px-2.5 py-1 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              <span>Currently Closed</span>
            </span>
            {status?.timeFormatted && (
              <span className="text-xs font-bold text-stone-700 bg-white border border-stone-300 px-2.5 py-1 rounded-full">
                Opens in {status.timeFormatted}
              </span>
            )}
          </div>

          <h2 className="text-lg font-black text-stone-950 tracking-tight">
            Schedule Your Delivery
          </h2>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed font-medium">
            Kitchen opens daily at <strong className="text-stone-900 font-bold">11:30 AM</strong>. You can pre-order now and we&apos;ll prepare your food piping hot for your preferred delivery slot!
          </p>
        </div>

        {/* Slot Selector Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          <label className="block text-xs font-black text-stone-900 uppercase tracking-wider">
            Select Delivery Time Slot <span className="text-rose-600">*</span>
          </label>

          <div className="space-y-2">
            {availableSlots.map((slot, idx) => {
              const isSelected = selectedSlot === slot;
              const isOpeningSlot = idx === 0;

              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {isOpeningSlot ? 'rocket_launch' : 'schedule'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-black truncate ${isSelected ? 'text-primary' : 'text-stone-900'}`}>
                        {slot}
                      </p>
                      {isOpeningSlot && (
                        <p className="text-[11px] font-bold text-emerald-700">
                          ⚡ Priority preparation at opening
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Radio Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-primary bg-primary' : 'border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 flex items-center gap-2.5 text-[11px] text-stone-600 font-medium">
            <span className="material-symbols-outlined text-stone-500 text-base shrink-0">local_shipping</span>
            <span>Riders dispatch directly from our Perungudi kitchen for maximum crispiness.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full bg-primary hover:bg-primary-container text-white font-black text-sm py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-base">event_available</span>
            <span>Schedule Delivery &amp; Browse Menu</span>
          </button>

          <button
            type="button"
            onClick={onBrowseOnly}
            className="w-full py-2.5 text-xs font-bold text-stone-700 hover:text-stone-950 transition-colors text-center cursor-pointer"
          >
            Just Browse Menu (Don&apos;t Schedule Yet)
          </button>
        </div>

      </div>
    </div>
  );
}
