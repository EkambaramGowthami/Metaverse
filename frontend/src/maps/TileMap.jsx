// import React, { useEffect, useRef } from 'react';
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3000", {
//   withCredentials: true,
//   transports: ["websocket"]
// });

// const isTileWalkable = (tileId, tilesets) => {
//   for (const tileset of tilesets) {
//     const firstGid = tileset.firstgid;
//     const lastGid = firstGid + tileset.tilecount - 1;
//     if (tileId >= firstGid && tileId <= lastGid) {
//       const localId = tileId - firstGid;
//       const tile = tileset.tiles?.find(t => t.id === localId);
//       return tile?.properties?.some(p => p.name === 'walkable' && p.value === true) ?? false;
//     }
//   }
//   return false;
// };

// const TileMap = ({
//   mapUrl,
//   tilesetImageUrl,
//   tileWidth,
//   tileHeight,
//   players,
//   setPlayers,
//   currentUserId,
//   roomId
// }) => {
//   const canvasRef = useRef(null);
//   const mapDataRef = useRef(null);
//   const tilesetImageRef = useRef(null);
//   const avatarCacheRef = useRef({});
//   const pendingPlayersRef = useRef([]);

//   useEffect(() => {
//     const loadMap = async () => {
//       try {
//         const res = await fetch(mapUrl);
//         const mapData = await res.json();

//         const tilesets = await Promise.all(
//           mapData.tilesets.map(async ts => {
//             if (ts.source) {
//               const basePath = mapUrl.substring(0, mapUrl.lastIndexOf('/') + 1);
//               const tsRes = await fetch(basePath + ts.source);
//               const tsData = await tsRes.json();
//               return { ...ts, ...tsData };
//             }
//             return ts;
//           })
//         );

//         mapData.tilesets = tilesets;
//         mapDataRef.current = mapData;

//         const img = new Image();
//         img.crossOrigin = 'anonymous';
//         img.onload = () => {
//           tilesetImageRef.current = img;
//           draw();
//           applyPendingPlayers();
//         };
//         img.src = tilesetImageUrl;
//       } catch (err) {
//         console.error("Map load failed:", err);
//       }
//     };

//     loadMap();
//   }, [mapUrl, tilesetImageUrl]);

//   useEffect(() => {
//     draw();
//   }, [players]);

//   useEffect(() => {
//     const handleUpdate = (updatedPlayers) => {
//       const mapData = mapDataRef.current;
//       const tilesetImage = tilesetImageRef.current;
//       const layer = mapData?.layers.find(l => l.type === 'tilelayer');

//       if (!mapData || !layer || !tilesetImage) {
//         pendingPlayersRef.current = updatedPlayers;
//         return;
//       }

//       const validPlayers = updatedPlayers.filter(p => {
//         const tileX = Math.floor(p.x / tileWidth);
//         const tileY = Math.floor(p.y / tileHeight);
//         const tileIndex = tileY * mapData.width + tileX;
//         const tileId = layer.data[tileIndex];
//         return isTileWalkable(tileId, mapData.tilesets);
//       });

//       setPlayers(validPlayers);
//     };

//     socket.on("updatedPositions", handleUpdate);
//     return () => socket.off("updatedPositions", handleUpdate);
//   }, [setPlayers, tileWidth, tileHeight]);

//   const applyPendingPlayers = () => {
//     if (pendingPlayersRef.current.length === 0) return;
//     const mapData = mapDataRef.current;
//     const layer = mapData?.layers.find(l => l.type === 'tilelayer');
//     if (!mapData || !layer) return;

//     const validPlayers = pendingPlayersRef.current.filter(p => {
//       const tileX = Math.floor(p.x / tileWidth);
//       const tileY = Math.floor(p.y / tileHeight);
//       const tileIndex = tileY * mapData.width + tileX;
//       const tileId = layer.data[tileIndex];
//       return isTileWalkable(tileId, mapData.tilesets);
//     });

//     setPlayers(validPlayers);
//     pendingPlayersRef.current = [];
//   };

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       const currentPlayer = players.find(p => p.userId === currentUserId);
//       if (!currentPlayer || !mapDataRef.current) return;

//       let newX = currentPlayer.x;
//       let newY = currentPlayer.y;

//       if (e.key === 'ArrowUp') newY -= tileHeight;
//       if (e.key === 'ArrowDown') newY += tileHeight;
//       if (e.key === 'ArrowLeft') newX -= tileWidth;
//       if (e.key === 'ArrowRight') newX += tileWidth;

