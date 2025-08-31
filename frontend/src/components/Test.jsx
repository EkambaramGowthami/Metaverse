import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function Test() {
  const rootRef = useRef(null);
  const userId = `user_${Math.floor(Math.random() * 10000)}`;
  const roomId = `room_${Math.floor(Math.random() * 10000)}`;
  const username = "gowthami";

  useEffect(() => {
    const init = () => {
      const appId = import.meta.env.VITE_APP_ID;
      const serverSecret = import.meta.env.VITE_SERVER_SECRET;

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomId,
        userId,
        username
      );

      console.log("kitToken:", kitToken);

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      if (!zp) {
        console.error("Failed to create Zego instance. Check kitToken and environment variables.");
        return;
      }

      zp.joinRoom({
        container: rootRef.current,
        sharedLinks: [
          {
            name: 'Personal link',
            url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomId}`,
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
        layout: 'Sidebar',
        showLayoutButton: true,
      });
    };

    init();
  }, []);

  return (
    <div ref={rootRef} style={{ width: '100vw', height: '100vh' }}>
      Hey babes
    </div>
  );
}
