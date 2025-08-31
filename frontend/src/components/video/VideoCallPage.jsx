import { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function VideoCallPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    const roomID =
      new URLSearchParams(window.location.search).get("roomID") ||
      String(Math.floor(Math.random() * 10000));
    const userID = String(Math.floor(Math.random() * 10000));
    const userName = "userName" + userID;
    const appID = 1472471415;
    const serverSecret = "82938042ac4a8914744e6de0b58e602d";

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: containerRef.current,
      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
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
  }, []);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
}
