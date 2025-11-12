
import { useState, useEffect } from 'react';
import { messaging, requestPermissionAndGetToken } from './firebase'; // Your firebase.ts module
import { deleteToken, getToken } from 'firebase/messaging';

export function Messages() {
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Check if token already exists in localStorage
    const savedToken = localStorage.getItem('fcm_token');
    if (savedToken) {
      // setToken(savedToken);
      requestPermissionAndGetToken().then((newToken) => {
        if (newToken) {
          setToken(newToken);
          localStorage.setItem('fcm_token', newToken);
        }
      });
    } else {
      // Request permission and get token
      requestPermissionAndGetToken().then((newToken) => {
        if (newToken) {
          setToken(newToken);
          localStorage.setItem('fcm_token', newToken);
        }
      });
    }
  }, []);

  // Manual token refresh
  const refreshToken = async () => {
    setRefreshing(true);
    try {
      // Get the registration again
      const registration = await navigator.serviceWorker.register(
        // '/firebasetest/firebase-messaging-sw.js',
        // { scope: '/firebasetest/' }
      '/firebase-messaging-sw.js', {scope: '/'}
      );

      // Delete the old token
      await deleteToken(messaging);

      // Get a new one
      const newToken = await getToken(messaging, {
        vapidKey: 'BMxiMayjfgbBPluUbYbbbYnWM4oh5_89l3JsjjmNIrpbur9ZeyWWNxvP1m7AqE_VV5fauiFaxiaYwrs7qXLfSts',
        serviceWorkerRegistration: registration,
      });

      if (newToken) {
        setToken(newToken);
        localStorage.setItem('fcm_token', newToken);
        console.log('Token refreshed:', newToken);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const copyToClipboard = () => {
    if (token) {
      navigator.clipboard.writeText(token).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow mt-6 font-sans">
      <h2 className="text-lg font-semibold mb-2">Firebase Cloud Messaging Token</h2>
      <textarea
        readOnly
        value={token || 'No token generated yet.'}
        rows={4}
        className="w-full p-2 border rounded resize-none bg-gray-100 text-black"
      />
      <button
        onClick={copyToClipboard}
        disabled={!token}
        className={`mt-2 px-4 py-2 rounded text-white ${token ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
      >
        {copied ? 'Copied!' : 'Copy Token'}
      </button>

      <button
        onClick={refreshToken}
        disabled={refreshing}
        className={`mt-4 px-4 py-2 rounded text-white ${refreshing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
      >
        {refreshing ? 'Refreshing...' : 'Refresh Token'}
      </button>
    </div>
  );
}
