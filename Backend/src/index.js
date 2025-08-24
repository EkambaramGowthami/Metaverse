import express, { json } from "express";
import { avatarModel, messageModel, userModel } from "./db.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true
    },
  });

const rooms = {};
app.post("/signup",async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const username = email.split("@")[0];
    const selectedSpaceMaps=[];
    const user = await  userModel.create({email:email,password:password,username:username,selectedSpaceMaps:selectedSpaceMaps});
    console.log(user._id);
    console.log(user);
    if(user){
        res.send({
            message:"signup successfull",
            userId:user._id,
            username:username
        })
    }
    else {
        res.status(201).send({
            message:"signup failed"
        })
    }
});
app.post("/signup", async (req, res) => {
    try {
      const { email, password } = req.body;
      const username = email.split("@")[0];
      const existingUser = await userModel.findOne({ email });
      if (existingUser) return res.status(409).send({ message: "User already exists" });
  
      const user = await userModel.create({ email, password, username, selectedSpaceMaps: [] });
      res.send({ message: "signup successful", userId: user._id, username });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "signup failed" });
    }
  });
  
app.post("/maps/update",async (req,res) => {
    const { userId,maps } = req.body;
    await userModel.findByIdAndUpdate(userId, { selectedSpaceMaps : maps});
    res.json({ success:true })
});
app.get("/maps/:userId",async (req,res) => {
    try{
        const user = await userModel.findById(req.params.userId);
        res.send({ maps : user.selectedSpaceMaps || [] });
    }
    catch(err){
        res.status(500).send({ error: "Failed to fetch maps" });
    }
    
})
app.post("/signin",async (req,res)=>{
    const email = req.body.email;
    const user = await userModel.findOne({email:email});
    if(user){
        res.send({message:"signin successfull"});
    }
    else{
        res.status(404).send({message:"signin failed"});
    }

})
// app.post("/avatar/create",async (req,res)=>{
//     const {id,imageUrl,description} = req.body;
//     const existingUrl = await avatarModel.findOne({id:id,imageUrl:imageUrl,description});
//     if(existingUrl){
//         res.send({message:"avatar already exist"})
//     }
//     const newUser = await avatarModel.create({id:id,imageUrl:imageUrl,description});
//     res.send({
//         message:"new avatar added",
//         newUser
//     })

// })
io.on("connection",(socket)=>{
    console.log("socket id:",socket.id);
    function checkProximityAndTriggerVideoCall(roomId){
        const room = rooms[roomId];
        if(!room || room.players.length < 2) return;
        const threshold = 50;
        let clusters = [];
        let visited = new Set();
        for(let i=0;i<room.players.length;i++){
            const p1 = room.players[i];
            if(visited.has(p1.userId)) continue;
            const cluster = [p1];
            visited.add(p1.userId);
            for(let j=0;j<room.players.length;j++){
                if(i==j) continue;
                const p2 = room.players[j];
                if(visited.has(p2.userId)) continue;
                const dx = p1.x-p2.x;
                const dy = p1.y-p2.y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                if(distance < 50){
                    cluster.push(p2);
                    visited.add(p2.userId);
                }
            }
            if(cluster.length > 1){
                clusters.push(cluster);
            }
        }
        clusters.forEach((group,Index)=>{
            const alreadyInCall = group.some(p => p.isInCall);
            if(alreadyInCall) return;
            const roomName = `groupcall-${roomId}-${Date.now()}-${Index}`;
            group.forEach(p =>{
                p.isInCall = true;
                io.to(p.socketId).emit("startVideoCall",{
                    roomName,
                    participents:group.map(u=>u.userId)
                })

            })
            console.log(`Started group video call in ${roomName} for users:`, group.map(p => p.userId));
        })
    }
    socket.on("createRoom",({ userId,avatar,username } )=>{
        const roomId = Math.random().toString(36).substring(2,6);
        const players={players:[{userId:userId,username:username,socketId:socket.id,avatar:avatar,x:50,y:50}]};
        rooms[roomId] = players;
        socket.join(roomId);
        const inviteLink = `https://metaverse-5dvvqyz8g-gowthamis-projects-b7f16ceb.vercel.app/space/room?roomId=${roomId}`;
        // socket.emit("roomCreated",{roomId,players:rooms[roomId].players,inviteLink});
        io.to(socket.id).emit("roomCreated", { roomId, players });
        io.to(roomId).emit("message","hello guys");
        console.log("created a room");
    });
    socket.on("joinRoom", async ({ userId, roomId, avatar, username }) => {
        const room = rooms[roomId];
        if (!room) {
          socket.emit("error", "room not found");
          return;
        }
      
        if (room.players.length >= 5) {
          socket.emit("error", "room full");
          return;
        }
      
        const alreadyJoined = room.players.some(p => p.userId === userId || p.socketId === socket.id);
        if (alreadyJoined) {
          socket.emit("roomJoined", { players: room.players });
          return;
        }
      
        const newPlayer = { userId, username, socketId: socket.id, avatar, x: 0, y: 0 };
        room.players.push(newPlayer);
        socket.join(roomId);
      
        
        io.to(roomId).emit("roomJoined", { players: room.players });
        io.to(roomId).emit("updatedPositions", room.players);
      });
      
   
    // socket.on("joinRoom",async ({ userId,roomId,avatar,username })=>{
    //     const room =rooms[roomId];
    //     if(!room){
    //         socket.emit("error","room not found");
    //         return;
    //     }
    //     if(room.players.length >= 5){
    //         socket.emit("error","players length is greater than 5");
    //         return;
    //     }
       
    //     const history = await messageModel.find({ roomId }).sort({timestamp:-1}).limit(20).lean();
    //     history.reverse(); 
    //     const alreadyJoined = room.players.some(p => p.userId === userId || p.socketId === socket.id);
    //     if (alreadyJoined) {
    //         console.log(`User ${userId} already in room ${roomId}`);
    //         socket.emit("roomJoined", { roomId, players: room.players ,history});
    //         return;
    //       }
    //     room.players.push({userId:userId,username:username,socketId:socket.id,avatar:avatar,x:0,y:0});
    //     socket.join(roomId);
    //     // socket.emit("roomJoined",{roomId,players:room.players,history});
    //     io.to(roomId).emit("roomJoined", { players: rooms.players });
    //     io.to(roomId).emit("updatedPositions", room.players);
    //     io.to(roomId).emit("message","hello friends");
    //     console.log("joined in the room");
    //     console.log("players:",room.players);
    // });
    socket.on("move", ({ roomId,userId,x,y}) => {
        const room = rooms[roomId];
        if (!room) return;
      
        const player = room.players.find(p => p.userId === userId);
        if (!player) return;
      
        player.x=x;
        player.y=y;
      
        io.to(roomId).emit("updatedPositions", room.players);
        checkProximityAndTriggerVideoCall(roomId);
      });
      
    socket.on("chat",async (roomId,userId,message)=>{
        const newMsg = await messageModel.create({roomId:roomId,userId:userId,message:message});
        io.to(roomId).emit("newMessage",{
            userId,
            message,
            timeStamp:newMsg.timestamp
        })
    });
    socket.on("endVideoCall",(roomId)=>{
        const room = rooms[roomId];
        if(!room) return;
        room.players.forEach(p => p.isInCall=false);
    })
    socket.on("disconnect", () => {
        for (const roomId in rooms) {
          const room = rooms[roomId];
          room.players = room.players.filter(p => p.socketId !== socket.id);
          io.to(roomId).emit("updatedPositions", room.players);
        }
      });
      
   

})
httpServer.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
  


