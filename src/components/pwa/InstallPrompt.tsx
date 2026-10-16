'use client';

import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // 1. Check if already installed / running in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((window.navigator as unknown as { standalone?: boolean }).standalone);

    if (isStandalone) {
      return;
    }

    // 2. Check if previously marked as installed
    if (localStorage.getItem('filbey_pwa_installed') === 'true') {
      return;
    }

    // 3. Check if recently dismissed (within 7 days)
    const lastDismissed = localStorage.getItem('filbey_pwa_dismissed');
    if (lastDismissed) {
      const daysSinceDismissed = (Date.now() - Number(lastDismissed)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // 4. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    // 5. Chrome / Android native install prompt handler
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner smoothly after 2 seconds
      setTimeout(() => setShowBanner(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 6. Native appinstalled lifecycle listener
    const handleAppInstalled = () => {
      localStorage.setItem('filbey_pwa_installed', 'true');
      setShowBanner(false);
      setShowIOSGuide(false);
      setShowAndroidGuide(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 7. For iOS Safari, show banner after 2.5 seconds
    if (isIOSDevice) {
      const timer = setTimeout(() => setShowBanner(true), 2500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }

    // 8. Fallback timer for other mobile browsers if beforeinstallprompt didn't trigger
    const fallbackTimer = setTimeout(() => {
      setShowBanner(true);
    }, 3000);

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        localStorage.setItem('filbey_pwa_installed', 'true');
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instruction for Android browsers without active prompt
      setShowAndroidGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSGuide(false);
    setShowAndroidGuide(false);
    localStorage.setItem('filbey_pwa_dismissed', Date.now().toString());
  };

  if (!isMounted || !showBanner) return null;

  return (
    <>
      {/* ── Top Smart App Banner (Apple & Swiggy Style) ── */}
      <div
        role="banner"
        aria-label="Install Filbey App"
        className="w-full bg-[#18181b] text-white border-b border-stone-800 shadow-md animate-in slide-in-from-top-full duration-300 relative z-[60]"
      >
        <div className="max-w-container-max mx-auto px-3 py-2 sm:px-4 flex items-center justify-between gap-2.5">
          
          {/* Left: Dismiss Button + App Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={handleDismiss}
              className="text-stone-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss smart banner"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>

            {/* App Icon */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary overflow-hidden shrink-0 border border-white/10 shadow-xs flex items-center justify-center">
              <img
                src="/icons/icon-192x192.png"
                alt="Filbey App Icon"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {/* Title & Micro-Rating */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-black text-xs sm:text-sm text-white truncate leading-tight">
                  Filbey Chennai
                </p>
                <span className="text-[10px] uppercase font-black bg-stone-800 text-stone-300 px-1.5 py-0.2 rounded-md hidden sm:inline-block">
                  App
                </span>
              </div>
              <p className="text-[11px] text-stone-300 font-semibold truncate flex items-center gap-1 mt-0.5">
                <span className="text-amber-400 font-black">4.9 ★</span>
                <span>·</span>
                <span className="text-stone-300">Fast 1-Tap Direct Orders</span>
              </p>
            </div>
          </div>

          {/* Right: Install CTA */}
          <button
            type="button"
            onClick={handleInstallClick}
            className="bg-primary hover:bg-primary-container text-white font-black text-xs uppercase tracking-wider px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm font-bold">install_mobile</span>
            <span>{isIOS ? 'Get' : 'Install'}</span>
          </button>
        </div>
      </div>

      {/* ── iOS Installation Guide Bottom Sheet ── */}
      {showIOSGuide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-stone-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <img src="/icons/icon-192x192.png" alt="Filbey" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-stone-950">Install on iPhone</h3>
                  <p className="text-xs text-stone-600 font-medium">Add Filbey to your home screen</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-3 py-1 text-xs text-stone-800 font-medium">
              <div className="flex items-start gap-3 bg-stone-50 border border-stone-200 p-3 rounded-2xl">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-bold text-stone-950">
                    Tap the Share button in Safari
                  </p>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Located in the bottom menu bar of Safari:
                  </p>
                  <div className="inline-flex items-center gap-1.5 bg-white border border-stone-300 px-2.5 py-1 rounded-lg text-primary font-bold mt-1.5 shadow-2xs">
                    <span className="material-symbols-outlined text-base">ios_share</span>
                    <span>Share Icon</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-stone-50 border border-stone-200 p-3 rounded-2xl">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-bold text-stone-950">
                    Scroll down &amp; tap &quot;Add to Home Screen&quot;
                  </p>
                  <div className="inline-flex items-center gap-1.5 bg-white border border-stone-300 px-2.5 py-1 rounded-lg text-stone-900 font-bold mt-1.5 shadow-2xs">
                    <span className="material-symbols-outlined text-base">add_box</span>
                    <span>Add to Home Screen</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full bg-primary hover:bg-primary-container text-white font-black text-xs py-3 rounded-2xl transition-all cursor-pointer shadow-md"
            >
              Got It, Thanks!
            </button>
          </div>
        </div>
      )}

      {/* ── Android Helper Guide Modal (if native prompt is bypassed) ── */}
      {showAndroidGuide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowAndroidGuide(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border-2 border-stone-200 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm font-black text-stone-950">Install Filbey App</h3>
              <button
                type="button"
                onClick={() => setShowAndroidGuide(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="space-y-2 text-xs text-stone-800 font-medium">
              <p>To install Filbey on your device:</p>
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-2xl space-y-2">
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">more_vert</span>
                  <span>1. Tap the <strong>3 dots (Menu)</strong> in your browser</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">install_mobile</span>
                  <span>2. Tap <strong>Install App</strong> or <strong>Add to Home Screen</strong></span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAndroidGuide(false)}
              className="w-full bg-primary hover:bg-primary-container text-white font-black text-xs py-3 rounded-2xl transition-all cursor-pointer shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
