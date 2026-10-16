import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Filbey Fried Chicken & Burgers',
    short_name: 'Filbey',
    description: '100% Halal Crispy Fried Chicken, Dynamite Burgers & Shakes in Perungudi, OMR, Chennai',
    start_url: '/order',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#fff8f6',
    theme_color: '#5d000c',
    categories: ['food', 'shopping', 'lifestyle'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: 'Order Online',
        short_name: 'Order',
        url: '/order',
        description: 'Direct delivery in 30-45 mins from live kitchen',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Explore Menu',
        short_name: 'Menu',
        url: '/menu',
        description: 'Browse all crispy chicken, burgers & combos',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
      },
    ],
  };
}
