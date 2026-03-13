import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bourbon Buddy',
    short_name: 'Bourbon Buddy',
    description: 'Scan bourbon bottles and track your collection',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#d97706',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
