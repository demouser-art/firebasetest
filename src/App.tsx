// import { ChannelProvider } from 'ably/react';
// import { ConnectionState } from './ConnectionState';
import { useEffect } from 'react';
import { Messages } from './Messages';
// import { PresenceStatus } from './PresenceStatus';
import useNotificationPermission from './useNotificationPermission';

function App() {
  useNotificationPermission();

  let deferredPrompt: any;
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the default install prompt
      e.preventDefault();
      // Store the event for later use
      deferredPrompt = e;

      // You can now trigger the install prompt automatically
      setTimeout(() => {
        // Example: Trigger the prompt after a certain delay
        if (deferredPrompt) {
          deferredPrompt.prompt(); // Show the install prompt automatically
          deferredPrompt.userChoice
            .then((choiceResult: any) => {
              console.log('User choice: ', choiceResult.outcome);
              deferredPrompt = null; // Reset deferred prompt after user choice
            });
        }
      }, 5000); // Adjust the delay as needed (5 seconds in this case)
    });
  }, []);
  return (
    <>
      <div className="flex flex-col w-[900px] h-full border border-blue-500 rounded-lg overflow-hidden mx-auto font-sans">
        <div className="flex flex-row w-full rounded-lg overflow-hidden mx-auto font-sans">
          <div className="flex-1 bg-gray-100 text-center p-4">
            <h2 className="text-lg font-semibold text-blue-500">
              Ably Pub/Sub React PWA
            </h2>
            {/* <ConnectionState /> */}
          </div>
        </div>

        <div className="flex flex-1 flex-row justify-evenly">
          {/* <div className="flex flex-col w-1/4 border-r border-blue-500 overflow-hidden mx-auto font-sans">
            <div className="flex-1 overflow-y-auto">
              <PresenceStatus />
            </div>
          </div> */}

          <div className="flex flex-col bg-white w-3/4 rounded-lg overflow-hidden mx-auto font-sans">
            <Messages />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
