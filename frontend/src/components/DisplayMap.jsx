import { useEffect, useState } from "react";
import TileMap from "../maps/TileMap";
import { useParams } from "react-router-dom";

import { socket } from "./utils/socket";

export default function DisplayMap() {
  const [invite, setInvite] = useState(false);
  const { roomId } = useParams();
  const [players, setPlayers] = useState([]);
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const defaultAvatar = { imageUrl: "/Characters.jpeg" };
  const avatar = JSON.parse(localStorage.getItem("selectedAvatar")) || defaultAvatar;
  const [videoCall, setVideoCall] = useState(false);


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
          setVideoCall={setVideoCall}
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
        <div className="relative">
          <div className="absolute top-56 right-4 bg-white p-2 rounded shadow z-10">
            <h3 className="font-bold mb-2">Players</h3>
            <h3 className="bg-green-500 text-black w-full h-24">hi there</h3>
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

    </div>
      
   
  );
};
