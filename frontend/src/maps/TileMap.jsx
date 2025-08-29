import React, { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";

const socket = io("https://metaverse-3joe.onrender.com", {
  withCredentials: true,
  transports: ["websocket"]
});

export default function TileMap({
  mapUrl,
  tilesetImageUrl,
  tileWidth,
  tileHeight,
  players,
  setPlayers,
  currentUserId,
  roomId,
  setVideoCall
}) {
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
    socket.on("updatedPositions", applyPlayers);
    socket.on("roomJoined", ({ players }) => applyPlayers(players));
    const handleStartCall = ({ roomName, participants }) => {
      setVideoCall(true);
      alert("Started video call with: " + participants.join(", "));
    };

    socket.on("startVideoCall", handleStartCall);
    socket.on("endVideoCall", () => {
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
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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

    
  </div>
  );
}
