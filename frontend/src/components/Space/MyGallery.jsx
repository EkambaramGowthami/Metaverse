import { useEffect, useRef, useState } from "react";
import  Search  from "../../Icons/Search";
import  Cancel  from "../../Icons/Cancel";
import axios from "axios";
import { io } from "socket.io-client";
const socket = io("https://metaverse-3joe.onrender.com", { withCredentials: true ,transports : ["websocket"]});
import { useNavigate } from "react-router-dom";

export default function MyGallery() {
  const [createSpace, setCreateSpace] = useState(false);
  const selectedMapRef = useRef(null);
  const [players,setPlayers] = useState([]);
  const [roomId,setRoomId] = useState("");
  const roomIdRef = useRef(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const [spaceMaps, setSpaceMaps] = useState([]);
  const maps = [
    { id: 1, imageUrl: "/spaceImages/gardenOffice.webp",mapUrl:"/maps/CreatedOfficeMap.json",tilesetImageUrl:"/maps/officeMap.jpeg"},
    { id: 2, imageUrl: "/spaceImages/smallOffice.png",mapUrl:"/maps/CreatedOfficeMap.json",tilesetImageUrl:"/maps/officeMap.jpeg" },
    { id: 3, imageUrl: "/spaceImages/tree2.jpeg",mapUrl:"/maps/CreatedOfficeMap.json",tilesetImageUrl:"/maps/officeMap.jpeg" },
    { id: 4, imageUrl: "/spaceImages/trees.jpeg",mapUrl:"/maps/CreatedOfficeMap.json",tilesetImageUrl:"/maps/officeMap.jpeg" }
  ];
  const avatarsImages = [
    {id:1,imageUrl:"/Characters.jpeg"},
    {id:2,imageUrl:"/openart-d9930d6baef8414ebe3a5126681f019e_raw (1).jpg" },
    {id:3,imageUrl:"/Characters (4).jpeg"},
    {id:4,imageUrl:"/Characters (3).jpeg"}
  ];
  function getRandomAvatar(){
    const randomIndex = Math.floor(Math.random() * avatarsImages.length);
    return avatarsImages[randomIndex];
  }
  const handleRoomClick = (image)=>{
    const avatar = getRandomAvatar();
    selectedMapRef.current = image;
    console.log("Emitting room:create", { userId, avatar, username });
    socket.emit("room:create", { userId, avatar, username });
  }
  useEffect(() => {
    socket.on("room:created", ({ roomId, inviteLink , players }) => {
      setPlayers(Array.isArray(players) ? players : players.players);
      localStorage.setItem("selectedMap", JSON.stringify(selectedMapRef.current));
      // localStorage.setItem("selectedAvatar", JSON.stringify(getRandomAvatar()));
      navigate(`/space/room/${roomId}`);
    });

    // socket.on("roomJoined", ({ players }) => {
    //   const actualPlayers = Array.isArray(players) ? players : players?.players;
    //   if (Array.isArray(actualPlayers)) {
    //     setPlayers(actualPlayers);
    //   } else {
    //     console.warn("Invalid players format received:", players);
    //   }
    // });
    socket.on("room:joined",({ roomId,players,history })=>{
      setPlayers(players);
      navigate(`/space/room/${roomId}`);
    });
    socket.on("room:error",({ message }) => {
      alert(message);
    });
    socket.on("room:players",({ roomId,players}) =>{
      setPlayers(players);
    })
    socket.on("chat:new", (msg) => {
      console.log("New chat:", msg);
    });

    // socket.on("updatedPositions", (updatedPlayers) => {
    //   setPlayers(updatedPlayers);
    //   console.log(updatedPlayers);
    // });
   
    // socket.on("startVideoCall", ({ roomName, participents }) => {
    //   if (participents.includes(userId)) {
    //     alert(`Video call started in ${roomName}`);
    //   }
    // });
    socket.on("call:start", ({ roomId, participants }) => {
      if (participants.includes(userId)) {
        alert(`Video call started in room ${roomId}`);
      }
    });
  
    socket.on("call:end", ({ roomId }) => {
      alert(`Video call ended in ${roomId}`);
    });

    return () => {
      socket.off("room:created");
      socket.off("room:joined");
      socket.off("room:error");
      socket.off("room:players");
      socket.off("chat:new");
      socket.off("call:start");
      socket.off("call:end");
    };
  }, [navigate,userId]);
 const handleMapClick = (map) => {
    setSpaceMaps((prev) => {
      if ((prev).find((m) => m.id === map.id)) return prev;
      const updated = [...prev, map];
      axios.post("https://metaverse-3joe.onrender.com/maps/update",{
        userId:userId,
        maps:updated
      }).catch((e)=>console.log("failed to upload the data:",e));
      return updated;
    });
}
  const handleJoinRoom = () =>{
    const roomid=roomIdRef.current.value;
    const avatar = getRandomAvatar();
    socket.emit("room:join", { userId, roomId:roomid, avatar, username });
    navigate(`/space/room/${roomid}`);
    }
  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const res = await axios.get(`https://metaverse-3joe.onrender.com/maps/${userId}`);
        setSpaceMaps(res.data.maps || []);
      } catch (err) {
        console.log("fetching the maps failed:", err);
      }
    };
    if (userId) {
      fetchMaps();
    }
  }, [userId]);

  
  const scrollRef = useRef(null);
  const infiniteMaps = [...maps, ...maps];
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollSteps = 200;
    const interval = setInterval(() => {
      if (container) {
        container.scrollBy({ left: scrollSteps, behavior: "smooth" });
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollTo({ left: 0, behavior: "instant" });
        }
      }

    }, 3000);
    return () => clearInterval(interval);

  }, []);
  
  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 p-4 scrollbar-hidden"
      >
        {infiniteMaps.map((image, index) => (
          <div key={index} className="flex-shrink-0">
            <img
              src={image.imageUrl}
              alt={`map-${index}`}
              className="rounded-lg md:w-[350px] h-40 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
      {
        createSpace && (
          <div className="fixed inset-0 bg-black bg-opacity-30 w-screen h-screen bottom-20 flex justify-center items-center z-50">
            <div className="md:h-[500px] md:w-[800px] bg-white rounded-xl shadow-lg top-24 p-4">
              <div className="flex justify-end" onClick={() => setCreateSpace(false)}><Cancel /></div>
              <h1 className="text-center mt-2 text-xl font-semibold text-black">Available Maps</h1>
              <div className="flex justify-between items-center mt-2">
                <div className="bg-green-500 rounded-full md:p-2 md:px-3 sm:p-1 sm:px-2">All</div>
                <div className=" relative">
                  <span className="absolute inset-y-0 left-2 flex items-center text-gray-500"><Search /></span>
                  <input type="text" className="rounded border left-2 pl-8 pr-2 py-2 w-full text-sm p-1" placeholder="Search Spaces" />
                </div>
              </div>
              <div className="mt-4 grid md:grid-cols-4 sm:grid-cols-2 gap-3">
                {
                  maps.map((image, index) => (
                    <div key={index} onClick={()=>handleMapClick(image)}>
                      <img
                        src={image.imageUrl}
                        alt={`map-${index}`}
                        className="rounded-lg w-full h-36 object-cover"
                      />

                    </div>
                  ))
                }


              </div>

            </div>
          </div>
        )
      }

      <div className="mt-6 p-6 flex justify-between">
        <div className="px-4 py-2 text-sm bg-green-400 rounded-xl text-white">My Spaces</div>
        <div className="flex space-x-4 items-center">
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-2 flex items-center text-gray-500"><Search /></span>
            <input type="text" className="rounded border left-2 pl-8 pr-2 py-2 w-full text-sm p-1" placeholder="Search Spaces" />
          </div>
          <div className="bg-green-400 px-4 py-2 rounded text-white text-md" onClick={() => setCreateSpace(true)}> + Create Space
          </div>
          <div className="bg-green-400 px-4 py-2 rounded text-white text-md" onClick={handleJoinRoom}>Join Room</div>
          <input placeholder="Enter RoomId" className="px-6 py-3 text-black" ref={roomIdRef} />
        </div>

      </div>
      <div className="mt-4 grid md:grid-cols-4 sm:grid-cols-2 gap-6 p-4">
                {
                 Array.isArray(spaceMaps) && spaceMaps.map((map, index) => (
                    <div key={index} onClick={()=>handleRoomClick(map)}>
                      <img
                        src={map.imageUrl}
                        alt={`map-${index}`}
                        className="rounded-lg w-full h-36 object-cover"
                      />

                    </div>
                  ))
                }


              </div>


    </div>

  );
};
