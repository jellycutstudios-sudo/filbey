'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { MENU_DATA } from '@/data/menuData';

export default function MenuClient() {
  const { t, translateMenu } = useLanguage();
  const menuData = useMemo(() => translateMenu(MENU_DATA), [translateMenu]);

  const [activeCategory, setActiveCategory] = useState(menuData[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'VEG' | 'SPICY' | 'POPULAR'>('ALL');

  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    const element = categoryRefs.current[id];
    if (element) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Filter logic
  const filteredMenu = useMemo(() => {
    return menuData.map((cat) => {
      const items = cat.items.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.desc && item.desc.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        if (activeFilter === 'VEG') return item.isVeg;
        if (activeFilter === 'SPICY') return item.isSpicy;
        if (activeFilter === 'POPULAR') return item.isPopular;

        return true;
      });

      return { ...cat, items };
    }).filter((cat) => cat.items.length > 0);
  }, [searchTerm, activeFilter, menuData]);

  // On mount, read URL hash and scroll to matching category
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const timer = setTimeout(() => {
        scrollToCategory(hash);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle active scroll highlight
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      for (const cat of menuData) {
        const ref = categoryRefs.current[cat.id];
        if (ref) {
          const top = ref.offsetTop;
          const height = ref.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveCategory(cat.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuData]);

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-4 pb-20">
      {/* Title */}
      <section className="text-center mb-8 mt-4">
        <h1 className="font-display text-headline-lg-mobile md:text-display text-primary uppercase">
          {t('menu.heroTitle')}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl mx-auto">
          {t('menu.heroDesc')}{' '}
          <br />
          <span className="text-sm italic">
            {t('menu.heroSub')}
          </span>
        </p>

        {/* CTA to online order */}
        <div className="mt-4 flex justify-center">
          <Link
            href="/order"
            className="inline-flex items-center gap-2 bg-primary text-white font-label-lg px-6 py-2.5 rounded-full shadow-md hover:bg-primary-container hover:scale-105 transition-all text-sm"
          >
            <span className="material-symbols-outlined text-lg">delivery_dining</span>
            Order Online for Home Delivery
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* Search and Filters Bar */}
      <div className="bg-surface-container/60 backdrop-blur-md sticky top-20 z-40 py-3 px-4 md:px-6 rounded-2xl flex flex-col md:flex-row gap-3 justify-between items-center shadow-sm border border-surface-variant/20 mb-8">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-lg">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('menu.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-surface-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-body-md text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
          {[
            { id: 'ALL', label: t('menu.filterAll'), icon: 'menu_book' },
            { id: 'VEG', label: t('menu.filterVeg'), icon: 'local_pizza' },
            { id: 'SPICY', label: t('menu.filterSpicy'), icon: 'local_fire_department' },
            { id: 'POPULAR', label: t('menu.filterPopular'), icon: 'grade' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as 'ALL' | 'VEG' | 'SPICY' | 'POPULAR')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-label-lg text-label-lg transition-all cursor-pointer text-xs ${
                activeFilter === filter.id
                  ? 'bg-primary text-on-primary shadow-md scale-105'
                  : 'bg-white text-on-surface-variant border border-surface-variant/20 hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-xs">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Sidebar + Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-[150px] bg-white rounded-2xl p-4 border border-surface-variant/10 shadow-sm">
          <h3 className="font-headline-md text-xl text-primary uppercase border-b border-surface-variant/20 pb-2 mb-3 px-2">
            Categories
          </h3>
          <nav className="flex flex-col gap-1">
            {menuData.map((cat) => (
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

        {/* Mobile Horizontal Category Bar */}
        <div className="lg:hidden w-full overflow-x-auto no-scrollbar flex gap-2 pb-2 mb-4 sticky top-[135px] z-30 bg-background py-2">
          {menuData.map((cat) => (
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

        {/* Dishes Grid */}
        <div className="lg:col-span-9 flex flex-col gap-8">
          {filteredMenu.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-surface-variant/10">
              <span className="material-symbols-outlined text-6xl text-primary/30 mb-4 block">
                sentiment_dissatisfied
              </span>
              <h3 className="font-headline-md text-2xl text-on-surface">{t('menu.noDishesTitle')}</h3>
              <p className="font-body-md text-on-surface-variant mt-2">
                {t('menu.noDishesDesc')}
              </p>
            </div>
          ) : (
            filteredMenu.map((cat) => (
              <section
                key={cat.id}
                ref={(el) => {
                  categoryRefs.current[cat.id] = el;
                }}
                className="bg-white rounded-2xl p-5 md:p-6 border border-surface-variant/10 shadow-sm scroll-mt-28"
              >
                <h2 className="font-headline-lg text-xl md:text-2xl text-primary uppercase border-b-2 border-primary-container pb-2 mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl md:text-3xl text-secondary">
                    {cat.icon}
                  </span>
                  {cat.title}
                  <span className="text-xs text-on-surface-variant font-normal normal-case ml-auto">
                    {cat.items.length} dishes
                  </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cat.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex items-start justify-between gap-3 p-4 rounded-2xl border border-surface-variant/20 bg-surface-container-lowest/50 hover:bg-surface-container-low hover:border-primary/30 transition-all duration-300"
                    >
                      {/* Left: Info */}
                      <div className="flex-1 min-w-0 pr-1 flex flex-col justify-between h-full">
                        <div>
                          {/* Badges & Veg/Non-Veg */}
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
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

                            {item.badge === 'BEST SELLER' && (
                              <span className="bg-amber-50 text-amber-800 border border-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                ⭐ BESTSELLER
                              </span>
                            )}
                            {item.badge === 'POPULAR' && (
                              <span className="bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px] px-2 py-0.5 rounded-full">
                                ★ {t('home.popular')}
                              </span>
                            )}
                            {item.badge === 'HOT' && (
                              <span className="bg-red-50 text-red-700 border border-red-200 font-bold text-[10px] px-2 py-0.5 rounded-full">
                                🔥 {t('badge.hot')}
                              </span>
                            )}
                            {item.badge === 'SIGNATURE' && (
                              <span className="bg-primary/10 text-primary border border-primary/25 font-bold text-[10px] px-2 py-0.5 rounded-full">
                                👑 {t('badge.signature')}
                              </span>
                            )}
                            {item.badge === 'SPECIAL' && (
                              <span className="bg-pink-50 text-pink-700 border border-pink-200 font-bold text-[10px] px-2 py-0.5 rounded-full">
                                ✨ {t('badge.special')}
                              </span>
                            )}
                          </div>

                          {/* Name */}
                          <h3 className="font-headline-md text-base md:text-lg text-on-surface font-bold leading-snug group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>

                          {/* Price */}
                          {item.price ? (
                            <div className="mt-1 font-extrabold text-base md:text-lg text-on-surface">
                              ₹{item.price}
                            </div>
                          ) : item.prices ? (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {item.prices.map((p, pIdx) => (
                                <span
                                  key={pIdx}
                                  className="bg-surface-container border border-surface-variant/25 text-xs font-semibold py-0.5 px-2 rounded-lg text-on-surface flex items-center gap-1"
                                >
                                  <span className="text-on-surface-variant text-[11px]">{p.label}:</span>
                                  <strong className="text-primary">₹{p.price}</strong>
                                </span>
                              ))}
                            </div>
                          ) : null}

                          {/* Description */}
                          {item.desc && (
                            <p className="font-body-sm text-xs md:text-sm text-on-surface-variant/80 mt-1.5 line-clamp-2 leading-relaxed">
                              {item.desc}
                            </p>
                          )}
                        </div>

                        {/* Order action link */}
                        <div className="mt-3 pt-2 border-t border-surface-variant/10">
                          <Link
                            href="/order"
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-container transition-colors"
                          >
                            Order this dish <span className="material-symbols-outlined text-xs">arrow_forward</span>
                          </Link>
                        </div>
                      </div>

                      {/* Right: Photo */}
                      <div className="relative flex-shrink-0 w-28 md:w-32 h-28 md:h-32 rounded-2xl overflow-hidden bg-white border border-surface-variant/20 shadow-xs flex items-center justify-center">
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
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
