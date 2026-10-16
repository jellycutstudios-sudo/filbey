'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if already in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((window.navigator as unknown as { standalone?: boolean }).standalone);

    if (isStandalone) {
      return;
    }

    // Check if recently dismissed (within 7 days)
    const lastDismissed = localStorage.getItem('filbey_pwa_dismissed');
    if (lastDismissed) {
      const daysSinceDismissed = (Date.now() - Number(lastDismissed)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    // Chrome / Android install prompt handler
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Wait 3 seconds before showing so the initial page experience is smooth
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If iOS Safari, show prompt after 4 seconds
    if (isIOSDevice) {
      const timer = setTimeout(() => setShowPrompt(true), 4000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSGuide(false);
    localStorage.setItem('filbey_pwa_dismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white border-2 border-stone-300 rounded-2xl p-4 shadow-xl shadow-stone-900/15 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center p-1.5 shrink-0 shadow-xs">
              <img src="/icons/icon-192x192.png" alt="Filbey App Icon" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <h4 className="font-black text-stone-950 text-sm leading-tight">Install Filbey App</h4>
              <p className="text-stone-700 text-xs font-semibold mt-0.5">Faster 1-tap ordering directly from home screen</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-stone-400 hover:text-stone-900 p-1 transition-colors cursor-pointer"
            aria-label="Dismiss install prompt"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* iOS installation guide */}
        {showIOSGuide ? (
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-800 space-y-1.5 font-medium">
            <p className="font-bold text-stone-950 flex items-center gap-1.5">
              <span>To install on iOS:</span>
            </p>
            <p className="flex items-center gap-1.5">
              1. Tap the <span className="material-symbols-outlined text-sm text-primary font-bold">ios_share</span> <strong>Share</strong> button in Safari.
            </p>
            <p className="flex items-center gap-1.5">
              2. Scroll down and tap <span className="material-symbols-outlined text-sm font-bold">add_box</span> <strong>Add to Home Screen</strong>.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 pt-0.5">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-primary hover:bg-primary-container text-white text-xs font-black py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <span className="material-symbols-outlined text-sm font-bold">install_mobile</span>
              <span>{isIOS ? 'How to Install' : 'Install App'}</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2.5 text-stone-600 hover:text-stone-900 text-xs font-bold transition-colors cursor-pointer"
            >
              Later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