//       const tileX = Math.floor(newX / tileWidth);
//       const tileY = Math.floor(newY / tileHeight);
//       const layer = mapDataRef.current.layers.find(l => l.type === 'tilelayer');
//       const tileIndex = tileY * mapDataRef.current.width + tileX;
//       const tileId = layer.data[tileIndex];

//       if (!isTileWalkable(tileId, mapDataRef.current.tilesets)) return;

//       setPlayers(prev =>
//         prev.map(p =>
//           p.userId === currentUserId ? { ...p, x: newX, y: newY } : p
//         )
//       );

//       socket.emit("move", { userId: currentUserId, roomId, x: newX, y: newY });
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [players, currentUserId, roomId, tileWidth, tileHeight, setPlayers]);

//   const draw = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     const mapData = mapDataRef.current;
//     const tilesetImage = tilesetImageRef.current;

//     if (!canvas || !ctx || !mapData || !tilesetImage) return;

//     canvas.width = mapData.width * tileWidth;
//     canvas.height = mapData.height * tileHeight;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     mapData.layers.forEach(layer => {
//       if (layer.type !== 'tilelayer') return;

//       layer.data.forEach((tileId, index) => {
//         if (tileId === 0) return;

//         const tileset = mapData.tilesets.find(ts =>
//           tileId >= ts.firstgid && tileId < ts.firstgid + ts.tilecount
//         );
//         if (!tileset) return;

//         const localId = tileId - tileset.firstgid;
//         const cols = Math.floor(tilesetImage.width / tileWidth);
//         const sx = (localId % cols) * tileWidth;
//         const sy = Math.floor(localId / cols) * tileHeight;
//         const dx = (index % mapData.width) * tileWidth;
//         const dy = Math.floor(index / mapData.width) * tileHeight;

//         ctx.drawImage(tilesetImage, sx, sy, tileWidth, tileHeight, dx, dy, tileWidth, tileHeight);
//       });
//     });

//     players.forEach(p => {
//       const avatarUrl = p.avatar?.imageUrl;
//       if (!avatarUrl) return;

//       const tileX = Math.floor(p.x / tileWidth);
//       const tileY = Math.floor(p.y / tileHeight);
//       const layer = mapData.layers.find(l => l.type === 'tilelayer');
//       if (!layer) return;
//        const tileIndex = tileY * mapData.width + tileX;
//       const tileId = layer.data[tileIndex];

//       if (!isTileWalkable(tileId, mapData.tilesets)) return;

//       if (!avatarCacheRef.current[avatarUrl]) {
//         const img = new Image();
//         img.src = avatarUrl;
//         img.onload = () => {
//           avatarCacheRef.current[avatarUrl] = img;
//           draw();
//         };
//         img.onerror = () => {
//           console.warn("Failed to load avatar:", avatarUrl);
//         };
//         return;
//       }

//       const avatarImg = avatarCacheRef.current[avatarUrl];
//       if (avatarImg.complete) {
//         ctx.drawImage(avatarImg, p.x, p.y, tileWidth, tileHeight);

//         if (p.userId === currentUserId) {
//           ctx.strokeStyle = "blue";
//           ctx.lineWidth = 2;
//           ctx.strokeRect(p.x, p.y, tileWidth, tileHeight);
//         }

