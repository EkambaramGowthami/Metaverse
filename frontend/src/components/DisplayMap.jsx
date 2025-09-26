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
    <div className="flex flex-col md:grid md:grid-cols-[2fr_350px] w-screen h-screen overflow-hidden bg-black">
      <div className="flex justify-center items-center overflow-hidden w-full h-full border-b md:border-b-0 md:border-r border-black">
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
      <div className="flex flex-col h-full bg-white/5">
        
        <div className="flex justify-end p-2 flex-wrap gap-2">
        <div className="flex justify-end bg-white rounded-xl p-3 gap-2">
          <button
            className="bg-green-400 px-3 py-1 text-white rounded-lg text-xs sm:text-sm"
            onClick={() => setOpenChat(!openChat)}
          >
            {openChat ? "Close chat" : "Open chat"}
          </button>
          <div
            onClick={() => setShowPlayers(!showPlayers)}
            className="cursor-pointer flex items-center gap-1"
          >
            <Users />
            <p className="text-green-500 text-xs sm:text-sm">{players.length || "1"}</p>
          </div>
          <button
            className="bg-blue-800 px-3 py-1 text-white rounded-lg text-xs sm:text-sm"
            onClick={() => setInvite(!invite)}
          >
            Invite
          </button>
        </div>

        </div>
        
        <div className="p-2 flex-1 overflow-y-auto">
          {invite ? (
            <div className="flex flex-col sm:flex-row justify-center text-sm p-2 bg-white rounded-lg items-center gap-2">
              <p className="text-black">RoomId :</p>
              <div className="text-white flex justify-between items-center bg-green-400 px-4 rounded-lg py-1 gap-2">
                <span className="break-all">{roomId}</span>
                <span onClick={handleOnclickCopy} className="cursor-pointer">
                  <Copy />
                </span>
              </div>
            </div>
          ) : showPlayers ? (
            <div className="text-sm p-2 rounded-lg bg-white shadow-lg">
              <p className="text-center text-base md:text-lg text-[#004687] font-semibold mb-2">
                Players
              </p>
              {players.map((p) => (
                <div
                  key={p.socketId}
                  className="flex items-center p-2 gap-2 mb-2 hover:bg-gray-100 rounded"
                >
                  <User />
                  <span className="truncate">{p.username || p.userId}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        {openChat && (
          <div className="flex flex-col bg-gradient-to-br from-gray-950 via-black to-gray-900 rounded-t-3xl h-full max-h-screen md:max-h-[90%] shadow-2xl border border-gray-800 p-4">
            <div className="p-4 bg-blue-800 text-white rounded-t-3xl shadow-lg border-b ">
              <h2 className="text-lg sm:text-2xl font-bold text-center tracking-wider font-sans">
                💬 Chat Room
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto bg-[#262626] p-1 space-y-1 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="text-gray-500 text-center mt-12 text-base sm:text-lg italic">
                  No messages yet...
                </div>
              ) : (
                messages.map((msg) =>
                msg.userId === userId ? (
                  <div
                    key={msg._id}
                    className="flex ml-20 justify-end items-start gap-1 p-1 rounded-xl transition hover:scale-[1.01] shadow-md bg-[#1F2022]"
                  >
                    <div className="flex-shrink-0 w-4 h-4 sm:w-6 sm:h-6 rounded-full flex items-center justify-center bg-blue-800 font-bold text-sm sm:text-lg text-white shadow-inner">
                      {msg.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-blue-800 font-semibold text-lg md:text-sm truncate">
                          {msg.username}
                        </span>
                        <span className="text-gray-500 text-[10px] sm:text-xs ml-2 flex-shrink-0">
                          {msg.timestamp
                            ? new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                      <p className="text-white text-sm break-words">{msg.message}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={msg._id}
                    className="flex justify-end items-start gap-1 p-1 rounded-xl transition hover:scale-[1.01] shadow-md"
                  >
                    <div className="flex-shrink-0 w-4 h-4 sm:w-6 sm:h-6 rounded-full flex items-center justify-center bg-blue-800 font-bold text-sm sm:text-lg text-white shadow-inner">
                      {msg.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-blue-800 font-semibold text-lg md:text-sm truncate">
                          {msg.username}
                        </span>
                        <span className="text-gray-500 text-[10px] sm:text-xs ml-2 flex-shrink-0">
                          {msg.timestamp
                            ? new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                      <p className="text-white text-sm break-words">{msg.message}</p>
                    </div>
                  </div>
                )
              )
              
              )}
            </div>
            <div className="bg-gray-950 p-2 flex items-center gap-2 border-t border-gray-800">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none text-sm sm:text-base"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={sendMessage}
                className="p-2 sm:p-3 rounded-full text-white bg-blue-800 shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 transform rotate-90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
}

