import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import  DisplayMap  from './components/DisplayMap';
import  MyGallery  from './components/Space/MyGallery';
import Signup from './components/Auth/Signup';
import Test from './components/video/Test';
import VideoCallPage from './components/video/VideoCallPage';
export default function App() {
  const [players, setPlayers] = useState([]);
    return (
  <BrowserRouter>
    <Routes>
      <Route path="/space" element={<MyGallery players={players} setPlayers={setPlayers} />} />
      <Route path="/space/room/:roomId" element={<DisplayMap  players={players} setPlayers={setPlayers}/>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/test" element={<Test />} />
      <Route path="/videocall" element={<VideoCallPage />} />
    </Routes>
  </BrowserRouter>

  );
}




