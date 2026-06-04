'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

export default function Home() {
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroSection = heroSectionRef.current;
    const heroBg = heroBgRef.current;
    if (!heroSection || !heroBg) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xPos = clientX / innerWidth - 0.5;
      const yPos = clientY / innerHeight - 0.5;
      const xOffset = xPos * -40;
      const yOffset = yPos * -40;
      heroBg.style.transform = `scale(1.1) translate(${xOffset}px, ${yOffset}px)`;
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
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section
          id="hero-section"
          ref={heroSectionRef}
          className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden"
        >
          {/* Background Image */}
          <div
            ref={heroBgRef}
            className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out scale-110"
          >
            <Image
              src="/hero-image.jpeg"
              alt="Filbey Hero Background"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Content */}
          <div className="relative z-10 text-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col items-center gap-stack-lg">
            <h1 className="font-display text-display text-white text-shadow-hero uppercase leading-tight md:text-7xl text-5xl">
              A Little Crunch.<br />
              <span className="text-secondary-fixed-dim">A Lot of Comfort!</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-stack-md mt-stack-md">
              <Link
                href="/menu"
                className="bg-primary text-on-primary font-label-lg text-label-lg py-4 px-8 rounded-full shadow-[0_4px_16px_rgba(93,0,12,0.4)] hover:bg-primary-container hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Dine-In Menu <span className="material-symbols-outlined">restaurant_menu</span>
              </Link>
              <Link
                href="https://maps.app.goo.gl/w5SU8wuf79VM7HtW9?g_st=iw"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-secondary-container text-secondary-container bg-black/20 backdrop-blur-sm font-label-lg text-label-lg py-4 px-8 rounded-full hover:bg-secondary-container hover:text-on-secondary-container hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Find Us <span className="material-symbols-outlined">location_on</span>
              </Link>
            </div>
          </div>
        </section>

        {/* About Us Teaser Section */}
        <section className="py-margin-desktop bg-surface px-margin-mobile md:px-margin-desktop overflow-hidden">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
            {/* Image Side */}
            <div className="lg:col-span-5 relative h-[350px] md:h-[450px] rounded-[24px] overflow-hidden menu-card-shadow">
              <Image
                src="/Classic Burgers.png"
                alt="Filbey Fried Chicken &amp; Burgers Chennai Food Showcase"
                fill
                sizes="(max-width: 1024px) 100vw, 41vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Text Side */}
            <div className="lg:col-span-7 flex flex-col items-start gap-stack-md lg:pl-6">
              <span className="bg-primary-fixed text-primary font-label-sm text-label-sm px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                Our Story
              </span>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-primary uppercase leading-tight">
                Crafting Chennai's Finest <br />
                <span className="text-secondary">Fried Chicken &amp; Burgers</span>
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                At Filbey, we believe in one simple rule: absolute quality. Recognized as the home of the best crispy fried chicken and handcrafted burgers in the city, we prep everything fresh daily. From our secret seasoning blend to the perfectly toasted buns, every bite is crafted to make you fall in love.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant/80">
                It's not just food—it's a flavor obsession. Chennai's foodies have spoken, and our menu is officially their favorite spot for hot, crunchy, and savory cravings.
              </p>
              <Link
                href="/about"
                className="mt-2 bg-secondary-container text-on-secondary-container font-label-lg text-label-lg py-4 px-8 rounded-full hover:bg-secondary-fixed hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                Read Our Story <span className="material-symbols-outlined">arrow_right_alt</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="py-margin-desktop bg-surface-container-low px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[
              { icon: 'verified', bg: 'bg-secondary-fixed', color: 'text-secondary', title: 'Halal Certified', sub: '100% preparation' },
              { icon: 'favorite', bg: 'bg-primary-fixed', color: 'text-primary', title: 'Made With Love', sub: 'Freshly prepared daily' },
              { icon: 'local_fire_department', bg: 'bg-secondary-fixed', color: 'text-secondary', title: 'Fresh & Hot', sub: 'Served in 10-15 mins' },
            ].map((h) => (
              <div key={h.title} className="bg-surface rounded-xl p-6 menu-card-shadow flex flex-col items-center text-center gap-stack-sm hover:-translate-y-1 transition-transform duration-300">
                <div className={`w-16 h-16 rounded-full ${h.bg} flex items-center justify-center ${h.color} mb-2`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 32, fontVariationSettings: "'FILL' 1" }}>{h.icon}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">{h.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{h.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Menu Explorer */}
        <section className="py-margin-desktop bg-background px-margin-mobile md:px-margin-desktop" id="menu">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col items-center text-center mb-stack-lg">
              <h2 className="font-display text-headline-lg-mobile md:text-display text-primary uppercase">Explore Our Dine-In Menu</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-stack-sm">* GST extra on all items. Dine-in pricing only.</p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-margin-desktop">
              {/* Signature Chicken - large */}
              <Link href="/menu#signature-chicken" className="md:col-span-8 relative rounded-[24px] overflow-hidden group menu-card-shadow aspect-[4/3] md:aspect-auto h-full md:min-h-[300px] block">
                <Image src="/Signature Chicken.png" alt="Filbey Signature Fried Chicken Bucket Meal" fill sizes="(max-width: 768px) 100vw, 66vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex justify-between items-end">
                  <div>
                    <span className="bg-primary text-white font-label-sm text-label-sm px-3 py-1 rounded-full mb-2 inline-block">Popular</span>
                    <h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white uppercase">Signature Chicken</h3>
                    <p className="font-body-md text-body-md text-surface-bright mt-1">2 Pc • 4 Pc • 8 Pc</p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                </div>
              </Link>

              {/* Classic Burgers */}
              <Link href="/menu#burgers" className="md:col-span-4 relative rounded-[24px] overflow-hidden group menu-card-shadow aspect-[4/3] md:aspect-auto h-full md:min-h-[300px] block">
                <Image src="/Classic Burgers.png" alt="Filbey Classic Dynamite Burger Meal" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="font-headline-md text-headline-md text-white uppercase">Classic Burgers</h3>
                  <p className="text-sm text-surface-bright mt-1">Dynamite, Veg &amp; More</p>
                </div>
              </Link>

              {/* Signature Shakes */}
              <Link href="/menu#beverages" className="md:col-span-6 relative rounded-[24px] overflow-hidden group menu-card-shadow aspect-[4/3] md:aspect-auto h-full md:min-h-[300px] block">
                <Image src="/Signature Shakes.png" alt="Filbey Signature Lotus Biscoff Milkshake" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="font-headline-md text-headline-md text-white uppercase">Signature Shakes</h3>
                  <p className="text-sm text-surface-bright mt-1">Featuring Lotus Biscoff</p>
                </div>
              </Link>

              {/* Wraps & Sides */}
              <Link href="/menu#wraps" className="md:col-span-6 relative rounded-[24px] overflow-hidden group menu-card-shadow aspect-[4/3] md:aspect-auto h-full md:min-h-[300px] block">
                <Image src="/Wraps & Sides.png" alt="Filbey Crispy Chicken Wraps and Loaded Fries Sides" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="font-headline-md text-headline-md text-white uppercase">Wraps &amp; Sides</h3>
                  <p className="text-sm text-surface-bright mt-1">Loaded Fries, Chilli Cheese</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-margin-desktop bg-surface px-margin-mobile md:px-margin-desktop" id="faq">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col items-center text-center mb-stack-lg">
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-primary uppercase">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
              {[
                { q: 'Where is Filbey located?', a: 'We are located in Perungudi, OMR — Chennai. You can use the map link in our footer to get exact directions.' },
                { q: 'Is the meat Halal certified?', a: 'Yes, our chicken and all meat preparations are 100% Halal certified.' },
                { q: 'What are your opening hours?', a: 'We are open every day from Monday to Sunday, 11:30 AM to 11:30 PM.' },
                { q: 'Do you offer vegetarian options?', a: 'Absolutely! We have dedicated vegetarian options across our menu including Veg Burgers, Paneer Wraps, and Veg Nuggets.' },
              ].map((faq) => (
                <div key={faq.q} className="bg-white rounded-xl p-6 menu-card-shadow">
                  <h3 className="font-headline-md text-xl text-on-surface mb-2">{faq.q}</h3>
                  <p className="font-body-md text-on-surface-variant">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
