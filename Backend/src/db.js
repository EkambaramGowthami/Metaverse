import mongoose from "mongoose";
const uri = "mongodb+srv://username:ZMtJx4JSx*dMa.c@cluster0.cas0l.mongodb.net/metaverse"
mongoose.connect(uri);

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


