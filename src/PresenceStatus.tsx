// import { usePresence, usePresenceListener } from 'ably/react';

// export function PresenceStatus() {
//   usePresence('notifications', { status: "I'm here!" });
//   const { presenceData } = usePresenceListener('notifications');

//   return (
//     <div className="flex flex-col bg-white w-full h-full px-4 py-2">
//       <strong className="text-green-700 mr-4 text-center border-b border-gray-900">
//         Present: {presenceData.length}
//       </strong>
//       <div className="flex-1 flex-col flex flex-nowrap items-start gap-4 overflow-x-auto">
//         {presenceData.map((member, idx) => (
//           <div key={idx} className="flex items-center gap-1">
//             <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
//             <span className="text-gray-800">
//               {member.clientId}
//               {member.data?.status ? ` (${member.data.status})` : ''}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