//         ctx.fillStyle = "black";
//         ctx.font = "12px Arial";
//         ctx.fillText(p.username || p.userId, p.x, p.y - 5);
//       }
//     });
//   };

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{
//         border: "2px solid #ccc",
//         backgroundColor: "#f0f0f0",
//         imageRendering: "pixelated",
//         cursor: "crosshair"
//       }}
//     />
//   );
// };

// export default TileMap;






import React, { useEffect, useRef } from 'react';
import { io } from "socket.io-client";

const socket = io("https://metaverse-3joe.onrender.com", {
  withCredentials: true,
  transports: ["websocket"]
});

const isTileWalkable = (tileId, tilesets) => {
  for (const tileset of tilesets) {
    const firstGid = tileset.firstgid;
    const lastGid = firstGid + tileset.tilecount - 1;
    if (tileId >= firstGid && tileId <= lastGid) {
      const localId = tileId - firstGid;
      const tile = tileset.tiles?.find(t => t.id === localId);
      return tile?.properties?.some(p => p.name === 'walkable' && p.value === true) ?? false;
    }
  }
  return false;
};

export default function TileMap(
  mapUrl,
  tilesetImageUrl,
  tileWidth,
  tileHeight,
  players,
  setPlayers,
  currentUserId,
  roomId
){
  const canvasRef = useRef(null);
  const mapDataRef = useRef(null);
  const tilesetImageRef = useRef(null);
  const avatarCacheRef = useRef({});
  const pendingPlayersRef = useRef([]);

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
    const handleUpdate = (updatedPlayers) => {
      applyPlayers(updatedPlayers);
    };

    socket.on("updatedPositions", handleUpdate);
    return () => socket.off("updatedPositions", handleUpdate);
  }, [tileWidth, tileHeight]);

  useEffect(() => {
    const handleRoomJoined = ({ players: joinedPlayers }) => {
      applyPlayers(joinedPlayers); // ✅ joinedPlayers is already an array
    };

    socket.on("roomJoined", handleRoomJoined);
    return () => socket.off("roomJoined", handleRoomJoined);
  }, [tileWidth, tileHeight]);

  const applyPlayers = (incomingPlayers) => {
    if (!Array.isArray(incomingPlayers)) {
      console.warn("Invalid players data:", incomingPlayers);
      return;
    }

    const mapData = mapDataRef.current;
    const layer = mapData?.layers.find(l => l.type === 'tilelayer');
    if (!mapData || !layer) {
      pendingPlayersRef.current = incomingPlayers;
      return;
    }

    const validPlayers = incomingPlayers.filter(p => {
      const tileX = Math.floor(p.x / tileWidth);
      const tileY = Math.floor(p.y / tileHeight);
      const tileIndex = tileY * mapData.width + tileX;
      const tileId = layer.data[tileIndex];
      return isTileWalkable(tileId, mapData.tilesets);
    });

    setPlayers(validPlayers);
  };

  const applyPendingPlayers = () => {
    if (pendingPlayersRef.current.length === 0) return;
    applyPlayers(pendingPlayersRef.current);
    pendingPlayersRef.current = [];
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const currentPlayer = players.find(p => p.userId === currentUserId);
      if (!currentPlayer || !mapDataRef.current) return;

      let newX = currentPlayer.x;
      let newY = currentPlayer.y;

      if (e.key === 'ArrowUp') newY -= tileHeight;
      if (e.key === 'ArrowDown') newY += tileHeight;
      if (e.key === 'ArrowLeft') newX -= tileWidth;
      if (e.key === 'ArrowRight') newX += tileWidth;

      const tileX = Math.floor(newX / tileWidth);
      const tileY = Math.floor(newY / tileHeight);
      const layer = mapDataRef.current.layers.find(l => l.type === 'tilelayer');
      const tileIndex = tileY * mapDataRef.current.width + tileX;
      const tileId = layer.data[tileIndex];

      if (!isTileWalkable(tileId, mapDataRef.current.tilesets)) return;

      setPlayers(prev =>
        prev.map(p =>
          p.userId === currentUserId ? { ...p, x: newX, y: newY } : p
        )
      );

      socket.emit("move", { userId: currentUserId, roomId, x: newX, y: newY });
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

      const tileX = Math.floor(p.x / tileWidth);
      const tileY = Math.floor(p.y / tileHeight);
      const layer = mapData.layers.find(l => l.type === 'tilelayer');
      if (!layer) return;
      const tileIndex = tileY * mapData.width + tileX;
      const tileId = layer.data[tileIndex];

      if (!isTileWalkable(tileId, mapData.tilesets)) return;

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

      const avatarImg = avatarCacheRef.current[avatarUrl];
      if (avatarImg.complete) {
        ctx.drawImage(avatarImg, p.x, p.y, tileWidth, tileHeight);

        if (p.userId === currentUserId) {
          ctx.strokeStyle = "blue";
          ctx.lineWidth = 2;
          ctx.strokeRect(p.x, p.y, tileWidth, tileHeight);
        }

        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.fillText(p.username || p.userId, p.x, p.y - 5);
      }
    });
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        border: "2px solid #ccc",
        backgroundColor: "#f0f0f0",
        imageRendering: "pixelated",
        cursor: "crosshair"
      }}
    />
  );
};
import React, { useEffect, useRef, useState } from 'react';
import { socket } from '../components/utils/socket';
import VideoCallPage from '../components/video/VideoCallPage';

const isTileWalkable = (tileId, tilesets) => {
  for (const tileset of tilesets) {
    const firstGid = tileset.firstgid;
    const lastGid = firstGid + tileset.tilecount - 1;
    if (tileId >= firstGid && tileId <= lastGid) {
      const localId = tileId - firstGid;
      const tile = tileset.tiles?.find(t => t.id === localId);
      return tile?.properties?.some(p => p.name === 'walkable' && p.value === true) ?? false;
    }
  }
  return false;
};

