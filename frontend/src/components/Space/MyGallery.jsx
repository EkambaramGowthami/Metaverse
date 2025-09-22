import { useEffect, useRef, useState } from "react";
import Search from "../../Icons/Search";
import Cancel from "../../Icons/Cancel";
import axios from "axios";
import { socket } from "../utils/socket";
import { useNavigate } from "react-router-dom";

export default function MyGallery({ players, setPlayers }) {
  const [roomCreating, setRoomCreating] = useState(false);
  const [createSpace, setCreateSpace] = useState(false);
  const [mapUrl,setMapUrl] = useState("/maps/CreatedOfficeMap.json");
  const [tilesetImageUrl,setTilesetImageUrl] = useState("/maps/officeMap.jpeg");
  // const mapUrl = useRef("/maps/CreatedOfficeMap.json");
  // const tilesetImageUrl = useRef("/maps/officeMap.jpeg");
  const selectedMapRef = useRef(null);
  const [roomId, setRoomId] = useState("");
  const roomIdRef = useRef(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const [spaceMaps, setSpaceMaps] = useState([]);
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const maps = [
    { id: 1, imageUrl: "/spaceImages/730c3eb3-4fff-4e24-a22e-d71924f030ef.jpeg", mapUrl: "/maps/CreatedOfficeMap.json", tilesetImageUrl: "/maps/officeMap.jpeg", name: "Blue-office" },
    { id: 2, imageUrl: "/spaceImages/WOODEN-OFFICE.jpeg", mapUrl: "/maps/woodenOffice.json", tilesetImageUrl: "/maps/woodenOffice.jpeg", name: "Wooden-office" },
    { id: 3, imageUrl: "/spaceImages/Meeting.png", mapUrl: "/maps/MeetingRoom.json", tilesetImageUrl: "/maps/SmallchatgptImageAgain2 (1).jpg", name: "Meeting-room" }
  ];

  const avatarsImages = [
    { imageUrl: "/avatars/$ limp.png", direction: "down", frame: 0 },
    { imageUrl: "/avatars/Casual_Modern_Style_Character-removebg-preview.png", direction: "down", frame: 0 },
    { imageUrl: "/avatars/Consistent_Style_Character_Variations-removebg-preview.png", direction: "down", frame: 0 },
    { imageUrl: "/avatars/Elegant_Style_Character-removebg-preview.png", direction: "down", frame: 0 },
    { imageUrl: "/avatars/Gothic_Style_Character-removebg-preview.png", direction: "down", frame: 0 },
    { imageUrl: "/avatars/Sporty_Style_Character-removebg-preview.png", direction: "down", frame: 0 },
  ];

  function getRandomAvatar() {
    const randomIndex = Math.floor(Math.random() * avatarsImages.length);
    return avatarsImages[randomIndex];
  }

  const handleRoomClick = (image) => {
    if (roomCreating) return;
    setRoomCreating(true);
    const avatar = getRandomAvatar();
    selectedMapRef.current = image;
    setMapUrl(image.mapUrl);
    setTilesetImageUrl(image.tilesetImageUrl);
    localStorage.setItem("mapUrl", image.mapUrl);
    localStorage.setItem("tilesetImageUrl", image.tilesetImageUrl);
    socket.emit("createRoom", { userId, avatar, username ,mapUrl:image.mapUrl,tilesetImageUrl:image.tilesetImageUrl});
  };

  useEffect(() => {
    const handleRoomCreated = ({ roomId, inviteLink, players, avatar }) => {
      setPlayers(Array.isArray(players) ? players : players.players);
      localStorage.setItem("selectedMap", JSON.stringify(selectedMapRef.current));
      navigate(`/space/room/${roomId}`);
    };
    const handleRoomJoined = ({ roomId, players,mapUrl,tilesetImageUrl }) => {
      setPlayers(players);
      setMapUrl(mapUrl);
      setTilesetImageUrl(tilesetImageUrl);
      localStorage.setItem("mapUrl", mapUrl);
      localStorage.setItem("tilesetImageUrl", tilesetImageUrl);
      socket.on("updatedPositions", (players) => setPlayers(players));
      navigate(`/space/room/${roomId}`);
    };
    socket.on("roomCreated", handleRoomCreated);
    socket.on("roomJoined", handleRoomJoined);
    socket.on("updatedPositions", (players) => setPlayers(players));

    return () => {
      socket.off("roomCreated", handleRoomCreated);
      socket.off("roomJoined", handleRoomJoined);
      socket.off("updatedPositions");
    };
  }, []);

  const handleMapClick = (map) => {
    setSpaceMaps((prev) => {
      if (prev.find((m) => m.id === map.id)) return prev;
      const updated = [...prev, map];
      axios.post(`${BackendUrl}/maps/update`, { userId: userId, maps: updated }).catch((e) => console.log("failed to upload:", e));
      return updated;
    });
  };

  const handleJoinRoom = () => {
    const roomid = roomIdRef.current.value;
    const avatar = getRandomAvatar();
    socket.emit("joinRoom", { userId, roomId: roomid, avatar, username });
  };

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const res = await axios.get(`${BackendUrl}/maps/${userId}`);
        setSpaceMaps(res.data.maps || []);
      } catch (err) {
        console.log("fetching maps failed:", err);
      }
    };
    if (userId) fetchMaps();
  }, [userId]);

  return (
    <div className="fixed bg-black h-screen w-screen relative text-white overflow-y-auto">
      {createSpace && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm px-4 sm:px-6">
          <div className="w-full max-w-3xl rounded-xl bg-[#262626] shadow-2xl p-4 sm:p-6">
            <div className="flex justify-end cursor-pointer" onClick={() => setCreateSpace(false)}>
              <Cancel className="text-gray-300 hover:text-white transition" />
            </div>
            <h1 className="text-center text-xl sm:text-2xl font-bold mb-4">Choose a Map</h1>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <span className="bg-blue-600 px-4 py-1 rounded-full text-sm font-medium text-center sm:text-left">
                All Maps
              </span>
              <div className="relative w-full sm:w-1/3">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <Search />
                </span>
                <input
                  type="text"
                  className="w-full rounded-lg bg-blue-950 pl-10 pr-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Search maps..."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {maps.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleMapClick(image)}
                  className="cursor-pointer group relative rounded-lg overflow-hidden shadow-lg hover:scale-105 transition"
                >
                  <img src={image.imageUrl} alt={`map-${index}`} className="w-full h-40 object-cover" />
                  <div className="absolute bottom-0 left-0 w-full bg-black/50 text-center text-sm py-1 group-hover:bg-blue-700/70">
                    {image.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-4 sm:px-6 py-4 shadow-md">
        <div className="text-xl sm:text-2xl font-bold tracking-wide text-center sm:text-left">My Spaces</div>
  
        <div className="flex flex-col sm:flex-row sm:space-x-4 items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              className="w-full sm:w-52 rounded-lg bg-white border border-blue-700 pl-10 pr-3 py-2 text-sm text-black focus:outline-none"
              placeholder="Search spaces..."
            />
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Search />
            </span>
          </div>
          <button
            onClick={() => setCreateSpace(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-800 rounded-lg hover:border-2 hover:border-blue-500 shadow-sm"
          >
            + Create Space
          </button>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleJoinRoom}
              className="flex-1 sm:flex-none px-4 py-2 bg-green-500 hover:border-2 hover:border-green-600 rounded-lg shadow-sm"
            >
              Join Room
            </button>
            <input
              ref={roomIdRef}
              placeholder="Room ID"
              className="flex-1 sm:flex-none px-3 py-2 rounded-lg text-black focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.isArray(spaceMaps) && spaceMaps.length > 0 ? (
          spaceMaps.map((map, index) => (
            <div
              key={index}
              onClick={() => handleRoomClick(map)}
              className="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:scale-105 transition"
            >
              <img src={map.imageUrl} alt={`map-${index}`} className="w-full h-52 object-cover" />
              <div className="text-center py-2 text-sm">{map.name}</div>
            </div>
          ))
        ) : (
          <div className="text-gray-300 col-span-full text-center">
            No spaces yet. Create or join one!
          </div>
        )}
      </div>
    </div>
  );
}  
