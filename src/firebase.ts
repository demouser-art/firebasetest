import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyD58mmJ_KY1y7hUqG_GpQLwCaiQ8xCL9AY",
  authDomain: "test-2bfca.firebaseapp.com",
  projectId: "test-2bfca",
  storageBucket: "test-2bfca.firebasestorage.app",
  messagingSenderId: "272266754689",
  appId: "1:272266754689:web:a225bd8f0d24478337eb80"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
console.log('firebase :',{app,messaging});

// Request notification permission and get FCM token
export async function requestPermissionAndGetToken() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const token = await getToken(messaging, {
      vapidKey: 'BMxiMayjfgbBPluUbYbbbYnWM4oh5_89l3JsjjmNIrpbur9ZeyWWNxvP1m7AqE_VV5fauiFaxiaYwrs7qXLfSts',
      serviceWorkerRegistration: await navigator.serviceWorker.register('/firebasetest/firebase-messaging-sw.js'),
    });

    console.log('FCM Token:', token);

    if (token) {
      // Send token to backend
      await sendTokenToBackend(token);
      console.log({token});
    }

    return token;
  } catch (err) {
    console.error('Error getting FCM token:', err);
    return null;
  }
}

async function sendTokenToBackend(token:any) {
  console.log({token});
  try {
    // Replace with your backend URL to register the token
    // await fetch('http://localhost:3000/register-token', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ token }),
    // });
    console.log('Token sent to backend');
  } catch (err) {
    console.error('Error sending token to backend:', err);
  }
}


// Handle messages while tab is open
export function onMessageListener(callback: (payload: any) => void) {
  onMessage(messaging, callback);
}