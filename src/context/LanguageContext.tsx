'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ta';

export interface MenuItem {
  name: string;
  desc?: string;
  price?: number;
  prices?: { label: string; price: number }[];
  badge?: 'POPULAR' | 'SPECIAL' | 'HOT' | 'SIGNATURE' | '';
  isVeg?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  items: MenuItem[];
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateMenu: (originalMenu: Category[]) => Category[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Category Title Translation Map
const CATEGORY_MAP: Record<string, string> = {
  'Chicken Meals': 'சிக்கன் மீல்ஸ்',
  'Signature Buckets': 'சிக்னேச்சர் பக்கெட்டுகள்',
  'Burgers': 'பர்கர்ஸ்',
  'Wraps & Sandwiches': 'ரேப்ஸ் & சாண்ட்விச்சுகள்',
  'Wings & Strips': 'விங்ஸ் & ஸ்ட்ரிப்ஸ்',
  'Sides & Snacks': 'சைட்ஸ் & ஸ்நாக்ஸ்',
  'Drinks & Treats': 'டிரிங்க்ஸ் & ட்ரீட்ஸ்',
  'Sides & Add-ons': 'சைட்ஸ் & ஆட்-ஆன்கள்',
};

// Item Name Translation Map
const ITEM_NAME_MAP: Record<string, string> = {
  'Snack Meal': 'ஸ்நாக் மீல்',
  '8 Pc Chicken': '8 துண்டு சிக்கன்',
  '6 Pc Wings': '6 துண்டு விங்ஸ்',
  '4 Pc Chicken': '4 துண்டு சிக்கன்',
  '5 Pc Strips': '5 துண்டு ஸ்டிரிப்ஸ்',
  'Mix Combo': 'மிக்ஸ் காம்போ',
  'Signature Chicken': 'சிக்னேச்சர் சிக்கன்',
  'Extra Piece': 'கூடுதல் சிக்கன் துண்டு',
  'Filbey Party Bucket': 'ஃபில்பே பார்ட்டி பக்கெட்',
  '20 Pc Peri Peri Strips': '20 துண்டு பெரி பெரி ஸ்டிரிப்ஸ்',
  'Filbey Classic Burger': 'ஃபில்பே கிளாசிக் பர்கர்',
  'Dynamite Burger': 'டைனமைட் பர்கர்',
  'Veg Classic Burger': 'வெஜ் கிளாசிக் பர்கர்',
  'Cheese Crunch Burger': 'சீஸ் கிரஞ்ச் பர்கர்',
  'Double Crunch Burger': 'டபுள் கிரஞ்ச் பர்கர்',
  'Paneer Crunch Burger': 'பனீர் கிரஞ்ச் பர்கர்',
  'Crispy Chicken Wrap': 'கிரிஸ்பி சிக்கன் ரேப்',
  'Dynamite Chicken Wrap': 'டைனமைட் சிக்கன் ரேப்',
  'Paneer Wrap': 'பனீர் ரேப்',
  'Veg Wrap': 'வெஜ் ரேப்',
  'Chicken Club Sandwich': 'சிக்கன் கிளப் சாண்ட்விச்',
  'Veg Club Sandwich': 'வெஜ் கிளப் சாண்ட்விச்',
  'Crispy Wings': 'கிரிஸ்பி விங்ஸ்',
  'Dynamite Wings': 'டைனமைட் விங்ஸ்',
  'Boneless Strips': 'எலும்பில்லாத ஸ்டிரிப்ஸ்',
  'Chilli Cheese Fries': 'சில்லி சீஸ் பிரைஸ்',
  'Chicken Loaded Fries': 'சிக்கன் லோடட் பிரைஸ்',
  'Veg Nuggets': 'வெஜ் நக்கெட்ஸ்',
  'Corn Cheese Nuggets': 'கார்ன் சீஸ் நக்கெட்ஸ்',
  'Chicken Nuggets': 'சிக்கன் நக்கெட்ஸ்',
  'Chicken Popcorn': 'சிக்கன் பாப்கார்ன்',
  'Dynamite Popcorn': 'டைனமைட் பாப்கார்ன்',
  'Lotus Biscoff Shake': 'லோட்டஸ் பிஸ்காஃப் ஷேக்',
  'Vanilla Shake': 'வெண்ணிலா ஷேக்',
  'Chocolate Shake': 'சாக்லேட் ஷேக்',
  'Strawberry Shake': 'ஸ்ட்ராபெரி ஷேக்',
  'Mango Shake': 'மாம்பழ ஷேக்',
  'Tender Coconut Shake': 'இளநீர் ஷேக்',
  'Oreo Shake': 'ஓரியோ ஷேக்',
  'Cold Milo': 'கோல்ட் மைலோ',
  'Cold Coffee': 'கோல்ட் காபி',
  'Lemon Iced Tea': 'லெமன் ஐஸ் டீ',
  'Peach Iced Tea': 'பீச் ஐஸ் டீ',
  'Mojitos (Mint/Apple/Berry/Blue)': 'மொஜிடோஸ் (புதினா/ஆப்பிள்/பெர்ரி/ப்ளூ)',
  'Hot Coffee': 'சூடான காபி',
  'Hot Chocolate': 'ஹாட் சாக்லேட்',
  'Fresh Lemonade': 'பிரஷ் லெமனேட்',
  'Watermelon Juice': 'தர்பூசணி ஜூஸ்',
  'Mosambi Juice': 'சாத்துக்குடி ஜூஸ்',
  'Papaya Juice': 'பப்பாளி ஜூஸ்',
  'Pineapple Juice': 'அன்னாசி ஜூஸ்',
  'Orange Juice': 'ஆரஞ்சு ஜூஸ்',
  'Chocolate Brownie': 'சாக்லேட் பிரவுனி',
  'Brownie + Ice Cream': 'பிரவுனி + ஐஸ்கிரீம்',
  'Royal Falooda': 'ராயல் பலூடா',
  'French Fries': 'பிரெஞ்ச் பிரைஸ்',
  'Masala Fries': 'மசாலா பிரைஸ்',
  'Corn in a Cup': 'கார்ன் இன் எ கப்',
  'Coleslaw Salad': 'கோல்ஸ்லா சாலட்',
  'Garlic Mayo Dip': 'கார்லிக் மயோ டிப்',
  'Spicy Mayo Dip': 'ஸ்பைசி மயோ டிப்',
  'Slice Cheese': 'சீஸ் ஸ்லைஸ்',
  '2 Bread Buns': '2 பிரெட் பன்கள்',
};

// Item Description Translation Map
const ITEM_DESC_MAP: Record<string, string> = {
  '2 Pc Chicken + Fries + Drink': '2 துண்டு சிக்கன் + பிரைஸ் + டிரிங்க்',
  '8 Pc Chicken + 4 Dips + 2 Bun + Fries': '8 துண்டு சிக்கன் + 4 டிப்ஸ் + 2 பன் + பிரைஸ்',
  '6 Wings + 1 Dip + Bun + Fries': '6 விங்ஸ் + 1 டிப் + பன் + பிரைஸ்',
  '4 Pc Chicken + 2 Dips + 1 Bun + Fries': '4 துண்டு சிக்கன் + 2 டிப்ஸ் + 1 பன் + பிரைஸ்',
  '5 boneless + 1 Dip + Bun + Fries': '5 எலும்பில்லாத துண்டுகள் + 1 டிப் + பன் + பிரைஸ்',
  '3 Strips + 3 Wings + 1 Dip + Bun + Fries': '3 ஸ்டிரிப்ஸ் + 3 விங்ஸ் + 1 டிப் + பன் + பிரைஸ்',
  'Mix Combo': '3 ஸ்டிரிப்ஸ் + 3 விங்ஸ் + 1 டிப் + பன் + பிரைஸ்',
  'Served with Garlic Mayonnaise': 'பூண்டு மயோனைஸ் உடன் பரிமாறப்படும்',
  '10 Strips · 10 Wings · 4 Dips': '10 ஸ்டிரிப்ஸ் · 10 விங்ஸ் · 4 டிப்ஸ்',
  '20 Pc Boneless Strips · 4 Dips': '20 எலும்பில்லாத ஸ்டிரிப்ஸ் · 4 டிப்ஸ்',
  'Fries · Chilli Mix · Cheese Sauce · Jalapeño': 'பிரைஸ் · சில்லி மிக்ஸ் · சீஸ் சாஸ் · ஜலபென்யோ',
  'Fries · Chicken Popcorn · Cheese · Drizzle': 'பிரைஸ் · சிக்கன் பாப்கார்ன் · சீஸ் · டிரைசில்',
  'Available in Lemon Mint, Green Apple, Passion Fruit, Watermelon, Cool Blue': 'லெமன் மின்ட், கிரீன் ஆப்பிள், பேசன் புரூட், தர்பூசணி, கூல் ப்ளூ ஆகியவற்றில் கிடைக்கும்',
};

// Price Label Translation Map
const PRICE_LABEL_MAP: Record<string, string> = {
  '2 Pc': '2 துண்டு',
  '4 Pc': '4 துண்டு',
  '8 Pc': '8 துண்டு',
  '6 Pc': '6 துண்டு',
  '10 Pc': '10 துண்டு',
  '3 Pc': '3 துண்டு',
  '5 Pc': '5 துண்டு',
  '9 Pc': '9 துண்டு',
};

// General UI Translations Dict
const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.aboutUs': 'About Us',
    'nav.chickenMeals': 'Chicken Meals',
    'nav.burgers': 'Burgers',
    'nav.wingsStrips': 'Wings & Strips',
    'nav.wrapsSides': 'Wraps & Sides',
    'nav.cafeDrinks': 'Café & Drinks',
    'nav.orderNow': 'Order Now',
    'nav.backToHome': 'Back to Home',
    'nav.dineInMenu': 'Dine-In Menu',
    
    // Home Page
    'home.heroTitle1': 'A Little Crunch.',
    'home.heroTitle2': 'A Lot of Comfort!',
    'home.findUs': 'Find Us',
    'home.storyTag': 'Our Story',
    'home.storyTitle1': "Crafting Chennai's Finest",
    'home.storyTitle2': 'Fried Chicken & Burgers',
    'home.storyDesc1': 'At Filbey, we believe in one simple rule: absolute quality. Recognized as the home of the best crispy fried chicken and handcrafted burgers in the city, we prep everything fresh daily. From our secret seasoning blend to the perfectly toasted buns, every bite is crafted to make you fall in love.',
    'home.storyDesc2': "It's not just food—it's a flavor obsession. Chennai's foodies have spoken, and our menu is officially their favorite spot for hot, crunchy, and savory cravings.",
    'home.storyBtn': 'Read Our Story',
    'home.halalTitle': 'Halal Certified',
    'home.halalDesc': '100% preparation',
    'home.loveTitle': 'Made With Love',
    'home.loveDesc': 'Freshly prepared daily',
    'home.freshTitle': 'Fresh & Hot',
    'home.freshDesc': 'Served in 10-15 mins',
    'home.exploreMenu': 'Explore Our Dine-In Menu',
    'home.exploreMenuSub': '* GST extra on all items. Dine-in pricing only.',
    'home.popular': 'Popular',
    'home.signature': 'Signature',
    'home.signatureChicken': 'Signature Chicken',
    'home.classicBurgers': 'Classic Burgers',
    'home.classicBurgersDesc': 'Dynamite, Veg & More',
    'home.signatureShakes': 'Signature Shakes',
    'home.signatureShakesDesc': 'Featuring Lotus Biscoff',
    'home.wrapsSidesTitle': 'Wraps & Sides',
    'home.wrapsSidesDesc': 'Loaded Fries, Chilli Cheese',
    'home.faqTitle': 'Frequently Asked Questions',
    'home.faqQ1': 'Where is Filbey located?',
    'home.faqA1': 'We are located in Perungudi, OMR — Chennai. You can use the map link in our footer to get exact directions.',
    'home.faqQ2': 'Is the meat Halal certified?',
    'home.faqA2': 'Yes, our chicken and all meat preparations are 100% Halal certified.',
    'home.faqQ3': 'What are your opening hours?',
    'home.faqA3': 'We are open every day from Monday to Sunday, 11:30 AM to 11:30 PM.',
    'home.faqQ4': 'Do you offer vegetarian options?',
    'home.faqA4': 'Absolutely! We have dedicated vegetarian options across our menu including Veg Burgers, Paneer Wraps, and Veg Nuggets.',

    // About Page
    'about.heroTag': 'Who We Are',
    'about.heroTitle': 'The Story Behind the Crunch',
    'about.heroDesc': 'From day one, our mission has been simple: serve the best-tasting, highest-quality, and most satisfying crispy fried chicken and burgers in Chennai.',
    'about.sideQuoteTag': "Feelin' Chilli? It's Filbey!",
    'about.sideQuoteDesc': 'Crafting happiness in every crunchy bite.',
    'about.storyTitle': 'Best In The City. Loved By Everyone.',
    'about.storyDesc1': "At Filbey, we don't believe in taking shortcuts. Our signature golden-brown, crispy chicken and succulent burgers are the result of premium culinary crafting, fresh high-grade ingredients, and a genuine passion for great food.",
    'about.quoteMain': '"All customers love our menu because we put care, quality, and flavor first. That is why we are recognized as the top choice for crunchy cravings along OMR, Chennai."',
    'about.storyDesc2': 'Whether it is our signature bucket meals, dynamite burgers loaded with flavor, or our refreshing specialty lotus biscoff milkshakes, we ensure every order that leaves our kitchen is served hot, fresh, and exceptionally delicious.',
    'about.promisesTitle': 'Our Core Promises',
    'about.promisesSub': 'What sets Filbey apart and keeps our customers coming back day after day.',
    'about.promise1Title': '100% Halal',
    'about.promise1Desc': 'Every piece of chicken and meat we prepare is 100% Halal certified, sourced from trusted suppliers, and handled with extreme care.',
    'about.promise2Title': 'Always Fresh',
    'about.promise2Desc': 'We never freeze our signature chicken. Everything is marinated, hand-breaded, and fried to order to guarantee peak juiciness and crunch.',
    'about.promise3Title': 'Customer First',
    'about.promise3Desc': 'We design our recipes based on what our customers love. Your satisfaction is our benchmark, serving you only what we are proud of.',
    'about.ctaTitle': 'Ready to Taste the Obsession?',
    'about.ctaDesc': 'Explore our dine-in menu filled with crispy chicken, mouth-watering burgers, loaded sides, and creamy shakes.',

    // Menu Page
    'menu.heroTitle': 'Our Dine-In Menu',
    'menu.heroDesc': 'A Little Crunch. A Lot of Comfort!',
    'menu.heroSub': '* GST extra on all items. Dine-in pricing only. Vegetarian options available across menu.',
    'menu.searchPlaceholder': 'Search our delicious dishes...',
    'menu.filterAll': 'Full Menu',
    'menu.filterVeg': 'Vegetarian 🌱',
    'menu.filterSpicy': 'Spicy 🌶️',
    'menu.filterPopular': 'Popular ★',
    'menu.categories': 'Categories',
    'menu.noDishesTitle': 'No dishes found',
    'menu.noDishesDesc': 'Try searching for something else or clearing the active filters!',
    'badge.special': 'Special',
    'badge.signature': 'Signature',
    'badge.hot': 'Hot',

    // Footer
    'footer.tagline': '“Feelin’ Chilli? It’s Filbey!”',
    'footer.openingHours': 'Opening Hours',
    'footer.monSun': 'Mon - Sun: 11:30 AM - 11:30 PM',
    'footer.copyright': '© 2026 Filbey Fried Chicken & Burgers Chennai. All Rights Reserved.',
    'footer.madeWith': 'Made with love by',
    'footer.location': 'Perungudi, OMR — Chennai',
  },
  ta: {
    // Navbar
    'nav.aboutUs': 'எங்களைப் பற்றி',
    'nav.chickenMeals': 'சிக்கன் மீல்ஸ்',
    'nav.burgers': 'பர்கர்ஸ்',
    'nav.wingsStrips': 'விங்ஸ் & ஸ்ட்ரிப்ஸ்',
    'nav.wrapsSides': 'ரேப்ஸ் & சைட்ஸ்',
    'nav.cafeDrinks': 'கஃபே & ட்ரிங்க்ஸ்',
    'nav.orderNow': 'ஆர்டர் செய்க',
    'nav.backToHome': 'முகப்பு பக்கம்',
    'nav.dineInMenu': 'டைன்-இன் மெனு',

    // Home Page
    'home.heroTitle1': 'கொஞ்சம் மொறுமொறுப்பு.',
    'home.heroTitle2': 'நிறைய திருப்தி!',
    'home.findUs': 'எங்களை கண்டறியவும்',
    'home.storyTag': 'எங்கள் கதை',
    'home.storyTitle1': 'சென்னையின் மிகச்சிறந்த',
    'home.storyTitle2': 'ஃபிரைடு சிக்கன் & பர்கர்ஸ்',
    'home.storyDesc1': 'ஃபில்பேயில், நாங்கள் ஒரு எளிய விதியை நம்புகிறோம்: அசல் தரம். சென்னையின் மிகச்சிறந்த மொறுமொறுப்பான ஃபிரைடு சிக்கன் மற்றும் கைவினை பர்கர்களின் இல்லமாக அங்கீகரிக்கப்பட்டு, நாங்கள் தினமும் எல்லாவற்றையும் புதியதாக தயாரிக்கிறோம். எங்களது ரகசிய மசாலா கலவை முதல் கச்சிதமாக டோஸ்ட் செய்யப்பட்ட பன்கள் வரை, ஒவ்வொரு கடி உங்களையும் காதலிக்க வைக்கும் வகையில் வடிவமைக்கப்பட்டுள்ளது.',
    'home.storyDesc2': 'இது வெறும் உணவு அல்ல - இது சுவையின் மீதான காதல். சென்னையின் உணவு பிரியர்கள் இதை தங்களின் விருப்பமான இடமாக தேர்வு செய்துள்ளனர்.',
    'home.storyBtn': 'எங்கள் கதையை படிக்கவும்',
    'home.halalTitle': '100% ஹலால்',
    'home.halalDesc': 'ஹலால் தயாரிப்பு',
    'home.loveTitle': 'அன்புடன் தயாரிக்கப்பட்டது',
    'home.loveDesc': 'தினமும் புதியதாக',
    'home.freshTitle': 'சுடச்சுட மற்றும் புதியது',
    'home.freshDesc': '10-15 நிமிடங்களில் பரிமாறப்படும்',
    'home.exploreMenu': 'எங்கள் டைன்-இன் மெனுவை ஆராயுங்கள்',
    'home.exploreMenuSub': '* அனைத்து உணவுகளுக்கும் ஜிஎஸ்டி தனி. டைன்-இன் விலைகள் மட்டுமே.',
    'home.popular': 'பிரபலம்',
    'home.signature': 'சிக்னேச்சர்',
    'home.signatureChicken': 'சிக்னேச்சர் சிக்கன்',
    'home.classicBurgers': 'கிளாசிக் பர்கர்ஸ்',
    'home.classicBurgersDesc': 'டைனமைட், வெஜ் & மற்றவை',
    'home.signatureShakes': 'சிக்னேச்சர் ஷேக்ஸ்',
    'home.signatureShakesDesc': 'லோட்டஸ் பிஸ்காஃப் உடன்',
    'home.wrapsSidesTitle': 'ரேப்ஸ் & சைட்ஸ்',
    'home.wrapsSidesDesc': 'லோடட் பிரைஸ், சில்லி சீஸ்',
    'home.faqTitle': 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    'home.faqQ1': 'ஃபில்பே எங்கு அமைந்துள்ளது?',
    'home.faqA1': 'நாங்கள் சென்னை ஓஎம்ஆர், பெருங்குடியில் அமைந்துளோம். சரியான திசையறிய கீழே உள்ள வரைபட இணைப்பைப் பயன்படுத்தலாம்.',
    'home.faqQ2': 'இறைச்சி ஹலால் சான்றளிக்கப்பட்டதா?',
    'home.faqA2': 'ஆம், எங்களது சிக்கன் மற்றும் அனைத்து இறைச்சி தயாரிப்புகளும் 100% ஹலால் சான்றளிக்கப்பட்டவை.',
    'home.faqQ3': 'உங்கள் உணவகம் திறந்திருக்கும் நேரங்கள் என்ன?',
    'home.faqA3': 'நாங்கள் திங்கள் முதல் ஞாயிறு வரை அனைத்து நாட்களும் காலை 11:30 மணி முதல் இரவு 11:30 மணி வரை திறந்துள்ளோம்.',
    'home.faqQ4': 'சைவம் சாப்பிடுபவர்களுக்கான உணவுகள் உள்ளனவா?',
    'home.faqA4': 'ஆம், நிச்சயமாக! எங்களது மெனுவில் வெஜ் பர்கர்கள், பனீர் ரேப்ஸ் மற்றும் வெஜ் நக்கெட்ஸ் உள்ளிட்ட சைவ உணவுகள் உள்ளன.',

    // About Page
    'about.heroTag': 'நாங்கள் யார்',
    'about.heroTitle': 'மொறுமொறுப்பின் பின்னணியில் உள்ள கதை',
    'about.heroDesc': 'முதல் நாளில் இருந்தே, எங்களது நோக்கம் எளிமையானது: சென்னையின் மிகச்சிறந்த சுவையான, உயர்தரமான மற்றும் திருப்திகரமான மொறுமொறுப்பான ஃபிரைடு சிக்கன் மற்றும் பர்கர்களை வழங்குவது.',
    'about.sideQuoteTag': 'சில்லி சுவை வேண்டுமா? அது ஃபில்பே தான்!',
    'about.sideQuoteDesc': 'ஒவ்வொரு மொறுமொறுப்பான கடியிலும் மகிழ்ச்சியை உருவாக்குதல்.',
    'about.storyTitle': 'நகரத்தின் சிறந்த சுவை. அனைவராலும் விரும்பப்படுவது.',
    'about.storyDesc1': 'ஃபில்பேயில், நாங்கள் குறுக்கு வழிகளை நம்புவதில்லை. எங்களது சிக்னேச்சர் பொன்னிற, மொறுமொறுப்பான சிக்கன் மற்றும் சுவையான பர்கர்கள் ஆகியவை எங்களது தரமான சமையல் கலை, புதிய உயர்தர பொருட்கள் மற்றும் நல்ல உணவின் மீதான உண்மையான ஆர்வத்தின் விளைவாகும்.',
    'about.quoteMain': '"எங்களது வாடிக்கையாளர்கள் அனைவரும் எங்கள் மெனுவை விரும்புகிறார்கள், ஏனெனில் நாங்கள் அக்கறை, தரம் மற்றும் சுவைக்கு முதلیடம் கொடுக்கிறோம். இதனால்தான் சென்னை ஓஎம்ஆர் வழியில் மொறுமொறுப்பான உணவுகளுக்கான முதன்மைத் தேர்வாக நாங்கள் அங்கீகரிக்கப்பட்டுள்ளோம்."',
    'about.storyDesc2': 'எங்களது சிக்னேச்சர் பக்கெட் உணவுகள், சுவை நிறைந்த டைனமைட் பர்கர்கள் அல்லது எங்களது புத்துணர்ச்சியூட்டும் லோட்டஸ் பிஸ்காஃப் மில்க்‌ஷேக்குகள் என எதுவாக இருந்தாலும், எங்கள் சமையலறையிலிருந்து வெளிவரும் ஒவ்வொரு ஆர்டரும் சுடச்சுட, புதியதாக மற்றும் விதிவிலக்கான சுவையுடன் வழங்கப்படுவதை உறுதிசெய்கிறோம்.',
    'about.promisesTitle': 'எங்களது முக்கிய வாக்குறுதிகள்',
    'about.promisesSub': 'ஃபில்பேயை தனித்துவமாக்குவது மற்றும் எங்கள் வாடிக்கையாளர்களை மீண்டும் மீண்டும் வரவழைப்பது எது.',
    'about.promise1Title': '100% ஹலால்',
    'about.promise1Desc': 'நாங்கள் தயாரிக்கும் ஒவ்வொரு சிக்கன் மற்றும் இறைச்சி துண்டும் 100% ஹலால் சான்றளிக்கப்பட்டது, நம்பகமான சப்ளையர்களிடமிருந்து பெறப்பட்டு, மிகுந்த கவனத்துடன் கையாளப்படுகிறது.',
    'about.promise2Title': 'எப்போதும் புதியது',
    'about.promise2Desc': 'நாங்கள் எங்கள் சிக்கனை ஒருபோதும் உறைய வைப்பதில்லை (freeze). எல்லாமே மசாலா தடவப்பட்டு, கையால் பிரெட் செய்யப்பட்டு, நீங்கள் ஆர்டர் செய்தவுடன் வறுத்தெடுக்கப்படுகிறது.',
    'about.promise3Title': 'வாடிக்கையாளரே முதன்மை',
    'about.promise3Desc': 'எங்களது வாடிக்கையாளர்கள் விரும்புவதை அடிப்படையாகக் கொண்டு எங்கள் சமையல் குறிப்புகளை வடிவமைக்கிறோம். உங்கள் திருப்தியே எங்களது தரம், நாங்கள் பெருமைப்படும் உணவை மட்டுமே உங்களுக்கு வழங்குகிறோம்.',
    'about.ctaTitle': 'எங்களது அலாதியான சுவையை சுவைக்க தயாரா?',
    'about.ctaDesc': 'மொறுமொறுப்பான சிக்கன், சுவையான பர்கர்கள், சைட் டிஷ்கள் மற்றும் கிரீமி மில்க்‌ஷேக்குகள் நிறைந்த எங்கள் டைன்-இன் மெனுவை ஆராயுங்கள்.',

    // Menu Page
    'menu.heroTitle': 'எங்கள் டைன்-இன் மெனு',
    'menu.heroDesc': 'கொஞ்சம் மொறுமொறுப்பு. நிறைய திருப்தி!',
    'menu.heroSub': '* அனைத்து உணவுகளுக்கும் ஜிஎஸ்டி தனி. டைன்-இன் விலைகள் மட்டுமே. சைவம் சாப்பிடுபவர்களுக்கான உணவுகள் மெனு முழுவதும் உள்ளன.',
    'menu.searchPlaceholder': 'எங்கள் சுவையான உணவுகளைத் தேடுங்கள்...',
    'menu.filterAll': 'முழு மெனு',
    'menu.filterVeg': 'சைவம் 🌱',
    'menu.filterSpicy': 'காரமானது 🌶️',
    'menu.filterPopular': 'பிரபலம் ★',
    'menu.categories': 'வகைகள்',
    'menu.noDishesTitle': 'உணவுகள் எதுவும் காணப்படவில்லை',
    'menu.noDishesDesc': 'வேறு ஏதேனும் தேட முயற்சிக்கவும் அல்லது பில்டர்களை நீக்கவும்!',
    'badge.special': 'சிறப்பு',
    'badge.signature': 'சிக்னேச்சர்',
    'badge.hot': 'காரமானது',

    // Footer
    'footer.tagline': '“சில்லி சுவை வேண்டுமா? அது ஃபில்பே தான்!”',
    'footer.openingHours': 'திறந்திருக்கும் நேரங்கள்',
    'footer.monSun': 'திங்கள் - ஞாயிறு: காலை 11:30 - இரவு 11:30',
    'footer.copyright': '© 2026 ஃபில்பே ஃபிரைடு சிக்கன் & பர்கர்ஸ் சென்னை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    'footer.madeWith': 'அன்புடன் உருவாக்கியவர்',
    'footer.location': 'பெருங்குடி, OMR — சென்னை',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language preference from LocalStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('filbey_language') as Language;
    if (savedLanguage === 'en' || savedLanguage === 'ta') {
      setTimeout(() => {
        setLanguageState(savedLanguage);
      }, 0);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('filbey_language', lang);
    
    // Update the html lang attribute for SEO and accessibility
    document.documentElement.lang = lang;
    if (lang === 'ta') {
      document.documentElement.classList.add('font-tamil');
    } else {
      document.documentElement.classList.remove('font-tamil');
    }
  };

  // Synchronize initial language with document attribute
  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'ta') {
      document.documentElement.classList.add('font-tamil');
    } else {
      document.documentElement.classList.remove('font-tamil');
    }
  }, [language]);

  const t = (key: string): string => {
    const localized = TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
    return localized;
  };

  const translateMenu = (originalMenu: Category[]): Category[] => {
    if (language === 'en') return originalMenu;

    return originalMenu.map((cat) => ({
      ...cat,
      title: CATEGORY_MAP[cat.title] || cat.title,
      items: cat.items.map((item) => {
        const translatedName = ITEM_NAME_MAP[item.name] || item.name;
        const translatedDesc = item.desc ? (ITEM_DESC_MAP[item.desc] || item.desc) : undefined;
        
        // Translate price labels if exists
        const translatedPrices = item.prices
          ? item.prices.map((p) => ({
              ...p,
              label: PRICE_LABEL_MAP[p.label] || p.label,
            }))
          : undefined;

        // Translate badge
        let translatedBadge = item.badge;
        if (item.badge === 'POPULAR') translatedBadge = 'POPULAR'; // Render badge string correctly or we can translate it in the view.
        
        return {
          ...item,
          name: translatedName,
          desc: translatedDesc,
          prices: translatedPrices,
          badge: translatedBadge,
        };
      }),
    }));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateMenu }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
