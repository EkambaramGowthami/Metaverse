// import { useEffect, useState } from "react";
// import TileMap from "../maps/TileMap";
// import { io } from "socket.io-client";
// import { useParams } from "react-router-dom";

// const socket = io("http://localhost:3000", {
//   withCredentials: true,
//   transports: ["websocket"]
// });

// export const DisplayMap = () => {
//   const [invite, setInvite] = useState(false);
//   const { roomId } = useParams();
//   const [players, setPlayers] = useState([]);
//   const userId = localStorage.getItem("userId");
//   const username = localStorage.getItem("username");
//   const defaultAvatar = { imageUrl: "/Characters.jpeg" };
//   const avatar = JSON.parse(localStorage.getItem("selectedAvatar")) || defaultAvatar;


//   useEffect(() => {
//     socket.emit("joinRoom", { userId, roomId, avatar, username });
//     socket.on("roomJoined", ({ players }) => {
//       setPlayers(Array.isArray(players) ? players : []);
//     });
    

//     // socket.on("roomJoined", ({ players }) => {
//     //   if (Array.isArray(players)) {
//     //     setPlayers(players); 
//     //   } else if (players?.players && Array.isArray(players.players)) {
//     //     setPlayers(players.players); 
//     //   } else {
//     //     console.warn("Invalid players format:", players);
//     //   }
//     // });
    

//     socket.on("updatedPositions", (updatedPlayers) => {
//       setPlayers(updatedPlayers);
//       console.log(updatedPlayers);
//     });

//     socket.on("startVideoCall", ({ roomName, participents }) => {
//       if (participents.includes(userId)) {
//         alert(`Video call started in ${roomName}`);
//       }
//     });

//     return () => {
//       socket.off("roomJoined");
//       socket.off("updatedPositions");
//       socket.off("startVideoCall");
//     };
//   }, [roomId]);

//   return (
//     <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
//       <div className="flex-1 overflow-auto">
//         <TileMap
//           mapUrl="/maps/CreatedOfficeMap.json"
//           tilesetImageUrl="/maps/officeMap.jpeg"
//           tileWidth={64}
//           tileHeight={64}
//           players={players}
//           setPlayers={setPlayers}
//           currentUserId={userId}
//           roomId={roomId}
//         />
//       </div>
//       <div>
//         <button
//           className="flex text-xl items-start bg-green-500 rounded px-12 py-4"
//           onClick={() => setInvite(!invite)}
//         >
//           Invite
//         </button>
//         {invite && (
//           <div className="mt-12 bg-yellow-500 text-white">
//             {window.location.href}
//           </div>
//         )}
//         {/* <div className="absolute top-56 right-4 bg-white p-2 rounded shadow">
//           <h3 className="font-bold mb-2">Players</h3>
//           {players.map((p) => (
//             <div key={p.socketId} className="flex items-center space-x-2 mb-1">
//               <img
//                 src={p.avatar?.imageUrl}
//                 alt="avatar"
//                 className="w-6 h-6 rounded-full"
//               />
//               <span>{p.username || p.userId}</span>
//             </div>
//           ))}
//         </div> */}
//       </div>
//     </div>
//   );
// };




import { useEffect, useState } from "react";
import TileMap from "../maps/TileMap";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("wss://metaverse-3joe.onrender.com", {
  withCredentials: true,
  transports: ["websocket"]
});

export default function DisplayMap(){
  const [invite, setInvite] = useState(false);
  const { roomId } = useParams();
  const [players, setPlayers] = useState([]);
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const defaultAvatar = { imageUrl: "/Characters.jpeg" };
  const avatar = JSON.parse(localStorage.getItem("selectedAvatar")) || defaultAvatar;

  useEffect(() => {
    socket.emit("room:join", { userId, roomId, avatar, username });

    socket.on("room:joined", ({ players }) => {
      setPlayers(Array.isArray(players) ? players : []);
    });

    // socket.on("updatedPositions", (updatedPlayers) => {
    //   setPlayers(Array.isArray(updatedPlayers) ? updatedPlayers : []);
    // });
    socket.on("room:players", ({ players }) => {
      setPlayers(Array.isArray(players) ? players : []);
    });

    // socket.on("startVideoCall", ({ roomName, participents }) => {
    //   if (participents.includes(userId)) {
    //     alert(`Video call started in ${roomName}`);
    //   }
    // });
    socket.on("call:start", ({ roomId: callRoomId, participants }) => {
      if (participants.includes(userId)) {
        alert(`Video call started in room ${callRoomId}`);
      }
    });

    socket.on("call:end", ({ roomId: callRoomId }) => {
      alert(`Video call ended in room ${callRoomId}`);
    });

    return () => {
      socket.off("room:joined");
      socket.off("room:players");
      socket.off("call:start");
      socket.off("call:end");
    };
  }, [roomId, userId, username, avatar]);

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
      <div className="flex-1 overflow-auto">
        <TileMap
          mapUrl="/maps/CreatedOfficeMap.json"
          tilesetImageUrl="/maps/officeMap.jpeg"
          tileWidth={64}
          tileHeight={64}
          players={players}
          setPlayers={setPlayers}
          currentUserId={userId}
          roomId={roomId}
        />
      </div>
      <div>
        <button
          className="flex text-xl items-start bg-green-500 rounded px-12 py-4"
          onClick={() => setInvite(!invite)}
        >
          Invite
        </button>
        {invite && (
          <div className="mt-12 bg-yellow-500 text-white">
            {window.location.href}
          </div>
        )}
        <div className="absolute top-56 right-4 bg-white p-2 rounded shadow">
          <h3 className="font-bold mb-2">Players</h3>
          {players.map((p) => (
            <div key={p.socketId} className="flex items-center space-x-2 mb-1">
              <img
                src={p.avatar?.imageUrl}
                alt="avatar"
                className="w-6 h-6 rounded-full"
              />
              <span>{p.username || p.userId}</span>
            </div>
          ))}
        </div> 
      </div>
      
    </div>
  );
};
