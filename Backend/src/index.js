import express, { json } from "express";
import { userModel } from "./db.js";
import jwt from "jsonwebtoken";
const app = express();
app.use(express.json());
app.post("/signup",async (req,res)=>{
    const email = req.body.email;
    const userId = req.body.userId;
    const avatarId="hi there";
    const currentSpaceId="current space id";
    const user = await  userModel.create({userId:userId,email:email,avatarId:avatarId,currentSpaceId:currentSpaceId});
    if(user){
        res.send({
            message:"signup successfull",
        })
    }
    else {
        res.status(201).send({
            message:"signup failed"
        })
    }
});
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
app.listen(3000,() => {
    console.log("server running on 3000 port");
});
