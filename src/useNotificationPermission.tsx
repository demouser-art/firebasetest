import { useEffect } from 'react';

export default function useNotificationPermission() {
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);
}
