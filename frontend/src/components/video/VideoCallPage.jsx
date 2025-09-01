import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function VideoCallPage() {
  const rootRef = useRef(null);

  const getUrlParams = (url) => {
    const urlStr = url.split("?")[1];
    const urlSearchParams = new URLSearchParams(urlStr);
    return Object.fromEntries(urlSearchParams.entries());
  };

  const roomId =
    getUrlParams(window.location.href)["roomId"] ||
    Math.floor(Math.random() * 10000) + "";
  const userId = Math.floor(Math.random() * 10000) + "";
  const username = "userName" + userId;

  useEffect(() => {
    const init = async () => {
      const appId = import.meta.env.VITE_APP_ID;
      const serverSecret = import.meta.env.VITE_SERVER_SECRET;
      console.log("appId:",appId);
      console.log("serverSecret:",serverSecret);

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomId,
        userId,
        username
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

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
      });
    };

    init();
  }, [roomId, userId, username]);

  return (
    <div>
      <div ref={rootRef} style={{ width: "100vw", height: "100vh" }} />
    </div>
  );
}
