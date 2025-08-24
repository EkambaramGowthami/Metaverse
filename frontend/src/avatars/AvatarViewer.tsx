// import { useEffect, useRef } from "react";
// import Phaser from "phaser";
// export default function AvatarViewer(){
//   const gameRef=useRef();
//   useEffect(()=>{
//     if(gameRef.current) return;
//     let avatar;
//     let cursors;
//     const speed=5;
//     function preload(){
//       this.load.image("avatar","/public/Characters.jpeg");
//     }
//     function create(){
//       avatar = this.add.sprite(400,300,"avatar");
//       cursors = this.input.keyboard.createCursorKeys();
//     }
//     function update(){
//       if(cursors.up.isDown) avatar.y -= speed;
//       if(cursors.down.isDown) avatar.y += speed;
//       if(cursors.left.isDown) avatar.x -= speed;
//       if(cursors.right.isDown) avatar.x += speed;
//     }
//     const config = {
//       type:Phaser.AUTO,
//       width:window.innerWidth,
//       height:window.innerHeight,
//       scene:{preload,create,update},
//       parent:"phaser-container"
//     }
//     gameRef.current = new Phaser.Game(config);
//     return ()=>{
//       gameRef.current.destroy(true);
//       gameRef.current = null;
//     }

//   },[]);
//   return <div id="phaser-container" className="w-screen h-screen">

//   </div>
// }