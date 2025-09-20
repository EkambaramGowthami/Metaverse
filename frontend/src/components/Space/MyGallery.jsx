import { useEffect, useRef, useState } from "react";
import  Search  from "../../Icons/Search";
import  Cancel  from "../../Icons/Cancel";
import axios from "axios";
import { socket } from "../utils/socket";
import { useNavigate } from "react-router-dom";

export default function MyGallery({ players,setPlayers }) {
  const [roomCreating,setRoomCreating] = useState(false);
  const [createSpace, setCreateSpace] = useState(false);
  // const [mapUrl,setMapUrl] = useState("");
  const mapUrl = useRef(null);
  const tilesetImageUrl = useRef(null);
  // const [tilesetImageUrl,setTilesetImageUrl] = useState("");
  const selectedMapRef = useRef(null);
  const [roomId,setRoomId] = useState("");
  const roomIdRef = useRef(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const [spaceMaps, setSpaceMaps] = useState([]);
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const maps = [
    { id: 1, imageUrl: "/spaceImages/730c3eb3-4fff-4e24-a22e-d71924f030ef.jpeg",mapUrl:"/maps/CreatedOfficeMap.json",tilesetImageUrl:"/maps/officeMap.jpeg",name:"Blue-office"},
    { id: 2, imageUrl: "/spaceImages/WOODEN-OFFICE.jpeg",mapUrl:"/maps/woodenOffice.json",tilesetImageUrl:"/maps/woodenOffice.jpeg",name:"Wooden-office" },
    { id: 3, imageUrl: "/spaceImages/Meeting.png",mapUrl:"/maps/MeetingRoom.json",tilesetImageUrl:"/maps/SmallchatgptImageAgain2 (1).jpg",name:"Meeting-room" }
  ];
  const avatarsImages = [
    {imageUrl:"/avatars/$ limp.png",direction:"down",frame:0},
    {imageUrl:"/avatars/Casual_Modern_Style_Character-removebg-preview.png", direction:"down",frame:0 },
    {imageUrl:"/avatars/Consistent_Style_Character_Variations-removebg-preview.png",direction:"down",frame:0},
    {imageUrl:"/avatars/Elegant_Style_Character-removebg-preview.png",direction:"down",frame:0},
    {imageUrl:"/avatars/Gothic_Style_Character-removebg-preview.png",direction:"down",frame:0},
    // {imageUrl:"/avatars/openart-image_Azyb3ZNm_1757128658690_raw-removebg-preview.png",direction:"down",frame:0},
    // {imageUrl:"/avatars/openart-image_xp3NH8EY_1757128656521_raw-removebg-preview.png",direction:"down",frame:0},
    {imageUrl:"/avatars/Sporty_Style_Character-removebg-preview.png",direction:"down",frame:0},
  ];
  function getRandomAvatar(){
    const randomIndex = Math.floor(Math.random() * avatarsImages.length);
    return avatarsImages[randomIndex];
  }
  const handleRoomClick = (image) => {
    if (roomCreating) {
      return;
    }
    setRoomCreating(true); 
    const avatar = getRandomAvatar();
    selectedMapRef.current = image;
    console.log(image);
    console.log("imageUrl:",image.imageUrl);
    console.log("mapUrl:",image.mapUrl);
    console.log("tilesetImageUrl:",image.tilesetImageUrl);
    mapUrl.current=image.mapUrl;
    tilesetImageUrl.current = image.tilesetImageUrl;
    localStorage.setItem("mapUrl",mapUrl.current);
    localStorage.setItem("tilesetImageUrl",tilesetImageUrl.current);
    console.log(mapUrl.current);
    console.log(tilesetImageUrl.current);
    console.log("Emitting room:create", { userId, avatar, username });
    socket.emit("createRoom", { userId, avatar, username });
  };
  useEffect(() => {
    const handleRoomCreated = ({ roomId, inviteLink, players,avatar }) => {
      setPlayers(Array.isArray(players) ? players : players.players);
      console.log(avatar);
      localStorage.setItem("selectedMap", JSON.stringify(selectedMapRef.current));
      
      navigate(`/space/room/${roomId}`);
    };
    const handleRoomJoined = ({ roomId,players }) => {
      setPlayers(players);
      console.log(players);
      socket.on("updatedPositions", (players) => {
        setPlayers(players);
      });
      navigate(`/space/room/${roomId}`);
    };

    socket.on("roomCreated", handleRoomCreated);
    socket.on("roomJoined", handleRoomJoined);
    socket.on("updatedPositions", (players) => {
      setPlayers(players);
    });

    return () => {
      socket.off("roomCreated", handleRoomCreated);
      socket.off("roomJoined", handleRoomJoined);
      socket.off("updatedPositions");
    };
  }, []);
 const handleMapClick = (map) => {
    setSpaceMaps((prev) => {
      if ((prev).find((m) => m.id === map.id)) return prev;
      const updated = [...prev, map];
      axios.post(`${BackendUrl}/maps/update`,{
        userId:userId,
        maps:updated
      }).catch((e)=>console.log("failed to upload the data:",e));
      return updated;
    });
}
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
        console.log("fetching the maps failed:", err);
      }
    };
    if (userId) {
      fetchMaps();
    }
  }, [userId]);
  
  return (
    <div className="bg-black bg-opacity-90 h-screen w-screen relative">
     {
        createSpace && (
          <div className="fixed inset-0 bg-black bg-opacity-30 w-screen h-screen bottom-20 flex justify-center items-center z-50">
            <div className="md:h-[500px] md:w-[800px] rounded-xl bg-[#262626] shadow-lg top-24 p-4">
              <div className="flex justify-end text-white" onClick={() => setCreateSpace(false)}><Cancel /></div>
              <h1 className="text-center mt-2 text-xl font-semibold text-white">Available Maps</h1>
              <div className="flex justify-between items-center mt-2">
                <div className="bg-green-500 rounded-full md:p-2 md:px-3 sm:p-1 sm:px-2">All</div>
                <div className=" relative">
                  <span className="absolute inset-y-0 left-2 flex items-center text-gray-500"><Search /></span>
                  <input type="text" className="rounded-xl border left-2 pl-8 pr-2 py-2 w-full text-sm p-1" placeholder="Search Spaces" />
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
      <div className="flex justify-between items-center p-2">
        <div className="mt-12 bg-green-400 hover:border hover:border-green-500  text-white px-4 py-2 rounded-xl hover:border hover:border-blue-900">My spaces</div>
        <div className="mt-12 flex space-x-4 items-center">
          <input type="text" className="rounded-lg border left-2 pl-6 py-2" placeholder="Search spaces" />
          <div className="bg-blue-800 hover:border hover:border-blue-900 rounded-xl text-white text-md px-4 py-2 " onClick={() =>setCreateSpace(true)}> + Create space</div>
          <div className="bg-green-400 hover:border border-green-500 rounded-xl text-white text-md px-4 py-2" onClick={handleJoinRoom}>Join Room</div>
          <input placeholder="Enter RoomId" className="px-4 py-2 text-black rounded-xl" ref={roomIdRef} />
        </div>
       </div>
      <div className="mt-4 grid md:grid-cols-4 sm:grid-cols-2 gap-6 p-4">
                {
                 Array.isArray(spaceMaps) && spaceMaps.map((map, index) => (
                    <div key={index} onClick={()=>handleRoomClick(map)}>
                      <img
                        src={map.imageUrl}
                        alt={`map-${index}`}
                        className="rounded-lg w-full h-60 object-cover"
                      />

                    </div>
                  ))
                }


              </div> 


    </div>

  );
};
