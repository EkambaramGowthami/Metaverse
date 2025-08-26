import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useEffect, useRef } from "react";
import axios from "axios";
export default function VideoCallPage({ userId,roomId }){
    const containerRef = useRef(null);
    useEffect(()=>{
        // const appId = import.meta.env.APPID;
        const username = "user" + userId;
        const joinMeeting = async ()=>{
            try{
                const res = await axios.post("https://metaverse-3joe.onrender.com/api/token",{userId,roomId});
                const appId = res.data.appId;
                if(res.data?.token){
                    const zp = ZegoUIKitPrebuilt.create(appId,res.data.token,roomId,userId,username);
                    zp.joinRoom({
                        container:containerRef.current,
                        scenario:{
                            mode:ZegoUIKitPrebuilt.Videoconference,
                        }
                    });

                }
            }
            catch(e){
                console.log("error while joining in the meeting:",e);
            }

        }
        joinMeeting();
       

    },[roomId,userId]);
    return <div ref={containerRef}className="w-full h-full"></div>

}