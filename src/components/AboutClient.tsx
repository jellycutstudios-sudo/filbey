'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutClient() {
  const { t } = useLanguage();

  return (
    <main className="pt-24 pb-margin-desktop bg-background text-on-surface">
      {/* Page Hero Title */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center mb-12 mt-8">
        <span className="text-secondary font-label-lg text-label-lg uppercase tracking-widest font-bold">
          {t('about.heroTag')}
        </span>
        <h1 className="font-display text-display text-primary uppercase mt-2">
          {t('about.heroTitle')}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-3 max-w-2xl mx-auto">
          {t('about.heroDesc')}
        </p>
      </section>

      {/* Feature Story Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          {/* Story Image Panel */}
          <div className="lg:col-span-6 relative h-[350px] md:h-[500px] rounded-[24px] overflow-hidden menu-card-shadow">
            <Image
              src="/Document.png"
              alt="Filbey Fried Chicken &amp; Burgers Restaurant Experience"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="font-display text-2xl uppercase tracking-wider text-secondary-container">
                {t('about.sideQuoteTag')}
              </p>
              <p className="font-body-md text-sm mt-1 opacity-90">
                {t('about.sideQuoteDesc')}
              </p>
            </div>
          </div>

          {/* Story Text Content */}
          <div className="lg:col-span-6 flex flex-col gap-6 lg:pl-8">
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-primary uppercase leading-tight">
              {t('about.storyTitle')}
            </h2>

            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {t('about.storyDesc1')}
            </p>

            <div className="flex flex-col gap-4 border-l-4 border-primary pl-4 py-2 bg-surface-container-low rounded-r-xl">
              <p className="font-body-md text-body-md text-on-surface font-semibold italic">
                {t('about.quoteMain')}
              </p>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant">
              {t('about.storyDesc2')}
            </p>
          </div>
        </div>
      </section>

      {/* Pillars / Values Section */}
      <section className="bg-surface-container-low py-16 px-margin-mobile md:px-margin-desktop mb-16 rounded-[24px] max-w-container-max mx-auto menu-card-shadow">
        <div className="text-center mb-12">
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-primary uppercase">
            {t('about.promisesTitle')}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            {t('about.promisesSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Pillar 1 */}
          <div className="bg-white rounded-xl p-8 flex flex-col items-center text-center gap-4 menu-card-shadow">
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontSize: 36, fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
            <h3 className="font-headline-md text-2xl text-on-surface uppercase">{t('about.promise1Title')}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t('about.promise1Desc')}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-xl p-8 flex flex-col items-center text-center gap-4 menu-card-shadow">
            <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined" style={{ fontSize: 36, fontVariationSettings: "'FILL' 1" }}>
                skillet
              </span>
            </div>
            <h3 className="font-headline-md text-2xl text-on-surface uppercase">{t('about.promise2Title')}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t('about.promise2Desc')}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-xl p-8 flex flex-col items-center text-center gap-4 menu-card-shadow">
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontSize: 36, fontVariationSettings: "'FILL' 1" }}>
                thumb_up
              </span>
            </div>
            <h3 className="font-headline-md text-2xl text-on-surface uppercase">{t('about.promise3Title')}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t('about.promise3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center py-8">
        <div className="bg-primary rounded-[24px] py-12 px-6 md:py-16 md:px-12 flex flex-col items-center gap-6 shadow-[0_8px_32px_rgba(93,0,12,0.3)]">
          <h2 className="font-display text-4xl md:text-5xl text-white uppercase max-w-2xl leading-tight">
            {t('about.ctaTitle')}
          </h2>
          <p className="font-body-lg text-body-lg text-primary-fixed max-w-lg">
            {t('about.ctaDesc')}
          </p>
          <Link
            href="/menu"
            className="bg-secondary-container text-on-secondary-container font-label-lg text-label-lg py-4 px-8 rounded-full hover:bg-secondary-fixed hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
          >
            {t('nav.dineInMenu')} <span className="material-symbols-outlined">restaurant_menu</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
