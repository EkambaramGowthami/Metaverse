import { useEffect, useRef, useState } from "react";
import TileMap from "../maps/TileMap";
import { useParams } from "react-router-dom";
import { socket } from "./utils/socket";
import Users from "../Icons/Users";
import Copy from "../Icons/Copy";
import User from "../Icons/User";

export default function DisplayMap({ players, setPlayers }) {
  const [invite, setInvite] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);
  const { roomId } = useParams();
  const [copied, setCopied] = useState(false);
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const defaultAvatar = { imageUrl: "/Characters.jpeg" };
  const avatar = JSON.parse(localStorage.getItem("selectedAvatar")) || defaultAvatar;
  const handleOnclickCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    catch (err) {
      console.log("Error occured while coping:", err);
    }
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_250px] gap-0 w-screen h-screen overflow-auto bg-black">
      {/* <div className="w-full h-screen bg-black text-white md:block hidden">hi</div> */}
      <div className="flex justify-center items-center overflow-auto w-full h-full  border-r border-black">
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
        <div className="flex justify-end p-2">
          <div className="right-0 flex justify-end bg-white items-center rounded-lg space-x-2 p-2">
            <div onClick={() => setShowPlayers(!showPlayers)}><Users /></div>
            <p className="text-green-500 text-sm">{players.length || "1"}</p>
            <button className="bg-[#7B68EE] px-2 py-1 text-white rounded-lg text-sm" onClick={() => setInvite(!invite)}>Invite</button>
          </div>
        </div>
        <div className="p-4">
          {
            invite ? (<div className="flex justify-center text-sm p-2 bg-white rounded-lg text-sm">
              <div className="flex space-x-2 justify-center items-center">
                <p className="text-black">RoomId :</p>
                <div className="text-white flex  justify-between space-x-6 items-center bg-[#008080] px-6 rounded-lg py-1"><span>{roomId}</span><span onClick={handleOnclickCopy}><Copy /></span></div>
              </div>

            </div>) : (
              showPlayers ? (
                <div className="text-sm p-2 rounded-lg bg-white rounded shadow-lg ">
                  <p className="text-center text-lg text-[#004687] font-semibold mb-2">Players</p>
                  {players.map((p) => (
                    <div key={p.socketId} className="flex items-center p-2 space-x-2 mb-2">
                      <User />
                      <span>{p.username || p.userId}</span>
                    </div>
                  ))}
            </div>
              ) :
                <div></div>
            )

          }

        </div>


      </div>


      {/* <div className="relative md:w-1/3 p-4">
      
        <button
          className="flex text-xl items-start bg-green-500 rounded px-12 py-4"
          onClick={() => setInvite(!invite)}
        >
          Invite
        </button>

    
        {invite && (
          <div className="mt-4 bg-yellow-500 text-white p-2 rounded">
            {window.location.href}
          </div>
        )}


        <div className="mt-8 bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-4 text-lg text-red-500">Players</h3>
          {players.map((p) => (
            <div key={p.socketId} className="flex items-center space-x-2 mb-2">
              <img
                src={p.avatar?.imageUrl}
                alt="avatar"
                className="w-6 h-6 rounded-full"
              />
              <span>{p.username || p.userId}</span>
            </div>
          ))}
        </div>
      </div> */}



    </div>
  );
}

