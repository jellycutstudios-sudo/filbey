'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { getRestaurantStatus, type OpenStatus } from '@/utils/restaurantHours';

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where is Filbey located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We are located in Perungudi, OMR — Chennai.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the meat Halal certified?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, our chicken and all meat preparations are 100% Halal certified.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are your opening hours?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We are open every day from Monday to Sunday, 11:30 AM to 11:30 PM.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer vegetarian options?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! We have dedicated vegetarian options across our menu including Veg Burgers, Paneer Wraps, and Veg Nuggets.',
      },
    },
  ],
};

const TICKER_ITEMS_BASE = [
  { icon: 'sell', text: '1st Order ₹30 OFF — Use on checkout' },
  { icon: 'local_shipping', text: 'Free Delivery on orders ₹499+' },
  { icon: 'verified', text: '100% Halal Certified Chicken' },
  { icon: 'star', text: 'Loved by 500+ customers in OMR, Chennai' },
  { icon: 'chat', text: 'Quick orders via WhatsApp — +91 81223 56144' },
];

const PERKS = [
  {
    icon: 'sell',
    title: '₹30 OFF',
    sub: 'First Direct Order',
    badgeBg: 'bg-primary/10 text-primary border-primary/20',
  },
  {
    icon: 'moped',
    title: 'Free Delivery',
    sub: 'On Orders ₹499+',
    badgeBg: 'bg-emerald-600/10 text-emerald-700 border-emerald-600/20',
  },
  {
    icon: 'verified',
    title: '100% Halal',
    sub: 'Certified Kitchen',
    badgeBg: 'bg-amber-600/10 text-amber-800 border-amber-600/20',
  },
  {
    icon: 'local_fire_department',
    title: 'Fresh & Hot',
    sub: 'Fried to Order',
    badgeBg: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
  },
  {
    icon: 'star',
    title: '4.5★ Rating',
    sub: 'Google Reviews',
    badgeBg: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  },
  {
    icon: 'chat',
    title: 'WhatsApp',
    sub: 'Order by Chat',
    badgeBg: 'bg-[#25D366]/10 text-[#128C7E] border-[#25D366]/25',
    isWhatsApp: true,
  },
];

