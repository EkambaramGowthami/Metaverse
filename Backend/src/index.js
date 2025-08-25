// import express, { json } from "express";
// import { avatarModel, messageModel, userModel } from "./db.js";
// import jwt from "jsonwebtoken";
// import cors from "cors";
// import http from "http";
// import { Server } from "socket.io";
// import { set } from "mongoose";
// const app = express();
// app.use(express.json());
// const ROOM_LIMIT = 5;
// const PORT = process.env.PORT || 3000;
// app.use(cors({
//     origin: "https://metaverse-5dvvqyz8g-gowthamis-projects-b7f16ceb.vercel.app",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"]
//   }));
// const httpServer = http.createServer(app);
// const io = new Server(httpServer, {
//     cors: {
//       origin: "https://metaverse-5dvvqyz8g-gowthamis-projects-b7f16ceb.vercel.app",
//       credentials: true
//     },
//   });

// const rooms = {};
// app.post("/signup",async (req,res)=>{
//     const email = req.body.email;
//     const password = req.body.password;
//     const username = email.split("@")[0];
//     const selectedSpaceMaps=[];
//     const user = await  userModel.create({email:email,password:password,username:username,selectedSpaceMaps:selectedSpaceMaps});
//     console.log(user._id);
//     console.log(user);
//     if(user){
//         res.send({
//             message:"signup successfull",
//             userId:user._id,
//             username:username
//         })
//     }
//     else {
//         res.status(201).send({
//             message:"signup failed"
//         })
//     }
// });
// app.post("/signup", async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       const username = email.split("@")[0];
//       const existingUser = await userModel.findOne({ email });
//       if (existingUser) return res.status(409).send({ message: "User already exists" });
  
//       const user = await userModel.create({ email, password, username, selectedSpaceMaps: [] });
//       res.send({ message: "signup successful", userId: user._id, username });
//     } catch (err) {
//       console.error(err);
//       res.status(500).send({ message: "signup failed" });
//     }
//   });
  
// app.post("/maps/update",async (req,res) => {
//     const { userId,maps } = req.body;
//     await userModel.findByIdAndUpdate(userId, { selectedSpaceMaps : maps});
//     res.json({ success:true })
// });
// app.get("/maps/:userId",async (req,res) => {
//     try{
//         const user = await userModel.findById(req.params.userId);
//         res.send({ maps : user.selectedSpaceMaps || [] });
//     }
//     catch(err){
//         res.status(500).send({ error: "Failed to fetch maps" });
//     }
    
// })
// app.post("/signin",async (req,res)=>{
//     const email = req.body.email;
//     const user = await userModel.findOne({email:email});
//     if(user){
//         res.send({message:"signin successfull"});
//     }
//     else{
//         res.status(404).send({message:"signin failed"});
//     }

// });
// function createRoomId() {
//     return Math.random().toString(36).slice(2,8);
// }
// function getRoom(roomId) {
//     return rooms[roomId];

// }
// function ensureRoom(roomId) {
//     if(!rooms[roomId]) rooms[roomId] = { players : [] };
//     return rooms[roomId];
// }
// function addPlayerToRoom(roomId,player) {
//     const room = ensureRoom(roomId);
//     if(room.players.find((p) => p.userId === player.userId || p.socketId === player.socketId)){
//         return {ok:true,room,already:true};
//     }
//     if(room.players.length >= ROOM_LIMIT) return {ok:false,reason:"room full"};
//     room.players.push(player);
//     return {ok:true,room};
// }
// function removeSocketIdFromAllRooms(socketId){
//     for(const roomId of Object.keys(rooms)){
//         const room = rooms[roomId];
//         const before = room.players.length;
//         room.players = room.players.filter((p) => p.socketId !== socketId);
//         if(room.players.length !== before){
//             io.to(roomId).emit("room:players",{roomId,players:room.players});
//         }
//     }
// }
// function checkProximityAndTriggerVideoCall(roomId){
//     const room = getRoom(roomId);
//     if(!room || room.players.length < 2) return;
//     const threshold = 50;
//     const clusters = [];
//     const visited = new Set();
//     for(let i=0;i<room.players.length;i++){
//         const p1 = room.players[i];
//         if(visited.has(p1.userId)) continue;
//         const cluster = [p1];
//         visited.add(p1.userId);
//         for(let j=0;j<room.players.length;j++){
//             if(i === j) continue;
//             const p2 = room.players[j];
//             if(visited.has(p2.userId)) continue;
//             const dx = p1.x -p2.x;
//             const dy = p1.y-p2.y;
//             const distance = Math.hypot(dx,dy);
//             if(distance < threshold){
//                 cluster.push(p2);
//                 visited.add(p2.userId);
//             }

