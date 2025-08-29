import express from "express";
import { RoomModel, avatarModel, messageModel, userModel } from "./db.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { generateToken04 } from "./utils/token04.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const appId = process.env.APPID;
const serverSecret = process.env.SERVER_SECRET;




app.use(cors({ origin: ["metaverse-5dvvqyz8g-gowthamis-projects-b7f16ceb.vercel.app", "http://localhost:5173"], origin: true, credentials: true, methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] })); const httpServer = http.createServer(app); const io = new Server(httpServer, { cors: { origin: ["metaverse-5dvvqyz8g-gowthamis-projects-b7f16ceb.vercel.app", "http://localhost:5173"], origin: true, credentials: true }, });
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

    async function checkProximityAndTriggerVideoCall(roomId) {
        console.log("checking the Triggercall");
        const room = await RoomModel.findOne({ roomId });
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
        for (const [index, group] of clusters.entries()) {
            if (group.some(p => p.isInCall)) return;
            const roomName = `groupcall-${roomId}-${Date.now()}-${index}`;
            group.forEach(p => (p.isInCall = true));
            await room.save();
            group.forEach(p => {
                io.to(p.socketId).emit("startVideoCall", {
                    roomName,
                    participants: group.map(u => u.userId)
                });
            });
            console.log("Checking proximity for room:", roomId);
            console.log(`Started group call in ${roomName} for users:`, group.map(p => p.userId));
        }
    }

    socket.on("createRoom", async ({ userId, avatar, username }) => {
        const roomId = Math.random().toString(36).substring(2, 6);
        const newRoom = await RoomModel.create({
            roomId,
            players: [{ userId, username, socketId: socket.id, avatar, x: 50, y: 50 }]
        });
        socket.join(roomId);
        const inviteLink = `https://metaverse.../space/room?roomId=${roomId}`;
        io.to(socket.id).emit("roomCreated", { roomId, inviteLink, players: newRoom.players });
        io.to(roomId).emit("message", "hello guys");
        console.log("Room created:", roomId);

    });
    socket.on("joinRoom", async ({ userId, roomId, avatar, username }) => {
        // try {
        //   const room = await RoomModel.findOne({ roomId });
        //   if (!room) {
        //     return socket.emit("error", "room not found");
        //   }

        //   if (room.players.length >= 5) {
        //     return socket.emit("error", "room full");
        //   }

        //   const existingPlayer = room.players.find(p => p.userId === userId);

        //   if (existingPlayer) {
        //     console.log(`User ${userId} already in room ${roomId}, skipping re-join`);

        //     // Optional: update socketId if changed
        //     if (existingPlayer.socketId !== socket.id) {
        //       await RoomModel.updateOne(
        //         { roomId, "players.userId": userId },
        //         { $set: { "players.$.socketId": socket.id } }
        //       );
        //       console.log(`Updated socketId for ${userId}`);
        //     }

        //     socket.join(roomId);
        //     const updatedRoom = await RoomModel.findOne({ roomId });
        //     io.to(roomId).emit("roomJoined", { players: updatedRoom.players });
        //     io.to(roomId).emit("updatedPositions", updatedRoom.players);
        //     return; // ✅ STOP HERE
        //   }

        //   // ✅ Only push if user is truly new
        //   const updatedRoom = await RoomModel.findOneAndUpdate(
        //     { roomId },
        //     {
        //       $push: {
        //         players: {
        //           userId,
        //           username,
        //           socketId: socket.id,
        //           avatar,
        //           x: 0,
        //           y: 0,
        //           isInCall: false
        //         }
        //       }
        //     },
        //     { new: true }
        //   );

        //   socket.join(roomId);
        //   console.log("Room joined:", socket.id);
        //   io.to(roomId).emit("roomJoined", { players: updatedRoom.players });
        //   io.to(roomId).emit("updatedPositions", updatedRoom.players);
        // } catch (err) {
        //   console.error("Error in joinRoom:", err);
        //   socket.emit("error", "Server error while joining room");
        // }
        const room = await RoomModel.findOne({ roomId });
        if (!room) return socket.emit("error", "room not found");
        if (room.players.length >= 5) return socket.emit("error", "room is filled");
        const existingPlayer = room.players.find(p => (p.userId === userId || p.socketId === socket.id));
        if (existingPlayer) {
            return socket.emit("error", "player already present");
        }
        const newPlayer = {
            userId,
            username,
            socketId: socket.id,
            avatar,
            x: 50,
            y: 50
        };
        room.players.push(newPlayer);
        await room.save();
        socket.join(roomId);
        console.log("Room joined:", socket.id);
        io.to(roomId).emit("roomJoined", { players: room.players });
        io.to(roomId).emit("updatedPositions", room.players);

    });

    socket.on("move", async ({ roomId, userId, x, y }) => {
        const room = await RoomModel.findOne({ roomId });
        if (!room) return socket.emit("error", "room not found");
        const player = room.players.find(p => p.userId === userId);
        if (!player) {
            console.warn(`Player ${userId} not found in room ${roomId}`);
            return;
        }

        player.x = x;
        player.y = y;
        await room.save();
        io.to(roomId).emit("updatedPositions", room.players);
        checkProximityAndTriggerVideoCall(roomId);


    });



    socket.on("endVideoCall", async (roomId) => {
        const room = await RoomModel.findOne({ roomId });
        if (!room) return;

        room.players.forEach(p => p.isInCall = false);
        await room.save();

        io.to(roomId).emit("callEnded");
    })
    socket.on("disconnect", async () => {
        const userRooms = await RoomModel.find({ "players.socketId": socket.id });
        for (const room of userRooms) {
            await RoomModel.updateOne(
                { roomId: room.roomId },
                { $pull: { players: { socketId: socket.id } } }
            );
            io.to(room.roomId).emit("updatedPositions", room.players);
        }
    });
});

app.post("/api/token", (req, res) => {
    try {
        const { userId, roomId } = req.body;
        const effectiveTimeInSeconds = 3600;
        const payload = "";
        const token = generateToken04(appId, userId, serverSecret, effectiveTimeInSeconds, roomId);
        res.send({ token, appId });

    }
    catch (err) {
        console.log("error occured while sending the token", err);
        res.status(500).send({ error: "Token generation failed" });
    }


});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
