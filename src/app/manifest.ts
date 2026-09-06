import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Filbey Fried Chicken & Burgers',
    short_name: 'Filbey',
    description: '100% Halal Crispy Fried Chicken, Burgers & Shakes in Perungudi, OMR, Chennai',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff8f6',
    theme_color: '#5d000c',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
