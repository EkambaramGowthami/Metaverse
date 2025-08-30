import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useEffect, useRef } from "react";
import axios from "axios";
export default function VideoCallPage({ userId,roomId,onLeave }){
    const containerRef = useRef(null);
    const BackendUrl = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        const init = async () => {
          const { data } = await axios.get(
            `https://metaverse-3joe.onrender.com/api/token?userId=${userId}}`
          );
          const token = data.token;
          const zp = ZegoUIKitPrebuilt.create(token);
          zp.joinRoom({
            container: containerRef.current,
            sharedLinks: [
              {
                name: "Copy Link",
                url: `${window.location.origin}/room/${roomId}`,
              },
            ],
            scenario: {
              mode: ZegoUIKitPrebuilt.VideoConference,
            },
            turnOnCameraWhenJoining: true,
            turnOnMicrophoneWhenJoining: true,
            showScreenSharingButton: true,
            onLeaveRoom: onLeave,
          });
        };
    
        init();
      }, [roomId, userId, onLeave]);
    return  <div ref={containerRef} style={{ width: "100%", height: "100vh", position: "absolute", top: 0, left: 0, zIndex: 1000 }}
  />

}