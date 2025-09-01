// import { useEffect, useRef, useState } from "react";
// import  Search  from "../../Icons/Search";
// import  Cancel  from "../../Icons/Cancel";
// import axios from "axios";
// import { socket } from "../utils/socket";
// import { useNavigate } from "react-router-dom";

// export default function MyGallery({ players,setPlayers }) {
//   const [roomCreating,setRoomCreating] = useState(false);
//   const [createSpace, setCreateSpace] = useState(false);
//   const selectedMapRef = useRef(null);
//   const [roomId,setRoomId] = useState("");
//   const roomIdRef = useRef(null);
//   const navigate = useNavigate();
//   const userId = localStorage.getItem("userId");
//   const username = localStorage.getItem("username");
//   const [spaceMaps, setSpaceMaps] = useState([]);
//   const BackendUrl = import.meta.env.VITE_BACKEND_URL;

//   const maps = [
//     { id: 1, imageUrl: "/spaceImages/gardenOffice.webp",mapUrl:"/maps/CreatedOfficeMap.json",tilesetImageUrl:"/maps/officeMap.jpeg"},
//     { id: 2, imageUrl: "/spaceImages/smallOffice.png",mapUrl:"/maps/CreatedOfficeMap.json",tilesetImageUrl:"/maps/officeMap.jpeg" },
//     { id: 3, imageUrl: "/spaceImages/tree2.jpeg",mapUrl:"/maps/CreatedOfficeMap.json",tilesetImageUrl:"/maps/officeMap.jpeg" },
//     { id: 4, imageUrl: "/spaceImages/trees.jpeg",mapUrl:"/maps/CreatedOfficeMap.json",tilesetImageUrl:"/maps/officeMap.jpeg" }
//   ];
//   const avatarsImages = [
//     {id:1,imageUrl:"/Characters.jpeg"},
//     {id:2,imageUrl:"/openart-d9930d6baef8414ebe3a5126681f019e_raw (1).jpg" },
//     {id:3,imageUrl:"/Characters (4).jpeg"},
//     {id:4,imageUrl:"/Characters (3).jpeg"}
//   ];
//   function getRandomAvatar(){
//     const randomIndex = Math.floor(Math.random() * avatarsImages.length);
//     return avatarsImages[randomIndex];
//   }
//   const handleRoomClick = (image) => {
//     if (roomCreating) {
//       return;
//     }
//     setRoomCreating(true); 
//     const avatar = getRandomAvatar();
//     selectedMapRef.current = image;
//     console.log("Emitting room:create", { userId, avatar, username });
//     socket.emit("createRoom", { userId, avatar, username });
//   };
 
//   useEffect(() => {
//     const handleRoomCreated = ({ roomId, inviteLink, players }) => {
//       setPlayers(Array.isArray(players) ? players : players.players);
//       // setPlayers(players);
//       localStorage.setItem("selectedMap", JSON.stringify(selectedMapRef.current));
//       navigate(`/space/room/${roomId}`);
//     };
//     const handleRoomJoined = ({ players }) => {
//       setPlayers(players);
//       navigate(`/space/room/${roomId}`);
//     };

//     socket.on("roomCreated", handleRoomCreated);
//     socket.on("roomJoined", handleRoomJoined);
//     socket.on("updatedPositions", (players) => {
//       setPlayers(players);
//     });

//     return () => {
//       socket.off("roomCreated", handleRoomCreated);
//       socket.off("roomJoined", handleRoomJoined);
//       socket.off("updatedPositions");
//     };
//   }, []);
//  const handleMapClick = (map) => {
//     setSpaceMaps((prev) => {
//       if ((prev).find((m) => m.id === map.id)) return prev;
//       const updated = [...prev, map];
//       axios.post(`${BackendUrl}/maps/update`,{
//         userId:userId,
//         maps:updated
//       }).catch((e)=>console.log("failed to upload the data:",e));
//       return updated;
//     });
// }
// const handleJoinRoom = () => {
//   const roomid = roomIdRef.current.value;
//   const avatar = getRandomAvatar();
//   socket.emit("joinRoom", { userId, roomId: roomid, avatar, username });
// };
//   useEffect(() => {
//     const fetchMaps = async () => {
//       try {
//         const res = await axios.get(`${BackendUrl}/${userId}`);
//         setSpaceMaps(res.data.maps || []);
//       } catch (err) {
//         console.log("fetching the maps failed:", err);
//       }
//     };
//     if (userId) {
//       fetchMaps();
//     }
//   }, [userId]);

  
//   const scrollRef = useRef(null);
//   const infiniteMaps = [...maps, ...maps];
//   useEffect(() => {
//     const container = scrollRef.current;
//     if (!container) return;
//     const scrollSteps = 200;
//     const interval = setInterval(() => {
//       if (container) {
//         container.scrollBy({ left: scrollSteps, behavior: "smooth" });
//         if (container.scrollLeft >= container.scrollWidth / 2) {
//           container.scrollTo({ left: 0, behavior: "instant" });
//         }
//       }

