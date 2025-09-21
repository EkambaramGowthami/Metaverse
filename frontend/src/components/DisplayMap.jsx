import { useEffect, useRef, useState } from "react";
import TileMap from "../maps/TileMap";
import { useParams } from "react-router-dom";
import { socket } from "./utils/socket";
import Users from "../Icons/Users";
import Copy from "../Icons/Copy";
import User from "../Icons/User";

export default function DisplayMap({ players, setPlayers }) {
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  const [messages, setMessages] = useState([]);
  const [invite, setInvite] = useState(false);
  const [message, setMessage] = useState("");
  const [openChat, setOpenChat] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);
  const { roomId } = useParams();
  const [copied, setCopied] = useState(false);
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const defaultAvatar = { imageUrl: "/Characters.jpeg" };
  const avatar = JSON.parse(localStorage.getItem("selectedAvatar")) || defaultAvatar;
  const mapUrl = localStorage.getItem("mapUrl");
  console.log("Map url:", mapUrl);
  const tilesetImageUrl = localStorage.getItem("tilesetImageUrl");
  console.log("TileImageUrl:", tilesetImageUrl);
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
  useEffect(() => {
    socket.emit("getMessages", roomId);

    socket.on("allMessages", (messages) => setMessages(messages));
    socket.on("newMessage", (msg) => setMessages(prev => [...prev, msg]));

    return () => {
      socket.off("allMessages");
      socket.off("newMessage");
    };
  }, [roomId]);

  const sendMessage = async () => {
    if (message.trim() === "") {
      return;
    }
    socket.emit("chat", { roomId, userId, username, message });
    setMessage("");

  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();

    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_350px] gap-0 w-screen h-screen overflow-auto bg-black bg-opacity-80">
      {/* <div className="w-full h-screen bg-black text-white md:block hidden">hi</div> */}
      <div className="flex justify-center items-center overflow-auto w-full h-full  border-r border-black">
        <TileMap
          mapUrl={mapUrl}
          tilesetImageUrl={tilesetImageUrl}
          tileWidth={64}
          tileHeight={64}
          players={players}
          setPlayers={setPlayers}
          currentUserId={userId}
          roomId={roomId}
        />
      </div>
      <div>
        <div className="flex justify-end p-2 space-x-2">

          <div className="right-0 flex justify-end bg-white items-center rounded-lg space-x-2 p-2">
            <button className="bg-emerald-600 px-2 py-1 text-white rounded-lg text-sm" onClick={() => setOpenChat(!openChat)}>{openChat === true ? "Close chat" : "Open chat"}</button>
            <div onClick={() => setShowPlayers(!showPlayers)}><Users /></div>
            <p className="text-green-500 text-sm">{players.length || "1"}</p>
            <button className="bg-blue-800 px-2 py-1 text-white rounded-lg text-sm" onClick={() => setInvite(!invite)}>Invite</button>
          </div>
        </div>
        <div className="p-4">

          {
            invite ? (<div className="flex justify-center text-sm p-2 bg-white rounded-lg text-sm">
              <div className="flex space-x-2 justify-center items-center">
                <p className="text-black">RoomId :</p>
                <div className="text-white flex  justify-between space-x-6 items-center bg-green-400 px-6 rounded-lg py-1"><span>{roomId}</span><span onClick={handleOnclickCopy}><Copy /></span></div>
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
          {
            openChat && (
              <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 rounded-3xl h-screen w-full flex flex-col shadow-2xl border border-gray-800">
                <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-t-3xl shadow-lg border-b border-teal-800">
                  <h2 className="text-2xl font-bold text-center tracking-wider font-sans">💬 Chat Room</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                  {messages.length === 0 ? (
                    <div className="text-gray-500 text-center mt-12 text-lg italic">
                      No messages yet...
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg._id}
                        className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.01] hover:bg-gray-800 bg-gray-900 border border-gray-700 shadow-md animate-fade-in"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center font-bold text-lg text-white shadow-inner">
                          {msg.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-emerald-400 font-semibold text-lg truncate">
                              {msg.username}
                            </span>
                            <span className="text-gray-500 text-xs font-light ml-4 flex-shrink-0">
                              {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                            </span>
                          </div>
                          <p className="text-gray-300 text-base leading-snug break-words">
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="bg-gray-950 p-1 rounded-b-3xl border-t border-gray-800 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 p-2 rounded-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow duration-300 text-base"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label="Type a message"
                  />
                  <button
                    onClick={() => handleKeyDown({ key: 'Enter' })}
                    className="p-3 bg-emerald-600 rounded-full text-white hover:bg-emerald-500 transition-colors duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    aria-label="Send message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          }

        </div>


      </div>



    </div>
  );
}

