import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI);
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error", err));


const playerSchema = new mongoose.Schema({
    userId:mongoose.Types.ObjectId,
    username:String,
    socketId:String,
    avatar: Object,
    x : {type:Number,default:0},
    y : {type:Number,default:0},
    isInCall : {type:Boolean,default:false} 
});

const roomSchema = new mongoose.Schema({
    roomId:{type:String,unique:true},
    players:[playerSchema],
    createdAt:{type:Date,default:Date.now()}
})
const avatarData = [
    {id:1,imageUrl:"/public/avatars/_ (1).jpeg",description:"hi there"},
    {id:2,imageUrl:"/public/avatars/Diego.jpeg",description:"hello"},
    {id:3,imageUrl:"/public/avatars/Акира.jpeg",description:"onakkam"}
]
const userSchema = new mongoose.Schema({
    email:{type:String},
    password:{type:String},
    username:{type:String},
    selectedSpaceMaps:[{id:Number,imageUrl:String}]
});
const avatarSchema = new mongoose.Schema({
    id:{type:Number,unique:true,required:true},
    imageUrl:{type:String},
    description:{type:String}
});
const messageSchema = new mongoose.Schema({
    roomId:{type:String,required:true,index:true},
    userId:{type:String,required:true},
    message:{type:String,required:true,trim:true},
    timestamp:{type:Date,default:Date.now()}
    
})
export const messageModel = mongoose.model("message",messageSchema);
export const avatarModel = mongoose.model("avatar",avatarSchema);
export const userModel = mongoose.model("user",userSchema);
export const RoomModel = mongoose.model("room",roomSchema);
// async function sendAvatar(){
//     try{
//         await avatarModel.deleteMany();
//         await avatarModel.insertMany(avatarData);
//         console.log("avatars are inserted successfully");
//     }
//     catch(e){
//         console.error(e);
//     }
// }
// sendAvatar();


