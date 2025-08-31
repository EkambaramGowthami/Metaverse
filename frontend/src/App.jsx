import React, { useEffect, useRef, useState } from 'react';
import { HashRouter, Route, Routes } from "react-router-dom";
import  DisplayMap  from './components/DisplayMap';
import  MyGallery  from './components/Space/MyGallery';
import Signup from './components/Auth/Signup';
import ZegoVideoConference from './components/video/VideoCallPage';






export default function App() {
  const [players, setPlayers] = useState([]);
    return (
    <HashRouter>
    <Routes >
      <Route path="/space" element={<MyGallery players={players} setPlayers={setPlayers} />} />
      <Route path="/space/room/:roomId" element={<DisplayMap  players={players} setPlayers={setPlayers}/>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/videocall" element={<ZegoVideoConference />} />
       </Routes>
  </HashRouter>

  );
  

}