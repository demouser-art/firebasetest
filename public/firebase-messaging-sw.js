
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

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  const { fcm_title, fcm_body, fcm_icon } = payload.data || {};

  if (fcm_title && fcm_body) {
    self.registration.showNotification(fcm_title, {
      body: fcm_body,
      icon: fcm_icon || '/pwa-192x192.png',
      data: payload.data
    });
  }
});

if (typeof workbox !== 'undefined' && workbox.precaching) {
  try {
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
  } catch (e) {
    console.warn('Workbox precache skipped:', e);
  }
}

const CACHE_NAME = 'my-pwa-cache-v1';
const URLs_TO_CACHE = ['/',
  '/manifest.json',
  '/pwa-192x192.png',];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLs_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.endsWith('/manifest.json') ||
    url.pathname.includes('firebase-messaging-sw.js') ||
    url.pathname.includes('service-worker.js')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((n) => n !== CACHE_NAME && caches.delete(n)))
    )
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Safely get click_action from the notification's data payload.
  // We use the nullish coalescing operator (??) or a simple OR (||) 
  // to fall back to the root path ('/') if click_action is missing.
  const data = event.notification.data || {};
  const clickAction = data.click_action || '/'; // Use '/' as the default site root

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // ... (Rest of the logic remains the same)
      for (const client of clientList) {
        if (client.url.includes(clickAction) && 'focus' in client) {
          return client.focus();
        }
      }
      
      if (clients.openWindow) {
        return clients.openWindow(clickAction);
      }
    })
  );
});
