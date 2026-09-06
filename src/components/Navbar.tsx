'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { key: 'nav.aboutUs', label: 'About Us', href: '/about' },
  { key: 'nav.chickenMeals', label: 'Chicken Meals', href: '/menu#chicken-meals' },
  { key: 'nav.burgers', label: 'Burgers', href: '/menu#burgers' },
  { key: 'nav.wingsStrips', label: 'Wings & Strips', href: '/menu#wings-strips' },
  { key: 'nav.wrapsSides', label: 'Wraps & Sides', href: '/menu#wraps-sandwiches' },
  { key: 'nav.cafeDrinks', label: 'Café & Drinks', href: '/menu#beverages-desserts' },
];

interface NavbarProps {
  /** On the menu page, the CTA says "Back to Home"; on others it says "Order Now" */
  isMenuPage?: boolean;
}

export default function Navbar({ isMenuPage = false }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { itemCount } = useCart();
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const hasOrdered = localStorage.getItem('filbey_has_ordered');
    setIsFirstOrder(!hasOrdered);
    setMounted(true);
  }, []);

  return (
    <>
      <header className="bg-surface/90 backdrop-blur-md fixed top-0 w-full z-50 shadow-[0_4px_12px_rgba(42,31,29,0.05)]">
        <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          {/* Brand */}
          <Link href="/" className="flex items-center">
            <Image
              src="/filbeylogo.svg"
              alt="Filbey Fried Chicken & Burgers Chennai Logo"
              width={144}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            {/* Order Now CTA */}
            <Link
              href="/order"
              className="relative flex items-center gap-1.5 bg-primary text-white font-label-lg text-xs md:text-sm px-3 md:px-4 py-2 rounded-full hover:bg-primary-container hover:shadow-[0_4px_16px_rgba(93,0,12,0.35)] hover:-translate-y-0.5 transition-all duration-200"
              aria-label="Order Now"
            >
              <span className="material-symbols-outlined text-sm">delivery_dining</span>
              <span className="hidden sm:inline">Order Now</span>
              {mounted && isFirstOrder && (
                <span className="hidden sm:inline bg-secondary-container text-on-secondary-container text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ml-0.5">
                  ₹30 OFF
                </span>
              )}
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              className="px-3 py-1.5 rounded-full border border-primary/20 hover:border-primary/50 text-xs font-semibold transition-all bg-white/50 backdrop-blur-sm shadow-sm flex items-center gap-1.5 text-primary cursor-pointer hover:scale-105"
              aria-label="Switch Language"
            >
              <span className="material-symbols-outlined text-[16px] font-semibold">translate</span>
              <span className="hidden sm:inline">{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* WhatsApp Contact */}
            <Link
              href="https://wa.me/918122356144"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="w-8 h-8 md:w-auto md:h-auto md:flex md:items-center md:gap-1.5 md:px-3 md:py-1.5 md:rounded-full md:border md:border-[#25D366]/40 md:hover:border-[#25D366] md:hover:bg-[#25D366]/10 flex items-center justify-center rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-all duration-200 text-[#25D366]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
              </svg>
              <span className="hidden md:inline text-xs font-semibold">WhatsApp</span>
            </Link>

            {/* Toggle Button */}
            <button
              id="menu-btn"
              className="text-primary hover:scale-110 transition-transform duration-200"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 36 }}>
                menu
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Menu Overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[60] flex flex-col pt-20 px-margin-mobile md:px-margin-desktop transition-all duration-700 ease-in-out ${
          open ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'
        }`}
      >
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-surface/90 backdrop-blur-2xl -z-10" />

        <button
          id="close-menu"
          className="absolute top-6 right-margin-mobile md:right-margin-desktop text-primary hover:text-secondary hover:rotate-90 transition-all duration-300"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 44 }}>
            close
          </span>
        </button>

        <div className="max-w-container-max mx-auto w-full h-full flex flex-col items-center justify-center gap-8 md:gap-14 pb-10">
          
          {/* Logo inside menu */}
          <div 
            className={`transform transition-all duration-700 ease-out flex-shrink-0 ${open ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}
            style={{ transitionDelay: '100ms' }}
          >
            <Image
              src="/filbeylogo.svg"
              alt="Filbey Fried Chicken Logo"
              width={180}
              height={60}
              className="h-16 md:h-20 w-auto drop-shadow-sm"
            />
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-3 md:gap-5 text-center w-full justify-center">
            {navLinks.map((link, i) => (
              <div 
                key={link.href} 
                className={`transform transition-all duration-700 ease-out overflow-hidden ${open ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{ transitionDelay: `${200 + i * 100}ms` }}
              >
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="group relative inline-block text-primary font-display text-4xl md:text-6xl uppercase tracking-wide hover:text-secondary transition-colors duration-300"
                >
                  <span className="relative z-10 drop-shadow-sm">{t(link.key)}</span>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-1 bg-secondary transition-all duration-300 ease-out group-hover:w-3/4 rounded-full opacity-80" />
                </Link>
              </div>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div 
            className={`w-full max-w-sm flex flex-col gap-4 items-center flex-shrink-0 transform transition-all duration-700 ease-out ${open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ transitionDelay: '800ms' }}
          >
            {/* Order Online — always visible */}
            <Link
              href="/order"
              onClick={() => setOpen(false)}
              className="group flex items-center justify-center bg-primary text-on-primary font-label-lg text-lg py-3 px-10 rounded-full hover:bg-primary-container hover:shadow-[0_8px_30px_rgba(93,0,12,0.4)] hover:-translate-y-1 transition-all duration-300 w-full"
            >
              <span className="material-symbols-outlined mr-2 group-hover:-translate-y-0.5 transition-transform">delivery_dining</span>
              {t('nav.orderNow')}
            </Link>

            {isMenuPage ? (
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="group flex items-center justify-center border border-primary/30 text-primary font-label-lg text-base py-3 px-10 rounded-full hover:bg-primary/5 transition-all duration-300 w-full"
              >
                {t('nav.backToHome')} <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">home</span>
              </Link>
            ) : (
              <Link
                href="/menu"
                onClick={() => setOpen(false)}
                className="group flex items-center justify-center border border-primary/30 text-primary font-label-lg text-base py-3 px-10 rounded-full hover:bg-primary/5 transition-all duration-300 w-full"
              >
                {t('nav.dineInMenu')} <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">restaurant_menu</span>
              </Link>
            )}
            
            {/* Overlay Language Switcher */}
            <button
              onClick={() => {
                setLanguage(language === 'en' ? 'ta' : 'en');
                setOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-primary/30 text-primary font-label-lg font-bold hover:bg-primary/10 transition-all duration-300 shadow-sm cursor-pointer w-full text-base"
            >
              <span className="material-symbols-outlined text-sm">translate</span>
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
            
            {/* Social Icons */}
            <div className="flex gap-6 text-primary mt-2">
              <Link
                href="https://wa.me/918122356144"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                onClick={() => setOpen(false)}
                className="flex flex-col items-center gap-1 hover:-translate-y-1 hover:scale-110 transition-all duration-300 text-[#25D366]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                </svg>
                <span className="text-[10px] font-semibold">WhatsApp</span>
              </Link>
              <Link
                href="https://www.instagram.com/thefilbey/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                onClick={() => setOpen(false)}
                className="flex flex-col items-center gap-1 hover:-translate-y-1 hover:scale-110 transition-all duration-300 text-[#E1306C]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.036 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.487.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                </svg>
                <span className="text-[10px] font-semibold">Instagram</span>
              </Link>
              <Link
                href="https://maps.app.goo.gl/w5SU8wuf79VM7HtW9?g_st=iw"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Maps"
                onClick={() => setOpen(false)}
                className="flex flex-col items-center gap-1 hover:-translate-y-1 hover:scale-110 transition-all duration-300 text-primary"
              >
                <span className="material-symbols-outlined" style={{fontSize: 28, fontVariationSettings: "'FILL' 1"}}>location_on</span>
                <span className="text-[10px] font-semibold">Directions</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
