
import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function ZegoVideoConference() {
  const rootRef = useRef(null);
  const Backend_Url = import.meta.env.VITE_BACKEND_URL;
  const userId = `user_${Math.floor(Math.random() * 10000)}`;
  const roomId = `room_${Math.floor(Math.random() * 10000)}`;
  const username ="gowthami";

  useEffect(() => {
    const getUrlParams = (url) => {
      const urlStr = url.split('?')[1];
      const urlSearchParams = new URLSearchParams(urlStr);
      return Object.fromEntries(urlSearchParams.entries());
    };

    const init = async () => {
      // const res = await axios.post(`${Backend_Url}/api/token`, { userId, roomId });
      // console.log(res.data.token);
      // const token = res.data.token;
      const appId = process.env.VITE_APP_ID;
      const serverSecret = process.env.VITE_SERVER_SECRET ;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomId,
        userId,
        username
      );
      console.log("kitToken:",kitToken);
      const zp = ZegoUIKitPrebuilt.create(kitToken);

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
    }
    init();

  }, []);

  return <div>
  <div ref={rootRef} style={{ width: '100vw', height: '100vh' }} >
  Hey babes
  </div>
  </div>;
};


