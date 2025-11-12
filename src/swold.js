// self.addEventListener('install', (event) => {
//   console.log('[SW] Installed');
//   self.skipWaiting();
// });

// self.addEventListener('activate', (event) => {
//   console.log('[SW] Activated');
//   self.clients.claim();
// });

// // Listen to messages from React
// self.addEventListener('message', (event) => {
//   if (!event.data) return;
//   const { type, title, body } = event.data;
//   if (type === 'SHOW_NOTIFICATION') {
//     self.registration.showNotification(title, {
//       body,
//       icon: '/pwa-192x192.png',
//       badge: '/pwa-192x192.png',
//       tag: 'unique-' + Date.now(),
//     });
//   }
// });

// // Offline caching
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     fetch(event.request).catch(() => caches.match(event.request))
//   );
// });

// // Notification click
// self.addEventListener('notificationclick', (event) => {
//   event.notification.close();
//   event.waitUntil(
//     self.clients.matchAll({ type: 'window' }).then((clients) => {
//       if (clients.length > 0) {
//         clients[0].focus();
//       } else {
//         self.clients.openWindow('/');
//       }
//     })
//   );
// });
