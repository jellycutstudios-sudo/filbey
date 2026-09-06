import type { Metadata } from "next";
import { Bricolage_Grotesque, Outfit, Baloo_Thambi_2 } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const balooThambi2 = Baloo_Thambi_2({
  subsets: ["tamil", "latin"],
  variable: "--font-baloo-thambi-2",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thefilbey.com"),
  title: {
    default: "Filbey - A Little Crunch. A Lot of Comfort!",
    template: "%s | Filbey Fried Chicken & Burgers",
  },
  description:
    "Welcome to Filbey Fried Chicken & Burgers in Chennai! 100% Halal preparation. Enjoy our signature fried chicken, classic dynamite burgers, shakes, and more, served fresh and hot.",
  keywords: [
    "Filbey",
    "fried chicken Chennai",
    "halal fried chicken",
    "dynamite burgers",
    "restaurant Perungudi OMR",
    "fast food Chennai",
    "best fried chicken",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://thefilbey.com/",
    siteName: "Filbey Fried Chicken & Burgers",
    title: "Filbey - A Little Crunch. A Lot of Comfort!",
    description:
      "Welcome to Filbey Fried Chicken & Burgers in Chennai! 100% Halal certified. Signature crispy fried chicken, dynamite burgers, loaded fries & shakes in Perungudi, OMR.",
    images: [
      {
        url: "https://thefilbey.com/about-filbey-storefront.jpg",
        width: 1200,
        height: 900,
        alt: "Filbey Fried Chicken & Burgers Storefront Perungudi Chennai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Filbey - A Little Crunch. A Lot of Comfort!",
    description:
      "Signature crispy fried chicken, dynamite burgers, loaded fries & shakes in Perungudi, OMR Chennai. 100% Halal certified.",
    images: ["https://thefilbey.com/about-filbey-storefront.jpg"],
  },
  alternates: {
    canonical: "https://thefilbey.com/",
  },
};

const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Restaurant", "FastFoodRestaurant"],
  name: "Filbey Fried Chicken & Burgers",
  alternateName: "Filbey Chennai",
  description:
    "Filbey is Chennai's top-rated destination for 100% Halal crispy fried chicken, dynamite burgers, loaded fries, and specialty milkshakes, located on OMR, Perungudi.",
  image: "https://thefilbey.com/about-filbey-storefront.jpg",
  "@id": "https://thefilbey.com/#restaurant",
  url: "https://thefilbey.com/",
  telephone: "+91 81223 56144",
  priceRange: "₹₹ (₹150 - ₹500)",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, Credit Card, Debit Card, UPI, Google Pay, PhonePe, Paytm",
  servesCuisine: [
    "Fried Chicken",
    "Burgers",
    "Fast Food",
    "Halal",
    "American Fast Food",
    "Milkshakes",
    "Wraps",
  ],
  hasMenu: "https://thefilbey.com/menu",
  menu: "https://thefilbey.com/menu",
  acceptsReservations: "False",
  address: {
    "@type": "PostalAddress",
    streetAddress: "OMR Road, Near Perungudi Toll Plaza",
    addressLocality: "Perungudi",
    addressRegion: "Chennai",
    postalCode: "600096",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 12.9696,
    longitude: 80.2435,
  },
  areaServed: [
    { "@type": "Place", name: "Perungudi, Chennai" },
    { "@type": "Place", name: "Kandanchavadi, Chennai" },
    { "@type": "Place", name: "Thoraipakkam, Chennai" },
    { "@type": "Place", name: "OMR, Chennai" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "11:30",
      closes: "23:30",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "500",
    bestRating: "5",
    worstRating: "1",
  },
  sameAs: [
    "https://www.instagram.com/thefilbey/",
    "https://maps.app.goo.gl/w5SU8wuf79VM7HtW9",
  ],
  potentialAction: {
    "@type": "OrderAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://thefilbey.com/order",
      inLanguage: "en-IN",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    deliveryMethod: "http://purl.org/goodrelations/v1#DeliveryModeDirectDownload",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolageGrotesque.variable} ${outfit.variable} ${balooThambi2.variable} light`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
      </head>
      <body className="bg-background text-on-background antialiased overflow-x-hidden">
        <LanguageProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
