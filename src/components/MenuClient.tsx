'use client';

import { useState, useMemo, useEffect, useRef } from 'react';

interface MenuItem {
  name: string;
  desc?: string;
  price?: number; // for single price
  prices?: { label: string; price: number }[]; // for multi-price options
  badge?: 'POPULAR' | 'SPECIAL' | 'HOT' | 'SIGNATURE' | '';
  isVeg?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
}

interface Category {
  id: string;
  title: string;
  icon: string;
  items: MenuItem[];
}

const MENU_DATA: Category[] = [
  {
    id: 'chicken-meals',
    title: 'Chicken Meals',
    icon: 'restaurant',
    items: [
      { name: 'Snack Meal', desc: '2 Pc Chicken + Fries + Drink', price: 269 },
      { name: '8 Pc Chicken', desc: '8 Pc Chicken + 4 Dips + 2 Bun + Fries', price: 799, badge: 'POPULAR', isPopular: true },
      { name: '6 Pc Wings', desc: '6 Wings + 1 Dip + Bun + Fries', price: 279 },
      { name: '4 Pc Chicken', desc: '4 Pc Chicken + 2 Dips + 1 Bun + Fries', price: 449 },
      { name: '5 Pc Strips', desc: '5 boneless + 1 Dip + Bun + Fries', price: 319 },
      { name: 'Mix Combo', desc: '3 Strips + 3 Wings + 1 Dip + Bun + Fries', price: 339 },
    ],
  },
  {
    id: 'signature-chicken',
    title: 'Signature Buckets',
    icon: 'local_fire_department',
    items: [
      {
        name: 'Signature Chicken',
        desc: 'Served with Garlic Mayonnaise',
        prices: [
          { label: '2 Pc', price: 199 },
          { label: '4 Pc', price: 379 },
          { label: '8 Pc', price: 719 },
        ],
      },
      { name: 'Extra Piece', price: 99 },
      {
        name: 'Filbey Party Bucket',
        desc: '10 Strips · 10 Wings · 4 Dips',
        price: 799,
        badge: 'SIGNATURE',
        isPopular: true,
      },
      {
        name: '20 Pc Peri Peri Strips',
        desc: '20 Pc Boneless Strips · 4 Dips',
        price: 899,
        badge: 'SIGNATURE',
        isPopular: true,
        isSpicy: true,
      },
    ],
  },
  {
    id: 'burgers',
    title: 'Burgers',
    icon: 'lunch_dining',
    items: [
      { name: 'Filbey Classic Burger', price: 179, badge: 'POPULAR', isPopular: true },
      { name: 'Dynamite Burger', price: 209, isSpicy: true },
      { name: 'Veg Classic Burger', price: 139, isVeg: true },
      { name: 'Cheese Crunch Burger', price: 199 },
      { name: 'Double Crunch Burger', price: 259, isPopular: true },
      { name: 'Paneer Crunch Burger', price: 179, isVeg: true },
    ],
  },
  {
    id: 'wraps-sandwiches',
    title: 'Wraps & Sandwiches',
    icon: 'layers',
    items: [
      { name: 'Crispy Chicken Wrap', price: 169 },
      { name: 'Dynamite Chicken Wrap', price: 189, isSpicy: true },
      { name: 'Paneer Wrap', price: 159, isVeg: true },
      { name: 'Veg Wrap', price: 129, isVeg: true },
      { name: 'Chicken Club Sandwich', price: 219 },
      { name: 'Veg Club Sandwich', price: 199, isVeg: true },
    ],
  },
  {
    id: 'wings-strips',
    title: 'Wings & Strips',
    icon: 'sports_bar',
    items: [
      {
        name: 'Crispy Wings',
        prices: [
          { label: '6 Pc', price: 189 },
          { label: '10 Pc', price: 299 },
        ],
      },
      {
        name: 'Dynamite Wings',
        isSpicy: true,
        prices: [
          { label: '6 Pc', price: 219 },
          { label: '10 Pc', price: 329 },
        ],
      },
      {
        name: 'Boneless Strips',
        prices: [
          { label: '3 Pc', price: 139 },
          { label: '5 Pc', price: 229 },
          { label: '9 Pc', price: 369 },
        ],
      },
    ],
  },
  {
    id: 'loaded-snacks',
    title: 'Sides & Snacks',
    icon: 'fastfood',
    items: [
      { name: 'Chilli Cheese Fries', desc: 'Fries · Chilli Mix · Cheese Sauce · Jalapeño', price: 169, isSpicy: true },
      { name: 'Chicken Loaded Fries', desc: 'Fries · Chicken Popcorn · Cheese · Drizzle', price: 199, badge: 'POPULAR', isPopular: true },
      { name: 'Veg Nuggets', price: 119, isVeg: true },
      { name: 'Corn Cheese Nuggets', price: 139, isVeg: true },
      { name: 'Chicken Nuggets', price: 139 },
      { name: 'Chicken Popcorn', price: 159 },
      { name: 'Dynamite Popcorn', price: 179, isSpicy: true },
    ],
  },
  {
    id: 'beverages-desserts',
    title: 'Drinks & Treats',
    icon: 'local_cafe',
    items: [
      { name: 'Lotus Biscoff Shake', price: 179, badge: 'SPECIAL', isPopular: true },
      { name: 'Vanilla Shake', price: 129 },
      { name: 'Chocolate Shake', price: 129 },
      { name: 'Strawberry Shake', price: 129 },
      { name: 'Mango Shake', price: 129 },
      { name: 'Tender Coconut Shake', price: 139 },
      { name: 'Oreo Shake', price: 139 },
      { name: 'Cold Milo', price: 159 },
      { name: 'Cold Coffee', price: 129 },
      { name: 'Lemon Iced Tea', price: 119 },
      { name: 'Peach Iced Tea', price: 119 },
      { name: 'Mojitos (Mint/Apple/Berry/Blue)', desc: 'Available in Lemon Mint, Green Apple, Passion Fruit, Watermelon, Cool Blue', price: 119 },
      { name: 'Hot Coffee', price: 30 },
      { name: 'Hot Chocolate', price: 90 },
      { name: 'Fresh Lemonade', price: 49, isVeg: true },
      { name: 'Watermelon Juice', price: 80, isVeg: true },
      { name: 'Mosambi Juice', price: 80, isVeg: true },
      { name: 'Papaya Juice', price: 80, isVeg: true },
      { name: 'Pineapple Juice', price: 80, isVeg: true },
      { name: 'Orange Juice', price: 90, isVeg: true },
      { name: 'Chocolate Brownie', price: 99 },
      { name: 'Brownie + Ice Cream', price: 139 },
      { name: 'Royal Falooda', price: 169, badge: 'SPECIAL', isPopular: true },
    ],
  },
  {
    id: 'addons-extras',
    title: 'Sides & Add-ons',
    icon: 'add_circle',
    items: [
      { name: 'French Fries', price: 109, isVeg: true },
      { name: 'Masala Fries', price: 119, isVeg: true },
      { name: 'Corn in a Cup', price: 59, isVeg: true },
      { name: 'Coleslaw Salad', price: 49, isVeg: true },
      { name: 'Garlic Mayo Dip', price: 25 },
      { name: 'Spicy Mayo Dip', price: 25, isSpicy: true },
      { name: 'Slice Cheese', price: 25, isVeg: true },
      { name: '2 Bread Buns', price: 30, isVeg: true },
    ],
  },
];

