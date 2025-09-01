import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import  DisplayMap  from './components/DisplayMap';
import  MyGallery  from './components/Space/MyGallery';
import Signup from './components/Auth/Signup';
export default function App() {
  const [players, setPlayers] = useState([]);
    return (
    <BrowserRouter>
    <Routes >
      <Route path="/space" element={<MyGallery players={players} setPlayers={setPlayers} />} />
      <Route path="/space/room/:roomId" element={<DisplayMap  players={players} setPlayers={setPlayers}/>} />
      <Route path="/signup" element={<Signup />} />
      {/* <Route path="/videocall" element={<VideoCallPage />} /> */}
      <Route path="/videocall" element={<h1>Video Call Works</h1>} />
    </Routes>
  </BrowserRouter>

  );
  

}