//         }
//         if(cluster.length > 1) clusters.push(cluster);
//     }
//     clusters.forEach((group,idx) =>{
//         const existingInCall = group.some((p)=>p.isInCall);
//         if(existingInCall) return;
//         const callRoom = `groupCall-${roomId}-${Date.now()}-${idx}`
//         group.forEach((p) =>{
//             p.isInCall=true,
//             io.to(p.socketId).emit("call:start",{
//                 callRoom,
//                 participants:group.map((p)=>p.userId)
//             })
//         });
//         console.log("Started group video call:", callRoom, group.map((p) => p.userId));
//     })

// }
// // app.post("/avatar/create",async (req,res)=>{
// //     const {id,imageUrl,description} = req.body;
// //     const existingUrl = await avatarModel.findOne({id:id,imageUrl:imageUrl,description});
// //     if(existingUrl){
// //         res.send({message:"avatar already exist"})
// //     }
// //     const newUser = await avatarModel.create({id:id,imageUrl:imageUrl,description});
// //     res.send({
// //         message:"new avatar added",
// //         newUser
// //     })

// // })
// io.on("connection",(socket)=>{
//     console.log("socket id:",socket.id);
    
//     socket.on("room:create",({ userId,avatar,username } )=>{
//         const roomId = Math.random().toString(36).substring(2,6);
//         rooms[roomId] = { players: [ { userId, username, socketId: socket.id, avatar, x: 50, y: 50 } ] };
//         socket.join(roomId);
//         const inviteLink = `https://metaverse-5dvvqyz8g-gowthamis-projects-b7f16ceb.vercel.app/space/room?roomId=${roomId}`;
//         // socket.emit("roomCreated",{roomId,players:rooms[roomId].players,inviteLink});
//         io.to(socket.id).emit("room:created", { roomId,inviteLink, players:rooms[roomId].players });
//          io.to(roomId).emit("room:players",{ roomId,players:rooms[roomId].players});
//         io.to(roomId).emit("message","hello guys");
//         console.log("created a room");

       

//     });
    
    
//     socket.on("room:join", async ({ userId, roomId, avatar, username }) => {
//         const room = rooms[roomId];
//         if (!room) {
//           socket.emit("error", "room not found");
//           console.log("room not found");
//           return;
//         }
      
//         if (room.players.length >= 5) {
//           socket.emit("error", "room full");
//           console.log("room is full");
//           return;
//         }
      
//         const alreadyJoined = room.players.some(p => p.userId === userId || p.socketId === socket.id);
//         if (alreadyJoined) {
//           socket.emit("room:joined", { players: room.players });
//           return;
//         }
      
