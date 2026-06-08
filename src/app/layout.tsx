import type { Metadata } from "next";
import { Anton, Inter, Baloo_Thambi_2 } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

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
  telephone: "+91 63834 00144",
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
          {children}
        </LanguageProvider>
        {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/916383400144"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="fixed bottom-6 right-6 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_16px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:scale-110 hover:shadow-[0_6px_20px_rgba(37,211,102,0.6)] transition-all duration-300 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
          </svg>
        </a>
      </body>
    </html>
  );
}
