import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
console.log("mongoDB url", MONGO_URI);
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error", err));

const animatedAvatarSchema = new mongoose.Schema({
    imageUrl:{type:String},
    direction:{type:String},
    frame:{type:Number}
});

const playerSchema = new mongoose.Schema({
    userId:mongoose.Types.ObjectId,
    username:String,
    socketId:String,
    avatar: animatedAvatarSchema,
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
    selectedSpaceMaps:[{id:Number,imageUrl:String,mapUrl:String,tilesetImageUrl:String,name:String}],
});
const avatarSchema = new mongoose.Schema({
    direction:{type:String},
    frame:{type:Number},
    id:{type:Number,unique:true,required:true},
    imageUrl:{type:String},
    description:{type:String}
});
const messageSchema = new mongoose.Schema({
    roomId:{type:String,index:true},
    userId:{type:String},
    username:{type:String},
    message:{type:String},
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