//     }, 3000);
//     return () => clearInterval(interval);

//   }, []);
  
//   return (
//     <div className="relative">
//       <div
//         ref={scrollRef}
//         className="flex overflow-x-auto space-x-4 p-4 scrollbar-hidden"
//       >
//         {infiniteMaps.map((image, index) => (
//           <div key={index} className="flex-shrink-0">
//             <img
//               src={image.imageUrl}
//               alt={`map-${index}`}
//               className="rounded-lg md:w-[350px] h-40 object-cover hover:scale-105 transition-transform duration-300"
//             />
//           </div>
//         ))}
//       </div>
//       {
//         createSpace && (
//           <div className="fixed inset-0 bg-black bg-opacity-30 w-screen h-screen bottom-20 flex justify-center items-center z-50">
//             <div className="md:h-[500px] md:w-[800px] bg-white rounded-xl shadow-lg top-24 p-4">
//               <div className="flex justify-end" onClick={() => setCreateSpace(false)}><Cancel /></div>
//               <h1 className="text-center mt-2 text-xl font-semibold text-black">Available Maps</h1>
//               <div className="flex justify-between items-center mt-2">
//                 <div className="bg-green-500 rounded-full md:p-2 md:px-3 sm:p-1 sm:px-2">All</div>
//                 <div className=" relative">
//                   <span className="absolute inset-y-0 left-2 flex items-center text-gray-500"><Search /></span>
//                   <input type="text" className="rounded border left-2 pl-8 pr-2 py-2 w-full text-sm p-1" placeholder="Search Spaces" />
//                 </div>
//               </div>
//               <div className="mt-4 grid md:grid-cols-4 sm:grid-cols-2 gap-3">
//                 {
//                   maps.map((image, index) => (
//                     <div key={index} onClick={()=>handleMapClick(image)}>
//                       <img
//                         src={image.imageUrl}
//                         alt={`map-${index}`}
//                         className="rounded-lg w-full h-36 object-cover"
//                       />

//                     </div>
//                   ))
//                 }


//               </div>

//             </div>
//           </div>
//         )
//       }

//       <div className="mt-6 p-6 flex justify-between">
//         <div className="px-4 py-2 text-sm bg-green-400 rounded-xl text-white">My Spaces</div>
//         <div className="flex space-x-4 items-center">
//           <div className="relative w-64">
//             <span className="absolute inset-y-0 left-2 flex items-center text-gray-500"><Search /></span>
//             <input type="text" className="rounded border left-2 pl-8 pr-2 py-2 w-full text-sm p-1" placeholder="Search Spaces" />
//           </div>
//           <div className="bg-green-400 px-4 py-2 rounded text-white text-md" onClick={() => setCreateSpace(true)}> + Create Space
//           </div>
//           <div className="bg-green-400 px-4 py-2 rounded text-white text-md" onClick={handleJoinRoom}>Join Room</div>
//           <input placeholder="Enter RoomId" className="px-6 py-3 text-black" ref={roomIdRef} />
//         </div>

//       </div>
//       <div className="mt-4 grid md:grid-cols-4 sm:grid-cols-2 gap-6 p-4">
//                 {
//                  Array.isArray(spaceMaps) && spaceMaps.map((map, index) => (
//                     <div key={index} onClick={()=>handleRoomClick(map)}>
//                       <img
//                         src={map.imageUrl}
//                         alt={`map-${index}`}
//                         className="rounded-lg w-full h-36 object-cover"
//                       />

//                     </div>
//                   ))
//                 }


//               </div>


//     </div>

//   );
// };
import { useEffect, useRef, useState } from "react";
import Search from "../../Icons/Search";
import Cancel from "../../Icons/Cancel";
import axios from "axios";
import { socket } from "../utils/socket";
import { useNavigate } from "react-router-dom";

