import type { Metadata } from "next";
import { Anton, Inter, Baloo_Thambi_2 } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    url: "https://thefilbey.com/",
    title: "Filbey - A Little Crunch. A Lot of Comfort!",
    description:
      "Enjoy our signature fried chicken, classic dynamite burgers, shakes, and more, served fresh and hot. 100% Halal certified.",
    images: [{ url: "/Document.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Filbey - A Little Crunch. A Lot of Comfort!",
    description:
      "Enjoy our signature fried chicken, classic dynamite burgers, shakes, and more, served fresh and hot. 100% Halal certified.",
    images: ["/Document.png"],
  },
};

const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Filbey Fried Chicken & Burgers",
  image: "https://thefilbey.com/Document.png",
  "@id": "https://thefilbey.com/",
  url: "https://thefilbey.com/",
  telephone: "+91 81223 56144",
  servesCuisine: ["Fast Food", "Fried Chicken", "Burgers", "Halal"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "OMR",
    addressLocality: "Perungudi",
    addressRegion: "Chennai",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "12.9696",
    longitude: "80.2435",
  },
  openingHoursSpecification: {
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
    opens: "11:00",
    closes: "23:00",
  },
  menu: "https://thefilbey.com/menu",
  acceptsReservations: "False",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable} ${balooThambi2.variable} light`}>
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
