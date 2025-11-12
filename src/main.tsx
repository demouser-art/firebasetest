import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { requestPermissionAndGetToken, onMessageListener } from './firebase';

const root = createRoot(document.getElementById('root')!);

async function initFCM() {
  const token = await requestPermissionAndGetToken();
  if (token) {
    console.log('Send this token to backend to send notifications:', token);
  }

  onMessageListener((payload) => {
    console.log('Foreground message:', payload);
    new Notification(payload.notification?.title || 'New Message', {
      body: payload.notification?.body,
      icon: '/pwa-192x192.png',
    });
  });
}

initFCM();

root.render(<App />);
