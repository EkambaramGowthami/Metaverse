import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function VideoCallPage({ roomId,username,setVideoCall }) {
  const rootRef = useRef(null);

  const getUrlParams = (url) => {
    const urlStr = url.split("?")[1];
    const urlSearchParams = new URLSearchParams(urlStr);
    return Object.fromEntries(urlSearchParams.entries());
  };

  useEffect(() => {
    const init = async () => {
      const appId = Number(1472471415);
      const serverSecret = "82938042ac4a8914744e6de0b58e602d";
      const userId = localStorage.getItem("userId");
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomId,
        userId,
        username
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      if (zp) {
        zp.joinRoom({
          container: rootRef.current,
          sharedLinks: [
            {
              name: "Personal link",
              url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomId=${roomId}`,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: true,
          showTextChat: true,
          showUserList: true,
          maxUsers: 50,
          layout: "Sidebar",
          showLayoutButton: true,
          onLeaveRoom : () =>{
            alert("you left the call");
            setVideoCall(false);
          }
        });
      } else {
        console.error("Failed to create Zego instance. Invalid kitToken.");
      }
    };

    init();
  }, [roomId,username]);

  return <div ref={rootRef} style={{ width: "800px",height: "600px",margin: "0 auto"}}/>;
}
