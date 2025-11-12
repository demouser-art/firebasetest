/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

declare let self: ServiceWorkerGlobalScope;

// Precache app shell
precacheAndRoute(self.__WB_MANIFEST);

clientsClaim();
self.skipWaiting();
console.log({self});
// Listen for messages from client
self.addEventListener('message', (event) => {
    console.log({event});
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    const { title, body } = event.data;

    self.registration.showNotification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: 'ably-message',
      data: { dateOfArrival: Date.now() },
    });
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      if (clientsArr.length > 0) {
        clientsArr[0].focus();
      } else {
        self.clients.openWindow('/');
      }
    })
  );
});
