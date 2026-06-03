import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Menu',
  description:
    'Explore the full menu of Filbey Fried Chicken & Burgers. Featuring 100% Halal chicken, dynamite wings, loaded fries, classic burgers, and signature shakes.',
  keywords: [
    'Filbey menu',
    'fried chicken menu',
    'halal food menu Chennai',
    'dynamite wings',
    'burgers menu',
    'restaurant menu',
    'shakes',
  ],
  alternates: { canonical: 'https://thefilbey.com/menu' },
  openGraph: {
    url: 'https://thefilbey.com/menu',
    title: 'Menu - Filbey Fried Chicken & Burgers',
    description:
      'Explore our full menu featuring 100% Halal chicken, dynamite wings, loaded fries, classic burgers, and signature shakes.',
    images: [{ url: '/Document.png' }],
  },
};

const menuJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Filbey Fried Chicken & Burgers',
  image: 'https://thefilbey.com/Document.png',
  '@id': 'https://thefilbey.com/',
  url: 'https://thefilbey.com/',
  telephone: '+91 63834 00144',
  servesCuisine: ['Fast Food', 'Fried Chicken', 'Burgers', 'Halal'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'OMR',
    addressLocality: 'Perungudi',
    addressRegion: 'Chennai',
    addressCountry: 'IN',
  },
  menu: 'https://thefilbey.com/menu',
};

/* ─── Small helpers ─────────────────────────────────────────── */
function SectionCard({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <div id={id} className="bg-white rounded-xl menu-card-shadow p-6">
      {children}
    </div>
  );
}

function CategoryHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-headline-lg text-headline-md text-primary uppercase category-header">
      {children}
    </h2>
  );
}

function MenuRow({ name, desc, price, badge, highlight }: {
  name: React.ReactNode;
  desc?: string;
  price: React.ReactNode;
  badge?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`menu-item-row${highlight ? ' bg-surface-container-low' : ''}`}>
      <div>
        <h3 className="font-label-lg text-lg text-on-surface uppercase flex items-center gap-2">
          {name}
          {badge && (
            <span className="bg-surface-tint text-white text-[10px] px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </h3>
        {desc && <p className="font-body-sm text-sm text-on-surface-variant mt-1">{desc}</p>}
      </div>
      <div>{price}</div>
    </div>
  );
}

function PriceBadge({ children, gold }: { children: React.ReactNode; gold?: boolean }) {
  return (
    <div className={`price-badge${gold ? ' bg-secondary text-white' : ''}`}>{children}</div>
  );
}

function MultiPrice({ options }: { options: { label: string; price: string }[] }) {
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <div key={o.label} className="price-badge flex flex-col items-center leading-tight py-1 px-3">
          <span className="text-xs font-normal">{o.label}</span>
          <span>{o.price}</span>
        </div>
      ))}
    </div>
  );
}

