import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import TileMap from "./maps/TileMap";
// import TileMap from './maps/TileMap';


// export default function GameComponent() {
//   const gameRef=useRef(null);
//   useEffect(() => {
//     if(gameRef.current) return;
//     let cursors;
//     let avatar;
//     let speed=5;
//     function preload(){
//       this.load.image("tiles", "/maps/officeMap.jpeg");
//       this.load.tilemapTiledJSON("map", "/maps/CreatedOfficeMap.json");
//       this.load.image("avatar", "/public/openart-d9930d6baef8414ebe3a5126681f019e_raw (1).jpg");
//     }
//     function create() {
//       const map = this.make.tilemap({ key: "map" });
//       const tileset = map.addTilesetImage("officeMap", "tiles"); // "officeMap" must match the name in Tiled
//       const layer = map.createLayer(0, tileset, 0, 0); // Layer index or name
    
//       avatar = this.add.sprite(400, 300, "avatar");
//       avatar.setDepth(1); // Ensure avatar is above the tilemap
    
//       cursors = this.input.keyboard.createCursorKeys();
//     }
    
//     function update(){
//       if(cursors.up.isDown) avatar.y -= speed;
//       if(cursors.down.isDown) avatar.y += speed;
//       if(cursors.left.isDown) avatar.x -= speed;
//       if(cursors.right.isDown) avatar.x += speed;
//     }
//     const config = {
//   type: Phaser.AUTO,
//   width: 800,
//   height: 600,
//   backgroundColor: "#a0d0f0", // Light blue or any color
//   scene: { preload, create, update },
//   parent: "phaser-container"
// };

//     gameRef.current=new Phaser.Game(config);
//     return ()=>{
//       gameRef.current.destroy(true);
//       gameRef.current=null;
//     }


//   },[]);
//   return (
//     <div id='phaser-container'>
//       <TileMap
//         mapUrl="/maps/CreatedOfficeMap.json"
//         tilesetImageUrl="/maps/officeMap.jpeg"
//         tileWidth={64} 
//         tileHeight={64}
//       />
//     </div>
//   );
// }

export default function App() {
  return (
    <div style={{ padding: '20px' }}>
      <TileMap
        mapUrl="/maps/CreatedOfficeMap.json"
        tilesetImageUrl="/maps/officeMap.jpeg"
        avatarImageUrl="/openart-d9930d6baef8414ebe3a5126681f019e_raw.jpg"
        tileWidth={64}
        tileHeight={64}
      />
    </div>
  );
}