export default function MyGallery({ players, setPlayers }) {
  const [roomCreating, setRoomCreating] = useState(false);
  const [createSpace, setCreateSpace] = useState(false);
  const selectedMapRef = useRef(null);
  const [roomId, setRoomId] = useState("");
  const roomIdRef = useRef(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const [spaceMaps, setSpaceMaps] = useState([]);
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const maps = [
    { id: 1, imageUrl: "/spaceImages/gardenOffice.webp", mapUrl: "/maps/CreatedOfficeMap.json", tilesetImageUrl: "/maps/officeMap.jpeg" },
    { id: 2, imageUrl: "/spaceImages/smallOffice.png", mapUrl: "/maps/CreatedOfficeMap.json", tilesetImageUrl: "/maps/officeMap.jpeg" },
    { id: 3, imageUrl: "/spaceImages/tree2.jpeg", mapUrl: "/maps/CreatedOfficeMap.json", tilesetImageUrl: "/maps/officeMap.jpeg" },
    { id: 4, imageUrl: "/spaceImages/trees.jpeg", mapUrl: "/maps/CreatedOfficeMap.json", tilesetImageUrl: "/maps/officeMap.jpeg" }
  ];

  const avatarsImages = [
    { id: 1, imageUrl: "/Characters.jpeg" },
    { id: 2, imageUrl: "/openart-d9930d6baef8414ebe3a5126681f019e_raw (1).jpg" },
    { id: 3, imageUrl: "/Characters (4).jpeg" },
    { id: 4, imageUrl: "/Characters (3).jpeg" }
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
    socket.emit("createRoom", { userId, avatar, username });
  };

  useEffect(() => {
    const handleRoomCreated = ({ roomId, players }) => {
      setPlayers(Array.isArray(players) ? players : players.players);
      localStorage.setItem("selectedMap", JSON.stringify(selectedMapRef.current));
      navigate(`/space/room/${roomId}`);
    };

    const handleRoomJoined = ({ players }) => {
      setPlayers(players);
      navigate(`/space/room/${roomId}`);
    };

    socket.on("roomCreated", handleRoomCreated);
    socket.on("roomJoined", handleRoomJoined);
    socket.on("updatedPositions", setPlayers);

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
      axios.post(`${BackendUrl}/maps/update`, { userId, maps: updated }).catch((e) => console.log("failed:", e));
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
        const res = await axios.get(`${BackendUrl}/${userId}`);
        setSpaceMaps(res.data.maps || []);
      } catch (err) {
        console.log("fetching maps failed:", err);
      }
    };
    if (userId) fetchMaps();
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
    <div className="relative px-6">
      {/* Carousel */}
      <div ref={scrollRef} className="flex overflow-x-auto space-x-6 p-4 scrollbar-hidden">
        {infiniteMaps.map((image, index) => (
          <div key={index} className="flex-shrink-0">
            <img
              src={image.imageUrl}
              alt={`map-${index}`}
              className="rounded-2xl shadow-md md:w-[350px] h-44 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Modal for Create Space */}
      {createSpace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="md:h-[550px] md:w-[850px] bg-white rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => setCreateSpace(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
            >
              <Cancel />
            </button>

            <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">Choose a Map</h1>

            <div className="flex justify-between items-center mb-6">
              <div className="bg-green-500 text-white rounded-full px-4 py-1 text-sm">All</div>
              <div className="relative w-64">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <Search />
                </span>
                <input
                  type="text"
                  className="rounded-lg border pl-10 pr-3 py-2 w-full text-sm focus:ring-2 focus:ring-green-400"
                  placeholder="Search Spaces"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
              {maps.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleMapClick(image)}
                  className="cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
                >
                  <img src={image.imageUrl} alt={`map-${index}`} className="w-full h-36 object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="px-5 py-2 text-sm bg-green-500 rounded-full text-white shadow">My Spaces</div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Search />
            </span>
            <input
              type="text"
              className="rounded-lg border pl-10 pr-3 py-2 w-full text-sm focus:ring-2 focus:ring-green-400"
              placeholder="Search Spaces"
            />
          </div>
          <button
            className="bg-green-500 px-5 py-2 rounded-lg text-white shadow hover:bg-green-600"
            onClick={() => setCreateSpace(true)}
          >
            + Create Space
          </button>
          <div className="flex items-center gap-2">
            <input
              placeholder="Enter RoomId"
              className="px-4 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-green-400"
              ref={roomIdRef}
            />
            <button
              className="bg-green-500 px-5 py-2 rounded-lg text-white shadow hover:bg-green-600"
              onClick={handleJoinRoom}
            >
              Join Room
            </button>
          </div>
        </div>
      </div>

      {/* Saved Spaces */}
      <div className="mt-6 grid md:grid-cols-4 sm:grid-cols-2 gap-6">
        {Array.isArray(spaceMaps) &&
          spaceMaps.map((map, index) => (
            <div
              key={index}
              onClick={() => handleRoomClick(map)}
              className="cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
            >
              <img src={map.imageUrl} alt={`map-${index}`} className="w-full h-40 object-cover" />
            </div>
          ))}
      </div>
    </div>
  );
}


