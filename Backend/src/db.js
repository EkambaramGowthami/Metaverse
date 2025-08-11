import mongoose from "mongoose";
mongoose.connect("mongodb+srv://username:ZMtJx4JSx*dMa.c@cluster0.cas0l.mongodb.net/metaverse");
const objectId = mongoose.Types.ObjectId;
const userSchema = new mongoose.Schema({
    userId:{type:String,unique:true},
    googleId:{type:String,unique:true},
    email:{type:String,unique:true,required:true},
    avatarId:{type:String},
    currentSpaceId:{type:String}
});
export const userModel = mongoose.model("user",userSchema);