//         const newPlayer = { userId, username, socketId: socket.id, avatar, x: 0, y: 0 };
//         room.players.push(newPlayer);
//         socket.join(roomId);
      
        
//         io.to(roomId).emit("room:joined", { players: room.players });
//         io.to(roomId).emit("players", room.players);
//       });
      
   
//     // socket.on("room:join",async ({ userId,roomId,avatar,username })=>{
//     //     const room = getRoom(roomId);
//     //     if(!room){
//     //         io.to(socket.id).emit("room:error",{roomId,message:"room not found"});
//     //         return;
//     //     }
//     //     const res = addPlayerToRoom(roomId,{
//     //         userId,
//     //         username,
//     //         socketId:socket.id,
//     //         avatar,
//     //         x:0,
//     //         y:0
//     //     });
//     //     if(!res.ok){
//     //         io.to(socket.id).emit("room:error",{roomId,message:res.reason || "join room failed"});
//     //         return;
//     //     }
//     //     socket.join(roomId);
//     //     let history=[];
//     //     try {
//     //         history = await messageModel.find({ roomId }).sort({ timestamp: -1 }).limit(20).lean();
//     //         history.reverse();
//     //     } catch {}
//     //     io.to(socket.id).emit("room:joined",{roomId,players:res.room.players,history});
//     //     socket.to(roomId).emit("room:players",{roomId,players:res.room.players});
//     // })
//     // socket.on("move", ({ roomId,userId,x,y}) => {
//     //     const room = rooms[roomId];
//     //     if (!room) return;
      
//     //     const player = room.players.find(p => p.userId === userId);
//     //     if (!player) return;
      
//     //     player.x=x;
//     //     player.y=y;
      
//     //     io.to(roomId).emit("updatedPositions", room.players);
//     //     checkProximityAndTriggerVideoCall(roomId);
//     //   });
//     socket.on("player:move",({ roomId,userId,x,y}) => {
//         const room = getRoom(roomId);
//         if(!room) return;
//         const player = room.players.find((p) => p.userId === userId);
//         if(!player) return;

//         player.x = x;
//         player.y = y;
//         io.to(roomId).emit("room:players",{roomId,players:room.players});
//         checkProximityAndTriggerVideoCall(roomId);

//     })
      
//     socket.on("chat",async (roomId,userId,message)=>{
//         const newMsg = await messageModel.create({roomId:roomId,userId:userId,message:message});
//         io.to(roomId).emit("newMessage",{
//             userId,
//             message,
//             timeStamp:newMsg.timestamp
//         })
//     });
//     // socket.on("chat:send", async ({ roomId, userId, message }) => {
//     //     if (!roomId || !userId || !message) return;
//     //     const newMsg = await messageModel.create({ roomId, userId, message });
//     //     io.to(roomId).emit("chat:new", { userId, message, timestamp: newMsg.timestamp });
//     //     });
//     socket.on("endVideoCall",(roomId)=>{
//         const room = rooms[roomId];
//         if(!room) return;
//         room.players.forEach(p => p.isInCall=false);
//     })
//     // socket.on("call:end", ({ roomId }) => {
//     //     const room = getRoom(roomId);
//     //     if (!room) return;
//     //     room.players.forEach((p) => (p.isInCall = false));
//     //     });
//     socket.on("disconnect", () => {
//         for (const roomId in rooms) {
//           const room = rooms[roomId];
//           room.players = room.players.filter(p => p.socketId !== socket.id);
//           io.to(roomId).emit("updatedPositions", room.players);
//         }
//       });
//       socket.on("disconnect", () => {
//         removeSocketIdFromAllRooms(socket.id);
//     });
      
   

// })
// httpServer.listen(PORT, () => {
//     console.log(`server running on port ${PORT}`);
//   });





import express from "express";
import { avatarModel, messageModel, userModel } from "./db.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;



app.use(cors({
    origin: [
      "metaverse-5dvvqyz8g-gowthamis-projects-b7f16ceb.vercel.app",
      "http://localhost:5173"
    ],
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: [
        "metaverse-5dvvqyz8g-gowthamis-projects-b7f16ceb.vercel.app",
        "http://localhost:5173"
      ],
      origin: true,
      credentials: true
    },
  });
const rooms = {};


app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const username = email.split("@")[0];
    const selectedSpaceMaps = [];

    const user = await userModel.create({ email, password, username, selectedSpaceMaps });

    res.send({
      message: "signup successful",
      userId: user._id,
      username
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "signup failed" });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (user) {
      res.send({ message: "signin successful" });
    } else {
      res.status(404).send({ message: "signin failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "signin failed" });
  }
});


