import React, { useEffect, useRef, useState } from 'react';

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

const TileMap = ({ mapUrl, tilesetImageUrl, tileWidth, tileHeight, avatarImageUrl }) => {
  const canvasRef = useRef(null);
  const [avatarPos, setAvatarPos] = useState(null);
  const mapDataRef = useRef(null);
  const tilesetImageRef = useRef(null);
  const avatarImageRef = useRef(null);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const response = await fetch(mapUrl);
        const mapData = await response.json();

        
        const tilesets = await Promise.all(
          mapData.tilesets.map(async ts => {
            if (ts.source) {
              try {
                const basePath = mapUrl.substring(0, mapUrl.lastIndexOf('/') + 1);
                const sourcePath = basePath + ts.source;
                const tsResponse = await fetch(sourcePath);
                const tsData = await tsResponse.json();
                return { ...ts, ...tsData };
              } catch (err) {
                console.error(`Failed to load tileset from ${ts.source}`, err);
                return ts;
              }
            }
            return ts;
          })
        );
        
        

        mapData.tilesets = tilesets;
        mapDataRef.current = mapData;

        const tilesetImage = new Image();
        const avatarImage = new Image();

        tilesetImage.crossOrigin = 'anonymous';
        avatarImage.crossOrigin = 'anonymous';

        let loaded = 0;
        const checkLoaded = () => {
          loaded++;
          if (loaded === 2) {
            tilesetImageRef.current = tilesetImage;
            avatarImageRef.current = avatarImage;

            const canvasWidth = mapData.width * tileWidth;
            const canvasHeight = mapData.height * tileHeight;

            const initialX = Math.floor(canvasWidth / 2 - tileWidth / 2);
            const initialY = Math.floor(canvasHeight / 2 - tileHeight / 2);

            setAvatarPos({ x: initialX, y: initialY });
            setTimeout(() => draw(), 0);
          }
        };

        tilesetImage.onload = checkLoaded;
        avatarImage.onload = checkLoaded;

        tilesetImage.src = tilesetImageUrl;
        avatarImage.src = avatarImageUrl;
      } catch (error) {
        console.error('Error loading assets:', error);
      }
    };

    loadAssets();
  }, [mapUrl, tilesetImageUrl, avatarImageUrl, tileWidth, tileHeight]);

  useEffect(() => {
    if (
      mapDataRef.current &&
      tilesetImageRef.current &&
      avatarImageRef.current &&
      avatarPos
    ) {
      draw();
    }
  }, [avatarPos]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!avatarPos || !mapDataRef.current) return;

      const mapData = mapDataRef.current;
      const layer = mapData.layers.find(l => l.type === 'tilelayer');
      if (!layer) return;

      const tiles = layer.data;
      const mapWidth = mapData.width;

      const currentTileX = Math.floor(avatarPos.x / tileWidth);
      const currentTileY = Math.floor(avatarPos.y / tileHeight);

      let targetTileX = currentTileX;
      let targetTileY = currentTileY;

      if (e.key === 'ArrowUp') targetTileY -= 1;
      if (e.key === 'ArrowDown') targetTileY += 1;
      if (e.key === 'ArrowLeft') targetTileX -= 1;
      if (e.key === 'ArrowRight') targetTileX += 1;

      if (
        targetTileX < 0 || targetTileX >= mapData.width ||
        targetTileY < 0 || targetTileY >= mapData.height
      ) return;

      const targetIndex = targetTileY * mapWidth + targetTileX;
      const targetTileId = tiles[targetIndex];

      const walkable = isTileWalkable(targetTileId, mapData.tilesets);

      if (walkable) {
        setAvatarPos({
          x: targetTileX * tileWidth,
          y: targetTileY * tileHeight
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [avatarPos, tileWidth, tileHeight]);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const mapData = mapDataRef.current;
    const tilesetImage = tilesetImageRef.current;
    const avatarImage = avatarImageRef.current;

    if (!canvas || !ctx || !mapData || !tilesetImage || !avatarImage || !avatarPos) return;

    canvas.width = mapData.width * tileWidth;
    canvas.height = mapData.height * tileHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    mapData.layers.forEach(layer => {
      if (layer.type !== 'tilelayer') return;

      layer.data.forEach((tileId, index) => {
        if (tileId === 0) return;

        const tileset = mapData.tilesets.find(ts =>
          ts.tilecount !== undefined &&
          tileId >= ts.firstgid &&
          tileId < ts.firstgid + ts.tilecount
        );

        if (!tileset) return;

        const localId = tileId - tileset.firstgid;
        const tilesetColumns = Math.floor(tilesetImage.width / tileWidth);

        const sx = (localId % tilesetColumns) * tileWidth;
        const sy = Math.floor(localId / tilesetColumns) * tileHeight;
        const dx = (index % mapData.width) * tileWidth;
        const dy = Math.floor(index / mapData.width) * tileHeight;

        ctx.drawImage(
          tilesetImage,
          sx, sy, tileWidth, tileHeight,
          dx, dy, tileWidth, tileHeight
        );
      });
    });

    ctx.drawImage(
      avatarImage,
      avatarPos.x,
      avatarPos.y,
      tileWidth,
      tileHeight
    );
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        border: '1px solid #ccc',
        display: 'block',
        maxWidth: '100%',
      }}
    />
  );
};

export default TileMap;