export default function MenuClient() {
  const [activeCategory, setActiveCategory] = useState(MENU_DATA[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'VEG' | 'SPICY' | 'POPULAR'>('ALL');
  
  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    const element = categoryRefs.current[id];
    if (element) {
      const offset = 100; // Account for fixed navbar
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
    return MENU_DATA.map((cat) => {
      const items = cat.items.filter((item) => {
        // Search term matching
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (item.desc && item.desc.toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (!matchesSearch) return false;

        // Filter toggles
        if (activeFilter === 'VEG') return item.isVeg;
        if (activeFilter === 'SPICY') return item.isSpicy;
        if (activeFilter === 'POPULAR') return item.isPopular;

        return true;
      });

      return { ...cat, items };
    }).filter((cat) => cat.items.length > 0);
  }, [searchTerm, activeFilter]);

  // On mount, read URL hash and scroll to matching category
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      // Small delay to let sections render first
      const timer = setTimeout(() => {
        scrollToCategory(hash);
      }, 300);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle active scroll highlight
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // offset
      
      for (const cat of MENU_DATA) {
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
  }, []);

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-4">
      {/* Search and Filters Bar */}
      <div className="bg-surface-container/60 backdrop-blur-md sticky top-20 z-40 py-4 px-6 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm border border-surface-variant/20 mb-8">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search our delicious dishes..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-surface-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-body-md"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
          {[
            { id: 'ALL', label: 'Full Menu', icon: 'menu_book' },
            { id: 'VEG', label: 'Vegetarian 🌱', icon: 'local_pizza' },
            { id: 'SPICY', label: 'Spicy 🌶️', icon: 'local_fire_department' },
            { id: 'POPULAR', label: 'Popular ★', icon: 'grade' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-label-lg text-label-lg transition-all cursor-pointer ${
                activeFilter === filter.id
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'bg-white hover:bg-surface-container text-on-surface-variant border border-surface-variant/20'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Navigation Sidebar (Desktop Only) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-[180px] bg-white menu-card-shadow rounded-2xl p-4 border border-surface-variant/10">
          <h3 className="font-headline-md text-xl text-primary uppercase border-b border-surface-variant/20 pb-2 mb-4 px-2">
            Categories
          </h3>
          <nav className="flex flex-col gap-1.5">
            {MENU_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl font-label-lg transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-primary-fixed text-primary font-bold border-l-4 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                <span>{cat.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Categories Scroller (Mobile Only) */}
        <div className="lg:hidden w-full overflow-x-auto no-scrollbar flex gap-2 pb-4 mb-4 sticky top-[160px] z-30 bg-background py-2">
          {MENU_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-label-lg text-sm transition-all shadow-sm ${
                activeCategory === cat.id
                  ? 'bg-primary-fixed text-primary border border-primary font-bold'
                  : 'bg-white text-on-surface-variant border border-surface-variant/20'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{cat.icon}</span>
              {cat.title}
            </button>
          ))}
        </div>

        {/* Menu Items Area */}
        <div className="lg:col-span-9 flex flex-col gap-10">
          {filteredMenu.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center menu-card-shadow border border-surface-variant/10">
              <span className="material-symbols-outlined text-6xl text-primary/30 mb-4">
                sentiment_dissatisfied
              </span>
              <h3 className="font-headline-md text-2xl text-on-surface">No dishes found</h3>
              <p className="font-body-md text-on-surface-variant mt-2">
                Try searching for something else or clearing the active filters!
              </p>
            </div>
          ) : (
            filteredMenu.map((cat) => (
              <section
                key={cat.id}
                ref={(el) => {
                  categoryRefs.current[cat.id] = el;
                }}
                className="bg-white rounded-2xl menu-card-shadow p-6 md:p-8 border border-surface-variant/10 transition-all hover:shadow-md scroll-mt-28"
              >
                <h2 className="font-headline-lg text-2xl md:text-3xl text-primary uppercase border-b-2 border-primary-container pb-2 mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl md:text-3xl text-secondary">
                    {cat.icon}
                  </span>
                  {cat.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cat.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex flex-col justify-between p-4 rounded-xl border border-surface-variant/20 bg-surface-container-lowest/50 hover:bg-surface-container-low transition-all duration-200"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-label-lg text-lg text-on-surface uppercase flex items-center gap-2 group-hover:text-primary transition-colors">
                            {item.name}
                            {item.isVeg && <span className="text-sm">🌱</span>}
                            {item.isSpicy && <span className="text-sm">🌶️</span>}
                          </h3>
                          {item.badge && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full select-none ${
                              item.badge === 'POPULAR' ? 'bg-[#fdae41]/20 text-[#6d4400]' :
                              item.badge === 'SPECIAL' ? 'bg-[#ffb3af]/30 text-[#891b22]' :
                              'bg-primary text-white'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.desc && (
                          <p className="font-body-sm text-sm text-on-surface-variant/80 mt-1 line-clamp-2">
                            {item.desc}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-2 border-t border-surface-variant/10">
                        {item.price ? (
                          <span className="bg-primary-fixed/30 text-primary font-bold py-1 px-3.5 rounded-full text-base">
                            ₹ {item.price}
                          </span>
                        ) : item.prices ? (
                          <div className="flex gap-2">
                            {item.prices.map((p, pIdx) => (
                              <div
                                key={pIdx}
                                className="bg-surface-container border border-surface-variant/20 flex flex-col items-center leading-tight py-1 px-2.5 rounded-lg text-xs"
                              >
                                <span className="text-[10px] text-on-surface-variant/80 font-normal">
                                  {p.label}
                                </span>
                                <span className="font-bold text-primary">₹{p.price}</span>
                              </div>
                            ))}
                          </div>
                        ) : null}
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
