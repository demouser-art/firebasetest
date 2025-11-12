// import { useState, useEffect } from 'react';
// import { requestPermissionAndGetToken, onMessageListener } from './firebase'; // Your firebase.ts module

// interface Message {
//   id: string;
//   text: string;
//   timestamp: number;
//   clientId: string;
// }

// function MessageView({ message }: { message: Message }) {
//   const isMine = message.clientId === 'react-client';
//   return (
//     <p className={`py-1 px-2 text-black rounded shadow-sm ${isMine ? 'bg-green-100' : 'bg-blue-50'}`}>
//       {message.text}
//     </p>
//   );
// }

// export function Messages() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputValue, setInputValue] = useState('');

//   // Request permission and get FCM token
//   useEffect(() => {
//     requestPermissionAndGetToken().then((token) => {
//       if (token) console.log('FCM Token:', token);
//       // Optionally, send token to your server to send notifications
//     });

//     // Listen for foreground messages
//     onMessageListener((payload) => {
//       console.log('Foreground message:', payload);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now().toString(),
//           text: payload.notification?.body || 'New message',
//           timestamp: Date.now(),
//           clientId: 'server',
//         },
//       ]);
//     });
//   }, []);

//   const handleSend = async () => {
//     if (!inputValue.trim()) return;

//     const message: Message = {
//       id: Date.now().toString(),
//       text: inputValue.trim(),
//       timestamp: Date.now(),
//       clientId: 'react-client',
//     };

//     // Update local state immediately
//     setMessages((prev) => [...prev, message]);
//     setInputValue('');

//     // Optionally send to your backend (so server can push notification via FCM)
//     try {
//       // await sendMessageToServer(message);
//     } catch (err) {
//       console.error('Error sending message to server:', err);
//     }
//   };

//   return (
//     <div className="flex flex-col w-full h-[600px] rounded-lg overflow-hidden mx-auto font-sans">
//       <div className="flex-1 p-4 overflow-y-auto space-y-2">
//         {messages.map((msg) => (
//           <MessageView key={msg.id} message={msg} />
//         ))}
//       </div>
//       <div className="flex items-center px-2 mt-auto mb-2">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           className="flex-1 p-2 border border-gray-400 rounded outline-none bg-white"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//         />
//         <button
//           className="bg-blue-500 text-white px-4 ml-2 h-10 rounded hover:bg-blue-600 transition-colors"
//           onClick={handleSend}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { requestPermissionAndGetToken } from './firebase'; // Your firebase.ts module

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
      // Clear the existing token in localStorage
      localStorage.removeItem('fcm_token');

      // Request a new token
      const newToken = await requestPermissionAndGetToken();
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
        className={`mt-2 px-4 py-2 rounded text-white ${
          token ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
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
