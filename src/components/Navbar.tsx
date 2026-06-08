'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

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
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              className="px-3.5 py-1.5 rounded-full border border-primary/20 hover:border-primary/50 text-xs font-semibold transition-all bg-white/50 backdrop-blur-sm shadow-sm flex items-center gap-1.5 text-primary cursor-pointer hover:scale-105"
              aria-label="Switch Language"
            >
              <span className="material-symbols-outlined text-[16px] font-semibold">translate</span>
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

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
            {isMenuPage ? (
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="group flex items-center justify-center bg-primary text-on-primary font-label-lg text-lg py-3 px-10 rounded-full hover:bg-primary-container hover:shadow-[0_8px_30px_rgba(93,0,12,0.4)] hover:-translate-y-1 transition-all duration-300 w-full"
              >
                {t('nav.backToHome')} <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">home</span>
              </Link>
            ) : (
              <Link
                href="/menu"
                onClick={() => setOpen(false)}
                className="group flex items-center justify-center bg-primary text-on-primary font-label-lg text-lg py-3 px-10 rounded-full hover:bg-primary-container hover:shadow-[0_8px_30px_rgba(93,0,12,0.4)] hover:-translate-y-1 transition-all duration-300 w-full"
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
               <Link href="https://instagram.com" target="_blank" className="hover:text-secondary hover:-translate-y-1 hover:scale-110 transition-all duration-300">
                  <span className="material-symbols-outlined" style={{fontSize: 28}}>photo_camera</span>
               </Link>
               <Link href="https://facebook.com" target="_blank" className="hover:text-secondary hover:-translate-y-1 hover:scale-110 transition-all duration-300">
                  <span className="material-symbols-outlined" style={{fontSize: 28}}>thumb_up</span>
               </Link>
               <Link href="https://maps.app.goo.gl/w5SU8wuf79VM7HtW9?g_st=iw" target="_blank" className="hover:text-secondary hover:-translate-y-1 hover:scale-110 transition-all duration-300">
                  <span className="material-symbols-outlined" style={{fontSize: 28}}>location_on</span>
               </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