app.post("/maps/update", async (req, res) => {
  try {
    const { userId, maps } = req.body;
    await userModel.findByIdAndUpdate(userId, { selectedSpaceMaps: maps });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.get("/maps/:userId", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    res.send({ maps: user?.selectedSpaceMaps || [] });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch maps" });
  }
});


io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  function checkProximityAndTriggerVideoCall(roomId) {
    const room = rooms[roomId];
    if (!room || room.players.length < 2) return;

    const threshold = 50;
    const clusters = [];
    const visited = new Set();

    for (let i = 0; i < room.players.length; i++) {
      const p1 = room.players[i];
      if (visited.has(p1.userId)) continue;

      const cluster = [p1];
      visited.add(p1.userId);

      for (let j = 0; j < room.players.length; j++) {
        if (i === j) continue;
        const p2 = room.players[j];
        if (visited.has(p2.userId)) continue;

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < threshold) {
          cluster.push(p2);
          visited.add(p2.userId);
        }
      }

      if (cluster.length > 1) clusters.push(cluster);
    }

    clusters.forEach((group, index) => {
      if (group.some(p => p.isInCall)) return;

      const roomName = `groupcall-${roomId}-${Date.now()}-${index}`;
      group.forEach(p => {
        p.isInCall = true;
        io.to(p.socketId).emit("startVideoCall", {
          roomName,
          participants: group.map(u => u.userId)
        });
      });

      console.log(`Started group call in ${roomName} for users:`, group.map(p => p.userId));
    });
  }

  socket.on("createRoom", ({ userId, avatar, username }) => {
    const roomId = Math.random().toString(36).substring(2, 6);
    rooms[roomId] = { players: [{ userId, username, socketId: socket.id, avatar, x: 50, y: 50 }] };
    socket.join(roomId);
    const inviteLink = `https://axiona-git-main-gowthamis-projects-b7f16ceb.vercel.app/space/room?roomId=${roomId}`;
    io.to(socket.id).emit("roomCreated", { roomId, players: rooms[roomId].players, inviteLink });
    io.to(roomId).emit("message", "hello guys");
    console.log("Room created:", roomId);
  });

  socket.on("joinRoom", ({ userId, roomId, avatar, username }) => {
    const room = rooms[roomId];
    if (!room) return socket.emit("error", "room not found");
    if (room.players.length >= 5) return socket.emit("error", "room full");

    if (room.players.some(p => p.userId === userId || p.socketId === socket.id)) {
      return socket.emit("roomJoined", {roomId, players: room.players });
    }

    const newPlayer = { userId, username, socketId: socket.id, avatar, x: 0, y: 0 };
    room.players.push(newPlayer);
    socket.join(roomId);

    io.to(roomId).emit("roomJoined", { players: room.players });
    io.to(roomId).emit("updatedPositions", room.players);
  });

  socket.on("move", ({ roomId, userId, x, y }) => {
    const room = rooms[roomId];
    if (!room) return;

    const player = room.players.find(p => p.userId === userId);
    if (!player) return;

    player.x = x;
    player.y = y;

    io.to(roomId).emit("updatedPositions", room.players);
    checkProximityAndTriggerVideoCall(roomId);
  });

  socket.on("chat", async (roomId, userId, message) => {
    const newMsg = await messageModel.create({ roomId, userId, message });
    io.to(roomId).emit("newMessage", {
      userId,
      message,
      timeStamp: newMsg.timestamp
    });
  });

  socket.on("endVideoCall", (roomId) => {
    const room = rooms[roomId];
    if (!room) return;
    room.players.forEach(p => p.isInCall = false);
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      room.players = room.players.filter(p => p.socketId !== socket.id);
      io.to(roomId).emit("updatedPositions", room.players);
    }
  });
});


httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
