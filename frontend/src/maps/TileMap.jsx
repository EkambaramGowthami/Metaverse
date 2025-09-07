import React, { useEffect, useRef, useState } from 'react';
import { socket } from '../components/utils/socket';
import VideoCallPage from '../components/video/VideoCallPage';

export default function TileMap({
  mapUrl,
  tilesetImageUrl,
  tileWidth,
  tileHeight,
  players,
  setPlayers,
  currentUserId,
  roomId,
  
}) {
  const canvasRef = useRef(null);
  const mapDataRef = useRef(null);
  const tilesetImageRef = useRef(null);
  const avatarCacheRef = useRef({});
  const pendingPlayersRef = useRef([]);
  const [videoCall,setVideoCall] = useState(false);
  const [callRoom,setCallRoom] = useState(true);
  const [participants,setParticipants] = useState([]);
  const currentPlayer = players.find(p => p.userId === currentUserId);
  const directionRow = {
    "down": 0,
    "left": 1,
    "right": 2,
    "up": 3
  };
  
  

  useEffect(() => {
    const loadMap = async () => {
      try {
        const res = await fetch(mapUrl);
        const mapData = await res.json();

        const tilesets = await Promise.all(
          mapData.tilesets.map(async ts => {
            if (ts.source) {
              const basePath = mapUrl.substring(0, mapUrl.lastIndexOf('/') + 1);
              const tsRes = await fetch(basePath + ts.source);
              const tsData = await tsRes.json();
              return { ...ts, ...tsData };
            }
            return ts;
          })
        );

        mapData.tilesets = tilesets;
        mapDataRef.current = mapData;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          tilesetImageRef.current = img;
          draw();
          applyPendingPlayers();
        };
        img.src = tilesetImageUrl;
      } catch (err) {
        console.error("Map load failed:", err);
      }
    };

    loadMap();
  }, [mapUrl, tilesetImageUrl]);

  useEffect(() => {
    draw();
  }, [players]);

  useEffect(() => {
    socket.on("updatedPositions", applyPlayers);
    socket.on("roomJoined", ({ roomId,players }) => applyPlayers(players));
    const handleStartCall = ({ roomName, participants }) => {
      setCallRoom(roomName);
      setParticipants(participants);
      console.log("participants:",participants);
      setVideoCall(true);
      alert("Started video call with: " + participants.join(", "));
    };

    socket.on("startVideoCall", handleStartCall);
    socket.on("endVideoCall", () => {
      setCallRoom(null);
      setVideoCall(false);
    });

    return () => {
      socket.off("updatedPositions");
      socket.off("roomJoined");
      socket.off("startVideoCall");
      socket.off("endVideoCall");
    };
  }, []);

  const applyPlayers = (incomingPlayers) => {
    const mapData = mapDataRef.current;
    const layer = mapData?.layers.find(l => l.type === 'tilelayer');
    if (!mapData || !layer) {
      pendingPlayersRef.current = incomingPlayers;
      return;
    }

    const uniquePlayers = [];
    const seen = new Set();

    for (const p of incomingPlayers) {
      if (!seen.has(p.userId)) {
        uniquePlayers.push(p);
        seen.add(p.userId);
      }
    }


    setPlayers(uniquePlayers);
  };

  const applyPendingPlayers = () => {
    if (pendingPlayersRef.current.length === 0) return;
    applyPlayers(pendingPlayersRef.current);
    pendingPlayersRef.current = [];
  };

  const isWalkable = (x, y) => {
    const mapData = mapDataRef.current;
    if (!mapData) return false;
    const col = Math.floor(x / tileWidth);
    const row = Math.floor(y / tileHeight);
    if (col < 0 || col >= mapData.width || row < 0 || row >= mapData.height) return false;
    const layer = mapData.layers.find(l => l.type === 'tilelayer');
    if (!layer) return false;
    const tileIndex = row * mapData.width + col;
    const tileId = layer.data[tileIndex];
    if (tileId === 0) return false; 
    const tileset = mapData.tilesets.slice().reverse().find(ts => tileId >= ts.firstgid);
    if (!tileset) return false;
    const localId = tileId - tileset.firstgid;
    const tileEntry = tileset.tiles?.find(t => t.id === localId);
    if (!tileEntry || !tileEntry.properties) return true;
    const walkableProp = tileEntry.properties.find(p => p.name === 'walkable');
    return walkableProp ? walkableProp.value === true : true;
  };
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      const currentPlayer = players.find(p => p.userId === currentUserId);
      if (!currentPlayer || !mapDataRef.current) return;
      let newX = currentPlayer.x;
      let newY = currentPlayer.y;
      const newavatar = currentPlayer.avatar;
      const directionsMap = {
        ArrowUp:"up",
        ArrowDown:"down",
        ArrowLeft:"left",
        ArrowRight:"right"
      };
      const direction = directionsMap[e.key];
      if (direction === "up") newY -= tileHeight; 
      if (direction === "down") newY += tileHeight;
      if (direction === "left") newX -= tileWidth;
      if (direction === "right") newX += tileWidth;
      if(!isWalkable(newX,newY)) return;
      newavatar.direction=direction;
      newavatar.frame = directionRow[direction];
      setPlayers(prev =>
        prev.map(p =>
          p.userId === currentUserId ? { ...p, x: newX, y: newY ,avatar:newavatar} : p
        )
      );
      socket.emit("move", { roomId, userId: currentUserId,x: newX, y: newY ,avatar:newavatar});
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [players, currentUserId, roomId, tileWidth, tileHeight]);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const mapData = mapDataRef.current;
    const tilesetImage = tilesetImageRef.current;

    if (!canvas || !ctx || !mapData || !tilesetImage || !Array.isArray(players)) return;

    canvas.width = mapData.width * tileWidth;
    canvas.height = mapData.height * tileHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
     mapData.layers.forEach(layer => {
      if (layer.type !== 'tilelayer') return;

      layer.data.forEach((tileId, index) => {
        if (tileId === 0) return;

        const tileset = mapData.tilesets.find(ts =>
          tileId >= ts.firstgid && tileId < ts.firstgid + ts.tilecount
        );
        if (!tileset) return;

        const localId = tileId - tileset.firstgid;
        const cols = Math.floor(tilesetImage.width / tileWidth);
        const sx = (localId % cols) * tileWidth;
        const sy = Math.floor(localId / cols) * tileHeight;
        const dx = (index % mapData.width) * tileWidth;
        const dy = Math.floor(index / mapData.width) * tileHeight;

        ctx.drawImage(tilesetImage, sx, sy, tileWidth, tileHeight, dx, dy, tileWidth, tileHeight);
      });
    });

    players.forEach(p => {
      const avatarUrl = p.avatar?.imageUrl;
      if (!avatarUrl) return;

      if (!avatarCacheRef.current[avatarUrl]) {
        const img = new Image();
        img.src = avatarUrl;
        img.onload = () => {
          avatarCacheRef.current[avatarUrl] = img;
          draw();
        };
        img.onerror = () => {
          console.warn("Failed to load avatar:", avatarUrl);
        };
        return;
      }

      // const avatarImg = avatarCacheRef.current[avatarUrl];
      // if (avatarImg.complete) {
      //   ctx.drawImage(avatarImg, p.x, p.y, tileWidth, tileHeight);

      //   if (p.userId === currentUserId) {
      //     ctx.strokeStyle = "blue";
      //     ctx.lineWidth = 2;
      //     ctx.strokeRect(p.x, p.y, tileWidth, tileHeight);
      //   }

      //   ctx.fillStyle = "black";
      //   ctx.font = "12px Arial";
      //   ctx.fillText(p.username || p.userId, p.x, p.y - 5);
      // }
      const avatarImg = avatarCacheRef.current[avatarUrl];
      if(avatarImg.complete){
        const frameWidth = avatarImg.width/3;
        const frameHeight = avatarImg.height/4;
        const row = directionRow[p.avatar?.direction || "down"];
        const col = p.avatar?.frame;
        const scale=1.5;
        ctx.drawImage(
          avatarImg,
          col * frameWidth, row * frameHeight, frameWidth, frameHeight,
          p.x, p.y, tileWidth*scale, tileHeight *scale
        );
        if(p.userId === currentUserId){
          ctx.font = "bold 20px Arial";
          ctx.fillStyle = "red";
          ctx.fillText(p.username || p.userId,p.x,p.y-5)

        }

      }
    });
  };

  return (
    <div className='relative w-full h-full flex space-x-12 fixed'>
    <canvas
      ref={canvasRef}
      style={{
        border: "2px solid #ccc",
        backgroundColor: "#f0f0f0",
        imageRendering: "pixelated",
        cursor: "crosshair",
        width: "100%",
        height: "100%",
        display: "block",
        position: "relative",
        zIndex: 1
      }}
    />
    {
      videoCall && <div className='absolute md:z-50 z-20 w-12 h-12 md:w-24 md:h-24 bg-green'  style={{
        top: currentPlayer.y * (canvasRef.current?.clientHeight / canvasRef.current?.height || 1),
        left: currentPlayer.x * (canvasRef.current?.clientWidth / canvasRef.current?.width || 1),
        transform: "translate(-50%, -50%)",
      }}><VideoCallPage  roomId={callRoom} username={participants.find(p => p.userId === currentUserId)?.username || currentUserId } setVideoCall={setVideoCall} /></div>
    }
    </div>
  );
}
