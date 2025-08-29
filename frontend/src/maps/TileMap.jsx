import React, { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";
import VideoCallPage from '../components/video/VideoCallPage';

// Connect to backend
const socket = io("https://metaverse-3joe.onrender.com", {
  withCredentials: true,
  transports: ["websocket"]
});

// Utility to check if a tile is walkable
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
) {
  const canvasRef = useRef(null);
  const mapDataRef = useRef(null);
  const tilesetImageRef = useRef(null);
  const avatarCacheRef = useRef({});
  const pendingPlayersRef = useRef([]);
  const [videoCall, setVideoCall] = useState(false);

  // Load map and tileset
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

  // Socket listeners
  useEffect(() => {
    socket.on("updatedPositions", applyPlayers);
    socket.on("roomJoined", ({ players }) => applyPlayers(players));
    socket.on("startVideoCall", ({ roomName, participants }) => {
      console.log("Start video call:", roomName, participants);
      setVideoCall(true);
    });
    socket.on("endVideoCall", () => {
      console.log("Video call ended");
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

  // Handle movement
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

  // Draw map and avatars
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
       <div className="w-full h-full">
      {!videoCall? (
        <div>
         
          <p>TileMap content here...</p>
        </div>
      ) : (
        <VideoCallPage userId={currentUserId} roomId={roomId} />
      )}
    </div>
    </>

  );
}