export default function TileMap({
  mapUrl,
  tilesetImageUrl,
  tileWidth,
  tileHeight,
  players,
  setPlayers,
  currentUserId,
  roomId
}) {
  const canvasRef = useRef(null);
  const mapDataRef = useRef(null);
  const tilesetImageRef = useRef(null);
  const avatarCacheRef = useRef({});
  const pendingPlayersRef = useRef([]);
  const playersRef = useRef(players);
  const hasJoinedRef = useRef(false); 
  const [isInCall, setIsInCall] = useState(false);

  useEffect(() => {
    playersRef.current = players;
  }, [players]);

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
    const handlePlayers = ({ players: updatedPlayers }) => {
      applyPlayers(updatedPlayers);
    };

    socket.on("updatedPositions", handlePlayers);
    return () => socket.off("updatedPositions", handlePlayers);
  }, [tileWidth, tileHeight]);

  useEffect(() => {
    // ✅ Emit joinRoom only once
    if (!hasJoinedRef.current) {
      const alreadyInRoom = players.some(p => p.userId === currentUserId);
      if (!alreadyInRoom) {
        socket.emit("joinRoom", { roomId, userId: currentUserId });
        hasJoinedRef.current = true;
      }
    }
  }, [roomId, currentUserId, players]);

  const applyPlayers = (incomingPlayers) => {
    if (!Array.isArray(incomingPlayers)) return;

    const uniquePlayers = incomingPlayers.filter(
      (p, i, self) => i === self.findIndex(u => u.userId === p.userId)
    );

    const mapData = mapDataRef.current;
    const layer = mapData?.layers.find(l => l.type === 'tilelayer');
    if (!mapData || !layer) {
      pendingPlayersRef.current = incomingPlayers;
      return;
    }

    const validPlayers = uniquePlayers.filter(p => {
      const tileX = Math.floor(p.x / tileWidth);
      const tileY = Math.floor(p.y / tileHeight);
      const tileIndex = tileY * mapData.width + tileX;
      if (tileIndex < 0 || tileIndex >= layer.data.length) return false;
      const tileId = layer.data[tileIndex];
      return isTileWalkable(tileId, mapData.tilesets);
    });

    setPlayers(validPlayers);
  };

  const applyPendingPlayers = () => {
    if (pendingPlayersRef.current.length === 0) return;
    applyPlayers(pendingPlayersRef.current);
    pendingPlayersRef.current = [];
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const currentPlayer = playersRef.current.find(p => p.userId === currentUserId);
      if (!currentPlayer || !mapDataRef.current) return;

      let newX = currentPlayer.x;
      let newY = currentPlayer.y;

      if (e.key === 'ArrowUp') newY -= tileHeight;
      if (e.key === 'ArrowDown') newY += tileHeight;
      if (e.key === 'ArrowLeft') newX -= tileWidth;
      if (e.key === 'ArrowRight') newX += tileWidth;

      const tileX = Math.floor(newX / tileWidth);
      const tileY = Math.floor(newY / tileHeight);
      const layer = mapDataRef.current.layers.find(l => l.type === 'tilelayer');
      const tileIndex = tileY * mapDataRef.current.width + tileX;
      if (tileIndex < 0 || tileIndex >= layer.data.length) return;
      const tileId = layer.data[tileIndex];

      if (!isTileWalkable(tileId, mapDataRef.current.tilesets)) return;

      setPlayers(prev =>
        prev.map(p =>
          p.userId === currentUserId ? { ...p, x: newX, y: newY } : p
        )
      );

      socket.emit("move", { userId: currentUserId, roomId, x: newX, y: newY });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentUserId, roomId, tileWidth, tileHeight]);

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
        return;
      }

      const avatarImg = avatarCacheRef.current[avatarUrl];
      if (avatarImg.complete) {
        ctx.drawImage(avatarImg, p.x, p.y, tileWidth, tileHeight);

        if (p.userId === currentUserId) {
          ctx.strokeStyle = "blue";
          ctx.lineWidth = 2;
          ctx.strokeRect(p.x, p.y, tileWidth, tileHeight);
        }

        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.fillText(p.username || p.userId, p.x, p.y - 5);
      }
    });
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          border: "2px solid #ccc",
          backgroundColor: "#f0f0f0",
          imageRendering: "pixelated",
          cursor: "crosshair"
        }}
      />
      {/* Video call UI can be re-enabled here if needed */}
    </>
  );
}
