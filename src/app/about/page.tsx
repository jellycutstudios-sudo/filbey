import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About Us - Filbey Fried Chicken & Burgers',
  description:
    'Discover the story of Filbey Chennai. Home to the best crispy fried chicken and handcrafted burgers in the city, made fresh daily with 100% Halal certified ingredients.',
  keywords: [
    'About Filbey',
    'Best Fried Chicken Chennai',
    'Best Burgers Chennai',
    'Halal Restaurant OMR',
    'Filbey Chennai Story',
  ],
  alternates: { canonical: 'https://thefilbey.com/about' },
  openGraph: {
    url: 'https://thefilbey.com/about',
    title: 'About Us - Filbey Fried Chicken & Burgers',
    description:
      'Discover the story of Filbey Chennai. Home to the best crispy fried chicken and handcrafted burgers in the city, made fresh daily with 100% Halal certified ingredients.',
    images: [{ url: '/Document.png' }],
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-margin-desktop bg-background text-on-surface">
        {/* Page Hero Title */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center mb-12 mt-8">
          <span className="text-secondary font-label-lg text-label-lg uppercase tracking-widest font-bold">
            Who We Are
          </span>
          <h1 className="font-display text-display text-primary uppercase mt-2">
            The Story Behind the Crunch
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-3 max-w-2xl mx-auto">
            From day one, our mission has been simple: serve the best-tasting, highest-quality, and most satisfying crispy fried chicken and burgers in Chennai.
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
                  Feelin' Chilli? It's Filbey!
                </p>
                <p className="font-body-md text-sm mt-1 opacity-90">
                  Crafting happiness in every crunchy bite.
                </p>
              </div>
            </div>

            {/* Story Text Content */}
            <div className="lg:col-span-6 flex flex-col gap-6 lg:pl-8">
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-primary uppercase leading-tight">
                Best In The City. <br />
                <span className="text-secondary">Loved By Everyone.</span>
              </h2>

              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                At Filbey, we don't believe in taking shortcuts. Our signature golden-brown, crispy chicken and succulent burgers are the result of premium culinary crafting, fresh high-grade ingredients, and a genuine passion for great food.
              </p>

              <div className="flex flex-col gap-4 border-l-4 border-primary pl-4 py-2 bg-surface-container-low rounded-r-xl">
                <p className="font-body-md text-body-md text-on-surface font-semibold italic">
                  "All customers love our menu because we put care, quality, and flavor first. That is why we are recognized as the top choice for crunchy cravings along OMR, Chennai."
                </p>
              </div>

              <p className="font-body-md text-body-md text-on-surface-variant">
                Whether it is our signature bucket meals, dynamite burgers loaded with flavor, or our refreshing specialty lotus biscoff milkshakes, we ensure every order that leaves our kitchen is served hot, fresh, and exceptionally delicious.
              </p>
            </div>
          </div>
        </section>

        {/* Pillars / Values Section */}
        <section className="bg-surface-container-low py-16 px-margin-mobile md:px-margin-desktop mb-16 rounded-[24px] max-w-container-max mx-auto menu-card-shadow">
          <div className="text-center mb-12">
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-primary uppercase">
              Our Core Promises
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              What sets Filbey apart and keeps our customers coming back day after day.
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
              <h3 className="font-headline-md text-2xl text-on-surface uppercase">100% Halal</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Every piece of chicken and meat we prepare is 100% Halal certified, sourced from trusted suppliers, and handled with extreme care.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-xl p-8 flex flex-col items-center text-center gap-4 menu-card-shadow">
              <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined" style={{ fontSize: 36, fontVariationSettings: "'FILL' 1" }}>
                  skillet
                </span>
              </div>
              <h3 className="font-headline-md text-2xl text-on-surface uppercase">Always Fresh</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                We never freeze our signature chicken. Everything is marinated, hand-breaded, and fried to order to guarantee peak juiciness and crunch.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-xl p-8 flex flex-col items-center text-center gap-4 menu-card-shadow">
              <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" style={{ fontSize: 36, fontVariationSettings: "'FILL' 1" }}>
                  thumb_up
                </span>
              </div>
              <h3 className="font-headline-md text-2xl text-on-surface uppercase">Customer First</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                We design our recipes based on what our customers love. Your satisfaction is our benchmark, serving you only what we are proud of.
              </p>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center py-8">
          <div className="bg-primary rounded-[24px] py-12 px-6 md:py-16 md:px-12 flex flex-col items-center gap-6 shadow-[0_8px_32px_rgba(93,0,12,0.3)]">
            <h2 className="font-display text-4xl md:text-5xl text-white uppercase max-w-2xl leading-tight">
              Ready to Taste the Obsession?
            </h2>
            <p className="font-body-lg text-body-lg text-primary-fixed max-w-lg">
              Explore our dine-in menu filled with crispy chicken, mouth-watering burgers, loaded sides, and creamy shakes.
            </p>
            <Link
              href="/menu"
              className="bg-secondary-container text-on-secondary-container font-label-lg text-label-lg py-4 px-8 rounded-full hover:bg-secondary-fixed hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              Dine-In Menu <span className="material-symbols-outlined">restaurant_menu</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
