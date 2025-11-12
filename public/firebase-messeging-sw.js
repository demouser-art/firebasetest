importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

firebase.initializeApp({
  apiKey: "AIzaSyD58mmJ_KY1y7hUqG_GpQLwCaiQ8xCL9AY",
  authDomain: "test-2bfca.firebaseapp.com",
  projectId: "test-2bfca",
  storageBucket: "test-2bfca.firebasestorage.app",
  messagingSenderId: "272266754689",
  appId: "1:272266754689:web:a225bd8f0d24478337eb80"
});
const messaging = firebase.messaging();
console.log("service worker",{firebase,messaging});
// Background notification handler
messaging.onBackgroundMessage(function (payload) {
  console.log('Background message received:', payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: '/pwa-192x192.png',
  });
});

if (workbox) {
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
}


// Cache Name and Resources to Cache
const CACHE_NAME = 'my-pwa-cache-v1';
const URLs_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/images/logo.png', // Add other assets you want to cache
];

// Install event - Caching assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(URLs_TO_CACHE);
      })
  );
});

// Fetch event - Serve cached assets if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response if available, else fetch from network
        return cachedResponse || fetch(event.request);
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});