export default function Home() {
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useLanguage();
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [restaurantStatus, setRestaurantStatus] = useState<OpenStatus | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const hasOrdered = localStorage.getItem('filbey_has_ordered');
    setIsFirstOrder(!hasOrdered);
    setRestaurantStatus(getRestaurantStatus());
    setMounted(true);
    const timer = setInterval(() => setRestaurantStatus(getRestaurantStatus()), 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const heroSection = heroSectionRef.current;
    const heroBg = heroBgRef.current;
    if (!heroSection || !heroBg) return;

    // Only apply parallax when video hasn't loaded (poster image mode)
    const handleMouseMove = (e: MouseEvent) => {
      if (videoLoaded) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xPos = clientX / innerWidth - 0.5;
      const yPos = clientY / innerHeight - 0.5;
      heroBg.style.transform = `scale(1.1) translate(${xPos * -40}px, ${yPos * -40}px)`;
    };
    const handleMouseLeave = () => {
      heroBg.style.transform = 'scale(1.1) translate(0px, 0px)';
    };

    heroSection.addEventListener('mousemove', handleMouseMove);
    heroSection.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      heroSection.removeEventListener('mousemove', handleMouseMove);
      heroSection.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [videoLoaded]);

  // Build ticker items — inject live status as the hours item
  const hoursTickerItem = mounted && restaurantStatus
    ? {
        icon: restaurantStatus.isOpen ? 'fiber_manual_record' : 'schedule',
        text: restaurantStatus.isOpen ? restaurantStatus.label : 'Closed · Opens at 11:30 AM',
        iconColor: restaurantStatus.isOpen ? 'text-emerald-400' : 'text-amber-300'
      }
    : { icon: 'schedule', text: 'Open Daily 11:30 AM – 11:30 PM', iconColor: 'text-white/80' };
  const TICKER_ITEMS = [...TICKER_ITEMS_BASE, hoursTickerItem];
  const tickerItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />

      {/* ── Offer Ticker Strip ── */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-primary overflow-hidden h-9 flex items-center">
        <div className="ticker-track flex items-center">
          {tickerItems.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 text-white text-xs font-semibold px-6 tracking-wide shrink-0"
            >
              <span className={`material-symbols-outlined text-sm leading-none ${'iconColor' in item ? item.iconColor : 'text-white/90'}`}>{item.icon}</span>
              <span>{item.text}</span>
              <span className="mx-4 text-white/40 text-base leading-none">•</span>
            </span>
          ))}
        </div>
      </div>

      <main className="pt-[116px]">
        {/* ── Hero Section ── */}
        <section
          id="hero-section"
          ref={heroSectionRef}
          className="relative w-full min-h-[88svh] flex items-center justify-center overflow-hidden"
        >
          {/* ── Poster Image (shows instantly, hidden once video plays) ── */}
          <div
            ref={heroBgRef}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out scale-110 ${
              videoLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Image
              src="/hero-video-poster.jpg"
              alt="Filbey Hero"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {/* ── Hero Video (lazy-loaded, fades in when ready) ── */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/hero-video-poster.jpg"
            onCanPlayThrough={() => setVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src="/hero-video.webm" type="video/webm" />
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 md:px-8 max-w-3xl mx-auto flex flex-col items-center gap-4 py-12 md:py-16">

            {/* Clean Live Status Pill */}
            {mounted && restaurantStatus && (
              <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs text-white shadow-sm whitespace-nowrap">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${restaurantStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                <span className={`font-semibold ${restaurantStatus.isOpen ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {restaurantStatus.isOpen ? 'Open Now · Closes 11:30 PM' : restaurantStatus.label}
                </span>
                <span className="text-white/30">•</span>
                <span className="text-white/80 font-normal">Perungudi</span>
              </div>
            )}

            {/* Headline - Clean 2 lines on mobile & desktop */}
            <h1 className="font-display font-extrabold tracking-tight text-white text-shadow-hero uppercase leading-[1.08] text-3xl sm:text-5xl md:text-7xl max-w-2xl mx-auto">
              {t('home.heroTitle1')}<br />
              <span className="text-secondary-fixed-dim">{t('home.heroTitle2')}</span>
            </h1>

            {/* Appetizing Subtitle & Direct Order Offer */}
            <div className="flex flex-col items-center gap-2 max-w-md mx-auto">
              <p className="text-white/90 text-sm md:text-base font-normal tracking-wide">
                Signature Fried Chicken, Dynamite Burgers &amp; Thick Shakes
              </p>
              {mounted && isFirstOrder ? (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-primary-container/40 to-amber-500/20 backdrop-blur-md border border-amber-300/40 text-amber-100 text-xs sm:text-sm px-4 py-1.5 rounded-full font-semibold shadow-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">sell</span>
                    ₹30 OFF First Direct Order
                  </span>
                  <span className="text-white/30">•</span>
                  <span>Free Delivery ₹499+</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm px-4 py-1.5 rounded-full font-medium shadow-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">local_shipping</span>
                    Free Delivery on orders ₹499+
                  </span>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-1 w-full max-w-sm sm:max-w-none">
              <Link
                href="/order"
                id="hero-order-now-btn"
                className="w-full sm:w-auto bg-primary hover:bg-primary-container text-white font-label-lg text-base py-3.5 px-8 rounded-full shadow-[0_6px_25px_rgba(93,0,12,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>moped</span>
                <span>Order Online</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold ml-1">Direct Delivery</span>
              </Link>
              <Link
                href="/menu"
                id="hero-view-menu-btn"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-label-lg text-base py-3.5 px-7 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>{t('nav.dineInMenu')}</span>
                <span className="material-symbols-outlined text-sm">restaurant_menu</span>
              </Link>
            </div>

            {/* Clean Trust Strip - No Pay on Delivery, No Clutter */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 text-white/75 text-xs pt-1">
              <span className="flex items-center gap-1 font-medium">
                <span className="text-secondary-fixed-dim font-bold">✓</span> 100% Halal
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1 font-medium">
                <span className="text-secondary-fixed-dim font-bold">✓</span> 30–45 Mins Delivery
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1 font-medium">
                <span className="text-secondary-fixed-dim font-bold">✓</span> WhatsApp Order
              </span>
            </div>
          </div>
        </section>

        {/* ── Perks Strip (Refined Flat Icons, No Emojis) ── */}
        <section className="bg-gradient-to-b from-surface via-surface-container-lowest to-surface-container-low py-7 px-4 md:px-8 border-y border-surface-variant/20">
          <div className="max-w-container-max mx-auto">
            {/* Mobile: horizontal scroll with subtle snap */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 md:hidden scroll-smooth -mx-4 px-4">
              {PERKS.map((perk) => (
                <div
                  key={perk.title}
                  className="flex-shrink-0 flex flex-col items-center text-center bg-white rounded-2xl p-4 shadow-2xs border border-surface-variant/25 min-w-[124px]"
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-2.5 border ${perk.badgeBg}`}>
                    {perk.isWhatsApp ? (
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.177.182-.076.355.101.173.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z"/>
                      </svg>
                    ) : (
                      <span className="material-symbols-outlined text-xl">{perk.icon}</span>
                    )}
                  </div>
                  <span className="font-extrabold text-on-surface text-xs leading-tight">{perk.title}</span>
                  <span className="text-on-surface-variant/70 text-[10px] font-medium leading-tight mt-0.5">{perk.sub}</span>
                </div>
              ))}
            </div>

            {/* Desktop: 6-column grid with premium hover micro-interactions */}
            <div className="hidden md:grid grid-cols-6 gap-3.5">
              {PERKS.map((perk) => (
                <div
                  key={perk.title}
                  className="group flex flex-col items-center text-center bg-white hover:bg-white rounded-2xl p-4 shadow-2xs hover:shadow-md border border-surface-variant/25 hover:border-primary/25 transition-all duration-300 hover:-translate-y-1 cursor-default"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 border transition-transform duration-300 group-hover:scale-110 ${perk.badgeBg}`}>
                    {perk.isWhatsApp ? (
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.177.182-.076.355.101.173.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z"/>
                      </svg>
                    ) : (
                      <span className="material-symbols-outlined text-2xl">{perk.icon}</span>
                    )}
                  </div>
                  <span className="font-extrabold text-on-surface text-sm leading-tight group-hover:text-primary transition-colors">{perk.title}</span>
                  <span className="text-on-surface-variant/70 text-xs font-medium leading-tight mt-1">{perk.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── About Us Teaser Section ── */}
        <section className="py-margin-desktop bg-surface px-margin-mobile md:px-margin-desktop overflow-hidden">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
            {/* Image Side */}
            <div className="lg:col-span-6 relative aspect-[4/3] w-full rounded-[24px] overflow-hidden menu-card-shadow shadow-md">
              <Image
                src="/about-filbey-storefront.jpg"
                alt="Filbey Fried Chicken & Burgers Perungudi Storefront"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>

            {/* Text Side */}
            <div className="lg:col-span-6 flex flex-col items-start gap-stack-md lg:pl-6">
              <span className="bg-primary-fixed text-primary font-label-sm text-label-sm px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                {t('home.storyTag')}
              </span>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-primary uppercase leading-tight">
                {t('home.storyTitle1')} <br />
                <span className="text-secondary">{t('home.storyTitle2')}</span>
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                {t('home.storyDesc1')}
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant/80">
                {t('home.storyDesc2')}
              </p>
              <Link
                href="/about"
                className="mt-2 bg-secondary-container text-on-secondary-container font-label-lg text-label-lg py-4 px-8 rounded-full hover:bg-secondary-fixed hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                {t('home.storyBtn')} <span className="material-symbols-outlined">arrow_right_alt</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Highlights ── */}
        <section className="py-margin-desktop bg-surface-container-low px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[
              { icon: 'verified', bg: 'bg-secondary-fixed', color: 'text-secondary', titleKey: 'home.halalTitle', subKey: 'home.halalDesc' },
              { icon: 'favorite', bg: 'bg-primary-fixed', color: 'text-primary', titleKey: 'home.loveTitle', subKey: 'home.loveDesc' },
              { icon: 'local_fire_department', bg: 'bg-secondary-fixed', color: 'text-secondary', titleKey: 'home.freshTitle', subKey: 'home.freshDesc' },
            ].map((h) => (
              <div key={h.titleKey} className="bg-surface rounded-xl p-6 menu-card-shadow flex flex-col items-center text-center gap-stack-sm hover:-translate-y-1 transition-transform duration-300">
                <div className={`w-16 h-16 rounded-full ${h.bg} flex items-center justify-center ${h.color} mb-2`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 32, fontVariationSettings: "'FILL' 1" }}>{h.icon}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">{t(h.titleKey)}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{t(h.subKey)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Menu Explorer ── */}
        <section className="py-margin-desktop bg-background px-margin-mobile md:px-margin-desktop" id="menu">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col items-center text-center mb-stack-lg">
              <h2 className="font-display text-headline-lg-mobile md:text-display text-primary uppercase">{t('home.exploreMenu')}</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-stack-sm">{t('home.exploreMenuSub')}</p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-margin-desktop">
              {/* Signature Chicken - large */}
              <Link href="/menu#fried-chicken" className="md:col-span-8 relative rounded-[24px] overflow-hidden group menu-card-shadow aspect-video md:aspect-auto md:min-h-[300px] block">
                <Image src="/Signature Chicken.png" alt="Filbey Signature Fried Chicken Bucket Meal" fill sizes="(max-width: 768px) 100vw, 66vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 md:p-8 w-full flex justify-between items-end">
                  <div>
                    <span className="bg-primary text-white font-label-sm text-label-sm px-3 py-1 rounded-full mb-2 inline-block">{t('home.popular')}</span>
                    <h3 className="font-headline-lg text-2xl md:text-headline-lg text-white uppercase">{t('home.signatureChicken')}</h3>
                    <p className="font-body-md text-sm text-surface-bright mt-1">2 Pc • 4 Pc • 8 Pc</p>
                  </div>
                  <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-sm md:text-base">arrow_forward</span>
                  </div>
                </div>
              </Link>

              {/* Classic Burgers */}
              <Link href="/menu#burgers" className="md:col-span-4 relative rounded-[24px] overflow-hidden group menu-card-shadow aspect-video md:aspect-auto md:min-h-[300px] block">
                <Image src="/Classic Burgers.png" alt="Filbey Classic Dynamite Burger Meal" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 md:p-6 w-full flex justify-between items-end">
                  <div>
                    <h3 className="font-headline-md text-xl md:text-headline-md text-white uppercase">{t('home.classicBurgers')}</h3>
                    <p className="text-xs md:text-sm text-surface-bright mt-1">{t('home.classicBurgersDesc')}</p>
                  </div>
                  <div className="shrink-0 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </div>
              </Link>

              {/* Signature Shakes */}
              <Link href="/menu#drinks-desserts" className="md:col-span-6 relative rounded-[24px] overflow-hidden group menu-card-shadow aspect-video md:aspect-auto md:min-h-[300px] block">
                <Image src="/Signature Shakes.png" alt="Filbey Signature Lotus Biscoff Milkshake" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 md:p-6 w-full flex justify-between items-end">
                  <div>
                    <h3 className="font-headline-md text-xl md:text-headline-md text-white uppercase">{t('home.signatureShakes')}</h3>
                    <p className="text-xs md:text-sm text-surface-bright mt-1">{t('home.signatureShakesDesc')}</p>
                  </div>
                  <div className="shrink-0 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </div>
              </Link>

              {/* Wraps & Sides */}
              <Link href="/menu#wraps-sides" className="md:col-span-6 relative rounded-[24px] overflow-hidden group menu-card-shadow aspect-video md:aspect-auto md:min-h-[300px] block">
                <Image src="/Wraps & Sides.png" alt="Filbey Crispy Chicken Wraps and Loaded Fries Sides" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 md:p-6 w-full flex justify-between items-end">
                  <div>
                    <h3 className="font-headline-md text-xl md:text-headline-md text-white uppercase">{t('home.wrapsSidesTitle')}</h3>
                    <p className="text-xs md:text-sm text-surface-bright mt-1">{t('home.wrapsSidesDesc')}</p>
                  </div>
                  <div className="shrink-0 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Browse Full Menu CTA */}
            <div className="flex justify-center">
              <Link
                href="/menu"
                className="flex items-center gap-2 border-2 border-primary text-primary font-label-lg text-sm md:text-base py-3.5 px-8 rounded-full hover:bg-primary hover:text-white hover:scale-105 transition-all duration-300"
              >
                Browse Full Menu <span className="material-symbols-outlined">restaurant_menu</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section className="py-margin-desktop bg-surface px-margin-mobile md:px-margin-desktop" id="faq">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Where is Filbey located in Chennai?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Filbey is located on OMR Road in Perungudi, Chennai, easily accessible for dine-in, takeaway, and delivery."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is Filbey 100% Halal certified?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, all chicken and meats prepared at Filbey are 100% Halal certified, fresh, and never frozen."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What are Filbey's opening hours?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Filbey is open 7 days a week from Monday to Sunday, 11:30 AM to 11:30 PM."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Do you offer vegetarian options?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! We serve dedicated vegetarian options including Paneer Crunch Burgers, Veg Wraps, and Crispy Veg Nuggets."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Does Filbey deliver in Chennai?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, Filbey delivers directly within a 5 km radius across Perungudi, Kandanchavadi, Thoraipakkam, and OMR, with free delivery on orders above ₹499."
                    }
                  }
                ]
              })
            }}
          />
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col items-center text-center mb-stack-lg">
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-primary uppercase">
                {t('home.faqTitle')}
              </h2>
            </div>
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
              {[
                { qKey: 'home.faqQ1', aKey: 'home.faqA1' },
                { qKey: 'home.faqQ2', aKey: 'home.faqA2' },
                { qKey: 'home.faqQ3', aKey: 'home.faqA3' },
                { qKey: 'home.faqQ4', aKey: 'home.faqA4' },
              ].map((faq) => (
                <div key={faq.qKey} className="bg-white rounded-xl p-5 md:p-6 menu-card-shadow">
                  <h3 className="font-headline-md text-lg md:text-xl text-on-surface mb-2">{t(faq.qKey)}</h3>
                  <p className="font-body-md text-on-surface-variant">{t(faq.aKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WhatsApp Order CTA Block ── */}
        <section className="py-margin-desktop bg-surface-container-low px-margin-mobile md:px-margin-desktop">
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-br from-[#075E54] to-[#128C7E] rounded-3xl overflow-hidden p-7 md:p-10 flex flex-col md:flex-row items-center gap-6 shadow-[0_8px_32px_rgba(7,94,84,0.25)]">
              {/* Background decoration */}
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute -right-4 bottom-4 w-20 h-20 rounded-full bg-white/5" />

              {/* WhatsApp icon */}
              <div className="relative shrink-0 w-16 h-16 md:w-20 md:h-20 bg-white/15 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                </svg>
              </div>

              {/* Text */}
              <div className="text-center md:text-left flex-1 relative z-10">
                <h3 className="text-white font-display text-2xl md:text-3xl uppercase leading-tight mb-1">
                  Prefer to order by chat?
                </h3>
                <p className="text-white/80 text-sm md:text-base mb-4">
                  Place your order directly on WhatsApp — quick, easy, and personal. We'll confirm your order in minutes.
                </p>
                <Link
                  href="https://wa.me/918122356144"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="whatsapp-order-cta"
                  className="inline-flex items-center gap-2 bg-white text-[#075E54] font-bold text-sm md:text-base py-3 px-7 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  Chat on WhatsApp
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ── Sticky Mobile Bottom Bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-surface-container-high px-4 py-3 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]">
        <Link
          href="tel:+918122356144"
          id="mobile-sticky-call-btn"
          className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary/20 bg-primary/5 text-primary shrink-0 hover:bg-primary/10 transition-colors"
          aria-label="Call us"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
        </Link>
        <Link
          href="/order"
          id="mobile-sticky-order-btn"
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-bold text-base py-3 rounded-full shadow-[0_4px_16px_rgba(93,0,12,0.4)] hover:bg-primary-container transition-all duration-300 active:scale-95"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>delivery_dining</span>
          Order Now{mounted && isFirstOrder ? ' — ₹30 Off' : ''}
        </Link>
      </div>
    </>
  );
}