function VegDot() {
  return <span className="w-2 h-2 bg-green-600 rounded-full inline-block" />;
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function MenuPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
      />
      <Navbar isMenuPage />

      <main className="pt-24 pb-margin-desktop">
        {/* Title */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center mb-12 mt-8">
          <h1 className="font-display text-display text-primary uppercase">Our Menu</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl mx-auto">
            A Little Crunch. A Lot of Comfort!{' '}
            <br />
            <span className="text-sm italic">
              * GST extra on all items. Vegetarian options available across menu.
            </span>
          </p>
        </section>

        {/* Two-column grid */}
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-gutter">

          {/* ── Left Column ── */}
          <div className="flex flex-col gap-8">

            {/* Chicken Meals */}
            <SectionCard id="chicken-meals">
              <CategoryHeader>★ Chicken Meals</CategoryHeader>
              <div className="flex flex-col">
                <MenuRow name="Snack Meal" desc="2 Pc Chicken + Fries + Drink" price={<PriceBadge>₹ 269</PriceBadge>} />
                <MenuRow name="8 Pc Chicken" desc="8 Pc Chicken + 4 Dips + 2 Bun + Fries" price={<PriceBadge>₹ 799</PriceBadge>} />
                <MenuRow name="6 Pc Wings" desc="6 Wings + 1 Dip + Bun + Fries" price={<PriceBadge>₹ 279</PriceBadge>} />
                <MenuRow name="4 Pc Chicken" desc="4 Pc Chicken + 2 Dips + 1 Bun + Fries" price={<PriceBadge>₹ 449</PriceBadge>} />
                <MenuRow name="5 Pc Strips" desc="5 boneless + 1 Dip + Bun + Fries" price={<PriceBadge>₹ 319</PriceBadge>} />
                <MenuRow name="Mix Combo" desc="3 Strips + 3 Wings + 1 Dip + Bun + Fries" price={<PriceBadge>₹ 339</PriceBadge>} />
              </div>
            </SectionCard>

            {/* Signature Chicken & Buckets */}
            <SectionCard id="signature-chicken">
              <CategoryHeader>Signature Chicken &amp; Buckets</CategoryHeader>
              <div className="flex flex-col">
                <MenuRow
                  name="Signature Chicken"
                  desc="Served with Garlic Mayonnaise"
                  price={<MultiPrice options={[{ label: '2 Pc', price: '199' }, { label: '4 Pc', price: '379' }, { label: '8 Pc', price: '719' }]} />}
                />
                <MenuRow name="Extra Piece" price={<PriceBadge>₹ 99</PriceBadge>} />
                <MenuRow
                  highlight
                  name={<><span className="material-symbols-outlined text-secondary text-sm">star</span> Filbey Party Bucket</>}
                  desc="10 Strips · 10 Wings · 4 Dips"
                  price={<PriceBadge gold>₹ 799</PriceBadge>}
                />
                <MenuRow
                  highlight
                  name={<><span className="material-symbols-outlined text-secondary text-sm">star</span> 20 Pc Peri Peri Strips</>}
                  desc="20 Pc Boneless Strips · 4 Dips"
                  price={<PriceBadge gold>₹ 899</PriceBadge>}
                />
              </div>
            </SectionCard>

            {/* Burgers */}
            <SectionCard id="burgers">
              <CategoryHeader>Burgers</CategoryHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <MenuRow name="Filbey Classic" price={<PriceBadge>₹ 179</PriceBadge>} badge="POPULAR" />
                <MenuRow name="Dynamite Burger" price={<PriceBadge>₹ 209</PriceBadge>} />
                <MenuRow name={<><VegDot /> Veg Classic</>} price={<PriceBadge>₹ 139</PriceBadge>} />
                <MenuRow name="Cheese Crunch" price={<PriceBadge>₹ 199</PriceBadge>} />
                <MenuRow name="Double Crunch" price={<PriceBadge>₹ 259</PriceBadge>} />
                <MenuRow name={<><VegDot /> Paneer Crunch</>} price={<PriceBadge>₹ 179</PriceBadge>} />
              </div>
            </SectionCard>

            {/* Wraps & Sandwiches */}
            <SectionCard id="wraps">
              <CategoryHeader>Wraps &amp; Sandwiches</CategoryHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <MenuRow name="Crispy Chicken Wrap" price={<PriceBadge>₹ 169</PriceBadge>} />
                <MenuRow name={<>Dynamite Chicken Wrap <span className="text-red-500 text-sm">🌶️</span></>} price={<PriceBadge>₹ 189</PriceBadge>} />
                <MenuRow name={<><VegDot /> Paneer Wrap</>} price={<PriceBadge>₹ 159</PriceBadge>} />
                <MenuRow name={<><VegDot /> Veg Wrap</>} price={<PriceBadge>₹ 129</PriceBadge>} />
                <MenuRow name="Chicken Club Sandwich" price={<PriceBadge>₹ 219</PriceBadge>} />
                <MenuRow name={<><VegDot /> Veg Club Sandwich</>} price={<PriceBadge>₹ 199</PriceBadge>} />
              </div>
            </SectionCard>
          </div>

          {/* ── Right Column ── */}
          <div className="flex flex-col gap-8">

            {/* Wings & Strips */}
            <SectionCard id="wings">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <CategoryHeader>Hot Wings</CategoryHeader>
                  <div className="menu-item-row pb-2">
                    <h3 className="font-label-lg text-base text-on-surface uppercase">Crispy Wings</h3>
                    <MultiPrice options={[{ label: '6 Pc', price: '189' }, { label: '10 Pc', price: '299' }]} />
                  </div>
                  <div className="menu-item-row pt-2">
                    <h3 className="font-label-lg text-base text-on-surface uppercase flex items-center gap-1">
                      Dynamite Wings <span className="text-red-500 text-sm">🌶️</span>
                    </h3>
                    <MultiPrice options={[{ label: '6 Pc', price: '219' }, { label: '10 Pc', price: '329' }]} />
                  </div>
                </div>
                <div>
                  <CategoryHeader>Boneless Strips</CategoryHeader>
                  <div className="menu-item-row flex-col gap-2">
                    <h3 className="font-label-lg text-base text-on-surface uppercase">Boneless Strips</h3>
                    <div className="flex gap-2 w-full justify-between">
                      {[{ label: '3 Pc', price: '139' }, { label: '5 Pc', price: '229' }, { label: '9 Pc', price: '369' }].map((o) => (
                        <div key={o.label} className="price-badge flex flex-col items-center leading-tight py-1 px-3 w-full">
                          <span className="text-[10px] font-normal">{o.label}</span>
                          <span>{o.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Loaded Fries, Popcorn & Nuggets */}
            <SectionCard id="snacks">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <CategoryHeader>Loaded Fries</CategoryHeader>
                  <div className="menu-item-row flex-col gap-2 items-start">
                    <div className="w-full flex justify-between">
                      <h3 className="font-label-lg text-base text-on-surface uppercase">Chilli Cheese Fries</h3>
                      <PriceBadge>₹ 169</PriceBadge>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant">Fries · Chilli Mix · Cheese Sauce · Jalapeño</p>
                  </div>
                  <div className="menu-item-row flex-col gap-2 items-start">
                    <div className="w-full flex justify-between">
                      <h3 className="font-label-lg text-base text-on-surface uppercase flex items-center gap-2">
                        Chicken Loaded
                        <span className="bg-surface-tint text-white text-[10px] px-2 py-0.5 rounded-full">POPULAR</span>
                      </h3>
                      <PriceBadge>₹ 199</PriceBadge>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant">Fries · Chicken Popcorn · Cheese · Drizzle</p>
                  </div>
                </div>
                <div>
                  <CategoryHeader>Popcorn &amp; Nuggets</CategoryHeader>
                  <div className="flex flex-col text-sm">
                    {[
                      { name: 'Veg Nuggets', price: '119' },
                      { name: 'Corn Cheese Nuggets', price: '139' },
                      { name: 'Chicken Nuggets', price: '139' },
                      { name: 'Chicken Popcorn', price: '159' },
                      { name: 'Dynamite Popcorn 🌶️', price: '179' },
                    ].map((item, i, arr) => (
                      <div key={item.name} className={`flex justify-between py-2${i < arr.length - 1 ? ' border-b border-surface-variant' : ''}`}>
                        <span className="font-medium">{item.name}</span>
                        <span className="font-bold text-primary">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Beverages & Treats */}
            <SectionCard id="beverages">
              <CategoryHeader>Café &amp; Drinks</CategoryHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Milkshakes */}
                <div>
                  <h3 className="font-label-lg text-secondary uppercase mb-2">Milkshakes</h3>
                  <div className="flex flex-col text-sm gap-1">
                    {[
                      { name: 'Vanilla', price: '129' },
                      { name: 'Chocolate', price: '129' },
                      { name: 'Strawberry', price: '129' },
                      { name: 'Mango', price: '129' },
                      { name: 'Tender Coconut', price: '139' },
                      { name: 'Oreo Shake', price: '139' },
                      { name: 'Cold Milo', price: '159' },
                      { name: 'Cold Coffee', price: '129' },
                    ].map((item) => (
                      <div key={item.name} className="flex justify-between py-1 border-b border-surface-variant/50">
                        <span>{item.name}</span>
                        <span className="font-bold">{item.price}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-1 mt-1 bg-secondary-fixed/30 px-2 rounded">
                      <span className="font-bold text-secondary">
                        Lotus Biscoff{' '}
                        <span className="text-[10px] bg-secondary text-white px-1 ml-1 rounded">SPECIAL</span>
                      </span>
                      <span className="font-bold text-secondary">179</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Mojitos & Iced Tea */}
                  <div>
                    <h3 className="font-label-lg text-secondary uppercase mb-2">Mojitos &amp; Iced Tea</h3>
                    <p className="text-xs text-on-surface-variant mb-2">
                      All Mojitos — <span className="font-bold text-primary text-sm">119</span>
                      <br />(Lemon Mint, Green Apple, Passion Fruit, Watermelon, Cool Blue)
                    </p>
                    <div className="flex flex-col text-sm gap-1">
                      <div className="flex justify-between py-1 border-b border-surface-variant/50"><span>Lemon Iced Tea</span><span className="font-bold">119</span></div>
                      <div className="flex justify-between py-1"><span>Peach Iced Tea</span><span className="font-bold">119</span></div>
                    </div>
                  </div>

                  {/* Hot Beverages */}
                  <div>
                    <h3 className="font-label-lg text-secondary uppercase mb-2">Hot Beverages</h3>
                    <div className="flex flex-col text-sm gap-1">
                      <div className="flex justify-between py-1 border-b border-surface-variant/50"><span>Hot Coffee</span><span className="font-bold">30</span></div>
                      <div className="flex justify-between py-1"><span>Hot Chocolate</span><span className="font-bold">90</span></div>
                    </div>
                  </div>
                </div>

                {/* Fresh Juices */}
                <div>
                  <h3 className="font-label-lg text-secondary uppercase mb-2">Fresh Juices</h3>
                  <div className="flex flex-col text-sm gap-1">
                    {[
                      { name: 'Fresh Lemonade', price: '49' },
                      { name: 'Watermelon', price: '80' },
                      { name: 'Mosambi', price: '80' },
                      { name: 'Papaya', price: '80' },
                      { name: 'Pineapple', price: '80' },
                      { name: 'Orange Juice', price: '90' },
                    ].map((item, i, arr) => (
                      <div key={item.name} className={`flex justify-between py-1${i < arr.length - 1 ? ' border-b border-surface-variant/50' : ''}`}>
                        <span>{item.name}</span>
                        <span className="font-bold">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desserts */}
                <div>
                  <h3 className="font-label-lg text-secondary uppercase mb-2">Desserts &amp; Treats</h3>
                  <div className="flex flex-col text-sm gap-1">
                    <div className="flex justify-between py-1 border-b border-surface-variant/50"><span>Chocolate Brownie</span><span className="font-bold">99</span></div>
                    <div className="flex justify-between py-1 border-b border-surface-variant/50"><span>Brownie + Ice Cream</span><span className="font-bold">139</span></div>
                    <div className="flex justify-between py-1"><span>Royal Falooda ★</span><span className="font-bold">169</span></div>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Sides & Add-ons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
              <SectionCard>
                <CategoryHeader>Sides</CategoryHeader>
                <div className="flex flex-col text-sm">
                  {[
                    { name: 'French Fries', price: '109' },
                    { name: 'Masala Fries', price: '119' },
                    { name: 'Corn in a Cup', price: '59' },
                    { name: 'Coleslaw Salad', price: '49' },
                  ].map((item, i, arr) => (
                    <div key={item.name} className={`flex justify-between py-2${i < arr.length - 1 ? ' border-b border-surface-variant' : ''}`}>
                      <span className="font-medium">{item.name}</span>
                      <span className="font-bold text-primary">{item.price}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard>
                <CategoryHeader>Add-Ons</CategoryHeader>
                <div className="flex flex-col text-sm">
                  {[
                    { name: 'Garlic Mayo', price: '25' },
                    { name: 'Spicy Mayo', price: '25' },
                    { name: 'Slice Cheese', price: '25' },
                    { name: '2 Bread Buns', price: '30' },
                  ].map((item, i, arr) => (
                    <div key={item.name} className={`flex justify-between py-2${i < arr.length - 1 ? ' border-b border-surface-variant' : ''}`}>
                      <span className="font-medium">{item.name}</span>
                      <span className="font-bold text-primary">{item.price}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
