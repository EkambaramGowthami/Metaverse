import React, { useEffect, useRef, useState } from "react";

export default function DemoTileMap({
  mapUrl = "/maps/woodenOffice.json",
  tilesetImageUrl = "/maps/woodenOffice.jpeg",
  avatarUrl,
}) {
  const canvasRef = useRef(null);
  const mapDataRef = useRef(null);
  const tilesetImageRef = useRef(null);
  const avatarImgRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState({ x: 64, y: 64, direction: "down" });

  const tileWidth = 64;
  const tileHeight = 64;
  const directionRow = { down: 0, left: 1, right: 2, up: 3 };

  useEffect(() => {
    const loadMap = async () => {
      try {
        const res = await fetch(mapUrl);
        const mapData = await res.json();
        const basePath = mapUrl.substring(0, mapUrl.lastIndexOf("/") + 1);
        const resolvedTilesets = await Promise.all(
          mapData.tilesets.map(async (ts) => {
            if (ts.source) {
              const tsRes = await fetch(basePath + ts.source);
              const tsData = await tsRes.json();
              return { ...ts, ...tsData };
            }
            return ts;
          })
        );
        mapData.tilesets = resolvedTilesets;
        mapDataRef.current = mapData;

        const tilesetImg = new Image();
        tilesetImg.src = tilesetImageUrl;
        tilesetImg.onload = () => {
          tilesetImageRef.current = tilesetImg;

          const avatarImg = new Image();
          avatarImg.src = avatarUrl;
          avatarImg.onload = () => {
            avatarImgRef.current = avatarImg;
            setLoading(false);
            draw();
          };
        };
      } catch (err) {
        console.error("Failed to load map:", err);
        setLoading(false);
      }
    };
    loadMap();
  }, [mapUrl, tilesetImageUrl, avatarUrl]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      setPlayer((prev) => {
        let { x, y } = prev;
        let direction = prev.direction;
        if (e.key === "ArrowUp") {
          y -= tileHeight;
          direction = "up";
        } else if (e.key === "ArrowDown") {
          y += tileHeight;
          direction = "down";
        } else if (e.key === "ArrowLeft") {
          x -= tileWidth;
          direction = "left";
        } else if (e.key === "ArrowRight") {
          x += tileWidth;
          direction = "right";
        }
        return { x, y, direction };
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    draw();
  }, [player]);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const mapData = mapDataRef.current;
    const tilesetImg = tilesetImageRef.current;
    const avatarImg = avatarImgRef.current;
    if (!canvas || !ctx || !mapData || !tilesetImg || !avatarImg) return;

    canvas.width = mapData.width * tileWidth;
    canvas.height = mapData.height * tileHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const layer = mapData.layers.find((l) => l.type === "tilelayer");
    if (!layer || !mapData.tilesets) return;

    layer.data.forEach((tileId, index) => {
      if (!tileId) return;
      const tileset = mapData.tilesets.find(
        (ts) => tileId >= ts.firstgid && tileId < ts.firstgid + ts.tilecount
      );
      if (!tileset) return; // Safeguard for missing tileset

      const localId = tileId - tileset.firstgid;
      const cols = Math.floor(tilesetImg.width / tileWidth);
      const sx = (localId % cols) * tileWidth;
      const sy = Math.floor(localId / cols) * tileHeight;
      const dx = (index % mapData.width) * tileWidth;
      const dy = Math.floor(index / mapData.width) * tileHeight;
      ctx.drawImage(
        tilesetImg,
        sx,
        sy,
        tileWidth,
        tileHeight,
        dx,
        dy,
        tileWidth,
        tileHeight
      );
    });
    const scale = 2;
    const frameWidth = avatarImg.width / 3;
    const frameHeight = avatarImg.height / 4;
    const row = directionRow[player.direction];
    ctx.drawImage(
      avatarImg,
      frameWidth, 
      row * frameHeight,
      frameWidth,
      frameHeight,
      player.x,
      player.y,
      tileWidth * scale,
      tileHeight * scale
    );
  };

  return (
    <div className="relative w-full h-full flex">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          border: "2px solid #ccc",
          backgroundColor: "#f0f0f0",
          imageRendering: "pixelated",
          cursor: "crosshair",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
