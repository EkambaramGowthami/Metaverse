import { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function VideoCallPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const roomID =
        new URLSearchParams(window.location.search).get("roomId") ||
        String(Math.floor(Math.random() * 10000));

      const userID = String(Math.floor(Math.random() * 10000));
      const userName = "user_" + userID;
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userID, roomId: roomID }),
        }
      );

      const { token, appId } = await response.json();
      const zp = ZegoUIKitPrebuilt.create(token);

      zp.joinRoom({
        container: containerRef.current,
        sharedLinks: [
          {
            name: "Invite Link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomId=" +
              roomID,
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
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
