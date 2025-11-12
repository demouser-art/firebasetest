import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // base: '/',
  base: '/firebasetest/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt', // Let user decide when to update
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      strategies: 'injectManifest',
      manifest: {
        name: 'Firebase Chat PWA',
        short_name: 'ChatPWA',
        description: 'Realtime chat with Firebase + PWA offline support',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        // start_url: '/',
        start_url: '/firebasetest/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any',
          },
        ],
      },
      devOptions: {
        enabled: true, // Enable SW in development
      },
      // Remove runtimeCaching since Firebase handles push
      workbox: {
        cleanupOutdatedCaches: true,
      },
      // Use public folder SW
      srcDir: 'public',
      filename: 'firebase-messaging-sw.js', // Your Firebase SW
    }),
  ],
});
